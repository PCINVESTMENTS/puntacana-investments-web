import React from "react";
import { FaCalendarCheck, FaCheckCircle, FaFileContract, FaHardHat, FaKey, FaShieldAlt } from "react-icons/fa";

interface PropertyCommercialDetailsProps {
  property: Record<string, any>;
  lang: "es" | "en" | "fr" | string;
}

export default function PropertyCommercialDetails({ property, lang }: PropertyCommercialDetailsProps) {
  const specs: Record<string, any> = property?.specs || {};
  const isEn = lang === "en";
  const isFr = lang === "fr";

  const paymentSteps = [
    {
      key: "payment_reserve",
      value: String(specs.payment_reserve || "").trim(),
      label: isEn ? "Reservation" : isFr ? "Réservation" : "Reserva",
      icon: FaCalendarCheck,
    },
    {
      key: "payment_contract",
      value: String(specs.payment_contract || "").trim(),
      label: isEn ? "Contract Signing" : isFr ? "Signature du Contrat" : "Firma de Contrato",
      icon: FaFileContract,
    },
    {
      key: "payment_construction",
      value: String(specs.payment_construction || "").trim(),
      label: isEn ? "During Construction" : isFr ? "Pendant Construction" : "Durante Construcción",
      icon: FaHardHat,
    },
    {
      key: "payment_delivery",
      value: String(specs.payment_delivery || "").trim(),
      label: isEn ? "Upon Delivery" : isFr ? "À la Livraison" : "Contra Entrega",
      icon: FaKey,
    },
  ].filter((s) => s.value.length > 0);

  const confirmedFacts: { label: string; value: string; highlight?: boolean }[] = [];

  if (specs.confotur) {
    confirmedFacts.push({
      label: isEn ? "Tax Benefit" : isFr ? "Avantage Fiscal" : "Beneficio Fiscal",
      value: isEn
        ? "CONFOTUR Law (Tax Exemption)"
        : isFr
        ? "Loi CONFOTUR (Exonération Fiscale)"
        : "Ley CONFOTUR (Exención Fiscal)",
      highlight: true,
    });
  }
  if (String(specs.delivery_date || "").trim()) {
    confirmedFacts.push({
      label: isEn ? "Estimated Delivery" : isFr ? "Livraison Estimée" : "Fecha de Entrega",
      value: String(specs.delivery_date).trim(),
    });
  }
  if (Number(property?.completionPercent || specs.completion_percent || 0) > 0) {
    confirmedFacts.push({
      label: isEn ? "Construction Progress" : isFr ? "Avancement des Travaux" : "Avance de Obra",
      value: `${Number(property?.completionPercent || specs.completion_percent)}%`,
    });
  }
  if (Number(property?.lotSize || 0) > 0) {
    confirmedFacts.push({
      label: isEn ? "Lot / Land Area" : isFr ? "Superficie du Terrain" : "Área del Solar",
      value: `${Number(property.lotSize).toLocaleString("en-US")} m²`,
    });
  }
  if (String(specs.floor_level || "").trim()) {
    confirmedFacts.push({
      label: isEn ? "Floor / Level" : isFr ? "Étage / Niveau" : "Nivel / Piso",
      value: String(specs.floor_level).trim(),
    });
  }
  if (String(specs.parking_spaces || "").trim()) {
    confirmedFacts.push({
      label: isEn ? "Parking Spaces" : isFr ? "Places de Parking" : "Parqueos",
      value: String(specs.parking_spaces).trim(),
    });
  }
  if (String(specs.hoa_monthly || "").trim()) {
    const rawHoa = String(specs.hoa_monthly).trim();
    const hoaDisplay = /^\d+(\.\d+)?$/.test(rawHoa) ? `US$ ${rawHoa} / mes` : rawHoa;
    confirmedFacts.push({
      label: isEn ? "Monthly HOA / Maintenance" : isFr ? "Charges HOA Mensuelles" : "Mantenimiento / HOA",
      value: isEn ? hoaDisplay.replace("/ mes", "/ mo") : isFr ? hoaDisplay.replace("/ mes", "/ mois") : hoaDisplay,
    });
  }
  if (String(specs.furnished || "").trim()) {
    confirmedFacts.push({
      label: isEn ? "Furnishing" : isFr ? "Ameublement" : "Mobiliario",
      value: String(specs.furnished).trim(),
    });
  }
  if (String(specs.zoning || "").trim()) {
    confirmedFacts.push({
      label: isEn ? "Zoning / Land Use" : isFr ? "Zonage / Usage" : "Zonificación",
      value: String(specs.zoning).trim(),
    });
  }
  if (specs.titled_deslindado) {
    confirmedFacts.push({
      label: isEn ? "Legal Title" : isFr ? "Titre de Propriété" : "Título Legal",
      value: isEn ? "Titled / Deslindado" : isFr ? "Titre Foncier (Deslindado)" : "Título Deslindado",
    });
  }
  if (String(specs.rooms_count || "").trim()) {
    confirmedFacts.push({
      label: isEn ? "Keys / Suites / Units" : isFr ? "Clés / Suites / Locaux" : "Llaves / Locales",
      value: String(specs.rooms_count).trim(),
    });
  }
  if (String(specs.operator_brand || "").trim()) {
    confirmedFacts.push({
      label: isEn ? "Hotel Operator / Brand" : isFr ? "Opérateur Hôtelier" : "Operador / Cadena",
      value: String(specs.operator_brand).trim(),
    });
  }
  if (String(specs.roi_estimate || "").trim()) {
    confirmedFacts.push({
      label: isEn ? "Confirmed Est. ROI" : isFr ? "ROI Estimé Confirmé" : "ROI Estimado Confirmado",
      value: String(specs.roi_estimate).trim(),
    });
  }

  if (paymentSteps.length === 0 && confirmedFacts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-10">
      {paymentSteps.length > 0 && (
        <section className="bg-dark-gray border border-luxury-gold/25 rounded-lg p-6 md:p-8">
          <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
            <h2 className="text-2xl font-serif font-bold text-luxury-gold uppercase tracking-wider">
              {isEn ? "Payment Plan" : isFr ? "Plan de Paiement" : "Plan de Pago"}
            </h2>
            <span className="text-xs uppercase tracking-widest text-gray-400">
              {isEn ? "Confirmed Structure" : isFr ? "Structure Confirmée" : "Estructura Confirmada"}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {paymentSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.key}
                  className="bg-black/40 border border-white/10 rounded-lg p-4 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <span className="uppercase tracking-wider font-semibold">
                      {idx + 1}. {step.label}
                    </span>
                    <Icon aria-hidden="true" className="text-luxury-gold text-sm shrink-0" />
                  </div>
                  <div className="text-xl font-bold text-white font-serif">{step.value}</div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {confirmedFacts.length > 0 && (
        <section className="bg-dark-gray border border-white/10 rounded-lg p-6 md:p-8">
          <h2 className="text-2xl font-serif font-bold text-luxury-gold mb-6 uppercase tracking-wider flex items-center gap-3">
            <FaShieldAlt aria-hidden="true" className="text-xl" />
            {isEn
              ? "Confirmed Technical Specifications"
              : isFr
              ? "Spécifications Techniques Confirmées"
              : "Especificaciones Técnicas Confirmadas"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {confirmedFacts.map((fact) => (
              <div
                key={fact.label}
                className={`p-4 rounded border ${
                  fact.highlight
                    ? "bg-emerald-950/30 border-emerald-500/40"
                    : "bg-black/35 border-white/10"
                }`}
              >
                <div className="text-[11px] uppercase tracking-wider text-gray-400 mb-1 flex items-center gap-1.5">
                  {fact.highlight && <FaCheckCircle aria-hidden="true" className="text-emerald-400" />}
                  {fact.label}
                </div>
                <div className={`text-sm font-bold ${fact.highlight ? "text-emerald-300" : "text-white"}`}>
                  {fact.value}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
