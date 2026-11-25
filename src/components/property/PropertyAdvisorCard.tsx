import React from "react";
import { FaEnvelope, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";

interface AdvisorData {
  id: string;
  name: string;
  role?: { es?: string; en?: string; fr?: string } | string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  photo?: string;
  bio?: { es?: string; en?: string; fr?: string } | string;
}

export default function PropertyAdvisorCard({
  advisor,
  lang,
  propertyTitle,
}: {
  advisor: AdvisorData;
  lang: string;
  propertyTitle?: string;
}) {
  if (!advisor || !advisor.name) return null;
  const isEn = lang === "en";
  const isFr = lang === "fr";

  const pickLoc = (val: any) => {
    if (!val) return "";
    if (typeof val === "string") return val;
    if (isEn) return val.en || val.es || "";
    if (isFr) return val.fr || val.en || val.es || "";
    return val.es || val.en || "";
  };

  const roleText = pickLoc(advisor.role) || (isEn ? "Real Estate Advisor" : isFr ? "Conseiller Immobilier" : "Asesor Inmobiliario");
  const bioText = pickLoc(advisor.bio);
  const waDigits = String(advisor.whatsapp || advisor.phone || "").replace(/[^0-9]/g, "");
  const waText = encodeURIComponent(
    isEn
      ? `Hello ${advisor.name}, I would like more information about ${propertyTitle || "this property"}.`
      : isFr
      ? `Bonjour ${advisor.name}, je souhaite plus d'informations concernant ${propertyTitle || "cette propriété"}.`
      : `Hola ${advisor.name}, me gustaría recibir información sobre ${propertyTitle || "esta propiedad"}.`
  );

  return (
    <div
      data-property-advisor-card="true"
      data-advisor-id={advisor.id}
      className="mb-8 pb-6 border-b border-white/10"
    >
      <div className="text-[11px] uppercase tracking-[0.2em] text-luxury-gold font-bold mb-4">
        {isEn ? "Assigned Real Estate Advisor" : isFr ? "Conseiller Immobilier Attitré" : "Asesor Inmobiliario Asignado"}
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-luxury-gold/70 bg-black shrink-0">
          <img
            src={advisor.photo || "/images/ceo-final.jpg"}
            alt={advisor.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <h4 className="text-lg font-serif font-bold text-white leading-tight truncate">{advisor.name}</h4>
          <p className="text-xs text-luxury-gold font-semibold mt-0.5">{roleText}</p>
        </div>
      </div>

      {bioText && <p className="text-xs text-gray-300 leading-relaxed mb-4">{bioText}</p>}

      <div className="space-y-2 text-xs">
        {advisor.phone && (
          <a
            href={`tel:${advisor.phone.replace(/[^+\d]/g, "")}`}
            className="flex items-center gap-2.5 text-gray-200 hover:text-luxury-gold transition-colors"
          >
            <FaPhoneAlt aria-hidden="true" className="text-luxury-gold shrink-0" />
            <span>{advisor.phone}</span>
          </a>
        )}
        {advisor.email && (
          <a
            href={`mailto:${advisor.email}`}
            className="flex items-center gap-2.5 text-gray-200 hover:text-luxury-gold transition-colors break-all"
          >
            <FaEnvelope aria-hidden="true" className="text-luxury-gold shrink-0" />
            <span>{advisor.email}</span>
          </a>
        )}
        {waDigits && (
          <a
            href={`https://wa.me/${waDigits}?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600 hover:text-white font-bold transition-colors"
          >
            <FaWhatsapp aria-hidden="true" className="text-base" />
            <span>
              {isEn ? "WhatsApp Advisor" : isFr ? "Contacter via WhatsApp" : "WhatsApp Directo del Asesor"}
            </span>
          </a>
        )}
      </div>
    </div>
  );
}
