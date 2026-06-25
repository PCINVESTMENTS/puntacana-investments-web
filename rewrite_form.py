import re

with open("src/components/investments/OffMarketForm.tsx", "r", encoding="utf-8") as f:
    text = f.read()

def r(old, new):
    global text
    text = text.replace(old, new)

r('Enviar otro requerimiento', '{t.sendAnother}')
r('Formulario Técnico de Búsqueda Off-Market', '{t.title}')
r('Complete el siguiente requerimiento confidencial. Esto nos permitirá depurar y enviar los activos exactos que encajan en su tesis de inversión.', '{t.subtitle}')
r('Propiedades de Oportunidad y Remates', '{t.tabs.opportunities}')
r('Hoteles, Resorts y Terrenos', '{t.tabs.hotels}')
r('Nombre Completo / Representante Legal *', '{t.fields.name}')
r('Nombre de la Empresa o Fondo (Si aplica)', '{t.fields.company}')
r('Teléfono / WhatsApp Directo *', '{t.fields.phone}')
r('¿Cuál es el presupuesto asignado para la adquisición? *', '{t.fields.budget.label}')
r('Seleccione un presupuesto...', 'Seleccione / Select')
r('¿Qué tipo de propiedad busca? *', '{t.fields.opportunityType.label}')
r('Seleccione un tipo de propiedad...', 'Seleccione / Select')
r('Clasificación o Enfoque del Activo *', '{t.fields.hotelType.label}')
r('Seleccione un enfoque...', 'Seleccione / Select')
r('¿En qué zonas de la República Dominicana se enfoca? *', '{t.fields.location.label}')
r('Seleccione las zonas de interés...', 'Seleccione / Select')
r('¿Qué nivel de urgencia o disponibilidad de fondos tiene? *', '{t.fields.urgency.label}')
r('Seleccione nivel de urgencia...', 'Seleccione / Select')
r('¿Cuenta con Proof of Funds (POF) verificable en caso de ser requerido? *', '{t.fields.pof.label}')
r('Seleccione situación de fondos...', 'Seleccione / Select')
r('Describa sus criterios de retorno (Ej. ROI esperado) o detalles adicionales *', '{t.fields.description}')
r('Enviar Requerimiento Institucional', '{t.fields.submit}')

with open("src/components/investments/OffMarketForm.tsx", "w", encoding="utf-8") as f:
    f.write(text)

with open("src/app/[lang]/investments/off-market/page.tsx", "r", encoding="utf-8") as f:
    page = f.read()

def rp(old, new):
    global page
    page = page.replace(old, new)

rp('Private Placement Memorandum', '{t.hero.tag}')
rp('Portafolio Inmobiliario Privado: <br className="hidden md:block"/>', '{t.hero.title1} <br className="hidden md:block"/>')
rp('Bienvenido a nuestra división privada. Si busca adquirir un complejo hotelero, desarrollar un macro-proyecto, o capitalizar sobre propiedades de oportunidad y remates bancarios, ha llegado al ecosistema correcto.', '{t.hero.desc}')
rp('Adquisición de Activos Hoteleros y Tierras de Macro-Desarrollo', '{t.hotels.title}')
rp('El acceso a complejos hoteleros operativos, resorts en fase de reconversión y terrenos de escala macro en ubicaciones de altísimo interés exige un ecosistema de absoluta reserva. Por políticas de confidencialidad institucional y protección de las marcas operadoras, estos activos de gran envergadura jamás se exponen al escrutinio público ni a portales masivos.', '{t.hotels.p1}')
rp('Para el segmento de hospitalidad, el inversor o la corporación interesada debe formalizar una <strong className="text-white">{lang === "en" ? "Search Management Mandate Letter" : lang === "fr" ? "Lettre de Mandat de Recherche" : "Carta Mandato de Gestión de Búsqueda"}</strong>. Este instrumento legal autoriza formalmente a nuestra firma a iniciar la prospección, análisis técnico de permisología y debida diligencia de activos que se ajusten con precisión quirúrgica a los requerimientos de ubicación, número de llaves, rentabilidad y especificaciones de su fondo de inversión.', '{t.hotels.boxText}')

page = re.sub(
    r'<h2 className="text-3xl md:text-4xl font-serif text-white mb-8 uppercase tracking-wide">\s*Adquisición Estratégica de Activos en Liquidación, Adjudicados y Remates Bancarios <span className="text-luxury-gold block mt-2 text-2xl">\(Distressed Assets\)</span>\s*</h2>',
    '<h2 className="text-3xl md:text-4xl font-serif text-white mb-8 uppercase tracking-wide">{t.distressed.title1} <span className="text-luxury-gold block mt-2 text-2xl">{t.distressed.title2}</span></h2>',
    page
)

rp('El mercado inmobiliario premium genera, en coyunturas específicas, oportunidades líquidas donde el factor tiempo prevalece sobre el valor comercial del activo. Centralizamos de forma estrictamente privada el acceso a propiedades de alta gama bajo condiciones de ejecución rápida: remates por urgencia económica de propietarios privados y carteras de activos adjudicados o en procesos de remate bancario.', '{t.distressed.p1}')
rp('Estas propiedades —villas de lujo, estructuras residenciales inconclusas y parcelas preferenciales— son filtradas bajo un criterio riguroso: deben presentar un <strong className="text-luxury-gold">{lang === "en" ? "substantial discount compared to their actual market appraisal value" : lang === "fr" ? "remise substantielle par rapport à leur valeur d\'évaluation réelle sur le marché" : "descuento sustancial respecto a su valor de tasación real en el mercado"}</strong>.', '{t.distressed.p2}')
rp('Debido a la naturaleza legal y de velocidad de capital que exigen estas transacciones, estos activos se gestionan bajo estricto radar, protegiendo la identidad de las instituciones financieras involucradas.', '{t.distressed.p3}')

rp('Protocolo KYC y Prueba de Fondos (POF)', '{t.kyc.title}')
rp('El acceso a cualquier activo de nuestro portafolio Off-Market requiere el estricto cumplimiento del siguiente protocolo de cumplimiento legal y financiero:', '{t.kyc.desc}')

rp('Firma de NDA (Non-Disclosure Agreement)', '{t.kyc.items[0].title}')
rp('Acuerdo de confidencialidad inquebrantable que protege tanto la identidad del vendedor/institución bancaria como la del inversor o fondo adquiriente.', '{t.kyc.items[0].desc}')

rp('Proof of Funds (POF)', '{t.kyc.items[1].title}')
rp('Verificación de capacidad financiera líquida. Nuestro comité requiere evidencia bancaria certificada reciente que avale la capacidad de compra del activo objetivo.', '{t.kyc.items[1].desc}')

rp('Debida Diligencia Corporativa (KYC)', '{t.kyc.items[2].title}')
rp('Identificación del beneficiario final (UBO), origen de los fondos y perfilamiento corporativo para cumplir con las normativas locales e internacionales de prevención de lavado de activos.', '{t.kyc.items[2].desc}')

rp('Solo tras la validación de estos requisitos por nuestro departamento legal, se otorgará acceso al cuarto de datos (Data Room) del activo, incluyendo métricas financieras, planos, permisologías y tasaciones oficiales.', '{t.kyc.closing}')

with open("src/app/[lang]/investments/off-market/page.tsx", "w", encoding="utf-8") as f:
    f.write(page)
