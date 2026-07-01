const TWEAK_DEFAULTS = (
  /*EDITMODE-BEGIN*/
  {
    "accent": "oxide",
    "bg": "ink",
    "capitals": "roman"
  }
);
const ACCENTS = {
  oxide: { bright: "#ad1010", base: "#850b0b", label: "Oxide" },
  bone: { bright: "#ebe5d8", base: "#c6bda9", label: "Bone" },
  ember: { bright: "#a24a1f", base: "#7a3414", label: "Ember" },
  frost: { bright: "#6a7c8a", base: "#3f4a55", label: "Frost" }
};
const BGS = {
  ink: { a: "#0a0908", b: "#14110f", c: "#1d1916", label: "Ink" },
  coal: { a: "#050504", b: "#0d0c0b", c: "#161412", label: "Coal" },
  soil: { a: "#0f0a07", b: "#17110c", c: "#1f1811", label: "Soil" }
};
function applyTweaks(state) {
  const root = document.documentElement;
  const acc = ACCENTS[state.accent] || ACCENTS.oxide;
  const bg = BGS[state.bg] || BGS.ink;
  root.style.setProperty("--oxide", acc.base);
  root.style.setProperty("--oxide-bright", acc.bright);
  root.style.setProperty("--ink", bg.a);
  root.style.setProperty("--ink-2", bg.b);
  root.style.setProperty("--ink-3", bg.c);
}
function Tweaks({ state, setState, open, setOpen }) {
  useEffect(() => {
    applyTweaks(state);
  }, [state]);
  const set = (patch) => {
    const next = { ...state, ...patch };
    setState(next);
    try {
      window.parent.postMessage({ type: "__edit_mode_set_keys", edits: patch }, "*");
    } catch (e) {
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: `tweaks ${open ? "is-open" : ""}` }, /* @__PURE__ */ React.createElement("h4", null, "Tweaks"), /* @__PURE__ */ React.createElement("div", { className: "tweak-row" }, /* @__PURE__ */ React.createElement("label", null, "Accent"), /* @__PURE__ */ React.createElement("div", { className: "tweak-swatches" }, Object.entries(ACCENTS).map(([k, v]) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: k,
      className: `tweak-swatch ${state.accent === k ? "active" : ""}`,
      style: { background: v.bright },
      onClick: () => set({ accent: k }),
      title: v.label
    }
  )))), /* @__PURE__ */ React.createElement("div", { className: "tweak-row" }, /* @__PURE__ */ React.createElement("label", null, "Background"), /* @__PURE__ */ React.createElement("div", { className: "tweak-pick" }, Object.entries(BGS).map(([k, v]) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: k,
      className: state.bg === k ? "active" : "",
      onClick: () => set({ bg: k })
    },
    v.label
  )))), /* @__PURE__ */ React.createElement("div", { className: "tweak-row" }, /* @__PURE__ */ React.createElement("label", null, "Capital numerals"), /* @__PURE__ */ React.createElement("div", { className: "tweak-pick" }, /* @__PURE__ */ React.createElement("button", { className: state.capitals === "roman" ? "active" : "", onClick: () => set({ capitals: "roman" }) }, "Roman"), /* @__PURE__ */ React.createElement("button", { className: state.capitals === "arabic" ? "active" : "", onClick: () => set({ capitals: "arabic" }) }, "Arabic"))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, opacity: 0.55, marginTop: 10 } }, "Toggle the Tweaks button in the toolbar to hide."));
}
function App() {
  const data = window.EREBOROS_DATA;
  const i18n = data.i18n;
  const [lang, setLang] = useState(window.EREBOROS_LANG === "en" ? "en" : "pt");
  const [tweaks, setTweaks] = useState(TWEAK_DEFAULTS);
  const [tweakOpen, setTweakOpen] = useState(false);
  const applyLang = (l) => {
    setLang(l);
    try {
      document.documentElement.lang = l === "en" ? "en" : "pt-BR";
    } catch (e) {
    }
  };
  const setLangNav = (l) => {
    if (l === lang) return;
    applyLang(l);
    const path = l === "en" ? "/en/" : "/";
    try {
      if (window.location.pathname !== path) {
        window.history.pushState(null, "", path + window.location.hash);
      }
    } catch (e) {
    }
  };
  useEffect(() => {
    const onPop = () => applyLang(/^\/en(\/|$)/.test(window.location.pathname) ? "en" : "pt");
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  useEffect(() => {
    const onMsg = (e) => {
      const t = e?.data?.type;
      if (t === "__activate_edit_mode") setTweakOpen(true);
      else if (t === "__deactivate_edit_mode") setTweakOpen(false);
    };
    window.addEventListener("message", onMsg);
    try {
      window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    } catch (e) {
    }
    return () => window.removeEventListener("message", onMsg);
  }, []);
  useEffect(() => {
    const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const onClick = (e) => {
      const a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || href === "#" || href.length < 2) return;
      const el = document.getElementById(href.slice(1));
      if (!el) return;
      e.preventDefault();
      const GAP = 28;
      const anchor = el.querySelector(".wrap") || el;
      const startY = window.scrollY || window.pageYOffset;
      const targetAt = () => {
        const navH = document.querySelector(".nav")?.getBoundingClientRect().height || 0;
        return anchor.getBoundingClientRect().top + (window.scrollY || window.pageYOffset) - navH - GAP;
      };
      const dur = Math.min(1400, Math.max(700, Math.abs(targetAt() - startY) * 0.6));
      const t0 = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - t0) / dur);
        const targetY = targetAt();
        window.scrollTo(0, startY + (targetY - startY) * easeInOutCubic(p));
        if (p < 1) requestAnimationFrame(step);
        else {
          window.scrollTo(0, targetAt());
          history.replaceState(null, "", href);
        }
      };
      requestAnimationFrame(step);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  const numerals = tweaks.capitals === "arabic" ? { about: "01", listen: "02", videos: "03", tour: "04", gallery: "05", store: "06", booking: "07" } : null;
  const effI18n = useMemo(() => {
    if (!numerals) return i18n;
    const clone = JSON.parse(JSON.stringify(i18n));
    Object.keys(numerals).forEach((k) => {
      clone.sections[k].num = numerals[k];
    });
    return clone;
  }, [numerals, i18n]);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Nav, { lang, setLang: setLangNav, i18n: effI18n }), /* @__PURE__ */ React.createElement(Hero, { lang, data, i18n: effI18n }), /* @__PURE__ */ React.createElement("main", null, /* @__PURE__ */ React.createElement(About, { lang, data, i18n: effI18n }), /* @__PURE__ */ React.createElement(Listen, { lang, data, i18n: effI18n }), /* @__PURE__ */ React.createElement(Videos, { lang, data, i18n: effI18n }), /* @__PURE__ */ React.createElement(Tour, { lang, data, i18n: effI18n }), /* @__PURE__ */ React.createElement(Gallery, { lang, data, i18n: effI18n }), /* @__PURE__ */ React.createElement(Store, { lang, data, i18n: effI18n }), /* @__PURE__ */ React.createElement(Booking, { lang, data, i18n: effI18n })), /* @__PURE__ */ React.createElement(Footer, { lang, data, i18n: effI18n }), /* @__PURE__ */ React.createElement(Tweaks, { state: tweaks, setState: setTweaks, open: tweakOpen, setOpen: setTweakOpen }));
}
ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(App, null));
