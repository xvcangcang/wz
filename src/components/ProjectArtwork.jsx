/* 项目占位图：4 种确定性抽象 SVG 构图（Orbit / Mesh / Arcs / Wireframe）
   拿到真实截图后，在 siteData.js 的项目里填 image 字段即自动替换 */
const VARIANTS = ["orbit", "mesh", "arcs", "wireframe"];

export default function ProjectArtwork({ variant = 0, index = 0 }) {
  const v = VARIANTS[variant] ?? "orbit";
  const label = `PROJECT 0${index + 1}`;

  return (
    <svg
      viewBox="0 0 800 500"
      preserveAspectRatio="xMidYMid slice"
      className="project-artwork"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`aw-bg-${v}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#10131a" />
          <stop offset="100%" stopColor="#0c0e14" />
        </linearGradient>
        <pattern
          id={`aw-grid-${v}`}
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="rgba(151,164,187,0.08)"
            strokeWidth="1"
          />
        </pattern>
        <radialGradient id={`aw-glow-${v}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="rgba(78,200,255,0.12)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      <rect width="800" height="500" fill={`url(#aw-bg-${v})`} />
      <rect width="800" height="500" fill={`url(#aw-grid-${v})`} />

      {v === "orbit" && <Orbit />}
      {v === "mesh" && <Mesh />}
      {v === "arcs" && <Arcs />}
      {v === "wireframe" && <Wireframe />}

      {/* 左上角标 */}
      <text
        x="28"
        y="38"
        fontFamily="Consolas, monospace"
        fontSize="12"
        letterSpacing="0.18em"
        fill="#6c7484"
      >
        {label}
      </text>
      <line
        x1="28"
        y1="50"
        x2="52"
        y2="50"
        stroke="#4ec8ff"
        strokeWidth="1.5"
        opacity="0.8"
      />
    </svg>
  );
}

/* 0 Orbit：中心光点 + 椭圆轨道环 + 散点 */
function Orbit() {
  return (
    <g>
      <circle cx="400" cy="250" r="90" fill="url(#aw-glow-orbit)" />
      <circle cx="400" cy="250" r="6" fill="#4ec8ff" opacity="0.9" />
      <circle
        cx="400"
        cy="250"
        r="130"
        fill="none"
        stroke="rgba(78,200,255,0.5)"
        strokeWidth="1"
        strokeDasharray="10 8"
      />
      <ellipse
        cx="400"
        cy="250"
        rx="210"
        ry="110"
        fill="none"
        stroke="rgba(151,164,187,0.35)"
        strokeWidth="1"
        strokeDasharray="4 10"
        transform="rotate(-18 400 250)"
      />
      <ellipse
        cx="400"
        cy="250"
        rx="270"
        ry="160"
        fill="none"
        stroke="rgba(151,164,187,0.2)"
        strokeWidth="1"
        strokeDasharray="2 12"
        transform="rotate(12 400 250)"
      />
      {[
        [400, 118],
        [562, 205],
        [238, 208],
        [530, 330],
        [300, 352],
        [655, 140],
        [150, 148],
      ].map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={i === 0 ? 4 : 2.5}
          fill={i === 0 ? "#4ec8ff" : "rgba(151,164,187,0.5)"}
        />
      ))}
    </g>
  );
}

/* 1 Mesh：透视线框 + 地平线光带 */
function Mesh() {
  const rows = [0, 1, 2, 3, 4, 5];
  return (
    <g>
      <rect x="0" y="0" width="800" height="300" fill="url(#aw-glow-mesh)" opacity="0.5" />
      <line
        x1="0"
        y1="300"
        x2="800"
        y2="300"
        stroke="#4ec8ff"
        strokeWidth="1.5"
        opacity="0.7"
      />
      {/* 向消失点汇聚的线 */}
      {[-300, -100, 100, 300, 500, 700, 900, 1100].map((x, i) => (
        <line
          key={i}
          x1={x}
          y1="500"
          x2="400"
          y2="300"
          stroke="rgba(151,164,187,0.22)"
          strokeWidth="1"
        />
      ))}
      {/* 近大远小的横向线 */}
      {rows.map((r) => (
        <line
          key={r}
          x1="0"
          y1={500 - r * 28}
          x2="800"
          y2={500 - r * 28}
          stroke="rgba(151,164,187,0.16)"
          strokeWidth="1"
        />
      ))}
      <circle cx="400" cy="300" r="3" fill="#4ec8ff" opacity="0.9" />
    </g>
  );
}

/* 2 Arcs：右上角同心圆弧 + 斜向扫描线 */
function Arcs() {
  return (
    <g>
      <rect width="800" height="500" fill="url(#aw-glow-arcs)" opacity="0.4" />
      {[60, 120, 180, 240, 300].map((r) => (
        <path
          key={r}
          d={`M 800 ${500 - r} A ${r} ${r} 0 0 0 ${800 - r} 500`}
          fill="none"
          stroke={
            r === 180 ? "rgba(78,200,255,0.55)" : "rgba(151,164,187,0.28)"
          }
          strokeWidth="1"
        />
      ))}
      <line
        x1="640"
        y1="140"
        x2="160"
        y2="400"
        stroke="rgba(78,200,255,0.35)"
        strokeWidth="1"
        strokeDasharray="6 10"
      />
      <circle cx="160" cy="400" r="3.5" fill="#4ec8ff" opacity="0.85" />
      <circle cx="800" cy="420" r="2" fill="rgba(151,164,187,0.5)" />
      <circle cx="660" cy="500" r="2" fill="rgba(151,164,187,0.5)" />
    </g>
  );
}

/* 3 Wireframe：等轴测立方体线框 + 粒子 + 地面网格 */
function Wireframe() {
  const cx = 400;
  const cy = 240;
  const s = 90;
  const top = `${cx},${cy - s} ${cx + s * 0.86},${cy - s * 0.5} ${cx},${cy} ${cx - s * 0.86},${cy - s * 0.5}`;
  const bottom = `${cx},${cy + s} ${cx + s * 0.86},${cy + s * 0.5} ${cx},${cy} ${cx - s * 0.86},${cy + s * 0.5}`;
  return (
    <g>
      <rect width="800" height="500" fill="url(#aw-glow-wireframe)" opacity="0.4" />
      {/* 顶面（青色描边）+ 竖边 + 底面 */}
      <polygon
        points={top}
        fill="rgba(78,200,255,0.06)"
        stroke="rgba(78,200,255,0.6)"
        strokeWidth="1"
      />
      <line x1={cx - s * 0.86} y1={cy - s * 0.5} x2={cx - s * 0.86} y2={cy + s * 0.5} stroke="rgba(151,164,187,0.4)" />
      <line x1={cx + s * 0.86} y1={cy - s * 0.5} x2={cx + s * 0.86} y2={cy + s * 0.5} stroke="rgba(151,164,187,0.4)" />
      <polygon
        points={bottom}
        fill="none"
        stroke="rgba(151,164,187,0.3)"
        strokeWidth="1"
        strokeDasharray="4 6"
      />
      {/* 地面网格 */}
      {[0, 1, 2].map((i) => (
        <line
          key={`h${i}`}
          x1="80"
          y1={420 + i * 26}
          x2="720"
          y2={420 + i * 26}
          stroke="rgba(151,164,187,0.12)"
        />
      ))}
      {/* 漂浮粒子 */}
      {[
        [260, 120],
        [560, 90],
        [600, 200],
        [230, 210],
        [500, 380],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2" fill="rgba(78,200,255,0.5)" />
      ))}
    </g>
  );
}
