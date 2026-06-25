const fs = require('fs');

let dictContent = fs.readFileSync('src/dictionaries/offMarket.ts', 'utf8');
dictContent = dictContent.replace(
    /kyc: \{\s+title: "Protocolo KYC y Prueba de Fondos \(POF\)",[\s\S]*?closing: "Solo tras la validación de estos requisitos por nuestro departamento legal, se otorgará acceso al cuarto de datos \(Data Room\) del activo, incluyendo métricas financieras, planos, permisologías y tasaciones oficiales."\s+\},/g,
    `kyc: {
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
    },`
);

dictContent = dictContent.replace(
    /kyc: \{\s+title: "KYC Protocol and Proof of Funds \(POF\)",[\s\S]*?closing: "Only after validation of these requirements by our legal department will access be granted to the asset's Data Room, including financial metrics, blueprints, permits, and official appraisals."\s+\},/g,
    `kyc: {
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
    },`
);

dictContent = dictContent.replace(
    /kyc: \{\s+title: "Protocole KYC et Preuve de Fonds \(POF\)",[\s\S]*?closing: "Ce n'est qu'après validation de ces exigences par notre service juridique que l'accès à la Data Room de l'actif sera accordé, comprenant les mesures financières, les plans, les permis et les évaluations officielles."\s+\}\s+\},/g,
    `kyc: {
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
    }
  },`
);

fs.writeFileSync('src/dictionaries/offMarket.ts', dictContent);

let pageContent = fs.readFileSync('src/app/[lang]/investments/off-market/page.tsx', 'utf8');

pageContent = pageContent.replace(
    /<h2 className="text-2xl md:text-3xl font-serif text-white uppercase tracking-widest mb-4">\s*Protocolo Obligatorio de Seguridad y Acceso a la Información\s*<\/h2>/,
    `<h2 className="text-2xl md:text-3xl font-serif text-white uppercase tracking-widest mb-4">{t.kyc.title}</h2>`
);

pageContent = pageContent.replace(
    /Para salvaguardar la integridad de las operaciones bancarias, la privacidad de los desarrolladores y la seguridad jurídica de las transacciones,/,
    `{t.kyc.p1}`
);

pageContent = pageContent.replace(
    /no proporciona dosieres financieros, ubicaciones exactas ni documentos técnicos a solicitantes no depurados\./,
    `{t.kyc.p2}`
);

pageContent = pageContent.replace(
    /<h3 className="text-luxury-gold font-bold uppercase text-sm mb-3">1\. Acuerdo de Confidencialidad y No Divulgación \(NDA\)<\/h3>\s*<p className="text-gray-400 font-light text-sm">Firma obligatoria de un acuerdo legal que penaliza el uso indebido o la filtración a terceros de la información suministrada sobre el activo\.<\/p>/,
    `<h3 className="text-luxury-gold font-bold uppercase text-sm mb-3">{t.kyc.items[0].title}</h3>
                                    <p className="text-gray-400 font-light text-sm">{t.kyc.items[0].desc}</p>`
);

pageContent = pageContent.replace(
    /<h3 className="text-luxury-gold font-bold uppercase text-sm mb-3">2\. Prueba de Fondos \(Proof of Funds - POF\)<\/h3>\s*<p className="text-gray-400 font-light text-sm">Certificación bancaria oficial o carta de líneas de crédito que demuestre la capacidad de liquidez inmediata para ejecutar la operación\.<\/p>/,
    `<h3 className="text-luxury-gold font-bold uppercase text-sm mb-3">{t.kyc.items[1].title}</h3>
                                    <p className="text-gray-400 font-light text-sm">{t.kyc.items[1].desc}</p>`
);

pageContent = pageContent.replace(
    /<h3 className="text-luxury-gold font-bold uppercase text-sm mb-3">3\. Documentación de Identidad y Registro Corporativo<\/h3>\s*<p className="text-gray-400 font-light text-sm">Copias de identificaciones oficiales de los beneficiarios finales, o el Registro Mercantil y actas corporativas vigentes si la adquisición se realiza a través de una empresa\.<\/p>/,
    `<h3 className="text-luxury-gold font-bold uppercase text-sm mb-3">{t.kyc.items[2].title}</h3>
                                    <p className="text-gray-400 font-light text-sm">{t.kyc.items[2].desc}</p>`
);

pageContent = pageContent.replace(
    /<h3 className="text-luxury-gold font-bold uppercase text-sm mb-3">4\. Formulario KYC \(Know Your Customer\)<\/h3>\s*<p className="text-gray-400 font-light text-sm">Cumplimentación de nuestro registro de transparencia, previniendo el lavado de activos y blindando la operación bajo los marcos regulatorios internacionales\.<\/p>/,
    `<h3 className="text-luxury-gold font-bold uppercase text-sm mb-3">{t.kyc.items[3].title}</h3>
                                    <p className="text-gray-400 font-light text-sm">{t.kyc.items[3].desc}</p>`
);

fs.writeFileSync('src/app/[lang]/investments/off-market/page.tsx', pageContent);

