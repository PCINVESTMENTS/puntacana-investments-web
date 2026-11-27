import fs from "fs";
import path from "path";

/**
 * Unified Email Templates, Spanish Structured Formatters, Environment URL Resolver
 * and Fail-Closed Preview Safety Guard for Punta Cana Investments web forms.
 *
 * Production behavior (VERCEL_ENV === "production" or standard non-preview runtime):
 * - Provider: Resend (RESEND_API_KEY)
 * - Verified senders: info@puntacanainvestmentsrd.com
 * - Team recipient: info@puntacanainvestmentsrd.com
 * - CRM/Backend: existing Railway + HubSpot connections
 *
 * Preview behavior (VERCEL_ENV === "preview" or FORM_EMAILS_PREVIEW_MODE === "true"):
 * - Fail-closed: aborts BEFORE sending any email or calling external APIs if
 *   FORM_EMAILS_PREVIEW_TEAM_TO is missing or points to info@puntacanainvestmentsrd.com,
 *   or if the client recipient is not authorized via FORM_EMAILS_PREVIEW_CLIENT_ALLOWLIST /
 *   FORM_EMAILS_PREVIEW_CLIENT_TO.
 * - Railway & HubSpot calls are simulated by default (or routed only to an isolated
 *   non-production FORM_EMAILS_PREVIEW_API_URL).
 */

export type SupportedLang = "es" | "en" | "fr";

export interface RenderedEmailPayload {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
  lang: SupportedLang;
}

export const PCI_TEAM_FROM = "Web Punta Cana Investments <info@puntacanainvestmentsrd.com>";
export const PCI_CLIENT_FROM = "Punta Cana Investments <info@puntacanainvestmentsrd.com>";
export const PCI_TEAM_TO = "info@puntacanainvestmentsrd.com";
export const PCI_PROD_RAILWAY_HOST = "puntacana-fortress-production.up.railway.app";
export const PCI_CALENDLY_URL = "https://calendly.com/ulisespp9/30min";
export const PCI_EMAIL_LOGO_URL = "https://puntacanainvestmentsrd.com/images/logo-email.jpg";

export function normalizeLang(raw: unknown, fallback: SupportedLang = "es"): SupportedLang {
  const s = String(raw || "").trim().toLowerCase();
  if (s === "en" || s === "fr" || s === "es") return s;
  return fallback;
}

