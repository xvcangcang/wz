/* 工具箱页壳：标题区 + 工具注册表 + 卡片网格
   新增工具：在 src/tools/tools/ 写组件，在 TOOLS 里加一项即可 */
import { useEffect } from "react";
import Pomodoro from "./tools/Pomodoro.jsx";
import Stopwatch from "./tools/Stopwatch.jsx";
import DateCountdown from "./tools/DateCountdown.jsx";
import Calculator from "./tools/Calculator.jsx";
import RandomPick from "./tools/RandomPick.jsx";
import PasswordGen from "./tools/PasswordGen.jsx";
import UnitConverter from "./tools/UnitConverter.jsx";
import TallyCounter from "./tools/TallyCounter.jsx";
import StickyNotes from "./tools/StickyNotes.jsx";
import ColorTool from "./tools/ColorTool.jsx";
import "./tools.css";

const TOOLS = [
  { id: "pomodoro", name: "番茄钟", tag: "专注计时", desc: "专注/休息时长可自定义，结束时响铃提醒。", component: Pomodoro },
  { id: "stopwatch", name: "秒表", tag: "计时器", desc: "毫秒级计时，支持计次记录每一圈。", component: Stopwatch },
  { id: "date-countdown", name: "日期倒计时", tag: "计划", desc: "设置目标日期，实时显示还剩多少天。", component: DateCountdown },
  { id: "calculator", name: "计算器", tag: "日常", desc: "四则运算 + 百分比 + 正负号，支持连续运算。", component: Calculator },
  { id: "random-pick", name: "随机抽签", tag: "决定", desc: "输入名单，随机抽一个，帮你做决定。", component: RandomPick },
  { id: "password-gen", name: "密码生成器", tag: "安全", desc: "生成长度可调、字符集可选的强随机密码。", component: PasswordGen },
  { id: "unit-converter", name: "单位换算", tag: "换算", desc: "长度、重量、温度三类的双向换算。", component: UnitConverter },
  { id: "tally-counter", name: "计数打卡", tag: "计数", desc: "点一下 +1，记录次数，刷新页面不丢。", component: TallyCounter },
  { id: "sticky-notes", name: "便签本", tag: "备忘", desc: "多篇笔记：新建、打开、保存，存在本机浏览器里。", component: StickyNotes },
  { id: "color-tool", name: "颜色工具", tag: "设计", desc: "取色器 + HEX/RGB 转换 + 随机配色。", component: ColorTool },
];

export default function Tools() {
  useEffect(() => {
    document.title = "工具箱 · 许仓仓";
    return () => {
      document.title = "许仓仓 · 个人主页";
    };
  }, []);

  return (
    <section className="tools-page">
      <div className="container">
        <a className="tools-page__back mono-label" href="#top">
          ← 返回首页
        </a>

        <header className="tools-page__head">
          <p className="tools-page__index mono-label">TOOLBOX — 2026</p>
          <h1 className="tools-page__title">工具箱</h1>
          <p className="tools-page__sub">
            10 个常用小工具，全部在本页直接使用，数据存在本机浏览器、无需联网。
          </p>
        </header>

        <div className="tools__grid">
          {TOOLS.map(({ id, name, tag, desc, component: Comp }) => (
            <article className="tool-card" key={id}>
              <div className="tool-card__head">
                <h2 className="tool-card__title">{name}</h2>
                <span className="tool-card__tag mono-label">{tag}</span>
              </div>
              <p className="tool-card__desc">{desc}</p>
              <div className="tool-card__body">
                <Comp />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
