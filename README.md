# Versículos Bíblicos

Aplicación web de meditación bíblica con experiencia visual celestial, versículos por categoría, soporte ES/EN, descarga de imagen, notificaciones opcionales y modo PWA.

## Qué es

`Versículos Bíblicos` muestra versículos bíblicos aleatorios con enfoque devocional:

- Categorías emocionales/espirituales (`sabiduría`, `consuelo`, `esperanza`, `amor`, etc.).
- Interfaz bilingüe (español / inglés).
- Fondo animado cósmico y UI enfocada en lectura.
- Descarga/compartir del card como imagen PNG.

## Funcionalidades principales

- **Versículo aleatorio por categoría** con anti-repetición en memoria local.
- **Modo de conexión** visible (`Online` / `Offline`).
- **Fallback inteligente de fuente**:
  - ES: dataset local (RVR60).
  - EN: intenta API remota y cae a local si falla.
- **Acciones rápidas** en card:
  - Compartir
  - Descargar PNG
  - Copiar texto
- **Toasts globales** para errores y eventos importantes.
- **Páginas de error personalizadas** (`404`, `500`).
- **PWA** con `manifest` + service worker (actualización automática).
- **Notificaciones opcionales** (opt-in) con recordatorio diario matutino.

## Estadísticas del contenido

Según metadatos de los datasets actuales:

- **ES (RVR60 local):** `5000` versículos.
- **EN (curated local):** `75` versículos.

## Stack técnico

- **Framework:** Astro
- **UI:** React islands + Astro components
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **PWA:** `@vite-pwa/astro`
- **Captura de imagen:** `html-to-image` + `html2canvas` (fallback)

## Estructura (resumen)

```txt
src/
  components/
    celestial/        # Header, fondo cósmico, conexión
    selectors/        # Mood/lang selectors
    ui/               # URL sync, toasts, opt-in notificaciones
    verse/            # Card, acciones, descarga
  data/               # Datasets locales ES/EN
  lib/                # dominio, repositorios, servicios, i18n
  pages/              # index + 404 + 500
public/img/           # logos y assets visuales
```

## Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
```

Opcional:

```bash
npm run gen:en
```

## Modo Online/Offline (comportamiento)

- **ES:** usa fuente local RVR60.
- **EN:** intenta API remota; si hay fallo de red/API, usa local.
- La interfaz muestra el estado de conexión en tiempo real en el header.

## PWA (nombre de app)

El proyecto incluye configuración PWA con:

- `manifest.webmanifest`
- service worker generado en build
- `registerType: autoUpdate`

Esto permite instalación en dispositivos compatibles y actualización automática de recursos.

Nombre mostrado al instalar la app:

- **BVerses**

## Desarrollo y despliegue

1. Instala dependencias.
2. Corre `npm run dev` para desarrollo.
3. Usa `npm run build` para salida estática en `dist/`.
4. Despliega `dist/` en tu hosting estático preferido.

## Empresa desarrolladora

Desarrollado por **SysJoL**  
Sitio: [https://sysjol.onrender.com/](https://sysjol.onrender.com/)
