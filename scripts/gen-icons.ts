// Генерує PNG-іконки для manifest.webmanifest з public/favicon.svg.
// Запуск: npm run icons. Результат комітиться в public/.
import { readFileSync, writeFileSync } from "node:fs";
import { Resvg } from "@resvg/resvg-js";

const svg = readFileSync("public/favicon.svg", "utf8");

for (const size of [192, 512]) {
  const png = new Resvg(svg, { fitTo: { mode: "width", value: size } }).render().asPng();
  writeFileSync(`public/icon-${size}.png`, png);
  console.log(`public/icon-${size}.png`);
}
