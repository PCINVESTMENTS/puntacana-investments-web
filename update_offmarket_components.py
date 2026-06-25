import re
import os

form_path = "src/components/investments/OffMarketForm.tsx"
with open(form_path, "r", encoding="utf-8") as f:
    form_content = f.read()

# Add lang prop to OffMarketForm
form_content = form_content.replace(
    'export default function OffMarketForm() {',
    'import { offMarketDict } from "@/dictionaries/offMarket";\n\nexport default function OffMarketForm({ lang }: { lang: "es" | "en" | "fr" }) {\n    const t = offMarketDict[lang].form;'
)

# Replace all the text in OffMarketForm
replacements = {
    '"Propiedades de Oportunidad"': 't.tabs.opportunities',
    '"Hoteles y Resorts"': 't.tabs.hotels',
    '"Su requerimiento de búsqueda ha sido enviado con éxito. Le hemos enviado un correo electrónico de confirmación. Por favor, asegúrese de revisar su bandeja de Spam o Correo no deseado."': 't.successMsg',
    '>Requerimiento Recibido<': '>{t.received}<',
    '>Enviar otro requerimiento<': '>{t.sendAnother}<',
    '>Presentar Requerimiento de Búsqueda<': '>{t.title}<',
    '>Complete el siguiente formulario técnico. Nuestro comité de inversiones analizará su perfil y requerimientos para organizar una llamada de validación inicial.<': '>{t.subtitle}<',
    '>Nombre Completo o Representante Legal *<': '>{t.fields.name}<',
    '>Empresa / Fondo de Inversión (Opcional)<': '>{t.fields.company}<',
    '>Correo Electrónico Corporativo *<': '>{t.fields.email}<',
    '>Teléfono / WhatsApp *<': '>{t.fields.phone}<',
    '>Tipo de Activo de Interés *<': '>{t.fields.opportunityType.label}<',
    '>Clasificación del Activo *<': '>{t.fields.hotelType.label}<',
    '>Rango de Presupuesto (USD) *<': '>{t.fields.budget.label}<',
    '>Zona de Interés *<': '>{t.fields.location.label}<',
    '>Nivel de Urgencia / Horizonte de Inversión *<': '>{t.fields.urgency.label}<',
    '>¿Cuenta con Proof of Funds (POF) verificable? *<': '>{t.fields.pof.label}<',
    '>Especificaciones Adicionales / Criterios de Retorno (ROI) *<': '>{t.fields.description}<',
    '>Enviar Requerimiento Institucional<': '>{t.fields.submit}<',
    '>Procesando...<': '>{t.fields.sending}<',
}

for old, new in replacements.items():
    form_content = form_content.replace(old, new)

# For the options we have to be more careful since they are mapped over an array
form_content = re.sub(
    r'<option value="">Seleccione un tipo</option>.*?<option value="Estructuras Inconclusas">Estructuras Inconclusas</option>',
    '{t.fields.opportunityType.options.map((opt, i) => <option key={i} value={i === 0 ? "" : opt}>{opt}</option>)}',
    form_content,
    flags=re.DOTALL
)

form_content = re.sub(
    r'<option value="">Seleccione una clasificación</option>.*?<option value="Proyecto Hotelero en Fase de Construcción">Proyecto Hotelero en Fase de Construcción</option>',
    '{t.fields.hotelType.options.map((opt, i) => <option key={i} value={i === 0 ? "" : opt}>{opt}</option>)}',
    form_content,
    flags=re.DOTALL
)

form_content = re.sub(
    r'<option value="">Seleccione un rango</option>.*?<option value="Más de \$5,000,000">Más de \$5,000,000</option>',
    '{t.fields.budget.optionsOpportunities.map((opt, i) => <option key={i} value={i === 0 ? "" : opt}>{opt}</option>)}',
    form_content,
    flags=re.DOTALL
)

