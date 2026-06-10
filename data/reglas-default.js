// patron: texto a buscar (case-insensitive) en el concepto del extracto
// categoria: nombre de la categoría raíz del usuario (debe coincidir exactamente con categorias-default.js)
export const REGLAS_DEFAULT = [
  // ── Alimentación ──────────────────────────────────────────────
  { patron: "MERCADONA",    categoria: "Alimentación" },
  { patron: "CARREFOUR",    categoria: "Alimentación" },
  { patron: "LIDL",         categoria: "Alimentación" },
  { patron: "ALDI",         categoria: "Alimentación" },
  { patron: "ALCAMPO",      categoria: "Alimentación" },
  { patron: "HIPERCOR",     categoria: "Alimentación" },
  { patron: "AHORRAMAS",    categoria: "Alimentación" },
  { patron: "CONSUM",       categoria: "Alimentación" },
  { patron: "EROSKI",       categoria: "Alimentación" },
  { patron: "BONPREU",      categoria: "Alimentación" },
  { patron: "FROIZ",        categoria: "Alimentación" },
  { patron: "SPAR ",        categoria: "Alimentación" },
  { patron: "SUPERMERCADO", categoria: "Alimentación" },

  // ── Restaurantes (subcategoría de Alimentación) ───────────────
  { patron: "MCDONALD",     categoria: "Restaurantes" },
  { patron: "BURGER KING",  categoria: "Restaurantes" },
  { patron: "KFC",          categoria: "Restaurantes" },
  { patron: "TELEPIZZA",    categoria: "Restaurantes" },
  { patron: "DOMINO",       categoria: "Restaurantes" },
  { patron: "STARBUCKS",    categoria: "Cafetería" },
  { patron: "FIVE GUYS",    categoria: "Restaurantes" },
  { patron: "GROSSO",       categoria: "Restaurantes" },
  { patron: "RESTAURANTE",  categoria: "Restaurantes" },
  { patron: "CAFETERIA",    categoria: "Cafetería" },

  // ── Transporte ────────────────────────────────────────────────
  { patron: "RENFE",        categoria: "Transporte" },
  { patron: "CERCANIAS",    categoria: "Transporte" },
  { patron: "METRO ",       categoria: "Transporte" },
  { patron: "CABIFY",       categoria: "Transporte" },
  { patron: "UBER ",        categoria: "Transporte" },
  { patron: "BLABLACAR",    categoria: "Transporte" },
  { patron: "BOLT ",        categoria: "Transporte" },
  { patron: "EMT ",         categoria: "Transporte" },
  { patron: "IBERIA",       categoria: "Transporte" },
  { patron: "RYANAIR",      categoria: "Transporte" },
  { patron: "VUELING",      categoria: "Transporte" },
  { patron: "EASYJET",      categoria: "Transporte" },
  { patron: "AENA",         categoria: "Transporte" },
  { patron: "REPSOL",       categoria: "Transporte" },
  { patron: "CEPSA",        categoria: "Transporte" },
  { patron: "GASOLINERA",   categoria: "Transporte" },

  // ── Salud ─────────────────────────────────────────────────────
  { patron: "FARMACIA",     categoria: "Salud" },
  { patron: "CLINICA",      categoria: "Salud" },
  { patron: "HOSPITAL",     categoria: "Salud" },
  { patron: "DENTISTA",     categoria: "Salud" },
  { patron: "SANITAS",      categoria: "Salud" },
  { patron: "ADESLAS",      categoria: "Salud" },
  { patron: "QUIRON",       categoria: "Salud" },

  // ── Suscripciones ─────────────────────────────────────────────
  { patron: "SPOTIFY",         categoria: "Suscripciones" },
  { patron: "NETFLIX",         categoria: "Suscripciones" },
  { patron: "HBO",             categoria: "Suscripciones" },
  { patron: "DISNEY",          categoria: "Suscripciones" },
  { patron: "AMAZON PRIME",    categoria: "Suscripciones" },
  { patron: "STEAM",           categoria: "Suscripciones" },
  { patron: "PLAYSTATION",     categoria: "Suscripciones" },
  { patron: "NINTENDO",        categoria: "Suscripciones" },
  { patron: "YOUTUBE PREMIUM", categoria: "Suscripciones" },
  { patron: "TWITCH",          categoria: "Suscripciones" },
  { patron: "APPLE",           categoria: "Suscripciones" },
  { patron: "GOOGLE",          categoria: "Suscripciones" },
  { patron: "MICROSOFT",       categoria: "Suscripciones" },
  { patron: "AMAZON.ES",       categoria: "Suscripciones" },
  { patron: "ADOBE",           categoria: "Suscripciones" },
  { patron: "CHATGPT",         categoria: "Suscripciones" },
  { patron: "OPENAI",          categoria: "Suscripciones" },

  // ── Telecos / Tecnología ─────────────────────────────────────
  { patron: "VODAFONE",      categoria: "Gastos bancarios" },
  { patron: "MOVISTAR",      categoria: "Gastos bancarios" },
  { patron: "ORANGE ",       categoria: "Gastos bancarios" },
  { patron: "YOIGO",         categoria: "Gastos bancarios" },
  { patron: "MASMOVIL",      categoria: "Gastos bancarios" },
  { patron: "MEDIAMARKT",    categoria: "Gastos bancarios" },
  { patron: "PCCOMPONENTES", categoria: "Gastos bancarios" },

  // ── Hogar ─────────────────────────────────────────────────────
  { patron: "IKEA",         categoria: "Hogar" },
  { patron: "LEROY MERLIN", categoria: "Hogar" },
  { patron: "BRICODEPOT",   categoria: "Hogar" },
  { patron: "ENDESA",       categoria: "Hogar" },
  { patron: "IBERDROLA",    categoria: "Hogar" },
  { patron: "NATURGY",      categoria: "Hogar" },
  { patron: "GAS NATURAL",  categoria: "Hogar" },
  { patron: "CANAL ISABEL", categoria: "Hogar" },

  // ── Seguros ───────────────────────────────────────────────────
  { patron: "MAPFRE",       categoria: "Gastos bancarios" },
  { patron: "AXA ",         categoria: "Gastos bancarios" },
  { patron: "ALLIANZ",      categoria: "Gastos bancarios" },
  { patron: "MUTUA ",       categoria: "Gastos bancarios" },
  { patron: "SANTA LUCIA",  categoria: "Gastos bancarios" },
  { patron: "OCASO",        categoria: "Gastos bancarios" },
  { patron: "GENERALI",     categoria: "Gastos bancarios" },

  // ── Ropa y calzado ────────────────────────────────────────────
  { patron: "ZARA ",        categoria: "Ropa y calzado" },
  { patron: "MANGO ",       categoria: "Ropa y calzado" },
  { patron: "H&M",          categoria: "Ropa y calzado" },
  { patron: "BERSHKA",      categoria: "Ropa y calzado" },
  { patron: "PRIMARK",      categoria: "Ropa y calzado" },
  { patron: "DECATHLON",    categoria: "Ropa y calzado" },
  { patron: "NIKE ",        categoria: "Ropa y calzado" },
  { patron: "ADIDAS",       categoria: "Ropa y calzado" },
  { patron: "PULL&BEAR",    categoria: "Ropa y calzado" },
  { patron: "STRADIVARIUS", categoria: "Ropa y calzado" },

  // ── Educación ─────────────────────────────────────────────────
  { patron: "UDEMY",        categoria: "Educación" },
  { patron: "COURSERA",     categoria: "Educación" },
  { patron: "ACADEMIA ",    categoria: "Educación" },

  // ── Salario ───────────────────────────────────────────────────
  { patron: "NOMINA",       categoria: "Salario" },
  { patron: "SALARIO",      categoria: "Salario" },
  { patron: "PAGO NOMINA",  categoria: "Salario" },
];
