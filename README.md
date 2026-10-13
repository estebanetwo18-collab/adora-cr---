# Adora — Catálogo web

One-page estática (HTML + CSS + JS, sin build) con el catálogo de servicios, el coffee menu y la reserva por WhatsApp de Adora.

Abrí `index.html` en el navegador o serví la carpeta (`python3 -m http.server`).

## Estructura

```
index.html              Página (estructura semántica, SEO, Open Graph)
assets/css/styles.css   Estilos (paleta de los menús: chocolate, rosa/lila, crema)
assets/js/data.js       ← DATOS EDITABLES (servicios, precios, fotos, links, local)
assets/js/main.js       Render del catálogo, tabs, reserva, animaciones
assets/img/coffee/      Productos recortados del coffee menu oficial
assets/img/menus/       Menús oficiales (manicure, pedicure, cejas, coffee)
assets/img/fotos/       Fotos reales de Adora (ver abajo)
```

## Cómo actualizar

Todo se edita en **`assets/js/data.js`**:

- **Precios / servicios**: en `services`, cambiá `price` (número sin puntos, ej. `18000`), `name` o `description`. Para agregar uno, copiá una línea y cambiá el `id`.
- **Duración**: `duration: "60 min"`. Si queda en `null` se muestra "Duración por confirmar".
- **Fotos**: subí la imagen a `assets/img/fotos/` y poné la ruta en `image` (donde hoy dice `image: null`). Mientras tanto se usa la foto de relleno de `fallback`.
- **Reserva**: `links.whatsapp` (solo dígitos con código de país). Cada botón "Reservar" abre WhatsApp con el servicio ya escrito.
- **Redes, horarios y dirección**: `links.instagram`, `business.hours` (`[{ days: "Lun–Vie", hours: "9:00–18:00" }]`), `business.address`, `business.mapsUrl`.
- **Destacados**: en `featured`, cada tarjeta referencia ids de servicios y calcula los precios sola.

## Publicar en Vercel

El proyecto ya está listo (`vercel.json` incluido, sin build):

1. En [vercel.com/new](https://vercel.com/new) importá el repositorio `adora-cr---`.
2. Framework Preset: **Other**. Build Command y Output Directory: vacíos.
3. **Deploy**.
4. Si Vercel no ve la rama, en *Settings → Git → Production Branch* poné la rama del proyecto.
5. Cuando tengas el dominio final, cambiá en `index.html` la línea `og:image`
   por la URL completa (ej. `https://adora.vercel.app/assets/img/og-image.jpg`)
   para que la vista previa se vea al compartir el link en WhatsApp o Instagram.

Versión de un solo archivo para otros hostings: `python3 scripts/build-single.py` genera `dist/index.html`.

## Fotos

| Archivo | Estado | Uso |
|---|---|---|
| `assets/img/fotos/dani-portada.webp` | ✅ subida | Portada y "Ambiente" |
| `assets/img/fotos/unas-cafe-3d.jpg` | pendiente | Diseños, destacados, galería |
| `assets/img/fotos/unas-glitter.jpg` | pendiente | Diseños, galería |
| `assets/img/fotos/unas-polka.jpg` | pendiente | Diseños, destacados, galería |

Mientras una foto real no esté subida, se muestra una **foto de relleno** de
`assets/img/stock/` (Pexels, licencia libre: uso gratis, sin atribución obligatoria).
Al subir la foto real, poné su ruta en `assets/js/data.js` (los lugares están marcados con `subir assets/img/fotos/...`).

Fotos de relleno usadas (Pexels): 35491156, 17280274, 6941115, 20363675, 29588096,
21412169, 7755244, 35103938, 34941685 — `https://www.pexels.com/photo/<id>/`.

## Fuentes de datos

- Menús oficiales de Adora (servicios, precios, coffee menu).
- Vinil exterior oficial (`Vinil_Exterior_Adora.ai`): logo, horario 9:00 a.m. – 6:00 p.m.,
  Instagram y TikTok `@adoranails.cr`, WhatsApp.
