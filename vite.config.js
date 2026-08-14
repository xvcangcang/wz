import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // 项目素材文件夹（含正在运行的 exe，Windows 会锁定文件导致监视器崩溃）
      ignored: ["**/密码本/**", "**/历史粘贴板/**", "**/简历.txt"],
    },
  },
});
