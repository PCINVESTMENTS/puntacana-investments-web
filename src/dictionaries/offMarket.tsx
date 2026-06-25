import React from 'react';

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
      title: "Protocolo Obligatorio de Seguridad y Acceso a la Información",
      p1: "Para salvaguardar la integridad de las operaciones bancarias, la privacidad de los desarrolladores y la seguridad jurídica de las transacciones, ",
      p2: " no proporciona dosieres financieros, ubicaciones exactas ni documentos técnicos a solicitantes no depurados.",
      desc: "El acceso a cualquier activo de nuestro portafolio Off-Market requiere el estricto cumplimiento del siguiente protocolo de cumplimiento legal y financiero:",
      items: [
        {
          title: "1. Acuerdo de Confidencialidad y No Divulgación (NDA)",
          desc: "Firma obligatoria de un acuerdo legal que penaliza el uso indebido o la filtración a terceros de la información suministrada sobre el activo."
        },
        {
          title: "2. Prueba de Fondos (Proof of Funds - POF)",
          desc: "Certificación bancaria oficial o carta de líneas de crédito que demuestre la capacidad de liquidez inmediata para ejecutar la operación."
        },
        {
          title: "3. Documentación de Identidad y Registro Corporativo",
          desc: "Copias de identificaciones oficiales de los beneficiarios finales, o el Registro Mercantil y actas corporativas vigentes si la adquisición se realiza a través de una empresa."
        },
        {
          title: "4. Formulario KYC (Know Your Customer)",
          desc: "Cumplimentación de nuestro registro de transparencia, previniendo el lavado de activos y blindando la operación bajo los marcos regulatorios internacionales."
        }
      ]
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

        oppPhysicalState: {
          label: "¿En qué estado físico prefiere la propiedad? *",
          options: [
            "Seleccione un estado físico...",
            "Terminada / Llave en mano (Para uso o explotación inmediata)",
            "Terminada / Requiere remodelación o mejoras estéticas",
            "En fase de construcción gris / Ejecución pendiente"
          ]
        },
        oppDiscount: {
          label: "¿Qué margen de descuento mínimo exige respecto al valor real de mercado? *",
          options: [
            "Seleccione margen de descuento...",
            "Entre un 20% y un 30% por debajo del mercado",
            "Entre un 30% y un 50% por debajo del mercado (Remates agresivos)"
          ]
        },
        oppStrategy: {
          label: "¿Cuál es su estrategia con esta propiedad? *",
          options: [
            "Seleccione su estrategia...",
            "Flipping Inmobiliario (Remodelación y reventa rápida)",
            "Explotación de rentas vacacionales (Flujo de caja)",
            "Retención del activo a largo plazo (Plusvalía / Land Banking)"
          ]
        },
        hotelEnvironment: {
          label: "¿Cuál es el entorno o naturaleza del hotel/terreno que busca? *",
          options: [
            "Seleccione el entorno...",
            "Hotel / Resort con línea de playa directa (Beachfront)",
            "Hotel de Ciudad / Corporativo / Urbano",
            "Eco-Resort / Desarrollo de Montaña o Río",
            "Macro-Lote virgen para desarrollo turístico desde cero"
          ]
        },
        hotelRooms: {
          label: "¿Qué cantidad de habitaciones / llaves requiere? *",
          options: [
            "Seleccione cantidad de habitaciones...",
            "De 50 a 100 habitaciones",
            "De 100 a 200 habitaciones",
            "De 200 a 300 habitaciones",
            "De 300 a 400 habitaciones",
            "De 400 a 500 habitaciones",
            "500 habitaciones o más"
          ]
        },
        hotelOperator: {
          label: "¿Cuál es su preferencia respecto a la operadora del hotel? *",
          options: [
            "Seleccione preferencia de operadora...",
            "Con operadora internacional vigente (Asset con contrato de bandera)",
            "Sin operadora / Libre de bandera (Listo para marca propia o reconversión)"
          ]
        },
        hotelObjective: {
          label: "¿Cuál es el objetivo principal de la transacción? *",
          options: [
            "Seleccione objetivo de la transacción...",
            "Compra del activo inmobiliario (Adquisición total de la propiedad)",
            "Solo gestionar y administrar (Operación hotelera / Management)",
            "Joint Venture (Inyección de capital y desarrollo conjunto)"
          ]
        },
        regionLabel: "¿En qué región estratégica debe estar ubicado el activo? (Seleccione todas las que apliquen) *",
        hotelBudgetLabel: "¿Cuál es el presupuesto o monto de inversión destinado al activo hotelero? *",

        submit: "Enviar requerimiento de búsqueda privada",
        disclaimer: <>Al enviar este requerimiento, recibirá una respuesta confidencial. <strong className="text-white">Revise su carpeta de Spam o Correo no deseado</strong> para asegurar la recepción de nuestra respuesta.</>,
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
      title: "Mandatory Security and Information Access Protocol",
      p1: "To safeguard the integrity of banking operations, developer privacy, and the legal security of transactions, ",
      p2: " does not provide financial dossiers, exact locations, or technical documents to unvetted applicants.",
      desc: "Access to any asset in our Off-Market portfolio requires strict compliance with the following legal and financial protocol:",
      items: [
        {
          title: "1. Non-Disclosure Agreement (NDA)",
          desc: "Mandatory signature of a legal agreement that penalizes the misuse or leakage to third parties of the information provided about the asset."
        },
        {
          title: "2. Proof of Funds (POF)",
          desc: "Official bank certification or letter of credit lines demonstrating the immediate liquidity capacity to execute the operation."
        },
        {
          title: "3. Identity and Corporate Registration Documentation",
          desc: "Copies of official IDs of the ultimate beneficial owners, or the Commercial Registry and current corporate minutes if the acquisition is made through a company."
        },
        {
          title: "4. KYC Form (Know Your Customer)",
          desc: "Completion of our transparency registry, preventing money laundering and shielding the operation under international regulatory frameworks."
        }
      ]
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

        oppPhysicalState: {
          label: "In what physical condition do you prefer the property? *",
          options: [
            "Select physical condition...",
            "Finished / Turnkey (For immediate use or exploitation)",
            "Finished / Requires remodeling or cosmetic upgrades",
            "Grey shell construction / Pending execution"
          ]
        },
        oppDiscount: {
          label: "What minimum discount margin do you demand relative to real market value? *",
          options: [
            "Select discount margin...",
            "Between 20% and 30% below market",
            "Between 30% and 50% below market (Aggressive foreclosures)"
          ]
        },
        oppStrategy: {
          label: "What is your strategy for this property? *",
          options: [
            "Select your strategy...",
            "Real Estate Flipping (Quick remodel and resale)",
            "Vacation rental exploitation (Cash flow)",
            "Long-term asset retention (Capital appreciation / Land Banking)"
          ]
        },
        hotelEnvironment: {
          label: "What is the environment or nature of the hotel/land you are looking for? *",
          options: [
            "Select environment...",
            "Hotel / Resort with direct beach access (Beachfront)",
            "City Hotel / Corporate / Urban",
            "Eco-Resort / Mountain or River Development",
            "Virgin Macro-Lot for tourism development from scratch"
          ]
        },
        hotelRooms: {
          label: "How many rooms / keys do you require? *",
          options: [
            "Select number of rooms...",
            "From 50 to 100 rooms",
            "From 100 to 200 rooms",
            "From 200 to 300 rooms",
            "From 300 to 400 rooms",
            "From 400 to 500 rooms",
            "500 rooms or more"
          ]
        },
        hotelOperator: {
          label: "What is your preference regarding the hotel operator? *",
          options: [
            "Select operator preference...",
            "With active international operator (Flagged asset)",
            "No operator / Flag-free (Ready for own brand or conversion)"
          ]
        },
        hotelObjective: {
          label: "What is the primary objective of the transaction? *",
          options: [
            "Select transaction objective...",
            "Purchase of the real estate asset (Full acquisition of property)",
            "Only manage and administer (Hotel Operation / Management)",
            "Joint Venture (Capital injection and joint development)"
          ]
        },
        regionLabel: "In which strategic region should the asset be located? (Select all that apply) *",
        hotelBudgetLabel: "What is the budget or investment amount intended for the hotel asset? *",

        submit: "Submit private search requirement",
        disclaimer: <>By submitting this requirement, you will receive a confidential response. <strong className="text-white">Check your Spam or Junk folder</strong> to ensure receipt of our response.</>,
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
      title: "Protocole Obligatoire de Sécurité et d'Accès à l'Information",
      p1: "Pour sauvegarder l'intégrité des opérations bancaires, la vie privée des développeurs et la sécurité juridique des transactions, ",
      p2: " ne fournit pas de dossiers financiers, d'emplacements exacts ou de documents techniques aux candidats non vérifiés.",
      desc: "L'accès à tout actif de notre portefeuille Off-Market exige le strict respect du protocole légal et financier suivant :",
      items: [
        {
          title: "1. Accord de Non-Divulgation (NDA)",
          desc: "Signature obligatoire d'un accord légal qui pénalise la mauvaise utilisation ou la fuite à des tiers des informations fournies sur l'actif."
        },
        {
          title: "2. Preuve de Fonds (POF)",
          desc: "Certification bancaire officielle ou lettre de lignes de crédit démontrant la capacité de liquidité immédiate pour exécuter l'opération."
        },
        {
          title: "3. Documents d'Identité et d'Enregistrement Corporatif",
          desc: "Copies des pièces d'identité officielles des bénéficiaires effectifs ultimes, ou du Registre du Commerce et des procès-verbaux de l'entreprise si l'acquisition est réalisée par une société."
        },
        {
          title: "4. Formulaire KYC (Know Your Customer)",
          desc: "Complétion de notre registre de transparence, prévenant le blanchiment d'argent et protégeant l'opération en vertu des cadres réglementaires internationaux."
        }
      ]
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

        oppPhysicalState: {
          label: "Dans quel état physique préférez-vous la propriété ? *",
          options: [
            "Sélectionner l'état physique...",
            "Achevée / Clé en main (Pour utilisation ou exploitation immédiate)",
            "Achevée / Nécessite des rénovations ou améliorations esthétiques",
            "Construction en gros œuvre / Exécution en attente"
          ]
        },
        oppDiscount: {
          label: "Quelle marge de réduction minimale exigez-vous par rapport à la valeur réelle du marché ? *",
          options: [
            "Sélectionner la marge de réduction...",
            "Entre 20% et 30% en dessous du marché",
            "Entre 30% et 50% en dessous du marché (Saisies agressives)"
          ]
        },
        oppStrategy: {
          label: "Quelle est votre stratégie pour cette propriété ? *",
          options: [
            "Sélectionnez votre stratégie...",
            "Flipping Immobilier (Rénovation et revente rapide)",
            "Exploitation de location de vacances (Flux de trésorerie)",
            "Rétention d'actifs à long terme (Plus-value / Land Banking)"
          ]
        },
        hotelEnvironment: {
          label: "Quel est l'environnement ou la nature de l'hôtel/terrain que vous recherchez ? *",
          options: [
            "Sélectionner l'environnement...",
            "Hôtel / Complexe avec accès direct à la plage (Beachfront)",
            "Hôtel de Ville / Corporatif / Urbain",
            "Éco-Complexe / Développement en Montagne ou Rivière",
            "Macro-Lot vierge pour développement touristique à partir de zéro"
          ]
        },
        hotelRooms: {
          label: "Combien de chambres / clés nécessitez-vous ? *",
          options: [
            "Sélectionner le nombre de chambres...",
            "De 50 à 100 chambres",
            "De 100 à 200 chambres",
            "De 200 à 300 chambres",
            "De 300 à 400 chambres",
            "De 400 à 500 chambres",
            "500 chambres ou plus"
          ]
        },
        hotelOperator: {
          label: "Quelle est votre préférence concernant l'opérateur hôtelier ? *",
          options: [
            "Sélectionner la préférence d'opérateur...",
            "Avec un opérateur international actif (Actif sous enseigne)",
            "Sans opérateur / Sans enseigne (Prêt pour marque propre ou conversion)"
          ]
        },
        hotelObjective: {
          label: "Quel est l'objectif principal de la transaction ? *",
          options: [
            "Sélectionner l'objectif de la transaction...",
            "Achat de l'actif immobilier (Acquisition totale de la propriété)",
            "Seulement gérer et administrer (Opération hôtelière / Management)",
            "Joint Venture (Injection de capitaux et développement conjoint)"
          ]
        },
        regionLabel: "Dans quelle région stratégique l'actif doit-il être situé ? (Sélectionnez tout ce qui s'applique) *",
        hotelBudgetLabel: "Quel est le budget ou le montant d'investissement prévu pour l'actif hôtelier ? *",

        submit: "Soumettre la demande de recherche privée",
        disclaimer: <>En soumettant cette demande, vous recevrez une réponse confidentielle. <strong className="text-white">Vérifiez votre dossier Spam ou Courrier indésirable</strong> pour vous assurer de la réception de notre réponse.</>,
        sending: "Traitement en cours..."
      }
    }
  }
};
