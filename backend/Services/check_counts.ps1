function Invoke-DockerExec([string]$container, [string[]]$arguments) {
  $procArgs = @('exec','-i',$container) + $arguments
  try {
    $out = & docker @procArgs 2>&1
    if ($LASTEXITCODE -ne 0) { Write-Host "[docker exec non-zero exit:$LASTEXITCODE] $container $($arguments -join ' ')" -ForegroundColor Yellow }
    if ($out -is [System.Array]) { $out = $out -join "`n" }
    return ($out).Trim()
  } catch {
    Write-Host "[docker exec failed] $_" -ForegroundColor Red
    return ""
  }
}

$checks = @(
  @{ container='mv_postgres_products'; user='products_user'; db='products_db'; table='Product' },
  @{ container='mv_postgres_auth'; user='auth_user'; db='auth_db'; table='User' },
  @{ container='mv_postgres_orders'; user='orders_user'; db='orders_db'; table='Order' },
  @{ container='mv_postgres_cart'; user='cart_user'; db='cart_db'; table='CartItem' }
)

foreach ($c in $checks) {
  $sql = 'SELECT COUNT(*) FROM "' + $($c.table) + '";'
  # list tables in public schema
  $listSql = "SELECT table_name FROM information_schema.tables WHERE table_schema='public';"
  $tablesRaw = Invoke-DockerExec $c.container @('psql','-U',$c.user,'-d',$c.db,'-t','-c',$listSql)
  Write-Host "Tables in $($c.container):`n$tablesRaw`n"
  # find matching table name (case-insensitive)
  $tbls = ($tablesRaw -split "\n") | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' }
  $match = $tbls | Where-Object { $_.ToLower() -eq $($c.table).ToLower() }
  if (-not $match) { Write-Host "Table $($c.table) not found in $($c.container)" -ForegroundColor Yellow; continue }
  $actual = $match
  $sql2 = 'SELECT COUNT(*) FROM "' + $actual + '";'
  $raw = Invoke-DockerExec $c.container @('psql','-U',$c.user,'-d',$c.db,'-t','-c',$sql2)
  Write-Host "Raw output for $($c.container): '"$raw"'"
  $cnt = ($raw -replace '[^0-9]', '')
  Write-Host ("{0} -> {1}: {2}" -f $c.container, $actual, $cnt)
}
