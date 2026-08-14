import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // 相对 base：构建产物用 ./assets/... 引用，部署在任意子路径（如 GitHub Pages 的 /wz/）都能用
  base: "./",
  server: {
    watch: {
      // 项目素材文件夹（含正在运行的 exe，Windows 会锁定文件导致监视器崩溃）
      ignored: ["**/mmb/**", "**/lsjtb/**", "**/简历.txt"],
    },
  },
});
