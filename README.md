# Versiculos Biblicos

App web/PWA de meditacion biblica (ES/EN) con filtros por categoria, compartir/descarga de imagen y fallback local cuando las APIs no responden.

## Estado actual de UX (resumen)

- Header movil con logo/nombre a la izquierda y acciones a la derecha (filtro + cambio ES/EN).
- Filtro movil con icono y sheet bottom (categorias en grid, seleccion resaltada).
- Acciones devocionales (Medita/Ora/Reflexiona):
  - movil: bottom sheet,
  - desktop: modal centrada.
- Descarga de imagen:
  - si termina rapido: solo toast de exito,
  - si tarda: modal de progreso + toast final.

## Flujo de fuentes (hibrido)

- **Espanol (`es`)**: intenta primero API.Bible (ej. LBLA) y si falla usa dataset local.
- **Ingles (`en`)**:
  - `mood=all`: intenta `bible-api.com` primero.
  - categorias y fallback general: API.Bible (si esta configurada) y despues local.
- Siempre existe salida local para no romper UX en offline o errores remotos.

## Seguridad de API key

La clave de API.Bible se usa solo del lado servidor mediante:

- `src/pages/api/verse-remote.ts`

La key no debe estar en variables `PUBLIC_*`.

## Variables de entorno

Usa `.env` (ver `.env.example`) y configura lo mismo en Render:

```bash
API_BIBLE_KEY=your_api_bible_key_here
PUBLIC_API_BIBLE_BASE=https://rest.api.bible/v1
PUBLIC_API_BIBLE_BID_ES=
PUBLIC_API_BIBLE_BID_EN=
PUBLIC_BIBLE_API_BASE=https://bible-api.com
```

Notas:
- `API_BIBLE_KEY`: secreta, servidor.
- `PUBLIC_API_BIBLE_BID_ES`: recomendado para remoto en espanol.
- `PUBLIC_API_BIBLE_BID_EN`: opcional para remoto en ingles via API.Bible.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run start
```

## Despliegue en Render

La app corre como **Web Service** (Astro Node adapter), no como sitio estatico.

1. Crea el servicio web y conecta el repo.
2. Configura variables de entorno.
3. Build command: `npm run build`
4. Start command: `npm run start`
5. Verifica:
   - ES con y sin red remota,
   - EN `all` y por categorias,
   - fallback local cuando API falla.

## Arquitectura relevante

- `src/lib/services/VerseService.ts`: orquestacion remoto/local + anti-repeticion.
- `src/lib/repositories/BibleApiRepository.ts`: remoto EN (`bible-api.com`).
- `src/lib/repositories/ApiBibleRepository.ts`: cliente hacia proxy interno.
- `src/pages/api/verse-remote.ts`: proxy server-side con key segura.
- `src/components/ui/BottomSheet.tsx`: plantilla reusable React (sheet/modal responsivo).
- `src/components/ui/MobileBottomSheet.astro`: plantilla reusable Astro para sheets moviles.
- `src/data/verses-es.json`, `src/data/verses-en.json`: respaldo local.
