# 个人作品集网站

暗色系 · 科技感 · React + Vite

## 运行

```bash
npm install
npm run dev      # 打开 http://localhost:5173
```

## 替换内容

所有文字/数据在 [src/data/siteData.js](src/data/siteData.js)，改这一个文件即可。

- `hero.videoSrc` 填入视频地址（如 `/hero.mp4`，文件放 `public/` 下）→ 首页自动启用视频背景
- `projects[].image` 填入截图地址（如 `/images/xxx.png`）→ 卡片自动用图片替换占位图
- 头像拿到照片后替换 `src/components/AvatarPlaceholder.jsx`

## 调样式

配色 / 字号 / 间距等设计令牌在 `src/styles/tokens.css`。
