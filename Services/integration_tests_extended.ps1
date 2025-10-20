# Extended integration tests for MercadoVerde
# Runs health checks, multiple product/client flows and several error scenarios.
# Usage: run from Services folder: .\integration_tests_extended.ps1

function Fail([string]$msg) {
  Write-Host "[FAIL] $msg" -ForegroundColor Red
  exit 1
}
function Warn([string]$msg) { Write-Host "[WARN] $msg" -ForegroundColor Yellow }
function Ok([string]$msg) { Write-Host "[OK]  $msg" -ForegroundColor Green }

function http-post([string]$uri, $body, $token) {
  $headers = @{}
  if ($token) { $headers = @{ Authorization = "Bearer $token" } }
  $json = $body | ConvertTo-Json -Depth 6
  return Invoke-RestMethod -Method Post -Uri $uri -Headers $headers -Body $json -ContentType 'application/json'
}

Write-Host "Starting extended integration tests..." -ForegroundColor Cyan

# Healthchecks
$services = @(
  @{ name = 'auth'; url = 'http://localhost:3001/health' },
  @{ name = 'products'; url = 'http://localhost:3003/health' },
  @{ name = 'orders'; url = 'http://localhost:3002/health' },
  @{ name = 'cart'; url = 'http://localhost:3005/health' },
  @{ name = 'categories'; url = 'http://localhost:3004/health' },
  @{ name = 'voice'; url = 'http://localhost:3006/health' }
)
foreach ($s in $services) {
  try { Invoke-RestMethod -Method Get -Uri $s.url -TimeoutSec 10; Ok "$($s.name) healthy" } catch { Fail "$($s.name) health failed: $($_.Exception.Message)" }
}

# Admin login
Write-Host "\n[STEP] Admin login" -ForegroundColor Cyan
$adminCreds = @{ email = 'super@admin.com'; password = 'P4ssw0rd!' } | ConvertTo-Json
try {
  $adminResp = Invoke-RestMethod -Method Post -Uri 'http://localhost:3001/auth/login/admin' -Body $adminCreds -ContentType 'application/json'
  $adminToken = $adminResp.accessToken
  if (-not $adminToken) { Fail 'Admin token missing' }
  Ok "admin token len=$($adminToken.Length)"
} catch { Fail "admin login failed: $($_.Exception.Message)" }

# Create multiple products
Write-Host "\n[STEP] Create multiple products" -ForegroundColor Cyan
$products = @()
for ($i=1; $i -le 3; $i++) {
  $p = @{ name = "IT MultiProd $i $(Get-Random)"; description = 'multi test'; price = 5.5 * $i; active = $true; stock = 10 } | ConvertTo-Json
  try {
    $created = Invoke-RestMethod -Method Post -Uri 'http://localhost:3003/products' -Headers @{ Authorization = "Bearer $adminToken" } -Body $p -ContentType 'application/json'
    if (-not $created.id) { Fail "create product $i didn't return id" }
    $products += @{ id = $created.id; price = $created.price }
    Ok "created product $($created.id) price=$($created.price)"
  } catch { Fail "create product $i failed: $($_.Exception.Message)" }
}

# Register multiple clients
Write-Host "\n[STEP] Register/login clients" -ForegroundColor Cyan
$clients = @()
for ($c=1; $c -le 2; $c++) {
  $email = "it.client$c$(Get-Random)@example.com"
  $req = @{ name = "it-client-$c"; email = $email; password = 'ClientPass123' } | ConvertTo-Json
  try { Invoke-RestMethod -Method Post -Uri 'http://localhost:3001/auth/register' -Body $req -ContentType 'application/json' | Out-Null; Ok "registered $email" } catch { Fail "register client$c failed: $($_.Exception.Message)" }
  $creds = @{ email = $email; password = 'ClientPass123' } | ConvertTo-Json
  try { $login = Invoke-RestMethod -Method Post -Uri 'http://localhost:3001/auth/login/client' -Body $creds -ContentType 'application/json'; $clients += @{ email = $email; token = $login.accessToken }; Ok "client$c login token len=$($login.accessToken.Length)" } catch { Fail "client$c login failed: $($_.Exception.Message)" }
}

