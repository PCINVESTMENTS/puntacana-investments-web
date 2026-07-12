import { getDictionary } from "@/dictionaries/get-dictionary";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import { FaShieldAlt, FaArrowRight } from "react-icons/fa";
import InteractiveBlocks from "./InteractiveBlocks";
import MonitoringForm from "@/components/forms/MonitoringForm";
import PropertyListings from "@/components/home/PropertyListings";
import { properties as localProperties } from "@/data/properties";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params;
    
    const keywords = lang === 'en' 
        ? "Punta Cana property inspection services, Independent construction monitoring Dominican Republic, Remote real estate auditing Punta Cana, Pre-handover property inspection Punta Cana, Third-party construction milestone verification Dominican Republic, Is my escrow payment safe with developers in Punta Cana?, Due diligence checklist for buying in planos Punta Cana, Certified drone site monitoring for overseas buyers DR, Is my pre-construction investment in Punta Cana safe?, How to avoid scams in Dominican Republic real estate, Construction delays in Punta Cana what are my rights, Cap Cana construction progress updates, Miches eco-resort construction tracking, Construction progress in Cap Cana, Construction status in Los Establos Cap Cana, Construction progress in Caleton Cap Cana, Technical inspection of villas in Punta Espada, Project monitoring in Miches, Construction phase in Uvero Alto, Monitoring of works in Cocotal Golf Club, Construction updates in Cana Bay, Status of real estate projects in Vista Cana, Inspection of properties in Playa Juanillo"
        : lang === 'fr'
        ? "Services d'inspection de propriétés à Punta Cana, Suivi de construction indépendant en République Dominicaine, Audit immobilier à distance Punta Cana, Inspection de propriété avant remise des clés Punta Cana, Vérification par un tiers des étapes de construction République Dominicaine, Mon paiement fiduciaire est-il en sécurité avec les promoteurs à Punta Cana, Liste de contrôle pour l'achat sur plan Punta Cana, Suivi de chantier certifié par drone pour acheteurs étrangers RD, Mon investissement sur plan à Punta Cana est-il sûr, Comment éviter les arnaques dans l'immobilier en République Dominicaine, Retards de construction à Punta Cana quels sont mes droits, Mises à jour de l'avancement de la construction à Cap Cana, Suivi de la construction du complexe écologique de Miches, Avancement des travaux à Cap Cana, État de la construction à Los Establos Cap Cana, Avancement de la construction à Caletón Cap Cana, Inspection technique de villas à Punta Espada, Suivi de projets à Miches, Phase de construction à Uvero Alto, Suivi des travaux au Cocotal Golf Club, Mises à jour de la construction à Cana Bay, État des projets immobiliers à Vista Cana, Inspection de propriétés à Playa Juanillo"
        : "Monitoreo de Inversión Punta Cana, Auditoría de Propiedades República Dominicana, Inspección pre-construcción Punta Cana, Reporte de avance Inmobiliario RD, Auditoría de construcción de lujo Punta Cana, Monitoreo de propiedades a distancia, Actualizaciones de construcción con drones Punta Cana, Inversión Inmobiliaria Segura, Protección del comprador Punta Cana, Inspector de propiedades independiente RD, Empresas de inspección de obras en Punta Cana, Ingenieros inspectores independientes RD, Supervisor de obra externo en planos Punta Cana, Auditoría técnica de obras civiles Punta Cana, Validación de hitos de construcción para pago de cuotas, Cuándo no pagar una cuota de construcción en planos RD, Auditoría física de avance de obra antes de desembolso, Certificación de hito de construcción constructoras Punta Cana, Inspección técnica para liberación de fondos inmobiliarios, Validación física de hitos de construcción para desembolsos, La constructora me pide pago de cuota pero no veo avance, Problemas con constructoras en República Dominicana, Fraudes inmobiliarios en planos República Dominicana, Mi constructora en Punta Cana no avanza, Qué hacer si se retrasa la entrega de mi apartamento en planos, Cómo demandar a un desarrollador inmobiliario en Punta Cana, Estafas inmobiliarias Punta Cana, Riesgos de comprar en planos en República Dominicana, Constructora me cambió los acabados del contrato qué hacer, Opiniones sobre constructoras en Punta Cana, Proyectos paralizados o paralización de obras en Punta Cana, Verificar licencia de construcción República Dominicana, Cómo saber si un proyecto en planos tiene licencia ambiental en RD, Estatus de deslindes en proyectos Punta Cana, Cómo revisar títulos de propiedad en Punta Cana, Validación de contratos de promesa de compraventa Punta Cana, Investigación de trayectoria de desarrolladores inmobiliarios RD, Proyectos con Confotur en planos Punta Cana, Verificar estatus de Registro Mercantil de constructoras dominicanas, Historial de entrega de constructoras en Punta Cana, Garantía de construcción en planos República Dominicana, Lista de revisión para entrega de apartamento en Punta Cana, Inspección de entrega final de llaves vicios ocultos RD, Recepción técnica de propiedades de lujo Punta Cana, Cómo revisar los acabados de una villa antes de recibirla, Peritaje de entrega de obra residencial Punta Cana, Servicio de entrega de llaves apartamentos Punta Cana, Control de calidad en acabados de apartamentos de lujo RD, Avance de obra en Cap Cana, Estado de construcción en Los Establos Cap Cana, Avance de construcción en Caletón Cap Cana, Inspección técnica de villas en Punta Espada, Monitoreo de proyectos en Miches, Fase de construcción en Uvero Alto, Seguimiento de obras en Cocotal Golf Club, Actualizaciones de construcción en Cana Bay, Estado de proyectos inmobiliarios en Vista Cana, Inspección de propiedades en Playa Juanillo";

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
            ? "Investing from afar is an excellent financial decision, but the lack of constant information and uncertainty about actual delivery times can cause concern. At Punta Cana Investments, we combine our solid track record in real estate brokerage with the technical and engineering expertise of our development arm, PCI CONSTRUCTION GROUP PUNTA CANA."
            : lang === 'fr'
            ? "Investir à distance est une excellente décision financière, mais le manque d'informations constantes et l'incertitude quant aux délais de livraison réels peuvent susciter des inquiétudes. Chez Punta Cana Investments, nous combinons notre solide expérience dans le courtage immobilier avec l'expertise technique et d'ingénierie de notre branche de développement, PCI CONSTRUCTION GROUP PUNTA CANA."
            : "Invertir a distancia es una excelente decisión financiera, pero la falta de información constante y la incertidumbre sobre los plazos de entrega reales pueden generar preocupación. En Punta Cana Investments, combinamos nuestra sólida trayectoria en la intermediación inmobiliaria con la experiencia técnica y de ingeniería de nuestro brazo desarrollador, PCI CONSTRUCTION GROUP PUNTA CANA.",

        highlightBox: lang === 'en'
            ? "\"This is a fully independent and confidential consulting, visual survey, and reporting service. No matter which real estate agency or developer you originally purchased through, our sole commitment is to you and the protection of your capital. Take control of your investment from abroad and sleep peacefully knowing that local experts are watching over your interests step by step. Your success and security are our top priority.\""
            : lang === 'fr'
            ? "\"Il s'agit d'un service de conseil, d'état des lieux visuel et de rapport totalement indépendant et confidentiel. Peu importe l'agence immobilière ou le promoteur avec lequel vous avez effectué votre achat initial, notre seul engagement est envers vous et la protection de votre capital. Prenez le contrôle de votre investissement depuis l'étranger et dormez sur vos deux oreilles en sachant que des experts locaux veillent sur vos intérêts étape par étape. Votre succès et votre sécurité sont notre priorité absolue.\""
            : "\"Este es un servicio de consultoría, levantamiento visual e informe totalmente independiente y confidencial. No importa con qué agencia inmobiliaria o constructora hayas realizado tu compra originaria; nuestro único compromiso es contigo y con la protección de tu capital. Toma el control de tu inversión desde el extranjero y duerme tranquilo sabiendo que expertos locales vigilan tus intereses paso a paso. Tu éxito y seguridad son nuestra máxima prioridad.\"",

        clickToExpand: lang === 'en' ? "Click to expand" : lang === 'fr' ? "Cliquer pour agrandir" : "Haz clic para ampliar",

        ctaTitle: lang === 'en' ? "Request Quote and Monitoring Plan" : lang === 'fr' ? "Demander un Devis et un Plan de Suivi" : "Solicitud de Cotización y Plan de Monitoreo.",
        ctaText: lang === 'en' ? "Do you want to activate the monitoring plan for your property under construction or receive a personalized proposal for your project? Complete the form and an expert consultant will contact you within the next 24 hours." : lang === 'fr' ? "Souhaitez-vous activer le plan de suivi pour votre propriété en construction ou recevoir une proposition personnalisée pour votre projet ? Remplissez le formulaire et un consultant expert vous contactera dans les prochaines 24 heures." : "¿Deseas activar el plan de monitoreo para tu propiedad en construcción o recibir una propuesta personalizada para tu proyecto? Completa el formulario y un consultor experto se pondrá en contacto contigo dentro de las próximas 24 horas.",
        
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
                            ? "¿Are you paying monthly quotas during construction, but you are not physically here to verify that they are actually meeting the real progress? If you are sending money month after month from abroad, our program acts as your progress control tool and absolute peace of mind, ensuring everything progresses strictly according to your signed contract and its established phases:"
                            : lang === 'fr'
                            ? "Payez-vous des mensualités pendant la construction, mais vous n'êtes pas physiquement présent pour vérifier s'ils respectent réellement les avancées ? Si vous envoyez de l'argent mois après mois depuis l'étranger, notre programme agit comme votre outil de contrôle de l'avancement et vous offre une tranquillité d'esprit absolue, garantissant que tout avance strictement selon votre contrat signé et ses phases établies :"
                            : "¿Estás pagando cuotas mensuales durante la construcción, pero no estás aquí físicamente para comprobar que sí están cumpliendo con los avances reales? Si estás enviando dinero mes a mes desde el extranjero, nuestro programa actúa como tu herramienta de control de avance y absoluta tranquilidad, garantizando que todo avance estrictamente acorde a tu contrato firmado y sus fases establecidas:"}
                    </p>
                    <ul className="space-y-3 mt-4 list-disc pl-5">
                        {lang === 'en' ? (
                            <>
                                <li><strong>Invested Money, Built Money:</strong> Visually confirm that each monthly transfer translates into real progress on the ground.</li>
                                <li><strong>Milestone Validation:</strong> We confirm every month how the process is advancing and that the construction phases are met before you send your funds as requested by the developer.</li>
                                <li><strong>Risk Mitigation:</strong> Eliminate the anxiety and uncertainty caused by geographical distance.</li>
                                <li><strong>Early Reporting:</strong> If we detect any visual anomaly or deviation in the finishes, we report it to you immediately with photographic evidence. This empowers you with the necessary information to contact the builder and demand corrections in time.</li>
                                <li><strong>Pre-Delivery Survey:</strong> We conduct a detailed walk-through supported by images and videos, providing you with our objective and expert opinion on the status of the installations and finishes. This gives you a clear and professional criterion before signing the official key handover.</li>
                            </>
                        ) : lang === 'fr' ? (
                            <>
                                <li><strong>Argent Investi, Argent Construit :</strong> Confirmez visuellement que chaque transfert mensuel se traduit par un avancement réel sur le terrain.</li>
                                <li><strong>Validation des Étapes :</strong> Nous confirmons chaque mois l'avancement du processus et que les phases de construction sont respectées avant que vous n'envoyiez vos fonds à la demande du promoteur.</li>
                                <li><strong>Atténuation des Risques :</strong> Éliminez l'anxiété et l'incertitude causées par la distance géographique.</li>
                                <li><strong>Signalement Rapide :</strong> Si nous détectons une anomalie visuelle ou une déviation dans les finitions, nous vous la signalons immédiatement avec des preuves photographiques. Cela vous donne les informations nécessaires pour contacter le constructeur et exiger des corrections à temps.</li>
                                <li><strong>État des Lieux Pré-Livraison :</strong> Nous effectuons une visite détaillée appuyée par des images et des vidéos, en vous donnant notre avis objectif et expert sur l'état des installations et des finitions. Cela vous offre un critère clair et professionnel avant de signer la remise officielle des clés.</li>
                            </>
                        ) : (
                            <>
                                <li><strong>Dinero Invertido, Dinero Construido:</strong> Confirma visualmente que cada transferencia mensual se traduce en avance real en el terreno.</li>
                                <li><strong>Validación de Hitos:</strong> Confirmamos cada mes cómo va el proceso y el avance de las fases de la obra antes de que envíes tus fondos por requerimiento de la constructora.</li>
                                <li><strong>Mitigación del Riesgo:</strong> Elimina la ansiedad y la incertidumbre que genera la distancia geográfica.</li>
                                <li><strong>Reporte Temprano de Anomalías:</strong> Si detectamos alguna anomalía visual o desviación en los acabados, te lo reportamos de inmediato con evidencia gráfica. De esta forma, estarás empoderado con la información necesaria para comunicarte con la constructora y exigir las correcciones a tiempo.</li>
                                <li><strong>Levantamiento Previo a la Entrega Final:</strong> Realizamos un recorrido detallado respaldado por imágenes y videos, brindándote nuestra opinión objetiva y experta sobre el estado de las instalaciones y terminaciones. Así contarás con un criterio claro y profesional antes de firmar la recepción oficial de llaves.</li>
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
                            ? "You will receive a periodic executive report (monthly or quarterly) in PDF format that will include the premium photographic record (HD photos/video), aerial drone shots, and a professional contrast of the current progress versus the construction schedule." 
                            : lang === 'fr' 
                            ? "Vous recevrez un rapport exécutif périodique (mensuel ou trimestriel) au format PDF qui comprendra le dossier photographique premium (photos/vidéos HD), des prises de vue aériennes par drone et une mise en contraste professionnelle de l'avancement actuel par rapport au calendrier de construction."
                            : "Recibirá un informe ejecutivo periódico (mensual o trimestral) en formato PDF que incluirá el registro fotográfico premium (fotos/video HD), tomas aéreas con dron y un contraste profesional del progreso actual versus el cronograma de obra."}
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
                            ? "¿Haven't purchased yet or thinking about your next investment? At Punta Cana Investments, we take care of our own. For all investors who acquire their off-plan or pre-construction properties directly through our firm, this technical monitoring, periodic reporting, and final delivery inspection service is COMPLETELY INCLUDED within our management, at no additional cost."
                            : lang === 'fr'
                            ? "Vous n'avez pas encore acheté ou vous pensez à votre prochain investissement ? Chez Punta Cana Investments, nous prenons soin des nôtres. Pour tous les investisseurs qui acquièrent leurs propriétés sur plan ou en pré-construction directement par l'intermédiaire de notre cabinet, ce service de suivi technique, de rapports périodiques et d'inspection de livraison finale est ENTIÈREMENT INCLUS dans notre gestion, sans aucun coût supplémentaire."
                            : "¿Aún no has comprado o estás pensando en tu próxima inversión? En Punta Cana Investments cuidamos a los nuestros. Para todos los inversionistas que adquieren sus propiedades en planos o pre-construcción directamente a través de nuestra firma, este servicio de monitoreo técnico, reportes periódicos e inspección final de entrega está COMPLETAMENTE INCLUIDO dentro de nuestra gestión, sin ningún costo adicional."}
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
                        src="/images/monitoring-hero.jpg"
                        alt={t.heroTitle}
                        fill
                        sizes="100vw"
                        quality={75}
                        priority
                        fetchPriority="high"
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
            <section className="py-16 md:py-20 relative overflow-hidden bg-[#0A0A0A] border-y border-white/5">
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
            <section className="py-16 md:py-20 bg-[#111111] relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <InteractiveBlocks blocks={blocks} translations={{clickToExpand: t.clickToExpand}} />
                </div>
            </section>

            {/* BLOCK 7: Formulario de Captación */}
            <section id="contact-monitoring" className="py-16 md:py-24 relative bg-[#0A0A0A]">
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
                        
                        <MonitoringForm t={{
                            formName: t.formName,
                            formEmail: t.formEmail,
                            formPhone: t.formPhone,
                            formCountry: t.formCountry,
                            formProject: t.formProject,
                            formLocation: t.formLocation,
                            formInvestment: t.formInvestment,
                            formDate: t.formDate,
                            formButton: t.formButton
                        }} lang={lang} />
                    </div>
                </div>
            </section>

            {/* BLOCK 7.5: Featured Properties (Upsell) */}
            <section className="bg-[#111111]">
                <PropertyListings
                    dict={dict.properties}
                    lang={lang}
                    locations={dict.sections.locations.items}
                    featured={true}
                    showFeaturedOnly={true}
                    sectionId="monitoring-featured-properties"
                    sectionTitle={lang === 'en' ? 'Exclusive Properties for You' : lang === 'fr' ? 'Propriétés Exclusives pour Vous' : 'Propiedades Exclusivas para Ti'}
                    initialData={localProperties.filter(p => ["villas-perla-del-mar-white-sands", "condos-cruise-on-land-resort-punta-cana", "villa-de-lujo-cap-cana-exclusividad"].includes(p.slug))}
                />
            </section>

            {/* BLOCK 8: Aviso Legal */}
            <section className="py-12 md:py-16 bg-black border-t border-white/5">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <p className="text-[11px] md:text-xs text-gray-400 uppercase tracking-wider max-w-4xl mx-auto leading-relaxed">
                        {t.disclaimer}
                    </p>
                </div>
            </section>

            <Footer dict={dict} lang={lang} />
        </main>
    );
}
