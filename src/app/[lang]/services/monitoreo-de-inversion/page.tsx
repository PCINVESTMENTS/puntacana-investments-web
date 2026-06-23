import { getDictionary } from "@/dictionaries/get-dictionary";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import { FaShieldAlt, FaArrowRight } from "react-icons/fa";
import InteractiveBlocks from "./InteractiveBlocks";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    
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

    // Static translations for the UI
    const t = {
        heroTitle: lang === 'en' ? "INDEPENDENT TECHNICAL MONITORING: YOUR EYES ON THE GROUND" : lang === 'fr' ? "SUIVI TECHNIQUE INDÉPENDANT : VOS YEUX SUR LE CHANTIER" : "MONITOREO TÉCNICO INDEPENDIENTE: TUS OJOS EN LA OBRA",
        heroSubtitle: lang === 'en' ? "Did you buy a pre-construction property in the Dominican Republic through another company and live abroad? Protect your assets and supervise the real progress of your construction with our expert team." : lang === 'fr' ? "Avez-vous acheté une propriété sur plan en République Dominicaine via une autre agence et vivez à l'étranger ? Protégez votre patrimoine et supervisez l'avancement réel de votre construction avec notre équipe d'experts." : "¿Compraste una propiedad en planos en República Dominicana a través de otra empresa y vives en el extranjero? Protege tu patrimonio y supervisa el avance real de tu construcción con nuestro equipo experto.",
        
        promiseText: lang === 'en'
            ? "Investing from afar is an excellent financial decision, but the lack of constant information and uncertainty about actual delivery times can cause concern. At Punta Cana Real Estate & Investments, we combine our solid track record in real estate brokerage with the technical and engineering expertise of our development arm, PCI CONSTRUCTION GROUP PUNTA CANA."
            : lang === 'fr'
            ? "Investir à distance est une excellente décision financière, mais le manque d'informations constantes et l'incertitude quant aux délais de livraison réels peuvent susciter des inquiétudes. Chez Punta Cana Real Estate & Investments, nous combinons notre solide expérience dans le courtage immobilier avec l'expertise technique et d'ingénierie de notre branche de développement, PCI CONSTRUCTION GROUP PUNTA CANA."
            : "Invertir a distancia es una excelente decisión financiera, pero la falta de información constante y la incertidumbre sobre los plazos de entrega reales pueden generar preocupación. En Punta Cana Real Estate & Investments, combinamos nuestra sólida trayectoria en la intermediación inmobiliaria con la experiencia técnica y de ingeniería de nuestro brazo desarrollador, PCI CONSTRUCTION GROUP PUNTA CANA.",

        highlightBox: lang === 'en'
            ? "This is a fully independent consulting, visual inspection, and reporting service. It is available to any international investor, regardless of which real estate agency or developer they originally purchased through."
            : lang === 'fr'
            ? "Il s'agit d'un service de conseil, d'inspection visuelle et de rapport totalement indépendant. Il est disponible pour tout investisseur international, quelle que soit l'agence immobilière ou le promoteur avec lequel il a effectué son achat initial."
            : "\"Este es un servicio de consultoría, inspección visual e informe totalmente independiente. Está disponible para cualquier inversionista internacional, sin importar con qué agencia inmobiliaria o constructora haya realizado su compra originaria.\"",

        clickToExpand: lang === 'en' ? "Click to expand" : lang === 'fr' ? "Cliquer pour agrandir" : "Haz clic para ampliar",

        ctaTitle: lang === 'en' ? "Request Quote and Monitoring Plan" : lang === 'fr' ? "Demander un Devis et un Plan de Suivi" : "Solicitud de Cotización y Plan de Monitoreo.",
        ctaText: lang === 'en' ? "Do you want to activate the monitoring plan for your property under construction or receive a personalized proposal for your project? Complete the form and an expert consultant will contact you in less than 24 hours." : lang === 'fr' ? "Souhaitez-vous activer le plan de suivi pour votre propriété en construction ou recevoir une proposition personnalisée pour votre projet ? Remplissez le formulaire et un consultant expert vous contactera dans moins de 24 heures." : "¿Deseas activar el plan de monitoreo para tu propiedad en construcción o recibir una propuesta personalizada para tu proyecto? Completa el formulario y un consultor experto se pondrá en contacto contigo en menos de 24 horas.",
        
        formName: lang === 'en' ? "Full Name" : lang === 'fr' ? "Nom Complet" : "Nombre Completo",
        formEmail: lang === 'en' ? "Email" : lang === 'fr' ? "E-mail" : "Correo Electrónico",
        formPhone: lang === 'en' ? "Phone/WhatsApp (with country code)" : lang === 'fr' ? "Téléphone/WhatsApp (avec indicatif)" : "Teléfono/WhatsApp (con código de país)",
        formCountry: lang === 'en' ? "Country of Residence" : lang === 'fr' ? "Pays de Résidence" : "País de Residencia",
        formProject: lang === 'en' ? "Project and Developer Name" : lang === 'fr' ? "Nom du Projet et Promoteur" : "Nombre del Proyecto y Constructora",
        formLocation: lang === 'en' ? "Location / Zone" : lang === 'fr' ? "Emplacement / Zone" : "Ubicación de la Propiedad",
        formInvestment: lang === 'en' ? "Investment Amount (USD)" : lang === 'fr' ? "Montant de l'Investissement (USD)" : "Monto de Inversión (USD)",
        formDate: lang === 'en' ? "Estimated Delivery Date" : lang === 'fr' ? "Date de Livraison Estimée" : "Fecha Estimada de Entrega",
        formButton: lang === 'en' ? "REQUEST MONITORING PLAN" : lang === 'fr' ? "DEMANDER LE PLAN DE SUIVI" : "SOLICITAR PLAN DE MONITOREO",

        disclaimer: lang === 'en' 
            ? "Informative Disclaimer (Non-Binding): This service has a strictly observational nature, providing independent visual data and informational support to the subscriber. Our firm acts autonomously and externally to the project's execution, thus assuming no legal, civil, criminal, or financial liability for delays in delivery schedules, hidden defects, or technical/structural construction defects, nor for any contractual breach by the developers or builders of the monitored project. This report does not replace the legal and technical supervision obligations that correspond exclusively to the construction company hired by the buyer."
            : lang === 'fr'
            ? "Avis de Non-responsabilité Informatif (Non Contraignant) : Ce service a un caractère strictement observationnel, de collecte visuelle et de soutien informatif indépendant pour l'abonné. Notre cabinet agit de manière autonome et externe à l'exécution des travaux, n'assumant par conséquent aucune responsabilité juridique, civile, pénale ou financière pour les retards dans les délais de livraison, les vices cachés, les défauts de construction techniques ou structurels, ni pour tout type de manquement contractuel de la part des promoteurs ou constructeurs du projet surveillé. Ce rapport ne remplace pas les obligations de supervision légale et technique qui incombent exclusivement à l'entreprise de construction engagée par l'acheteur."
            : "\"Nota de Exoneración de Responsabilidad Informativa (No Vinculante): Este servicio tiene un carácter estrictamente observacional, de recopilación gráfica y apoyo informativo independiente para el suscriptor. Nuestra firma actúa de manera autónoma y externa a la ejecución de la obra, por lo que no asume responsabilidad jurídica, civil, penal ni financiera por retrasos en los cronogramas de entrega, vicios ocultos, defectos de construcción técnicos o estructurales, ni por cualquier tipo de incumplimiento contractual por parte de los desarrolladores o constructoras del proyecto monitorizado. Este informe no sustituye las obligaciones de supervisión legal y técnica que corresponden exclusivamente a la empresa constructora contratada por el comprador.\""
    };

    // Blocks content with exactly the requested text. Wrapped in span/div so it can be passed to the client component.
    const blocks = [
        {
            title: lang === 'en' ? "Asset Protection & Permit Audit" : lang === 'fr' ? "Protection du Patrimoine & Audit des Permis" : "Bloque de Protección Patrimonial y Auditoría de Permisos",
            image: "/images/monitoring-audit.png",
            content: (
                <div className="space-y-4">
                    <p className="pl-6 border-l-2 border-luxury-gold text-white font-medium italic">
                        {lang === 'en' 
                            ? "Your peace of mind is priceless, and when it comes to your assets, your security is the only thing that matters. We take care of that." 
                            : lang === 'fr' 
                            ? "Votre tranquillité d'esprit n'a pas de prix, et lorsqu'il s'agit de votre patrimoine, votre sécurité est la seule chose qui compte. Nous nous en chargeons."
                            : "Tu tranquilidad no tiene precio y, cuando se trata de tu patrimonio, tu seguridad es lo único que importa. De eso nos encargamos nosotros."}
                    </p>
                    <p>
                        {lang === 'en'
                            ? "Unfortunately, today's real estate market is not without risks, and scams, delays, and hidden defects are a latent reality, especially for those investing from abroad. Being far away creates a barrier that prevents you from knowing the real situation on the ground or the solidity of the company behind the project you fell in love with. Worse still, many buyers are unaware of the real status of permits, construction licenses, environmental approvals, subdivisions, or the existence of final property titles."
                            : lang === 'fr'
                            ? "Malheureusement, le marché immobilier actuel n'est pas sans risques, et les arnaques, les retards et les vices cachés sont une réalité latente, en particulier pour ceux qui investissent depuis l'étranger. L'éloignement crée une barrière qui empêche de connaître la situation réelle sur le terrain ou la solidité de l'entreprise derrière le projet dont vous êtes tombé amoureux. Pire encore, de nombreux acheteurs ignorent le statut réel des permis, des licences de construction, des approbations environnementales, des subdivisions ou l'existence de titres de propriété définitifs."
                            : "Desafortunadamente, el mercado inmobiliario actual no está exento de riesgos, y las estafas, los retrasos y los vicios ocultos son una realidad latente, especialmente para quienes invierten desde el extranjero. Estar lejos genera una barrera que impide conocer la situación real en el terreno o la solidez de la empresa detrás de ese proyecto que te enamoró. Peor aún, muchos compradores desconocen el estatus real de la permisología, licencias de construcción, aprobaciones ambientales, deslindes o la existencia de los títulos de propiedad definitivos."}
                    </p>
                    <p>
                        {lang === 'en'
                            ? <span>For this reason, our clients hire us at every stage of their decision to protect their capital: <strong>before</strong> signing (to audit legal documentation, project permits, and the developer's track record), <strong>during</strong> pre-construction (to monitor that each phase progresses as agreed), and upon <strong>completion</strong> (to guarantee a flawless and legal handover of your asset). Your security is non-negotiable; we are your eyes, your technical support, and your legal guarantee here on the ground.</span>
                            : lang === 'fr'
                            ? <span>Pour cette raison, nos clients nous engagent à toutes les étapes de leur décision pour protéger leur capital : <strong>avant</strong> de signer (pour auditer la documentation légale, les permis du projet et l'historique du promoteur), <strong>pendant</strong> la pré-construction (pour vérifier que chaque phase avance comme convenu), et à <strong>l'achèvement</strong> (pour garantir une livraison impeccable et légale de votre actif). Votre sécurité n'est pas négociable ; nous sommes vos yeux, votre support technique et votre garantie légale ici sur le terrain.</span>
                            : <span>Por esta razón, nuestros clientes nos contratan en todas las etapas de su decisión para proteger su capital: <strong>antes</strong> de firmar (para auditar la documentación legal, permisos del proyecto y la trayectoria de la constructora), <strong>durante</strong> la pre-construcción en planos (para vigilar que cada fase avance según lo pactado) y al momento de estar <strong>terminada</strong> (para garantizar una entrega impecable y legal de tu activo). Tu seguridad no se negocia; nosotros somos tus ojos, tu respaldo técnico y tu garantía legal aquí en el terreno.</span>}
                    </p>
                </div>
            )
        },
        {
            title: lang === 'en' ? "Benefits (For Monthly Quota Payers)" : lang === 'fr' ? "Avantages (Pour les payeurs de mensualités)" : "Sección de Beneficios (Para clientes que pagan cuotas mensuales)",
            image: "/images/monitoring-benefits.png",
            content: (
                <div className="space-y-4">
                    <p>
                        {lang === 'en'
                            ? "¿Are you paying monthly quotas during construction? Don't pay blindly. If you are sending money month after month from abroad, our program acts as your progress control tool and absolute peace of mind, ensuring everything progresses strictly according to your signed contract and its established phases:"
                            : lang === 'fr'
                            ? "Payez-vous des mensualités pendant la construction ? Ne payez pas à l'aveugle. Si vous envoyez de l'argent mois après mois depuis l'étranger, notre programme agit comme votre outil de contrôle de l'avancement et vous offre une tranquillité d'esprit absolue, garantissant que tout avance strictement selon votre contrat signé et ses phases établies :"
                            : "¿Estás pagando cuotas mensuales durante la construcción? No pagues a ciegas. Si estás enviando dinero mes a mes desde el extranjero, nuestro programa actúa como tu herramienta de control de avance y absoluta tranquilidad, garantizando que todo avance estrictamente acorde a tu contrato firmado y sus fases establecidas:"}
                    </p>
                    <ul className="space-y-3 mt-4 list-disc pl-5">
                        {lang === 'en' ? (
                            <>
                                <li><strong>Invested Money, Built Money:</strong> Visually confirm that each monthly transfer translates into real progress on the ground.</li>
                                <li><strong>Milestone Validation:</strong> We physically audit that construction phases are met before you send your funds as requested by the developer.</li>
                                <li><strong>Risk Mitigation:</strong> Eliminate the anxiety and uncertainty caused by geographical distance.</li>
                                <li><strong>Early Correction:</strong> We detect visual anomalies in finishes before closing to claim in time.</li>
                                <li><strong>Final Handover Inspection:</strong> Technical review of installations, floors, and details before signing the official key handover.</li>
                            </>
                        ) : lang === 'fr' ? (
                            <>
                                <li><strong>Argent Investi, Argent Construit :</strong> Confirmez visuellement que chaque transfert mensuel se traduit par un avancement réel sur le terrain.</li>
                                <li><strong>Validation des Étapes :</strong> Nous auditons physiquement que les phases de construction sont respectées avant que vous n'envoyiez vos fonds à la demande du promoteur.</li>
                                <li><strong>Atténuation des Risques :</strong> Éliminez l'anxiété et l'incertitude causées par la distance géographique.</li>
                                <li><strong>Correction Précoce :</strong> Nous détectons les anomalies visuelles dans les finitions avant la clôture pour réclamer à temps.</li>
                                <li><strong>Inspection de Livraison Finale :</strong> Examen technique des installations, des sols et des détails avant de signer la remise officielle des clés.</li>
                            </>
                        ) : (
                            <>
                                <li><strong>Dinero Invertido, Dinero Construido:</strong> Confirma visualmente que cada transferencia mensual se traduce en avance real en el terreno.</li>
                                <li><strong>Validación de Hitos:</strong> Auditamos físicamente que se cumplan las fases de la obra antes de que envíes tus fondos por requerimiento de la constructora.</li>
                                <li><strong>Mitigación del Riesgo:</strong> Elimina la ansiedad y la incertidumbre que genera la distancia geográfica.</li>
                                <li><strong>Corrección Temprana:</strong> Detectamos anomalías visuales en acabados antes del cierre para reclamar a tiempo.</li>
                                <li><strong>Inspección de Entrega Final:</strong> Revisión técnica de instalaciones, pisos y detalles antes de firmar la recepción oficial de llaves.</li>
                            </>
                        )}
                    </ul>
                </div>
            )
        },
        {
            title: lang === 'en' ? "What Will You Receive?" : lang === 'fr' ? "Que Recevrez-vous ?" : "Sección del Entregable",
            image: "/images/monitoring-deliverables.png",
            content: (
                <div className="space-y-4">
                    <h4 className="text-xl font-bold text-luxury-gold">
                        {lang === 'en' ? "What Will You Receive in Your Periodic Progress Report?" : lang === 'fr' ? "Que Recevrez-vous dans Votre Rapport d'Évolution Périodique ?" : "¿Qué Recibirás en tu Informe de Evolución Periódico?"}
                    </h4>
                    <p>
                        {lang === 'en' 
                            ? "Premium graphic reports (HD photos/video), aerial drone shots, and professional contrast of the construction schedule." 
                            : lang === 'fr' 
                            ? "Rapports graphiques premium (photos/vidéos HD), prises de vue aériennes par drone et mise en contraste professionnelle du calendrier de construction."
                            : "Reportes gráficos premium (fotos/video HD), tomas aéreas con dron y contraste profesional del cronograma de obra."}
                    </p>
                </div>
            )
        },
        {
            title: lang === 'en' ? "An Exclusive Benefit" : lang === 'fr' ? "Un Avantage Exclusif" : "Un Beneficio Exclusivo",
            image: "/images/monitoring-closing.png",
            content: (
                <div className="space-y-4">
                    <h4 className="text-xl font-bold text-luxury-gold">
                        {lang === 'en' ? "An Exclusive Benefit for Our Portfolio Clients." : lang === 'fr' ? "Un Avantage Exclusif pour Nos Clients de Portefeuille." : "Un Beneficio Exclusivo para Nuestros Clientes de Portafolio."}
                    </h4>
                    <p>
                        {lang === 'en'
                            ? "¿Haven't purchased yet or thinking about your next investment? At Punta Cana Real Estate & Investments, we take care of our own. For all investors who acquire their off-plan or pre-construction properties directly through our firm, this technical monitoring, periodic reporting, and final delivery inspection service is COMPLETELY INCLUDED within our management, at no additional cost."
                            : lang === 'fr'
                            ? "Vous n'avez pas encore acheté ou vous pensez à votre prochain investissement ? Chez Punta Cana Real Estate & Investments, nous prenons soin des nôtres. Pour tous les investisseurs qui acquièrent leurs propriétés sur plan ou en pré-construction directement par l'intermédiaire de notre cabinet, ce service de suivi technique, de rapports périodiques et d'inspection de livraison finale est ENTIÈREMENT INCLUS dans notre gestion, sans aucun coût supplémentaire."
                            : "¿Aún no has comprado o estás pensando en tu próxima inversión? En Punta Cana Real Estate & Investments cuidamos a los nuestros. Para todos los inversionistas que adquieren sus propiedades en planos o pre-construcción directamente a través de nuestra firma, este servicio de monitoreo técnico, reportes periódicos e inspección final de entrega está COMPLETAMENTE INCLUIDO dentro de nuestra gestión, sin ningún costo adicional."}
                    </p>
                </div>
            )
        }
    ];

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
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-8 drop-shadow-2xl animate-fade-in-up uppercase">
                        {t.heroTitle}
                    </h1>
                    <p className="max-w-3xl mx-auto text-lg md:text-xl text-luxury-gold font-light leading-relaxed animate-fade-in-up animation-delay-400">
                        {t.heroSubtitle}
                    </p>
                </div>
            </section>

            {/* BLOCK 2: Respaldo y Cláusula Independiente */}
            <section className="py-20 relative overflow-hidden bg-[#0A0A0A] border-y border-white/5">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <p className="text-xl text-gray-300 font-light leading-relaxed mb-10">
                        {t.promiseText}
                    </p>
                    <div className="inline-block relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-luxury-gold to-yellow-600 blur opacity-25"></div>
                        <div className="relative bg-black border border-luxury-gold/50 p-8 shadow-2xl">
                            <FaShieldAlt className="text-luxury-gold text-4xl mx-auto mb-4" />
                            <p className="text-lg text-white font-serif italic">
                                {t.highlightBox}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* BLOCK 3 - 6: Interactive Modals */}
            <section className="py-12 bg-[#111111] relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <InteractiveBlocks blocks={blocks} translations={{clickToExpand: t.clickToExpand}} />
                </div>
            </section>

            {/* BLOCK 7: Formulario de Captación */}
            <section id="contact-monitoring" className="py-24 relative bg-[#0A0A0A]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-[#111111] p-8 md:p-12 border border-white/10 shadow-2xl relative">
                        {/* Gold accent line */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-luxury-gold"></div>
                        
                        <div className="text-center mb-10">
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                                {t.ctaTitle}
                            </h2>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                {t.ctaText}
                            </p>
                        </div>
                        
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t.formName}</label>
                                    <input type="text" className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-luxury-gold transition-colors" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t.formEmail}</label>
                                    <input type="email" className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-luxury-gold transition-colors" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t.formPhone}</label>
                                    <input type="tel" className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-luxury-gold transition-colors" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t.formCountry}</label>
                                    <input type="text" className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-luxury-gold transition-colors" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t.formProject}</label>
                                    <input type="text" className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-luxury-gold transition-colors" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t.formLocation}</label>
                                    <input type="text" className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-luxury-gold transition-colors" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t.formInvestment}</label>
                                    <input type="text" placeholder="Ej: $150,000 USD" className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-luxury-gold transition-colors" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t.formDate}</label>
                                    <input type="text" placeholder="Ej: Marzo 2025" className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-luxury-gold transition-colors" required />
                                </div>
                            </div>
                            <button type="button" className="w-full bg-luxury-gold text-black font-bold uppercase tracking-widest py-5 mt-6 hover:bg-white transition-colors">
                                {t.formButton}
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* BLOCK 8: Aviso Legal */}
            <section className="py-16 bg-black border-t border-white/5">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <p className="text-[11px] md:text-xs text-gray-600 uppercase tracking-wider max-w-4xl mx-auto leading-relaxed">
                        {t.disclaimer}
                    </p>
                </div>
            </section>

            <Footer dict={dict} lang={lang} />
        </main>
    );
}
