import type { SupportedLang } from "@/lib/formEmails";

export const HONEYPOT_FIELD_NAME = "website_url";
export const FORM_LOADED_AT_FIELD_NAME = "form_loaded_at";
export const MIN_HUMAN_SUBMIT_MS = 1200;

const BLOCKED_SELF_DOMAINS = [
  "puntacanainvestmentsrd.com",
  "puntacanainvesment.com",
];

const BLOCKED_DISPOSABLE_DOMAINS = [
  "mailinator.com",
  "guerrillamail.com",
  "guerrillamail.org",
  "10minutemail.com",
  "yopmail.com",
  "trashmail.com",
  "tempmail.com",
  "sharklasers.com",
  "grr.la",
];

const STRICT_EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export type AntispamDecision =
  | {
      action: "allow";
    }
  | {
      action: "silent_drop";
      code: "HONEYPOT_TRIGGERED" | "SUBMIT_TOO_FAST";
      logMessage: string;
    }
  | {
      action: "reject";
      code: "INVALID_EMAIL" | "SELF_DOMAIN_BLOCKED" | "DISPOSABLE_EMAIL_BLOCKED";
      errorMessage: string;
      logMessage: string;
    };

export function extractEmailDomain(email: string): string {
  const clean = String(email || "").trim().toLowerCase();
  const atIndex = clean.lastIndexOf("@");
  if (atIndex === -1 || atIndex === clean.length - 1) return "";
  return clean.slice(atIndex + 1);
}

export function isValidEmailSyntax(email: string): boolean {
  const clean = String(email || "").trim();
  if (!clean || clean.length > 254) return false;
  if (/[\r\n]/.test(clean)) return false;
  return STRICT_EMAIL_REGEX.test(clean);
}

export function isSelfDomainEmail(email: string): boolean {
  const domain = extractEmailDomain(email);
  if (!domain) return false;
  return BLOCKED_SELF_DOMAINS.some(
    (blocked) => domain === blocked || domain.endsWith(`.${blocked}`)
  );
}

export function isDisposableEmail(email: string): boolean {
  const domain = extractEmailDomain(email);
  if (!domain) return false;
  return BLOCKED_DISPOSABLE_DOMAINS.some(
    (blocked) => domain === blocked || domain.endsWith(`.${blocked}`)
  );
}

function localizedError(
  lang: SupportedLang,
  code: "INVALID_EMAIL" | "SELF_DOMAIN_BLOCKED" | "DISPOSABLE_EMAIL_BLOCKED"
): string {
  if (code === "SELF_DOMAIN_BLOCKED") {
    if (lang === "es") {
      return "Por favor ingrese su correo electrónico personal o corporativo (no puede utilizar el dominio @puntacanainvestmentsrd.com).";
    }
    if (lang === "fr") {
      return "Veuillez saisir votre adresse e-mail personnelle ou professionnelle (le domaine @puntacanainvestmentsrd.com ne peut pas être utilisé).";
    }
    return "Please enter your personal or business email address (the @puntacanainvestmentsrd.com domain cannot be used here).";
  }

  if (code === "DISPOSABLE_EMAIL_BLOCKED") {
    if (lang === "es") {
      return "Por favor utilice una dirección de correo electrónico válida y permanente (no se admiten correos temporales).";
    }
    if (lang === "fr") {
      return "Veuillez utiliser une adresse e-mail valide et permanente (les adresses temporaires ne sont pas acceptées).";
    }
    return "Please use a valid permanent email address (disposable email addresses are not accepted).";
  }

  if (lang === "es") {
    return "Por favor ingrese una dirección de correo electrónico válida.";
  }
  if (lang === "fr") {
    return "Veuillez saisir une adresse e-mail valide.";
  }
  return "Please enter a valid email address.";
}

export function extractAntispamFromFormData(formData: FormData): {
  honeypot: string;
  formLoadedAt: string;
} {
  return {
    honeypot: String(formData.get(HONEYPOT_FIELD_NAME) || ""),
    formLoadedAt: String(formData.get(FORM_LOADED_AT_FIELD_NAME) || ""),
  };
}

export function evaluateFormAntispam(params: {
  email: string;
  honeypot?: unknown;
  formLoadedAt?: unknown;
  lang?: SupportedLang;
  sourceLabel?: string;
  nowMs?: number;
}): AntispamDecision {
  const {
    email,
    honeypot,
    formLoadedAt,
    lang = "es",
    sourceLabel = "form",
    nowMs = Date.now(),
  } = params;

  const cleanHoneypot = String(honeypot || "").trim();
  if (cleanHoneypot.length > 0) {
    return {
      action: "silent_drop",
      code: "HONEYPOT_TRIGGERED",
      logMessage: `[ANTISPAM:HONEYPOT_TRIGGERED] Blocked bot submission on ${sourceLabel} (0 Resend / 0 CRM).`,
    };
  }

  const parsedLoadedAt = Number(String(formLoadedAt || "").trim());
  const maxAgeMs = 24 * 60 * 60 * 1000;
  if (
    Number.isFinite(parsedLoadedAt) &&
    parsedLoadedAt > 0 &&
    nowMs - parsedLoadedAt >= 0 &&
    nowMs - parsedLoadedAt < maxAgeMs
  ) {
    const elapsedMs = nowMs - parsedLoadedAt;
    if (elapsedMs < MIN_HUMAN_SUBMIT_MS) {
      return {
        action: "silent_drop",
        code: "SUBMIT_TOO_FAST",
        logMessage: `[ANTISPAM:SUBMIT_TOO_FAST] Blocked instant submission (${elapsedMs}ms) on ${sourceLabel} (0 Resend / 0 CRM).`,
      };
    }
  }

  const cleanEmail = String(email || "").trim();
  if (!isValidEmailSyntax(cleanEmail)) {
    return {
      action: "reject",
      code: "INVALID_EMAIL",
      errorMessage: localizedError(lang, "INVALID_EMAIL"),
      logMessage: `[ANTISPAM:INVALID_EMAIL] Rejected malformed email on ${sourceLabel} (0 Resend / 0 CRM).`,
    };
  }

  if (isSelfDomainEmail(cleanEmail)) {
    return {
      action: "reject",
      code: "SELF_DOMAIN_BLOCKED",
      errorMessage: localizedError(lang, "SELF_DOMAIN_BLOCKED"),
      logMessage: `[ANTISPAM:SELF_DOMAIN_BLOCKED] Blocked self-domain spoofing email on ${sourceLabel} (0 Resend / 0 CRM).`,
    };
  }

  if (isDisposableEmail(cleanEmail)) {
    return {
      action: "reject",
      code: "DISPOSABLE_EMAIL_BLOCKED",
      errorMessage: localizedError(lang, "DISPOSABLE_EMAIL_BLOCKED"),
      logMessage: `[ANTISPAM:DISPOSABLE_EMAIL_BLOCKED] Blocked disposable email domain on ${sourceLabel} (0 Resend / 0 CRM).`,
    };
  }

  return { action: "allow" };
}
