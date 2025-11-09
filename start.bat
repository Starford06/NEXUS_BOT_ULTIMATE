@echo off
title NEXUS // SYSTEM BOOT
mode con: cols=80 lines=30
color 03

:: --- BOOT SEQUENCE SIMULATION ---
cls
echo.
echo  [ BIOS ] KERNEL INITIALIZING...
timeout /t 1 >nul
echo  [ BIOS ] CHECKING MEMORY INTEGRITY... OK
timeout /t 1 >nul
echo  [ BIOS ] MOUNTING VIRTUAL DRIVES... OK
timeout /t 1 >nul
cls

color 09
echo.
echo  ----------------------------------------------------------------------
echo   N E X U S   P R O T O C O L   v 2 . 5 . 1
echo  ----------------------------------------------------------------------
echo.
echo  [>] LOADING NEURAL MODULES...
timeout /t 1 >nul
echo      - core.sys ........................ [ OK ]
timeout /t 1 >nul
echo      - crypto.lib ...................... [ OK ]
echo      - whatsapp.net.uplink ............. [ OK ]
timeout /t 2 >nul
cls

:: --- MAIN INTERFACE ---
color 0B
echo.
echo ==============================================================================
echo.
echo    _   _  ________   __  _    _  _____    ____    ____   _______ 
echo   ^| \ ^| ^|/ ____\ \ / / ^| ^|  ^| ^|/ ____^|  ^|  _ \  / __ \ ^|__   __^|
echo   ^|  \^| ^| ^|  __ \ V /  ^| ^|  ^| ^| (___    ^| ^|_) ^|^| ^|  ^| ^|   ^| ^|   
echo   ^| . ` ^| ^| ^|_ ^| ^> ^<   ^| ^|  ^| ^|\___ \   ^|  _ ^< ^| ^|  ^| ^|   ^| ^|   
echo   ^| ^|\  ^| ^|__^| ^|/ . \  ^| ^|__^| ^|____) ^|  ^| ^|_) ^|^| ^|__^| ^|   ^| ^|   
echo   ^|_^| \_^|\_____/_/ \_\  \____/^|_____/   ^|____/  \____/    ^|_^|   
echo.
echo ==============================================================================
echo.
echo    STATUS:       READY FOR UPLINK
echo    SERVER:       ACTIVE
echo    DASHBOARD:    http://localhost:3000
echo.
echo ==============================================================================
echo.
echo  [!] INITIATING FINAL LAUNCH SEQUENCE...
echo  [!] HANDING OFF CONTROL TO NODE.JS KERNEL.
echo.

:: --- LAUNCH BOT ---
:: This color change signals the bot is officially running
color 0A
node src/index.js

:: If node crashes, it pauses here so you can see the error
color 0C
echo.
echo  [ERROR] SYSTEM HALTED UNEXPECTEDLY.
pause