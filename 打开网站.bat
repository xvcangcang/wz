@echo off
chcp 65001 >nul
cd /d "%~dp0"
title 个人网站 - 本地预览

if not exist "dist\index.html" (
    echo 第一次使用或 dist 不存在，正在构建网站（约 20 秒，请稍候）...
    call npm run build
    if errorlevel 1 (
        echo.
        echo 构建失败：请确认已安装 Node.js，且本文件夹里有 package.json。
        pause
        exit /b 1
    )
)

echo 正在启动本地预览服务器，浏览器会自动打开...
start "" "http://localhost:8080"
node server.cjs
echo.
echo 网站已停止，按任意键关闭窗口。
pause >nul
