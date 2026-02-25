@echo off
echo ========================================
echo   NeuroNova - AI Companion App
echo ========================================
echo.

:: Check if node_modules exists, install if not
if not exist "node_modules\" (
    echo Installing dependencies...
    npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies.
        pause
        exit /b 1
    )
    echo.
)

echo Starting development server...
echo App will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server.
echo.

npm run dev

pause
