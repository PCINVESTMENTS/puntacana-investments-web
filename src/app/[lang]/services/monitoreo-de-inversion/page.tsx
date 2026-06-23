import { getDictionary } from "@/dictionaries/get-dictionary";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import { FaCheck, FaArrowRight, FaCamera, FaFileSignature, FaShieldAlt, FaHardHat } from "react-icons/fa";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang as "es" | "en" | "fr");
    
    const keywords = lang === 'en' 
        ? "Investment Monitoring Punta Cana, Property Audit Dominican Republic, Pre-construction inspection Punta Cana, Real Estate Progress Report DR, Punta Cana Luxury Construction Audit, Remote property monitoring, Drone construction updates Punta Cana, Safe Real Estate Investment, Buyer Protection Punta Cana, Independent property inspector DR"
        : lang === 'fr'
        ? "Suivi d'Investissement Punta Cana, Audit de Propriété République Dominicaine, Inspection pré-construction Punta Cana, Rapport d'avancement Immobilier RD, Audit de construction de luxe Punta Cana, Suivi de propriété à distance, Mises à jour de construction par drone Punta Cana, Investissement Immobilier Sûr, Protection de l'acheteur Punta Cana, Inspecteur de propriété indépendant RD"
        : "Monitoreo de Inversión Punta Cana, Auditoría de Propiedades República Dominicana, Inspección pre-construcción Punta Cana, Reporte de avance Inmobiliario RD, Auditoría de construcción de lujo Punta Cana, Monitoreo de propiedades a distancia, Actualizaciones de construcción con drones Punta Cana, Inversión Inmobiliaria Segura, Protección del comprador Punta Cana, Inspector de propiedades independiente RD";

    const title = lang === 'en' ? "Investment Monitoring | Punta Cana Real Estate Audit" :
                  lang === 'fr' ? "Suivi des Investissements | Audit Immobilier Punta Cana" :
                  "Monitoreo de Inversión | Auditoría Inmobiliaria Punta Cana";
                  
    const description = lang === 'en' ? "Secure your pre-construction investment in Punta Cana. Independent visual audits, technical inspections, and premium reports delivered directly to you." :
                        lang === 'fr' ? "Sécurisez votre investissement sur plan à Punta Cana. Audits visuels indépendants, inspections techniques et rapports premium livrés directement chez vous." :
                        "Asegure su inversión en planos en Punta Cana. Auditorías visuales independientes, inspecciones técnicas y reportes premium entregados directamente a usted.";

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.puntacanainvestmentsrd.com';
    const canonicalUrl = `${baseUrl}/${lang}/services/monitoreo-de-inversion`;

    return {
        title,
        description,
        keywords,
        robots: { index: true, follow: true },
        openGraph: {
            title,
            description,
            url: canonicalUrl,
            images: [{ url: `${baseUrl}/images/monitoring-hero.png`, width: 1200, height: 630, alt: title }],
            locale: lang === 'fr' ? 'fr_FR' : lang === 'es' ? 'es_DO' : 'en_US',
            siteName: 'Punta Cana Investments',
            type: 'website',
        },
        alternates: {
            canonical: canonicalUrl,
            languages: {
                en: `${baseUrl}/en/services/monitoreo-de-inversion`,
                es: `${baseUrl}/es/services/monitoreo-de-inversion`,
                fr: `${baseUrl}/fr/services/monitoreo-de-inversion`,
                'x-default': `${baseUrl}/en/services/monitoreo-de-inversion`
            }
        }
    };
}

