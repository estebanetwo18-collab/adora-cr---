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
- **Fotos**: subí la imagen a `assets/img/fotos/` y poné la ruta en `image`. Si una foto falta o falla, se ve un placeholder elegante.
- **Reserva**: `links.whatsapp` (solo dígitos con código de país). Cada botón "Reservar" abre WhatsApp con el servicio ya escrito.
- **Redes, horarios y dirección**: `links.instagram`, `business.hours` (`[{ days: "Lun–Vie", hours: "9:00–18:00" }]`), `business.address`, `business.mapsUrl`.
- **Destacados**: en `featured`, cada tarjeta referencia ids de servicios y calcula los precios sola.

## Fotos que hay que subir (nombres exactos)

| Archivo | Uso |
|---|---|
| `assets/img/fotos/dani-portada.jpg` | Portada (Dani junto al letrero ADORA) |
| `assets/img/fotos/unas-cafe-3d.jpg` | Uñas stiletto degradé café 3D |
| `assets/img/fotos/unas-glitter.jpg` | Uñas stiletto nude con glitter |
| `assets/img/fotos/unas-polka.jpg` | Uñas almendra con lunares café/celeste |

Recomendado: JPG o WebP de ~1600 px en el lado mayor, menos de 400 KB.
