// EREBOROS — gerador da página de produto, VERSÃO 2 (storytelling)
// ---------------------------------------------------------------------------
// Variante experimental da landing de produto, inspirada em páginas que vendem
// UM produto contando uma história (ex.: jouse.com.br): seções em tela cheia,
// copy curto e aspiracional, imagem protagonista e, no hero, só dois caminhos:
// "Saiba mais" (desce para a narrativa) e "Comprar" (leva ao checkout).
//
// Gera /merch/<slug>-v2/index.html. É standalone (styles.css + CSS inline .v2-).
// Para comparar com a v1 sem poluir o SEO, a página é noindex e o canonical
// aponta para a v1 (/merch/<slug>/).
//
// Uso:  node build-products-v2.mjs
// ---------------------------------------------------------------------------

import { writeFileSync, mkdirSync } from "node:fs";

const dir = import.meta.dirname;
const SITE = "https://www.ereboros.com";
const GA_ID = "G-H3N99TLRFJ";
const META_PIXEL_ID = "1278514373103982";

const ARROW = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>`;
const BAG = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`;
const DOWN = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>`;

// ---- Produto + história ----------------------------------------------------
const PRODUCT = {
  slug: "camiseta-oblivion",
  name: "Camiseta Oblivion",
  productUrl: "https://ereboros.lojaintegrada.com.br/camiseta-oblivion",
  cartBase: "https://ereboros.lojaintegrada.com.br/carrinho/produto",
  ogImage: "/assets/camiseta-oblivion-og.jpg",
  preorder: "Pré-venda · entrega prevista para outubro de 2026",
  installments: 4,
  sizes: [
    { label: "PP",  price: 7990, id: 401295039 },
    { label: "P",   price: 7990, id: 401294930 },
    { label: "M",   price: 7990, id: 401294966 },
    { label: "G",   price: 7990, id: 401295048 },
    { label: "GG",  price: 7990, id: 401294993 },
    { label: "XG",  price: 9490, id: 401294980 },
    { label: "XGG", price: 9490, id: 401294975 },
  ],
  hero: {
    kicker: "Camiseta oficial · Ereboros",
    // headline em duas linhas (tradução de From Oblivion to the Grave)
    title: ["Do esquecimento", "à sepultura."],
    sub: "A peça oficial do álbum From Oblivion to the Grave. Tiragem de pré-venda.",
    image: { src: "/assets/camiseta-oblivion-modelo.webp", alt: "Camiseta Ereboros Oblivion vestida" },
  },
  chapters: [
    {
      num: "I",
      kicker: "A visão",
      title: "Três lamentos sobre o sangue.",
      body: "A capa de From Oblivion to the Grave nasceu de uma única imagem: três figuras encapuzadas ajoelhadas sobre uma poça que não seca. Levamos essa cena para o algodão exatamente como foi pintada, em vermelho seco sobre preto profundo, para que o disco continue com você muito depois da última faixa.",
      image: { src: "/assets/camiseta-oblivion.webp", alt: "Estampa frontal From Oblivion to the Grave", w: 1616, h: 1448 },
      reverse: false,
    },
    {
      num: "II",
      kicker: "Os cânticos",
      title: "Dez faixas gravadas como epitáfio.",
      body: "Nas costas, uma chave abre a coluna dos dez cânticos que estruturam o álbum, de From Oblivion to the Grave a At the Gallows of Doom. Embaixo, o selo MMXXVI e o juramento da banda: Baptized in blood. We are the Ereboros Clan.",
      image: { src: "/assets/camiseta-oblivion-costas.webp", alt: "Costas com a tracklist e a chave", w: 1117, h: 1015 },
      reverse: true,
    },
  ],
  ritual: {
    kicker: "O rito",
    title: "Feita para o culto, não para a vitrine.",
    items: [
      "100% algodão fio penteado premium",
      "Estampa em serigrafia na frente e nas costas",
      "Costura reforçada de ombro a ombro",
      "Gola canelada de 3 cm rebatida",
      "Corte unissex, do PP ao XGG",
      "Lave com água fria e evite secagem direta ao sol",
    ],
  },
  claim: {
    kicker: "Pré-venda",
    title: "Reivindique a sua.",
    sub: "A pré-venda encerra quando a tiragem acabar. Entrega prevista para outubro de 2026.",
  },
};

// ---- Helpers ---------------------------------------------------------------
const brl = (cents) => "R$ " + (cents / 100).toFixed(2).replace(".", ",");

function renderSize(p, s) {
  const href = `${p.cartBase}/${s.id}/adicionar`;
  return `          <button type="button" class="v2-size" role="radio" aria-checked="false"
            data-label="${s.label}" data-price="${s.price}" data-cart="${href}">${s.label}</button>`;
}

function renderChapter(c) {
  return `    <section class="v2-chapter${c.reverse ? " reverse" : ""} v2-reveal" ${c.num === "I" ? 'id="historia"' : ""}>
      <div class="v2-ch-media">
        <img src="${c.image.src}" alt="${c.image.alt}" width="${c.image.w}" height="${c.image.h}" loading="lazy" decoding="async">
      </div>
      <div class="v2-ch-text">
        <div class="v2-ch-num">${c.num}</div>
        <p class="v2-ch-kicker">${c.kicker}</p>
        <h2 class="v2-ch-title">${c.title}</h2>
        <p class="v2-ch-body">${c.body}</p>
      </div>
    </section>`;
}

function renderPage(p) {
  const prices = p.sizes.map((s) => s.price);
  const low = Math.min(...prices);
  const installLow = Math.floor(low / p.installments);
  const urlV2 = `${SITE}/merch/${p.slug}-v2/`;
  const urlV1 = `${SITE}/merch/${p.slug}/`;
  const ogImage = SITE + p.ogImage;
  const desc = `${p.name}, a peça oficial do álbum From Oblivion to the Grave do Ereboros. Pré-venda a partir de ${brl(low)} em até ${p.installments}x sem juros.`;

  const sizes = p.sizes.map((s) => renderSize(p, s)).join("\n");
  const chapters = p.chapters.map(renderChapter).join("\n\n");
  const specs = p.ritual.items.map((i) => `        <div class="v2-spec">${i}</div>`).join("\n");

  return `<!doctype html>
