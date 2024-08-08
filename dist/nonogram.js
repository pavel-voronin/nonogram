var G = Object.defineProperty;
var R = (m, h, t) => h in m ? G(m, h, { enumerable: !0, configurable: !0, writable: !0, value: t }) : m[h] = t;
var d = (m, h, t) => R(m, typeof h != "symbol" ? h + "" : h, t);
const u = {
  greyVeryLight: "#ccc",
  grey: "#555",
  greyVeryDark: "#111",
  blue: "#0ebeff",
  green: "#47cf73",
  violet: "#ae63e4",
  yellow: "#fcd000",
  red: "#ff3c41"
}, c = {
  EMPTY: 0,
  FILLED: 1,
  UNSET: 2,
  TEMP_FILLED: 3,
  TEMP_EMPTY: 4,
  INCONSTANT: 5
};
function X(m, h) {
  return m.length === h.length && m.every((t, i) => t === h[i]);
}
class y {
  constructor() {
    d(this, "theme");
    d(this, "canvas");
    d(this, "ctx");
    d(this, "listeners", []);
    d(this, "m", 0);
    d(this, "n", 0);
    d(this, "grid", []);
    d(this, "hints", { row: [], column: [] });
    this.theme = {
      filledColor: u.grey,
      unsetColor: u.greyVeryLight,
      correctColor: u.green,
      wrongColor: u.red,
      meshColor: u.yellow,
      isMeshed: !1,
      isBoldMeshOnly: !1,
      isMeshOnTop: !1,
      boldMeshGap: 5
    };
  }
  initCanvas(h) {
    let t = h instanceof HTMLCanvasElement ? h : document.getElementById(h);
    t instanceof HTMLCanvasElement || (t = document.createElement("canvas")), this.canvas = t, this.canvas.nonogram && this.canvas.nonogram.listeners.forEach(([i, s]) => {
      this.canvas.removeEventListener(i, s);
    }), this.canvas.nonogram = this, this.canvas.width = this.theme.width || this.canvas.clientWidth, this.canvas.height = this.canvas.width * (this.m + 1) / (this.n + 1), this.ctx = this.canvas.getContext("2d") || new CanvasRenderingContext2D(), this.initListeners(), this.listeners.forEach(([i, s]) => {
      this.canvas.addEventListener(i, s);
    }), this.canvas.oncontextmenu = (i) => {
      i.preventDefault();
    };
  }
  initListeners() {
    this.listeners = [];
  }
  removeNonPositiveHints() {
    function h(t, i, s) {
      s[i] = t.filter((e) => e > 0);
    }
    this.hints.row.forEach(h), this.hints.column.forEach(h);
  }
  getSingleLine(h, t) {
    const i = [];
    if (h === "row")
      for (let s = 0; s < this.n; s += 1)
        i[s] = this.grid[t][s];
    else if (h === "column")
      for (let s = 0; s < this.m; s += 1)
        i[s] = this.grid[s][t];
    return i;
  }
  calculateHints(h, t) {
    const i = [];
    return this.getSingleLine(h, t).reduce((e, n) => {
      if (n === c.FILLED)
        i.push(e ? i.pop() + 1 : 1);
      else if (n !== c.EMPTY)
        throw new Error();
      return n === c.FILLED;
    }, !1), i;
  }
  isLineCorrect(h, t) {
    try {
      return X(this.calculateHints(h, t), this.hints[h][t]);
    } catch {
      return !1;
    }
  }
  getLocation(h, t) {
    const i = this.canvas.getBoundingClientRect(), s = i.width, e = i.height, n = s * 2 / 3, o = e * 2 / 3, r = n / (this.n + 1);
    return h < 0 || h >= s || t < 0 || t >= e ? "outside" : h >= 0 && h <= n && t >= 0 && t < o ? r / 2 <= h && h < n - r / 2 && r / 2 <= t && t < o - r / 2 ? "grid" : "limbo" : n <= h && h < s && o <= t && t < e ? "controller" : "hints";
  }
  print() {
    this.printGrid(), this.printHints(), this.printController();
  }
  printGrid() {
    const { ctx: h } = this, { width: t, height: i } = this.canvas, s = t * 2 / 3 / (this.n + 1);
    h.clearRect(-1, -1, t * 2 / 3 + 1, i * 2 / 3 + 1), this.theme.isMeshed && !this.theme.isMeshOnTop && this.printMesh(), h.save(), h.translate(s / 2, s / 2);
    for (let e = 0; e < this.m; e += 1)
      for (let n = 0; n < this.n; n += 1)
        h.save(), h.translate(s * n, s * e), this.printCell(this.grid[e][n]), h.restore();
    h.restore(), this.theme.isMeshed && this.theme.isMeshOnTop && this.printMesh();
  }
  printCell(h) {
    const { ctx: t } = this, i = this.canvas.width * 2 / 3 / (this.n + 1);
    switch (h) {
      case c.UNSET:
        t.fillStyle = this.theme.unsetColor, t.fillRect(i * 0.05, i * 0.05, i * 0.9, i * 0.9);
        break;
      case c.FILLED:
        t.fillStyle = this.theme.filledColor, t.fillRect(-i * 0.05, -i * 0.05, i * 1.1, i * 1.1);
        break;
    }
  }
  printMesh() {
    const { ctx: h } = this, t = this.canvas.width * 2 / 3 / (this.n + 1);
    h.save(), h.translate(t / 2, t / 2), h.beginPath();
    for (let i = 1; i < this.m; i += 1)
      this.theme.isBoldMeshOnly || (h.moveTo(0, i * t), h.lineTo(this.n * t, i * t)), i % this.theme.boldMeshGap === 0 && (h.moveTo(0, i * t), h.lineTo(this.n * t, i * t), this.theme.isBoldMeshOnly || (h.moveTo(0, i * t - 1), h.lineTo(this.n * t, i * t - 1), h.moveTo(0, i * t + 1), h.lineTo(this.n * t, i * t + 1)));
    for (let i = 1; i < this.n; i += 1)
      this.theme.isBoldMeshOnly || (h.moveTo(i * t, 0), h.lineTo(i * t, this.m * t)), i % this.theme.boldMeshGap === 0 && (h.moveTo(i * t, 0), h.lineTo(i * t, this.m * t), this.theme.isBoldMeshOnly || (h.moveTo(i * t - 1, 0), h.lineTo(i * t - 1, this.m * t), h.moveTo(i * t + 1, 0), h.lineTo(i * t + 1, this.m * t)));
    h.lineWidth = 1, h.strokeStyle = this.theme.meshColor, h.stroke(), h.restore();
  }
  printHints() {
    const { ctx: h } = this, { width: t, height: i } = this.canvas, s = t * 2 / 3 / (this.n + 1);
    h.clearRect(t * 2 / 3 - 1, -1, t * 3 + 1, i * 2 / 3 + 1), h.clearRect(-1, i * 2 / 3 - 1, t * 2 / 3 + 1, i / 3 + 1), h.save(), h.translate(s / 2, s / 2);
    for (let e = 0; e < this.m; e += 1) {
      for (let n = 0; n < this.hints.row[e].length; n += 1)
        this.printSingleHint("row", e, n);
      this.hints.row[e].length === 0 && this.printSingleHint("row", e, 0);
    }
    for (let e = 0; e < this.n; e += 1) {
      for (let n = 0; n < this.hints.column[e].length; n += 1)
        this.printSingleHint("column", e, n);
      this.hints.column[e].length === 0 && this.printSingleHint("column", e, 0);
    }
    h.restore();
  }
  printSingleHint(h, t, i) {
    const { ctx: s } = this, { width: e, height: n } = this.canvas, o = e * 2 / 3 / (this.n + 1);
    s.textAlign = "center", s.textBaseline = "middle", s.font = `${o}pt "Courier New", Inconsolata, Consolas, monospace`;
    const r = this.hints[h][t];
    s.fillStyle = r.isCorrect ? this.theme.correctColor : this.theme.wrongColor, s.globalAlpha = !r.isCorrect && r.unchanged ? 0.5 : 1, h === "row" ? s.fillText(
      `${this.hints.row[t][i] || 0}`,
      e * 2 / 3 + o * i,
      o * (t + 0.5),
      o * 0.8
    ) : h === "column" && s.fillText(
      `${this.hints.column[t][i] || 0}`,
      o * (t + 0.5),
      n * 2 / 3 + o * i,
      o * 0.8
    );
  }
}
const L = "dmFyIGQ9T2JqZWN0LmRlZmluZVByb3BlcnR5O3ZhciBMPSh0LHUsYyk9PnUgaW4gdD9kKHQsdSx7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6Y30pOnRbdV09Yzt2YXIgbD0odCx1LGMpPT5MKHQsdHlwZW9mIHUhPSJzeW1ib2wiP3UrIiI6dSxjKTsoZnVuY3Rpb24oKXsidXNlIHN0cmljdCI7Y29uc3QgdD17RU1QVFk6MCxGSUxMRUQ6MSxVTlNFVDoyLFRFTVBfRklMTEVEOjMsVEVNUF9FTVBUWTo0LElOQ09OU1RBTlQ6NX0sdT1nPT5nLnJlZHVjZSgocyxpKT0+cytpLDApLGM9bmV3IE1hcDtjLnNldCh0LlRFTVBfRklMTEVELHQuRklMTEVEKSxjLnNldCh0LlRFTVBfRU1QVFksdC5FTVBUWSksYy5zZXQodC5JTkNPTlNUQU5ULHQuVU5TRVQpO2Z1bmN0aW9uIGYoZyxzKXtyZXR1cm4gZy5sZW5ndGg9PT1zLmxlbmd0aCYmZy5ldmVyeSgoaSxlKT0+aT09PXNbZV0pfWNsYXNzIEV7Y29uc3RydWN0b3Iocyl7bCh0aGlzLCJncmlkIik7bCh0aGlzLCJoaW50cyIpO2wodGhpcywiaXNFcnJvciIsITEpO2wodGhpcywic2Nhbm5lciIpO2wodGhpcywiY3VycmVudEhpbnRzIixbXSk7bCh0aGlzLCJjdXJyZW50TGluZSIsW10pO2wodGhpcywiZGVsYXkiKTtsKHRoaXMsIm1lc3NhZ2UiKTtsKHRoaXMsInBvc3NpYmxlQmxhbmtzIik7bCh0aGlzLCJzY2FuIiwoKT0+e2lmKCF0aGlzLnVwZGF0ZVNjYW5uZXIoKSlyZXR1cm47dGhpcy5kZWxheSYmKHRoaXMubWVzc2FnZT17dHlwZToidXBkYXRlIixncmlkOnRoaXMuZ3JpZCxzY2FubmVyOnRoaXMuc2Nhbm5lcixoaW50czp0aGlzLmhpbnRzfSxwb3N0TWVzc2FnZSh0aGlzLm1lc3NhZ2UpKSx0aGlzLmlzRXJyb3I9ITA7Y29uc3R7ZGlyZWN0aW9uOnMsaX09dGhpcy5zY2FubmVyO2lmKHRoaXMuY3VycmVudEhpbnRzPXRoaXMuaGludHNbc11baV0sdGhpcy5jdXJyZW50SGludHMudW5jaGFuZ2VkPSEwLHRoaXMuY3VycmVudExpbmU9dGhpcy5nZXRTaW5nbGVMaW5lKHMsaSksdGhpcy5jdXJyZW50TGluZS5ldmVyeShuPT5uIT09dC5VTlNFVCl8fCh0aGlzLnNvbHZlU2luZ2xlTGluZSgpLHRoaXMuc2V0QmFja1RvR3JpZCh0aGlzLmN1cnJlbnRMaW5lKSksdGhpcy5pc0xpbmVDb3JyZWN0KHMsaSkmJih0aGlzLmhpbnRzW3NdW2ldLmlzQ29ycmVjdD0hMCx0aGlzLmlzRXJyb3I9ITEpLHRoaXMuaXNFcnJvcil7dGhpcy5tZXNzYWdlPXt0eXBlOiJlcnJvciIsZ3JpZDp0aGlzLmdyaWQsc2Nhbm5lcjp0aGlzLnNjYW5uZXIsaGludHM6dGhpcy5oaW50c30scG9zdE1lc3NhZ2UodGhpcy5tZXNzYWdlKTtyZXR1cm59dGhpcy5kZWxheT9zZXRUaW1lb3V0KHRoaXMuc2Nhbix0aGlzLmRlbGF5KTp0aGlzLnNjYW4oKX0pO3RoaXMuaGludHM9cy5oaW50cyx0aGlzLmRlbGF5PXMuZGVsYXksdGhpcy5ncmlkPXMuZ3JpZCx0aGlzLnNjYW5uZXI9e2RpcmVjdGlvbjoicm93IixpOi0xfSx0aGlzLnBvc3NpYmxlQmxhbmtzPXtyb3c6W10sY29sdW1uOltdfSx0aGlzLnNjYW4oKX1nZXRTaW5nbGVMaW5lKHMsaSl7Y29uc3QgZT1bXSxuPXRoaXMuZ3JpZC5sZW5ndGgsaD10aGlzLmdyaWQubGVuZ3RoJiZ0aGlzLmdyaWRbMF0ubGVuZ3RoO2lmKHM9PT0icm93Iilmb3IobGV0IHI9MDtyPGg7cis9MSllW3JdPXRoaXMuZ3JpZFtpXVtyXTtlbHNlIGlmKHM9PT0iY29sdW1uIilmb3IobGV0IHI9MDtyPG47cis9MSllW3JdPXRoaXMuZ3JpZFtyXVtpXTtyZXR1cm4gZX1jYWxjdWxhdGVIaW50cyhzLGkpe2NvbnN0IGU9W107cmV0dXJuIHRoaXMuZ2V0U2luZ2xlTGluZShzLGkpLnJlZHVjZSgoaCxyKT0+e2lmKHI9PT10LkZJTExFRCllLnB1c2goaD9lLnBvcCgpKzE6MSk7ZWxzZSBpZihyIT09dC5FTVBUWSl0aHJvdyBuZXcgRXJyb3I7cmV0dXJuIHI9PT10LkZJTExFRH0sITEpLGV9aXNMaW5lQ29ycmVjdChzLGkpe3RyeXtyZXR1cm4gZih0aGlzLmNhbGN1bGF0ZUhpbnRzKHMsaSksdGhpcy5oaW50c1tzXVtpXSl9Y2F0Y2h7cmV0dXJuITF9fXVwZGF0ZVNjYW5uZXIoKXtsZXQgcztkbyBpZih0aGlzLmlzRXJyb3I9ITEsdGhpcy5zY2FubmVyLmkrPTEsdGhpcy5oaW50c1t0aGlzLnNjYW5uZXIuZGlyZWN0aW9uXVt0aGlzLnNjYW5uZXIuaV09PT12b2lkIDAmJih0aGlzLnNjYW5uZXIuZGlyZWN0aW9uPXRoaXMuc2Nhbm5lci5kaXJlY3Rpb249PT0icm93Ij8iY29sdW1uIjoicm93Iix0aGlzLnNjYW5uZXIuaT0wKSxzPXRoaXMuaGludHNbdGhpcy5zY2FubmVyLmRpcmVjdGlvbl1bdGhpcy5zY2FubmVyLmldLHRoaXMuaGludHMucm93LmV2ZXJ5KGk9PiEhaS51bmNoYW5nZWQpJiZ0aGlzLmhpbnRzLmNvbHVtbi5ldmVyeShpPT4hIWkudW5jaGFuZ2VkKSlyZXR1cm4gdGhpcy5tZXNzYWdlPXt0eXBlOiJmaW5pc2giLGdyaWQ6dGhpcy5ncmlkLGhpbnRzOnRoaXMuaGludHN9LHBvc3RNZXNzYWdlKHRoaXMubWVzc2FnZSksITE7d2hpbGUocy5pc0NvcnJlY3R8fHMudW5jaGFuZ2VkKTtyZXR1cm4hMH1zZXRCYWNrVG9HcmlkKHMpe2NvbnN0e2RpcmVjdGlvbjppLGk6ZX09dGhpcy5zY2FubmVyO2k9PT0icm93Ij9zLmZvckVhY2goKG4saCk9PntjLmhhcyhuKSYmdGhpcy5ncmlkW2VdW2hdIT09Yy5nZXQobikmJih0aGlzLmdyaWRbZV1baF09Yy5nZXQobiksdGhpcy5oaW50cy5jb2x1bW5baF0udW5jaGFuZ2VkPSExKX0pOmk9PT0iY29sdW1uIiYmcy5mb3JFYWNoKChuLGgpPT57Yy5oYXMobikmJnRoaXMuZ3JpZFtoXVtlXSE9PWMuZ2V0KG4pJiYodGhpcy5ncmlkW2hdW2VdPWMuZ2V0KG4pLHRoaXMuaGludHMucm93W2hdLnVuY2hhbmdlZD0hMSl9KX1zb2x2ZVNpbmdsZUxpbmUoKXt0aGlzLmlzRXJyb3I9ITA7Y29uc3R7ZGlyZWN0aW9uOnMsaX09dGhpcy5zY2FubmVyO3RoaXMucG9zc2libGVCbGFua3Nbc11baV09PT12b2lkIDAmJih0aGlzLnBvc3NpYmxlQmxhbmtzW3NdW2ldPVtdLHRoaXMuZmluZEFsbCh0aGlzLmN1cnJlbnRMaW5lLmxlbmd0aC11KHRoaXMuY3VycmVudEhpbnRzKSsxKSksdGhpcy5tZXJnZSgpfWZpbmRBbGwocyxpPVtdLGU9MCl7aWYoZT09PXRoaXMuY3VycmVudEhpbnRzLmxlbmd0aCl7Y29uc3Qgbj1pLnNsaWNlKDAsdGhpcy5jdXJyZW50SGludHMubGVuZ3RoKTtuWzBdLT0xO2NvbnN0e2RpcmVjdGlvbjpoLGk6cn09dGhpcy5zY2FubmVyO3RoaXMucG9zc2libGVCbGFua3NbaF1bcl0mJnRoaXMucG9zc2libGVCbGFua3NbaF1bcl0ucHVzaChuKX1mb3IobGV0IG49MTtuPD1zO24rPTEpaVtlXT1uLHRoaXMuZmluZEFsbChzLWlbZV0saSxlKzEpfW1lcmdlKCl7Y29uc3R7ZGlyZWN0aW9uOnMsaX09dGhpcy5zY2FubmVyLGU9dGhpcy5wb3NzaWJsZUJsYW5rc1tzXVtpXTtlLmZvckVhY2goKG4saCk9Pntjb25zdCByPVtdO2ZvcihsZXQgYT0wO2E8dGhpcy5jdXJyZW50SGludHMubGVuZ3RoO2ErPTEpci5wdXNoKC4uLm5ldyBBcnJheShuW2FdKS5maWxsKHQuVEVNUF9FTVBUWSkpLHIucHVzaCguLi5uZXcgQXJyYXkodGhpcy5jdXJyZW50SGludHNbYV0pLmZpbGwodC5URU1QX0ZJTExFRCkpO2lmKHIucHVzaCguLi5uZXcgQXJyYXkodGhpcy5jdXJyZW50TGluZS5sZW5ndGgtci5sZW5ndGgpLmZpbGwodC5URU1QX0VNUFRZKSksci5zb21lKChhLG8pPT5hPT09dC5URU1QX0VNUFRZJiZ0aGlzLmN1cnJlbnRMaW5lW29dPT09dC5GSUxMRUR8fGE9PT10LlRFTVBfRklMTEVEJiZ0aGlzLmN1cnJlbnRMaW5lW29dPT09dC5FTVBUWSkpe2RlbGV0ZSBlW2hdO3JldHVybn10aGlzLmlzRXJyb3I9ITEsci5mb3JFYWNoKChhLG8pPT57YT09PXQuVEVNUF9GSUxMRUQ/dGhpcy5jdXJyZW50TGluZVtvXT09PXQuVEVNUF9FTVBUWT90aGlzLmN1cnJlbnRMaW5lW29dPXQuSU5DT05TVEFOVDp0aGlzLmN1cnJlbnRMaW5lW29dPT09dC5VTlNFVCYmKHRoaXMuY3VycmVudExpbmVbb109dC5URU1QX0ZJTExFRCk6YT09PXQuVEVNUF9FTVBUWSYmKHRoaXMuY3VycmVudExpbmVbb109PT10LlRFTVBfRklMTEVEP3RoaXMuY3VycmVudExpbmVbb109dC5JTkNPTlNUQU5UOnRoaXMuY3VycmVudExpbmVbb109PT10LlVOU0VUJiYodGhpcy5jdXJyZW50TGluZVtvXT10LlRFTVBfRU1QVFkpKX0pfSksdGhpcy5wb3NzaWJsZUJsYW5rc1tzXVtpXT1lLmZpbHRlcihuPT5uKX19b25tZXNzYWdlPSh7ZGF0YTpnfSk9PntuZXcgRShnKX19KSgpOwo=", M = (m) => Uint8Array.from(atob(m), (h) => h.charCodeAt(0)), g = typeof self < "u" && self.Blob && new Blob([M(L)], { type: "text/javascript;charset=utf-8" });
function Z(m) {
  let h;
  try {
    if (h = g && (self.URL || self.webkitURL).createObjectURL(g), !h) throw "";
    const t = new Worker(h, {
      name: m == null ? void 0 : m.name
    });
    return t.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(h);
    }), t;
  } catch {
    return new Worker(
      "data:text/javascript;base64," + L,
      {
        name: m == null ? void 0 : m.name
      }
    );
  } finally {
    h && (self.URL || self.webkitURL).revokeObjectURL(h);
  }
}
class C extends y {
  constructor(t, i, s, { theme: e = {}, delay: n = 50, onSuccess: o = () => {
  }, onError: r = () => {
  } } = {}) {
    super();
    d(this, "worker");
    d(this, "delay");
    d(this, "handleSuccess");
    d(this, "handleError");
    d(this, "isBusy", !1);
    d(this, "isError", !1);
    d(this, "scanner");
    d(this, "startTime", 0);
    d(this, "click", (t) => {
      if (this.isBusy) return;
      const i = this.canvas.getBoundingClientRect(), s = t.clientX - i.left, e = t.clientY - i.top, n = i.width * 2 / 3 / (this.n + 1), o = this.getLocation(s, e);
      if (o === "grid") {
        if (this.isError) return;
        const r = Math.floor(e / n - 0.5), l = Math.floor(s / n - 0.5);
        this.grid[r][l] === c.UNSET && (this.grid[r][l] = c.FILLED, this.hints.row[r].unchanged = !1, this.hints.column[l].unchanged = !1, this.solve());
      } else o === "controller" && this.refresh();
    });
    this.worker = new Z(), this.theme.filledColor = u.green, this.theme.correctColor = u.green, this.theme.wrongColor = u.yellow, Object.assign(this.theme, e), this.delay = n, this.handleSuccess = o, this.handleError = r, this.hints = {
      row: t.slice(),
      column: i.slice()
    }, this.removeNonPositiveHints(), this.m = this.hints.row.length, this.n = this.hints.column.length, this.grid = new Array(this.m);
    for (let l = 0; l < this.m; l += 1)
      this.grid[l] = new Array(this.n).fill(c.UNSET);
    this.initCanvas(s), this.print();
  }
  initListeners() {
    this.listeners = [["click", this.click]];
  }
  refresh() {
    this.grid = new Array(this.m);
    for (let t = 0; t < this.m; t += 1)
      this.grid[t] = new Array(this.n).fill(c.UNSET);
    this.hints.row.forEach((t) => {
      t.isCorrect = !1, t.unchanged = !1;
    }), this.hints.column.forEach((t) => {
      t.isCorrect = !1, t.unchanged = !1;
    }), this.solve();
  }
  solve() {
    this.isBusy || (this.print(), this.isBusy = !0, this.startTime = Date.now(), this.worker.onmessage = ({ data: t }) => {
      if (this.canvas.nonogram !== this) {
        this.worker.terminate();
        return;
      }
      if (this.scanner = t.scanner, this.grid = t.grid, this.hints = t.hints, t.type !== "update")
        if (this.isBusy = !1, t.type === "error") {
          this.isError = !0;
          const { direction: i, i: s } = this.scanner;
          this.handleError(new Error(`Bad hints at ${i} ${s + 1}`));
        } else t.type === "finish" && (this.isError = !1, this.handleSuccess(Date.now() - this.startTime));
      this.print();
    }, this.worker.postMessage({
      delay: this.delay,
      grid: this.grid,
      hints: this.hints
    }));
  }
  print() {
    this.printGrid(), this.printHints(), this.printScanner(), this.printController();
  }
  printController() {
    const { ctx: t } = this, { width: i, height: s } = this.canvas, e = Math.min(i, s) / 4, n = this.theme.filledColor;
    function o() {
      const r = document.createElement("canvas"), l = e / 10;
      r.width = e, r.height = e;
      const a = r.getContext("2d") || new CanvasRenderingContext2D();
      return a.translate(e / 2, e / 2), a.rotate(Math.PI), a.arc(
        0,
        0,
        e / 2 - l / 2,
        Math.PI / 2,
        Math.PI / 3.9
      ), a.lineWidth = l, a.strokeStyle = n, a.stroke(), a.beginPath(), a.moveTo(
        (e / 2 + l) * Math.SQRT1_2,
        (e / 2 + l) * Math.SQRT1_2
      ), a.lineTo(
        (e / 2 - l * 2) * Math.SQRT1_2,
        (e / 2 - l * 2) * Math.SQRT1_2
      ), a.lineTo(
        (e / 2 - l * 2) * Math.SQRT1_2,
        (e / 2 + l) * Math.SQRT1_2
      ), a.closePath(), a.fillStyle = n, a.fill(), r;
    }
    t.clearRect(i * 2 / 3 - 1, s * 2 / 3 - 1, i / 3 + 1, s / 3 + 1), !this.isBusy && (t.save(), t.translate(i * 0.7, s * 0.7), t.drawImage(o(), 0, 0), t.restore());
  }
  printScanner() {
    if (!this.scanner) return;
    const { ctx: t } = this, { width: i, height: s } = this.canvas, e = i * 2 / 3 / (this.n + 1);
    t.save(), t.translate(e / 2, e / 2), t.fillStyle = this.isError ? this.theme.wrongColor : this.theme.correctColor, t.globalAlpha = 0.5, this.scanner.direction === "row" ? t.fillRect(0, e * this.scanner.i, i, e) : this.scanner.direction === "column" && t.fillRect(e * this.scanner.i, 0, e, s), t.restore();
  }
}
class W extends y {
  constructor(t, i, s, { theme: e = {}, grid: n = [], threshold: o = 0.5, onHintChange: r = () => {
  } } = {}) {
    super();
    d(this, "threshold");
    d(this, "handleHintChange");
    d(this, "draw");
    d(this, "isPressed");
    d(this, "mousedown", (t) => {
      const i = this.canvas.getBoundingClientRect(), s = t.clientX - i.left, e = t.clientY - i.top, n = i.width * 2 / 3 / (this.n + 1), o = this.getLocation(s, e);
      if (o === "controller")
        this.refresh();
      else if (o === "grid") {
        this.draw.firstI = Math.floor(e / n - 0.5), this.draw.firstJ = Math.floor(s / n - 0.5);
        const r = this.grid[this.draw.firstI][this.draw.firstJ];
        this.draw.brush = r === c.FILLED ? c.EMPTY : c.FILLED, this.isPressed = !0, this.paintCell(this.draw.firstI, this.draw.firstJ), this.draw.lastI = this.draw.firstI, this.draw.lastJ = this.draw.firstJ;
      }
    });
    d(this, "mousemove", (t) => {
      if (this.isPressed) {
        const i = this.canvas.getBoundingClientRect(), s = t.clientX - i.left, e = t.clientY - i.top, n = i.width * 2 / 3 / (this.n + 1);
        if (this.getLocation(s, e) === "grid") {
          const o = Math.floor(e / n - 0.5), r = Math.floor(s / n - 0.5);
          (o !== this.draw.lastI || r !== this.draw.lastJ) && (this.draw.direction === void 0 && (o === this.draw.firstI ? this.draw.direction = "row" : r === this.draw.firstJ && (this.draw.direction = "column")), (this.draw.direction === "row" && o === this.draw.firstI || this.draw.direction === "column" && r === this.draw.firstJ) && (this.paintCell(o, r), this.draw.lastI = o, this.draw.lastJ = r));
        }
      }
    });
    d(this, "brushUp", () => {
      delete this.isPressed, this.draw = {};
    });
    this.theme.filledColor = u.violet, this.theme.correctColor = u.violet, Object.assign(this.theme, e), this.threshold = o, this.handleHintChange = r, this.m = t, this.n = i, this.grid = new Array(this.m);
    for (let l = 0; l < this.m; l += 1) {
      this.grid[l] = new Array(this.n);
      for (let a = 0; a < this.n; a += 1)
        n.length ? this.grid[l][a] = n[l] && n[l][a] ? c.FILLED : c.EMPTY : this.grid[l][a] = Math.random() < this.threshold ? c.FILLED : c.EMPTY;
    }
    this.hints = {
      row: new Array(t),
      column: new Array(i)
    };
    for (let l = 0; l < this.m; l += 1)
      this.hints.row[l] = this.calculateHints("row", l), this.hints.row[l].isCorrect = !0;
    for (let l = 0; l < this.n; l += 1)
      this.hints.column[l] = this.calculateHints("column", l), this.hints.column[l].isCorrect = !0;
    this.initCanvas(s), this.draw = {}, this.print(), this.handleHintChange(this.hints.row, this.hints.column);
  }
  initListeners() {
    this.listeners = [
      ["mousedown", this.mousedown],
      ["mousemove", this.mousemove],
      ["mouseup", this.brushUp],
      ["mouseleave", this.brushUp]
    ];
  }
  paintCell(t, i) {
    this.grid[t][i] = this.draw.brush, this.hints.row[t] = this.calculateHints("row", t), this.hints.row[t].isCorrect = !0, this.hints.column[i] = this.calculateHints("column", i), this.hints.column[i].isCorrect = !0, this.print(), this.handleHintChange(this.hints.row, this.hints.column);
  }
  refresh() {
    for (let t = 0; t < this.m; t += 1)
      for (let i = 0; i < this.n; i += 1)
        this.grid[t][i] = Math.random() < this.threshold ? c.FILLED : c.EMPTY;
    for (let t = 0; t < this.m; t += 1)
      this.hints.row[t] = this.calculateHints("row", t), this.hints.row[t].isCorrect = !0;
    for (let t = 0; t < this.n; t += 1)
      this.hints.column[t] = this.calculateHints("column", t), this.hints.column[t].isCorrect = !0;
    this.print(), this.handleHintChange(this.hints.row, this.hints.column);
  }
  printController() {
    const { ctx: t } = this, { width: i, height: s } = this.canvas, e = Math.min(i, s) / 4, n = this.theme.filledColor;
    function o() {
      const r = document.createElement("canvas"), l = e / 10;
      r.width = e, r.height = e;
      const a = r.getContext("2d") || new CanvasRenderingContext2D();
      return a.translate(e / 2, e / 2), a.arc(
        0,
        0,
        e / 2 - l / 2,
        Math.PI / 2,
        Math.PI / 3.9
      ), a.lineWidth = l, a.strokeStyle = n, a.stroke(), a.beginPath(), a.moveTo(
        (e / 2 + l) * Math.SQRT1_2,
        (e / 2 + l) * Math.SQRT1_2
      ), a.lineTo(
        (e / 2 - l * 2) * Math.SQRT1_2,
        (e / 2 - l * 2) * Math.SQRT1_2
      ), a.lineTo(
        (e / 2 - l * 2) * Math.SQRT1_2,
        (e / 2 + l) * Math.SQRT1_2
      ), a.closePath(), a.fillStyle = n, a.fill(), r;
    }
    t.clearRect(i * 2 / 3 - 1, s * 2 / 3 - 1, i / 3 + 1, s / 3 + 1), t.save(), t.translate(i * 0.7, s * 0.7), t.drawImage(o(), 0, 0), t.restore();
  }
}
class E extends y {
  constructor(t, i, s, { theme: e = {}, onSuccess: n = () => {
  }, onAnimationEnd: o = () => {
  } } = {}) {
    super();
    d(this, "handleSuccess");
    d(this, "handleAnimationEnd");
    d(this, "brush", c.FILLED);
    d(this, "draw", {});
    d(this, "isPressed", !1);
    d(this, "mousedown", (t) => {
      const i = this.canvas.getBoundingClientRect(), s = t.clientX - i.left, e = t.clientY - i.top, n = i.width * 2 / 3 / (this.n + 1), o = this.getLocation(s, e);
      if (o === "controller")
        this.switchBrush();
      else if (o === "grid") {
        this.draw.firstI = Math.floor(e / n - 0.5), this.draw.firstJ = Math.floor(s / n - 0.5), this.draw.inverted = t.button === 2;
        const r = this.grid[this.draw.firstI][this.draw.firstJ];
        let l = this.brush;
        this.draw.inverted && (l = this.brush === c.FILLED ? c.EMPTY : c.FILLED), (r === c.UNSET || l === r) && (this.draw.mode = l === r ? "empty" : "filling", this.isPressed = !0, this.switchCell(this.draw.firstI, this.draw.firstJ)), this.draw.lastI = this.draw.firstI, this.draw.lastJ = this.draw.firstJ;
      }
    });
    d(this, "mousemove", (t) => {
      if (this.isPressed) {
        const i = this.canvas.getBoundingClientRect(), s = t.clientX - i.left, e = t.clientY - i.top, n = i.width * 2 / 3 / (this.n + 1);
        if (this.getLocation(s, e) === "grid") {
          const o = Math.floor(e / n - 0.5), r = Math.floor(s / n - 0.5);
          (o !== this.draw.lastI || r !== this.draw.lastJ) && (this.draw.direction === void 0 && (o === this.draw.firstI ? this.draw.direction = "row" : r === this.draw.firstJ && (this.draw.direction = "column")), (this.draw.direction === "row" && o === this.draw.firstI || this.draw.direction === "column" && r === this.draw.firstJ) && (this.switchCell(o, r), this.draw.lastI = o, this.draw.lastJ = r));
        }
      }
    });
    d(this, "brushUp", () => {
      this.isPressed = !1, this.draw = {};
    });
    this.theme.filledColor = u.blue, this.theme.wrongColor = u.grey, this.theme.isMeshed = !0, Object.assign(this.theme, e), this.handleSuccess = n, this.handleAnimationEnd = o, this.hints = {
      row: t.slice(),
      column: i.slice()
    }, this.removeNonPositiveHints(), this.m = this.hints.row.length, this.n = this.hints.column.length, this.grid = new Array(this.m);
    for (let r = 0; r < this.m; r += 1)
      this.grid[r] = new Array(this.n).fill(c.UNSET);
    this.hints.row.forEach((r, l) => {
      r.isCorrect = this.isLineCorrect("row", l);
    }), this.hints.column.forEach((r, l) => {
      r.isCorrect = this.isLineCorrect("column", l);
    }), this.initCanvas(s), this.print();
  }
  calculateHints(t, i) {
    const s = [];
    return this.getSingleLine(t, i).reduce((n, o) => (o === c.FILLED && s.push(n ? s.pop() + 1 : 1), o === c.FILLED), !1), s;
  }
  initListeners() {
    this.listeners = [
      ["mousedown", this.mousedown],
      ["mousemove", this.mousemove],
      ["mouseup", this.brushUp],
      ["mouseleave", this.brushUp]
    ];
  }
  switchBrush() {
    this.brush = this.brush === c.EMPTY ? c.FILLED : c.EMPTY, this.printController();
  }
  switchCell(t, i) {
    let s = this.brush;
    this.draw.inverted && (s = this.brush === c.FILLED ? c.EMPTY : c.FILLED), s === c.FILLED && this.grid[t][i] !== c.EMPTY ? (this.grid[t][i] = this.draw.mode === "filling" ? c.FILLED : c.UNSET, this.hints.row[t].isCorrect = this.isLineCorrect("row", t), this.hints.column[i].isCorrect = this.isLineCorrect("column", i), this.print(), this.hints.row.every((n) => !!n.isCorrect) && this.hints.column.every((n) => !!n.isCorrect) && this.succeed()) : s === c.EMPTY && this.grid[t][i] !== c.FILLED && (this.grid[t][i] = this.draw.mode === "filling" ? c.EMPTY : c.UNSET, this.print());
  }
  printCell(t) {
    const { ctx: i } = this, s = this.canvas.width * 2 / 3 / (this.n + 1);
    switch (t) {
      case c.FILLED:
        i.fillStyle = this.theme.filledColor, i.fillRect(-s * 0.05, -s * 0.05, s * 1.1, s * 1.1);
        break;
      case c.EMPTY:
        i.strokeStyle = u.red, i.lineWidth = s / 15, i.beginPath(), i.moveTo(s * 0.3, s * 0.3), i.lineTo(s * 0.7, s * 0.7), i.moveTo(s * 0.3, s * 0.7), i.lineTo(s * 0.7, s * 0.3), i.stroke();
        break;
    }
  }
  printController() {
    const { ctx: t } = this, { width: i, height: s } = this.canvas, e = Math.min(i, s) / 4, n = e * 3 / 4, o = e / 4, r = e / 20, l = n - 2 * r;
    var a = this;
    function p() {
      t.save(), t.translate(o, 0), t.fillStyle = a.theme.meshColor, t.fillRect(0, 0, n, n), t.fillStyle = a.theme.filledColor, t.fillRect(r, r, l, l), t.restore();
    }
    function f() {
      t.save(), t.translate(0, o), t.fillStyle = a.theme.meshColor, t.fillRect(0, 0, n, n), t.clearRect(r, r, l, l), t.strokeStyle = u.red, t.lineWidth = r, t.beginPath(), t.moveTo(n * 0.3, n * 0.3), t.lineTo(n * 0.7, n * 0.7), t.moveTo(n * 0.3, n * 0.7), t.lineTo(n * 0.7, n * 0.3), t.stroke(), t.restore();
    }
    t.clearRect(i * 2 / 3 - 1, s * 2 / 3 - 1, i / 3 + 1, s / 3 + 1), t.save(), t.translate(i * 0.7, s * 0.7), this.brush === c.FILLED ? (f.call(this), p.call(this)) : this.brush === c.EMPTY && (p.call(this), f.call(this)), t.restore();
  }
  succeed() {
    this.handleSuccess(), this.listeners.forEach(([f, w]) => {
      this.canvas.removeEventListener(f, w);
    });
    const { ctx: t } = this, { width: i, height: s } = this.canvas, e = Math.min(i, s) / 4, n = t.getImageData(0, 0, i, s);
    function o() {
      const f = e * 2, w = f / 10, T = document.createElement("canvas");
      T.width = f, T.height = f;
      const b = T.getContext("2d") || new CanvasRenderingContext2D();
      return b.translate(f / 3, f * 5 / 6), b.rotate(-Math.PI / 4), b.fillStyle = u.green, b.fillRect(0, 0, w, -f * Math.SQRT2 / 3), b.fillRect(0, 0, f * Math.SQRT2 * 2 / 3, -w), T;
    }
    const r = o();
    let l = 0;
    function a(f) {
      return 1 + Math.pow(f - 1, 3);
    }
    const p = () => {
      t.putImageData(n, 0, 0), l += 0.03, t.globalAlpha = a(l), t.clearRect(i * 2 / 3, s * 2 / 3, i / 3, s / 3), t.drawImage(
        r,
        i * 0.7 - (1 - a(l)) * e / 2,
        s * 0.7 - (1 - a(l)) * e / 2,
        (2 - a(l)) * e,
        (2 - a(l)) * e
      ), l <= 1 ? requestAnimationFrame(p) : this.handleAnimationEnd();
    };
    p();
  }
}
export {
  W as Editor,
  E as Game,
  C as Solver
};
