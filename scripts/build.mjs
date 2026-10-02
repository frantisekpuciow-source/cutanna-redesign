import { cp, mkdir, rm, writeFile } from 'node:fs/promises';

const output = new URL('../dist/', import.meta.url);
await rm(output, { recursive: true, force: true });
await mkdir(new URL('_links/', output), { recursive: true });
await writeFile(new URL('.nojekyll', output), '');
for (const name of ['index.html', 'styles.css', 'main.js']) {
  await cp(new URL(`../${name}`, import.meta.url), new URL(name, output));
}
for (const name of [
  'PouzeLogo-Cutanna.png', 'head_video_3.mp4', 'head-poster.jpg',
  'mramor-textura-v1.png', 'nase-sluzby-moderni-strihy.webp',
  'nase-sluzby-prijemne-prostredi.webp', 'nase-sluzby-tetovani.webp'
]) {
  await cp(new URL(`../_links/${name}`, import.meta.url), new URL(`_links/${name}`, output));
}

await mkdir(new URL('fonts/', output), { recursive: true });
for (const name of ['Cinzel-LICENSE.txt', 'Roboto-LICENSE.txt']) {
  await cp(new URL(`../fonts/${name}`, import.meta.url), new URL(`fonts/${name}`, output));
}
for (const [family, file] of [
  ['cinzel', 'cinzel-latin-ext-400-normal.woff2'],
  ['cinzel', 'cinzel-latin-400-normal.woff2'],
  ['roboto', 'roboto-latin-ext-400-normal.woff2'],
  ['roboto', 'roboto-latin-400-normal.woff2']
]) {
  await cp(new URL(`../fonts/${file}`, import.meta.url), new URL(`fonts/${file}`, output));
}
