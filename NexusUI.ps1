<#
.SYNOPSIS
NEXUS HYPER-CONSOLE v3.2 [SAFE MODE - ASCII]
#>

# --- 1. SETUP ---
$Host.UI.RawUI.WindowTitle = "NEXUS // OPERATOR [SAFE MODE]"
try { [Console]::CursorVisible = $false } catch {}

# Cyberpunk Theme Colors
$T = @{
    Accent = "Cyan"; Warn = "Yellow"; Err = "Magenta"; 
    Text = "Gray"; Bright = "White"; Dark = "DarkGray"; Bg = "Black"
}

# --- 2. CORE FUNCTIONS ---
# Standard beep sounds for feedback
function Sound-Boot { [Console]::Beep(500,150); Start-Sleep -m 50; [Console]::Beep(1000,200) }
function Sound-Click { [Console]::Beep(4000, 10) }
function Sound-Enter { [Console]::Beep(1200, 50) }

function Set-Pos ($X, $Y) {
    try { [Console]::SetCursorPosition($X, $Y) } catch {}
}

function Draw-Txt ($X, $Y, $Txt, $Fg=$T.Bright, $Bg=$T.Bg) {
    Set-Pos $X $Y
    Write-Host $Txt -NoNewline -ForegroundColor $Fg -BackgroundColor $Bg
}

# SAFE MODE BOX DRAWING (Uses standard + - | characters)
function Draw-Box ($X, $Y, $W, $H, $Color) {
    $Raw = $Host.UI.RawUI
    $Old = $Raw.ForegroundColor; $Raw.ForegroundColor = $Color
    
    # Top border
    Set-Pos $X $Y; Write-Host ("+" + ("-" * ($W - 2)) + "+") -NoNewline
    # Side borders
    for ($i = 1; $i -lt $H - 1; $i++) {
        Set-Pos $X ($Y + $i); Write-Host "|" -NoNewline
        Set-Pos ($X + $W - 1) ($Y + $i); Write-Host "|" -NoNewline
    }
    # Bottom border
    Set-Pos $X ($Y + $H - 1); Write-Host ("+" + ("-" * ($W - 2)) + "+") -NoNewline
    
    $Raw.ForegroundColor = $Old
}

# SAFE MODE PROGRESS BAR (Uses # and .)
function Draw-Bar ($X, $Y, $W, $Pct, $Color) {
    $Fill = [math]::Floor($W * $Pct)
    $Empty = $W - $Fill
    Set-Pos $X $Y
    Write-Host ("#" * $Fill) -NoNewline -ForegroundColor $Color
    Write-Host ("." * $Empty) -NoNewline -ForegroundColor $T.Dark
}

# --- 3. INTERFACE FRAMES ---
function Draw-MainFrame {
    Clear-Host
    # Outer Frame
    Draw-Box 0 0 78 23 $T.Accent
    Draw-Txt 2 0 "[ NEXUS SAFE_MODE v3.2 ]" $T.Accent
    
    # Top Left: Hardware Stats
    Draw-Box 2 2 36 7 $T.Dark
    Draw-Txt 4 2 " HARDWARE MONITOR " $T.Warn
    
    # Right: Logs
    Draw-Box 40 2 36 19 $T.Dark
    Draw-Txt 42 2 " NEURAL LOG " $T.Warn
    
    # Bottom Left: Menu
    Draw-Box 2 10 36 11 $T.Dark
    Draw-Txt 4 10 " COMMAND OVERRIDE " $T.Accent

    # Footer
    Draw-Txt 2 22 "STATUS:" $T.Dark
    Draw-Txt 10 22 "ONLINE / READY" $T.Accent
}

# --- 4. DYNAMIC UPDATES ---
function Update-View ($MenuSel) {
    # Fake Stats
    $CPU = Get-Random -Min 1 -Max 10
    $RAM = Get-Random -Min 20 -Max 25
    
    Draw-Txt 4 4 "CPU CORE:" $T.Text
    Draw-Bar 15 4 20 ($CPU/100) $T.Accent
    
    Draw-Txt 4 6 "MEM LOAD:" $T.Text
    Draw-Bar 15 6 20 ($RAM/100) $T.Warn
    
    # Live Clock
    Draw-Txt 65 22 (Get-Date -f "HH:mm:ss") $T.Dark

    # Menu Redraw
    $Items = @("LAUNCH BOT", "VIEW DASHBOARD", "KILL PROCESSES", "EXIT NEXUS")
    for ($i=0; $i -lt $Items.Count; $i++) {
        $Pre = if($i -eq $MenuSel) { ">" } else { " " }
        $Col = if($i -eq $MenuSel) { $T.Bright } else { $T.Text }
        Draw-Txt 4 (13+$i) "$Pre $($Items[$i])" $Col
    }
}

# --- 5. MAIN EVENT LOOP ---
Sound-Boot
Draw-MainFrame
$Sel = 0
$Running = $true

while ($Running) {
    while (-not [Console]::KeyAvailable) {
        Update-View $Sel
        Start-Sleep -m 100
    }
    
    $Key = [Console]::ReadKey($true)
    switch ($Key.Key) {
        "UpArrow"   { $Sel = [math]::Max(0, $Sel-1); Sound-Click }
        "DownArrow" { $Sel = [math]::Min(3, $Sel+1); Sound-Click }
        "Enter"     {
            Sound-Enter
            switch ($Sel) {
                0 { # START
                    Draw-Txt 42 4 "> INITIATING STARTUP..." $T.Bright
                    # Start-Process "start.bat" # Uncomment to use
                    Start-Sleep 1
                    Draw-Txt 42 5 "> PROCESS ACTIVE." $T.Accent
                }
                1 { # DASHBOARD
                    Draw-Txt 42 7 "> OPENING SECURE UP-LINK..." $T.Bright
                    Start-Process "http://localhost:3000"
                }
                2 { # KILL
                    Draw-Txt 42 9 "> TERMINATING NODES..." $T.Err
                    Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
                    Draw-Txt 42 10 "> NODES TERMINATED." $T.Warn
                }
                3 { $Running = $false } # EXIT
            }
        }
    }
}
Clear-Host
try { [Console]::CursorVisible = $true } catch {}