$email='demo.user746054934@example.com'
$creds = @{ email=$email; password='ClientPass123' } | ConvertTo-Json
try {
  $r = Invoke-RestMethod -Method Post -Uri 'http://localhost:3001/auth/login/client' -Body $creds -ContentType 'application/json'
  Write-Host (ConvertTo-Json $r -Depth 5)
} catch {
  Write-Host 'Login failed:' $_.Exception.Message
}
