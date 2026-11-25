/**
 * Shared trilingual property pricing & rental modality formatter (ES / EN / FR).
 * Supports Sale, Monthly Rent, Nightly Rent, and Dual (Nightly + Monthly) on one ficha.
 * Never mixes internal ROI/projected nightly estimates with public advertised tariffs.
 */

export type SupportedLang = "es" | "en" | "fr" | string;

export interface RentalPricingSummary {
  isRent: boolean;
  hasNightly: boolean;
  hasMonthly: boolean;
  isDual: boolean;
  currency: string;
  nightlyAmount: number;
  monthlyAmount: number;
  nightlyLabel: string | null;
  monthlyLabel: string | null;
  minStay: number | null;
  weeklyLabel: string | null;
  statusBadge: string;
  cardPricePrimary: string;
  cardPriceSecondary: string | null;
  salePriceLabel: string;
}

export function formatMoneyAmount(
  amount: number,
  currencyCode: string = "USD",
  lang: SupportedLang = "es"
): string {
  const safeCur = ["USD", "EUR", "DOP"].includes((currencyCode || "").toUpperCase())
    ? currencyCode.toUpperCase()
    : "USD";
  const rounded = Math.round(Number(amount || 0));

  if (lang === "fr") {
    const numFr = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 })
      .format(rounded)
      .replace(/[\u202f\u00a0]/g, " ");
    if (safeCur === "EUR") return `${numFr} €`;
    if (safeCur === "DOP") return `${numFr} $RD`;
    return `${numFr} $US`;
  }

  const numEn = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(rounded);
  if (safeCur === "EUR") return `€${numEn}`;
  if (safeCur === "DOP") return `RD$${numEn}`;
  return `US$${numEn}`;
}

export function formatSalePrice(
  amount: number,
  currencyCode: string = "USD",
  lang: SupportedLang = "es"
): string {
  if (!amount || Number(amount) <= 0) {
    return lang === "en" ? "Price on Request" : lang === "fr" ? "Prix sur Demande" : "Precio a Consultar";
  }
  const safeCur = ["USD", "EUR", "DOP"].includes((currencyCode || "").toUpperCase())
    ? currencyCode.toUpperCase()
    : "USD";
  if (safeCur === "USD" && lang !== "fr") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(Number(amount));
  }
  return formatMoneyAmount(Number(amount), safeCur, lang);
}

export function getRentalPricingSummary(
  prop: Record<string, any>,
  lang: SupportedLang = "es"
): RentalPricingSummary {
  const isRent = prop?.status === "rent" || prop?.listing_type === "rent";
  const currency = String(prop?.currency || "USD").toUpperCase();

  const rawNight = Number(prop?.rental_price_night ?? 0);
  const hasNightly = Boolean(isRent && prop?.is_rental_active && rawNight > 0);

  const rawMonthly = Number(prop?.price ?? 0);
  const hasMonthly = Boolean(isRent && rawMonthly > 0);
  const isDual = hasNightly && hasMonthly;

  const nightUnit = lang === "en" ? "per night" : lang === "fr" ? "par nuit" : "por noche";
  const monthUnit = lang === "en" ? "per month" : lang === "fr" ? "par mois" : "por mes";
  const weekUnit = lang === "en" ? "per week" : lang === "fr" ? "par semaine" : "por semana";

  const nightlyLabel = hasNightly ? `${formatMoneyAmount(rawNight, currency, lang)} ${nightUnit}` : null;
  const monthlyLabel = hasMonthly ? `${formatMoneyAmount(rawMonthly, currency, lang)} ${monthUnit}` : null;

  const rawWeek = Number(prop?.rental_price_week ?? 0);
  const weeklyLabel = hasNightly && rawWeek > 0 ? `${formatMoneyAmount(rawWeek, currency, lang)} ${weekUnit}` : null;
  const minStay = hasNightly && Number(prop?.rental_min_stay || 0) > 0 ? Number(prop.rental_min_stay) : null;

  let statusBadge: string;
  if (!isRent) {
    statusBadge = lang === "en" ? "For Sale" : lang === "fr" ? "À Vendre" : "Venta";
  } else if (isDual) {
    statusBadge =
      lang === "en"
        ? "Nightly & Monthly"
        : lang === "fr"
        ? "Nuit / Mois"
        : "Noches / Mes";
  } else if (hasNightly) {
    statusBadge =
      lang === "en"
        ? "Nightly Rent"
        : lang === "fr"
        ? "Location par Nuit"
        : "Renta por Noches";
  } else {
    statusBadge =
      lang === "en"
        ? "Monthly Rent"
        : lang === "fr"
        ? "Loyer Mensuel"
        : "Renta Mensual";
  }

  const priceOnReq = lang === "en" ? "Price on Request" : lang === "fr" ? "Prix sur Demande" : "Precio a Consultar";
  const salePriceLabel = formatSalePrice(Number(prop?.price || 0), currency, lang);

  let cardPricePrimary = salePriceLabel;
  let cardPriceSecondary: string | null = null;
  if (isRent) {
    if (isDual) {
      cardPricePrimary = nightlyLabel!;
      cardPriceSecondary = monthlyLabel!;
    } else if (hasNightly) {
      cardPricePrimary = nightlyLabel!;
    } else if (hasMonthly) {
      cardPricePrimary = monthlyLabel!;
    } else {
      cardPricePrimary = priceOnReq;
    }
  }

  return {
    isRent,
    hasNightly,
    hasMonthly,
    isDual,
    currency,
    nightlyAmount: hasNightly ? rawNight : 0,
    monthlyAmount: hasMonthly ? rawMonthly : 0,
    nightlyLabel,
    monthlyLabel,
    minStay,
    weeklyLabel,
    statusBadge,
    cardPricePrimary,
    cardPriceSecondary,
    salePriceLabel,
  };
}
