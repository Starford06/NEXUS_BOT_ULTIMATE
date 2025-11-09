<#
.SYNOPSIS
PowerShell Controller for PM2-managed Node.js WhatsApp Bot
#>

$ProgramName = "PS-WA-Bot"
# NodeScript now points to the entry file relative to the root, required by PM2
$NodeScript = "src\index.js"
$BotName = "wa-bot"

function Show-Menu {
    Clear-Host
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "   WhatsApp Bot PM2 Controller ($BotName)  " -ForegroundColor White -BackgroundColor DarkBlue
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Status: $(Get-BotStatus)" -ForegroundColor Yellow
    Write-Host "----------------------------------------"
    Write-Host "[S] Start/Restart Bot (Continuous)" -ForegroundColor Green
    Write-Host "[L] View Live Logs (Press Ctrl+C to exit)" -ForegroundColor Cyan
    Write-Host "[K] Stop & Delete Bot Process" -ForegroundColor Red
    Write-Host "[Q] Quit Controller" -ForegroundColor Gray
    Write-Host "----------------------------------------"
    Write-Host "Bot runs continuously in background via PM2." -ForegroundColor Gray
}

function Get-BotStatus {
    try {
        # Check PM2 status for the named process
        $statusJson = pm2 jlist
        $status = $statusJson | ConvertFrom-Json | Where-Object { $_.name -eq $BotName }
    } catch {
        return "PM2 NOT FOUND or UNINITIALIZED"
    }

    if ($status) {
        return "$($status.status.ToUpper()) (Restarts: $($status.pm2_env.restart_time))"
    } else {
        return "STOPPED (Not running)"
    }
}

function Start-Bot {
    Write-Host "Starting or restarting bot via PM2..." -ForegroundColor Green
    
    # Use 'startOrRestart' to handle both cases smoothly
    # --no-daemon: Keep the PM2 command interactive (to show the initial output)
    # --watch: Auto-restart on code changes (ignore data/ to prevent loop)
    # The 'cmd' call ensures PM2 is recognized across different environments
    cmd /c "pm2 start $NodeScript --name $BotName --watch --ignore-watch='data/*' --no-daemon"
    
    Write-Host "Bot sent to background process manager (PM2)." -ForegroundColor Green
    Write-Host "Press [L] to view logs." -ForegroundColor Yellow
    Pause
}

function View-Logs {
    Write-Host "Viewing live logs for $BotName (Press CTRL+C to return to menu)..." -ForegroundColor Cyan
    # -f is for follow, --lines 50 for initial history
    pm2 logs $BotName -f --lines 50
    # Note: CTRL+C here only stops the log viewing, not the bot process.
}

function Stop-Bot {
    Write-Host "Stopping and deleting bot process..." -ForegroundColor Yellow
    # Delete stops the process and removes it from the PM2 list
    pm2 delete $BotName
    Write-Host "Bot process stopped and removed from PM2 list." -ForegroundColor Green
    Pause
}

# --- Main Loop ---
do {
    Show-Menu
    $input = Read-Host "Select Option"
    switch ($input.ToUpper()) {
        'S' { Start-Bot }
        'L' { View-Logs }
        'K' { Stop-Bot }
        'Q' { $running = $false }
        default { Write-Host "Invalid option." -ForegroundColor Red; Pause }
    }
} while ($input.ToUpper() -ne 'Q')

Write-Host "Exiting Controller. The bot remains running in the background if started." -ForegroundColor Cyan