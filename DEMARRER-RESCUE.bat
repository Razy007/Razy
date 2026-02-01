@echo off
REM ============================================
REM RESCUE MODE - LANCEUR RAPIDE
REM ============================================

echo.
echo ================================================
echo    RESCUE MODE - PIONEER ACADEMY VPS
echo ================================================
echo.
echo Ce script va ouvrir tous les fichiers necessaires.
echo.
echo Fichiers a ouvrir :
echo   1. QUICK-START.txt (Guide ultra-rapide)
echo   2. rescue-commands.txt (Commandes a copier/coller)
echo   3. GUIDE-RESCUE-MODE.md (Guide detaille)
echo.
pause

REM Ouvrir le guide rapide
start notepad QUICK-START.txt

REM Attendre 1 seconde
timeout /t 1 /nobreak >nul

REM Ouvrir les commandes
start notepad rescue-commands.txt

REM Attendre 1 seconde
timeout /t 1 /nobreak >nul

REM Ouvrir le guide complet dans le navigateur par défaut
start GUIDE-RESCUE-MODE.md

echo.
echo ================================================
echo    FICHIERS OUVERTS !
echo ================================================
echo.
echo ETAPE 1 : Lisez QUICK-START.txt
echo ETAPE 2 : Allez sur https://console.hetzner.cloud/
echo ETAPE 3 : Activez le Rescue Mode
echo ETAPE 4 : Suivez les instructions !
echo.
echo Bonne chance ! Vous allez y arriver ! ^_^
echo.
pause
