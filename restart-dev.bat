@echo off
REM Restart Development Server Script
REM This script kills port 3000, rebuilds the project, and starts the dev server

echo 🔴 Killing processes on port 3000...
npx kill-port 3000 2>nul

echo 🧹 Cleaning .next cache...
if exist .next rmdir /s /q .next

echo 🔨 Building project...
call npm run build

if %ERRORLEVEL% EQU 0 (
    echo ✅ Build successful!
    echo 🚀 Starting development server...
    call npm run dev
) else (
    echo ❌ Build failed! Please check the errors above.
    exit /b 1
)
