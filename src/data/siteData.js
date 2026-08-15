/* ============================================================
   站点内容 —— 唯一数据源
   ★ 内容来自「简历.txt」，需要调整时改这个文件即可

   两个素材开关：
   1. hero.videoSrc   —— 填视频地址（如 "hero.mp4"，文件放 public/ 下）
                         后，首页自动渲染 <video> 覆盖 CSS 动画背景
   2. projects[].image —— 填截图地址（如 "images/xxx.png"，截图放
                         public/images/ 下）后，卡片自动用 <img>
                         替换 SVG 占位图
   3. about.gallery[].src —— 个人图集：把 src 换成真实照片地址（照片放
                         public/images/gallery/ 下）即可替换占位图
   ★ 图片地址一律不带前导 /（相对路径），部署在 GitHub Pages 子路径下才能正常加载
   ============================================================ */

export const site = {
  // ----- 基础信息 -----
  name: "许仓仓",
  nameEn: "XV CANGCANG",
  role: "初中生 · 编程爱好者",
  school: "",
  location: "中国 · 福建福州",
  email: "xvcangcang@163.com",
  phone: "15880420019",
  github: "",
  wechat: "",

  // ----- 首页 Hero -----
  hero: {
    videoSrc: null, // ★ 视频插槽：填入 mp4/webm 地址后自动启用
    poster: null, // 可选：视频封面图
    statusLine: "PORTFOLIO — 2026",
    titleLine1: "你好，我是",
    name: "许仓仓", // 渲染为高亮色 + 底部微光
    titleLine2: "用代码与创意，",
    titleAccent: "探索有趣的世界", // 渲染为点缀色
    subtitle:
      "热爱编程的初中生，会 Python 与图形化编程，喜欢用 Vibe Coding 把想法变成作品，喜欢用无人机记录美好的风景。",
    meta: ["中国 · 福建福州", "Python · 图形化编程", "Vibe Coding 实践者"],
    primaryCta: { label: "联系我", href: "#contact" },
    secondaryCta: { label: "查看项目", href: "#projects" },
  },

  // ----- 01 关于我 -----
  about: {
    sectionIndex: "01",
    sectionTitle: "关于我",
    introHeading: "你好，我是许仓仓。",
    paragraphs: [
      "一名热爱编程的初中生，来自福建福州。从图形化编程入门，到 Python，再到用 Vibe Coding 快速把想法变成能用的软件，我在代码里找到了属于自己的乐趣。",
      "课余时间我喜欢研究无人机，也喜欢动手做些小工具——比如管理密码的「密码本」和记录剪贴板的「历史粘贴板」。对我而言，编程就是让生活更方便一点。",
    ],
    contactItems: [
      { label: "位置", value: "中国 · 福建福州" },
    ],
    stats: [
      { label: "完成项目", value: 5, suffix: "+" },
      { label: "掌握技能", value: 8, suffix: "+" },
      { label: "编程年限", value: 2, suffix: " 年" },
    ],
    /* 个人图集（About 左列螺旋图集）：15 张照片按拍摄时间排序。
       增删照片：把图片放 public/images/gallery/ 并按顺序命名 photo-XX.jpg，
       或直接增删下面数组项。 */
    gallery: [
      { src: "images/gallery/photo-01.jpg", label: "个人图集 01" },
      { src: "images/gallery/photo-02.jpg", label: "个人图集 02" },
      { src: "images/gallery/photo-03.jpg", label: "个人图集 03" },
      { src: "images/gallery/photo-04.jpg", label: "个人图集 04" },
      { src: "images/gallery/photo-05.jpg", label: "个人图集 05" },
      { src: "images/gallery/photo-06.jpg", label: "个人图集 06" },
      { src: "images/gallery/photo-07.jpg", label: "个人图集 07" },
      { src: "images/gallery/photo-08.jpg", label: "个人图集 08" },
      { src: "images/gallery/photo-09.jpg", label: "个人图集 09" },
      { src: "images/gallery/photo-10.jpg", label: "个人图集 10" },
      { src: "images/gallery/photo-11.jpg", label: "个人图集 11" },
      { src: "images/gallery/photo-12.jpg", label: "个人图集 12" },
      { src: "images/gallery/photo-13.jpg", label: "个人图集 13" },
      { src: "images/gallery/photo-14.jpg", label: "个人图集 14" },
      { src: "images/gallery/photo-15.jpg", label: "个人图集 15" },
    ],
  },

  // ----- 02 精选项目 -----
  projects: {
    sectionIndex: "02",
    sectionTitle: "精选项目",
    intro: "自己动手做的一些小作品。",
    items: [
      {
        id: "password-vault",
        title: "密码本",
        tagline: "Password Vault",
        desc: "精致的密码管理桌面应用，分组整理、快速搜索、本地加密存储，把账号密码管理得井井有条。",
        year: "2026",
        type: "桌面应用",
        stack: ["Electron", "React", "TypeScript", "Tailwind"],
        image: "images/password-vault.png", // ★ 有截图后填 "images/xxx.png"
        variant: 0, // 占位图样式 0-3（image 为 null 时生效）
        link: "#",
      },
      {
        id: "clipboard-history",
        title: "历史粘贴板",
        tagline: "Clipboard History",
        desc: "Windows 剪贴板记录工具：自动记录复制过的文字、图片和文件，支持搜索、置顶、备注与 5 种配色主题，托盘常驻随时找回。",
        year: "2026",
        type: "Windows 工具",
        stack: ["Python", "PyInstaller"],
        image: "images/clipboard-history.png",
        imageFit: "contain", // 竖屏截图完整显示（默认 cover 铺满）
        variant: 1,
        link: "#",
      },
    ],
  },

  // ----- 03 个人优势 -----
  strengths: {
    sectionIndex: "03",
    sectionTitle: "个人优势",
    items: [
      {
        icon: "code",
        title: "Python 编程",
        desc: "能独立编写小工具与自动化脚本，用代码解决学习生活中的实际问题。",
        level: 80,
      },
      {
        icon: "blocks",
        title: "图形化编程",
        desc: "从图形化编程起步，逻辑思维扎实，能快速上手新的编程平台。",
        level: 90,
      },
      {
        icon: "spark",
        title: "Vibe Coding",
        desc: "熟练和 AI 协作快速搭建作品，从想法到成品的效率派实践者。",
        level: 85,
      },
      {
        icon: "drone",
        title: "无人机飞行",
        desc: "热爱无人机飞行与航拍，在动手实践中感受技术与硬件的乐趣。",
        level: 75,
      },
    ],
  },

  // ----- 04 联系方式（整屏收尾） -----
  contact: {
    sectionIndex: "04",
    sectionTitle: "联系方式",
    headingLine1: "有想法？",
    headingLine2: "一起聊聊",
    email: "xvcangcang@163.com",
    socials: [
      { label: "邮箱", href: "mailto:xvcangcang@163.com" },
      { label: "电话", href: "tel:15880420019" },
    ],
    copyright: "© 2026 许仓仓 · 保留所有权利",
  },
};