export default async function MonitoreoInversionPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang as "es" | "en" | "fr");

    // Translations
    const t = {
        heroTitle: lang === 'en' ? "Investment Monitoring" : lang === 'fr' ? "Suivi des Investissements" : "Monitoreo de Inversión",
        heroSubtitle: lang === 'en' ? "ABSOLUTE PEACE OF MIND FROM AFAR" : lang === 'fr' ? "UNE TRANQUILLITÉ D'ESPRIT ABSOLUE À DISTANCE" : "ABSOLUTA PAZ MENTAL A LA DISTANCIA",
        heroText: lang === 'en' 
            ? "You bought in pre-construction. Now what? We are your eyes on the ground. Independent visual audits, technical inspections, and premium reports to ensure your investment becomes a reality exactly as promised."
            : lang === 'fr'
            ? "Vous avez acheté sur plan. Et maintenant ? Nous sommes vos yeux sur place. Audits visuels indépendants, inspections techniques et rapports premium pour garantir que votre investissement devienne réalité."
            : "Compró en pre-construcción. ¿Y ahora qué? Somos sus ojos en la obra. Auditorías visuales independientes, inspecciones técnicas y reportes premium para garantizar que su inversión se haga realidad exactamente como se la prometieron.",
        
        promiseTitle: lang === 'en' ? "Our Promise of Independence" : lang === 'fr' ? "Notre Promesse d'Indépendance" : "Nuestra Promesa de Independencia",
        promiseText: lang === 'en'
            ? "Unlike the agency or developer who sold you the property, our loyalty is 100% to YOU. We do not sugarcoat delays. We do not hide structural defects. We deliver the absolute, unfiltered truth of your construction progress."
            : lang === 'fr'
            ? "Contrairement à l'agence ou au promoteur qui vous a vendu le bien, notre loyauté est 100% envers VOUS. Nous ne cachons pas les retards. Nous ne dissimulons pas les défauts structurels. Nous vous livrons la vérité absolue sur l'avancement de votre chantier."
            : "A diferencia de la agencia o constructora que le vendió la propiedad, nuestra lealtad es 100% hacia USTED. No maquillamos retrasos. No ocultamos defectos estructurales. Entregamos la verdad absoluta y sin filtros del avance de su obra.",

        quote: lang === 'en' ? `"Trust is good, but verification and control are better."` : lang === 'fr' ? `"La confiance c'est bien, mais la vérification et le contrôle c'est mieux."` : `"La confianza es buena, pero la verificación y el control son mejores."`,

        deliverablesTitle: lang === 'en' ? "Premium Deliverables" : lang === 'fr' ? "Livrables Premium" : "Entregables Premium",
        deliverablesList: [
            {
                title: lang === 'en' ? "High-Resolution Drone Footage" : lang === 'fr' ? "Images Drone Haute Résolution" : "Tomas Aéreas con Drones",
                desc: lang === 'en' ? "See the entire project footprint and contextual progress from above." : lang === 'fr' ? "Voyez l'empreinte complète du projet et l'avancement contextuel vus d'en haut." : "Vea toda la huella del proyecto y el avance contextual desde las alturas."
            },
            {
                title: lang === 'en' ? "Technical Audit Reports" : lang === 'fr' ? "Rapports d'Audit Technique" : "Reportes de Auditoría Técnica",
                desc: lang === 'en' ? "Detailed analysis of materials, finishes, and structural milestones." : lang === 'fr' ? "Analyse détaillée des matériaux, des finitions et des étapes structurelles." : "Análisis detallado de materiales, terminaciones e hitos estructurales."
            },
            {
                title: lang === 'en' ? "Punch List & Delivery Support" : lang === 'fr' ? "Liste de Réserves et Assistance à la Livraison" : "Punch List y Acompañamiento de Entrega",
                desc: lang === 'en' ? "We inspect every detail before you sign the final reception papers." : lang === 'fr' ? "Nous inspectons chaque détail avant que vous ne signiez les papiers de réception." : "Inspeccionamos cada detalle antes de que firme la recepción definitiva."
            }
        ],

        exclusiveAdvantageTitle: lang === 'en' ? "The Exclusive Advantage" : lang === 'fr' ? "L'Avantage Exclusif" : "La Ventaja Exclusiva",
        exclusiveAdvantageText: lang === 'en' 
            ? "When you hire Punta Cana Investments for your Monitoring, you're not just hiring photographers. You're hiring a team of engineers, architects, and legal experts who understand exactly what to look for, ensuring your capital is protected."
            : lang === 'fr'
            ? "Lorsque vous engagez Punta Cana Investments pour votre suivi, vous n'engagez pas seulement des photographes. Vous engagez une équipe d'ingénieurs, d'architectes et d'experts juridiques qui savent exactement quoi vérifier pour protéger votre capital."
            : "Al contratar a Punta Cana Investments para su Monitoreo, no está contratando fotógrafos. Está contratando un equipo de ingenieros, arquitectos y expertos legales que saben exactamente qué revisar, asegurando que su patrimonio esté protegido.",

        ctaTitle: lang === 'en' ? "Secure Your Investment Today" : lang === 'fr' ? "Sécurisez Votre Investissement Aujourd'hui" : "Asegure su Inversión Hoy",
        ctaText: lang === 'en' ? "Request a personalized quote for your monitoring package." : lang === 'fr' ? "Demandez un devis personnalisé pour votre forfait de suivi." : "Solicite una cotización personalizada para su plan de monitoreo.",
        formName: lang === 'en' ? "Full Name" : lang === 'fr' ? "Nom Complet" : "Nombre Completo",
        formEmail: lang === 'en' ? "Email" : lang === 'fr' ? "E-mail" : "Correo Electrónico",
        formProject: lang === 'en' ? "Project Name" : lang === 'fr' ? "Nom du Projet" : "Nombre del Proyecto",
        formButton: lang === 'en' ? "Request Information" : lang === 'fr' ? "Demander des Informations" : "Solicitar Información",

        disclaimer: lang === 'en' 
            ? "Legal Disclaimer: This service provides independent technical and visual auditing. It does not replace the legal responsibility of the developer."
            : lang === 'fr'
            ? "Avis Légal : Ce service fournit un audit technique et visuel indépendant. Il ne remplace pas la responsabilité légale du promoteur."
            : "Aviso Legal: Este servicio provee auditoría técnica y visual independiente. No reemplaza la responsabilidad legal de la constructora o desarrolladora."
    };

    return (
        <main className="min-h-screen bg-[#0A0A0A] text-white selection:bg-luxury-gold selection:text-black">
            <Navbar dict={dict.nav} lang={lang} servicesList={dict.sections.services.items} propertyTypes={dict.properties.types} />

            {/* BLOCK 1: Hero Section */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden pt-20">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/monitoring-hero.png"
                        alt={t.heroTitle}
                        fill
                        sizes="100vw"
                        quality={90}
                        priority
                        className="object-cover object-center opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/80 via-transparent to-[#0A0A0A]"></div>
                </div>
                <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
                    <h2 className="text-luxury-gold uppercase tracking-[0.3em] font-bold text-xs md:text-sm mb-6 animate-fade-in-up">
                        {t.heroSubtitle}
                    </h2>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-8 drop-shadow-2xl animate-fade-in-up animation-delay-200">
                        {t.heroTitle}
                    </h1>
                    <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-300 font-light leading-relaxed animate-fade-in-up animation-delay-400">
                        {t.heroText}
                    </p>
                    <div className="mt-12 animate-fade-in-up animation-delay-600">
                        <Link href="#contact-monitoring" className="inline-flex items-center gap-3 bg-luxury-gold text-black px-8 py-4 uppercase text-sm font-bold tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                            {t.ctaTitle} <FaArrowRight />
                        </Link>
                    </div>
                </div>
            </section>

            {/* BLOCK 2: Respaldo / Promesa de Independencia */}
            <section className="py-24 relative overflow-hidden bg-[#0A0A0A] border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1 relative">
                            <div className="aspect-[4/5] relative rounded-sm overflow-hidden border border-luxury-gold/20 shadow-2xl shadow-luxury-gold/5">
                                <Image
                                    src="/images/monitoring-audit.png"
                                    alt={t.promiseTitle}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                            </div>
                            <div className="absolute -bottom-8 -right-8 bg-black border border-luxury-gold p-6 max-w-xs shadow-xl hidden md:block">
                                <FaShieldAlt className="text-luxury-gold text-4xl mb-4" />
                                <p className="text-sm text-gray-300 font-serif italic">{t.quote}</p>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2 space-y-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-luxury-gold/30 bg-luxury-gold/5 text-luxury-gold text-xs uppercase tracking-widest font-bold">
                                <FaHardHat /> Auditoría Imparcial
                            </div>
                            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight">
                                {t.promiseTitle}
                            </h2>
                            <p className="text-xl text-gray-400 font-light leading-relaxed">
                                {t.promiseText}
                            </p>
                            <ul className="space-y-4 pt-4">
                                {[
                                    lang === 'en' ? "Direct reporting to the investor" : lang === 'fr' ? "Rapport direct à l'investisseur" : "Reporte directo al inversionista",
                                    lang === 'en' ? "Zero conflicts of interest" : lang === 'fr' ? "Zéro conflit d'intérêts" : "Cero conflictos de interés",
                                    lang === 'en' ? "Strict technical evaluation" : lang === 'fr' ? "Évaluation technique stricte" : "Evaluación técnica estricta"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-300">
                                        <FaCheck className="text-luxury-gold flex-shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* BLOCK 3: Bloque de Protección Patrimonial (Deliverables) */}
            <section className="py-24 bg-[#111111] relative border-y border-luxury-gold/10">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#d4af37 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-luxury-gold mb-6">
                            {t.deliverablesTitle}
                        </h2>
                        <div className="w-24 h-1 bg-luxury-gold mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Box 1 */}
                        <div className="bg-black border border-white/10 p-8 hover:border-luxury-gold/50 transition-colors group">
                            <div className="h-48 relative mb-6 overflow-hidden rounded">
                                <Image src="/images/monitoring-deliverables.png" alt="Drone" fill className="object-cover transform group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors"></div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                                <FaCamera className="text-luxury-gold" /> {t.deliverablesList[0].title}
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{t.deliverablesList[0].desc}</p>
                        </div>
                        {/* Box 2 */}
                        <div className="bg-black border border-white/10 p-8 hover:border-luxury-gold/50 transition-colors group">
                            <div className="h-48 relative mb-6 overflow-hidden rounded">
                                <Image src="/images/monitoring-benefits.png" alt="Audit" fill className="object-cover transform group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors"></div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                                <FaFileSignature className="text-luxury-gold" /> {t.deliverablesList[1].title}
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{t.deliverablesList[1].desc}</p>
                        </div>
                        {/* Box 3 */}
                        <div className="bg-black border border-white/10 p-8 hover:border-luxury-gold/50 transition-colors group">
                            <div className="h-48 relative mb-6 overflow-hidden rounded">
                                <Image src="/images/monitoring-closing.png" alt="Closing" fill className="object-cover transform group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors"></div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                                <FaShieldAlt className="text-luxury-gold" /> {t.deliverablesList[2].title}
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{t.deliverablesList[2].desc}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* BLOCK 4: Sección Cerradora / Formulario de Captación */}
            <section id="contact-monitoring" className="py-24 relative bg-[#0A0A0A]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Text Content */}
                        <div>
                            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">
                                {t.exclusiveAdvantageTitle}
                            </h2>
                            <p className="text-gray-400 text-lg leading-relaxed mb-8">
                                {t.exclusiveAdvantageText}
                            </p>
                            <div className="p-6 border-l-2 border-luxury-gold bg-luxury-gold/5">
                                <h4 className="text-luxury-gold font-bold mb-2 uppercase tracking-wide text-sm">{t.ctaTitle}</h4>
                                <p className="text-gray-300 text-sm">{t.ctaText}</p>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="bg-[#111111] p-8 md:p-10 border border-white/10 shadow-2xl relative">
                            {/* Gold accent line */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-luxury-gold"></div>
                            
                            <form className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t.formName}</label>
                                    <input type="text" className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-luxury-gold transition-colors" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t.formEmail}</label>
                                    <input type="email" className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-luxury-gold transition-colors" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t.formProject}</label>
                                    <input type="text" className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-luxury-gold transition-colors" required />
                                </div>
                                <button type="button" className="w-full bg-luxury-gold text-black font-bold uppercase tracking-widest py-4 hover:bg-white transition-colors">
                                    {t.formButton}
                                </button>
                            </form>
                            <p className="text-center text-xs text-gray-600 mt-6 mt-4 italic">
                                {lang === 'en' ? "Your information is secure and confidential." : lang === 'fr' ? "Vos informations sont sécurisées et confidentielles." : "Su información es segura y confidencial."}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* BLOCK 5: Aviso Legal */}
            <section className="py-12 bg-black border-t border-white/5">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <p className="text-xs text-gray-600 uppercase tracking-widest max-w-3xl mx-auto">
                        {t.disclaimer}
                    </p>
                </div>
            </section>

            <Footer dict={dict} lang={lang} />
        </main>
    );
}
