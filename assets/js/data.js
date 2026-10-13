/* ==========================================================================
   ADORA — Datos editables del sitio
   --------------------------------------------------------------------------
   Este es el ÚNICO archivo que necesitás tocar para cambiar precios, textos,
   imágenes, enlaces de reserva, redes sociales e información del local.

   Reglas rápidas:
   - price: número en colones, sin puntos ni símbolo (ej. 18000).
   - duration: texto (ej. "60 min"). Si es null se muestra "Duración por confirmar".
   - image: ruta a una imagen (ej. "assets/img/servicios/luminary.webp").
            Si es null se muestra un placeholder elegante.
   - Cualquier valor null o "" en `business` / `links` se muestra como
     "[CONFIRMAR CON ADORA]" o deja el botón en estado "enlace pendiente".
   ========================================================================== */

window.ADORA = {
  /* Fotos reales de Adora (subirlas a assets/img/fotos/ con estos nombres). */
  hero: {
    image: "assets/img/fotos/dani-portada.webp",
    alt: "Dani, fundadora de Adora, junto al letrero ADORA en el local",
  },

  /* Fila "Diseños Adora" (estilo trending).
     image = foto real de Adora; fallback = foto de relleno (Pexels) que se
     muestra mientras la real no esté subida. */
  trending: [
    { name: "Nude glitter", image: null /* subir assets/img/fotos/unas-cafe-3d.jpg y poner la ruta */, fallback: "assets/img/stock/manicure-nude.webp", alt: "Uñas stiletto en degradé café con relieve 3D hechas en Adora" },
    { name: "Glitter rosé", image: null /* subir assets/img/fotos/unas-glitter.jpg y poner la ruta */, fallback: "assets/img/stock/manicure-glitter.webp", alt: "Uñas stiletto nude con puntas de glitter iridiscente hechas en Adora" },
    { name: "Perlas", image: null /* subir assets/img/fotos/unas-polka.jpg y poner la ruta */, fallback: "assets/img/stock/manicure-perlas.webp", alt: "Uñas almendra con lunares en café y celeste hechas en Adora" },
    { name: "Nude clásico", image: "assets/img/stock/manos-nude.webp", alt: "Manos con manicure nude (foto de referencia)" },
  ],

  /* Selector de reserva: momentos del día (NO son horarios confirmados). */
  bookingTimes: ["Mañana", "Mediodía", "Tarde"],

  business: {
    name: "Adora Nail Salon",
    tagline: "Una experiencia pensada con amor",
    signature: "Con amor: Dani",
    country: "Costa Rica",
    city: null,              // [CONFIRMAR CON ADORA] ej. "San José"
    address: null,           // [CONFIRMAR CON ADORA] dirección exacta
    mapsUrl: null,           // [CONFIRMAR CON ADORA] link de Google Maps
    phone: "+506 7295 3736",
    email: null,             // [CONFIRMAR CON ADORA]
    // Horarios: array de { days, hours }. Vacío = se muestra "[CONFIRMAR CON ADORA]".
    // Fuente: vinil exterior oficial de Adora (los días no se indican).
    hours: [{ days: null, hours: "9:00 a.m. – 6:00 p.m." }], // days: null = no se muestran días
    hoursNote: "Reservá tu cita con anticipación.",
    policies: null,          // [CONFIRMAR CON ADORA] ej. políticas de cancelación / adelanto
  },

  links: {
    // Link principal de reserva (agenda online, WhatsApp, Instagram…).
    booking: "",             // [AGREGAR LINK DE RESERVA]
    // Número de WhatsApp SOLO dígitos con código de país, ej. "50688888888".
    // Si existe, cada botón "Reservar" abre WhatsApp con el servicio ya escrito.
    whatsapp: "50672953736", // +506 7295 3736 (confirmado por Adora)
    instagram: "https://www.instagram.com/adoranails.cr/", // @adoranails.cr (vinil oficial)
    facebook: "",
    tiktok: "https://www.tiktok.com/@adoranails.cr",       // @adoranails.cr (vinil oficial)
    handle: "@adoranails.cr",
  },

  categories: [
    {
      id: "manicure",
      label: "Manicure",
      kicker: "servicios",
      icon: "hand",
      note: "Qué incluye cada nivel de diseño (sencillo, básico, elaborado): [CONFIRMAR CON ADORA]",
    },
    { id: "pedicure", label: "Pedicure", kicker: "servicios", icon: "foot", note: null },
    { id: "cejas", label: "Cejas y pestañas", kicker: "servicios", icon: "eye", note: null },
  ],

  /* Orden y precios tomados de los menús oficiales de Adora. */
  services: [
    // ——— MANICURE ———
    { id: "builder-sencillo", category: "manicure", group: "Builder Gel", name: "Builder Gel · diseño sencillo", description: "Gel de construcción que nivela y refuerza tu uña natural.", price: 18000, duration: null, image: null },
    { id: "builder-basico", category: "manicure", group: "Builder Gel", name: "Builder Gel · diseño básico", description: "Gel de construcción que nivela y refuerza tu uña natural.", price: 20000, duration: null, image: null },
    { id: "builder-elaborado", category: "manicure", group: "Builder Gel", name: "Builder Gel · diseño elaborado", description: "Gel de construcción que nivela y refuerza tu uña natural.", price: 22000, duration: null, image: null },

    { id: "gelx-sencillo", category: "manicure", group: "Gel X", name: "Gel X · sencillo", description: "Extensiones de gel para ganar largo y forma.", price: 20000, duration: null, image: null },
    { id: "gelx-basico", category: "manicure", group: "Gel X", name: "Gel X · diseño básico", description: "Extensiones de gel para ganar largo y forma.", price: 22000, duration: null, image: null },
    { id: "gelx-elaborado", category: "manicure", group: "Gel X", name: "Gel X · diseño elaborado", description: "Extensiones de gel para ganar largo y forma.", price: 24000, duration: null, image: null },

    { id: "luminary-sencillo", category: "manicure", group: "Luminary", name: "Luminary · diseño sencillo", description: "Sistema de gel Luminary para uñas fuertes y con brillo.", price: 17000, duration: null, image: null },
    { id: "luminary-basico", category: "manicure", group: "Luminary", name: "Luminary · diseño básico", description: "Sistema de gel Luminary para uñas fuertes y con brillo.", price: 19000, duration: null, image: null },
    { id: "luminary-elaborado", category: "manicure", group: "Luminary", name: "Luminary · diseño elaborado", description: "Sistema de gel Luminary para uñas fuertes y con brillo.", price: 21000, duration: null, image: null },

    { id: "polygel", category: "manicure", group: "Más servicios", name: "Polygel", description: "Sistema que combina gel y acrílico para extensión o refuerzo.", price: 22000, duration: null, image: null },
    { id: "manicure-spa", category: "manicure", group: "Más servicios", name: "Manicure Spa", description: "Cuidado de manos con ritual spa.", price: 10000, duration: null, image: null },
    { id: "retiro-mani", category: "manicure", group: "Más servicios", name: "Retiro de otro salón", description: "Retiro del producto aplicado en otro salón.", price: 3500, duration: null, image: null, addon: true },

    // ——— PEDICURE ———
    { id: "esmaltado-semi", category: "pedicure", name: "Esmaltado semipermanente", description: "Color semipermanente de larga duración para tus pies.", price: 12000, duration: null, image: null },
    { id: "pedi-seco", category: "pedicure", name: "Pedi en seco", description: "Pedicure sin inmersión en agua.", price: 18000, duration: null, image: null },
    { id: "jelly-spa", category: "pedicure", name: "Jelly Spa", description: "Pedicure spa con baño de gelatina para tus pies.", price: 25000, duration: null, image: null },
    { id: "pedi-spa", category: "pedicure", name: "Pedi Spa", description: "Pedicure con ritual spa.", price: 22000, duration: null, image: null },
    { id: "retiro-pedi", category: "pedicure", name: "Retiro de otro salón", description: "Retiro del producto aplicado en otro salón.", price: 3500, duration: null, image: null, addon: true },

    // ——— CEJAS Y PESTAÑAS ———
    { id: "depilacion-bigote", category: "cejas", name: "Depilación de bigote", description: "Depilación del área del bozo.", price: 5000, duration: null, image: null },
    { id: "depilacion-cejas", category: "cejas", name: "Depilación de cejas", description: "Limpieza y definición de la forma de tus cejas.", price: 12000, duration: null, image: null },
    { id: "lifting-cejas", category: "cejas", name: "Lifting de cejas", description: "Incluye lifting de cejas, diseño de cejas, tinte y depilación.", price: 18000, duration: null, image: null, badge: "Incluye 4 pasos" },
    { id: "lifting-pestanas", category: "cejas", name: "Lifting de pestañas", description: "Eleva y curva tus pestañas naturales.", price: 25000, duration: null, image: null },
    { id: "lifting-pestanas-coreano", category: "cejas", name: "Lifting de pestañas coreano", description: "Lifting de pestañas con técnica coreana.", price: 28000, duration: null, image: null },
  ],

  /* Sección "Destacados". `services` referencia ids de arriba: el precio
     se calcula solo (muestra "desde" el menor). */
  featured: [
    { id: "luminary", title: "Luminary", kicker: "Manicure", text: "Tres niveles de diseño, del más sencillo al más elaborado.", services: ["luminary-sencillo", "luminary-basico", "luminary-elaborado"], image: null /* subir assets/img/fotos/unas-polka.jpg y poner la ruta */, alt: "Uñas almendra con lunares en café y celeste hechas en Adora", fallback: "assets/img/stock/manicure-nude.webp", tone: "pink" },
    { id: "lifting-pestanas", title: "Lifting de pestañas", kicker: "Pestañas", text: "Clásico o con técnica coreana.", services: ["lifting-pestanas", "lifting-pestanas-coreano"], image: "assets/img/stock/pestanas.webp", tone: "choc" },
    { id: "jelly-spa", title: "Jelly Spa", kicker: "Pedicure", text: "Pedicure spa con baño de gelatina.", services: ["jelly-spa"], image: "assets/img/stock/pedicure.webp", tone: "cream" },
    { id: "elaborados", title: "Diseños elaborados", kicker: "Nail art", text: "En Builder Gel, Gel X o Luminary.", services: ["builder-elaborado", "gelx-elaborado", "luminary-elaborado"], image: null /* subir assets/img/fotos/unas-cafe-3d.jpg y poner la ruta */, alt: "Uñas stiletto en degradé café con relieve 3D hechas en Adora", fallback: "assets/img/stock/manicure-glitter.webp", tone: "choc" },
    { id: "manicure-spa", title: "Manicure Spa", kicker: "Manicure", text: "Un momento para tus manos.", services: ["manicure-spa"], image: "assets/img/stock/manos-nude.webp", tone: "pink" },
  ],

  /* Coffee menu — misma numeración del menú oficial. */
  coffee: {
    note: "Disfruta en cada una de tus citas una experiencia pensada con amor, elige tu bebida y snack favorito incluido en tu servicio.",
    priceLabel: "Incluido en tu servicio",
    items: [
      { n: "01", name: "Café negro", image: "assets/img/coffee/01.webp", type: "bebida" },
      { n: "02", name: "Capuchino", image: "assets/img/coffee/02.webp", type: "bebida" },
      { n: "03", name: "Caramel latte", image: "assets/img/coffee/03.webp", type: "bebida" },
      { n: "04", name: "Coconut matcha", image: "assets/img/coffee/04.webp", type: "bebida" },
      { n: "05", name: "Strawberry matcha", image: "assets/img/coffee/05.webp", type: "bebida" },
      { n: "06", name: "Matcha latte", image: "assets/img/coffee/06.webp", type: "bebida" },
      { n: "07", name: "Salteñas", image: "assets/img/coffee/07.webp", type: "snack" },
      { n: "08", name: "Galleta", image: "assets/img/coffee/08.webp", type: "snack" },
      { n: "09", name: "Coca-Cola", image: "assets/img/coffee/09.webp", type: "bebida" },
    ],
  },

  /* Galería. image: null = placeholder para reemplazar con fotos oficiales.
     size: "tall" | "wide" | "big" | "" (controla la composición asimétrica). */
  gallery: [
    { label: "Manicure", alt: "Uñas stiletto nude con puntas de glitter hechas en Adora", image: null /* subir assets/img/fotos/unas-glitter.jpg y poner la ruta */, fallback: "assets/img/stock/manicure-glitter.webp", size: "tall" },
    { label: "Coffee menu", alt: "Matcha latte del coffee menu de Adora", image: "assets/img/coffee/06.webp", size: "", cream: true },
    { label: "Pestañas", alt: "Pestañas con lifting (foto de referencia)", image: "assets/img/stock/pestanas.webp", size: "" },
    { label: "Menú de manicure", alt: "Menú oficial de servicios de manicure de Adora", image: "assets/img/menus/menu-3.webp", size: "tall", contain: true },
    { label: "Diseño elaborado", alt: "Uñas stiletto en degradé café con relieve 3D hechas en Adora", image: null /* subir assets/img/fotos/unas-cafe-3d.jpg y poner la ruta */, fallback: "assets/img/stock/manicure-nude.webp", size: "wide" },
    { label: "Ambiente del espacio", alt: "Dani junto al letrero ADORA en el local", image: "assets/img/fotos/dani-portada.webp", fallback: "assets/img/stock/ambiente.webp", size: "" },
    { label: "Cejas", alt: "Diseño de cejas (foto de referencia)", image: "assets/img/stock/cejas.webp", size: "tall" },
    { label: "Pedicure", alt: "Pedicure (foto de referencia)", image: "assets/img/stock/pedicure.webp", size: "" },
    { label: "Detalles y productos", alt: "Esmalte en gel y manicure (foto de referencia)", image: "assets/img/stock/productos.webp", size: "" },
    { label: "Snacks", alt: "Galleta del coffee menu de Adora", image: "assets/img/coffee/08.webp", size: "", cream: true },
    { label: "Nail art", alt: "Uñas almendra con lunares en café y celeste hechas en Adora", image: null /* subir assets/img/fotos/unas-polka.jpg y poner la ruta */, fallback: "assets/img/stock/manicure-perlas.webp", size: "wide" },
  ],
};
