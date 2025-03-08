# Find processes using ports 3000-3003
Write-Host "Finding Next.js servers running on ports 3000-3003..." -ForegroundColor Yellow

$ports = @(3000, 3001, 3002, 3003)
$foundProcesses = @()

foreach ($port in $ports) {
    $processInfo = netstat -ano | Select-String "LISTENING" | Select-String ":$port "
    if ($processInfo) {
        $processId = ($processInfo -split ' ')[-1]
        $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
        if ($process) {
            $foundProcesses += @{
                "Port"        = $port
                "PID"         = $processId
                "ProcessName" = $process.ProcessName
            }
        }
    }
}

if ($foundProcesses.Count -eq 0) {
    Write-Host "No Next.js servers found running on ports 3000-3003." -ForegroundColor Green
    exit
}

# Display found processes
Write-Host "Found $($foundProcesses.Count) processes using Next.js ports:" -ForegroundColor Cyan
foreach ($proc in $foundProcesses) {
    Write-Host "Port $($proc.Port): Process $($proc.ProcessName) (PID: $($proc.PID))" -ForegroundColor White
}

# Confirm before killing
$confirmation = Read-Host "Do you want to kill these processes? (y/n)"
if ($confirmation -ne 'y') {
    Write-Host "Operation cancelled." -ForegroundColor Yellow
    exit
}

# Kill the processes
foreach ($proc in $foundProcesses) {
    Write-Host "Killing process on port $($proc.Port) (PID: $($proc.PID))..." -ForegroundColor Yellow
    Stop-Process -Id $proc.PID -Force
}

Write-Host "All Next.js server processes have been terminated." -ForegroundColor Green
Write-Host "You can now run 'npm run dev' again." -ForegroundColor Cyan
