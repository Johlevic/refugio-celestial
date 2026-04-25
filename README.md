# Versiculos Biblicos

App web/PWA de meditacion biblica (ES/EN) con filtros por categoria, compartir/descarga y fallback local cuando las APIs no responden.

## Flujo de fuentes (hibrido)

- **Espanol (`es`)**: intenta primero `API.Bible` (ej. LBLA) y si falla usa dataset local.
- **Ingles (`en`)**:
  - `mood=all`: intenta `bible-api.com` primero.
  - para categorias y fallback general: usa API.Bible (si esta configurada) y despues local.
- Siempre hay salida local para no romper UX en offline o errores remotos.

## Seguridad de API key

La clave de `API.Bible` se usa **solo del lado servidor** mediante endpoint Astro:

- `src/pages/api/verse-remote.ts`

La key **no** debe estar en variables `PUBLIC_*`.

## Variables de entorno

Usa `.env` (ver `.env.example`) y configura las mismas en Render:

```bash
API_BIBLE_KEY=your_api_bible_key_here
PUBLIC_API_BIBLE_BASE=https://api.scripture.api.bible/v1
PUBLIC_API_BIBLE_BID_ES=
PUBLIC_API_BIBLE_BID_EN=
PUBLIC_BIBLE_API_BASE=https://bible-api.com
```

Notas:
- `API_BIBLE_KEY`: secreta, servidor.
- `PUBLIC_API_BIBLE_BID_ES`: obligatorio si quieres remoto en espanol.
- `PUBLIC_API_BIBLE_BID_EN`: opcional para remoto en ingles via API.Bible.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Despliegue en Render

1. Crea el servicio web y conecta el repo.
2. Configura variables de entorno (arriba) en Render.
3. Build command: `npm run build`
4. Start command: `npm run preview` (o tu comando de runtime preferido).
5. Verifica:
   - ES con y sin red remota
   - EN `all` y categorias
   - fallback local cuando API falla.

## Estructura relevante

- `src/lib/services/VerseService.ts`: orquestacion remoto/local + anti-repeticion.
- `src/lib/repositories/BibleApiRepository.ts`: remoto EN (`bible-api.com`).
- `src/lib/repositories/ApiBibleRepository.ts`: cliente -> proxy interno.
- `src/pages/api/verse-remote.ts`: proxy server-side con key segura.
- `src/data/verses-es.json`, `src/data/verses-en.json`: respaldo local.
