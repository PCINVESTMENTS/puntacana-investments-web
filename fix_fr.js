const fs = require('fs');

let dictContent = fs.readFileSync('src/dictionaries/offMarket.ts', 'utf8');

dictContent = dictContent.replace(
    /kyc: \{\s*title: "Protocole KYC et Preuve de Fonds \(POF\)",[\s\S]*?closing: "Ce n'est qu'après validation de ces exigences par notre service juridique que l'accès à la Data Room de l'actif sera accordé, comprenant les mesures financières, les plans, les permis et les évaluations officielles."\s*\},/g,
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
    },`
);

fs.writeFileSync('src/dictionaries/offMarket.ts', dictContent);
