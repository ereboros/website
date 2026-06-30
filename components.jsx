/* EREBOROS — components (React, JSX via Babel) */

const { useState, useEffect, useRef, useMemo } = React;

/* ============================================================================
   Utilities
   ============================================================================ */

function pick(val, lang) {
  if (val && typeof val === "object" && ("pt" in val || "en" in val)) {
    return val[lang] ?? val.pt ?? val.en ?? "";
  }
  return val;
}

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { el.classList.add("is-in"); io.unobserve(el); }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, delay = 0, as: Tag = "div", className = "", ...rest }) {
  const ref = useReveal();
  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={{ "--d": `${delay}ms`, ...(rest.style || {}) }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ============================================================================
   Icons (inline SVG — no libraries)
   ============================================================================ */

const Icon = {
  Play: (p) => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" {...p}>
      <path d="M7 5v14l12-7z" />
    </svg>
  ),
  Pause: (p) => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" {...p}>
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  ),
  Next: (p) => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" {...p}>
      <path d="M6 5l9 7-9 7zM17 5h2v14h-2z" />
    </svg>
  ),
  Prev: (p) => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" {...p}>
      <path d="M18 19l-9-7 9-7zM5 5h2v14H5z" />
    </svg>
  ),
  Arrow: (p) => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  Spotify: (p) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" {...p}>
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.8 14.6a.75.75 0 0 1-1 .2c-2.8-1.7-6.3-2.1-10.4-1.1a.75.75 0 1 1-.33-1.46c4.5-1 8.4-.57 11.5 1.34.36.22.47.68.23 1.02zm1.3-3.1a.94.94 0 0 1-1.28.3c-3.2-2-8.1-2.57-11.9-1.4a.94.94 0 1 1-.54-1.8c4.3-1.3 9.7-.66 13.3 1.6.44.28.56.85.42 1.3zm.12-3.25c-3.8-2.26-10.1-2.47-13.75-1.36a1.12 1.12 0 1 1-.65-2.15c4.2-1.27 11.14-1.02 15.5 1.57a1.13 1.13 0 0 1-1.1 1.94z"/>
    </svg>
  ),
  Apple: (p) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" {...p}>
      <path d="M16.37 12.87c0-2.42 1.97-3.58 2.06-3.63-1.12-1.64-2.87-1.86-3.5-1.88-1.48-.15-2.9.87-3.66.87-.77 0-1.93-.86-3.18-.83-1.63.02-3.14.94-3.98 2.4-1.7 2.95-.44 7.32 1.22 9.72.81 1.18 1.78 2.5 3.04 2.45 1.22-.05 1.68-.78 3.16-.78 1.47 0 1.88.78 3.17.76 1.31-.02 2.14-1.19 2.94-2.38.93-1.37 1.31-2.7 1.33-2.77-.03-.01-2.55-.98-2.58-3.89zm-2.46-7.13c.67-.82 1.13-1.96.98-3.1-.95.04-2.1.63-2.79 1.44-.62.72-1.17 1.87-1.02 2.98 1.07.08 2.16-.54 2.83-1.32z"/>
    </svg>
  ),
  Bandcamp: (p) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" {...p}>
      <path d="M2 17L7 6h15l-5 11H2z"/>
    </svg>
  ),
  YouTube: (p) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" {...p}>
      <path d="M23 7s-.23-1.66-.93-2.4c-.88-.96-1.87-.97-2.32-1.02C16.44 3.3 12 3.3 12 3.3s-4.44 0-7.75.28c-.45.05-1.44.06-2.32 1.02C1.23 5.34 1 7 1 7S.75 8.94.75 10.88v1.86c0 1.94.25 3.88.25 3.88s.23 1.66.93 2.4c.88.96 2.04.93 2.56 1.03 1.85.18 7.5.28 7.5.28s4.44-.01 7.75-.29c.45-.05 1.44-.06 2.32-1.02.7-.74.93-2.4.93-2.4s.25-1.94.25-3.88v-1.86C23.25 8.94 23 7 23 7zM9.87 14.89V8.23l5.66 3.34-5.66 3.32z"/>
    </svg>
  ),
  Cross: (p) => (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" {...p}>
      <path d="M11 2h2v7h7v2h-7v11h-2V11H4V9h7z"/>
    </svg>
  ),
  Menu: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...p}>
      <path d="M3 6h18v1H3zM3 12h18v1H3zM3 18h18v1H3z"/>
    </svg>
  ),
};

