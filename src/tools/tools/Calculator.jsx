/* 计算器：自写四则运算状态机（不用 eval），支持连续运算/百分比/正负号 */
import { useState } from "react";

const OPS = {
  "+": (a, b) => a + b,
  "−": (a, b) => a - b,
  "×": (a, b) => a * b,
  "÷": (a, b) => a / b,
};

/* 浮点误差清理：12 位有效数字足以覆盖日常计算 */
function clean(v) {
  if (!Number.isFinite(v)) return "错误";
  return String(parseFloat(v.toPrecision(12)));
}

export default function Calculator() {
  const [cur, setCur] = useState("0");
  const [pending, setPending] = useState(null); // { value, op }
  const [fresh, setFresh] = useState(false); // 刚按过运算符/=，下一个数字开启新输入

  const digit = (d) => {
    if (cur === "错误") {
      setCur(d === "." ? "0." : d);
      setPending(null);
      setFresh(false);
      return;
    }
    if (fresh) {
      setCur(d === "." ? "0." : d);
      setFresh(false);
      return;
    }
    if (d === ".") {
      if (!cur.includes(".")) setCur(cur + ".");
      return;
    }
    if (cur.replace(/[-.]/g, "").length >= 12) return; // 防溢出
    setCur(cur === "0" ? d : cur + d);
  };

  const operator = (op) => {
    if (cur === "错误") return;
    const value = parseFloat(cur);
    if (pending && !fresh) {
      /* 连续按运算符：先结算上一步 */
      const result = clean(OPS[pending.op](pending.value, value));
      setCur(result);
      setPending(result === "错误" ? null : { value: parseFloat(result), op });
    } else {
      setPending({ value, op });
    }
    setFresh(true);
  };

  const equals = () => {
    if (!pending || cur === "错误") return;
    const result = clean(OPS[pending.op](pending.value, parseFloat(cur)));
    setCur(result);
    setPending(null);
    setFresh(true);
  };

  const percent = () => {
    if (cur === "错误") return;
    setCur(clean(parseFloat(cur) / 100));
    setFresh(true);
  };

  const negate = () => {
    if (cur === "错误" || cur === "0") return;
    setCur(cur.startsWith("-") ? cur.slice(1) : `-${cur}`);
  };

  const backspace = () => {
    if (cur === "错误") {
      setCur("0");
      return;
    }
    setCur(cur.length > 1 ? cur.slice(0, -1) : "0");
  };

  const clearAll = () => {
    setCur("0");
    setPending(null);
    setFresh(false);
  };

  const BUTTONS = [
    { t: "C", fn: clearAll, cls: "calc__btn--fn" },
    { t: "⌫", fn: backspace, cls: "calc__btn--fn" },
    { t: "%", fn: percent, cls: "calc__btn--fn" },
    { t: "÷", fn: operator, cls: "calc__btn--op" },
    { t: "7", fn: digit },
    { t: "8", fn: digit },
    { t: "9", fn: digit },
    { t: "×", fn: operator, cls: "calc__btn--op" },
    { t: "4", fn: digit },
    { t: "5", fn: digit },
    { t: "6", fn: digit },
    { t: "−", fn: operator, cls: "calc__btn--op" },
    { t: "1", fn: digit },
    { t: "2", fn: digit },
    { t: "3", fn: digit },
    { t: "+", fn: operator, cls: "calc__btn--op" },
    { t: "±", fn: negate, cls: "calc__btn--fn" },
    { t: "0", fn: digit },
    { t: ".", fn: digit },
    { t: "=", fn: equals, cls: "calc__btn--eq" },
  ];

  return (
    <div>
      <div className="calc__display">
        <div className="calc__prev">
          {pending && cur !== "错误" ? `${pending.value} ${pending.op}` : " "}
        </div>
        <div className="calc__cur">{cur}</div>
      </div>
      <div className="calc__grid">
        {BUTTONS.map((b) => (
          <button
            key={b.t}
            type="button"
            className={`calc__btn ${b.cls ?? ""}`}
            onClick={() => b.fn(b.t)}
          >
            {b.t}
          </button>
        ))}
      </div>
    </div>
  );
}
