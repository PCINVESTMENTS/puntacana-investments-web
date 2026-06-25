const fs = require('fs');

let dictContent = fs.readFileSync('src/dictionaries/offMarket.ts', 'utf8');

// The new ES fields
const esFields = `
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
`;

const enFields = `
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
`;

const frFields = `
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
`;

// Insert after description: "..." for each language
dictContent = dictContent.replace(
  /description: "Especificaciones Adicionales \/ Criterios de Retorno \(ROI\) \*",/,
  `description: "Especificaciones Adicionales / Criterios de Retorno (ROI) *",\n${esFields}`
);

dictContent = dictContent.replace(
  /description: "Additional Specifications \/ ROI Criteria \*",/,
  `description: "Additional Specifications / ROI Criteria *",\n${enFields}`
);

dictContent = dictContent.replace(
  /description: "Spécifications Supplémentaires \/ Critères de ROI \*",/,
  `description: "Spécifications Supplémentaires / Critères de ROI *",\n${frFields}`
);

fs.writeFileSync('src/dictionaries/offMarket.ts', dictContent);

// Now update the form file
let formContent = fs.readFileSync('src/components/investments/OffMarketForm.tsx', 'utf8');

// Replace local array definitions with t.fields lookups
formContent = formContent.replace(
    /const oppPhysicalStates = \[[\s\S]*?\];/,
    '// oppPhysicalStates is now pulled dynamically below'
);
formContent = formContent.replace(
    /const oppDiscounts = \[[\s\S]*?\];/,
    '// oppDiscounts is now pulled dynamically below'
);
formContent = formContent.replace(
    /const oppStrategies = \[[\s\S]*?\];/,
    '// oppStrategies is now pulled dynamically below'
);
formContent = formContent.replace(
    /const hotelEnvironments = \[[\s\S]*?\];/,
    '// hotelEnvironments is now pulled dynamically below'
);
formContent = formContent.replace(
    /const hotelRooms = \[[\s\S]*?\];/,
    '// hotelRooms is now pulled dynamically below'
);
formContent = formContent.replace(
    /const hotelOperators = \[[\s\S]*?\];/,
    '// hotelOperators is now pulled dynamically below'
);
formContent = formContent.replace(
    /const hotelObjectives = \[[\s\S]*?\];/,
    '// hotelObjectives is now pulled dynamically below'
);

// We still need to replace regions array translations? Regions are fine in Spanish since they are proper nouns (Punta Cana, etc)

// Replace the JSX text manually with regexes
formContent = formContent.replace(
    /<label className=\{labelClassName\}>¿En qué estado físico prefiere la propiedad\? \*<\/label>\s*<select name="opp_state" required=\{activeTab === "oportunidad"\} className=\{selectClassName\}>\s*<option value="">Seleccione un estado físico...<\/option>\s*\{oppPhysicalStates\.map\(\(s, i\) => <option key=\{i\} value=\{s\}>\{s\}<\/option>\)\}\s*<\/select>/,
    `<label className={labelClassName}>{t.fields.oppPhysicalState.label}</label>
                        <select name="opp_state" required={activeTab === "oportunidad"} className={selectClassName}>
                            {t.fields.oppPhysicalState.options.map((s: string, i: number) => <option key={i} value={i === 0 ? "" : s}>{s}</option>)}
                        </select>`
);

formContent = formContent.replace(
    /<label className=\{labelClassName\}>¿Qué margen de descuento mínimo exige respecto al valor real de mercado\? \*<\/label>\s*<select name="opp_discount" required=\{activeTab === "oportunidad"\} className=\{selectClassName\}>\s*<option value="">Seleccione margen de descuento...<\/option>\s*\{oppDiscounts\.map\(\(d, i\) => <option key=\{i\} value=\{d\}>\{d\}<\/option>\)\}\s*<\/select>/,
    `<label className={labelClassName}>{t.fields.oppDiscount.label}</label>
                        <select name="opp_discount" required={activeTab === "oportunidad"} className={selectClassName}>
                            {t.fields.oppDiscount.options.map((d: string, i: number) => <option key={i} value={i === 0 ? "" : d}>{d}</option>)}
                        </select>`
);

formContent = formContent.replace(
    /<label className=\{labelClassName\}>¿Cuál es su estrategia con esta propiedad\? \*<\/label>\s*<select name="opp_strategy" required=\{activeTab === "oportunidad"\} className=\{selectClassName\}>\s*<option value="">Seleccione su estrategia...<\/option>\s*\{oppStrategies\.map\(\(s, i\) => <option key=\{i\} value=\{s\}>\{s\}<\/option>\)\}\s*<\/select>/,
    `<label className={labelClassName}>{t.fields.oppStrategy.label}</label>
                        <select name="opp_strategy" required={activeTab === "oportunidad"} className={selectClassName}>
                            {t.fields.oppStrategy.options.map((s: string, i: number) => <option key={i} value={i === 0 ? "" : s}>{s}</option>)}
                        </select>`
);