export function generateReferenceCode(prefix: "INQ" | "HTL" | "OM" | "FB" | "CNT" | "KYC"): string {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const d = String(now.getUTCDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase().padEnd(4, "X");
  return `${prefix}-${y}${m}${d}-${rand}`;
}

export const generateProductionRefCode = generateReferenceCode;

function parseEmailList(raw: string | undefined): string[] {
  return String(raw || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function isProductionTeamInbox(address: string): boolean {
  return address.trim().toLowerCase() === PCI_TEAM_TO.toLowerCase();
}

export function isLocalDryRunEnabled(): boolean {
  return (
    process.env.VERCEL !== "1" &&
    (Boolean(process.env.FORM_EMAILS_LOCAL_DRY_RUN_FILE) ||
      String(process.env.FORM_EMAILS_LOCAL_DRY_RUN || "").trim().toLowerCase() === "true")
  );
}

/**
 * Explicit Stage 1 Cloud Staging simulated-email guard (works EVEN on Vercel Preview/Staging
 * when FORM_EMAILS_SIMULATED_MODE=true, guaranteeing 0 calls to Resend and 0 calls to HubSpot).
 */
export function isSimulatedEmailModeEnabled(): boolean {
  if (isLocalDryRunEnabled()) return true;
  if (String(process.env.FORM_EMAILS_SIMULATED_MODE || "").trim().toLowerCase() === "true") {
    return true;
  }
  return false;
}

export function isPreviewEnvironment(): boolean {
  if (
    process.env.VERCEL_ENV === "preview" ||
    String(process.env.FORM_EMAILS_PREVIEW_MODE || "").trim().toLowerCase() === "true"
  ) {
    return true;
  }
  // Fail-closed safety: if connected to a non-production Phase 4 backend outside Vercel production,
  // never fall through to production Railway or info@puntacanainvestmentsrd.com.
  const phase4Url = String(
    process.env.PHASE4_BACKEND_URL || process.env.LOCAL_PROPERTIES_SANDBOX_URL || ""
  )
    .trim()
    .toLowerCase();
  if (
    phase4Url &&
    !phase4Url.includes(PCI_PROD_RAILWAY_HOST) &&
    process.env.VERCEL_ENV !== "production" &&
    !isLocalDryRunEnabled()
  ) {
    return true;
  }
  return false;
}

export type ExecutionPolicyResult =
  | {
      allowed: false;
      mode: "preview";
      code:
        | "PREVIEW_TEAM_RECIPIENT_MISSING"
        | "PREVIEW_PRODUCTION_RECIPIENT_BLOCKED"
        | "PREVIEW_CLIENT_RECIPIENT_UNAUTHORIZED"
        | "PREVIEW_PRODUCTION_RAILWAY_BLOCKED";
      error: string;
    }
  | {
      allowed: true;
      mode: "local_dry_run" | "preview" | "production";
      teamRecipients: string[];
      clientRecipient: string;
      railwayMode: "production" | "preview_isolated" | "simulated";
      railwayApiUrl: string | null;
      hubspotMode: "production" | "simulated";
    };

/**
 * Enforces fail-closed Preview isolation BEFORE any email or CRM call occurs.
 */
export function resolveExecutionPolicy(submittedClientEmail: string): ExecutionPolicyResult {
  const cleanClientEmail = String(submittedClientEmail || "").trim();

  // 0. Stage 1 Staging / Local Simulated Mode (0 Resend calls, 0 HubSpot calls, even on Vercel Staging)
  if (isSimulatedEmailModeEnabled()) {
    const previewApiUrl = String(process.env.FORM_EMAILS_PREVIEW_API_URL || "")
      .trim()
      .replace(/\/+$/, "");
    if (previewApiUrl && previewApiUrl.toLowerCase().includes(PCI_PROD_RAILWAY_HOST)) {
      return {
        allowed: false,
        mode: "preview",
        code: "PREVIEW_PRODUCTION_RAILWAY_BLOCKED",
        error:
          "Envío detenido en Staging simulado: FORM_EMAILS_PREVIEW_API_URL no puede apuntar al backend de producción en Railway.",
      };
    }
    return {
      allowed: true,
      mode: "local_dry_run",
      teamRecipients: [PCI_TEAM_TO],
      clientRecipient: cleanClientEmail,
      railwayMode: previewApiUrl ? "preview_isolated" : "simulated",
      railwayApiUrl: previewApiUrl || null,
      hubspotMode: "simulated",
    };
  }

  // 1. Preview fail-closed guard (Stage 2 real-email testing with strict allowlist)
  if (isPreviewEnvironment()) {
    const previewTeamRecipients = parseEmailList(process.env.FORM_EMAILS_PREVIEW_TEAM_TO);
    if (previewTeamRecipients.length === 0) {
      return {
        allowed: false,
        mode: "preview",
        code: "PREVIEW_TEAM_RECIPIENT_MISSING",
        error:
          "Envío detenido en Preview: falta configurar el buzón autorizado del equipo (FORM_EMAILS_PREVIEW_TEAM_TO). No se envió ningún correo al destinatario de producción.",
      };
    }

    if (previewTeamRecipients.some(isProductionTeamInbox)) {
      return {
        allowed: false,
        mode: "preview",
        code: "PREVIEW_PRODUCTION_RECIPIENT_BLOCKED",
        error:
          "Envío detenido en Preview: FORM_EMAILS_PREVIEW_TEAM_TO no puede incluir el buzón de producción (info@puntacanainvestmentsrd.com).",
      };
    }

    const previewClientOverride = String(process.env.FORM_EMAILS_PREVIEW_CLIENT_TO || "").trim();
    const previewClientAllowlist = parseEmailList(process.env.FORM_EMAILS_PREVIEW_CLIENT_ALLOWLIST).map((a) =>
      a.toLowerCase()
    );

    let resolvedClientRecipient = "";
    if (previewClientOverride) {
      if (isProductionTeamInbox(previewClientOverride)) {
        return {
          allowed: false,
          mode: "preview",
          code: "PREVIEW_PRODUCTION_RECIPIENT_BLOCKED",
          error:
            "Envío detenido en Preview: FORM_EMAILS_PREVIEW_CLIENT_TO no puede apuntar al buzón de producción.",
        };
      }
      resolvedClientRecipient = previewClientOverride;
    } else if (
      previewClientAllowlist.length > 0 &&
      previewClientAllowlist.includes(cleanClientEmail.toLowerCase()) &&
      !isProductionTeamInbox(cleanClientEmail)
    ) {
      resolvedClientRecipient = cleanClientEmail;
    } else {
      return {
        allowed: false,
        mode: "preview",
        code: "PREVIEW_CLIENT_RECIPIENT_UNAUTHORIZED",
        error:
          "Envío detenido en Preview: el correo del cliente no está autorizado en FORM_EMAILS_PREVIEW_CLIENT_ALLOWLIST ni se definió FORM_EMAILS_PREVIEW_CLIENT_TO. No se envió ningún correo.",
      };
    }

    const previewApiUrl = String(process.env.FORM_EMAILS_PREVIEW_API_URL || "")
      .trim()
      .replace(/\/+$/, "");
    if (previewApiUrl && previewApiUrl.toLowerCase().includes(PCI_PROD_RAILWAY_HOST)) {
      return {
        allowed: false,
        mode: "preview",
        code: "PREVIEW_PRODUCTION_RAILWAY_BLOCKED",
        error:
          "Envío detenido en Preview: FORM_EMAILS_PREVIEW_API_URL no puede apuntar al backend de producción en Railway.",
      };
    }

    return {
      allowed: true,
      mode: isLocalDryRunEnabled() ? "local_dry_run" : "preview",
      teamRecipients: previewTeamRecipients,
      clientRecipient: resolvedClientRecipient,
      railwayMode: previewApiUrl ? "preview_isolated" : "simulated",
      railwayApiUrl: previewApiUrl || null,
      hubspotMode: "simulated",
    };
  }

  // 2. Local dry-run mode (isolated local verification with 0 real emails & 0 external writes)
  if (isLocalDryRunEnabled()) {
    return {
      allowed: true,
      mode: "local_dry_run",
      teamRecipients: [PCI_TEAM_TO],
      clientRecipient: cleanClientEmail,
      railwayMode: "simulated",
      railwayApiUrl: null,
      hubspotMode: "simulated",
    };
  }

  // 3. Standard production mode (100% identical to master)
  return {
    allowed: true,
    mode: "production",
    teamRecipients: [PCI_TEAM_TO],
    clientRecipient: cleanClientEmail,
    railwayMode: "production",
    railwayApiUrl: `https://${PCI_PROD_RAILWAY_HOST}`,
    hubspotMode: "production",
  };
}

/**
 * Resolves the active environment origin so listing links always point to the
 * matching environment (local dev/preview, Vercel preview, or production domain).
 */
export function resolveSiteOrigin(requestHeaders?: Headers | null): string {
  const envUrl = String(process.env.NEXT_PUBLIC_SITE_URL || "").trim().replace(/\/+$/, "");

  if (requestHeaders) {
    const rawOrigin = String(requestHeaders.get("origin") || "").trim();
    const forwardedHost = String(requestHeaders.get("x-forwarded-host") || "").split(",")[0].trim();
    const host = forwardedHost || String(requestHeaders.get("host") || "").trim();
    const forwardedProto = String(requestHeaders.get("x-forwarded-proto") || "").split(",")[0].trim();

    const isLocalOrPreviewHost = (h: string) =>
      /^(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?$/i.test(h) ||
      /\.local(:\d+)?$/i.test(h) ||
      /\.vercel\.app$/i.test(h);

    if (host && isLocalOrPreviewHost(host)) {
      const proto = forwardedProto || (/^(localhost|127\.0\.0\.1|0\.0\.0\.0)/i.test(host) ? "http" : "https");
      return `${proto}://${host}`.replace(/\/+$/, "");
    }

    if (rawOrigin && /^https?:\/\//i.test(rawOrigin)) {
      try {
        const parsed = new URL(rawOrigin);
        if (isLocalOrPreviewHost(parsed.host)) {
          return parsed.origin.replace(/\/+$/, "");
        }
      } catch {
        // Ignore malformed Origin header
      }
    }

    if (envUrl && /^https?:\/\//i.test(envUrl)) {
      return envUrl;
    }

    if (host) {
      const proto = forwardedProto || "https";
      return `${proto}://${host}`.replace(/\/+$/, "");
    }
  }

  if (envUrl && /^https?:\/\//i.test(envUrl)) {
    return envUrl;
  }

  return "https://www.puntacanainvestmentsrd.com";
}

export function isHotelOrCommercialAsset(
  type?: string | null,
  title?: string | null,
  slug?: string | null
): boolean {
  const t = String(type || "").trim().toLowerCase();
  // 1. Criterio principal: cuando existe tipo de inmueble explícito, ese tipo decide la categoría.
  if (["hotel", "resorts", "resort", "commercial", "condohotel", "condo-hotel"].includes(t)) {
    return true;
  }
  if (["villa", "condo", "apartment", "penthouse", "townhouse", "lot", "land"].includes(t)) {
    return false;
  }
  // 2. Heurística de respaldo únicamente cuando el inmueble no declara tipo explícito
  //    (ignorando nombres de urbanizaciones residenciales como "Puntacana Resort").
  const combined = `${title || ""} ${slug || ""}`
    .replace(/punta\s*cana[\s-]+resort(\s*&\s*club)?/gi, "")
    .replace(/cap\s*cana[\s-]+resort/gi, "");
  return /\b(hotel|hoteles|hotelero|hotelera|condohotel|condo-hotel|boutique hotel)\b/i.test(
    combined
  );
}

export interface LocalDryRunRecord {
  recordedAt: string;
  flow: "property_inquiry" | "hotel_inquiry" | "general_contact" | "off_market" | "fly_and_buy" | "kyc";
  referenceCode: string;
  lang: SupportedLang;
  siteOrigin: string;
  propertyUrl?: string;
  railwayMode: "production" | "preview_isolated" | "simulated";
  hubspotMode: "production" | "simulated";
  adminEmail: RenderedEmailPayload & { recipients: string[] };
  clientEmail: RenderedEmailPayload;
}

export function recordLocalDryRunEmail(record: LocalDryRunRecord): void {
  const targetFile = process.env.FORM_EMAILS_LOCAL_DRY_RUN_FILE;
  if (!targetFile || process.env.VERCEL === "1") return;
  const resolved = path.resolve(targetFile);
  fs.mkdirSync(path.dirname(resolved), { recursive: true });
  let existing: LocalDryRunRecord[] = [];
  if (fs.existsSync(resolved)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(resolved, "utf-8"));
      if (Array.isArray(parsed)) existing = parsed;
    } catch {
      existing = [];
    }
  }
  existing.push(record);
  fs.writeFileSync(resolved, JSON.stringify(existing, null, 2), "utf-8");
}

function escHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function wrapBrandedHtml(title: string, innerHtml: string, footerSlogan: string): string {
  return `<html>
  <body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #000000; color: #ffffff; max-width: 640px; margin: 0 auto; padding: 0;">
    <div style="background-color: #111111; padding: 32px 20px; text-align: center; border-bottom: 2px solid #c9ae5d;">
      <img src="${PCI_EMAIL_LOGO_URL}" alt="Punta Cana Investments Logo" style="max-width: 280px; height: auto;" />
    </div>
    <div style="padding: 32px 28px; background-color: #0a0a0a;">
      <h2 style="color: #c9ae5d; text-transform: uppercase; margin-top: 0; font-weight: 500; letter-spacing: 1px; text-align: center; font-size: 20px;">${escHtml(title)}</h2>
      ${innerHtml}
    </div>
    <div style="background-color: #111111; padding: 24px; text-align: center; border-top: 1px solid #333333;">
      <p style="margin: 0; font-size: 13px; color: #c9ae5d; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">Punta Cana Investments</p>
      <p style="margin: 8px 0 0 0; font-size: 12px; color: #888888;">${escHtml(footerSlogan)}</p>
    </div>
  </body>
</html>`;
}

function htmlSection(heading: string, rows: Array<{ label: string; value: string; href?: string }>): string {
  const rowsHtml = rows
    .map((r) => {
      const valHtml = r.href
        ? `<a href="${escHtml(r.href)}" style="color: #c9ae5d; text-decoration: underline;">${escHtml(r.value)}</a>`
        : escHtml(r.value);
      return `<p style="margin: 6px 0; color: #e0e0e0; font-size: 14px; line-height: 1.5;"><strong style="color: #ffffff;">${escHtml(r.label)}:</strong> ${valHtml}</p>`;
    })
    .join("\n");
  return `<div style="background-color: #1a1a1a; padding: 18px 20px; border-left: 4px solid #c9ae5d; margin: 18px 0; border-radius: 4px;">
  <p style="margin: 0 0 10px 0; color: #c9ae5d; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.6px;">${escHtml(heading)}</p>
  ${rowsHtml}
</div>`;
}

// =============================================================================
// OFF-MARKET SPANISH FORMATTERS (EN/FR -> ES)
// =============================================================================

const OFF_MARKET_DETAIL_LABELS_ES: Record<string, string> = {
  property_type: "Tipo de Propiedad",
  physical_state: "Estado Físico",
  discount: "Margen de Descuento",
  strategy: "Estrategia",
  environment: "Entorno / Naturaleza",
  rooms: "Habitaciones / Llaves",
  operator: "Operadora Hotelera",
  objective: "Objetivo de Transacción",
  hotel_type: "Clasificación del Activo",
  location: "Zona de Interés",
  urgency: "Horizonte / Urgencia",
  pof: "Prueba de Fondos (POF)",
};

const OFF_MARKET_VALUE_TO_ES: Record<string, string> = {
  "luxury villas on foreclosure": "Villas de Lujo en Remate",
  "villas de luxe saisies": "Villas de Lujo en Remate",
  "bank-owned apartments / penthouses": "Apartamentos / Penthouses Adjudicados",
  "appartements / penthouses saisis par la banque": "Apartamentos / Penthouses Adjudicados",
  "preferential land plots": "Solares Preferenciales",
  "terrains préférentiels": "Solares Preferenciales",
  "unfinished structures": "Estructuras Inconclusas",
  "structures inachevées": "Estructuras Inconclusas",

  "finished / turnkey (for immediate use or exploitation)":
    "Terminada / Llave en mano (Para uso o explotación inmediata)",
  "achevée / clé en main (pour utilisation ou exploitation immédiate)":
    "Terminada / Llave en mano (Para uso o explotación inmediata)",
  "finished / requires remodeling or cosmetic upgrades":
    "Terminada / Requiere remodelación o mejoras estéticas",
  "achevée / nécessite des rénovations ou améliorations esthétiques":
    "Terminada / Requiere remodelación o mejoras estéticas",
  "grey shell construction / pending execution":
    "En fase de construcción gris / Ejecución pendiente",
  "construction en gros œuvre / exécution en attente":
    "En fase de construcción gris / Ejecución pendiente",

  "between 20% and 30% below market": "Entre un 20% y un 30% por debajo del mercado",
  "entre 20% et 30% en dessous du marché": "Entre un 20% y un 30% por debajo del mercado",
  "between 30% and 50% below market (aggressive foreclosures)":
    "Entre un 30% y un 50% por debajo del mercado (Remates agresivos)",
  "entre 30% et 50% en dessous du marché (saisies agressives)":
    "Entre un 30% y un 50% por debajo del mercado (Remates agresivos)",

  "real estate flipping (quick remodel and resale)":
    "Flipping Inmobiliario (Remodelación y reventa rápida)",
  "flipping immobilier (rénovation et revente rapide)":
    "Flipping Inmobiliario (Remodelación y reventa rápida)",
  "vacation rental exploitation (cash flow)":
    "Explotación de rentas vacacionales (Flujo de caja)",
  "exploitation de location de vacances (flux de trésorerie)":
    "Explotación de rentas vacacionales (Flujo de caja)",
  "long-term asset retention (capital appreciation / land banking)":
    "Retención del activo a largo plazo (Plusvalía / Land Banking)",
  "rétention d'actifs à long terme (plus-value / land banking)":
    "Retención del activo a largo plazo (Plusvalía / Land Banking)",

  "hotel / resort with direct beach access (beachfront)":
    "Hotel / Resort con línea de playa directa (Beachfront)",
  "hôtel / complexe avec accès direct à la plage (beachfront)":
    "Hotel / Resort con línea de playa directa (Beachfront)",
  "city hotel / corporate / urban": "Hotel de Ciudad / Corporativo / Urbano",
  "hôtel de ville / corporatif / urbain": "Hotel de Ciudad / Corporativo / Urbano",
  "eco-resort / mountain or river development": "Eco-Resort / Desarrollo de Montaña o Río",
  "éco-complexe / développement en montagne ou rivière": "Eco-Resort / Desarrollo de Montaña o Río",
  "virgin macro-lot for tourism development from scratch":
    "Macro-Lote virgen para desarrollo turístico desde cero",
  "macro-lot vierge pour développement touristique à partir de zéro":
    "Macro-Lote virgen para desarrollo turístico desde cero",

  "from 50 to 100 rooms": "De 50 a 100 habitaciones",
  "de 50 à 100 chambres": "De 50 a 100 habitaciones",
  "from 100 to 200 rooms": "De 100 a 200 habitaciones",
  "de 100 à 200 chambres": "De 100 a 200 habitaciones",
  "from 200 to 300 rooms": "De 200 a 300 habitaciones",
  "de 200 à 300 chambres": "De 200 a 300 habitaciones",
  "from 300 to 400 rooms": "De 300 a 400 habitaciones",
  "de 300 à 400 chambres": "De 300 a 400 habitaciones",
  "from 400 to 500 rooms": "De 400 a 500 habitaciones",
  "de 400 à 500 chambres": "De 400 a 500 habitaciones",
  "500 rooms or more": "500 habitaciones o más",
  "500 chambres ou plus": "500 habitaciones o más",

  "with active international operator (flagged asset)":
    "Con operadora internacional vigente (Asset con contrato de bandera)",
  "avec un opérateur international actif (actif sous enseigne)":
    "Con operadora internacional vigente (Asset con contrato de bandera)",
  "no operator / flag-free (ready for own brand or conversion)":
    "Sin operadora / Libre de bandera (Listo para marca propia o reconversión)",
  "sans opérateur / sans enseigne (prêt pour marque propre ou conversion)":
    "Sin operadora / Libre de bandera (Listo para marca propia o reconversión)",

  "purchase of the real estate asset (full acquisition of property)":
    "Compra del activo inmobiliario (Adquisición total de la propiedad)",
  "achat de l'actif immobilier (acquisition totale de la propriété)":
    "Compra del activo inmobiliario (Adquisición total de la propiedad)",
  "only manage and administer (hotel operation / management)":
    "Solo gestionar y administrar (Operación hotelera / Management)",
  "seulement gérer et administrer (opération hôtelière / management)":
    "Solo gestionar y administrar (Operación hotelera / Management)",
  "joint venture (capital injection and joint development)":
    "Joint Venture (Inyección de capital y desarrollo conjunto)",
  "joint venture (injection de capitaux et développement conjoint)":
    "Joint Venture (Inyección de capital y desarrollo conjunto)",
};

function normKey(v: unknown): string {
  return String(v || "")
    .trim()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

export function translateOffMarketBudgetEs(rawBudget: string): string {
  const s = String(rawBudget || "").trim();
  if (!s) return "No especificado";
  return s
    .replace(/\bor more\b/i, "o más")
    .replace(/\bou plus\b/i, "o más")
    .replace(/^Over\s+/i, "Más de ")
    .replace(/^Plus de\s+/i, "Más de ")
    .replace(/^Under\s+/i, "Menos de ")
    .replace(/^Moins de\s+/i, "Menos de ");
}

export function translateOffMarketOptionEs(rawValue: string): string {
  const s = String(rawValue || "").trim();
  if (!s) return "";
  return OFF_MARKET_VALUE_TO_ES[normKey(s)] || s;
}

// =============================================================================
// FLY & BUY SPANISH FORMATTERS (Internal keys -> readable Spanish labels)
// =============================================================================

const FLYBUY_VALUE_MAPS: Record<string, Record<string, string>> = {
  objectives: {
    investment: "Inversión inmobiliaria",
    secondhome: "Segunda vivienda",
    vacation: "Uso vacacional",
    retirement: "Retiro",
    mixed: "Inversión + uso vacacional",
    development: "Inversión mediante participación en desarrollo inmobiliario",
    evaluating: "Aún lo estoy evaluando",
  },
  propertyTypes: {
    apartment: "Apartamento",
    villa: "Villa",
    townhouse: "Townhouse",
    project: "Proyecto en desarrollo",
    airbnb: "Propiedad para renta turística (Airbnb)",
    advisory: "Deseo asesoría para definirlo",
  },
  investmentFocus: {
    airbnb: "Renta turística (Airbnb)",
    appreciation: "Plusvalía a mediano / largo plazo",
    development: "Participación en desarrollo inmobiliario",
    diversification: "Diversificación patrimonial",
    all: "Deseo conocer las opciones disponibles",
  },
  experience: {
    local: "Sí, en mi país",
    abroad: "Sí, en el extranjero",
    both: "Sí, en mi país y en el extranjero",
    firsttime: "Primera inversión",
    limited: "Experiencia limitada",
  },
  horizon: {
    immediate: "Inmediato (0–3 meses)",
    short: "Corto plazo (3–6 meses)",
    medium: "Mediano plazo (6–12 meses)",
    exploratory: "Exploratorio",
  },
  visited: {
    yes: "Sí",
    no: "No",
  },
  motivation: {
    meetcountry: "Conocer el país antes de invertir",
    visitprojects: "Visitar personalmente los proyectos",
    meetteam: "Conocer a Punta Cana Investments",
    validatelocation: "Validar la ubicación y el entorno",
    confidence: "Tomar una decisión con mayor confianza",
    all: "Todas las anteriores",
  },
};

function translateFlyBuyListEs(field: keyof typeof FLYBUY_VALUE_MAPS, rawValues: string | string[]): string {
  const arr = Array.isArray(rawValues)
    ? rawValues
    : String(rawValues || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
  if (arr.length === 0) return "Sin especificar";
  const dict = FLYBUY_VALUE_MAPS[field] || {};
  const mapped = arr
    .map((tok) => {
      const k = tok.trim().toLowerCase();
      if (!k || k === "n/a" || k === "na") return "";
      if (dict[k]) return dict[k];
      if (k === "yes") return "Sí";
      if (k === "no") return "No";
      return tok.trim();
    })
    .filter(Boolean);
  return mapped.length > 0 ? mapped.join(", ") : "Sin especificar";
}

// =============================================================================
// 1 & 2. PROPERTY / DIRECT HOTEL / GENERAL CONTACT EMAILS
// =============================================================================

export interface PropertyOrHotelEmailInput {
  referenceCode: string;
  formCategory: "property_inquiry" | "hotel_inquiry" | "general_contact";
  lang: SupportedLang;
  siteOrigin: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  interestText: string;
  property?: {
    id?: number | string | null;
    technicalId?: number | string | null;
    idSource?: string | null;
    permanentCode?: string | null;
    internal_code?: string | null;
    code?: string | null;
    slug?: string | null;
    title?: string | null;
    location?: string | null;
    price?: number | null;
    isStartingPrice?: boolean | null;
    area?: number | null;
    type?: string | null;
  } | null;
}

export function buildPropertyOrHotelEmails(input: PropertyOrHotelEmailInput): {
  adminEmail: RenderedEmailPayload;
  clientEmail: RenderedEmailPayload;
  propertyUrl: string;
  identifierKind: "permanent_code" | "technical_id" | "none";
} {
  const { referenceCode, formCategory, lang, siteOrigin, name, email, phone, message, interestText, property } = input;
  const cleanOrigin = siteOrigin.replace(/\/+$/, "");
  const slug = property?.slug ? String(property.slug).trim() : "";
  const propertyUrl = slug ? `${cleanOrigin}/${lang}/properties/${slug}` : "";
  const propTitle = String(property?.title || interestText || "Consulta General").trim();

  // Only treat explicit permanent code fields as permanent codes; never synthesize a fake prefix
  const permanentCode = String(
    property?.permanentCode || property?.internal_code || property?.code || ""
  ).trim();
  const rawTechId = property?.technicalId ?? property?.id;
  const technicalId =
    rawTechId !== undefined && rawTechId !== null && String(rawTechId).trim() !== ""
      ? String(rawTechId).trim()
      : "";
  const idSource = String(property?.idSource || "fuente vigente").trim();

  const identifierKind: "permanent_code" | "technical_id" | "none" = permanentCode
    ? "permanent_code"
    : technicalId
    ? "technical_id"
    : "none";

  const isHotel = formCategory === "hotel_inquiry";
  const isProperty = formCategory === "property_inquiry";

  const typeLabelEs: Record<string, string> = {
    condo: "Apartamento / Condo",
    villa: "Villa",
    penthouse: "Penthouse",
    land: "Solar / Terreno",
    commercial: "Activo Comercial / Hotelero",
    condohotel: "Condo-Hotel / Resort",
    resorts: "Hotel / Resort",
    hotel: "Hotel / Resort",
  };
  const categoryHumanEs = property?.type
    ? typeLabelEs[String(property.type).toLowerCase()] || String(property.type)
    : isHotel
    ? "Hotel / Activo Comercial"
    : "Propiedad";

  const formattedPrice =
    property?.price && Number(property.price) > 0
      ? `${property.isStartingPrice ? "Desde " : ""}US$${Number(property.price).toLocaleString("en-US")}`
      : "";

  const adminHeading = isHotel
    ? "CONSULTA DIRECTA DE HOTEL / ACTIVO COMERCIAL"
    : isProperty
    ? "CONSULTA DE PROPIEDAD"
    : "NUEVO CONTACTO WEB";

  const codeTag = permanentCode ? ` [${permanentCode}]` : "";
  const adminSubject = isHotel
    ? `CONSULTA HOTEL / ACTIVO [${referenceCode}]${codeTag} ${propTitle} — ${name}`
    : isProperty
    ? `CONSULTA PROPIEDAD [${referenceCode}]${codeTag} ${propTitle} — ${name}`
    : `CONTACTO WEB [${referenceCode}] — ${name} (${interestText || "General"})`;

  const assetRows: Array<{ label: string; value: string; href?: string }> = [];
  if (isHotel || isProperty) {
    assetRows.push({
      label: isHotel ? "Hotel / Activo consultado" : "Nombre de la propiedad",
      value: propTitle,
    });
    if (permanentCode) {
      assetRows.push({
        label: isHotel ? "Código permanente del activo" : "Código permanente del inmueble",
        value: permanentCode,
      });
      if (technicalId) {
        assetRows.push({
          label: "ID técnico de referencia",
          value: `${technicalId} (${idSource})`,
        });
      }
    } else if (technicalId) {
      assetRows.push({
        label: isHotel ? "Código permanente del activo" : "Código permanente del inmueble",
        value: "No disponible en la fuente vigente",
      });
      assetRows.push({
        label: isHotel ? "ID técnico del activo" : "ID técnico del inmueble",
        value: `${technicalId} (origen: ${idSource})`,
      });
    } else {
      assetRows.push({
        label: isHotel ? "Código del activo" : "Código del inmueble",
        value: "No disponible en la fuente vigente",
      });
    }
    assetRows.push({
      label: "Tipo de activo",
      value: categoryHumanEs,
    });
    if (property?.location) {
      assetRows.push({ label: "Ubicación", value: String(property.location) });
    }
    if (formattedPrice) {
      assetRows.push({ label: "Precio de referencia", value: formattedPrice });
    }
    if (property?.area) {
      assetRows.push({ label: "Área", value: `${property.area} m²` });
    }
    if (propertyUrl) {
      assetRows.push({ label: "Enlace a la ficha", value: propertyUrl, href: propertyUrl });
    }
  } else {
    assetRows.push({ label: "Asunto / Interés", value: interestText || "Consulta General" });
  }

  const clientDataRows = [
    { label: "Referencia de la consulta", value: referenceCode },
    { label: "Nombre del interesado", value: name },
    { label: "Correo electrónico", value: email, href: `mailto:${email}` },
    { label: "Teléfono / WhatsApp", value: phone },
    { label: "Idioma del cliente", value: lang.toUpperCase() },
  ];

  const adminTextLines = [
    `[${adminHeading}]`,
    `Referencia: ${referenceCode}`,
    "",
    isHotel ? "--- HOTEL / ACTIVO CONSULTADO ---" : isProperty ? "--- PROPIEDAD CONSULTADA ---" : "--- DETALLE ---",
    ...assetRows.map((r) => `${r.label}: ${r.value}`),
    "",
    "--- DATOS DEL INTERESADO ---",
    ...clientDataRows.slice(1).map((r) => `${r.label}: ${r.value}`),
    "",
    `--- MENSAJE DEL INTERESADO (IDIOMA ORIGINAL: ${lang.toUpperCase()}) ---`,
    message,
  ];

  const adminHtml = wrapBrandedHtml(
    adminHeading,
    `
      <p style="font-size: 14px; color: #cccccc; text-align: center; margin-bottom: 20px;">
        Referencia de seguimiento: <strong style="color: #c9ae5d; font-family: monospace; font-size: 15px;">${escHtml(referenceCode)}</strong>
      </p>
      ${htmlSection(isHotel ? "Hotel / Activo Consultado" : isProperty ? "Datos de la Propiedad" : "Detalle de la Consulta", assetRows)}
      ${htmlSection("Datos del Interesado", clientDataRows)}
      <div style="background-color: #1a1a1a; padding: 18px 20px; border-left: 4px solid #c9ae5d; margin: 18px 0; border-radius: 4px;">
        <p style="margin: 0 0 8px 0; color: #c9ae5d; font-size: 13px; font-weight: bold; text-transform: uppercase;">Mensaje del Interesado (Idioma original: ${escHtml(lang.toUpperCase())})</p>
        <p style="margin: 0; color: #e0e0e0; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${escHtml(message)}</p>
      </div>
    `,
    "Notificación interna automática — Punta Cana Investments"
  );

  // Client confirmation (ES / EN / FR with identical referenceCode and environment-aware listing URL)
  const firstName = name.split(" ")[0] || (lang === "en" ? "Client" : lang === "fr" ? "Client" : "Cliente");
  const propBadge = permanentCode ? `${propTitle} (${permanentCode})` : propTitle;

  const clientCopy =
    lang === "en"
      ? {
          subject: isHotel
            ? `Hotel / Asset Inquiry Confirmation [${referenceCode}] — Punta Cana Investments`
            : isProperty
            ? `Inquiry Confirmation [${referenceCode}] — Punta Cana Investments`
            : `Contact Confirmation [${referenceCode}] — Punta Cana Investments`,
          title: isHotel
            ? "Hotel & Asset Inquiry Confirmation"
            : isProperty
            ? "Inquiry Confirmation"
            : "Contact Confirmation",
          greeting: `Hello ${firstName},`,
          intro:
            isHotel || isProperty
              ? `We have received your inquiry regarding ${propBadge}. Your tracking reference is ${referenceCode}.`
              : `We have received your message. Your tracking reference is ${referenceCode}.`,
          body: "An advisor from our team is reviewing your request and will contact you shortly to provide personalized assistance.",
          linkLabel: "View property listing",
          speedUpTitle: "Want to speed up the process?",
          speedUpText: "Schedule a personalized video call with our specialists:",
          buttonText: "Schedule Video Call",
          slogan: "Building your wealth in paradise",
          refLabel: "Reference",
        }
      : lang === "fr"
      ? {
          subject: isHotel
            ? `Confirmation de demande hôtel / actif [${referenceCode}] — Punta Cana Investments`
            : isProperty
            ? `Confirmation de demande [${referenceCode}] — Punta Cana Investments`
            : `Confirmation de contact [${referenceCode}] — Punta Cana Investments`,
          title: isHotel
            ? "Confirmation de Demande Hôtel / Actif"
            : isProperty
            ? "Confirmation de Demande"
            : "Confirmation de Contact",
          greeting: `Bonjour ${firstName},`,
          intro:
            isHotel || isProperty
              ? `Nous avons bien reçu votre demande concernant ${propBadge}. Votre référence de suivi est ${referenceCode}.`
              : `Nous avons bien reçu votre message. Votre référence de suivi est ${referenceCode}.`,
          body: "Un conseiller de notre équipe examine votre demande et vous contactera dans les plus brefs délais pour vous offrir un accompagnement personnalisé.",
          linkLabel: "Voir la fiche du bien",
          speedUpTitle: "Vous souhaitez accélérer le processus ?",
          speedUpText: "Planifiez un appel vidéo personnalisé avec nos experts :",
          buttonText: "Planifier l'Appel Vidéo",
          slogan: "Construire votre patrimoine au paradis",
          refLabel: "Référence",
        }
      : {
          subject: isHotel
            ? `Confirmación de consulta de hotel / activo [${referenceCode}] — Punta Cana Investments`
            : isProperty
            ? `Confirmación de consulta [${referenceCode}] — Punta Cana Investments`
            : `Confirmación de contacto [${referenceCode}] — Punta Cana Investments`,
          title: isHotel
            ? "Confirmación de Consulta Hotelera / Comercial"
            : isProperty
            ? "Confirmación de Consulta"
            : "Confirmación de Contacto",
          greeting: `Hola ${firstName},`,
          intro:
            isHotel || isProperty
              ? `Hemos recibido tu solicitud de información sobre ${propBadge}. Tu referencia de seguimiento es ${referenceCode}.`
              : `Hemos recibido tu mensaje exitosamente. Tu referencia de seguimiento es ${referenceCode}.`,
          body: "Un asesor de nuestro equipo está revisando tu solicitud y se comunicará contigo a la mayor brevedad posible para brindarte atención personalizada.",
          linkLabel: "Ver ficha consultada",
          speedUpTitle: "¿Deseas agilizar el proceso?",
          speedUpText: "Puedes agendar una videollamada personalizada con nuestros expertos:",
          buttonText: "Agendar Videollamada",
          slogan: "Construyendo tu patrimonio en el paraíso",
          refLabel: "Referencia",
        };

  const clientTextLines = [
    clientCopy.greeting,
    "",
    clientCopy.intro,
    `${clientCopy.refLabel}: ${referenceCode}`,
    ...(propertyUrl ? [`${clientCopy.linkLabel}: ${propertyUrl}`] : []),
    "",
    clientCopy.body,
    "",
    `${clientCopy.speedUpTitle} ${clientCopy.speedUpText} ${PCI_CALENDLY_URL}`,
    "",
    "Punta Cana Investments",
  ];

  const clientHtml = wrapBrandedHtml(
    clientCopy.title,
    `
      <p style="font-size: 15px; line-height: 1.6; color: #e0e0e0;"><strong>${escHtml(clientCopy.greeting)}</strong></p>
      <p style="font-size: 15px; line-height: 1.6; color: #e0e0e0;">${escHtml(clientCopy.intro)}</p>
      <div style="background-color: #161616; border: 1px solid #c9ae5d; padding: 14px 18px; margin: 18px 0; border-radius: 4px; text-align: center;">
        <span style="font-size: 12px; color: #aaaaaa; text-transform: uppercase; letter-spacing: 1px;">${escHtml(clientCopy.refLabel)}:</span>
        <strong style="display: block; color: #c9ae5d; font-family: monospace; font-size: 18px; margin-top: 4px;">${escHtml(referenceCode)}</strong>
        ${
          propertyUrl
            ? `<p style="margin: 10px 0 0 0; font-size: 13px;"><a href="${escHtml(propertyUrl)}" style="color: #ffffff; text-decoration: underline;">${escHtml(clientCopy.linkLabel)}</a></p>`
            : ""
        }
      </div>
      <p style="font-size: 15px; line-height: 1.6; color: #e0e0e0;">${escHtml(clientCopy.body)}</p>
      <div style="background-color: #1a1a1a; padding: 20px; border-left: 4px solid #c9ae5d; margin: 24px 0; border-radius: 4px;">
        <p style="margin: 0 0 12px 0; color: #ffffff; font-size: 14px;"><strong>${escHtml(clientCopy.speedUpTitle)}</strong><br/>${escHtml(clientCopy.speedUpText)}</p>
        <p style="margin: 0;"><a href="${PCI_CALENDLY_URL}" style="display: inline-block; background-color: #c9ae5d; color: #000000; padding: 10px 20px; text-decoration: none; border-radius: 2px; font-weight: bold; font-size: 13px; text-transform: uppercase;">${escHtml(clientCopy.buttonText)}</a></p>
      </div>
    `,
    clientCopy.slogan
  );

  return {
    propertyUrl,
    identifierKind,
    adminEmail: {
      from: PCI_TEAM_FROM,
      to: PCI_TEAM_TO,
      subject: adminSubject,
      text: adminTextLines.join("\n"),
      html: adminHtml,
      lang: "es",
    },
    clientEmail: {
      from: PCI_CLIENT_FROM,
      to: email,
      subject: clientCopy.subject,
      text: clientTextLines.join("\n"),
      html: clientHtml,
      lang,
    },
  };
}

// =============================================================================
// 3. OFF-MARKET PRIVATE SEARCH EMAILS
// =============================================================================

export interface OffMarketEmailInput {
  referenceCode: string;
  lang: SupportedLang;
  name: string;
  company?: string;
  email: string;
  phone: string;
  tab: "oportunidad" | "hoteles";
  budget: string;
  regions: string[];
  details: Record<string, string>;
  freeText?: string;
}

export function buildOffMarketEmails(input: OffMarketEmailInput): {
  adminEmail: RenderedEmailPayload;
  clientEmail: RenderedEmailPayload;
  structuredEs: Array<{ key: string; labelEs: string; valueEs: string; rawValue: string }>;
  budgetEs: string;
} {
  const { referenceCode, lang, name, company, email, phone, tab, budget, regions, details, freeText } = input;
  const tabEs = tab === "hoteles" ? "Hoteles y Resorts" : "Propiedades de Oportunidad / Remates";
  const budgetEs = translateOffMarketBudgetEs(budget);
  const regionsText = regions.length > 0 ? regions.join(", ") : "No especificadas";
  const cleanFreeText = String(freeText || "").trim();

  const structuredEs = Object.entries(details || {})
    .filter(([, v]) => String(v || "").trim() !== "")
    .map(([k, rawVal]) => ({
      key: k,
      labelEs: OFF_MARKET_DETAIL_LABELS_ES[k] || k,
      valueEs: translateOffMarketOptionEs(String(rawVal)),
      rawValue: String(rawVal),
    }));

  const contactRows = [
    { label: "Referencia", value: referenceCode },
    { label: "Modalidad", value: tabEs },
    { label: "Nombre / Representante", value: name },
    { label: "Empresa / Fondo", value: company || "No especificada" },
    { label: "Correo corporativo", value: email, href: `mailto:${email}` },
    { label: "Teléfono / WhatsApp", value: phone },
    { label: "Idioma del cliente", value: lang.toUpperCase() },
  ];

  const criteriaRows = [
    { label: "Presupuesto (USD)", value: budgetEs },
    { label: "Ubicaciones / Regiones", value: regionsText },
    ...structuredEs.map((r) => ({ label: r.labelEs, value: r.valueEs })),
  ];

  const adminSubject = `BÚSQUEDA PRIVADA OFF-MARKET [${referenceCode}] (${tabEs}) — ${name} (${budgetEs})`;
  const adminTextLines = [
    "[SOLICITUD DE BÚSQUEDA PRIVADA OFF-MARKET]",
    `Referencia: ${referenceCode}`,
    `Modalidad: ${tabEs}`,
    "",
    "--- DATOS DE CONTACTO ---",
    ...contactRows.slice(2).map((r) => `${r.label}: ${r.value}`),
    "",
    "--- PREFERENCIAS SELECCIONADAS (EN ESPAÑOL PARA EL EQUIPO) ---",
    ...criteriaRows.map((r) => `${r.label}: ${r.value}`),
    ...(cleanFreeText
      ? ["", `--- MENSAJE LIBRE DEL CLIENTE (IDIOMA ORIGINAL: ${lang.toUpperCase()}) ---`, cleanFreeText]
      : []),
  ];

  const freeTextHtmlBlock = cleanFreeText
    ? `<div style="background-color: #1a1a1a; padding: 18px 20px; border-left: 4px solid #c9ae5d; margin: 18px 0; border-radius: 4px;">
        <p style="margin: 0 0 8px 0; color: #c9ae5d; font-size: 13px; font-weight: bold; text-transform: uppercase;">Mensaje Libre del Cliente (Idioma original: ${escHtml(lang.toUpperCase())})</p>
        <p style="margin: 0; color: #e0e0e0; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${escHtml(cleanFreeText)}</p>
      </div>`
    : "";

  const adminHtml = wrapBrandedHtml(
    "SOLICITUD BÚSQUEDA PRIVADA OFF-MARKET",
    `
      <p style="font-size: 14px; color: #cccccc; text-align: center; margin-bottom: 20px;">
        Referencia de seguimiento: <strong style="color: #c9ae5d; font-family: monospace; font-size: 15px;">${escHtml(referenceCode)}</strong>
      </p>
      ${htmlSection("Datos de Contacto", contactRows)}
      ${htmlSection("Preferencias Seleccionadas (Español)", criteriaRows)}
      ${freeTextHtmlBlock}
    `,
    "División Privada Off-Market — Punta Cana Investments"
  );

  const firstName = name.split(" ")[0] || "Cliente";
  const clientCopy =
    lang === "en"
      ? {
          subject: `Off-Market Request Confirmation [${referenceCode}] — Punta Cana Investments`,
          title: "Private Search Requirement Received",
          greeting: `Hello ${firstName},`,
          intro: `Your private Off-Market search requirement (${tab === "hoteles" ? "Hotels & Resorts" : "Opportunity Properties"}) has been registered under reference ${referenceCode}.`,
          summary: `Budget: ${budget} | Regions: ${regionsText}`,
          body: "Our investment committee is reviewing your mandate profile and will contact you shortly to coordinate an initial confidential validation call (NDA / POF protocol).",
          speedUpTitle: "Want to schedule your confidential call?",
          speedUpText: "Book a private session directly with our investment desk:",
          buttonText: "Schedule Private Call",
          slogan: "Private Placement & Institutional Real Estate",
          refLabel: "Reference",
        }
      : lang === "fr"
      ? {
          subject: `Confirmation de demande Off-Market [${referenceCode}] — Punta Cana Investments`,
          title: "Demande de Recherche Privée Reçue",
          greeting: `Bonjour ${firstName},`,
          intro: `Votre demande de recherche privée Off-Market (${tab === "hoteles" ? "Hôtels et Complexes" : "Propriétés d'Opportunité"}) a été enregistrée sous la référence ${referenceCode}.`,
          summary: `Budget : ${budget} | Régions : ${regionsText}`,
          body: "Notre comité d'investissement examine votre profil et vous contactera prochainement pour organiser un premier appel confidentiel de validation (protocole NDA / POF).",
          speedUpTitle: "Souhaitez-vous planifier votre appel confidentiel ?",
          speedUpText: "Réservez directement un créneau avec notre comité :",
          buttonText: "Planifier un Appel Privé",
          slogan: "Placement Privé et Immobilier Institutionnel",
          refLabel: "Référence",
        }
      : {
          subject: `Confirmación de requerimiento Off-Market [${referenceCode}] — Punta Cana Investments`,
          title: "Requerimiento Privado Recibido",
          greeting: `Hola ${firstName},`,
          intro: `Tu solicitud de búsqueda privada Off-Market (${tabEs}) quedó registrada bajo la referencia ${referenceCode}.`,
          summary: `Presupuesto: ${budgetEs} | Regiones: ${regionsText}`,
          body: "Nuestro comité de inversiones revisará tu perfil y se comunicará contigo a la mayor brevedad para coordinar una llamada confidencial de validación inicial (protocolo NDA / POF).",
          speedUpTitle: "¿Deseas agendar tu llamada confidencial?",
          speedUpText: "Puedes reservar directamente con nuestra mesa de inversiones:",
          buttonText: "Agendar Llamada Privada",
          slogan: "División Privada y Activos Institucionales",
          refLabel: "Referencia",
        };

  const clientTextLines = [
    clientCopy.greeting,
    "",
    clientCopy.intro,
    `${clientCopy.refLabel}: ${referenceCode}`,
    clientCopy.summary,
    "",
    clientCopy.body,
    "",
    `${clientCopy.speedUpTitle} ${clientCopy.speedUpText} ${PCI_CALENDLY_URL}`,
    "",
    "Punta Cana Investments",
  ];

  const clientHtml = wrapBrandedHtml(
    clientCopy.title,
    `
      <p style="font-size: 15px; line-height: 1.6; color: #e0e0e0;"><strong>${escHtml(clientCopy.greeting)}</strong></p>
      <p style="font-size: 15px; line-height: 1.6; color: #e0e0e0;">${escHtml(clientCopy.intro)}</p>
      <div style="background-color: #161616; border: 1px solid #c9ae5d; padding: 14px 18px; margin: 18px 0; border-radius: 4px; text-align: center;">
        <span style="font-size: 12px; color: #aaaaaa; text-transform: uppercase; letter-spacing: 1px;">${escHtml(clientCopy.refLabel)}:</span>
        <strong style="display: block; color: #c9ae5d; font-family: monospace; font-size: 18px; margin-top: 4px;">${escHtml(referenceCode)}</strong>
        <p style="margin: 8px 0 0 0; font-size: 12px; color: #cccccc;">${escHtml(clientCopy.summary)}</p>
      </div>
      <p style="font-size: 15px; line-height: 1.6; color: #e0e0e0;">${escHtml(clientCopy.body)}</p>
      <div style="background-color: #1a1a1a; padding: 20px; border-left: 4px solid #c9ae5d; margin: 24px 0; border-radius: 4px;">
        <p style="margin: 0 0 12px 0; color: #ffffff; font-size: 14px;"><strong>${escHtml(clientCopy.speedUpTitle)}</strong><br/>${escHtml(clientCopy.speedUpText)}</p>
        <p style="margin: 0;"><a href="${PCI_CALENDLY_URL}" style="display: inline-block; background-color: #c9ae5d; color: #000000; padding: 10px 20px; text-decoration: none; border-radius: 2px; font-weight: bold; font-size: 13px; text-transform: uppercase;">${escHtml(clientCopy.buttonText)}</a></p>
      </div>
    `,
    clientCopy.slogan
  );

  return {
    structuredEs,
    budgetEs,
    adminEmail: {
      from: PCI_TEAM_FROM,
      to: PCI_TEAM_TO,
      subject: adminSubject,
      text: adminTextLines.join("\n"),
      html: adminHtml,
      lang: "es",
    },
    clientEmail: {
      from: PCI_CLIENT_FROM,
      to: email,
      subject: clientCopy.subject,
      text: clientTextLines.join("\n"),
      html: clientHtml,
      lang,
    },
  };
}

// =============================================================================
// 4. FLY & BUY EMAILS
// =============================================================================

export interface FlyAndBuyEmailInput {
  referenceCode: string;
  lang: SupportedLang;
  name: string;
  email: string;
  phone: string;
  country: string;
  proposedDates?: string;
  objectives: string[] | string;
  propertyTypes: string[] | string;
  investmentFocus: string[] | string;
  experience: string;
  horizon: string;
  visited: string;
  motivation: string[] | string;
  specificProperty?: string;
  comments: string;
}

export function buildFlyAndBuyEmails(input: FlyAndBuyEmailInput): {
  adminEmail: RenderedEmailPayload;
  clientEmail: RenderedEmailPayload;
  questionnaireEs: Array<{ label: string; value: string }>;
} {
  const {
    referenceCode,
    lang,
    name,
    email,
    phone,
    country,
    proposedDates = "Por Definir",
    objectives,
    propertyTypes,
    investmentFocus,
    experience,
    horizon,
    visited,
    motivation,
    specificProperty,
    comments,
  } = input;

  const cleanComments = String(comments || "").trim();
  const specificPropDisplay = String(specificProperty || "").trim() || "Ninguna especificada";

  const questionnaireEs: Array<{ label: string; value: string }> = [
    { label: "Objetivos", value: translateFlyBuyListEs("objectives", objectives) },
    { label: "Tipo de Propiedad", value: translateFlyBuyListEs("propertyTypes", propertyTypes) },
    { label: "Propiedad Específica", value: specificPropDisplay },
    { label: "Enfoque de Inversión", value: translateFlyBuyListEs("investmentFocus", investmentFocus) },
    { label: "Experiencia Inmobiliaria", value: translateFlyBuyListEs("experience", experience) },
    { label: "Horizonte de Inversión", value: translateFlyBuyListEs("horizon", horizon) },
    { label: "¿Ha visitado República Dominicana?", value: translateFlyBuyListEs("visited", visited) },
    { label: "Motivación del Viaje", value: translateFlyBuyListEs("motivation", motivation) },
  ];

  const clientRows = [
    { label: "Referencia", value: referenceCode },
    { label: "Nombre del interesado", value: name },
    { label: "Correo electrónico", value: email, href: `mailto:${email}` },
    { label: "Teléfono / WhatsApp", value: phone },
    { label: "País / Ciudad de origen", value: country || "No especificado" },
    { label: "Fechas propuestas", value: proposedDates },
    { label: "Idioma del cliente", value: lang.toUpperCase() },
  ];

  const adminSubject = `SOLICITUD FLY & BUY [${referenceCode}] — ${name}${
    specificProperty ? ` (${specificProperty})` : ""
  }`;

  const adminTextLines = [
    "[SOLICITUD VIP PROGRAMA FLY & BUY]",
    `Referencia: ${referenceCode}`,
    "",
    "--- DATOS DEL INTERESADO ---",
    ...clientRows.slice(1).map((r) => `${r.label}: ${r.value}`),
    "",
    "--- CUESTIONARIO (ETIQUETAS LEGIBLES EN ESPAÑOL) ---",
    ...questionnaireEs.map((r) => `${r.label}: ${r.value}`),
    "",
    `--- COMENTARIOS DEL CLIENTE (IDIOMA ORIGINAL: ${lang.toUpperCase()}) ---`,
    cleanComments || "Sin comentarios.",
  ];

  const adminHtml = wrapBrandedHtml(
    "NUEVA SOLICITUD VIP FLY & BUY",
    `
      <p style="font-size: 14px; color: #cccccc; text-align: center; margin-bottom: 20px;">
        Referencia de seguimiento: <strong style="color: #c9ae5d; font-family: monospace; font-size: 15px;">${escHtml(referenceCode)}</strong>
      </p>
      ${htmlSection("Datos del Interesado", clientRows)}
      ${htmlSection("Cuestionario Fly & Buy (Español)", questionnaireEs)}
      <div style="background-color: #1a1a1a; padding: 18px 20px; border-left: 4px solid #c9ae5d; margin: 18px 0; border-radius: 4px;">
        <p style="margin: 0 0 8px 0; color: #c9ae5d; font-size: 13px; font-weight: bold; text-transform: uppercase;">Comentarios del Interesado (Idioma original: ${escHtml(lang.toUpperCase())})</p>
        <p style="margin: 0; color: #e0e0e0; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${escHtml(cleanComments || "Sin comentarios.")}</p>
      </div>
    `,
    "Programa VIP Fly & Buy — Punta Cana Investments"
  );

  const firstName = name.split(" ")[0] || "Cliente";
  const clientCopy =
    lang === "en"
      ? {
          subject: `Fly & Buy Request Confirmation [${referenceCode}] — Punta Cana Investments`,
          title: "Fly & Buy Request Confirmed",
          greeting: `Hello ${firstName},`,
          intro: `We have received your application for our exclusive Fly & Buy program under reference ${referenceCode}.`,
          body: "An advisor from our VIP team will review your investment profile and contact you shortly to plan your visit to the Dominican Republic.",
          speedUpTitle: "Want to speed up your itinerary?",
          speedUpText: "Pick your preferred time for a personalized video call:",
          buttonText: "Schedule Video Call",
          slogan: "The paradise for your real estate investments",
          refLabel: "Reference",
          propLabel: "Property of interest",
        }
      : lang === "fr"
      ? {
          subject: `Confirmation de Demande Fly & Buy [${referenceCode}] — Punta Cana Investments`,
          title: "Confirmation de Demande Fly & Buy",
          greeting: `Bonjour ${firstName},`,
          intro: `Nous avons bien reçu votre demande de participation à notre programme exclusif Fly & Buy sous la référence ${referenceCode}.`,
          body: "Un conseiller de notre équipe VIP étudiera votre profil et vous contactera prochainement pour organiser votre visite en République Dominicaine.",
          speedUpTitle: "Vous souhaitez accélérer l'organisation ?",
          speedUpText: "Choisissez le créneau de votre choix pour un appel vidéo :",
          buttonText: "Planifier l'Appel Vidéo",
          slogan: "Le paradis de vos investissements immobiliers",
          refLabel: "Référence",
          propLabel: "Propriété d'intérêt",
        }
      : {
          subject: `Confirmación de Solicitud Fly & Buy [${referenceCode}] — Punta Cana Investments`,
          title: "Confirmación de Solicitud Fly & Buy",
          greeting: `Hola ${firstName},`,
          intro: `Hemos recibido exitosamente tu solicitud para nuestro programa exclusivo Fly & Buy bajo la referencia ${referenceCode}.`,
          body: "Un asesor de nuestro equipo evaluará tu perfil comercial y se comunicará contigo a la mayor brevedad para estructurar tu visita a la República Dominicana.",
          speedUpTitle: "¿Deseas agilizar el proceso?",
          speedUpText: "Selecciona el horario de tu preferencia para una videollamada:",
          buttonText: "Agendar Videollamada",
          slogan: "El paraíso de tus inversiones inmobiliarias",
          refLabel: "Referencia",
          propLabel: "Propiedad de interés",
        };

  const clientTextLines = [
    clientCopy.greeting,
    "",
    clientCopy.intro,
    `${clientCopy.refLabel}: ${referenceCode}`,
    ...(specificProperty ? [`${clientCopy.propLabel}: ${specificProperty}`] : []),
    "",
    clientCopy.body,
    "",
    `${clientCopy.speedUpTitle} ${clientCopy.speedUpText} ${PCI_CALENDLY_URL}`,
    "",
    "Punta Cana Investments",
  ];

  const clientHtml = wrapBrandedHtml(
    clientCopy.title,
    `
      <p style="font-size: 15px; line-height: 1.6; color: #e0e0e0;"><strong>${escHtml(clientCopy.greeting)}</strong></p>
      <p style="font-size: 15px; line-height: 1.6; color: #e0e0e0;">${escHtml(clientCopy.intro)}</p>
      <div style="background-color: #161616; border: 1px solid #c9ae5d; padding: 14px 18px; margin: 18px 0; border-radius: 4px; text-align: center;">
        <span style="font-size: 12px; color: #aaaaaa; text-transform: uppercase; letter-spacing: 1px;">${escHtml(clientCopy.refLabel)}:</span>
        <strong style="display: block; color: #c9ae5d; font-family: monospace; font-size: 18px; margin-top: 4px;">${escHtml(referenceCode)}</strong>
      </div>
      <p style="font-size: 15px; line-height: 1.6; color: #e0e0e0;">${escHtml(clientCopy.body)}</p>
      <div style="background-color: #1a1a1a; padding: 20px; border-left: 4px solid #c9ae5d; margin: 24px 0; border-radius: 4px;">
        <p style="margin: 0 0 12px 0; color: #ffffff; font-size: 14px;"><strong>${escHtml(clientCopy.speedUpTitle)}</strong><br/>${escHtml(clientCopy.speedUpText)}</p>
        <p style="margin: 0;"><a href="${PCI_CALENDLY_URL}" style="display: inline-block; background-color: #c9ae5d; color: #000000; padding: 10px 20px; text-decoration: none; border-radius: 2px; font-weight: bold; font-size: 13px; text-transform: uppercase;">${escHtml(clientCopy.buttonText)}</a></p>
      </div>
    `,
    clientCopy.slogan
  );

  return {
    questionnaireEs,
    adminEmail: {
      from: PCI_TEAM_FROM,
      to: PCI_TEAM_TO,
      subject: adminSubject,
      text: adminTextLines.join("\n"),
      html: adminHtml,
      lang: "es",
    },
    clientEmail: {
      from: PCI_CLIENT_FROM,
      to: email,
      subject: clientCopy.subject,
      text: clientTextLines.join("\n"),
      html: clientHtml,
      lang,
    },
  };
}

// =============================================================================
// 5. KYC (DUE DILIGENCE) EMAILS — PRIVACY-SAFE METADATA ONLY (ES/EN/FR)
// =============================================================================

export interface KycEmailInput {
  referenceCode: string;
  lang: SupportedLang;
  entityType: "Persona Física" | "Persona Jurídica";
  subjectName: string;
  clientEmail: string;
  phone?: string;
  country?: string;
}

export function buildKycEmails(input: KycEmailInput): {
  adminEmail: RenderedEmailPayload;
  clientEmail: RenderedEmailPayload;
} {
  const {
    referenceCode,
    lang,
    entityType,
    subjectName,
    clientEmail,
    phone,
    country,
  } = input;

  const cleanName = String(subjectName || "").trim() || "Cliente KYC";
  const cleanPhone = String(phone || "").trim();
  const cleanCountry = String(country || "").trim();

  const adminRows: Array<{ label: string; value: string; href?: string }> = [
    { label: "Referencia KYC", value: referenceCode },
    { label: "Tipo de expediente", value: entityType },
    { label: entityType === "Persona Jurídica" ? "Entidad / Razón social" : "Titular", value: cleanName },
    ...(clientEmail ? [{ label: "Correo electrónico", value: clientEmail, href: `mailto:${clientEmail}` }] : []),
    ...(cleanPhone ? [{ label: "Teléfono de contacto", value: cleanPhone }] : []),
    ...(cleanCountry ? [{ label: "País", value: cleanCountry }] : []),
    { label: "Idioma del formulario", value: lang.toUpperCase() },
  ];

  const adminSubject = `NUEVO EXPEDIENTE KYC [${referenceCode}] (${entityType}) — ${cleanName}`;

  const adminTextLines = [
    "[NUEVO EXPEDIENTE KYC — DEBIDA DILIGENCIA]",
    `Referencia: ${referenceCode}`,
    "",
    "--- RESUMEN DEL EXPEDIENTE ---",
    ...adminRows.slice(1).map((r) => `${r.label}: ${r.value}`),
    "",
    "Nota de confidencialidad: Los datos financieros, documentos de identidad y firma digital se almacenan exclusivamente en la Bóveda Segura del Módulo Legal de Fortress CRM.",
  ];

  const adminHtml = wrapBrandedHtml(
    "NUEVO EXPEDIENTE KYC RECIBIDO",
    `
      <p style="font-size: 14px; color: #cccccc; text-align: center; margin-bottom: 20px;">
        Referencia de cumplimiento: <strong style="color: #c9ae5d; font-family: monospace; font-size: 15px;">${escHtml(referenceCode)}</strong>
      </p>
      ${htmlSection("Resumen del Expediente (Solo Metadatos)", adminRows)}
      <div style="background-color: #161616; padding: 16px 20px; border: 1px solid #333333; margin: 18px 0; border-radius: 4px;">
        <p style="margin: 0; color: #cccccc; font-size: 13px; line-height: 1.6;">
          Por seguridad y cumplimiento (Ley 155-17), los documentos adjuntos y datos sensibles no se incluyen por correo. Revise el expediente completo en el <strong>Módulo Legal de Fortress CRM</strong>.
        </p>
      </div>
    `,
    "Departamento Legal y Cumplimiento — Punta Cana Investments"
  );

  const localizedType =
    entityType === "Persona Jurídica"
      ? lang === "en"
        ? "Legal Entity"
        : lang === "fr"
        ? "Personne Morale"
        : "Persona Jurídica"
      : lang === "en"
      ? "Individual"
      : lang === "fr"
      ? "Personne Physique"
      : "Persona Física";

  const clientCopy =
    lang === "en"
      ? {
          subject: `KYC Dossier Confirmation [${referenceCode}] — Punta Cana Investments`,
          title: "KYC Receipt Confirmation",
          greeting: `Dear ${cleanName},`,
          intro: `We have successfully received your ${localizedType} KYC (Due Diligence) dossier under reference ${referenceCode}.`,
          body: "Your information and supporting documents are handled under strict confidentiality by our Legal & Compliance Department. Our team will review your file shortly and contact you via this channel if any additional information is required.",
          refLabel: "Compliance Reference",
          typeLabel: "Dossier Type",
          footer: "Legal & Compliance Department",
        }
      : lang === "fr"
      ? {
          subject: `Confirmation de Dossier KYC [${referenceCode}] — Punta Cana Investments`,
          title: "Confirmation de Réception KYC",
          greeting: `Bonjour ${cleanName},`,
          intro: `Nous avons bien reçu votre dossier KYC (Diligence Raisonnable — ${localizedType}) sous la référence ${referenceCode}.`,
          body: "Vos informations et justificatifs sont traités en toute confidentialité par notre Département Juridique et Conformité. Notre équipe examinera votre dossier dans les plus brefs délais et vous contactera par cette même voie si des éléments complémentaires sont nécessaires.",
          refLabel: "Référence de Conformité",
          typeLabel: "Type de Dossier",
          footer: "Département Juridique et Conformité",
        }
      : {
          subject: `Confirmación de Expediente KYC [${referenceCode}] — Punta Cana Investments`,
          title: "Confirmación de Recepción KYC",
          greeting: `Estimado/a ${cleanName},`,
          intro: `Hemos recibido exitosamente su expediente KYC (Debida Diligencia — ${localizedType}) bajo la referencia ${referenceCode}.`,
          body: "Sus datos y documentos son tratados bajo estricta confidencialidad por nuestro Departamento Legal y de Cumplimiento. Nuestro equipo evaluará su expediente a la mayor brevedad y se comunicará por esta vía si requiere información adicional.",
          refLabel: "Referencia de Cumplimiento",
          typeLabel: "Tipo de Expediente",
          footer: "Departamento Legal y Cumplimiento",
        };

  const clientTextLines = [
    clientCopy.greeting,
    "",
    clientCopy.intro,
    `${clientCopy.refLabel}: ${referenceCode}`,
    `${clientCopy.typeLabel}: ${localizedType}`,
    "",
    clientCopy.body,
    "",
    `Punta Cana Investments — ${clientCopy.footer}`,
  ];

  const clientHtml = wrapBrandedHtml(
    clientCopy.title,
    `
      <p style="font-size: 15px; line-height: 1.6; color: #e0e0e0;"><strong>${escHtml(clientCopy.greeting)}</strong></p>
      <p style="font-size: 15px; line-height: 1.6; color: #e0e0e0;">${escHtml(clientCopy.intro)}</p>
      <div style="background-color: #161616; border: 1px solid #c9ae5d; padding: 14px 18px; margin: 18px 0; border-radius: 4px; text-align: center;">
        <span style="font-size: 12px; color: #aaaaaa; text-transform: uppercase; letter-spacing: 1px;">${escHtml(clientCopy.refLabel)}:</span>
        <strong style="display: block; color: #c9ae5d; font-family: monospace; font-size: 18px; margin-top: 4px;">${escHtml(referenceCode)}</strong>
        <span style="display: block; font-size: 12px; color: #cccccc; margin-top: 6px;">${escHtml(clientCopy.typeLabel)}: ${escHtml(localizedType)}</span>
      </div>
      <p style="font-size: 15px; line-height: 1.6; color: #e0e0e0;">${escHtml(clientCopy.body)}</p>
    `,
    clientCopy.footer
  );

  return {
    adminEmail: {
      from: PCI_TEAM_FROM,
      to: PCI_TEAM_TO,
      subject: adminSubject,
      text: adminTextLines.join("\n"),
      html: adminHtml,
      lang: "es",
    },
    clientEmail: {
      from: PCI_CLIENT_FROM,
      to: clientEmail,
      subject: clientCopy.subject,
      text: clientTextLines.join("\n"),
      html: clientHtml,
      lang,
    },
  };
}