# Client1 adds product 1 & 2
Write-Host "\n[STEP] Clients add items to cart" -ForegroundColor Cyan
$client1 = $clients[0]
$client2 = $clients[1]
try {
  $add1 = @{ productId = $products[0].id; quantity = 1 } | ConvertTo-Json
  $r1 = Invoke-RestMethod -Method Post -Uri 'http://localhost:3005/cart/items' -Headers @{ Authorization = "Bearer $($client1.token)" } -Body $add1 -ContentType 'application/json'
  Ok "client1 added item id=$($r1.id)"
  $add2 = @{ productId = $products[1].id; quantity = 3 } | ConvertTo-Json
  $r2 = Invoke-RestMethod -Method Post -Uri 'http://localhost:3005/cart/items' -Headers @{ Authorization = "Bearer $($client1.token)" } -Body $add2 -ContentType 'application/json'
  Ok "client1 added item id=$($r2.id)"
  $add3 = @{ productId = $products[2].id; quantity = 2 } | ConvertTo-Json
  $r3 = Invoke-RestMethod -Method Post -Uri 'http://localhost:3005/cart/items' -Headers @{ Authorization = "Bearer $($client2.token)" } -Body $add3 -ContentType 'application/json'
  Ok "client2 added item id=$($r3.id)"
} catch { Fail "add to cart failed: $($_.Exception.Message)" }

# Error scenario: client tries to create a product (should be forbidden)
Write-Host "\n[STEP] Error scenario: client creating product (expect failure)" -ForegroundColor Cyan
$badProd = @{ name = 'badProd'; description = 'should fail'; price = 1.23; active = $true; stock = 1 } | ConvertTo-Json
$clientCreateFailed = $false
try {
  $resp = Invoke-RestMethod -Method Post -Uri 'http://localhost:3003/products' -Headers @{ Authorization = "Bearer $($client1.token)" } -Body $badProd -ContentType 'application/json'
  # If it didn't throw, it's a fail
  Fail "Client was able to create product (unexpected): $($resp | ConvertTo-Json -Depth 3)"
} catch {
  Ok "Client product creation rejected as expected: $($_.Exception.Message)"
}

# Error scenario: unauthenticated add to cart (expect failure)
Write-Host "\n[STEP] Error scenario: unauthenticated add to cart (expect failure)" -ForegroundColor Cyan
try {
  $ua = @{ productId = $products[0].id; quantity = 1 } | ConvertTo-Json
  Invoke-RestMethod -Method Post -Uri 'http://localhost:3005/cart/items' -Body $ua -ContentType 'application/json'
  Fail 'Unauthenticated add to cart unexpectedly succeeded'
} catch {
  Ok "Unauthenticated add to cart rejected as expected: $($_.Exception.Message)"
}

# Error scenario: invalid token
Write-Host "\n[STEP] Error scenario: invalid token use (expect failure)" -ForegroundColor Cyan
try {
  $it = @{ productId = $products[0].id; quantity = 1 } | ConvertTo-Json
  Invoke-RestMethod -Method Post -Uri 'http://localhost:3005/cart/items' -Headers @{ Authorization = "Bearer invalid.token.here" } -Body $it -ContentType 'application/json'
  Fail 'Add to cart with invalid token unexpectedly succeeded'
} catch { Ok "Invalid token rejected as expected: $($_.Exception.Message)" }

# Create order for client1 and validate total
Write-Host "\n[STEP] Create order for client1 and assert total" -ForegroundColor Cyan
try {
  $cart1 = Invoke-RestMethod -Method Get -Uri 'http://localhost:3005/cart' -Headers @{ Authorization = "Bearer $($client1.token)" } -ContentType 'application/json'
  $items1 = @($cart1.items | ForEach-Object { @{ productId = $_.productId; quantity = $_.quantity } })
  $body1 = @{ items = $items1 } | ConvertTo-Json -Depth 5
  $order1 = Invoke-RestMethod -Method Post -Uri 'http://localhost:3002/' -Headers @{ Authorization = "Bearer $($client1.token)" } -Body $body1 -ContentType 'application/json'
  if (-not $order1.id) { Fail 'order1 missing id' }
  # compute expected total
  $expected = 0.0
  foreach ($it in $order1.items) { $expected += [double]$it.unitPrice * [int]$it.quantity }
  $orderTotal = [double]$order1.total
  if ([math]::Abs($expected - $orderTotal) -gt 0.001) { Fail "Order total mismatch: expected=$expected actual=$orderTotal" } else { Ok "Order1 created id=$($order1.id) total=$orderTotal (verified)" }
} catch { Fail "Create/verify order1 failed: $($_.Exception.Message)" }

# Error scenario: create order with empty items (expect failure)
Write-Host "\n[STEP] Error: create order with empty items" -ForegroundColor Cyan
try {
  $empty = @{ items = @() } | ConvertTo-Json
  Invoke-RestMethod -Method Post -Uri 'http://localhost:3002/' -Headers @{ Authorization = "Bearer $($client2.token)" } -Body $empty -ContentType 'application/json'
  Fail 'Create order with empty items unexpectedly succeeded'
} catch { Ok "Empty items rejected as expected: $($_.Exception.Message)" }

Write-Host "\nExtended integration tests completed successfully" -ForegroundColor Cyan
exit 0