form_content = re.sub(
    r'<option value="">Seleccione un rango</option>.*?<option value="Más de \$100 Millones">Más de \$100 Millones</option>',
    '{t.fields.budget.optionsHotels.map((opt, i) => <option key={i} value={i === 0 ? "" : opt}>{opt}</option>)}',
    form_content,
    flags=re.DOTALL
)

form_content = re.sub(
    r'<option value="">Seleccione una zona</option>.*?<option value="Abierto a sugerencias">Abierto a sugerencias</option>',
    '{t.fields.location.options.map((opt, i) => <option key={i} value={i === 0 ? "" : opt}>{opt}</option>)}',
    form_content,
    flags=re.DOTALL
)

form_content = re.sub(
    r'<option value="">Seleccione un nivel</option>.*?<option value="Exploratorio">Exploratorio</option>',
    '{t.fields.urgency.options.map((opt, i) => <option key={i} value={i === 0 ? "" : opt}>{opt}</option>)}',
    form_content,
    flags=re.DOTALL
)

form_content = re.sub(
    r'<option value="">Seleccione una opción</option>.*?<option value="No, fondos en proceso de estructuración">No, fondos en proceso de estructuración</option>',
    '{t.fields.pof.options.map((opt, i) => <option key={i} value={i === 0 ? "" : opt}>{opt}</option>)}',
    form_content,
    flags=re.DOTALL
)

with open(form_path, "w", encoding="utf-8") as f:
    f.write(form_content)


page_path = "src/app/[lang]/investments/off-market/page.tsx"
with open(page_path, "r", encoding="utf-8") as f:
    page_content = f.read()

page_content = page_content.replace(
    'import Image from "next/image";',
    'import Image from "next/image";\nimport { offMarketDict } from "@/dictionaries/offMarket";'
)

page_content = page_content.replace(
    'const dict = await getDictionary(lang);',
    'const dict = await getDictionary(lang);\n    const t = offMarketDict[lang];'
)

page_content = page_content.replace(
    '<OffMarketForm />',
    '<OffMarketForm lang={lang} />'
)

