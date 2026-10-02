# Cutanna

Single-page web pro Cutanna Barbershop & Tattoo Studio. Stránka používá původní fotografie, logo a hero video ze složky `_links/`. Rezervační iframe Noona HQ používá URL dodanou provozovatelem.

## Vývoj

Požadavky: Node.js 20+ a Python 3. Nejsou potřeba žádné npm balíčky.

```sh
npm run dev
```

Web poběží na `http://127.0.0.1:4173/`.

## Kontrola a build

```sh
npm run check
```

Kontrola ověří syntaxi JavaScriptu a vytvoří statický web ve `dist/`. Složku `dist/` lze nasadit na běžný statický hosting. Pro lokální kontrolu buildu spusťte `python3 -m http.server 4173 --directory dist`.

Fonty Cinzel a Roboto jsou uloženy lokálně ve `fonts/`, včetně jejich licencí. Referenční videa v `_links/` slouží jen jako podklad; build kopíruje pouze assety používané webem.

## GitHub Pages

Výstup `dist/` se publikuje z kořene větve `gh-pages`. Soubor `.nojekyll` zachovává dostupnost assetů v adresáři `_links/`.
