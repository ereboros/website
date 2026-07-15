// EREBOROS — gerador das páginas de produto (loja interna)
// ---------------------------------------------------------------------------
// Gera uma página /merch/<slug>/index.html para cada produto da lista PRODUCTS,
// a partir de UM template. É o análogo dos smartlinks (/sl/), só que para a
// loja: uma landing por camiseta/produto, no visual do site, com seletor de
// tamanho que leva DIRETO para o carrinho da Loja Integrada (deep link) e
// rastreamento de conversão (Meta Pixel ViewContent/AddToCart + GA4).
//
// Uso:  node build-products.mjs
//
// Por produto só variam: nome, imagem, preço e a grade de tamanhos (cada um
// com seu id de variação na Loja Integrada). NÃO edite os HTML em /merch/ à mão,
// edite a lista PRODUCTS aqui e rode o gerador.
//
// ⚠️  Os dados de preço e o id de cada tamanho abaixo foram extraídos da página
//     da loja de forma automática. CONFIRA na Loja Integrada (escolhendo cada
//     tamanho) antes de divulgar — um id trocado adiciona o tamanho errado ao
//     carrinho. O fallback (botão sem tamanho escolhido) sempre abre a página
//     do produto, então nunca leva a um carrinho errado sem o cliente escolher.
// ---------------------------------------------------------------------------

import { writeFileSync, mkdirSync } from "node:fs";

const dir = import.meta.dirname;
const SITE = "https://www.ereboros.com";
const GA_ID = "G-H3N99TLRFJ";
const META_PIXEL_ID = "1278514373103982";

const ARROW = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>`;
const BAG = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`;

// ---- Lista dos produtos ----------------------------------------------------
const PRODUCTS = [
  {
    slug: "camiseta-oblivion",
    name: "Camiseta Oblivion",
    kicker: "Camiseta oficial · Ereboros",
    image: "/assets/camiseta-oblivion.webp",
    imageOg: "/assets/camiseta-oblivion-og.jpg",
    imageW: 1616,
    imageH: 1448,
    imageAlt: "Camiseta Ereboros — Oblivion, estampa frontal",
    productUrl: "https://ereboros.lojaintegrada.com.br/camiseta-oblivion",
    cartBase: "https://ereboros.lojaintegrada.com.br/carrinho/produto",
    preorder: "Pré-venda · entrega prevista para outubro de 2026",
    installments: 4,
    // label | price (centavos) | id da variação na Loja Integrada  ⚠️ CONFERIR
    sizes: [
      { label: "PP",  price: 9490, id: 401295039 },
      { label: "P",   price: 7990, id: 401294930 },
      { label: "M",   price: 7990, id: 401294966 },
      { label: "G",   price: 9490, id: 401295048 },
      { label: "GG",  price: 7990, id: 401294993 },
      { label: "XG",  price: 7990, id: 401294980 },
      { label: "XGG", price: 7990, id: 401294975 },
    ],
    details: [
      "100% algodão fio penteado premium",
      "Costura reforçada de ombro a ombro",
      "Gola canelada de 3 cm rebatida",
      "Lave com água fria e evite secagem direta ao sol",
    ],
  },
];

// ---- Helpers ---------------------------------------------------------------
const brl = (cents) =>
  "R$ " + (cents / 100).toFixed(2).replace(".", ",");

function renderSize(p, s) {
  const href = `${p.cartBase}/${s.id}/adicionar`;
  return `        <button type="button" class="p-size" role="radio" aria-checked="false"
          data-label="${s.label}" data-price="${s.price}" data-cart="${href}">${s.label}</button>`;
}

