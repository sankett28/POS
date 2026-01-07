# PowerShell script to kill all processes on port 8000
Write-Host "Finding processes on port 8000..."
$processes = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique

if ($processes) {
    Write-Host "Found processes: $($processes -join ', ')"
    foreach ($pid in $processes) {
        try {
            Stop-Process -Id $pid -Force -ErrorAction Stop
            Write-Host "Killed process $pid"
        } catch {
            Write-Host "Could not kill process $pid : $_"
        }
    }
} else {
    Write-Host "No processes found on port 8000"
}

Write-Host "Done. You can now restart your backend server."

