const fs = require('fs');

const tsPath = './src/data/properties.ts';
const jsPath = './src/data/properties.js';

let tsContent = fs.readFileSync(tsPath, 'utf-8');
let jsContent = fs.readFileSync(jsPath, 'utf-8');

const propertyData = `
    {
        id: 1000,
        slug: "villa-canoa-lujo-frente-al-lago-puntacana-resort",
        title: "Villa Canoa | Lujo Frente al Lago en Puntacana Resort & Club",
        location: "puntacana",
        locationLabel: "Punta Cana Resort & Club",
        type: "villa",
        status: "sale",
        price: 0,
        image: "/images/properties/villa-canoa-cap-cana/4.jpg",
        beds: 5,
        baths: 6,
        area: 980,
        lotSize: 1950,
        gallery: [
            "/images/properties/villa-canoa-cap-cana/4.jpg",
            "/images/properties/villa-canoa-cap-cana/5.png",
            "/images/properties/villa-canoa-cap-cana/1.jpg",
            "/images/properties/villa-canoa-cap-cana/2.jpg",
            "/images/properties/villa-canoa-cap-cana/3.jpg"
        ],
        features: {
            en: ["Lake View", "Infinity Pool", "Sunken Seating", "Double Height Ceilings", "Cold & Hot Kitchens", "Guest Room on 1st Floor", "Home Office", "Private Spa Bathrooms", "Maid's Quarters", "Access to 45 Holes of Golf", "Private Beach Access"],
            es: ["Vista al Lago", "Piscina Infinity", "Sala Hundida", "Techos Doble Altura", "Cocina Fría y Caliente", "Habitación de Huéspedes en 1er Nivel", "Oficina (Home Office)", "Baños tipo Spa", "2 Habitaciones de Servicio", "Acceso a Golf de Campeonato", "Acceso a Playa Privada"],
            fr: ["Vue sur le Lac", "Piscine à Débordement", "Salon Encaissé", "Plafonds Double Hauteur", "Cuisine Froide et Chaude", "Chambre d'Amis au RDC", "Bureau", "Salles de Bain Spa", "Chambres de Bonne", "Accès Golf 45 Trous", "Accès Plage Privée"]
        },
        amenities: {
            en: ["Recreational Lake", "5 Miles of White Sand Beaches", "13 Freshwater Springs", "Championship Golf", "World-Class Restaurants", "Marina", "Equestrian Center", "Gated Community", "24/7 Security"],
            es: ["Lago Recreacional", "5 Millas de Playas de Arena Blanca", "13 Manantiales de Agua Dulce", "Golf de Campeonato", "Restaurantes de Clase Mundial", "Marina", "Centro Ecuestre", "Comunidad Cerrada", "Seguridad 24/7"],
            fr: ["Lac Récréatif", "5 Miles de Plages de Sable Blanc", "13 Sources d'Eau Douce", "Golf de Championnat", "Restaurants de Classe Mondiale", "Marina", "Centre Équestre", "Communauté Fermée", "Sécurité 24/7"]
        },
        description: {
            es: \`
<p>Con una ubicación privilegiada y un diseño contemporáneo, <strong>Villa Canoa</strong> posee todas las características para ser un hogar de ensueño. Ubicada en la exclusiva comunidad <strong>Lagos</strong> dentro de <strong>Puntacana Resort & Club</strong>, el destino preferido del Caribe por su belleza, exclusividad y clima privilegiado.</p>

<h3>Arquitectura de Autor y Acabados Premium</h3>
<p>Su arquitectura es una magistral mezcla de lo contemporáneo y tropical, con detalles de minimalismo <em>Japandi</em> que otorgan una sensación de armonía y equilibrio absoluto. En los materiales predomina el uso de madera noble y acabados naturales, combinados con elementos modernos como acero, aluminio y vidrio.</p>
<ul class="list-disc pl-5 mt-4 space-y-2">
    <li>Pisos de piedra Coralina de la más alta calidad.</li>
    <li>Barandas de vidrio templado en escaleras y balcones.</li>
    <li>Puertas y ebanistería en madera preciosa.</li>
</ul>

<h3>Distribución del Primer Nivel</h3>
<ul class="list-disc pl-5 mt-4 space-y-2">
    <li><strong>Imponente Entrada:</strong> Elegante recibidor (Hall) de doble altura y medio baño de visitas que dan paso a la majestuosidad del interior.</li>
    <li><strong>Área Social:</strong> Salón principal y comedor en concepto abierto con doble altura, rodeados de amplios ventanales de vidrio y aluminio negro que conectan fluidamente con la terraza y la piscina.</li>
    <li><strong>Cocinas de Chef:</strong> Dispone de cocina fría y cocina caliente, diseño moderno y funcional ideal para personalizar. Incluye isla central con topes de madera laminada y cuarzo.</li>
    <li><strong>Estudio (TV Room):</strong> Ambiente cálido climatizado con bar integrado.</li>
    <li><strong>Exteriores de Ensueño:</strong> Amplia terraza con piscina infinity, sala hundida (sunken seating), gazebo y BBQ, rodeados de un jardín tropical con vista espectacular al lago.</li>
    <li><strong>Habitación de Huéspedes:</strong> Ubicada en planta baja con baño privado y clóset.</li>
    <li><strong>Área de Servicio:</strong> Área de lavado, comedor para empleados y 2 habitaciones de servicio con baño. Garaje techado y estacionamientos adicionales.</li>
</ul>

<h3>Distribución del Segundo Nivel</h3>
<ul class="list-disc pl-5 mt-4 space-y-2">
    <li>Cuatro (4) lujosas habitaciones, cada una con su propio baño privado y walk-in clóset.</li>
    <li>Espacio dedicado para oficina en casa (Home Office).</li>
    <li>Amplios balcones con vistas panorámicas al lago y los jardines.</li>
</ul>

<h3>Santuario de Baños</h3>
<p>Diseñados como spas privados, revestidos completamente en Coralina con cálidos toques de madera. Cuentan con duchas empotradas, grifería de alta gama, grandes espejos e iluminación elegante. Los baños principales (Master) incluyen bañera exenta y lavamanos doble.</p>

<h3>Comunidad Lagos y Amenidades del Resort</h3>
<p>Villa Canoa se encuentra en <strong>Lagos</strong>, la comunidad residencial más nueva y excepcional dentro de Puntacana Resort & Club, diseñada alrededor de extensos cuerpos de agua dulce. A minutos del Aeropuerto Internacional de Punta Cana, los residentes disfrutan de un estilo de vida de clase mundial:</p>
<ul class="list-disc pl-5 mt-4 space-y-2">
    <li>Lago recreacional para deportes acuáticos no motorizados.</li>
    <li>5 millas de playas de arena blanca prístina.</li>
    <li>13 manantiales naturales de agua dulce (Reserva Ecológica Ojos Indígenas).</li>
    <li>45 hoyos de golf de campeonato (Corales y La Cana).</li>
    <li>8 restaurantes de clase mundial, marina y centro ecuestre.</li>
</ul>\`,
            en: \`
<p>With a privileged location and contemporary design, <strong>Villa Canoa</strong> has all the characteristics to be a dream home. Located in the exclusive <strong>Lagos</strong> community within <strong>Puntacana Resort & Club</strong>, the Caribbean's preferred destination for its beauty, exclusivity, and privileged climate.</p>

<h3>Signature Architecture & Premium Finishes</h3>
<p>Its architecture is a masterful blend of contemporary and tropical, with <em>Japandi</em> minimalist details that provide a sense of absolute harmony and balance. Noble wood and natural finishes dominate the materials, combined with modern elements such as steel, aluminum, and glass.</p>
<ul class="list-disc pl-5 mt-4 space-y-2">
    <li>Highest quality Coral stone floors.</li>
    <li>Tempered glass railings on stairs and balconies.</li>
    <li>Precious wood doors and cabinetry.</li>
</ul>

<h3>First Level Layout</h3>
<ul class="list-disc pl-5 mt-4 space-y-2">
    <li><strong>Imposing Entrance:</strong> Elegant double-height lobby (Hall) and a guest half-bath that lead to the majesty of the interior.</li>
    <li><strong>Social Area:</strong> Main living and dining rooms in an open concept with double height ceilings, surrounded by large glass and black aluminum windows that connect fluidly with the terrace and pool.</li>
    <li><strong>Chef's Kitchens:</strong> Features both cold and hot kitchens, with a modern and functional design ideal for customization. Includes a central island with laminated wood and quartz countertops.</li>
    <li><strong>Study (TV Room):</strong> Warm air-conditioned environment with an integrated bar.</li>
    <li><strong>Dream Exteriors:</strong> Large terrace with an infinity pool, sunken seating, gazebo, and BBQ, surrounded by a tropical garden with spectacular lake views.</li>
    <li><strong>Guest Bedroom:</strong> Located on the ground floor with a private bathroom and closet.</li>
    <li><strong>Service Area:</strong> Laundry area, employee dining room, and 2 service bedrooms with a bathroom. Covered garage and additional parking.</li>
</ul>

<h3>Second Level Layout</h3>
<ul class="list-disc pl-5 mt-4 space-y-2">
    <li>Four (4) luxurious bedrooms, each with its own private bathroom and walk-in closet.</li>
    <li>Dedicated space for a Home Office.</li>
    <li>Spacious balconies with panoramic views of the lake and gardens.</li>
</ul>

<h3>Bathroom Sanctuaries</h3>
<p>Designed as private spas, completely clad in Coral stone with warm touches of wood. They feature built-in showers, high-end fixtures, large mirrors, and elegant lighting. The main (Master) bathrooms include a freestanding bathtub and double sinks.</p>

<h3>Lagos Community & Resort Amenities</h3>
<p>Villa Canoa is located in <strong>Lagos</strong>, the newest and most exceptional residential community within Puntacana Resort & Club, designed around extensive bodies of freshwater. Minutes from Punta Cana International Airport, residents enjoy a world-class lifestyle:</p>
<ul class="list-disc pl-5 mt-4 space-y-2">
    <li>Recreational lake for non-motorized water sports.</li>
    <li>5 miles of pristine white sand beaches.</li>
    <li>13 natural freshwater springs (Ojos Indígenas Ecological Reserve).</li>
    <li>45 holes of championship golf (Corales and La Cana).</li>
    <li>8 world-class restaurants, a marina, and an equestrian center.</li>
</ul>\`,
            fr: \`
<p>Bénéficiant d'un emplacement privilégié et d'un design contemporain, la <strong>Villa Canoa</strong> possède toutes les caractéristiques pour être une maison de rêve. Située dans la communauté exclusive de <strong>Lagos</strong> au sein du <strong>Puntacana Resort & Club</strong>, la destination préférée des Caraïbes pour sa beauté, son exclusivité et son climat privilégié.</p>

<h3>Architecture Signature et Finitions Premium</h3>
<p>Son architecture est un mélange magistral de contemporain et de tropical, avec des détails minimalistes <em>Japandi</em> qui procurent une sensation d'harmonie et d'équilibre absolus. Les bois nobles et les finitions naturelles dominent les matériaux, combinés à des éléments modernes tels que l'acier, l'aluminium et le verre.</p>
<ul class="list-disc pl-5 mt-4 space-y-2">
    <li>Sols en pierre de corail de la plus haute qualité.</li>
    <li>Garde-corps en verre trempé sur les escaliers et les balcons.</li>
    <li>Portes et boiseries en bois précieux.</li>
</ul>

<h3>Aménagement du Premier Niveau</h3>
<ul class="list-disc pl-5 mt-4 space-y-2">
    <li><strong>Entrée Imposante:</strong> Élégant hall à double hauteur et une demi-salle de bain pour invités qui mènent à la majesté de l'intérieur.</li>
    <li><strong>Espace Social:</strong> Salon et salle à manger principaux à aire ouverte avec des plafonds à double hauteur, entourés de grandes fenêtres en verre et en aluminium noir qui se connectent de manière fluide avec la terrasse et la piscine.</li>
    <li><strong>Cuisines de Chef:</strong> Comprend des cuisines froides et chaudes, avec un design moderne et fonctionnel idéal pour la personnalisation. Comprend un îlot central avec des plans de travail en bois stratifié et en quartz.</li>
    <li><strong>Bureau (Salle TV):</strong> Environnement chaleureux et climatisé avec un bar intégré.</li>
    <li><strong>Extérieurs de Rêve:</strong> Grande terrasse avec piscine à débordement, salon encaissé (sunken seating), gazebo et barbecue, entourée d'un jardin tropical avec des vues spectaculaires sur le lac.</li>
    <li><strong>Chambre d'Amis:</strong> Située au rez-de-chaussée avec salle de bain privée et placard.</li>
    <li><strong>Espace de Service:</strong> Buanderie, salle à manger pour le personnel et 2 chambres de service avec salle de bain. Garage couvert et parking supplémentaire.</li>
</ul>

<h3>Aménagement du Deuxième Niveau</h3>
<ul class="list-disc pl-5 mt-4 space-y-2">
    <li>Quatre (4) chambres luxueuses, chacune avec sa propre salle de bain privée et son dressing.</li>
    <li>Espace dédié pour un bureau à domicile (Home Office).</li>
    <li>Balcons spacieux avec vue panoramique sur le lac et les jardins.</li>
</ul>

<h3>Sanctuaires de Salles de Bain</h3>
<p>Conçues comme des spas privés, entièrement revêtues de pierre de corail avec des touches chaleureuses de bois. Elles disposent de douches encastrées, d'installations haut de gamme, de grands miroirs et d'un éclairage élégant. Les salles de bain principales (Master) comprennent une baignoire autoportante et une double vasque.</p>

<h3>Communauté Lagos et Commodités du Complexe</h3>
<p>La Villa Canoa est située à <strong>Lagos</strong>, la communauté résidentielle la plus récente et la plus exceptionnelle du Puntacana Resort & Club, conçue autour de vastes étendues d'eau douce. À quelques minutes de l'aéroport international de Punta Cana, les résidents profitent d'un style de vie de classe mondiale:</p>
<ul class="list-disc pl-5 mt-4 space-y-2">
    <li>Lac récréatif pour les sports nautiques non motorisés.</li>
    <li>5 miles de plages de sable blanc immaculées.</li>
    <li>13 sources naturelles d'eau douce (Réserve écologique Ojos Indígenas).</li>
    <li>45 trous de golf de championnat (Corales et La Cana).</li>
    <li>8 restaurants de classe mondiale, une marina et un centre équestre.</li>
</ul>\`
        },
        seo: {
            title: {
                en: "Villa Canoa | Lakefront Luxury in Puntacana Resort & Club",
                es: "Villa Canoa | Lujo Frente al Lago en Puntacana Resort & Club",
                fr: "Villa Canoa | Luxe au Bord du Lac à Puntacana Resort & Club"
            },
            description: {
                en: "Exclusive 5-bedroom lakefront luxury villa in Lagos, Puntacana Resort & Club. Features Japandi architecture, infinity pool, sunken seating, and access to private beaches and championship golf.",
                es: "Exclusiva villa de lujo de 5 habitaciones frente al lago en Lagos, Puntacana Resort & Club. Arquitectura Japandi, piscina infinity, sala hundida y acceso a playas privadas y golf.",
                fr: "Villa de luxe exclusive de 5 chambres au bord du lac à Lagos, Puntacana Resort. Architecture Japandi, piscine à débordement et accès aux plages privées et au golf."
            },
            keywords: {
                en: ["Villa Canoa", "Puntacana Resort and Club", "Lagos Community Punta Cana", "Lakefront Villa Punta Cana", "Luxury Real Estate Dominican Republic", "Buy Villa in Punta Cana", "5 Bedroom Villa Punta Cana", "Golf Resort Property"],
                es: ["Villa Canoa", "Puntacana Resort and Club", "Comunidad Lagos Punta Cana", "Villa Frente al Lago Punta Cana", "Bienes Raíces de Lujo República Dominicana", "Comprar Villa en Punta Cana", "Villa 5 Habitaciones Punta Cana"],
                fr: ["Villa Canoa", "Puntacana Resort and Club", "Communauté Lagos Punta Cana", "Villa Bord de Lac Punta Cana", "Immobilier de Luxe République Dominicaine", "Acheter Villa Punta Cana"]
            }
        }
    },`;

// Find where the properties array starts: export const properties: Property[] = [
const tsInsertionIndex = tsContent.indexOf('export const properties: Property[] = [') + 'export const properties: Property[] = ['.length;
tsContent = tsContent.slice(0, tsInsertionIndex) + propertyData + tsContent.slice(tsInsertionIndex);
fs.writeFileSync(tsPath, tsContent);

const jsInsertionIndex = jsContent.indexOf('export const properties = [') + 'export const properties = ['.length;
jsContent = jsContent.slice(0, jsInsertionIndex) + propertyData + jsContent.slice(jsInsertionIndex);
fs.writeFileSync(jsPath, jsContent);

console.log("Successfully inserted Villa Canoa into properties.ts and properties.js");
