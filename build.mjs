// EREBOROS — passo de build
// ---------------------------------------------------------------------------
// 1) Pré-compila o JSX (a FONTE editável) para JS puro servido em produção, para
//    que o navegador NÃO precise do Babel Standalone em runtime.
// 2) Gera a variante em inglês (en/index.html) a partir do index.html (PT),
//    tornando o conteúdo EN indexável (URLs distintas + hreflang).
//
// Não instala nada no projeto: usa o esbuild via `npx` (cache global do npm).
//
// Uso:
//   node build.mjs
//
// Edite sempre os .jsx / o index.html; rode este script; os .js e o en/index.html
// gerados são os artefatos servidos. Lembre de incrementar o ?v= no index.html.
// ---------------------------------------------------------------------------

import { execFileSync } from "node:child_process";
import { statSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";

const dir = import.meta.dirname;
const npx = process.platform === "win32" ? "npx.cmd" : "npx";
const ESBUILD = "esbuild@0.24.0";

// ---- 1) Transpila os .jsx para .js -----------------------------------------
for (const name of ["components", "sections", "app"]) {
  execFileSync(
    npx,
    [
      "--yes",
      ESBUILD,
      `${name}.jsx`,
      "--loader:.jsx=jsx",
      // Sem minify: o ganho (~2 KB gzip) é irrelevante perto dos ~3 MB de Babel
      // removidos, e minificar apagaria comentários — incluindo os marcadores
      // /*EDITMODE-BEGIN*/.../*EDITMODE-END*/ de app.jsx, usados pela ferramenta
      // de edição externa. Mantém os .js legíveis para debug.
      "--charset=utf8",
      "--log-level=warning",
      `--outfile=${name}.js`,
    ],
    // shell:true é necessário para spawnar npx.cmd no Windows (Node 22+).
    { stdio: "inherit", cwd: dir, shell: true }
  );
  const kb = (statSync(`${dir}/${name}.js`).size / 1024).toFixed(1);
  console.log(`✓ ${name}.jsx → ${name}.js  (${kb} KB)`);
}

// ---- 2) Gera en/index.html a partir do index.html (PT) ---------------------
// Substituições de idioma. Cada `de` deve existir exatamente uma vez no HTML PT;
// se algum não for encontrado (ex.: texto editado), o build FALHA em vez de
// gerar uma página EN incorreta silenciosamente. O JSON-LD e os assets são
// idênticos nas duas versões (caminhos absolutos), então não são transformados.
const NOSCRIPT_PT = `  <article>
    <h1>Ereboros — Death Metal</h1>
    <p>Death Metal — Rio de Janeiro, Brasil.</p>
    <p>Ereboros é uma banda brasileira de Death Metal formada na cidade do Rio de Janeiro, reunindo músicos veteranos da cena underground nacional. Sua sonoridade transita entre agressividade extrema, densidade atmosférica e construção melódica, criando uma estética intensa e contemporânea dentro da música extrema.</p>
    <p>Desde seu primeiro lançamento, em 2023, a banda vem expandindo consistentemente sua atuação através de apresentações ao vivo pelo Brasil, Europa e México, fortalecendo sua presença no circuito underground internacional.</p>
    <p>Em junho de 2026, a banda inicia um novo ciclo com o lançamento de um novo single, antecipando o álbum que será oficialmente lançado em outubro de 2026.</p>
    <p>Discografia: From Oblivion to the Grave (álbum, 2026), In the Depths of Misery (single, 2026), Ereboros (EP, 2023).</p>
    <p>Formação: Thiago Barbosa (Guitarra &amp; Vocais), Juan Carlos (Guitarra), Paulo Doc (Baixo), Victor Mendonça (Bateria).</p>
    <p>Links oficiais: Spotify, Bandcamp, YouTube, Instagram, TikTok, Facebook e loja oficial em ereboros.lojaintegrada.com.br.</p>
  </article>`;

const NOSCRIPT_EN = `  <article>
    <h1>Ereboros — Death Metal</h1>
    <p>Death Metal — Rio de Janeiro, Brazil.</p>
    <p>Ereboros is a Brazilian Death Metal band formed in Rio de Janeiro, bringing together seasoned musicians from the national underground scene. Their sound blends extreme aggression, atmospheric density and melodic composition, creating an intense and contemporary identity within extreme music.</p>
    <p>Since their debut release in 2023, the band has steadily expanded its presence through live performances across Brazil, Europe and Mexico, strengthening its position within the international underground circuit.</p>
    <p>In June 2026, the band begins a new chapter with the release of a new single, leading into the album officially scheduled for October 2026.</p>
    <p>Discography: From Oblivion to the Grave (album, 2026), In the Depths of Misery (single, 2026), Ereboros (EP, 2023).</p>
    <p>Lineup: Thiago Barbosa (Guitar &amp; Vocals), Juan Carlos (Guitar), Paulo Doc (Bass), Victor Mendonça (Drums).</p>
    <p>Official links: Spotify, Bandcamp, YouTube, Instagram, TikTok, Facebook and the official store at ereboros.lojaintegrada.com.br.</p>
  </article>`;

const REPLACEMENTS = [
  [`<html lang="pt-BR">`, `<html lang="en">`],
  [`<title>Ereboros — Death Metal | Rio de Janeiro</title>`,
   `<title>Ereboros — Death Metal | Rio de Janeiro, Brazil</title>`],
  [`<meta name="description" content="Ereboros — Death Metal do Rio de Janeiro, Brasil. Ouça as músicas, confira a agenda de shows ao vivo e o merch oficial da banda.">`,
   `<meta name="description" content="Ereboros — Death Metal from Rio de Janeiro, Brazil. Listen to the music, check the live tour dates and the band's official merch.">`],
  [`<link rel="canonical" href="https://www.ereboros.com/">`,
   `<link rel="canonical" href="https://www.ereboros.com/en/">`],
  [`<meta property="og:url" content="https://www.ereboros.com/">`,
   `<meta property="og:url" content="https://www.ereboros.com/en/">`],
  [`<meta property="og:description" content="Death Metal do Rio de Janeiro, Brasil. Ouça as músicas, confira a agenda de shows ao vivo e o merch oficial.">`,
   `<meta property="og:description" content="Death Metal from Rio de Janeiro, Brazil. Listen to the music, check the live tour dates and the official merch.">`],
  [`<meta property="og:locale" content="pt_BR">`, `<meta property="og:locale" content="en_US">`],
  [`<meta property="og:locale:alternate" content="en_US">`, `<meta property="og:locale:alternate" content="pt_BR">`],
  [`<meta name="twitter:description" content="Death Metal do Rio de Janeiro, Brasil. Ouça, agenda de shows e merch oficial.">`,
   `<meta name="twitter:description" content="Death Metal from Rio de Janeiro, Brazil. Music, tour dates and official merch.">`],
  [NOSCRIPT_PT, NOSCRIPT_EN],
  [`window.EREBOROS_LANG = "pt";`, `window.EREBOROS_LANG = "en";`],
];

// normaliza CRLF→LF para casar com as strings multilinha (ex.: bloco <noscript>)
let enHtml = readFileSync(`${dir}/index.html`, "utf8").replace(/\r\n/g, "\n");
for (const [from, to] of REPLACEMENTS) {
  if (!enHtml.includes(from)) {
    throw new Error(
      `build: alvo de i18n não encontrado no index.html (a variante EN não foi gerada).\n` +
      `Atualize REPLACEMENTS em build.mjs. Trecho: ${JSON.stringify(from.slice(0, 90))}`
    );
  }
  enHtml = enHtml.replace(from, to);
}
mkdirSync(`${dir}/en`, { recursive: true });
writeFileSync(`${dir}/en/index.html`, enHtml, "utf8");
console.log("✓ index.html → en/index.html (variante EN)");

console.log("\nBuild concluído. Lembre de incrementar o ?v= no index.html.");