function renderPage(p) {
  const prices = p.sizes.map((s) => s.price);
  const low = Math.min(...prices);
  const high = Math.max(...prices);
  const installLow = Math.floor(low / p.installments);
  const url = `${SITE}/merch/${p.slug}/`;
  const ogImage = SITE + p.imageOg;
  const desc = `${p.name} — camiseta oficial do Ereboros. ${p.preorder}. A partir de ${brl(low)} em até ${p.installments}x sem juros. Pix, cartão ou boleto, envio para todo o Brasil.`;
  const priceRange =
    low === high ? brl(low) : `${brl(low)}–${brl(high)}`;

  const sizes = p.sizes.map((s) => renderSize(p, s)).join("\n");
  const details = p.details
    .map((d) => `        <li>${d}</li>`)
    .join("\n");

  return `<!doctype html>
<html lang="pt-br">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#0a0908">
<title>${p.name} — Ereboros</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${url}">

<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-emblema-32.png?v=3">
<link rel="icon" type="image/png" sizes="96x96" href="/assets/favicon-emblema-96.png?v=3">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png?v=3">

<!-- Open Graph -->
<meta property="og:type" content="product">
<meta property="og:site_name" content="Ereboros">
<meta property="og:title" content="Ereboros — ${p.name}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:alt" content="${p.imageAlt}">
<meta property="og:locale" content="pt_BR">
<meta property="product:price:amount" content="${(low / 100).toFixed(2)}">
<meta property="product:price:currency" content="BRL">
<meta property="product:availability" content="preorder">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Ereboros — ${p.name}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="${ogImage}">

<!-- JSON-LD: Product -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "${p.name}",
  "image": "${ogImage}",
  "description": "Camiseta oficial do Ereboros — ${p.name}.",
  "brand": { "@type": "Brand", "name": "Ereboros" },
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "BRL",
    "lowPrice": "${(low / 100).toFixed(2)}",
    "highPrice": "${(high / 100).toFixed(2)}",
    "availability": "https://schema.org/PreOrder",
    "url": "${p.productUrl}"
  }
}
</script>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=UnifrakturCook:wght@700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=JetBrains+Mono:wght@400;500&display=swap" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=UnifrakturCook:wght@700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=JetBrains+Mono:wght@400;500&display=swap"></noscript>
<link rel="preload" as="image" href="${p.image}" type="image/webp" fetchpriority="high">

<!-- Design system do site (tokens, grain, tipografia) -->
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
/* ---------- Página de produto (gerado por build-products.mjs — prefixo .p-) ---------- */
.p-shell { max-width: 1040px; margin: 0 auto; min-height: 100vh; padding: 0 var(--gutter); display: flex; flex-direction: column; }
.p-main { flex: 1; padding: clamp(16px, 3.5vh, 40px) 0 clamp(28px, 5vh, 48px); }

/* Topo: kicker + volta pra loja */
.p-top {
  display: flex; align-items: baseline; justify-content: space-between; gap: 16px;
  margin-bottom: clamp(18px, 3vh, 30px);
}
.p-kicker {
  font-family: var(--f-mono); font-size: 12px; letter-spacing: 0.28em;
  text-transform: uppercase; color: var(--oxide-bright); margin: 0;
}
.p-back {
  font-family: var(--f-mono); font-size: 11px; letter-spacing: 0.18em;
  text-transform: uppercase; color: var(--bone-dim);
}
.p-back:hover { color: var(--bone); }

/* Grade: imagem | detalhes */
.p-grid { display: grid; grid-template-columns: 1fr; gap: clamp(24px, 4vw, 48px); align-items: start; }
@media (min-width: 820px) {
  .p-grid { grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr); }
  .p-media { position: sticky; top: 24px; }
}

/* Imagem */
.p-media {
  background: var(--ink-2);
  box-shadow: 0 26px 70px rgba(0,0,0,.55);
}
.p-media img { display: block; width: 100%; height: auto; }

/* Detalhes */
.p-info { display: flex; flex-direction: column; }
.p-badge {
  align-self: flex-start; font-family: var(--f-mono); font-size: 10.5px;
  letter-spacing: 0.2em; text-transform: uppercase; color: var(--bone);
  border: 1px solid var(--oxide); background: color-mix(in srgb, var(--oxide) 22%, transparent);
  padding: 5px 12px; margin-bottom: 16px;
}
.p-title {
  font-family: var(--f-display); font-weight: 600; color: var(--bone);
  font-size: clamp(30px, 6vw, 50px); line-height: 1.03; margin: 0 0 14px;
}
.p-price { font-family: var(--f-display); color: var(--bone); font-size: clamp(26px, 4.5vw, 34px); line-height: 1; margin: 0; }
.p-price .p-from { font-family: var(--f-mono); font-size: 12px; letter-spacing: .16em; text-transform: uppercase; color: var(--bone-dim); display: block; margin-bottom: 6px; }
.p-install { font-family: var(--f-mono); font-size: 12px; letter-spacing: .04em; color: var(--bone-dim); margin: 8px 0 0; }

/* Seletor de tamanho */
.p-sizes-label {
  font-family: var(--f-mono); font-size: 11px; letter-spacing: 0.24em;
  text-transform: uppercase; color: var(--bone-dim); margin: clamp(20px,3vh,30px) 0 12px;
}
.p-sizes { display: flex; flex-wrap: wrap; gap: 10px; }
.p-size {
  min-width: 52px; padding: 12px 14px; cursor: pointer;
  font-family: var(--f-mono); font-size: 13px; letter-spacing: 0.08em; font-weight: 500;
  color: var(--bone); background: var(--ink-2); border: 1px solid var(--rule-strong);
  transition: border-color .18s, background .18s, color .18s, transform .12s;
}
.p-size:hover { border-color: var(--oxide-bright); background: var(--ink-3); }
.p-size:active { transform: scale(.97); }
.p-size[aria-checked="true"] { border-color: var(--oxide-bright); background: var(--oxide); color: var(--bone); }

/* Botão comprar */
.p-buy {
  display: flex; align-items: center; justify-content: center; gap: 12px;
  width: 100%; margin-top: clamp(20px,3vh,28px); padding: 18px 22px;
  font-family: var(--f-mono); font-size: 13px; letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--bone); background: var(--oxide); border: 1px solid var(--oxide);
  transition: background .18s, border-color .18s, transform .12s;
}
.p-buy:hover { background: var(--oxide-bright); border-color: var(--oxide-bright); }
.p-buy:active { transform: scale(.99); }
.p-buy .p-buy-go svg { transition: transform .2s; }
.p-buy:hover .p-buy-go svg { transform: translate(2px, -2px); }

/* Pagamento / envio */
.p-pay {
  display: flex; flex-wrap: wrap; gap: 6px 14px; margin: 16px 0 0;
  font-family: var(--f-mono); font-size: 11px; letter-spacing: 0.08em; color: var(--ash-2);
}
.p-pay span { white-space: nowrap; }
.p-pay b { color: var(--bone-dim); font-weight: 500; }

/* Descrição */
.p-details { margin: clamp(24px,4vh,36px) 0 0; border-top: 1px solid var(--rule); padding-top: clamp(20px,3vh,28px); }
.p-details h2 {
  font-family: var(--f-mono); font-size: 11px; letter-spacing: 0.24em; text-transform: uppercase;
  color: var(--bone-dim); margin: 0 0 14px; font-weight: 500;
}
.p-details ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.p-details li {
  position: relative; padding-left: 20px; color: var(--bone-dim);
  font-family: var(--f-display); font-size: 17px; line-height: 1.4;
}
.p-details li::before { content: "†"; position: absolute; left: 0; color: var(--oxide-bright); }

/* Rodapé */
.p-foot {
  border-top: 1px solid var(--rule); padding: 22px 0 30px;
  display: flex; flex-wrap: wrap; gap: 8px 20px; justify-content: space-between;
}
.p-foot .meta a { border-bottom: 1px solid var(--rule); }
.p-foot .meta a:hover { color: var(--bone); border-color: var(--rule-strong); }
</style>
</head>
<body>

<div class="p-shell">

  <main class="p-main">

    <div class="p-top">
      <p class="p-kicker">${p.kicker}</p>
      <a class="p-back" href="/#store" data-ga-type="navigate" data-ga-item="home" data-ga-loc="merch-${p.slug}">Voltar ao site</a>
    </div>

    <div class="p-grid">

      <!-- Imagem -->
      <div class="p-media">
        <img src="${p.image}" alt="${p.imageAlt}" width="${p.imageW}" height="${p.imageH}" fetchpriority="high">
      </div>

      <!-- Detalhes -->
      <div class="p-info">
        <span class="p-badge">${p.preorder}</span>
        <h1 class="p-title">${p.name}</h1>

        <p class="p-price">
          <span class="p-from">A partir de</span>
          <span data-price-display>${brl(low)}</span>
        </p>
        <p class="p-install" data-install-display>Em até ${p.installments}x de ${brl(installLow)} sem juros</p>

        <p class="p-sizes-label">Escolha o tamanho</p>
        <div class="p-sizes" role="radiogroup" aria-label="Tamanho">
${sizes}
        </div>

        <a class="p-buy" href="${p.productUrl}" target="_blank" rel="noreferrer"
           data-buy data-product-url="${p.productUrl}"
           data-ga-type="buy" data-ga-item="${p.slug}" data-ga-loc="merch-${p.slug}">
          ${BAG}
          <span data-buy-label>Comprar</span>
          <span class="p-buy-go">${ARROW}</span>
        </a>

        <p class="p-pay">
          <span><b>Pix</b>, cartão ou boleto</span>
          <span>Até ${p.installments}x sem juros</span>
          <span>Envio para todo o Brasil</span>
        </p>

        <div class="p-details">
          <h2>Sobre a peça</h2>
          <ul>
${details}
          </ul>
        </div>
      </div>

    </div>

  </main>

  <footer class="p-foot">
    <span class="meta">Ereboros · Rio de Janeiro</span>
    <span class="meta"><a href="${p.productUrl}" target="_blank" rel="noreferrer" data-ga-type="navigate" data-ga-item="store" data-ga-loc="merch-${p.slug}">Loja oficial</a> · <a href="mailto:merch@ereboros.com">merch@ereboros.com</a></span>
  </footer>

</div>

<script>
// Seletor de tamanho: atualiza preço/parcelas exibidos e reaponta o botão
// Comprar para o carrinho (deep link) daquele tamanho. Sem tamanho escolhido,
// o botão abre a página do produto na loja (fallback seguro).
(function () {
  var PRODUCT_URL = ${JSON.stringify(p.productUrl)};
  var PRODUCT_NAME = ${JSON.stringify(p.name)};
  var PRODUCT_SLUG = ${JSON.stringify(p.slug)};
  var INSTALL = ${p.installments};
  var sizes = Array.prototype.slice.call(document.querySelectorAll(".p-size"));
  var buy = document.querySelector("[data-buy]");
  var buyLabel = document.querySelector("[data-buy-label]");
  var priceEl = document.querySelector("[data-price-display]");
  var fromEl = document.querySelector(".p-from");
  var installEl = document.querySelector("[data-install-display]");
  var chosen = null;

  function brl(cents) { return "R$ " + (cents / 100).toFixed(2).replace(".", ","); }

  sizes.forEach(function (btn) {
    btn.addEventListener("click", function () {
      sizes.forEach(function (b) { b.setAttribute("aria-checked", "false"); });
      btn.setAttribute("aria-checked", "true");
      chosen = btn;
      var price = parseInt(btn.getAttribute("data-price"), 10);
      var label = btn.getAttribute("data-label");
      if (fromEl) fromEl.style.display = "none";
      priceEl.textContent = brl(price);
      installEl.textContent = "Em até " + INSTALL + "x de " + brl(Math.floor(price / INSTALL)) + " sem juros";
      buyLabel.textContent = "Comprar · tamanho " + label;
      buy.setAttribute("href", btn.getAttribute("data-cart"));
    });
  });

  // Rastreio: clique em Comprar -> AddToCart (Pixel) + add_to_cart (GA4)
  buy.addEventListener("click", function () {
    var price = chosen ? parseInt(chosen.getAttribute("data-price"), 10) : null;
    var size = chosen ? chosen.getAttribute("data-label") : null;
    if (window.fbq && /^\\d+$/.test(window.META_PIXEL_ID)) {
      fbq("track", "AddToCart", {
        content_name: PRODUCT_NAME, content_type: "product", content_ids: [PRODUCT_SLUG],
        value: price ? price / 100 : undefined, currency: "BRL"
      });
    }
    if (typeof gtag === "function") {
      gtag("event", "add_to_cart", { currency: "BRL", value: price ? price / 100 : undefined, items: [{ item_id: PRODUCT_SLUG, item_name: PRODUCT_NAME, item_variant: size }] });
    }
  });

  // GA4 genérico para os demais data-ga-type (navigate etc.)
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-ga-type]");
    if (!el || el.hasAttribute("data-buy")) return;
    if (typeof gtag === "function") {
      gtag("event", "select_content", {
        content_type: el.getAttribute("data-ga-type"),
        item_id: el.getAttribute("data-ga-item") || "",
        location: el.getAttribute("data-ga-loc") || ""
      });
    }
  }, true);
})();
</script>

</body>
</html>
`;
}

// ---- Escrita ---------------------------------------------------------------
for (const p of PRODUCTS) {
  const outDir = `${dir}/merch/${p.slug}`;
  mkdirSync(outDir, { recursive: true });
  writeFileSync(`${outDir}/index.html`, renderPage(p), "utf8");
  console.log(`✓ /merch/${p.slug}/  (${p.sizes.length} tamanhos)`);
}
console.log(`\n${PRODUCTS.length} página(s) de produto gerada(s).`);
