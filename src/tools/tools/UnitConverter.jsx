/* 单位换算：长度/重量统一折算到基准单位（米/千克），温度按公式换算 */
import { useState } from "react";

const CATS = {
  length: {
    label: "长度",
    units: [
      { key: "mm", label: "毫米", factor: 0.001 },
      { key: "cm", label: "厘米", factor: 0.01 },
      { key: "m", label: "米", factor: 1 },
      { key: "km", label: "千米", factor: 1000 },
      { key: "in", label: "英寸", factor: 0.0254 },
      { key: "ft", label: "英尺", factor: 0.3048 },
      { key: "mi", label: "英里", factor: 1609.344 },
    ],
  },
  weight: {
    label: "重量",
    units: [
      { key: "g", label: "克", factor: 0.001 },
      { key: "kg", label: "千克", factor: 1 },
      { key: "t", label: "吨", factor: 1000 },
      { key: "jin", label: "斤", factor: 0.5 },
      { key: "lb", label: "磅", factor: 0.45359237 },
      { key: "oz", label: "盎司", factor: 0.028349523125 },
    ],
  },
  temp: {
    label: "温度",
    units: [
      { key: "c", label: "摄氏度 °C" },
      { key: "f", label: "华氏度 °F" },
      { key: "k", label: "开尔文 K" },
    ],
  },
};

/* 先换算到基准（长度→米，重量→千克，温度→摄氏度），再换算到目标单位 */
function toBase(cat, value, unit) {
  if (cat === "temp") {
    if (unit === "f") return ((value - 32) * 5) / 9;
    if (unit === "k") return value - 273.15;
    return value;
  }
  return value * CATS[cat].units.find((u) => u.key === unit).factor;
}

function fromBase(cat, value, unit) {
  if (cat === "temp") {
    if (unit === "f") return (value * 9) / 5 + 32;
    if (unit === "k") return value + 273.15;
    return value;
  }
  return value / CATS[cat].units.find((u) => u.key === unit).factor;
}

function fmt(v) {
  if (!Number.isFinite(v)) return "—";
  return String(parseFloat(v.toPrecision(12)));
}

export default function UnitConverter() {
  const [cat, setCat] = useState("length");
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("ft");
  const [value, setValue] = useState("1");

  const catCfg = CATS[cat];
  const num = parseFloat(value);
  const result = Number.isFinite(num) ? fmt(fromBase(cat, toBase(cat, num, from), to)) : "—";

  const switchCat = (key) => {
    const units = CATS[key].units;
    setCat(key);
    setFrom(units[0].key);
    setTo(units[Math.min(1, units.length - 1)].key);
  };

  return (
    <div>
      <div className="unit__tabs">
        {Object.entries(CATS).map(([key, c]) => (
          <button
            key={key}
            type="button"
            className={`btn ${cat === key ? "btn--primary" : "btn--ghost"}`}
            onClick={() => switchCat(key)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="unit__row">
        <input
          className="tool-input"
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label="待换算数值"
        />
        <select
          className="tool-select"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          aria-label="原单位"
        >
          {catCfg.units.map((u) => (
            <option key={u.key} value={u.key}>
              {u.label}
            </option>
          ))}
        </select>
      </div>

      <div className="unit__eq">=</div>

      <div className="unit__row">
        <div className="unit__result">{result}</div>
        <select
          className="tool-select"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          aria-label="目标单位"
        >
          {catCfg.units.map((u) => (
            <option key={u.key} value={u.key}>
              {u.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
