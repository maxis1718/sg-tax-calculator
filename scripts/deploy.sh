#!/bin/bash

echo "🚀 開始建構和部署 SG Tax Calculator..."

# 安裝依賴
echo "📦 安裝依賴..."
npm install

# 建構項目
echo "🔨 建構項目..."
npm run build

# 檢查建構結果
if [ -d "dist" ]; then
    echo "✅ 建構成功！"
    echo "📊 建構產物大小:"
    du -sh dist/*
    echo ""
    echo "🌐 準備部署到 Cloudflare Pages..."
    echo ""
    echo "請按照以下步驟操作:"
    echo "1. 前往 https://dash.cloudflare.com/pages"
    echo "2. 點擊 'Create a project'"
    echo "3. 連接你的 Git 倉庫"
    echo "4. 使用以下設定:"
    echo "   - Framework preset: Vite"
    echo "   - Build command: npm run build"
    echo "   - Build output directory: dist"
    echo "5. 點擊 'Save and Deploy'"
    echo ""
    echo "🎉 部署完成後，你的網站將會在全球 CDN 上線！"
else
    echo "❌ 建構失敗！請檢查錯誤訊息。"
    exit 1
fi 