const StoreIcon = (p) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.4" {...p}>
    <path d="M3 7h18l-1.5 12.5a1 1 0 0 1-1 .9H5.5a1 1 0 0 1-1-.9L3 7z"/>
    <path d="M8 7V5a4 4 0 1 1 8 0v2"/>
  </svg>
);
const InstagramIcon = (p) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
);
function iconByName(name) {
  if (name === "spotify")   return <Icon.Spotify  className="platform-icon" />;
  if (name === "apple")     return <Icon.Apple    className="platform-icon" />;
  if (name === "bandcamp")  return <Icon.Bandcamp className="platform-icon" />;
  if (name === "youtube")   return <Icon.YouTube  className="platform-icon" />;
  if (name === "store")     return <StoreIcon className="platform-icon" />;
  if (name === "instagram") return <InstagramIcon className="platform-icon" />;
  return null;
}

/* ============================================================================
   Ornamental primitives
   ============================================================================ */

function Ornament({ label }) {
  return (
    <div className="ornament">
      <span aria-hidden="true">✦</span>
      {label ? <span>{label}</span> : null}
      <span aria-hidden="true">✦</span>
    </div>
  );
}

function SectionHead({ num, title, kicker }) {
  return (
    <Reveal className="section-head">
      <div className="section-num">{num}</div>
      <h2 className="section-title">{title}</h2>
      {kicker ? <div className="section-kicker">{kicker}</div> : null}
    </Reveal>
  );
}

/* ============================================================================
   NEWSLETTER — botão na nav + popover com o form embed do MailerLite
   ============================================================================ */

const ML_I18N = {
  pt: { email: "Seu e-mail", btn: "Inscrever-se", sucH: "Obrigado!", sucP: "Você entrou na nossa lista com sucesso." },
  en: { email: "Your email", btn: "Subscribe",   sucH: "Thank you!", sucP: "You have successfully joined our subscriber list." },
};

