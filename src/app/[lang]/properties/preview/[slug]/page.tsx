/**
 * Local Sandbox Draft & Pre-Publication Real Web Preview
 * Renders EITHER the exact real Catalog Card (?view=card) OR the exact real Full Property Page (?view=detail)
 * using the actual Punta Cana Investments website components & CSS before publishing.
 * Active ONLY when LOCAL_PROPERTIES_SANDBOX_FILE / URL is set.
 */
import { notFound } from "next/navigation";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { FaBed, FaBath, FaRulerCombined, FaCheck, FaWhatsapp } from "react-icons/fa";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import PropertyListings from "@/components/home/PropertyListings";
import PropertyGallery from "@/components/property/PropertyGallery";
import PropertyCommercialDetails from "@/components/property/PropertyCommercialDetails";
import ContactForm from "@/components/contact/ContactForm";
import { getDictionary } from "@/dictionaries/get-dictionary";
import { fetchLocalSandboxDraftPreview, isLocalSandboxEnabled } from "@/lib/localSandbox";
import type { Property } from "@/data/properties";

export const dynamic = "force-dynamic";

export default async function LocalDraftPreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: "es" | "en" | "fr"; slug: string }>;
  searchParams: Promise<{ view?: string }>;
}) {
  if (!isLocalSandboxEnabled()) {
    notFound();
  }

  const { lang, slug } = await params;
  const { view } = await searchParams;
  const dict = await getDictionary(lang);
  const property = await fetchLocalSandboxDraftPreview(slug);

  if (!property) {
    notFound();
  }

  const formatPrice = (price: number, currencyCode = "USD") => {
    if (!price || price === 0) {
      return lang === "en" ? "Price on Request" : lang === "fr" ? "Prix sur Demande" : "Precio a Consultar";
    }
    const safeCurrency = ["USD", "EUR", "DOP"].includes(currencyCode) ? currencyCode : "USD";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: safeCurrency,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const bannerText = property.is_draft_preview
    ? `VISTA PREVIA LOCAL DE BORRADOR · Código interno: ${property.internal_code || "Pendiente"} · Posición al publicar: #${property.catalog_position || 40} · Aún NO publicada en la web`
    : `VISTA PREVIA LOCAL · Código interno: ${property.internal_code || "—"} · Posición catálogo: #${property.catalog_position || "—"}`;

  // MODE 1: REAL CATALOG CARD PREVIEW
  if (view === "card") {
    return (
      <main className="min-h-screen bg-primary-black text-white">
        <div className="bg-amber-500/20 border-b border-amber-400/50 text-amber-200 px-4 py-2 text-xs text-center font-semibold">
          {bannerText} (Vista: Tarjeta del Catálogo)
        </div>
        <div className="max-w-4xl mx-auto py-6 px-4">
          <PropertyListings
            dict={dict.properties}
            lang={lang}
            locations={dict.sections.locations.items}
            featured={true}
            featuredLimit={1}
            featuredCategory={property.status === "rent" ? "rent" : "sale"}
            sectionTitle={
              lang === "en"
                ? "Catalog Card Preview"
                : lang === "fr"
                ? "Aperçu de la Carte Catalogue"
                : "Vista Previa — Tarjeta en el Catálogo Real"
            }
            initialData={[property as unknown as Property]}
          />
        </div>
      </main>
    );
  }

  // MODE 2: REAL FULL PROPERTY PAGE PREVIEW
  const galleryImages =
    property.gallery && property.gallery.length > 0
      ? property.gallery
      : property.image
      ? [property.image]
      : [];
  const mainImage = property.image || galleryImages[0] || "/images/luxury-villa-frame-hero.webp";
  const desc =
    property.description?.[lang] ||
    property.description?.es ||
    property.description?.en ||
    "";
  const feats =
    (property.features?.[lang] && property.features[lang].length > 0
      ? property.features[lang]
      : property.features?.es) || [];

  return (
    <main className="min-h-screen bg-primary-black text-white">
      <div className="sticky top-0 z-[100] bg-amber-500 text-black px-4 py-2 text-xs text-center font-bold shadow-lg">
        {bannerText}
      </div>

      <Navbar dict={dict.nav} lang={lang} />

      {/* Hero matching real [slug]/page.tsx */}
      <div className="relative h-[55vh] md:h-[65vh]">
        <Image
          src={mainImage}
          alt={property.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-black via-black/40 to-black/30" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-block px-3 py-1 bg-luxury-gold text-black text-xs font-bold uppercase tracking-widest">
              {property.status === "rent" ? "ALQUILER" : "VENTA"}
            </span>
            {(() => {
              const stage = (property as unknown as { commercialStage?: string }).commercialStage || "";
              const stageMap: Record<string, { label: string; cls: string }> = {
                off_plan: { label: "EN PLANOS", cls: "bg-teal-700 text-white" },
                pre_launch: { label: "PRE-LANZAMIENTO", cls: "bg-emerald-700 text-white" },
                pre_construction: { label: "PRE-CONSTRUCCIÓN", cls: "bg-emerald-700 text-white" },
                under_construction: { label: "EN CONSTRUCCIÓN", cls: "bg-amber-700 text-white" },
                resale: { label: "REVENTA", cls: "bg-indigo-700 text-white" },
                turnkey: { label: "LLAVE EN MANO", cls: "bg-sky-700 text-white" },
              };
              const derived =
                stage && stageMap[stage]
                  ? stageMap[stage]
                  : property.isResale
                  ? stageMap.resale
                  : property.preConstruction
                  ? stageMap.pre_construction
                  : property.preLaunch
                  ? stageMap.pre_launch
                  : null;
              if (!derived) return null;
              const pct = (property as unknown as { completionPercent?: number | string }).completionPercent;
              return (
                <span className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-widest ${derived.cls}`}>
                  {derived.label}
                  {pct !== undefined && pct !== null && pct !== "" && (stage === "pre_construction" || stage === "under_construction")
                    ? ` · ${pct}% obra`
                    : ""}
                </span>
              );
            })()}
            {(() => {
              const inv = String((property as any).inventoryStatus || "Disponible");
              if (!inv || inv === "Disponible") return null;
              const cls =
                inv === "Vendido"
                  ? "bg-rose-700 text-white"
                  : inv === "Reservado"
                  ? "bg-amber-500 text-black"
                  : "bg-sky-700 text-white";
              return (
                <span className={`inline-block px-3 py-1 text-xs font-extrabold uppercase tracking-widest ${cls}`}>
                  {inv}
                </span>
              );
            })()}
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight">
                {property.title}
              </h1>
              <p className="text-gray-300 mt-2 text-base md:text-lg">
                {property.locationLabel || "Punta Cana"}
              </p>
            </div>
            <div className="text-2xl md:text-4xl font-bold text-luxury-gold">
              {formatPrice(property.price, (property as unknown as { currency?: string }).currency || "USD")}
              {property.status === "rent" && property.price > 0 ? (
                <span className="text-sm text-gray-300 font-normal"> /mes</span>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid matching real [slug]/page.tsx */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {/* Specs Strip */}
            <div className="grid grid-cols-3 gap-4 bg-dark-gray p-6 border border-white/10 rounded-lg text-center">
              {property.type !== "land" && property.type !== "commercial" && (
                <div>
                  <FaBed className="mx-auto text-luxury-gold text-xl mb-2" />
                  <div className="text-xl font-bold text-white">{property.beds || 0}</div>
                  <div className="text-xs uppercase text-gray-400">Habitaciones</div>
                </div>
              )}
              {property.type !== "land" && (
                <div>
                  <FaBath className="mx-auto text-luxury-gold text-xl mb-2" />
                  <div className="text-xl font-bold text-white">{property.baths || 0}</div>
                  <div className="text-xs uppercase text-gray-400">Baños</div>
                </div>
              )}
              <div className={property.type === "land" ? "col-span-3" : property.type === "commercial" ? "col-span-2" : ""}>
                <FaRulerCombined className="mx-auto text-luxury-gold text-xl mb-2" />
                <div className="text-xl font-bold text-white">
                  {property.area ? `${property.area} m²` : "—"}
                </div>
                <div className="text-xs uppercase text-gray-400">
                  {property.type === "land" ? "Superficie del Terreno" : "Área Construida"}
                </div>
              </div>
            </div>

            {/* Real Gallery Component */}
            {galleryImages.length > 0 && (
              <PropertyGallery
                images={galleryImages}
                alts={((property as any)?.seo?.gallery_meta || []).map((m: any) =>
                  lang === "en" ? m?.alt_en || m?.alt_es || "" : lang === "fr" ? m?.alt_fr || m?.alt_es || "" : m?.alt_es || ""
                )}
              />
            )}

            {/* Description */}
            <div className="prose prose-invert max-w-none">
              <h2 className="text-2xl font-serif text-luxury-gold mb-4">Descripción</h2>
              {desc ? (
                <ReactMarkdown>{desc}</ReactMarkdown>
              ) : (
                <p className="text-gray-400 italic">Sin descripción todavía.</p>
              )}
            </div>

            {/* Payment Plan & Confirmed Technical Specs */}
            <PropertyCommercialDetails property={property as any} lang={lang} />

            {/* Features */}
            {feats.length > 0 && (
              <div>
                <h2 className="text-2xl font-serif text-luxury-gold mb-4">Características y Amenidades</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {feats.map((feat: string, idx: number) => (
                    <div key={`${feat}-${idx}`} className="flex items-center gap-3 text-gray-200">
                      <FaCheck className="text-luxury-gold shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-dark-gray p-8 border-t-4 border-luxury-gold shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-2">{dict.contact.title}</h3>
              <p className="text-gray-400 text-sm mb-6">{dict.contact.subtitle}</p>
              <ContactForm
                dict={dict.contact.form}
                subject={`Vista previa: ${property.title}`}
                lang={lang}
              />
              <div className="mt-6 text-center pt-6 border-t border-white/10">
                <span className="inline-flex items-center gap-2 text-green-500 font-bold text-base">
                  <FaWhatsapp className="text-xl" /> Chat Directo (Vista Previa)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer dict={dict} lang={lang} />
    </main>
  );
}
