$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$inputPath = Join-Path -Path $scriptDir -ChildPath "..\dumps\users.csv"
$outputPath = Join-Path -Path $scriptDir -ChildPath "..\dumps\users.redacted.csv"

if (-not (Test-Path $inputPath)) {
    Write-Error "Input file not found: $inputPath"
    exit 1
}

try {
    $csv = Import-Csv -Path $inputPath -ErrorAction Stop
} catch {
    Write-Error "Failed to import CSV: $_"
    exit 1
}

foreach ($row in $csv) {
    if ($row.PSObject.Properties.Match('password')) {
        $row.password = '<REDACTED_HASH>'
    }
}

try {
    $csv | Export-Csv -Path $outputPath -NoTypeInformation -Encoding UTF8 -Force
    Write-Output "Redacted file created: $outputPath"
} catch {
    Write-Error "Failed to write redacted CSV: $_"
    exit 1
}