function Newsletter({ lang }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const embedRef = useRef(null);

  // MailerLite Universal carregado SOB DEMANDA: só na primeira vez que o popover abre.
  // Mantém JS + CSS de terceiro fora do carregamento inicial da página.
  useEffect(() => {
    if (!open || window.ml) return;
    (function (w, d, e, u, f, l, n) {
      w[f] = w[f] || function () { (w[f].q = w[f].q || []).push(arguments); };
      l = d.createElement(e); l.async = 1; l.src = u;
      n = d.getElementsByTagName(e)[0]; n.parentNode.insertBefore(l, n);
    })(window, document, "script", "https://assets.mailerlite.com/js/universal.js", "ml");
    window.ml("account", "36660");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("keydown", onKey);
    // adia o listener de "clique fora" para o clique de abertura não fechar de imediato
    const id = setTimeout(() => document.addEventListener("mousedown", onDown), 0);
    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(id);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  // O form do MailerLite tem textos fixos; localizamos placeholder/botão/sucesso
  // conforme o idioma. O MutationObserver pega a hidratação assíncrona e reaplica
  // na troca de idioma (guardado por igualdade para não entrar em loop).
  useEffect(() => {
    const el = embedRef.current;
    const t = ML_I18N[lang];
    if (!el || !t) return;
    const setText = (node, text) => { if (node && node.textContent.trim() !== text) node.textContent = text; };
    const apply = () => {
      const input = el.querySelector('input[type="email"]');
      if (input && input.placeholder !== t.email) input.placeholder = t.email;
      setText(el.querySelector("button.primary"), t.btn);
      setText(el.querySelector(".ml-form-successBody h4"), t.sucH);
      setText(el.querySelector(".ml-form-successBody p"), t.sucP);
    };
    apply();
    const obs = new MutationObserver(apply);
    obs.observe(el, { childList: true, subtree: true });
    return () => obs.disconnect();
  }, [lang]);

  return (
    <div className="newsletter" ref={ref}>
      <button
        type="button"
        className="newsletter-trigger"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {lang === "pt" ? "Newsletter" : "Newsletter"}
      </button>
      <div className={`newsletter-pop ${open ? "is-open" : ""}`} role="dialog" aria-hidden={!open} inert={!open ? "" : undefined}>
        <div className="newsletter-pop-head">
          {lang === "pt" ? "Entre na lista" : "Join the list"}
        </div>
        {/* O MailerLite Universal (carregado em app.jsx) hidrata este div. */}
        <div className="ml-embedded" data-form="xEw6cK" ref={embedRef} />
      </div>
    </div>
  );
}

/* ============================================================================
   NAV
   ============================================================================ */

function Nav({ lang, setLang, i18n }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);
  return (
    <nav className={`nav ${menuOpen ? "is-menu-open" : ""}`}>
      <a href="#top" className="nav-mark" aria-label="Ereboros" onClick={close}>
        <img src="assets/ereboros-logo.webp" alt="Ereboros" width="75" height="28" />
      </a>
      <button
        type="button"
        className="nav-burger"
        aria-label="Menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((o) => !o)}
      >
        {menuOpen ? <Icon.Cross /> : <Icon.Menu />}
      </button>
      <div className="nav-panel">
        <div className="nav-left">
          <a href="#listen" className="nav-link" onClick={close}>{pick(i18n.nav.listen, lang)}</a>
          <a href="#videos" className="nav-link" onClick={close}>{pick(i18n.nav.videos, lang)}</a>
          <a href="#tour"   className="nav-link" onClick={close}>{pick(i18n.nav.tour,   lang)}</a>
          <Newsletter lang={lang} />
        </div>
        <div className="nav-right">
          <a href="#store"   className="nav-link" onClick={close}>{pick(i18n.nav.store,   lang)}</a>
          <a href="#booking" className="nav-link" onClick={close}>{pick(i18n.nav.booking, lang)}</a>
          <div className="lang-toggle" role="group" aria-label="Language">
            <button className={lang === "pt" ? "active" : ""} onClick={() => setLang("pt")}>PT</button>
            <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button>
          </div>
        </div>
      </div>
    </nav>
  );
}

/* ============================================================================
   HERO
   ============================================================================ */

function Hero({ lang, data, i18n }) {
  const bgRef = useRef(null);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (bgRef.current) {
        const s = 1.05 + Math.min(y, 800) * 0.00035;
        // negative factor — bg moves UP slower than page scrolls content
        bgRef.current.style.transform = `translate3d(0, ${-y * 0.35}px, 0) scale(${s})`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="hero" id="top">
      <div className="hero-bg" ref={bgRef} />
      <div className="hero-inner">
        <div className="meta meta-oxide" style={{ marginBottom: 24 }}>
          {data.band.formed}  ·  {data.band.origin}
        </div>
        <h1 className="hero-wordmark">
          <span className="sr-only">Ereboros — Death Metal · Rio de Janeiro</span>
          <span className="logo-mark logo-mark-hero" aria-hidden="true" />
        </h1>
        <Ornament />
        <p className="hero-sub">{pick(data.band.tagline, lang)}</p>
        <div className="hero-meta">
          <a href="#listen" className="btn btn-oxide">{pick(i18n.nav.listen, lang)}</a>
          <a href="#tour" className="btn">{pick(i18n.nav.tour, lang)}</a>
        </div>
      </div>
      <div className="hero-scroll">{pick(i18n.heroScroll, lang)}</div>
    </header>
  );
}

/* ============================================================================
   ABOUT
   ============================================================================ */

function About({ lang, data, i18n }) {
  const s = i18n.sections.about;
  return (
    <section className="section" id="about">
      <div className="wrap">
        <SectionHead num={s.num} title={pick(s.title, lang)} kicker={pick(s.kicker, lang)} />
        <div className="about-grid">
          <Reveal className="about-body" delay={0}>
            {data.about[lang].map((para, i) => (
              <p key={i} className={i === 0 ? "drop-cap" : ""}>{para}</p>
            ))}
          </Reveal>
          <Reveal delay={150}>
            <div className="meta" style={{ marginBottom: 18 }}>{lang === "pt" ? "Formação" : "Lineup"}</div>
            <ul className="members-list">
              {data.members.map((m) => (
                <li key={m.name}>
                  <span className="member-name">{m.name}</span>
                  <span className="member-role">{pick(m.role, lang)}</span>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <div className="meta" style={{ marginBottom: 6 }}>{lang === "pt" ? "Formação" : "Formed"}</div>
                <div className="f-display" style={{ fontSize: 26, fontStyle: "italic" }}>{data.band.formed}</div>
              </div>
              <div>
                <div className="meta" style={{ marginBottom: 6 }}>{lang === "pt" ? "Origem" : "Origin"}</div>
                <div className="f-display" style={{ fontSize: 26, fontStyle: "italic" }}>{data.band.origin}</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { pick, useReveal, Reveal, Icon, iconByName, Ornament, SectionHead, Newsletter, Nav, Hero, About });
