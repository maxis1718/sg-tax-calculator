# 🚀 部署指南

## 推薦方案：Cloudflare Pages

### 為什麼選擇 Cloudflare Pages？

- ✅ **完全免費** - 無隱藏費用
- ✅ **全球 CDN** - 330+ 邊緣節點
- ✅ **無限流量** - 合理使用範圍內
- ✅ **自動 HTTPS** - 免費 SSL 證書
- ✅ **Git 整合** - 推送即部署
- ✅ **優秀 Dashboard** - 詳細流量分析
- ✅ **自訂域名** - 免費支援
- ✅ **極快速度** - 邊緣快取

### 部署步驟

#### 1. 本地建構測試

```bash
# 運行部署腳本
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

#### 2. 推送到 Git 倉庫

```bash
git add .
git commit -m "準備部署到 Cloudflare Pages"
git push origin main
```

#### 3. 設置 Cloudflare Pages

1. 前往 [Cloudflare Pages](https://dash.cloudflare.com/pages)
2. 點擊 **"Create a project"**
3. 選擇 **"Connect to Git"**
4. 授權並選擇您的倉庫
5. 配置建構設定：
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
6. 點擊 **"Save and Deploy"**

#### 4. 高級設定（可選）

- **Custom domain**: 在 Pages 設定中添加您的域名
- **Environment variables**: 如需要可添加環境變數
- **Web Analytics**: 在 Cloudflare 中啟用免費分析

### 其他選項

#### Vercel (次選)

- 免費層限制較多
- 優秀的開發者體驗
- 自動部署

#### GitHub Pages (不推薦)

- 免費但功能有限
- 沒有 CDN 加速
- 不支援自訂 headers

### 性能優化

項目已包含以下優化：

- 程式碼分割 (Code Splitting)
- 資源壓縮 (Minification)
- 快取策略 (Cache Headers)
- 安全 Headers
- SEO 優化

### 監控和分析

部署後可在 Cloudflare Dashboard 查看：

- 流量統計
- 性能指標
- 錯誤日誌
- 使用者分析

### 預估成本

- **Cloudflare Pages**: 完全免費
- **自訂域名**: 免費（使用 Cloudflare DNS）
- **SSL 證書**: 免費
- **CDN**: 免費

🎉 **部署完成後，您的新加坡稅收計算器將在全球範圍內快速訪問！**
