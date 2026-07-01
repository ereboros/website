/* EREBOROS — tweaks + app shell */

/* ---------- Tweaks ---------- */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "oxide",
  "bg": "ink",
  "capitals": "roman"
}/*EDITMODE-END*/;

const ACCENTS = {
  oxide:  { bright: "#ad1010", base: "#850b0b", label: "Oxide" },
  bone:   { bright: "#ebe5d8", base: "#c6bda9", label: "Bone" },
  ember:  { bright: "#a24a1f", base: "#7a3414", label: "Ember" },
  frost:  { bright: "#6a7c8a", base: "#3f4a55", label: "Frost" },
};
const BGS = {
  ink:  { a: "#0a0908", b: "#14110f", c: "#1d1916", label: "Ink" },
  coal: { a: "#050504", b: "#0d0c0b", c: "#161412", label: "Coal" },
  soil: { a: "#0f0a07", b: "#17110c", c: "#1f1811", label: "Soil" },
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
  useEffect(() => { applyTweaks(state); }, [state]);

  const set = (patch) => {
    const next = { ...state, ...patch };
    setState(next);
    try {
      window.parent.postMessage({ type: "__edit_mode_set_keys", edits: patch }, "*");
    } catch (e) {}
  };

  return (
    <div className={`tweaks ${open ? "is-open" : ""}`}>
      <h4>Tweaks</h4>
      <div className="tweak-row">
        <label>Accent</label>
        <div className="tweak-swatches">
          {Object.entries(ACCENTS).map(([k, v]) => (
            <button
              key={k}
              className={`tweak-swatch ${state.accent === k ? "active" : ""}`}
              style={{ background: v.bright }}
              onClick={() => set({ accent: k })}
              title={v.label}
            />
          ))}
        </div>
      </div>
      <div className="tweak-row">
        <label>Background</label>
        <div className="tweak-pick">
          {Object.entries(BGS).map(([k, v]) => (
            <button
              key={k}
              className={state.bg === k ? "active" : ""}
              onClick={() => set({ bg: k })}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>
      <div className="tweak-row">
        <label>{"Capital numerals"}</label>
        <div className="tweak-pick">
          <button className={state.capitals === "roman" ? "active" : ""} onClick={() => set({ capitals: "roman" })}>Roman</button>
          <button className={state.capitals === "arabic" ? "active" : ""} onClick={() => set({ capitals: "arabic" })}>Arabic</button>
        </div>
      </div>
      <div style={{ fontSize: 9, opacity: 0.55, marginTop: 10 }}>
        Toggle the Tweaks button in the toolbar to hide.
      </div>
    </div>
  );
}

/* ---------- App ---------- */

function App() {
  const data = window.EREBOROS_DATA;
  const i18n = data.i18n;
  // Idioma inicial vem da URL da página: "/" serve PT, "/en/" serve EN (o build
  // injeta window.EREBOROS_LANG em cada variante). Assim cada idioma é indexável.
  const [lang, setLang] = useState(window.EREBOROS_LANG === "en" ? "en" : "pt");

  const [tweaks, setTweaks] = useState(TWEAK_DEFAULTS);
  const [tweakOpen, setTweakOpen] = useState(false);

  // O MailerLite (universal.js) NÃO é mais carregado no boot — ele só é injetado
  // quando o usuário abre o popover de newsletter (ver Newsletter em components.jsx).
  // Isso tira JS + CSS de terceiro do carregamento inicial (melhora TBT/CSS não usado).

  // Idioma ligado à URL ("/" = PT, "/en/" = EN). O HTML de cada URL já chega no
  // idioma certo; o toggle troca sem recarregar (History API) e o <html lang>
  // acompanha. O botão Voltar do navegador é respeitado (popstate).
  const applyLang = (l) => {
    setLang(l);
    try { document.documentElement.lang = l === "en" ? "en" : "pt-BR"; } catch (e) {}
  };
  const setLangNav = (l) => {
    if (l === lang) return;
    applyLang(l);
    const path = l === "en" ? "/en/" : "/";
    try {
      if (window.location.pathname !== path) {
        window.history.pushState(null, "", path + window.location.hash);
      }
    } catch (e) {}
  };
  useEffect(() => {
    const onPop = () => applyLang(/^\/en(\/|$)/.test(window.location.pathname) ? "en" : "pt");
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // edit-mode protocol (Tweaks toolbar toggle)
  useEffect(() => {
    const onMsg = (e) => {
      const t = e?.data?.type;
      if (t === "__activate_edit_mode") setTweakOpen(true);
      else if (t === "__deactivate_edit_mode") setTweakOpen(false);
    };
    window.addEventListener("message", onMsg);
    try {
      window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    } catch (e) {}
    return () => window.removeEventListener("message", onMsg);
  }, []);

  // smooth scroll for hash links
  useEffect(() => {
    const easeInOutCubic = (t) => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3) / 2;
    const onClick = (e) => {
      const a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || href === "#" || href.length < 2) return;
      const el = document.getElementById(href.slice(1));
      if (!el) return;
      e.preventDefault();
      const GAP = 28; // respiro abaixo da nav
      // mira no conteúdo da seção (.wrap) e não na caixa: a seção tem um padding-top
      // grande (clamp(80px,12vh,160px)) que, se não pulado, vira margem vazia enorme.
      const anchor = el.querySelector(".wrap") || el;
      const startY = window.scrollY || window.pageYOffset;
      // posição-alvo recalculada ao vivo: topo absoluto do alvo menos a nav e o respiro.
      // Recalcular a cada frame corrige deslocamentos de layout durante o scroll
      // (ex.: imagens lazy carregando), que antes faziam o scroll parar antes do ponto.
      const targetAt = () => {
        // navH recalculado a cada frame: a altura da nav muda quando o drawer do
        // menu mobile (hambúrguer) fecha logo após o clique no link.
        const navH = (document.querySelector(".nav")?.getBoundingClientRect().height) || 0;
        return anchor.getBoundingClientRect().top + (window.scrollY || window.pageYOffset) - navH - GAP;
      };
      const dur = Math.min(1400, Math.max(700, Math.abs(targetAt() - startY) * 0.6));
      const t0 = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - t0) / dur);
        const targetY = targetAt();
        window.scrollTo(0, startY + (targetY - startY) * easeInOutCubic(p));
        if (p < 1) requestAnimationFrame(step);
        else { window.scrollTo(0, targetAt()); history.replaceState(null, "", href); }
      };
      requestAnimationFrame(step);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // remap section numerals based on tweaks
  const numerals = tweaks.capitals === "arabic"
    ? { about: "01", listen: "02", videos: "03", tour: "04", gallery: "05", store: "06", booking: "07" }
    : null;
  const effI18n = useMemo(() => {
    if (!numerals) return i18n;
    const clone = JSON.parse(JSON.stringify(i18n));
    Object.keys(numerals).forEach((k) => { clone.sections[k].num = numerals[k]; });
    return clone;
  }, [numerals, i18n]);

  return (
    <>
      <Nav lang={lang} setLang={setLangNav} i18n={effI18n} />
      <Hero    lang={lang} data={data} i18n={effI18n} />
      <main>
        <About   lang={lang} data={data} i18n={effI18n} />
        <Listen  lang={lang} data={data} i18n={effI18n} />
        <Videos  lang={lang} data={data} i18n={effI18n} />
        <Tour    lang={lang} data={data} i18n={effI18n} />
        <Gallery lang={lang} data={data} i18n={effI18n} />
        <Store   lang={lang} data={data} i18n={effI18n} />
        <Booking lang={lang} data={data} i18n={effI18n} />
      </main>
      <Footer  lang={lang} data={data} i18n={effI18n} />

      <Tweaks state={tweaks} setState={setTweaks} open={tweakOpen} setOpen={setTweakOpen} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
