import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { FaArrowLeft, FaCalendarAlt, FaUser, FaTag, FaFilePdf, FaDownload, FaExternalLinkAlt, FaEye } from "react-icons/fa";
import { BlogPost, BlogLinkedGuide } from "@/data/blog";
import { Property } from "@/data/properties";
import { urlFor } from "@/sanity/lib/image";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import ShareButtons from "@/components/property/ShareButtons";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getRentalPricingSummary } from "@/lib/propertyPricing";

interface BlogArticleViewProps {
  post: BlogPost;
  lang: "es" | "en" | "fr";
  dict: any;
  relatedPropertiesList: Property[];
  isPreviewMode?: boolean;
}

const getVal = (obj: any, key: "es" | "en" | "fr"): string => {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  return obj[key] || obj["en"] || obj["es"] || "";
};

const formatBytes = (bytes?: number) => {
  if (!bytes || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const LANG_LABEL: Record<"es" | "en" | "fr", { es: string; en: string; fr: string }> = {
  es: { es: "Español (ES)", en: "Spanish (ES)", fr: "Espagnol (ES)" },
  en: { es: "Inglés (EN)", en: "English (EN)", fr: "Anglais (EN)" },
  fr: { es: "Francés (FR)", en: "French (FR)", fr: "Français (FR)" },
};

function GuideDownloadBox({ guides, lang }: { guides: BlogLinkedGuide[]; lang: "es" | "en" | "fr" }) {
  if (!guides || guides.length === 0) return null;

  const heading =
    lang === "en"
      ? "Downloadable PDF Investment Guide"
      : lang === "fr"
      ? "Guide d'Investissement PDF Téléchargeable"
      : "Guía de Inversión Descargable en PDF";

  const downloadLabel =
    lang === "en" ? "Download PDF" : lang === "fr" ? "Télécharger le PDF" : "Descargar PDF";
  const openLabel =
    lang === "en" ? "Open PDF" : lang === "fr" ? "Ouvrir le PDF" : "Abrir PDF";

  return (
    <section
      data-blog-guides-section="true"
      className="my-14 p-6 md:p-8 bg-gradient-to-br from-[#1b170b] via-dark-gray to-black border border-luxury-gold/40 rounded-sm shadow-2xl"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-sm bg-luxury-gold text-black">
          <FaFilePdf className="text-xl" aria-hidden="true" />
        </span>
        <div>
          <span className="text-luxury-gold text-xs font-bold uppercase tracking-[0.2em] block">
            {lang === "en" ? "Exclusive Resource" : lang === "fr" ? "Ressource Exclusive" : "Recurso Exclusivo"}
          </span>
          <h3 className="text-xl md:text-2xl font-serif font-bold text-white">{heading}</h3>
        </div>
      </div>

      <div className="space-y-4">
        {guides.map((guide) => {
          const available = (guide.available_languages || []).filter((l) => Boolean(guide.files_by_lang?.[l]));
          const preferredLang = available.includes(lang)
            ? lang
            : available.includes(guide.language)
            ? guide.language
            : available[0] || "es";
          const primaryFile = guide.files_by_lang?.[preferredLang];
          const gTitle = getVal(guide.title, lang) || guide.slug;
          const gDesc = getVal(guide.description, lang);

          return (
            <div
              key={guide.id}
              data-guide-card={guide.id}
              className="p-5 bg-black/60 border border-white/10 rounded-sm flex flex-col gap-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <h4 className="text-lg font-serif font-bold text-white">{gTitle}</h4>
                  {gDesc && <p className="text-sm text-gray-300 mt-1 leading-relaxed">{gDesc}</p>}
                  {primaryFile && (
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                      <span className="text-luxury-gold font-semibold">
                        {lang === "en" ? "Language:" : lang === "fr" ? "Langue :" : "Idioma:"}{" "}
                        {LANG_LABEL[preferredLang]?.[lang] || preferredLang.toUpperCase()}
                      </span>
                      <span>•</span>
                      <span>{primaryFile.original_filename}</span>
                      {primaryFile.size_bytes > 0 && (
                        <>
                          <span>•</span>
                          <span>{formatBytes(primaryFile.size_bytes)}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {primaryFile && (
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <a
                      href={primaryFile.download_url}
                      download={primaryFile.original_filename}
                      data-guide-download-btn={guide.id}
                      data-guide-lang={preferredLang}
                      className="inline-flex items-center gap-2 bg-luxury-gold hover:bg-white text-black px-5 py-3 text-xs font-bold uppercase tracking-widest transition-colors"
                    >
                      <FaDownload aria-hidden="true" />
                      <span>
                        {downloadLabel} ({preferredLang.toUpperCase()})
                      </span>
                    </a>
                    <a
                      href={primaryFile.view_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-guide-open-btn={guide.id}
                      className="inline-flex items-center gap-2 border border-luxury-gold/60 text-luxury-gold hover:bg-luxury-gold hover:text-black px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors"
                    >
                      <FaExternalLinkAlt aria-hidden="true" className="text-[10px]" />
                      <span>{openLabel}</span>
                    </a>
                  </div>
                )}
              </div>

              {available.length > 1 && (
                <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-gray-400">
                    {lang === "en"
                      ? "Available versions:"
                      : lang === "fr"
                      ? "Versions disponibles :"
                      : "Versiones disponibles:"}
                  </span>
                  {available.map((vl) => {
                    const vf = guide.files_by_lang?.[vl];
                    if (!vf) return null;
                    return (
                      <a
                        key={vl}
                        href={vf.download_url}
                        download={vf.original_filename}
                        data-guide-variant-download={`${guide.id}-${vl}`}
                        className={`px-2.5 py-1 border rounded-sm font-semibold transition-colors ${
                          vl === preferredLang
                            ? "border-luxury-gold bg-luxury-gold/15 text-luxury-gold"
                            : "border-white/15 text-gray-300 hover:border-luxury-gold hover:text-luxury-gold"
                        }`}
                      >
                        PDF {vl.toUpperCase()}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function BlogArticleView({
  post,
  lang,
  dict,
  relatedPropertiesList,
  isPreviewMode = false,
}: BlogArticleViewProps) {
  const titleText = getVal(post.title, lang);
  const excerptText = getVal(post.excerpt, lang);
  const categoryText = getVal(post.category, lang);
  const dateText = getVal(post.date, lang);
  const coverAltText = getVal(post.coverImageAlt, lang) || titleText;
  const authorRoleText = getVal(post.authorRole, lang);
  const authorBioText = getVal(post.authorBio, lang);
  const isLocalCover = typeof post.mainImage === "string" && post.mainImage.startsWith("http://127.0.0.1:8110");
  const isLocalAuthorImg = typeof post.authorImage === "string" && post.authorImage.startsWith("http://127.0.0.1:8110");

  const ptComponents: PortableTextComponents = {
    types: {
      markdownText: ({ value }: any) => (
        <div className="text-gray-300 leading-8 text-lg text-justify mb-6 space-y-4">
          <ReactMarkdown
            components={{
              strong: ({ node, ...props }: any) => <strong className="text-luxury-gold font-bold" {...props} />,
              a: ({ node, ...props }: any) => (
                <a
                  className="text-luxury-gold underline hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                />
              ),
              ul: ({ node, ...props }: any) => <ul className="list-disc pl-6 space-y-2" {...props} />,
              li: ({ node, ...props }: any) => <li {...props} />,
            }}
          >
            {value.text}
          </ReactMarkdown>
        </div>
      ),
      image: ({ value }: any) => {
        if (!value?.asset?._ref) return null;
        return (
          <figure className="my-12">
            <div className="relative aspect-video w-full overflow-hidden rounded-sm shadow-2xl border border-white/10 group">
              <Image
                src={urlFor(value).url()}
                alt={value.alt || titleText}
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </figure>
        );
      },
      legacyImage: ({ value }: any) => {
        if (!value?.url) return null;
        const isLocalInline = typeof value.url === "string" && value.url.startsWith("http://127.0.0.1:8110");
        return (
          <figure className="my-12">
            <div className="relative aspect-video w-full overflow-hidden rounded-sm shadow-2xl border border-white/10 group">
              <Image
                src={value.url}
                alt={value.caption || titleText}
                fill
                unoptimized={isLocalInline}
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            {value.caption && (
              <figcaption className="mt-4 text-center text-sm text-gray-400 italic">{value.caption}</figcaption>
            )}
          </figure>
        );
      },
    },
    block: {
      h1: ({ children }) => (
        <h1 className="text-4xl md:text-5xl font-serif font-bold bg-gradient-to-r from-luxury-gold via-yellow-200 to-luxury-gold bg-clip-text text-transparent pt-8 mb-4">
          {children}
        </h1>
      ),
      h2: ({ children }) => (
        <h2 className="text-3xl md:text-4xl font-serif font-bold bg-gradient-to-r from-luxury-gold via-yellow-200 to-luxury-gold bg-clip-text text-transparent pt-8 mb-4">
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className="text-2xl md:text-3xl font-serif font-bold bg-gradient-to-r from-luxury-gold via-yellow-200 to-luxury-gold bg-clip-text text-transparent pt-6 mb-3">
          {children}
        </h3>
      ),
      h4: ({ children }) => (
        <h4 className="text-xl md:text-2xl font-serif font-bold bg-gradient-to-r from-luxury-gold via-yellow-200 to-luxury-gold bg-clip-text text-transparent pt-4 mb-2">
          {children}
        </h4>
      ),
      normal: ({ children }) => (
        <p className="text-gray-300 leading-8 text-lg text-justify whitespace-pre-line mb-6">{children}</p>
      ),
      blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-luxury-gold pl-4 italic text-gray-400 my-6">{children}</blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">{children}</ul>,
      number: ({ children }) => <ol className="list-decimal pl-6 mb-6 text-gray-300 space-y-2">{children}</ol>,
    },
  };

  const contentObj = post.content as any;
  const contentBlocks =
    (Array.isArray(contentObj?.[lang]) && contentObj[lang].length > 0 ? contentObj[lang] : null) ||
    (Array.isArray(contentObj?.en) && contentObj.en.length > 0 ? contentObj.en : null) ||
    (Array.isArray(contentObj?.es) && contentObj.es.length > 0 ? contentObj.es : null) ||
    [];

  const siteUrl = "https://www.puntacanainvestmentsrd.com";
  const linkedGuides = post.linkedGuides || [];

  return (
    <main className="min-h-screen bg-black text-white selection:bg-luxury-gold selection:text-black">
      <Navbar
        dict={dict.nav}
        lang={lang}
        servicesList={dict.sections.services.items}
        propertyTypes={dict.properties.types}
      />

      {isPreviewMode && (
        <div
          data-blog-preview-banner="true"
          className="mt-20 bg-amber-500/20 border-y border-amber-400/60 text-amber-200 px-4 py-3"
        >
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs md:text-sm">
            <div className="flex items-center gap-2 font-semibold">
              <FaEye className="text-amber-300 shrink-0" />
              <span>
                {lang === "en"
                  ? "LOCAL PREVIEW MODE — Review cover, ALT text, translations, linked properties and PDF guide before publishing."
                  : lang === "fr"
                  ? "MODE APERÇU LOCAL — Vérifiez la couverture, le texte ALT, les traductions, les propriétés liées et le guide PDF avant publication."
                  : "MODO VISTA PREVIA LOCAL — Revisa portada, texto ALT, traducciones ES/EN/FR, propiedades vinculadas y guía PDF antes de publicar."}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {(["es", "en", "fr"] as const).map((l) => (
                <Link
                  key={l}
                  href={`/${l}/blog/preview/${post.slug}`}
                  className={`px-2.5 py-1 rounded-sm text-xs font-bold uppercase ${
                    l === lang ? "bg-luxury-gold text-black" : "bg-black/60 text-white hover:text-luxury-gold"
                  }`}
                >
                  {l.toUpperCase()}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section with Main Image */}
      <div className={`relative h-[60vh] w-full ${isPreviewMode ? "mt-0" : "mt-20"}`}>
        <Image
          src={post.mainImage || "/images/og-home-luxury.webp"}
          alt={coverAltText}
          fill
          unoptimized={isLocalCover}
          sizes="(max-width: 768px) 100vw, 100vw"
          quality={65}
          className="object-cover"
          priority={true}
          fetchPriority="high"
          decoding="sync"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <ScrollReveal priority={true}>
              <div className="inline-flex items-center gap-2 bg-luxury-gold/90 text-black px-4 py-1.5 rounded-sm text-xs font-bold uppercase tracking-widest mb-6">
                <FaTag size={10} />
                {categoryText}
              </div>
            </ScrollReveal>

            <ScrollReveal priority={true}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight">
                {titleText}
              </h1>
            </ScrollReveal>

            <ScrollReveal priority={true}>
              <div className="flex flex-wrap items-center justify-center gap-6 text-gray-200 text-sm font-medium tracking-wide">
                <span className="flex items-center gap-2">
                  <FaCalendarAlt className="text-luxury-gold" />
                  {dateText}
                </span>
                <span className="flex items-center gap-2">
                  <FaUser className="text-luxury-gold" />
                  {post.author}
                </span>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        {/* Back Link */}
        <Link
          href={`/${lang}/blog`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-luxury-gold transition-colors mb-12 uppercase text-xs font-bold tracking-widest group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          {dict.blog.back}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <article className="lg:col-span-8">
            {/* Excerpt */}
            {excerptText && (
              <div className="text-xl md:text-2xl text-white font-serif italic mb-10 leading-relaxed opacity-90 border-l-4 border-luxury-gold pl-6">
                &ldquo;{excerptText}&rdquo;
              </div>
            )}

            <div className="blog-content" data-blog-body-lang={lang}>
              <PortableText value={contentBlocks} components={ptComponents} />
            </div>

            {/* Linked PDF Guides Box */}
            <GuideDownloadBox guides={linkedGuides} lang={lang} />

            {/* Social Share */}
            <div className="mt-16 pt-10 border-t border-white/10">
              <h3 className="text-white text-lg font-bold mb-6">{dict.blog.share}</h3>
              <ShareButtons title={titleText} url={`${siteUrl}/${lang}/blog/${post.slug}`} lang={lang} />
            </div>

            {/* Related Properties (live local catalog) */}
            {relatedPropertiesList.length > 0 && (
              <div className="mt-20" data-blog-related-properties="true">
                <h3 className="text-3xl font-serif font-bold text-white mb-8 border-b border-white/10 pb-4">
                  {dict.blog.related}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {relatedPropertiesList.map((property) => {
                    const pSlug =
                      typeof property.slug === "object" && property.slug !== null
                        ? (property.slug as any).current
                        : property.slug;
                    const pTitle =
                      lang === "en"
                        ? (property as any).titleEn || property.title
                        : lang === "fr"
                        ? (property as any).titleFr || (property as any).titleEn || property.title
                        : (property as any).titleEs || property.title;
                    const isLocalPropImg =
                      typeof property.image === "string" && property.image.startsWith("http://127.0.0.1:8110");
                    const rentalSummary = getRentalPricingSummary(property as any, lang);
                    const priceLabel = rentalSummary.cardPriceSecondary
                      ? `${rentalSummary.cardPricePrimary} · ${rentalSummary.cardPriceSecondary}`
                      : rentalSummary.cardPricePrimary;

                    return (
                      <Link
                        key={pSlug || property.id}
                        href={`/${lang}/properties/${pSlug}`}
                        className="group bg-dark-gray border border-white/5 rounded-sm overflow-hidden hover:border-luxury-gold/30 transition-all duration-300 block"
                      >
                        <div className="relative h-56 overflow-hidden">
                          <Image
                            src={property.image || "/images/og-home-luxury.webp"}
                            alt={pTitle}
                            fill
                            unoptimized={isLocalPropImg}
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-sm text-white px-3 py-1 text-xs font-bold uppercase tracking-wider border border-white/10">
                            {property.locationLabel}
                          </div>
                          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/70 to-transparent p-5 pt-10">
                            <p className="text-luxury-gold text-lg font-bold">{priceLabel}</p>
                          </div>
                        </div>
                        <div className="p-5">
                          <h4 className="text-lg text-white font-serif font-bold mb-2 group-hover:text-luxury-gold transition-colors">
                            {pTitle}
                          </h4>
                          <div className="flex gap-4 text-gray-400 text-xs uppercase tracking-wider font-medium">
                            {property.beds > 0 && (
                              <span className="flex items-center gap-1">
                                <span className="text-luxury-gold">•</span> {property.beds}{" "}
                                {lang === "en" ? "Beds" : lang === "fr" ? "Ch." : "Hab."}
                              </span>
                            )}
                            {property.baths > 0 && (
                              <span className="flex items-center gap-1">
                                <span className="text-luxury-gold">•</span> {property.baths}{" "}
                                {lang === "en" ? "Baths" : lang === "fr" ? "Sdb" : "Baños"}
                              </span>
                            )}
                            {property.area > 0 && (
                              <span className="flex items-center gap-1">
                                <span className="text-luxury-gold">•</span> {property.area} m²
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar / Author + Quick Guide Access */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="bg-dark-gray p-8 border border-white/5 rounded-sm sticky top-32 space-y-6">
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-2 border-luxury-gold p-1">
                  <div className="relative w-full h-full rounded-full overflow-hidden">
                    <Image
                      src={post.authorImage || "/images/ceo-final.jpg"}
                      alt={post.author}
                      fill
                      unoptimized={isLocalAuthorImg}
                      className="object-cover"
                    />
                  </div>
                </div>
                <h4 className="text-white font-serif font-bold text-xl mb-1">{post.author}</h4>
                <p className="text-luxury-gold text-xs font-bold uppercase tracking-widest mb-4">{authorRoleText}</p>
                {authorBioText && <p className="text-gray-400 text-sm leading-relaxed mb-6">{authorBioText}</p>}
                <Link
                  href={`/${lang}#contact`}
                  className="block w-full text-center bg-white/5 hover:bg-luxury-gold hover:text-black py-3 px-4 text-xs font-bold uppercase tracking-widest transition-colors"
                >
                  {dict.blog.contactAuthor}
                </Link>
              </div>

              {linkedGuides.length > 0 && (
                <div className="pt-6 border-t border-white/10">
                  <p className="text-luxury-gold text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                    <FaFilePdf aria-hidden="true" />
                    {lang === "en" ? "Included PDF Guide" : lang === "fr" ? "Guide PDF Inclus" : "Guía PDF Incluida"}
                  </p>
                  {linkedGuides.map((g) => {
                    const avail = (g.available_languages || []).filter((l) => Boolean(g.files_by_lang?.[l]));
                    const pref = avail.includes(lang) ? lang : avail[0] || "es";
                    const f = g.files_by_lang?.[pref];
                    if (!f) return null;
                    return (
                      <a
                        key={g.id}
                        href={f.download_url}
                        download={f.original_filename}
                        className="mt-2 flex items-center justify-center gap-2 w-full bg-luxury-gold hover:bg-white text-black py-3 px-4 text-xs font-bold uppercase tracking-widest transition-colors"
                      >
                        <FaDownload aria-hidden="true" />
                        <span>
                          {lang === "en"
                            ? `Download PDF (${pref.toUpperCase()})`
                            : lang === "fr"
                            ? `Télécharger PDF (${pref.toUpperCase()})`
                            : `Descargar PDF (${pref.toUpperCase()})`}
                        </span>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      <Footer dict={dict} lang={lang} />

      {/* Structured Data (JSON-LD) for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: titleText,
            image: [post.mainImage || `${siteUrl}/images/og-home-luxury.webp`],
            datePublished: post.publishedAt || new Date().toISOString(),
            inLanguage: lang,
            author: [
              {
                "@type": "Person",
                name: post.author,
                url: `${siteUrl}/${lang}#about`,
              },
            ],
            publisher: {
              "@type": "Organization",
              name: "Punta Cana Investments",
              logo: {
                "@type": "ImageObject",
                url: `${siteUrl}/images/og-home-luxury.webp`,
              },
            },
            description: getVal(post.seo?.description, lang) || excerptText,
          }),
        }}
      />
    </main>
  );
}