# Text replacements for page
page_replacements = {
    '>Private Placement Memorandum<': '>{t.hero.tag}<',
    '>Portafolio Inmobiliario Privado:<': '>{t.hero.title1}<',
    '>Operaciones Off-Market<': '>{t.hero.title2}<',
    '>Bienvenido a nuestra división privada. Si busca adquirir un complejo hotelero, desarrollar un macro-proyecto, o capitalizar sobre propiedades de oportunidad y remates bancarios, ha llegado al ecosistema correcto.<': '>{t.hero.desc}<',
    
    '>Adquisición de Activos Hoteleros y Tierras de Macro-Desarrollo<': '>{t.hotels.title}<',
    '>El acceso a complejos hoteleros operativos, resorts en fase de reconversión y terrenos de escala macro en ubicaciones de altísimo interés exige un ecosistema de absoluta reserva. Por políticas de confidencialidad institucional y protección de las marcas operadoras, estos activos de gran envergadura jamás se exponen al escrutinio público ni a portales masivos.<': '>{t.hotels.p1}<',
    '>Punta Cana Investments<': '>{lang === "en" ? "Punta Cana Investments" : "Punta Cana Investments"}<',
    'actúa como el nexo estratégico en el terreno. Centralizamos un portafolio privado de propiedades comerciales premium y activos bajo radar, gestionando las transacciones bajo los más estrictos estándares globales de confidencialidad, análisis de factibilidad y rigor de ingeniería en conjunto con nuestro brazo técnico,': '{t.hotels.p2.split("Punta Cana Investments")[1].split("PCI CONSTRUCTION GROUP PUNTA CANA")[0]}',
    '>Mandato de Gestión Exclusiva<': '>{t.hotels.boxTitle}<',
    '>Búsqueda y Negociación Bajo Encargo Corporativo:<': '>{t.hotels.boxSubtitle}<',
    '>Para el segmento de hospitalidad, el inversor o la corporación interesada debe formalizar una <': '>{t.hotels.boxText.split("Carta Mandato de Gestión de Búsqueda")[0]}<',
    '>Carta Mandato de Gestión de Búsqueda<': '>{lang === "en" ? "Search Management Mandate Letter" : lang === "fr" ? "Lettre de Mandat de Recherche" : "Carta Mandato de Gestión de Búsqueda"}<',
    '>. Este instrumento legal autoriza formalmente a nuestra firma a iniciar la prospección, análisis técnico de permisología y debida diligencia de activos que se ajusten con precisión quirúrgica a los requerimientos de ubicación, número de llaves, rentabilidad y especificaciones de su fondo de inversión.<': '>{t.hotels.boxText.split("Carta Mandato de Gestión de Búsqueda")[1] || t.hotels.boxText.split("Search Management Mandate Letter")[1] || t.hotels.boxText.split("Lettre de Mandat de Recherche")[1]}<',

    '>Adquisición Estratégica de Activos en Liquidación, Adjudicados y Remates Bancarios <': '>{t.distressed.title1} <',
    '>(Distressed Assets)<': '>{t.distressed.title2}<',
    '>El mercado inmobiliario premium genera, en coyunturas específicas, oportunidades líquidas donde el factor tiempo prevalece sobre el valor comercial del activo. Centralizamos de forma estrictamente privada el acceso a propiedades de alta gama bajo condiciones de ejecución rápida: remates por urgencia económica de propietarios privados y carteras de activos adjudicados o en procesos de remate bancario.<': '>{t.distressed.p1}<',
    '>Estas propiedades —villas de lujo, estructuras residenciales inconclusas y parcelas preferenciales— son filtradas bajo un criterio riguroso: deben presentar un <': '>{t.distressed.p2.split("descuento sustancial")[0]}<',
    '>descuento sustancial respecto a su valor de tasación real en el mercado<': '>{lang === "en" ? "substantial discount compared to their actual market appraisal value" : lang === "fr" ? "remise substantielle par rapport à leur valeur d\'évaluation réelle sur le marché" : "descuento sustancial respecto a su valor de tasación real en el mercado"}<',
    '>.<': '>. <',
    '>Debido a la naturaleza legal y de velocidad de capital que exigen estas transacciones, estos activos se gestionan bajo estricto radar, protegiendo la identidad de las instituciones financieras involucradas.<': '>{t.distressed.p3}<',

    '>Protocolo KYC y Prueba de Fondos (POF)<': '>{t.kyc.title}<',
    '>El acceso a cualquier activo de nuestro portafolio Off-Market requiere el estricto cumplimiento del siguiente protocolo de cumplimiento legal y financiero:<': '>{t.kyc.desc}<',
    
    '>Firma de NDA (Non-Disclosure Agreement)<': '>{t.kyc.items[0].title}<',
    '>Acuerdo de confidencialidad inquebrantable que protege tanto la identidad del vendedor/institución bancaria como la del inversor o fondo adquiriente.<': '>{t.kyc.items[0].desc}<',
    
    '>Proof of Funds (POF)<': '>{t.kyc.items[1].title}<',
    '>Verificación de capacidad financiera líquida. Nuestro comité requiere evidencia bancaria certificada reciente que avale la capacidad de compra del activo objetivo.<': '>{t.kyc.items[1].desc}<',
    
    '>Debida Diligencia Corporativa (KYC)<': '>{t.kyc.items[2].title}<',
    '>Identificación del beneficiario final (UBO), origen de los fondos y perfilamiento corporativo para cumplir con las normativas locales e internacionales de prevención de lavado de activos.<': '>{t.kyc.items[2].desc}<',
    
    '>Solo tras la validación de estos requisitos por nuestro departamento legal, se otorgará acceso al cuarto de datos (Data Room) del activo, incluyendo métricas financieras, planos, permisologías y tasaciones oficiales.<': '>{t.kyc.closing}<',
}

for old, new in page_replacements.items():
    page_content = page_content.replace(old, new)

with open(page_path, "w", encoding="utf-8") as f:
    f.write(page_content)

print("Updates completed.")
