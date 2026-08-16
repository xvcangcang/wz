/* 本地预览服务器：配合「打开网站.bat」双击使用，像打开 HTML 一样看网站
   零依赖（只用 Node 内置模块），离线可用；只读 dist/ 里的构建产物
   注意：项目 package.json 是 "type": "module"，本文件必须用 .cjs 后缀（CommonJS） */
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "dist");
const PORT = 8080;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".woff2": "font/woff2",
};

const server = http.createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  } catch {
    res.writeHead(400);
    res.end("Bad request");
    return;
  }
  if (pathname === "/") pathname = "/index.html";

  /* 防目录穿越：解析后必须仍落在 dist 内 */
  const file = path.normalize(path.join(ROOT, pathname));
  if (!file.startsWith(ROOT + path.sep)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(file, (err, data) => {
    if (err) {
      /* 无扩展名的路径（如直接刷新 #/tools）回退到首页，交给 hash 路由处理 */
      if (!path.extname(file)) {
        fs.readFile(path.join(ROOT, "index.html"), (err2, html) => {
          if (err2) {
            res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("404 Not Found");
            return;
          }
          res.writeHead(200, { "Content-Type": MIME[".html"] });
          res.end(html);
        });
        return;
      }
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404 Not Found");
      return;
    }
    res.writeHead(200, {
      "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream",
    });
    res.end(data);
  });
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.log(
      "端口 8080 已被占用：可能已经有一个预览窗口在运行，直接访问 http://localhost:8080 即可。"
    );
  } else {
    console.error("启动失败：", err.message);
  }
  process.exit(1);
});

server.listen(PORT, () => {
  console.log("网站已在本机启动：http://localhost:8080");
  console.log("关闭此窗口即停止网站预览。");
});
