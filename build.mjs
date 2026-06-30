// EREBOROS — passo de build
// ---------------------------------------------------------------------------
// Pré-compila o JSX (a FONTE editável) para JS puro servido em produção, para
// que o navegador NÃO precise do Babel Standalone em runtime. Isso elimina ~3 MB
// de download + a transpilação na main thread (o maior gargalo no mobile).
//
// Não instala nada no projeto: usa o esbuild via `npx` (cache global do npm),
// preservando o espírito "sem dependências instaladas" do repositório.
//
// Uso:
//   node build.mjs
//
// Edite sempre os .jsx; rode este script; os .js gerados são os artefatos
// servidos pelo index.html. Lembre de incrementar o ?v= no index.html (cache).
// ---------------------------------------------------------------------------

import { execFileSync } from "node:child_process";
import { statSync } from "node:fs";

const FILES = ["components", "sections", "app"];
const ESBUILD = "esbuild@0.24.0";
const npx = process.platform === "win32" ? "npx.cmd" : "npx";

for (const name of FILES) {
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
    { stdio: "inherit", cwd: import.meta.dirname, shell: true }
  );
  const kb = (statSync(`${import.meta.dirname}/${name}.js`).size / 1024).toFixed(1);
  console.log(`✓ ${name}.jsx → ${name}.js  (${kb} KB)`);
}

console.log("\nBuild concluído. Lembre de incrementar o ?v= no index.html.");