<html lang="pt-br">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#0a0908">
<title>${p.name} — Ereboros</title>
<meta name="description" content="${desc}">
<meta name="robots" content="noindex, follow">
<link rel="canonical" href="${urlV1}">

<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-emblema-32.png?v=3">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png?v=3">

<!-- Open Graph -->
<meta property="og:type" content="product">
<meta property="og:site_name" content="Ereboros">
<meta property="og:title" content="Ereboros — ${p.name}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${urlV2}">
<meta property="og:image" content="${ogImage}">
<meta property="og:locale" content="pt_BR">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${ogImage}">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=UnifrakturCook:wght@700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=JetBrains+Mono:wght@400;500&display=swap" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=UnifrakturCook:wght@700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=JetBrains+Mono:wght@400;500&display=swap"></noscript>
<link rel="preload" as="image" href="${p.hero.image.src}" type="image/webp" fetchpriority="high">

<link rel="stylesheet" href="/styles.css?v=43">

<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${GA_ID}');
</script>

<!-- Meta Pixel -->
<script>
  window.META_PIXEL_ID = "${META_PIXEL_ID}";
  (function () {
    if (!/^\\d+$/.test(window.META_PIXEL_ID)) return;
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
      document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', window.META_PIXEL_ID);
    fbq('track', 'PageView');
    fbq('track', 'ViewContent', { content_name: ${JSON.stringify(p.name)}, content_type: 'product', content_ids: ${JSON.stringify(p.slug)}, value: ${(low / 100).toFixed(2)}, currency: 'BRL' });
  })();
