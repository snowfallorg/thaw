"use strict";
var w = Object.defineProperty;
var C = Object.getOwnPropertySymbols;
var D = Object.prototype.hasOwnProperty,
  S = Object.prototype.propertyIsEnumerable;
var T = (e, r, o) =>
    r in e
      ? w(e, r, { enumerable: !0, configurable: !0, writable: !0, value: o })
      : (e[r] = o),
  A = (e, r) => {
    for (var o in r || (r = {})) D.call(r, o) && T(e, o, r[o]);
    if (C) for (var o of C(r)) S.call(r, o) && T(e, o, r[o]);
    return e;
  };
Object.defineProperties(exports, {
  __esModule: { value: !0 },
  [Symbol.toStringTag]: { value: "Module" },
});
var m = require("./kleur.cjs");
function U(e) {
  return e && typeof e == "object" && "default" in e ? e : { default: e };
}
var t = U(m),
  I = ((e) => (
    (e.Silent = "SILENT"),
    (e.Info = "INFO"),
    (e.Debug = "DEBUG"),
    (e.Trace = "TRACE"),
    e
  ))(I || {});
const f = process.stdout.write.bind(process.stdout),
  v = process.stderr.write.bind(process.stderr),
  p = {
    colors: {
      INFO: t.default.bold().blue,
      WARN: t.default.bold().yellow,
      DEBUG: t.default.bold().magenta,
      TRACE: t.default.bold().dim,
      ERROR: t.default.bold().red,
      FATAL: t.default.bold().bgWhite().red,
    },
    icons: {
      INFO: "\uF7FC",
      WARN: "\uF529",
      DEBUG: "\uF188",
      TRACE: "\uFBCE",
      ERROR: "\uF06A",
      FATAL: "\uFB8A",
    },
    loggers: { INFO: f, WARN: f, DEBUG: f, TRACE: f, ERROR: v, FATAL: v },
    levels: {
      INFO: ["INFO", "DEBUG", "TRACE"],
      WARN: ["INFO", "DEBUG", "TRACE"],
      DEBUG: ["DEBUG", "TRACE"],
      TRACE: ["TRACE"],
      ERROR: ["INFO", "DEBUG", "TRACE"],
      FATAL: ["INFO", "DEBUG", "TRACE"],
    },
  },
  N = {
    colors: [
      t.default.bold().blue,
      t.default.bold().green,
      t.default.bold().cyan,
      t.default.bold().magenta,
      t.default.bold().yellow,
      t.default.bold().white,
    ],
  },
  s = {
    colors: [
      t.default.bold().blue,
      t.default.bold().magenta,
      t.default.bold().yellow,
    ],
  },
  n = {
    colors: {
      undefined: t.default.dim,
      null: t.default.blue,
      number: t.default.yellow,
      string: t.default.green,
      boolean: t.default.blue,
      comma: t.default.white,
      property: t.default.white,
      equals: t.default.white,
      circular: t.default.dim,
      stack: t.default.red,
    },
  },
  _ = { colors: { timestamp: t.default.dim } };
let b = -1;
const g = new Map();
var G;
let c = {
  level: process.env.LOG_LEVEL || "INFO",
  filter: process.env.LOG_FILTER || process.env.DEBUG || void 0,
  prefix: process.env.LOG_PREFIX !== "false",
  timestamp: process.env.LOG_TIMESTAMP === "true",
  color:
    process.env.LOG_COLOR === "true" ||
    process.env.FORCE_COLOR === "1" ||
    ((process.env.LOG_COLOR !== "false" || process.env.FORCE_COLOR !== "0") &&
      ((G = process.stdout.isTTY) != null ? G : !1)),
  icons: process.env.LOG_ICONS === "true",
};
function j(e) {
  c = A(A({}, c), e);
}
function M(e) {
  if (typeof e == "number")
    switch (e) {
      default:
      case 0:
        return "INFO";
      case 1:
        return "DEBUG";
      case 2:
        return "TRACE";
    }
}
function l(e, r) {
  return c.color ? e(r) : r;
}
function x() {
  return c.timestamp
    ? `${l(_.colors.timestamp, new Date().toISOString())} `
    : "";
}
function W(e) {
  return c.icons ? `${p.icons[e]}  ` : "";
}
function k(e, r) {
  return l(p.colors[e], ` ${r}${e.padEnd(5, " ")} `);
}
function P(e) {
  return (
    e.length > 0 &&
      !g.has(e) &&
      (b++, b >= N.colors.length && (b = 0), g.set(e, N.colors[b])),
    e.length > 0 ? `${l(g.get(e), e.join(":"))} ` : ""
  );
}
function $(e) {
  return e.replaceAll('"', '\\"');
}
function F(e, r = 0, o = new Set()) {
  const u = typeof e;
  if (o.has(e)) return n.colors.circular("[Circular Reference]");
  if ((o.add(e), r > 200)) return n.colors.stack("[Stack Size Exceeded]");
  if (u === "undefined") return n.colors.undefined("undefined");
  if (e === null) return n.colors.null("null");
  if (u === "number") return n.colors.number(e.toString());
  if (u === "boolean") return n.colors.boolean(e.toString());
  if (u === "string") return n.colors.string(`"${$(e)}"`);
  if (Array.isArray(e)) {
    const i = e
        .map((h) => F(h, r + 1, new Set([...o])))
        .join(n.colors.comma(", ")),
      d = r % s.colors.length,
      a = l(s.colors[d], "["),
      R = l(s.colors[d], "]");
    return `${a} ${i} ${R}`;
  } else if (u === "object") {
    const i = [];
    for (const [O, y] of Object.entries(e)) {
      const B = O.match(/[^[a-zA-Z_\$]/g)
          ? n.colors.string(`"${$(O)}"`)
          : n.colors.property(O),
        L = F(y, r + 1, new Set([...o]));
      i.push(`${B}${n.colors.equals("=")}${L}`);
    }
    const d = i.join(" "),
      a = r % s.colors.length,
      R = l(s.colors[a], "{"),
      h = l(s.colors[a], "}");
    return `${R} ${d} ${h}`;
  } else return e;
}
function q(e) {
  return e.length === 1 && typeof e[0] == "string"
    ? e[0]
    : e.map((r) => F(r, 0)).join(" ");
}
function z(e, r, ...o) {
  return `${x()}${k(e, W(e))} ${P(r)}${q(o)}
`;
}
class E {
  constructor(r) {
    (this.info = this.log.bind(this, "INFO")),
      (this.warn = this.log.bind(this, "WARN")),
      (this.debug = this.log.bind(this, "DEBUG")),
      (this.trace = this.log.bind(this, "TRACE")),
      (this.error = this.log.bind(this, "ERROR")),
      (this.fatal = this.log.bind(this, "FATAL")),
      (this.prefix = r);
  }
  static create(r) {
    return new E(r ? [r] : []);
  }
  child(r) {
    return new E([...this.prefix, r]);
  }
  log(r, ...o) {
    p.levels[r].includes(c.level) && p.loggers[r](z(r, this.prefix, ...o));
  }
}
var K = E.create();
exports.LogLevel = I;
exports.configure = j;
exports.default = K;
exports.parseLogLevelNumber = M;