formContent = formContent.replace(
    /<label className=\{labelClassName\}>¿Cuál es el presupuesto o monto de inversión destinado al activo hotelero\? \*<\/label>/,
    `<label className={labelClassName}>{t.fields.hotelBudgetLabel}</label>`
);

formContent = formContent.replace(
    /<label className=\{labelClassName\}>¿Cuál es el entorno o naturaleza del hotel\/terreno que busca\? \*<\/label>\s*<select name="hotel_environment" required=\{activeTab === "hoteles"\} className=\{selectClassName\}>\s*<option value="">Seleccione el entorno...<\/option>\s*\{hotelEnvironments\.map\(\(e, i\) => <option key=\{i\} value=\{e\}>\{e\}<\/option>\)\}\s*<\/select>/,
    `<label className={labelClassName}>{t.fields.hotelEnvironment.label}</label>
                        <select name="hotel_environment" required={activeTab === "hoteles"} className={selectClassName}>
                            {t.fields.hotelEnvironment.options.map((e: string, i: number) => <option key={i} value={i === 0 ? "" : e}>{e}</option>)}
                        </select>`
);

formContent = formContent.replace(
    /<label className=\{labelClassName\}>¿Qué cantidad de habitaciones \/ llaves requiere\? \*<\/label>\s*<select name="hotel_rooms" required=\{activeTab === "hoteles"\} className=\{selectClassName\}>\s*<option value="">Seleccione cantidad de habitaciones...<\/option>\s*\{hotelRooms\.map\(\(r, i\) => <option key=\{i\} value=\{r\}>\{r\}<\/option>\)\}\s*<\/select>/,
    `<label className={labelClassName}>{t.fields.hotelRooms.label}</label>
                        <select name="hotel_rooms" required={activeTab === "hoteles"} className={selectClassName}>
                            {t.fields.hotelRooms.options.map((r: string, i: number) => <option key={i} value={i === 0 ? "" : r}>{r}</option>)}
                        </select>`
);

formContent = formContent.replace(
    /<label className=\{labelClassName\}>¿Cuál es su preferencia respecto a la operadora del hotel\? \*<\/label>\s*<select name="hotel_operator" required=\{activeTab === "hoteles"\} className=\{selectClassName\}>\s*<option value="">Seleccione preferencia de operadora...<\/option>\s*\{hotelOperators\.map\(\(o, i\) => <option key=\{i\} value=\{o\}>\{o\}<\/option>\)\}\s*<\/select>/,
    `<label className={labelClassName}>{t.fields.hotelOperator.label}</label>
                        <select name="hotel_operator" required={activeTab === "hoteles"} className={selectClassName}>
                            {t.fields.hotelOperator.options.map((o: string, i: number) => <option key={i} value={i === 0 ? "" : o}>{o}</option>)}
                        </select>`
);

formContent = formContent.replace(
    /<label className=\{labelClassName\}>¿Cuál es el objetivo principal de la transacción\? \*<\/label>\s*<select name="hotel_objective" required=\{activeTab === "hoteles"\} className=\{selectClassName\}>\s*<option value="">Seleccione objetivo de la transacción...<\/option>\s*\{hotelObjectives\.map\(\(o, i\) => <option key=\{i\} value=\{o\}>\{o\}<\/option>\)\}\s*<\/select>/,
    `<label className={labelClassName}>{t.fields.hotelObjective.label}</label>
                        <select name="hotel_objective" required={activeTab === "hoteles"} className={selectClassName}>
                            {t.fields.hotelObjective.options.map((o: string, i: number) => <option key={i} value={i === 0 ? "" : o}>{o}</option>)}
                        </select>`
);

formContent = formContent.replace(
    /<label className=\{labelClassName\}>¿En qué región estratégica debe estar ubicado el activo\? \(Seleccione todas las que apliquen\) \*<\/label>/,
    `<label className={labelClassName}>{t.fields.regionLabel}</label>`
);

// We also need to fix `oppPropertyTypes` because I didn't replace that one either.
// Looking at the original:
// const oppPropertyTypes = [
//         "Remates Bancarios / Activos Adjudicados",
// ...
formContent = formContent.replace(
    /const oppPropertyTypes = \[[\s\S]*?\];/,
    '// oppPropertyTypes is now pulled dynamically'
);

fs.writeFileSync('src/components/investments/OffMarketForm.tsx', formContent);
