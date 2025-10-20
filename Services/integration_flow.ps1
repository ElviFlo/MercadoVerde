# Integration flow script: admin login -> create product -> register client -> client login -> add to cart -> create order

$adminCreds = @{ email = 'super@admin.com'; password = 'P4ssw0rd!' } | ConvertTo-Json
$adminResp = Invoke-RestMethod -Method Post -Uri 'http://localhost:3001/auth/login/admin' -Body $adminCreds -ContentType 'application/json'
$adminToken = $adminResp.accessToken
Write-Host "ADMIN TOKEN LENGTH: $($adminToken.Length)"

# Create product
$prod = @{ name = "Integration Product $(Get-Random)"; description = 'Integration test'; price = 9.99; active = $true; stock = 5 } | ConvertTo-Json
$created = Invoke-RestMethod -Method Post -Uri 'http://localhost:3003/products' -Headers @{ Authorization = "Bearer $adminToken" } -Body $prod -ContentType 'application/json'
Write-Host "Created product id: $($created.id)"

# Register client
$client = @{ name = 'integration-client'; email = "client$(Get-Random)@example.com"; password = 'ClientPass123' } | ConvertTo-Json
$reg = Invoke-RestMethod -Method Post -Uri 'http://localhost:3001/auth/register' -Body $client -ContentType 'application/json'
Write-Host "Registered client: $($client)"

# Client login
$clientCreds = @{ email = ($client | ConvertFrom-Json).email; password = 'ClientPass123' } | ConvertTo-Json
$clientLogin = Invoke-RestMethod -Method Post -Uri 'http://localhost:3001/auth/login/client' -Body $clientCreds -ContentType 'application/json'
$clientToken = $clientLogin.accessToken
Write-Host "CLIENT TOKEN LENGTH: $($clientToken.Length)"

# Add to cart
$add = @{ productId = $created.id; quantity = 2 } | ConvertTo-Json
$addResp = Invoke-RestMethod -Method Post -Uri 'http://localhost:3005/cart/items' -Headers @{ Authorization = "Bearer $clientToken" } -Body $add -ContentType 'application/json'
Write-Host "Add to cart response: $($addResp | ConvertTo-Json -Depth 5)"

# Fetch cart items and create order
$cart = Invoke-RestMethod -Method Get -Uri 'http://localhost:3005/cart' -Headers @{ Authorization = "Bearer $clientToken" } -ContentType 'application/json'
$items = $cart.items | ForEach-Object { @{ productId = $_.productId; quantity = $_.quantity } }
$itemsJson = @{ items = $items } | ConvertTo-Json
$orderResp = Invoke-RestMethod -Method Post -Uri 'http://localhost:3002/' -Headers @{ Authorization = "Bearer $clientToken" } -ContentType 'application/json' -Body $itemsJson
Write-Host "Create order response: $($orderResp | ConvertTo-Json -Depth 5)"

# Print final summary
Write-Host "FLOW COMPLETE: productId=$($created.id) clientEmail=$(($client | ConvertFrom-Json).email)"
