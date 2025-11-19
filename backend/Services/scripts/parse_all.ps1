$files = @(
    '..\seed_data.ps1',
    '..\check_counts.ps1',
    '..\dump_dbs.ps1',
    '..\integration_tests.ps1',
    '..\integration_tests_extended.ps1',
    '..\integration_tests_concurrency.ps1',
    '..\integration_flow.ps1',
    '..\test_login.ps1',
    '..\scripts\redact_users_csv.ps1',
    '..\scripts\parse_ps1_files.ps1'
)

foreach ($rel in $files) {
    $path = Join-Path -Path (Split-Path -Parent $MyInvocation.MyCommand.Path) -ChildPath $rel
    if (-not (Test-Path $path)) { Write-Host "$path -> MISSING" -ForegroundColor Yellow; continue }
    try {
        $raw = Get-Content $path -Raw
        [scriptblock]::Create($raw) | Out-Null
        Write-Host "$path -> PARSE OK" -ForegroundColor Green
    } catch {
        Write-Host "$path -> PARSE FAILED: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "Parse check completed." -ForegroundColor Cyan

exit 0
