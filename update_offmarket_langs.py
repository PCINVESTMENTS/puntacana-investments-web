import re
import os

# 1. Create translations file
translations = """
export const offMarketDict = {
  es: {
    hero: {
      tag: "Private Placement Memorandum",
      title1: "Portafolio Inmobiliario Privado:",
      title2: "Operaciones Off-Market",
      desc: "Bienvenido a nuestra división privada. Si busca adquirir un complejo hotelero, desarrollar un macro-proyecto, o capitalizar sobre propiedades de oportunidad y remates bancarios, ha llegado al ecosistema correcto."
    },
    hotels: {
      title: "Adquisición de Activos Hoteleros y Tierras de Macro-Desarrollo",
      p1: "El acceso a complejos hoteleros operativos, resorts en fase de reconversión y terrenos de escala macro en ubicaciones de altísimo interés exige un ecosistema de absoluta reserva. Por políticas de confidencialidad institucional y protección de las marcas operadoras, estos activos de gran envergadura jamás se exponen al escrutinio público ni a portales masivos.",
      p2: "Punta Cana Investments actúa como el nexo estratégico en el terreno. Centralizamos un portafolio privado de propiedades comerciales premium y activos bajo radar, gestionando las transacciones bajo los más estrictos estándares globales de confidencialidad, análisis de factibilidad y rigor de ingeniería en conjunto con nuestro brazo técnico, PCI CONSTRUCTION GROUP PUNTA CANA.",
      boxTitle: "Mandato de Gestión Exclusiva",
      boxSubtitle: "Búsqueda y Negociación Bajo Encargo Corporativo:",
      boxText: "Para el segmento de hospitalidad, el inversor o la corporación interesada debe formalizar una Carta Mandato de Gestión de Búsqueda. Este instrumento legal autoriza formalmente a nuestra firma a iniciar la prospección, análisis técnico de permisología y debida diligencia de activos que se ajusten con precisión quirúrgica a los requerimientos de ubicación, número de llaves, rentabilidad y especificaciones de su fondo de inversión."
    },
    distressed: {
      title1: "Adquisición Estratégica de Activos en Liquidación, Adjudicados y Remates Bancarios",
      title2: "(Distressed Assets)",
      p1: "El mercado inmobiliario premium genera, en coyunturas específicas, oportunidades líquidas donde el factor tiempo prevalece sobre el valor comercial del activo. Centralizamos de forma estrictamente privada el acceso a propiedades de alta gama bajo condiciones de ejecución rápida: remates por urgencia económica de propietarios privados y carteras de activos adjudicados o en procesos de remate bancario.",
      p2: "Estas propiedades —villas de lujo, estructuras residenciales inconclusas y parcelas preferenciales— son filtradas bajo un criterio riguroso: deben presentar un descuento sustancial respecto a su valor de tasación real en el mercado.",
      p3: "Debido a la naturaleza legal y de velocidad de capital que exigen estas transacciones, estos activos se gestionan bajo estricto radar, protegiendo la identidad de las instituciones financieras involucradas."
    },
    kyc: {
      title: "Protocolo KYC y Prueba de Fondos (POF)",
      desc: "El acceso a cualquier activo de nuestro portafolio Off-Market requiere el estricto cumplimiento del siguiente protocolo de cumplimiento legal y financiero:",
      items: [
        {
          title: "Firma de NDA (Non-Disclosure Agreement)",
          desc: "Acuerdo de confidencialidad inquebrantable que protege tanto la identidad del vendedor/institución bancaria como la del inversor o fondo adquiriente."
        },
        {
          title: "Proof of Funds (POF)",
          desc: "Verificación de capacidad financiera líquida. Nuestro comité requiere evidencia bancaria certificada reciente que avale la capacidad de compra del activo objetivo."
        },
        {
          title: "Debida Diligencia Corporativa (KYC)",
          desc: "Identificación del beneficiario final (UBO), origen de los fondos y perfilamiento corporativo para cumplir con las normativas locales e internacionales de prevención de lavado de activos."
        }
      ],
      closing: "Solo tras la validación de estos requisitos por nuestro departamento legal, se otorgará acceso al cuarto de datos (Data Room) del activo, incluyendo métricas financieras, planos, permisologías y tasaciones oficiales."
    },
    form: {
      received: "Requerimiento Recibido",
      successMsg: "Su requerimiento de búsqueda ha sido enviado con éxito. Le hemos enviado un correo electrónico de confirmación. Por favor, asegúrese de revisar su bandeja de Spam o Correo no deseado.",
      sendAnother: "Enviar otro requerimiento",
      title: "Presentar Requerimiento de Búsqueda",
      subtitle: "Complete el siguiente formulario técnico. Nuestro comité de inversiones analizará su perfil y requerimientos para organizar una llamada de validación inicial.",
      tabs: {
        opportunities: "Propiedades de Oportunidad",
        hotels: "Hoteles y Resorts"
      },
      fields: {
        name: "Nombre Completo o Representante Legal *",
        company: "Empresa / Fondo de Inversión (Opcional)",
        email: "Correo Electrónico Corporativo *",
        phone: "Teléfono / WhatsApp *",
        opportunityType: {
          label: "Tipo de Activo de Interés *",
          options: [
            "Seleccione un tipo",
            "Villas de Lujo en Remate",
            "Apartamentos / Penthouses Adjudicados",
            "Solares Preferenciales",
            "Estructuras Inconclusas"
          ]
        },
        hotelType: {
          label: "Clasificación del Activo *",
          options: [
            "Seleccione una clasificación",
            "Hotel Boutique (< 50 habs)",
            "Resort All-Inclusive (> 200 habs)",
            "Terreno para Macro-Desarrollo Turístico",
            "Proyecto Hotelero en Fase de Construcción"
          ]
        },
        budget: {
          label: "Rango de Presupuesto (USD) *",
          optionsOpportunities: [
            "Seleccione un rango",
            "$500,000 - $1,000,000",
            "$1,000,000 - $3,000,000",
            "$3,000,000 - $5,000,000",
            "Más de $5,000,000"
          ],
          optionsHotels: [
            "Seleccione un rango",
            "Menos de $20 Millones",
            "$20 Millones - $50 Millones",
            "$50 Millones - $100 Millones",
            "Más de $100 Millones"
          ]
        },
        location: {
          label: "Zona de Interés *",
          options: [
            "Seleccione una zona",
            "Punta Cana / Bávaro",
            "Cap Cana",
            "Miches",
            "Uvero Alto",
            "Abierto a sugerencias"
          ]
        },
        urgency: {
          label: "Nivel de Urgencia / Horizonte de Inversión *",
          options: [
            "Seleccione un nivel",
            "Inmediato (Fondos líquidos listos)",
            "1 a 3 meses",
            "3 a 6 meses",
            "Exploratorio"
          ]
        },
        pof: {
          label: "¿Cuenta con Proof of Funds (POF) verificable? *",
          options: [
            "Seleccione una opción",
            "Sí, disponible inmediatamente",
            "Sí, requiere 48-72 horas para emisión",
            "No, fondos en proceso de estructuración"
          ]
        },
        description: "Especificaciones Adicionales / Criterios de Retorno (ROI) *",
        submit: "Enviar Requerimiento Institucional",
        sending: "Procesando..."
      }
    }
  },
  en: {
    hero: {
      tag: "Private Placement Memorandum",
      title1: "Private Real Estate Portfolio:",
      title2: "Off-Market Operations",
      desc: "Welcome to our private division. Whether you are looking to acquire an operational hotel, develop a macro-project, or capitalize on distressed properties and bank foreclosures, you are in the right ecosystem."
    },
    hotels: {
      title: "Acquisition of Hotel Assets and Macro-Development Land",
      p1: "Access to operational hotel complexes, resorts undergoing conversion, and macro-scale land in high-interest locations requires an ecosystem of absolute discretion. Due to institutional confidentiality policies and brand protection, these large-scale assets are never exposed to public scrutiny or massive portals.",
      p2: "Punta Cana Investments acts as the strategic nexus on the ground. We centralize a private portfolio of premium commercial properties and under-the-radar assets, managing transactions under the strictest global standards of confidentiality, feasibility analysis, and engineering rigor alongside our technical arm, PCI CONSTRUCTION GROUP PUNTA CANA.",
      boxTitle: "Exclusive Management Mandate",
      boxSubtitle: "Corporate Mandated Search and Negotiation:",
      boxText: "For the hospitality segment, the interested investor or corporation must formalize a Search Management Mandate Letter. This legal instrument formally authorizes our firm to initiate the prospecting, technical permitting analysis, and due diligence of assets that surgically align with the location, key count, profitability, and specifications required by your investment fund."
    },
    distressed: {
      title1: "Strategic Acquisition of Liquidations and Bank Foreclosures",
      title2: "(Distressed Assets)",
      p1: "The premium real estate market generates, under specific circumstances, liquid opportunities where the time factor prevails over the commercial value of the asset. We strictly privatize access to high-end properties under quick-execution conditions: foreclosures due to private owners' economic urgency and portfolios of bank-owned or auctioned assets.",
      p2: "These properties—luxury villas, unfinished residential structures, and preferential land plots—are filtered under rigorous criteria: they must present a substantial discount compared to their actual market appraisal value.",
      p3: "Due to the legal nature and capital speed demanded by these transactions, these assets are managed strictly under the radar, protecting the identity of the financial institutions involved."
    },
    kyc: {
      title: "KYC Protocol and Proof of Funds (POF)",
      desc: "Access to any asset in our Off-Market portfolio requires strict compliance with the following legal and financial protocol:",
      items: [
        {
          title: "NDA Signature (Non-Disclosure Agreement)",
          desc: "An unbreakable confidentiality agreement that protects both the identity of the seller/banking institution and the acquiring investor or fund."
        },
        {
          title: "Proof of Funds (POF)",
          desc: "Verification of liquid financial capacity. Our committee requires recent certified banking evidence that backs the purchasing capacity for the target asset."
        },
        {
          title: "Corporate Due Diligence (KYC)",
          desc: "Identification of the Ultimate Beneficial Owner (UBO), source of funds, and corporate profiling to comply with local and international anti-money laundering regulations."
        }
      ],
      closing: "Only after validation of these requirements by our legal department will access be granted to the asset's Data Room, including financial metrics, blueprints, permits, and official appraisals."
    },
    form: {
      received: "Requirement Received",
      successMsg: "Your search requirement has been successfully submitted. We have sent you a confirmation email. Please be sure to check your Spam or Junk folder.",
      sendAnother: "Send another requirement",
      title: "Submit Search Requirement",
      subtitle: "Complete the following technical form. Our investment committee will analyze your profile and requirements to schedule an initial validation call.",
      tabs: {
        opportunities: "Opportunity Properties",
        hotels: "Hotels & Resorts"
      },
      fields: {
        name: "Full Name or Legal Representative *",
        company: "Company / Investment Fund (Optional)",
        email: "Corporate Email *",
        phone: "Phone / WhatsApp *",
        opportunityType: {
          label: "Asset Type of Interest *",
          options: [
            "Select a type",
            "Luxury Villas on Foreclosure",
            "Bank-Owned Apartments / Penthouses",
            "Preferential Land Plots",
            "Unfinished Structures"
          ]
        },
        hotelType: {
          label: "Asset Classification *",
          options: [
            "Select a classification",
            "Boutique Hotel (< 50 keys)",
            "All-Inclusive Resort (> 200 keys)",
            "Macro Tourism Development Land",
            "Hotel Project Under Construction"
          ]
        },
        budget: {
          label: "Budget Range (USD) *",
          optionsOpportunities: [
            "Select a range",
            "$500,000 - $1,000,000",
            "$1,000,000 - $3,000,000",
            "$3,000,000 - $5,000,000",
            "Over $5,000,000"
          ],
          optionsHotels: [
            "Select a range",
            "Under $20 Million",
            "$20 Million - $50 Million",
            "$50 Million - $100 Million",
            "Over $100 Million"
          ]
        },
        location: {
          label: "Area of Interest *",
          options: [
            "Select an area",
            "Punta Cana / Bavaro",
            "Cap Cana",
            "Miches",
            "Uvero Alto",
            "Open to suggestions"
          ]
        },
        urgency: {
          label: "Urgency Level / Investment Horizon *",
          options: [
            "Select a level",
            "Immediate (Liquid funds ready)",
            "1 to 3 months",
            "3 to 6 months",
            "Exploratory"
          ]
        },
        pof: {
          label: "Do you have verifiable Proof of Funds (POF)? *",
          options: [
            "Select an option",
            "Yes, available immediately",
            "Yes, requires 48-72 hours to issue",
            "No, funds are being structured"
          ]
        },
        description: "Additional Specifications / ROI Criteria *",
        submit: "Submit Institutional Requirement",
        sending: "Processing..."
      }
    }
  },
  fr: {
    hero: {
      tag: "Mémorandum de Placement Privé",
      title1: "Portefeuille Immobilier Privé :",
      title2: "Opérations Hors-Marché (Off-Market)",
      desc: "Bienvenue dans notre division privée. Si vous cherchez à acquérir un complexe hôtelier, à développer un macro-projet, ou à capitaliser sur des propriétés d'opportunité et des saisies bancaires, vous êtes dans le bon écosystème."
    },
    hotels: {
      title: "Acquisition d'Actifs Hôteliers et Terrains de Macro-Développement",
      p1: "L'accès à des complexes hôteliers opérationnels, des centres de villégiature en cours de conversion et des terrains à grande échelle dans des endroits de grand intérêt nécessite un écosystème de discrétion absolue. En raison des politiques de confidentialité institutionnelles et de la protection des marques, ces actifs de grande envergure ne sont jamais exposés à l'examen public ou aux portails de masse.",
      p2: "Punta Cana Investments agit comme le lien stratégique sur le terrain. Nous centralisons un portefeuille privé de propriétés commerciales de premier ordre et d'actifs sous le radar, gérant les transactions sous les normes mondiales les plus strictes de confidentialité, d'analyse de faisabilité et de rigueur d'ingénierie aux côtés de notre bras technique, PCI CONSTRUCTION GROUP PUNTA CANA.",
      boxTitle: "Mandat de Gestion Exclusif",
      boxSubtitle: "Recherche et Négociation Sous Mandat Corporatif :",
      boxText: "Pour le segment de l'hôtellerie, l'investisseur ou la société intéressée doit formaliser une Lettre de Mandat de Recherche. Cet instrument juridique autorise formellement notre cabinet à entamer la prospection, l'analyse technique des permis et la diligence raisonnable d'actifs qui correspondent chirurgicalement à l'emplacement, au nombre de clés, à la rentabilité et aux spécifications requises par votre fonds d'investissement."
    },
    distressed: {
      title1: "Acquisition Stratégique de Liquidations et de Saisies Bancaires",
      title2: "(Actifs en Difficulté)",
      p1: "Le marché immobilier premium génère, dans des circonstances spécifiques, des opportunités liquides où le facteur temps prévaut sur la valeur commerciale de l'actif. Nous privatisons strictement l'accès à des propriétés haut de gamme dans des conditions d'exécution rapide : saisies dues à l'urgence économique des propriétaires privés et portefeuilles d'actifs appartenant aux banques ou mis aux enchères.",
      p2: "Ces propriétés—villas de luxe, structures résidentielles inachevées et terrains préférentiels—sont filtrées selon des critères rigoureux : elles doivent présenter une remise substantielle par rapport à leur valeur d'évaluation réelle sur le marché.",
      p3: "En raison de la nature juridique et de la vitesse du capital exigée par ces transactions, ces actifs sont gérés strictement sous le radar, protégeant l'identité des institutions financières impliquées."
    },
    kyc: {
      title: "Protocole KYC et Preuve de Fonds (POF)",
      desc: "L'accès à tout actif de notre portefeuille Off-Market exige le strict respect du protocole légal et financier suivant :",
      items: [
        {
          title: "Signature de NDA (Accord de Non-Divulgation)",
          desc: "Un accord de confidentialité incassable qui protège à la fois l'identité du vendeur/institution bancaire et celle de l'investisseur ou du fonds acquéreur."
        },
        {
          title: "Preuve de Fonds (POF)",
          desc: "Vérification de la capacité financière liquide. Notre comité exige des preuves bancaires certifiées récentes attestant de la capacité d'achat pour l'actif cible."
        },
        {
          title: "Diligence Raisonnable Corporative (KYC)",
          desc: "Identification du bénéficiaire effectif ultime (UBO), de l'origine des fonds et du profilage corporatif pour se conformer aux réglementations locales et internationales de lutte contre le blanchiment d'argent."
        }
      ],
      closing: "Ce n'est qu'après validation de ces exigences par notre service juridique que l'accès à la Data Room de l'actif sera accordé, comprenant les mesures financières, les plans, les permis et les évaluations officielles."
    },
    form: {
      received: "Demande Reçue",
      successMsg: "Votre demande de recherche a été soumise avec succès. Nous vous avons envoyé un e-mail de confirmation. Veuillez vous assurer de vérifier votre dossier Spam ou Courrier indésirable.",
      sendAnother: "Envoyer une autre demande",
      title: "Soumettre une Demande de Recherche",
      subtitle: "Remplissez le formulaire technique suivant. Notre comité d'investissement analysera votre profil et vos exigences pour planifier un appel de validation initial.",
      tabs: {
        opportunities: "Propriétés d'Opportunité",
        hotels: "Hôtels et Complexes"
      },
      fields: {
        name: "Nom Complet ou Représentant Légal *",
        company: "Société / Fonds d'Investissement (Optionnel)",
        email: "E-mail Professionnel *",
        phone: "Téléphone / WhatsApp *",
        opportunityType: {
          label: "Type d'Actif d'Intérêt *",
          options: [
            "Sélectionnez un type",
            "Villas de Luxe Saisies",
            "Appartements / Penthouses Saisis par la Banque",
            "Terrains Préférentiels",
            "Structures Inachevées"
          ]
        },
        hotelType: {
          label: "Classification de l'Actif *",
          options: [
            "Sélectionnez une classification",
            "Hôtel Boutique (< 50 clés)",
            "Complexe Tout Compris (> 200 clés)",
            "Terrain de Développement Touristique Macro",
            "Projet Hôtelier en Construction"
          ]
        },
        budget: {
          label: "Fourchette de Budget (USD) *",
          optionsOpportunities: [
            "Sélectionnez une fourchette",
            "500 000 $ - 1 000 000 $",
            "1 000 000 $ - 3 000 000 $",
            "3 000 000 $ - 5 000 000 $",
            "Plus de 5 000 000 $"
          ],
          optionsHotels: [
            "Sélectionnez une fourchette",
            "Moins de 20 Millions $",
            "20 Millions $ - 50 Millions $",
            "50 Millions $ - 100 Millions $",
            "Plus de 100 Millions $"
          ]
        },
        location: {
          label: "Zone d'Intérêt *",
          options: [
            "Sélectionnez une zone",
            "Punta Cana / Bavaro",
            "Cap Cana",
            "Miches",
            "Uvero Alto",
            "Ouvert aux suggestions"
          ]
        },
        urgency: {
          label: "Niveau d'Urgence / Horizon d'Investissement *",
          options: [
            "Sélectionnez un niveau",
            "Immédiat (Fonds liquides prêts)",
            "1 à 3 mois",
            "3 à 6 mois",
            "Exploratoire"
          ]
        },
        pof: {
          label: "Disposez-vous d'une Preuve de Fonds (POF) vérifiable ? *",
          options: [
            "Sélectionnez une option",
            "Oui, disponible immédiatement",
            "Oui, nécessite 48-72 heures pour l'émission",
            "Non, fonds en cours de structuration"
          ]
        },
        description: "Spécifications Supplémentaires / Critères de ROI *",
        submit: "Soumettre la Demande Institutionnelle",
        sending: "Traitement en cours..."
      }
    }
  }
};
"""
with open("src/dictionaries/offMarket.ts", "w", encoding="utf-8") as f:
    f.write(translations)

print("Created offMarket.ts")
