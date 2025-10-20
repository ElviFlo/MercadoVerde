# Integration test script for MercadoVerde microservices
# Usage: run from Services folder in PowerShell: .\integration_tests.ps1

function Fail([string]$msg) {
  Write-Host "[FAIL] $msg" -ForegroundColor Red
  exit 1
}

function Ok([string]$msg) {
  Write-Host "[OK]  $msg" -ForegroundColor Green
}

function Check-Health([string]$url, [string]$name) {
  try {
    $r = Invoke-RestMethod -Method Get -Uri $url -TimeoutSec 10
    Ok "$name healthy: $url"
  } catch {
    Fail "$name healthcheck failed: $url -> $($_.Exception.Message)"
  }
}

Write-Host "Starting integration tests..." -ForegroundColor Cyan

# 1) Health checks
$services = @(
  @{ name = 'auth'; url = 'http://localhost:3001/health' },
  @{ name = 'products'; url = 'http://localhost:3003/health' },
  @{ name = 'orders'; url = 'http://localhost:3002/health' },
  @{ name = 'cart'; url = 'http://localhost:3005/health' },
  @{ name = 'categories'; url = 'http://localhost:3004/health' },
  @{ name = 'voice'; url = 'http://localhost:3006/health' }
)

foreach ($s in $services) { Check-Health $s.url $s.name }

# 2) Auth: admin login
Write-Host "\n[STEP] Admin login" -ForegroundColor Cyan
$adminCreds = @{ email = 'super@admin.com'; password = 'P4ssw0rd!' } | ConvertTo-Json
try {
  $adminResp = Invoke-RestMethod -Method Post -Uri 'http://localhost:3001/auth/login/admin' -Body $adminCreds -ContentType 'application/json'
  if (-not $adminResp.accessToken) { Fail 'Admin login did not return accessToken' }
  $adminToken = $adminResp.accessToken
  Ok "Admin login OK (token length $($adminToken.Length))"
} catch {
  Fail "Admin login failed: $($_.Exception.Message)"
}

# 3) Create a product (admin)
Write-Host "\n[STEP] Create product (products service)" -ForegroundColor Cyan
$prodName = "IT Product $(Get-Random)"
$prod = @{ name = $prodName; description = 'Integration test product'; price = 9.99; active = $true; stock = 10 } | ConvertTo-Json
try {
  $created = Invoke-RestMethod -Method Post -Uri 'http://localhost:3003/products' -Headers @{ Authorization = "Bearer $adminToken" } -Body $prod -ContentType 'application/json'
  if (-not $created.id) { Fail 'Create product did not return id' }
  $productId = $created.id
  Ok "Product created id=$productId"
} catch {
  Fail "Create product failed: $($_.Exception.Message)"
}

# 4) Register and login client
Write-Host "\n[STEP] Register and login client (auth)" -ForegroundColor Cyan
$clientEmail = "it.client$(Get-Random)@example.com"
$clientReq = @{ name = 'it-client'; email = $clientEmail; password = 'ClientPass123' } | ConvertTo-Json
try {
  Invoke-RestMethod -Method Post -Uri 'http://localhost:3001/auth/register' -Body $clientReq -ContentType 'application/json' | Out-Null
  Ok "Client registered: $clientEmail"
} catch {
  Fail "Client register failed: $($_.Exception.Message)"
}
$clientCreds = @{ email = $clientEmail; password = 'ClientPass123' } | ConvertTo-Json
try {
  $clientLogin = Invoke-RestMethod -Method Post -Uri 'http://localhost:3001/auth/login/client' -Body $clientCreds -ContentType 'application/json'
  if (-not $clientLogin.accessToken) { Fail 'Client login did not return accessToken' }
  $clientToken = $clientLogin.accessToken
  Ok "Client login OK (token length $($clientToken.Length))"
} catch {
  Fail "Client login failed: $($_.Exception.Message)"
}

# 5) Add to cart
Write-Host "\n[STEP] Add product to cart (cart)" -ForegroundColor Cyan
$addBody = @{ productId = $productId; quantity = 2 } | ConvertTo-Json
try {
  $addResp = Invoke-RestMethod -Method Post -Uri 'http://localhost:3005/cart/items' -Headers @{ Authorization = "Bearer $clientToken" } -Body $addBody -ContentType 'application/json'
  if (-not $addResp.id) { Fail 'Add to cart did not return id' }
  Ok "Added to cart id=$($addResp.id) userId=$($addResp.userId)"
} catch {
  Fail "Add to cart failed: $($_.Exception.Message)"
}

# 6) Get cart and build order payload
Write-Host "\n[STEP] Create order from cart (orders)" -ForegroundColor Cyan
try {
  $cart = Invoke-RestMethod -Method Get -Uri 'http://localhost:3005/cart' -Headers @{ Authorization = "Bearer $clientToken" } -ContentType 'application/json'
  $items = @($cart.items | ForEach-Object { @{ productId = $_.productId; quantity = $_.quantity } })
  if ($items.Count -eq 0) { Fail 'Cart is empty, nothing to order' }
  $bodyJson = @{ items = $items } | ConvertTo-Json -Depth 5
  Write-Host "Order payload:`n$bodyJson"
  $orderResp = Invoke-RestMethod -Method Post -Uri 'http://localhost:3002/' -Headers @{ Authorization = "Bearer $clientToken" } -Body $bodyJson -ContentType 'application/json'
  if (-not $orderResp.id) { Fail 'Create order did not return id' }
  Ok "Order created id=$($orderResp.id) total=$($orderResp.total)"
} catch {
  Fail "Create order failed: $($_.Exception.Message)"
}

Write-Host "\nIntegration tests completed successfully" -ForegroundColor Cyan
exit 0
