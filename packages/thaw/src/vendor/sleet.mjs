var E = Object.defineProperty;
var v = (n, e, t) => e in n ? E(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var k = (n, e, t) => (v(n, typeof e != "symbol" ? e + "" : e, t), t);
var s = /* @__PURE__ */ ((n) => (n.Eof = "Eof", n.Comment = "Comment", n.Null = "Null", n.Bool = "Bool", n.String = "String", n.Int = "Int", n.Float = "Float", n.Path = "Path", n.OpenParen = "OpenParen", n.CloseParen = "CloseParen", n.OpenCurly = "OpenCurly", n.CloseCurly = "CloseCurly", n.DollarCurly = "DollarCurly", n.OpenBracket = "OpenBracket", n.CloseBracket = "CloseBracket", n.Keyword = "Keyword", n.Operator = "Operator", n.Semi = "Semi", n.Identifier = "Identifier", n.NewLine = "NewLine", n.Has = "Has", n.At = "At", n.Colon = "Colon", n.Eq = "Eq", n.EqEq = "EqEq", n.NotEq = "NotEq", n.Not = "Not", n.Lt = "Lt", n.Lte = "Lte", n.Gt = "Gt", n.Gte = "Gte", n.Add = "Add", n.Sub = "Sub", n.Mul = "Mul", n.Div = "Div", n.Imp = "Imp", n.Update = "Update", n.Concat = "Concat", n.Or = "Or", n.And = "And", n.Period = "Period", n.Comma = "Comma", n.Ellipsis = "Ellipsis", n.Interp = "Interp", n))(s || {});
class g {
  constructor() {
    k(this, "code", "");
    k(this, "cursor", 0);
    k(this, "line", 1);
    k(this, "col", 1);
    k(this, "tokens", []);
  }
  lex(e) {
    for (this.code = e, this.cursor = 0, this.line = 1, this.col = 1, this.tokens = []; this.cursor < this.code.length; ) {
      const t = this.lexToken();
      if (this.tokens.push(t), t.kind === "Eof")
        break;
    }
    return (this.tokens.length === 0 || this.tokens[this.tokens.length - 1].kind !== "Eof") && this.tokens.push(this.lexEofToken()), this.tokens;
  }
  peek(e = 0) {
    const t = this.cursor, i = this.line, r = this.col;
    this.cursor += e;
    const l = this.consume();
    return this.cursor = t, this.line = i, this.col = r, l;
  }
  consume() {
    let e = this.code[this.cursor];
    return this.cursor++, this.col++, e === "\r" && this.peek() === `
` ? (this.cursor++, e = `\r
`, this.line++, this.col = 1) : e === `
` && (this.line++, this.col = 1), e;
  }
  lexToken() {
    let e;
    for (; this.cursor < this.code.length && (e = this.peek(), !(e === `
` || e === `\r
` || !/\s/.test(e))); )
      this.consume();
    return e = this.peek(), e === "." && (this.peek(1) === void 0 || this.peek(1) !== void 0 && this.peek(1) !== "/" && this.peek(1) !== ".") ? this.lexPeriod() : e === "#" ? this.lexComment() : e === "/" && this.peek(1) == "*" ? this.lexMultilineComment() : e === void 0 ? this.lexEofToken() : e === `
` || e === `\r
` ? this.lexNewLine() : e === ";" ? this.lexSemi() : e === "(" ? this.lexOpenParen() : e === ")" ? this.lexCloseParen() : e === "{" ? this.lexOpenCurly() : e === "}" ? this.lexCloseCurly() : e === "[" ? this.lexOpenBracket() : e === "]" ? this.lexCloseBracket() : e === "$" && this.peek(1) === "{" ? this.lexInterp() : this.isIdentStart(e) ? this.lexIdent() : e === "." && this.cursor + 2 < this.code.length && this.peek(1) === "." && this.peek(2) === "." ? this.lexOperator() : this.isPathStart(e) && this.cursor + 1 < this.code.length && this.isPath(this.peek(1)) && `${e}${this.peek(1)}` != "//" ? this.lexPath() : this.isNumberStart(e) ? this.lexNumber() : this.isOperatorStart(e) ? this.lexOperator() : e === '"' || e === "'" && this.peek(1) === "'" ? this.lexString() : this.lexEofToken();
  }
  lexPeriod() {
    const { line: e, col: t } = this;
    this.consume();
    const { line: i, col: r } = this;
    return {
      kind: "Period",
      loc: {
        start: { line: e, col: t },
        end: { line: i, col: r }
      }
    };
  }
  lexNewLine() {
    const { line: e, col: t } = this;
    this.consume();
    const { line: i, col: r } = this;
    return {
      kind: "NewLine",
      loc: {
        start: { line: e, col: t },
        end: { line: i, col: r }
      }
    };
  }
  lexEofToken() {
    return this.consume(), {
      kind: "Eof",
      loc: {
        start: { line: this.line, col: this.col },
        end: { line: this.line, col: this.col }
      }
    };
  }
  lexSemi() {
    const { line: e, col: t } = this;
    this.consume();
    const { line: i, col: r } = this;
    return {
      kind: "Semi",
      loc: {
        start: { line: e, col: t },
        end: { line: i, col: r }
      }
    };
  }
  lexOpenParen() {
    const { line: e, col: t } = this;
    this.consume();
    const { line: i, col: r } = this;
    return {
      kind: "OpenParen",
      loc: {
        start: { line: e, col: t },
        end: { line: i, col: r }
      }
    };
  }
  lexCloseParen() {
    const { line: e, col: t } = this;
    this.consume();
    const { line: i, col: r } = this;
    return {
      kind: "CloseParen",
      loc: {
        start: { line: e, col: t },
        end: { line: i, col: r }
      }
    };
  }
  lexOpenCurly() {
    const { line: e, col: t } = this;
    this.consume();
    const { line: i, col: r } = this;
    return {
      kind: "OpenCurly",
      loc: {
        start: { line: e, col: t },
        end: { line: i, col: r }
      }
    };
  }
  lexCloseCurly() {
    const { line: e, col: t } = this;
    this.consume();
    const { line: i, col: r } = this;
    return {
      kind: "CloseCurly",
      loc: {
        start: { line: e, col: t },
        end: { line: i, col: r }
      }
    };
  }
  lexOpenBracket() {
    const { line: e, col: t } = this;
    this.consume();
    const { line: i, col: r } = this;
    return {
      kind: "OpenBracket",
      loc: {
        start: { line: e, col: t },
        end: { line: i, col: r }
      }
    };
  }
  lexCloseBracket() {
    const { line: e, col: t } = this;
    this.consume();
    const { line: i, col: r } = this;
    return {
      kind: "CloseBracket",
      loc: {
        start: { line: e, col: t },
        end: { line: i, col: r }
      }
    };
  }
  isIdentStart(e) {
    return /[a-zA-Z_]/.test(e);
  }
  isIdent(e) {
    return /[a-zA-Z0-9_'\-]/.test(e);
  }
  lexIdent() {
    const { line: e, col: t } = this;
    let i = this.consume();
    for (; this.cursor < this.code.length && this.isIdent(this.peek()); )
      i += this.consume();
    const { line: r, col: l } = this;
    switch (i) {
      case "null":
        return {
          kind: "Null",
          loc: {
            start: { line: e, col: t },
            end: { line: r, col: l }
          }
        };
      case "true":
        return {
          kind: "Bool",
          value: !0,
          loc: {
            start: { line: e, col: t },
            end: { line: r, col: l }
          }
        };
      case "false":
        return {
          kind: "Bool",
          value: !1,
          loc: {
            start: { line: e, col: t },
            end: { line: r, col: l }
          }
        };
      case "let":
      case "in":
      case "rec":
      case "with":
      case "inherit":
      case "assert":
      case "or":
      case "import":
      case "if":
      case "then":
      case "else":
        return {
          kind: "Keyword",
          value: i,
          loc: {
            start: { line: e, col: t },
            end: { line: r, col: l }
          }
        };
      default:
        return {
          kind: "Identifier",
          value: i,
          loc: {
            start: { line: e, col: t },
            end: { line: r, col: l }
          }
        };
    }
  }
  isPathStart(e) {
    return e === "." || e === "/" || e === "~";
  }
  isPath(e) {
    return /[A-Za-z0-9_@\.\-\$\/\~]/.test(e);
  }
  lexPath() {
    const { line: e, col: t } = this;
    let i = this.consume();
    const { line: r, col: l } = this;
    for (; this.cursor < this.code.length; ) {
      let a = this.peek();
      if (a === "\\") {
        this.consume(), i += this.consume();
        continue;
      }
      if (this.isPath(a))
        i += this.consume();
      else
        break;
    }
    return {
      kind: "Path",
      value: i,
      loc: {
        start: { line: e, col: t },
        end: { line: r, col: l }
      }
    };
  }
  isNumberStart(e) {
    return /[0-9]/.test(e);
  }
  isNumber(e) {
    return /[0-9]/.test(e);
  }
  lexNumber() {
    const { line: e, col: t } = this;
    let i = this.consume(), r = !1;
    const { line: l, col: a } = this;
    for (; this.cursor < this.code.length; ) {
      let c = this.peek();
      if (c === "." && this.isNumber(this.peek(1))) {
        i += this.consume(), r = !0;
        continue;
      }
      if (this.isNumber(c))
        i += this.consume();
      else
        break;
    }
    return {
      kind: r ? "Float" : "Int",
      value: Number(i),
      loc: {
        start: { line: e, col: t },
        end: { line: l, col: a }
      }
    };
  }
  isOperatorStart(e) {
    return ["=", "!", "+", "-", "*", "/", "<", ">", ":", "@", ".", ",", "?", "|", "&"].includes(e);
  }
  isOperator(e) {
    return [
      "=",
      "==",
      "!=",
      "!",
      "+",
      "-",
      "*",
      "/",
      "->",
      "//",
      "++",
      "<",
      ">",
      ":",
      "@",
      "..",
      // This is terrible, but...
      "...",
      ",",
      "?",
      "<=",
      ">=",
      "||",
      "&&"
    ].includes(e);
  }
  lexOperator() {
    const e = this.cursor, { line: t, col: i } = this;
    let r = this.consume();
    for (; this.cursor < this.code.length && this.isOperator(r + this.peek()); )
      r += this.consume();
    const l = this.cursor, { line: a, col: c } = this, o = {
      start: { line: t, col: i },
      end: { line: a, col: c }
    };
    switch (r) {
      case "?":
        return {
          kind: "Has",
          loc: o
        };
      case "@":
        return {
          kind: "At",
          loc: o
        };
      case ":":
        return {
          kind: "Colon",
          loc: o
        };
      case "=":
        return {
          kind: "Eq",
          loc: o
        };
      case "==":
        return {
          kind: "EqEq",
          loc: o
        };
      case "!=":
        return {
          kind: "NotEq",
          loc: o
        };
      case "!":
        return {
          kind: "Not",
          loc: o
        };
      case "<":
        return {
          kind: "Lt",
          loc: o
        };
      case ">":
        return {
          kind: "Gt",
          loc: o
        };
      case "+":
        return {
          kind: "Add",
          loc: o
        };
      case "-":
        return {
          kind: "Sub",
          loc: o
        };
      case "*":
        return {
          kind: "Mul",
          loc: o
        };
      case "/":
        return {
          kind: "Div",
          loc: o
        };
      case "->":
        return {
          kind: "Imp",
          loc: o
        };
      case "++":
        return {
          kind: "Concat",
          loc: o
        };
      case ",":
        return {
          kind: "Comma",
          loc: o
        };
      case "...":
        return {
          kind: "Ellipsis",
          loc: o
        };
      case "//":
        return {
          kind: "Update",
          loc: o
        };
      case "||":
        return {
          kind: "Or",
          loc: o
        };
      case "&&":
        return {
          kind: "And",
          loc: o
        };
      case "<=":
        return {
          kind: "Lte",
          loc: o
        };
      case ">=":
        return {
          kind: "Gte",
          loc: o
        };
    }
    throw console.log(this.code.substring(e - 10, l + 10)), new Error(`Unknown operator: ${r}`);
  }
  lexInterp() {
    const { line: e, col: t } = this;
    this.consume(), this.consume();
    let i = 0;
    const r = [];
    for (; this.cursor < this.code.length; ) {
      const c = this.lexToken();
      if (c.kind === "OpenCurly" && i++, c.kind === "CloseCurly" && i--, i === -1)
        break;
      r.push(c);
    }
    const { line: l, col: a } = this;
    return {
      kind: "Interp",
      value: r,
      loc: {
        start: { line: e, col: t },
        end: { line: l, col: a }
      }
    };
  }
  lexString() {
    const { line: e, col: t } = this, i = this.peek() === "'", r = [""];
    for (this.consume(), i && this.consume(); this.cursor < this.code.length; ) {
      if (i && this.peek() === "'" && this.peek(1) === "'") {
        this.consume(), this.consume();
        break;
      }
      if (!i && this.peek() === '"') {
        this.consume();
        break;
      }
      const c = this.peek();
      if (c === "\\") {
        this.consume(), r[r.length - 1] = r[r.length - 1] + this.consume();
        continue;
      }
      if (c === "$" && this.peek(1) === "{") {
        const o = this.lexInterp();
        r.push(o), r.push("");
        continue;
      }
      r[r.length - 1] = r[r.length - 1] + this.consume();
    }
    const { line: l, col: a } = this;
    return {
      kind: "String",
      multiline: i,
      value: r,
      loc: {
        start: { line: e, col: t },
        end: { line: l, col: a }
      }
    };
  }
  lexComment() {
    const { line: e, col: t } = this;
    let i = "";
    for (this.consume(); this.cursor < this.code.length && this.peek() !== `
` && !(this.peek() === "\r" && this.peek(1) === `
`); )
      i += this.consume();
    const { line: r, col: l } = this;
    return {
      kind: "Comment",
      value: i,
      multiline: !1,
      loc: {
        start: { line: e, col: t },
        end: { line: r, col: l }
      }
    };
  }
  lexMultilineComment() {
    const { line: e, col: t } = this;
    let i = "";
    for (this.consume(), this.consume(); this.cursor < this.code.length && !(this.peek() === "*" && this.peek(1) === "/"); )
      i += this.consume();
    this.consume(), this.consume();
    const { line: r, col: l } = this;
    return {
      kind: "Comment",
      value: i,
      multiline: !0,
      loc: {
        start: { line: e, col: t },
        end: { line: r, col: l }
      }
    };
  }
}
var L = /* @__PURE__ */ ((n) => (n.Root = "Root", n.Comment = "Comment", n.Expr = "Expr", n.UnaryExpr = "UnaryExpr", n.BinaryExpr = "BinaryExpr", n.SubExpr = "SubExpr", n.Conditional = "Conditional", n.Modifier = "Modifier", n.LetIn = "LetIn", n.Import = "Import", n.Fallback = "Fallback", n.Identifier = "Identifier", n.Null = "Null", n.Int = "Int", n.Float = "Float", n.Bool = "Bool", n.String = "String", n.Path = "Path", n.Attrs = "Attrs", n.Attr = "Attr", n.List = "List", n.Fn = "Fn", n.FnParams = "FnParams", n.FnParam = "FnParam", n.FnCall = "FnCall", n.Has = "Has", n.Eq = "Eq", n.EqEq = "EqEq", n.NotEq = "NotEq", n.Not = "Not", n.Lt = "Lt", n.Lte = "Lte", n.Gt = "Gt", n.Gte = "Gte", n.Add = "Add", n.Sub = "Sub", n.Mul = "Mul", n.Div = "Div", n.Imp = "Imp", n.Update = "Update", n.Concat = "Concat", n.Or = "Or", n.And = "And", n.Period = "Period", n.Interp = "Interp", n))(L || {});
const I = (n) => n.hasOwnProperty("name"), S = (n) => !I(n), O = (n) => n.hasOwnProperty("name"), A = (n) => n.hasOwnProperty("value"), P = {
  [s.Period]: 1,
  [s.Has]: 4,
  [s.Concat]: 5,
  [s.Mul]: 6,
  [s.Div]: 6,
  [s.Sub]: 7,
  [s.Add]: 7,
  [s.Update]: 9,
  [s.Lt]: 10,
  [s.Lte]: 10,
  [s.Gt]: 10,
  [s.Gte]: 10,
  [s.EqEq]: 11,
  [s.NotEq]: 11,
  [s.And]: 12,
  [s.Or]: 13,
  [s.Imp]: 13
};
class w {
  constructor() {
    k(this, "lexer", new g());
    k(this, "cursor", 0);
    k(this, "state", []);
    k(this, "tokens", []);
  }
  isOperator(e) {
    return e.kind === s.Add || e.kind === s.Sub || e.kind === s.Mul || e.kind === s.Div || e.kind === s.Eq || e.kind === s.EqEq || e.kind === s.NotEq || e.kind === s.Lt || e.kind === s.Lte || e.kind === s.Gt || e.kind === s.Gte || e.kind === s.Imp || e.kind === s.Update || e.kind === s.Concat || e.kind === s.Or || e.kind === s.And || e.kind === s.Period || e.kind === s.Has;
  }
  getOperatorPrecedence(e) {
    return P[e.kind] ?? 0;
  }
  getOpNode(e) {
    let t;
    switch (e.kind) {
      case s.Has:
        t = "Has";
        break;
      case s.Eq:
        t = "Eq";
        break;
      case s.EqEq:
        t = "EqEq";
        break;
      case s.NotEq:
        t = "NotEq";
        break;
      case s.Lt:
        t = "Lt";
        break;
      case s.Lte:
        t = "Lte";
        break;
      case s.Gt:
        t = "Gt";
        break;
      case s.Gte:
        t = "Gte";
        break;
      case s.Add:
        t = "Add";
        break;
      case s.Sub:
        t = "Sub";
        break;
      case s.Mul:
        t = "Mul";
        break;
      case s.Div:
        t = "Div";
        break;
      case s.Imp:
        t = "Imp";
        break;
      case s.Update:
        t = "Update";
        break;
      case s.Concat:
        t = "Concat";
        break;
      case s.Or:
        t = "Or";
        break;
      case s.And:
        t = "And";
        break;
      case s.Period:
        t = "Period";
        break;
      default:
        throw new Error(`Unknown op node for token "${e.kind}"`);
    }
    return {
      kind: t,
      loc: e.loc
    };
  }
  lookahead(e) {
    const t = this.cursor, i = [...this.state], r = e();
    return this.cursor = t, this.state = i, r;
  }
  peek(e = 0) {
    return this.tokens[this.cursor + e];
  }
  consume() {
    const e = this.tokens[this.cursor];
    return this.cursor++, e;
  }
  parse(e) {
    const t = this.lexer.lex(e);
    return this.parseTokens(t);
  }
  skipNewLines() {
    for (; this.cursor < this.tokens.length && this.peek().kind === s.NewLine; )
      this.consume();
  }
  parseTokens(e) {
    this.cursor = 0, this.state = [], this.tokens = e;
    const t = this.parseExpr();
    return {
      kind: "Root",
      value: t,
      loc: t.loc
    };
  }
  parseExpr(e = !1, t = !1, i = !1) {
    let r = 0, l = this.parseSubExpr(!0, e, t), a;
    for (; this.cursor < this.tokens.length && !(e || t); ) {
      let c = this.lookahead(() => {
        for (; this.cursor < this.tokens.length; ) {
          const o = this.peek();
          if (o.kind === s.NewLine || o.kind === s.Comment || o.kind === s.Eof) {
            this.consume();
            continue;
          }
          return o;
        }
      });
      if (c !== void 0 && c.kind === s.Period) {
        this.skipNewLines(), this.consume();
        const o = this.parseSubExpr(e, t, i);
        o.kind === "SubExpr" && o.value.kind === "FnCall" && o.value.name.kind === "Identifier" && (o.value.name.value.unshift({
          kind: "Expr",
          value: l,
          loc: l.loc
        }), o.loc.start = l.loc.start), o.kind === "SubExpr" && o.value.kind === "Identifier" && (o.value.value.unshift({
          kind: "Expr",
          value: l,
          loc: l.loc
        }), o.loc.start = l.loc.start), l = o, r = 0;
        continue;
      }
      if (c !== void 0 && i)
        break;
      if (c !== void 0 && c.kind === s.Keyword && c.value === "or") {
        this.skipNewLines(), this.consume();
        const o = this.parseSubExpr(!0, e, t);
        if (l.kind !== "BinaryExpr") {
          const h = {
            kind: "BinaryExpr",
            op: {
              kind: "Fallback",
              loc: c.loc
            },
            left: l,
            right: o,
            loc: {
              start: l.loc.start,
              end: o.loc.end
            }
          };
          a = h, l = h;
        } else {
          const h = {
            kind: "BinaryExpr",
            op: {
              kind: "Fallback",
              loc: c.loc
            },
            left: a.right,
            right: o,
            loc: {
              start: a.right.loc.start,
              end: o.loc.end
            }
          };
          a.right = h, a = h;
        }
        r = 1;
        continue;
      }
      if (c !== void 0 && this.isOperator(c)) {
        this.skipNewLines();
        const o = this.getOperatorPrecedence(c);
        this.consume();
        const h = this.parseSubExpr(!0, e, t);
        if (l.kind === "SubExpr" || o > r) {
          const p = {
            kind: "BinaryExpr",
            op: this.getOpNode(c),
            left: l,
            right: h,
            loc: {
              start: l.loc.start,
              end: h.loc.end
            }
          };
          a = p, l = p;
        } else {
          const p = {
            kind: "BinaryExpr",
            op: this.getOpNode(c),
            left: a.right,
            right: h,
            loc: {
              start: a.right.loc.start,
              end: h.loc.end
            }
          };
          a.right = p, a = p;
        }
        r = o;
        continue;
      }
      break;
    }
    return {
      kind: "Expr",
      value: l,
      loc: {
        start: l.loc.start,
        end: l.loc.end
      }
    };
  }
  parseSubExpr(e = !0, t = !1, i = !1) {
    const r = [], l = {
      before: [],
      after: []
    };
    r.push(...this.parseModifiers()), l.before = this.parseComments(), r.push(...this.parseModifiers());
    let a = this.peek();
    const c = a.loc;
    let o = !1;
    a.kind === s.Sub && (o = !0, this.consume(), a = this.peek());
    let h, p = a.loc;
    switch (a.kind) {
      case s.Int: {
        const u = this.parseInt(o);
        p = u.loc, h = {
          ...u,
          loc: {
            start: c.start,
            end: u.loc.end
          }
        };
        break;
      }
      case s.Float: {
        const u = this.parseFloat(o);
        p = u.loc, h = {
          ...u,
          loc: {
            start: c.start,
            end: u.loc.end
          }
        };
        break;
      }
      case s.Bool: {
        h = this.parseBool(), p = h.loc;
        break;
      }
      case s.String: {
        h = this.parseString(), p = h.loc;
        break;
      }
      case s.Interp: {
        h = this.parseInterp(), p = h.loc;
        break;
      }
      case s.OpenBracket: {
        h = this.parseList(), p = h.loc;
        break;
      }
      case s.OpenCurly: {
        const u = this.tryParseFunction();
        u ? h = u : h = this.parseAttrs(), p = h.loc;
        break;
      }
      case s.Identifier: {
        const u = this.tryParseFunction();
        u ? h = u : h = this.parseIdentifier(), p = h.loc;
        break;
      }
      case s.Path: {
        h = this.parsePath(), p = h.loc;
        break;
      }
      case s.OpenParen: {
        const u = this.consume(), m = this.parseExpr(), C = this.consume();
        h = m, p = {
          start: u.loc.start,
          end: C.loc.end
        };
        break;
      }
      case s.Keyword: {
        h = this.parseKeyword(), p = h.loc;
        break;
      }
      case s.Null: {
        h = this.parseNull(), p = h.loc;
        break;
      }
      case s.Not:
        return this.parseNot(t);
      default:
        throw console.log(this.tokens.slice(this.cursor - 10, this.cursor)), console.log("-----"), console.log(a), new Error(`Unexpected token: ${a.kind}`);
    }
    const d = [];
    if (
      // Function args must be their own expression to be parsed as a function call.
      !t && // You can't call a function in a list because the list delimiter is whitespace.
      !i && // Only certain nodes can be called as functions.
      (h.kind === "Expr" || h.kind === "Identifier" || h.kind === "Import")
    )
      for (; this.cursor < this.tokens.length; ) {
        const u = this.lookahead(() => {
          for (; this.cursor < this.tokens.length; ) {
            const m = this.peek();
            if (m.kind !== s.NewLine && m.kind !== s.Comment)
              return m;
            this.consume();
          }
        });
        if (u === void 0 || u.kind === s.Eof || u.kind === s.Comma || u.kind === s.Semi || u.kind === s.CloseCurly || u.kind === s.CloseBracket || u.kind === s.CloseParen || u.kind === s.Keyword && u.value !== "rec" || this.isOperator(u))
          break;
        d.push(this.parseExpr(!0));
      }
    return e && (l.after = this.parseComments()), d.length > 0 ? {
      kind: "SubExpr",
      value: {
        kind: "FnCall",
        name: h,
        value: d,
        loc: {
          start: c.start,
          end: d[d.length - 1].loc.end
        }
      },
      modifiers: r,
      comments: l,
      loc: {
        start: c.start,
        end: p.end
      }
    } : {
      kind: "SubExpr",
      value: h,
      modifiers: r,
      comments: l,
      loc: {
        start: c.start,
        end: p.end
      }
    };
  }
  parseNot(e = !1) {
    const t = this.consume(), i = this.parseExpr(e, !1, !0);
    return {
      kind: "UnaryExpr",
      op: {
        kind: "Not",
        loc: t.loc
      },
      value: i,
      loc: {
        start: t.loc.start,
        end: i.loc.end
      }
    };
  }
  parseInt(e = !1) {
    const t = this.consume();
    return {
      kind: "Int",
      value: e ? -1 * t.value : t.value,
      loc: t.loc
    };
  }
  parseFloat(e = !1) {
    const t = this.consume();
    return {
      kind: "Float",
      value: e ? -1 * t.value : t.value,
      loc: t.loc
    };
  }
  parseBool() {
    const e = this.consume();
    return {
      kind: "Bool",
      value: e.value,
      loc: e.loc
    };
  }
  parseString() {
    const e = this.consume(), t = new w(), i = e.value.map((r) => typeof r == "string" ? r : t.parseTokens([r]).value.value.value);
    return {
      kind: "String",
      multiline: e.multiline,
      value: i,
      loc: e.loc
    };
  }
  parseInterp() {
    const e = this.consume();
    return {
      kind: "Interp",
      value: new w().parseTokens(e.value).value,
      loc: e.loc
    };
  }
  parseList() {
    const e = this.consume(), t = [];
    for (; this.cursor < this.tokens.length; ) {
      this.skipNewLines();
      const r = this.peek();
      if (r !== void 0 && r.kind === s.CloseBracket)
        break;
      const l = this.parseExpr(!1, !0);
      if (t.length > 0) {
        const a = t[t.length - 1];
        l.value.kind === "SubExpr" && a.value.kind === "SubExpr" && a.value.comments.after.length > 0 && (l.value.comments.before = a.value.comments.after, a.value.comments.after = []);
      }
      t.push(l);
    }
    const i = this.consume();
    return {
      kind: "List",
      value: t,
      loc: {
        start: e.loc.start,
        end: i.loc.end
      }
    };
  }
  parseAttrs() {
    const e = this.consume(), t = [];
    for (; this.cursor < this.tokens.length; ) {
      this.skipNewLines();
      const r = this.lookahead(() => {
        for (; this.cursor < this.tokens.length; ) {
          const a = this.peek();
          if (a.kind !== s.NewLine && a.kind !== s.Comment)
            return a;
          this.consume();
        }
      });
      if ((r == null ? void 0 : r.kind) === s.CloseCurly) {
        const a = this.parseComments();
        t.length > 0 && t[t.length - 1].comments.push(...a);
        break;
      }
      const l = this.parseAttr();
      t.push(l);
    }
    const i = this.consume();
    return {
      kind: "Attrs",
      value: t,
      recursive: !1,
      loc: {
        start: e.loc.start,
        end: i.loc.end
      }
    };
  }
  parseAttr() {
    const e = this.parseComments(), t = this.peek();
    if (t.kind === s.Keyword && t.value === "inherit") {
      this.consume();
      let a;
      const c = [];
      for (this.peek().kind === s.OpenParen && (this.consume(), a = this.parseExpr(), this.consume()); this.cursor < this.tokens.length; ) {
        const o = this.parseComments();
        if (this.peek().kind === s.Semi)
          break;
        const h = this.parseIdentifier();
        c.push({
          ...h,
          comments: o
        });
      }
      return this.consume(), {
        kind: "Attr",
        from: a,
        comments: e,
        value: c,
        loc: {
          start: t.loc.start,
          end: c[c.length - 1].loc.end
        }
      };
    }
    const i = this.parseIdentifier();
    e.push(...this.parseComments()), this.skipNewLines(), this.consume(), this.skipNewLines();
    const r = this.parseExpr(), l = this.consume();
    if (l.kind === s.CloseCurly)
      throw new Error("WTF");
    return {
      kind: "Attr",
      name: i,
      value: r,
      comments: e,
      loc: {
        start: i.loc.start,
        end: l.loc.end
      }
    };
  }
  parseIdentifier() {
    var r;
    const e = [], t = this.peek().loc;
    let i = t;
    for (; this.cursor < this.tokens.length; ) {
      const l = this.peek();
      switch (i = l.loc, l.kind) {
        case s.Identifier:
          this.consume(), e.push(l.value);
          break;
        case s.String:
          e.push(this.parseString());
          break;
        case s.Interp:
          e.push(this.parseInterp());
          break;
        default:
          throw console.log(this.tokens.slice(this.cursor - 10, this.cursor)), console.log("-----"), console.log(l), new Error(`Unknown token in identifier path: "${l.kind}"`);
      }
      if (((r = this.peek()) == null ? void 0 : r.kind) !== s.Period)
        break;
      this.consume();
    }
    return {
      kind: "Identifier",
      value: e,
      loc: {
        start: t.start,
        end: i.end
      }
    };
  }
  parseComments() {
    const e = [];
    for (; this.cursor < this.tokens.length; ) {
      this.skipNewLines();
      const t = this.peek();
      if (t.kind !== s.Comment)
        break;
      e.push({
        kind: "Comment",
        value: t.value,
        loc: t.loc
      }), this.consume();
    }
    return e;
  }
  tryParseFunction() {
    var l, a;
    if (this.lookahead(() => {
      const c = this.peek(), o = this.peek(1);
      return (c == null ? void 0 : c.kind) === s.Identifier && (o == null ? void 0 : o.kind) === s.Colon;
    })) {
      const c = this.parseIdentifier();
      this.consume();
      const o = this.parseExpr();
      return {
        kind: "Fn",
        args: {
          kind: "FnParams",
          name: c,
          loc: c.loc
        },
        body: o,
        loc: {
          start: c.loc.start,
          end: o.loc.end
        }
      };
    }
    const t = this.lookahead(() => {
      const c = this.peek(), o = this.peek(1);
      return (c == null ? void 0 : c.kind) === s.Identifier && (o == null ? void 0 : o.kind) === s.At;
    });
    let i;
    if (t && (i = this.parseIdentifier(), this.consume()), this.lookahead(() => {
      var d, u;
      let c = this.peek();
      if (c.kind !== s.OpenCurly)
        return !1;
      this.consume();
      let o = 0;
      for (; this.cursor < this.tokens.length && (c = this.peek(), c.kind === s.OpenCurly && o++, c.kind === s.CloseCurly && o--, this.consume(), o !== -1); )
        ;
      const h = ((d = this.peek()) == null ? void 0 : d.kind) === s.Colon, p = ((u = this.peek()) == null ? void 0 : u.kind) === s.At;
      return t || h ? h : p;
    })) {
      const c = {
        kind: "FnParams",
        as: i,
        value: [],
        extra: !1
      }, o = this.consume();
      for (; this.cursor < this.tokens.length; ) {
        const u = this.peek();
        if (this.skipNewLines(), u.kind === s.CloseCurly)
          break;
        if (u.kind === s.Ellipsis) {
          this.consume(), c.extra = !0, this.skipNewLines();
          break;
        }
        const m = this.parseComments(), C = this.parseIdentifier();
        let b;
        ((l = this.peek()) == null ? void 0 : l.kind) === s.Has && (this.consume(), b = this.parseExpr()), this.parseComments(), c.value.push({
          kind: "FnParam",
          name: C,
          default: b,
          comments: m,
          loc: {
            start: C.loc.start,
            end: b !== void 0 ? b.loc.end : C.loc.end
          }
        });
        const x = this.lookahead(() => {
          for (; this.cursor < this.tokens.length; ) {
            const f = this.peek();
            if ((f == null ? void 0 : f.kind) !== s.NewLine && (f == null ? void 0 : f.kind) !== s.Comment)
              return f;
            this.consume();
          }
        });
        if (x === void 0)
          throw new Error("Unexpected end of input.");
        if (x.kind !== s.Comma && x.kind !== s.CloseCurly)
          throw new Error(`Expected comma or closed curly brace, but got: "${x.kind}"`);
        this.skipNewLines(), x.kind === s.Comma && this.consume(), this.skipNewLines();
      }
      const h = this.consume(), p = ((a = this.peek()) == null ? void 0 : a.kind) === s.At;
      p && (this.consume(), c.as = this.parseIdentifier()), p ? c.loc = {
        start: o.loc.start,
        end: c.as.loc.end
      } : c.as ? c.loc = {
        start: c.as.loc.start,
        end: h.loc.end
      } : c.loc = {
        start: o.loc.start,
        end: h.loc.end
      }, this.consume();
      const d = this.parseExpr();
      return {
        kind: "Fn",
        args: c,
        body: d,
        loc: {
          start: c.loc.start,
          end: d.loc.end
        }
      };
    }
  }
  parseModifiers() {
    const e = [];
    for (; this.cursor < this.tokens.length; ) {
      this.skipNewLines();
      const t = this.peek();
      if ((t == null ? void 0 : t.kind) !== s.Keyword || (t == null ? void 0 : t.value) !== "with" && (t == null ? void 0 : t.value) !== "assert")
        break;
      switch (t.value) {
        case "with": {
          this.consume();
          const i = this.parseExpr(), r = this.consume();
          e.push({
            kind: "Modifier",
            action: "with",
            value: i,
            loc: {
              start: t.loc.start,
              end: r.loc.end
            }
          });
          break;
        }
        case "assert": {
          this.consume();
          const i = this.parseExpr(), r = this.consume();
          e.push({
            kind: "Modifier",
            action: "assert",
            value: i,
            loc: {
              start: t.loc.start,
              end: r.loc.end
            }
          });
          break;
        }
      }
    }
    return e;
  }
  parsePath() {
    const e = this.consume();
    return {
      kind: "Path",
      value: e.value,
      loc: e.loc
    };
  }
  parseKeyword() {
    const e = this.peek();
    switch (e.value) {
      case "let": {
        this.consume();
        const t = [];
        for (; this.cursor < this.tokens.length; ) {
          this.skipNewLines();
          const r = this.lookahead(() => {
            for (; this.cursor < this.tokens.length; ) {
              const a = this.peek();
              if (a.kind !== s.NewLine && a.kind !== s.Comment)
                return a;
              this.consume();
            }
          });
          if (r !== void 0 && (r == null ? void 0 : r.kind) === s.Keyword && r.value === "in") {
            const a = this.parseComments();
            t.length > 0 && t[t.length - 1].comments.push(...a);
            break;
          }
          const l = this.parseAttr();
          t.push(l);
        }
        this.consume();
        const i = this.parseExpr();
        return {
          kind: "LetIn",
          bindings: t,
          body: i,
          loc: {
            start: e.loc.start,
            end: i.loc.end
          }
        };
      }
      case "import": {
        this.consume();
        const t = this.parseExpr(!0);
        return {
          kind: "Import",
          value: t,
          loc: {
            start: e.loc.start,
            end: t.loc.end
          }
        };
      }
      case "if": {
        this.consume(), this.skipNewLines();
        const t = this.parseExpr();
        this.skipNewLines(), this.consume(), this.skipNewLines();
        const i = this.parseExpr();
        this.skipNewLines(), this.consume(), this.skipNewLines();
        const r = this.parseExpr();
        return {
          kind: "Conditional",
          condition: t,
          then: i,
          else: r,
          loc: {
            start: e.loc.start,
            end: r.loc.end
          }
        };
      }
      case "rec": {
        this.consume();
        const t = this.parseAttrs();
        return t.recursive = !0, t.loc.start = e.loc.start, t;
      }
      default:
        throw new Error(`Unexpected keyword: ${e.value}`);
    }
  }
  parseNull() {
    return {
      kind: "Null",
      loc: this.consume().loc
    };
  }
}
export {
  g as Lexer,
  L as NodeKind,
  w as Parser,
  s as TokenKind,
  I as isAttrBinding,
  A as isDestructuredFnParams,
  O as isIdentifierFnParams,
  S as isInheritBinding,
  P as precedence
};