</script>
<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1" alt=""></noscript>
<!-- Fim do Meta Pixel -->

<style>
/* ---------- Página de produto v2 (storytelling — prefixo .v2-) ---------- */
html { scroll-behavior: smooth; }
.v2 { overflow-x: hidden; }

.v2-btn {
  display: inline-flex; align-items: center; gap: 10px; padding: 15px 28px;
  font-family: var(--f-mono); font-size: 12px; letter-spacing: .2em; text-transform: uppercase;
  color: var(--bone); border: 1px solid var(--rule-strong); background: transparent;
  cursor: pointer; transition: background .18s, color .18s, border-color .18s, transform .12s;
}
.v2-btn:hover { background: var(--bone); color: var(--ink); border-color: var(--bone); }
.v2-btn:active { transform: scale(.99); }
.v2-btn .arw svg { transition: transform .2s; }
.v2-btn:hover .arw svg { transform: translate(2px, -2px); }
.v2-btn-primary { background: var(--oxide); border-color: var(--oxide); }
.v2-btn-primary:hover { background: var(--oxide-bright); border-color: var(--oxide-bright); color: var(--bone); }

/* Hero */
.v2-hero {
  position: relative; min-height: 94vh; display: grid; place-items: center;
  text-align: center; padding: 90px var(--gutter); overflow: hidden;
}
.v2-hero-bg { position: absolute; inset: 0; z-index: 0; }
.v2-hero-bg img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 22%; opacity: .45; }
.v2-hero::after {
  content: ""; position: absolute; inset: 0; z-index: 1;
  background: linear-gradient(to bottom,
    color-mix(in srgb, var(--ink) 45%, transparent) 0%,
    color-mix(in srgb, var(--ink) 78%, transparent) 55%,
    var(--ink) 100%);
}
.v2-hero-inner { position: relative; z-index: 2; max-width: 820px; }
.v2-kicker { font-family: var(--f-mono); font-size: 12px; letter-spacing: .3em; text-transform: uppercase; color: var(--oxide-bright); margin: 0 0 22px; }
.v2-hero h1 {
  font-family: var(--f-display); font-weight: 600; color: var(--bone);
  font-size: clamp(46px, 9vw, 108px); line-height: .96; margin: 0; letter-spacing: -0.01em;
}
.v2-hero .sub { font-family: var(--f-display); font-size: clamp(18px, 2.3vw, 25px); color: var(--bone-dim); margin: 20px auto 36px; max-width: 560px; }
.v2-cta { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
.v2-scroll { position: absolute; left: 50%; bottom: 26px; transform: translateX(-50%); z-index: 2; color: var(--bone-dim); animation: v2bob 2.4s ease-in-out infinite; }
@keyframes v2bob { 0%,100% { transform: translate(-50%, 0); } 50% { transform: translate(-50%, 6px); } }

/* Capítulos */
.v2-chapter {
  max-width: 1180px; margin: 0 auto; padding: clamp(56px, 11vh, 132px) var(--gutter);
  display: grid; grid-template-columns: 1fr; gap: clamp(28px, 5vw, 76px); align-items: center;
}
@media (min-width: 860px) {
  .v2-chapter { grid-template-columns: 1fr 1fr; }
  .v2-chapter.reverse .v2-ch-media { order: 2; }
}
.v2-ch-media { background: var(--ink-2); box-shadow: 0 26px 70px rgba(0,0,0,.5); }
.v2-ch-media img { display: block; width: 100%; height: auto; }
.v2-ch-num { font-family: var(--f-display); font-weight: 600; font-size: clamp(44px, 6vw, 78px); color: var(--oxide); line-height: 1; }
.v2-ch-kicker { font-family: var(--f-mono); font-size: 12px; letter-spacing: .28em; text-transform: uppercase; color: var(--bone-dim); margin: 8px 0 14px; }
.v2-ch-title { font-family: var(--f-display); font-weight: 600; color: var(--bone); font-size: clamp(28px, 4.4vw, 46px); line-height: 1.04; margin: 0 0 18px; }
.v2-ch-body { font-family: var(--f-display); font-size: clamp(17px, 1.5vw, 21px); line-height: 1.55; color: var(--bone-dim); margin: 0; }

/* O rito / specs */
.v2-ritual { max-width: 1180px; margin: 0 auto; padding: clamp(48px, 8vh, 104px) var(--gutter); border-top: 1px solid var(--rule); }
.v2-ritual-head { text-align: center; margin: 0 auto clamp(28px, 5vh, 52px); max-width: 620px; }
.v2-ritual-head .v2-ch-title { margin: 8px 0 0; }
.v2-specs { display: grid; grid-template-columns: 1fr; gap: 0; }
@media (min-width: 720px) { .v2-specs { grid-template-columns: 1fr 1fr; column-gap: clamp(24px, 4vw, 56px); } }
.v2-spec {
  display: flex; gap: 14px; padding: 18px 0; border-top: 1px solid var(--rule);
  font-family: var(--f-display); font-size: clamp(17px, 1.5vw, 20px); color: var(--bone-dim);
}
.v2-spec::before { content: "†"; color: var(--oxide-bright); }

/* Checkout */
.v2-buy { max-width: 600px; margin: 0 auto; padding: clamp(52px, 9vh, 116px) var(--gutter) clamp(72px, 11vh, 128px); text-align: center; }
.v2-badge {
  display: inline-block; font-family: var(--f-mono); font-size: 10.5px; letter-spacing: .2em;
  text-transform: uppercase; color: var(--bone); border: 1px solid var(--oxide);
  background: color-mix(in srgb, var(--oxide) 22%, transparent); padding: 5px 12px; margin-bottom: 18px;
}
.v2-buy h2 { font-family: var(--f-display); font-weight: 600; color: var(--bone); font-size: clamp(32px, 6vw, 56px); line-height: 1; margin: 0 0 14px; }
.v2-buy .claim-sub { font-family: var(--f-display); font-size: clamp(16px, 2vw, 20px); color: var(--bone-dim); margin: 0 auto 30px; max-width: 460px; }
.v2-price { font-family: var(--f-display); color: var(--bone); font-size: clamp(30px, 5vw, 40px); line-height: 1; margin: 0; }
.v2-price .from { font-family: var(--f-mono); font-size: 11px; letter-spacing: .18em; text-transform: uppercase; color: var(--bone-dim); display: block; margin-bottom: 6px; }
.v2-install { font-family: var(--f-mono); font-size: 12px; color: var(--bone-dim); margin: 8px 0 0; }
.v2-sizes-label { font-family: var(--f-mono); font-size: 11px; letter-spacing: .24em; text-transform: uppercase; color: var(--bone-dim); margin: clamp(24px,4vh,34px) 0 12px; }
.v2-sizes { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
.v2-size {
  min-width: 52px; padding: 12px 14px; cursor: pointer; font-family: var(--f-mono);
  font-size: 13px; letter-spacing: .08em; font-weight: 500; color: var(--bone);
  background: var(--ink-2); border: 1px solid var(--rule-strong);
  transition: border-color .18s, background .18s, color .18s, transform .12s;
}
.v2-size:hover { border-color: var(--oxide-bright); background: var(--ink-3); }
.v2-size:active { transform: scale(.97); }
.v2-size[aria-checked="true"] { border-color: var(--oxide-bright); background: var(--oxide); }
.v2-buy-btn {
  display: flex; align-items: center; justify-content: center; gap: 12px; width: 100%;
  margin-top: clamp(22px,3.5vh,30px); padding: 19px 22px; font-family: var(--f-mono);
  font-size: 13px; letter-spacing: .2em; text-transform: uppercase; color: var(--bone);
  background: var(--oxide); border: 1px solid var(--oxide); cursor: pointer;
  transition: background .18s, border-color .18s, transform .12s;
}
.v2-buy-btn:hover { background: var(--oxide-bright); border-color: var(--oxide-bright); }
.v2-buy-btn:active { transform: scale(.99); }
.v2-buy-btn .arw svg { transition: transform .2s; }
.v2-buy-btn:hover .arw svg { transform: translate(2px, -2px); }
.v2-pay { display: flex; flex-wrap: wrap; gap: 6px 14px; justify-content: center; margin: 16px 0 0; font-family: var(--f-mono); font-size: 11px; color: var(--ash-2); }
.v2-pay b { color: var(--bone-dim); font-weight: 500; }

/* Rodapé */
.v2-foot {
  max-width: 1180px; margin: 0 auto; border-top: 1px solid var(--rule); padding: 22px var(--gutter) 40px;
  display: flex; flex-wrap: wrap; gap: 8px 20px; justify-content: space-between;
}
.v2-foot .meta a { border-bottom: 1px solid var(--rule); }
.v2-foot .meta a:hover { color: var(--bone); border-color: var(--rule-strong); }

/* Reveal on scroll */
.v2-reveal { opacity: 0; transform: translateY(22px); transition: opacity .7s ease, transform .7s ease; }
.v2-reveal.in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) { .v2-reveal { opacity: 1; transform: none; transition: none; } .v2-scroll { animation: none; } }
</style>
</head>
<body class="v2">

<!-- HERO -->
<header class="v2-hero">
  <div class="v2-hero-bg"><img src="${p.hero.image.src}" alt="${p.hero.image.alt}" fetchpriority="high"></div>
  <div class="v2-hero-inner">
    <p class="v2-kicker">${p.hero.kicker}</p>
    <h1>${p.hero.title[0]}<br>${p.hero.title[1]}</h1>
    <p class="sub">${p.hero.sub}</p>
    <div class="v2-cta">
      <a class="v2-btn" href="#historia" data-ga-type="navigate" data-ga-item="saiba-mais" data-ga-loc="merch-${p.slug}-v2">Saiba mais</a>
      <a class="v2-btn v2-btn-primary" href="#comprar" data-ga-type="navigate" data-ga-item="comprar-hero" data-ga-loc="merch-${p.slug}-v2">Comprar <span class="arw">${ARROW}</span></a>
    </div>
  </div>
  <a class="v2-scroll" href="#historia" aria-label="Saiba mais">${DOWN}</a>
</header>

<main>

${chapters}

  <!-- O RITO -->
  <section class="v2-ritual v2-reveal">
    <div class="v2-ritual-head">
      <p class="v2-ch-kicker">${p.ritual.kicker}</p>
      <h2 class="v2-ch-title">${p.ritual.title}</h2>
    </div>
    <div class="v2-specs">
${specs}
    </div>
  </section>

  <!-- CHECKOUT -->
  <section class="v2-buy v2-reveal" id="comprar">
    <span class="v2-badge">${p.preorder}</span>
    <h2>${p.claim.title}</h2>
    <p class="claim-sub">${p.claim.sub}</p>

    <p class="v2-price">
      <span class="from">A partir de</span>
      <span data-price-display>${brl(low)}</span>
    </p>
    <p class="v2-install" data-install-display>Em até ${p.installments}x de ${brl(installLow)} sem juros</p>

    <p class="v2-sizes-label">Escolha o tamanho</p>
    <div class="v2-sizes" role="radiogroup" aria-label="Tamanho">
${sizes}
    </div>

    <a class="v2-buy-btn" href="${p.productUrl}" target="_blank" rel="noreferrer"
       data-buy data-product-url="${p.productUrl}"
       data-ga-type="buy" data-ga-item="${p.slug}" data-ga-loc="merch-${p.slug}-v2">
      ${BAG}
      <span data-buy-label>Comprar</span>
      <span class="arw">${ARROW}</span>
    </a>

    <p class="v2-pay">
      <span><b>Pix</b>, cartão ou boleto</span>
      <span>Até ${p.installments}x sem juros</span>
      <span>Envio para todo o Brasil</span>
    </p>
  </section>

</main>

<footer class="v2-foot">
  <span class="meta">Ereboros · Rio de Janeiro</span>
  <span class="meta"><a href="/" data-ga-type="navigate" data-ga-item="home" data-ga-loc="merch-${p.slug}-v2">ereboros.com</a> · <a href="mailto:merch@ereboros.com">merch@ereboros.com</a></span>
</footer>

<script>
// Seletor de tamanho + rastreio (mesma mecânica da v1).
(function () {
  var PRODUCT_NAME = ${JSON.stringify(p.name)};
  var PRODUCT_SLUG = ${JSON.stringify(p.slug)};
  var INSTALL = ${p.installments};
  var sizes = Array.prototype.slice.call(document.querySelectorAll(".v2-size"));
  var buy = document.querySelector("[data-buy]");
  var buyLabel = document.querySelector("[data-buy-label]");
  var priceEl = document.querySelector("[data-price-display]");
  var fromEl = document.querySelector(".v2-price .from");
  var installEl = document.querySelector("[data-install-display]");
  var chosen = null;

  function brl(cents) { return "R$ " + (cents / 100).toFixed(2).replace(".", ","); }

  sizes.forEach(function (btn) {
    btn.addEventListener("click", function () {
      sizes.forEach(function (b) { b.setAttribute("aria-checked", "false"); });
      btn.setAttribute("aria-checked", "true");
      chosen = btn;
      var price = parseInt(btn.getAttribute("data-price"), 10);
      if (fromEl) fromEl.style.display = "none";
      priceEl.textContent = brl(price);
      installEl.textContent = "Em até " + INSTALL + "x de " + brl(Math.floor(price / INSTALL)) + " sem juros";
      buyLabel.textContent = "Comprar · tamanho " + btn.getAttribute("data-label");
      buy.setAttribute("href", btn.getAttribute("data-cart"));
    });
  });

  buy.addEventListener("click", function () {
    var price = chosen ? parseInt(chosen.getAttribute("data-price"), 10) : null;
    var size = chosen ? chosen.getAttribute("data-label") : null;
    if (window.fbq && /^\\d+$/.test(window.META_PIXEL_ID)) {
      fbq("track", "AddToCart", { content_name: PRODUCT_NAME, content_type: "product", content_ids: [PRODUCT_SLUG], value: price ? price / 100 : undefined, currency: "BRL" });
    }
    if (typeof gtag === "function") {
      gtag("event", "add_to_cart", { currency: "BRL", value: price ? price / 100 : undefined, items: [{ item_id: PRODUCT_SLUG, item_name: PRODUCT_NAME, item_variant: size }] });
    }
  });

  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-ga-type]");
    if (!el || el.hasAttribute("data-buy")) return;
    if (typeof gtag === "function") {
      gtag("event", "select_content", { content_type: el.getAttribute("data-ga-type"), item_id: el.getAttribute("data-ga-item") || "", location: el.getAttribute("data-ga-loc") || "" });
    }
  }, true);
})();

// Reveal on scroll
(function () {
  var els = Array.prototype.slice.call(document.querySelectorAll(".v2-reveal"));
  if (!("IntersectionObserver" in window)) { els.forEach(function (el) { el.classList.add("in"); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { rootMargin: "0px 0px -12% 0px" });
  els.forEach(function (el) { io.observe(el); });
})();
</script>

</body>
</html>
`;
}

// ---- Escrita ---------------------------------------------------------------
const outDir = `${dir}/merch/${PRODUCT.slug}-v2`;
mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/index.html`, renderPage(PRODUCT), "utf8");
console.log(`✓ /merch/${PRODUCT.slug}-v2/  (storytelling, ${PRODUCT.chapters.length} capítulos)`);
