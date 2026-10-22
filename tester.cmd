@echo off
rem Roule tout le banc d'essai : double-clic, ou « tester » dans un terminal ouvert dans ce dossier.
rem Trouve Node.js même s'il est installé sans droits d'administrateur dans %USERPROFILE%\outils\node.
setlocal
cd /d "%~dp0"
where node >nul 2>nul || set "PATH=%USERPROFILE%\outils\node;%PATH%"
where node >nul 2>nul || (echo Node.js est introuvable. & pause & exit /b 2)
if not exist node_modules\playwright-core call npm install --no-fund --no-audit
call npm test -- %*
set CODE=%ERRORLEVEL%
if "%~1"=="" pause
exit /b %CODE%
