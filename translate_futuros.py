import re

with open("src/app/[lang]/futuros-proyectos/page.tsx", "r") as f:
    content = f.read()

translations = [
    (
        '"Un Desarrollo Ecológico de Nueva Generación"',
        "{lang === 'en' ? 'A Next-Generation Ecological Development' : lang === 'fr' ? 'Un Développement Écologique de Nouvelle Génération' : 'Un Desarrollo Ecológico de Nueva Generación'}"
    ),
    (
        '"Muy pronto llegará un proyecto concebido para transformar la manera de vivir, invertir y conectar con la naturaleza."',
        "{lang === 'en' ? 'Very soon, a project designed to transform the way you live, invest, and connect with nature will arrive.' : lang === 'fr' ? 'Très bientôt, un projet conçu pour transformer votre façon de vivre, d\\'investir et de vous connecter avec la nature verra le jour.' : 'Muy pronto llegará un proyecto concebido para transformar la manera de vivir, invertir y conectar con la naturaleza.'}"
    ),
    (
        '"Diseñado para integrar arquitectura moderna tropical, sostenibilidad, bienestar y experiencias hoteleras premium en un entorno natural verdaderamente extraordinario."',
        "{lang === 'en' ? 'Designed to integrate modern tropical architecture, sustainability, wellness, and premium hotel experiences in a truly extraordinary natural environment.' : lang === 'fr' ? 'Conçu pour intégrer une architecture tropicale moderne, la durabilité, le bien-être et des expériences hôtelières premium dans un environnement naturel véritablement extraordinaire.' : 'Diseñado para integrar arquitectura moderna tropical, sostenibilidad, bienestar y experiencias hoteleras premium en un entorno natural verdaderamente extraordinario.'}"
    ),
    (
        '"Ubicado sobre una impresionante propiedad de aproximadamente 50,000 m² rodeada de exuberante vegetación y un río natural que recorre toda la parte posterior del proyecto, este concepto nace con una visión clara:"',
        "{lang === 'en' ? 'Located on an impressive property of approximately 50,000 m² surrounded by lush vegetation and a natural river running along the entire back of the project, this concept is born with a clear vision:' : lang === 'fr' ? 'Situé sur une impressionnante propriété d\\'environ 50 000 m² entourée d\\'une végétation luxuriante et d\\'une rivière naturelle traversant toute la partie arrière du projet, ce concept est né avec une vision claire :' : 'Ubicado sobre una impresionante propiedad de aproximadamente 50,000 m² rodeada de exuberante vegetación y un río natural que recorre toda la parte posterior del proyecto, este concepto nace con una visión clara:'}"
    ),
    (
        '"Crear un santuario tropical donde la naturaleza y el lujo convivan en perfecta armonía."',
        "{lang === 'en' ? 'Create a tropical sanctuary where nature and luxury coexist in perfect harmony.' : lang === 'fr' ? 'Créer un sanctuaire tropical où nature et luxe coexistent en parfaite harmonie.' : 'Crear un santuario tropical donde la naturaleza y el lujo convivan en perfecta armonía.'}"
    ),
    (
        '">Respeto por el Entorno<',
        ">{lang === 'en' ? 'Respect for the Environment' : lang === 'fr' ? 'Respect de l\\'Environnement' : 'Respeto por el Entorno'}<"
    ),
    (
        '"La topografía natural del terreno"',
        "lang === 'en' ? 'The natural topography of the land' : lang === 'fr' ? 'La topographie naturelle du terrain' : 'La topografía natural del terreno'"
    ),
    (
        '"La vegetación existente"',
        "lang === 'en' ? 'The existing vegetation' : lang === 'fr' ? 'La végétation existante' : 'La vegetación existente'"
    ),
    (
        '"La integración visual con el río"',
        "lang === 'en' ? 'Visual integration with the river' : lang === 'fr' ? 'Intégration visuelle avec la rivière' : 'La integración visual con el río'"
    ),
    (
        '"La circulación ecológica peatonal"',
        "lang === 'en' ? 'Ecological pedestrian circulation' : lang === 'fr' ? 'Circulation piétonne écologique' : 'La circulación ecológica peatonal'"
    ),
    (
        '"La armonía entre arquitectura y paisaje"',
        "lang === 'en' ? 'Harmony between architecture and landscape' : lang === 'fr' ? 'Harmonie entre architecture et paysage' : 'La armonía entre arquitectura y paisaje'"
    ),
    (
        '">Cada espacio ha sido pensado para generar una conexión directa con la naturaleza:<',
        ">{lang === 'en' ? 'Every space has been designed to generate a direct connection with nature:' : lang === 'fr' ? 'Chaque espace a été conçu pour générer une connexion directe avec la nature :' : 'Cada espacio ha sido pensado para generar una conexión directa con la naturaleza:'}<"
    ),
    (
        '"Senderos ecológicos entre árboles tropicales."',
        "{lang === 'en' ? 'Ecological trails among tropical trees.' : lang === 'fr' ? 'Sentiers écologiques parmi les arbres tropicaux.' : 'Senderos ecológicos entre árboles tropicales.'}"
    ),
    (
        '"Miradores y decks estratégicos frente al río."',
        "{lang === 'en' ? 'Strategic viewpoints and decks facing the river.' : lang === 'fr' ? 'Points de vue stratégiques et terrasses face à la rivière.' : 'Miradores y decks estratégicos frente al río.'}"
    ),
    (
        '"Espacios abiertos para relajación, meditación y bienestar."',
        "{lang === 'en' ? 'Open spaces for relaxation, meditation, and wellness.' : lang === 'fr' ? 'Espaces ouverts pour la relaxation, la méditation et le bien-être.' : 'Espacios abiertos para relajación, meditación y bienestar.'}"
    ),
    (
        '"Áreas verdes preservadas y planes de reforestación nativa."',
        "{lang === 'en' ? 'Preserved green areas and native reforestation plans.' : lang === 'fr' ? 'Espaces verts préservés et plans de reforestation indigène.' : 'Áreas verdes preservadas y planes de reforestación nativa.'}"
    ),
    (
        '"Diseño sostenible y tropical contemporáneo con acabados minimalistas orgánicos."',
        "{lang === 'en' ? 'Sustainable and contemporary tropical design with organic minimalist finishes.' : lang === 'fr' ? 'Design tropical contemporain et durable avec des finitions minimalistes organiques.' : 'Diseño sostenible y tropical contemporáneo con acabados minimalistas orgánicos.'}"
    ),
    (
        '"Aquí, la naturaleza no será un complemento. Será el corazón del proyecto."',
        "{lang === 'en' ? 'Here, nature will not be an accessory. It will be the heart of the project.' : lang === 'fr' ? 'Ici, la nature ne sera pas un accessoire. Ce sera le cœur du projet.' : 'Aquí, la naturaleza no será un complemento. Será el corazón del proyecto.'}"
    ),
    (
        '">🌱 Agricultura Ecológica y Consumo Sostenible<',
        ">{lang === 'en' ? '🌱 Organic Farming and Sustainable Consumption' : lang === 'fr' ? '🌱 Agriculture Biologique et Consommation Durable' : '🌱 Agricultura Ecológica y Consumo Sostenible'}<"
    ),
    (
        '"Como parte fundamental del concepto ecológico del desarrollo, el proyecto contará con áreas especialmente destinadas al cultivo de vegetales, frutas, hierbas aromáticas y algunos de los alimentos que serán consumidos dentro del complejo."',
        "{lang === 'en' ? 'As a fundamental part of the ecological concept, the project will have areas specially designated for growing vegetables, fruits, aromatic herbs, and some of the food to be consumed within the complex.' : lang === 'fr' ? 'Élément fondamental du concept écologique, le projet comprendra des zones spécialement désignées pour la culture de légumes, fruits, herbes aromatiques et une partie des aliments qui seront consommés dans le complexe.' : 'Como parte fundamental del concepto ecológico del desarrollo, el proyecto contará con áreas especialmente destinadas al cultivo de vegetales, frutas, hierbas aromáticas y algunos de los alimentos que serán consumidos dentro del complejo.'}"
    ),
    (
        '"El objetivo es integrar un modelo de vida más saludable, sostenible y conectado con la tierra, permitiendo que parte de la experiencia gastronómica del proyecto provenga directamente de sus propios cultivos."',
        "{lang === 'en' ? 'The goal is to integrate a healthier, more sustainable lifestyle connected to the earth, allowing part of the project\\'s gastronomic experience to come directly from its own crops.' : lang === 'fr' ? 'L\\'objectif est d\\'intégrer un mode de vie plus sain, durable et connecté à la terre, permettant à une partie de l\\'expérience gastronomique du projet de provenir directement de ses propres cultures.' : 'El objetivo es integrar un modelo de vida más saludable, sostenible y conectado con la tierra, permitiendo que parte de la experiencia gastronómica del proyecto provenga directamente de sus propios cultivos.'}"
    ),
    (
        '">Estas áreas incluirán:<',
        ">{lang === 'en' ? 'These areas will include:' : lang === 'fr' ? 'Ces zones comprendront :' : 'Estas áreas incluirán:'}<"
    ),
    (
        '"> Huertos ecológicos organizados.<',
        ">{lang === 'en' ? ' Organized organic orchards.' : lang === 'fr' ? ' Vergers biologiques organisés.' : ' Huertos ecológicos organizados.'}<"
    ),
    (
        '"> Cultivo de vegetales frescos.<',
        ">{lang === 'en' ? ' Fresh vegetable farming.' : lang === 'fr' ? ' Culture de légumes frais.' : ' Cultivo de vegetales frescos.'}<"
    ),
    (
        '"> Jardines de hierbas y especias.<',
        ">{lang === 'en' ? ' Herb and spice gardens.' : lang === 'fr' ? ' Jardins d\\'herbes et d\\'épices.' : ' Jardines de hierbas y especias.'}<"
    ),
    (
        '"> Producción tropical selectiva.<',
        ">{lang === 'en' ? ' Selective tropical production.' : lang === 'fr' ? ' Production tropicale sélective.' : ' Producción tropical selectiva.'}<"
    ),
    (
        '"> Espacios agrícolas para consumo interno.<',
        ">{lang === 'en' ? ' Agricultural spaces for internal consumption.' : lang === 'fr' ? ' Espaces agricoles pour consommation interne.' : ' Espacios agrícolas para consumo interno.'}<"
    ),
    (
        '">Parte de estos productos podrán ser utilizados en:<',
        ">{lang === 'en' ? 'Part of these products may be used in:' : lang === 'fr' ? 'Une partie de ces produits pourra être utilisée dans :' : 'Parte de estos productos podrán ser utilizados en:'}<"
    ),
    (
        '">El restaurante principal.<',
        ">{lang === 'en' ? 'The main restaurant.' : lang === 'fr' ? 'Le restaurant principal.' : 'El restaurante principal.'}<"
    ),
    (
        '">La Sala de venta, bar y lounge del club de vacaciones, potenciando un concepto de mixología orgánica.<',
        ">{lang === 'en' ? 'The sales room, bar, and lounge of the vacation club, enhancing an organic mixology concept.' : lang === 'fr' ? 'La salle des ventes, le bar et le salon du club de vacances, renforçant un concept de mixologie biologique.' : 'La Sala de venta, bar y lounge del club de vacaciones, potenciando un concepto de mixología orgánica.'}<"
    ),
    (
        '">Experiencias culinarias farm-to-table (de la tierra a la mesa).<',
        ">{lang === 'en' ? 'Farm-to-table culinary experiences.' : lang === 'fr' ? 'Expériences culinaires de la ferme à la table.' : 'Experiencias culinarias farm-to-table (de la tierra a la mesa).'}<"
    ),
    (
        '">Actividades ecológicas y educativas para huéspedes y residentes.<',
        ">{lang === 'en' ? 'Ecological and educational activities for guests and residents.' : lang === 'fr' ? 'Activités écologiques et éducatives pour invités et résidents.' : 'Actividades ecológicas y educativas para huéspedes y residentes.'}<"
    ),
    (
        '"Este enfoque busca promover la alimentación saludable, la producción sostenible y experiencias ecológicas auténticas. Más que un proyecto turístico, será un estilo de vida enfocado en la sostenibilidad y el bienestar integral."',
        "{lang === 'en' ? 'This approach seeks to promote healthy eating, sustainable production, and authentic ecological experiences. More than a tourism project, it will be a lifestyle focused on sustainability and comprehensive wellness.' : lang === 'fr' ? 'Cette approche vise à promouvoir une alimentation saine, une production durable et des expériences écologiques authentiques. Plus qu\\'un projet touristique, ce sera un style de vie axé sur la durabilité et le bien-être global.' : 'Este enfoque busca promover la alimentación saludable, la producción sostenible y experiencias ecológicas auténticas. Más que un proyecto turístico, será un estilo de vida enfocado en la sostenibilidad y el bienestar integral.'}"
    ),
    (
        '"El proyecto combinará de forma magistral residencias vacacionales exclusivas, concepto hotelero boutique, espacios wellness de clase mundial, experiencias eco-luxury y amenidades premium integradas a la naturaleza."',
        "{lang === 'en' ? 'The project will masterfully combine exclusive vacation residences, a boutique hotel concept, world-class wellness spaces, eco-luxury experiences, and premium amenities integrated into nature.' : lang === 'fr' ? 'Le projet combinera de manière magistrale des résidences de vacances exclusives, un concept d\\'hôtel-boutique, des espaces de bien-être de classe mondiale, des expériences éco-luxe et des commodités haut de gamme intégrées à la nature.' : 'El proyecto combinará de forma magistral residencias vacacionales exclusivas, concepto hotelero boutique, espacios wellness de clase mundial, experiencias eco-luxury y amenidades premium integradas a la naturaleza.'}"
    ),
    (
        '"Las futuras unidades estarán conformadas por modernas cabañas tropicales de diseño arquitectónico único, rodeadas de jardines, senderos naturales y vistas privilegiadas hacia el río y las áreas verdes."',
        "{lang === 'en' ? 'The future units will consist of modern tropical cabins with a unique architectural design, surrounded by gardens, nature trails, and privileged views of the river and green areas.' : lang === 'fr' ? 'Les futures unités seront composées de cabines tropicales modernes au design architectural unique, entourées de jardins, de sentiers naturels et offrant des vues privilégiées sur la rivière et les espaces verts.' : 'Las futuras unidades estarán conformadas por modernas cabañas tropicales de diseño arquitectónico único, rodeadas de jardines, senderos naturales y vistas privilegiadas hacia el río y las áreas verdes.'}"
    ),
    (
        '"Para garantizar un desarrollo ágil, eficiente y perfectamente integrado al entorno, la modulación estructural de las cabañas y villas está proyectada utilizando bloques de 6 pulgadas, logrando muros limpios, ligeros y de una estética minimalista orgánica impecable."',
        "{lang === 'en' ? 'To ensure agile, efficient development perfectly integrated into the environment, the structural modulation of the cabins and villas is planned using 6-inch blocks, achieving clean, lightweight walls with an impeccable organic minimalist aesthetic.' : lang === 'fr' ? 'Pour garantir un développement agile, efficace et parfaitement intégré à l\\'environnement, la modulation structurelle des cabines et des villas est prévue à l\\'aide de blocs de 6 pouces, obtenant ainsi des murs épurés et légers avec une esthétique minimaliste organique impeccable.' : 'Para garantizar un desarrollo ágil, eficiente y perfectamente integrado al entorno, la modulación estructural de las cabañas y villas está proyectada utilizando bloques de 6 pulgadas, logrando muros limpios, ligeros y de una estética minimalista orgánica impecable.'}"
    ),
    (
        '">Cada detalle buscará ofrecer:<',
        ">{lang === 'en' ? 'Every detail will seek to offer:' : lang === 'fr' ? 'Chaque détail cherchera à offrir :' : 'Cada detalle buscará ofrecer:'}<"
    ),
    (
        '">Privacidad y Paz<',
        ">{lang === 'en' ? 'Privacy and Peace' : lang === 'fr' ? 'Intimité et Paix' : 'Privacidad y Paz'}<"
    ),
    (
        '">Conexión Natural<',
        ">{lang === 'en' ? 'Natural Connection' : lang === 'fr' ? 'Connexion Naturelle' : 'Conexión Natural'}<"
    ),
    (
        '">Alta Rentabilidad<',
        ">{lang === 'en' ? 'High Profitability' : lang === 'fr' ? 'Haute Rentabilité' : 'Alta Rentabilidad'}<"
    ),
    (
        '">Experiencias<',
        ">{lang === 'en' ? 'Experiences' : lang === 'fr' ? 'Expériences' : 'Experiencias'}<"
    ),
    (
        '">Cabañas Tropicales<',
        ">{lang === 'en' ? 'Tropical Cabins' : lang === 'fr' ? 'Cabines Tropicales' : 'Cabañas Tropicales'}<"
    ),
    (
        '">Casa Club Panorámica<',
        ">{lang === 'en' ? 'Panoramic Clubhouse' : lang === 'fr' ? 'Clubhouse Panoramique' : 'Casa Club Panorámica'}<"
    ),
    (
        '">Piscinas Infinity<',
        ">{lang === 'en' ? 'Infinity Pools' : lang === 'fr' ? 'Piscines Infinity' : 'Piscinas Infinity'}<"
    ),
    (
        '">Área Wellness &amp; Spa<',
        ">{lang === 'en' ? 'Wellness & Spa Area' : lang === 'fr' ? 'Espace Bien-être et Spa' : 'Área Wellness &amp; Spa'}<"
    ),
    (
        '"El proyecto incluirá un portafolio de amenidades de primer nivel integrado en un ambiente tropical cuidadosamente diseñado."',
        "{lang === 'en' ? 'The project will include a portfolio of first-class amenities integrated into a carefully designed tropical environment.' : lang === 'fr' ? 'Le projet comprendra un portefeuille de commodités de premier ordre intégrées dans un environnement tropical soigneusement conçu.' : 'El proyecto incluirá un portafolio de amenidades de primer nivel integrado en un ambiente tropical cuidadosamente diseñado.'}"
    ),
    (
        'moreText="Ver todas las Amenidades"',
        'moreText={lang === "en" ? "See all Amenities" : lang === "fr" ? "Voir toutes les Commodités" : "Ver todas las Amenidades"}'
    ),
    (
        '">✓</span> Cabañas tropicales de diseño moderno<',
        '">✓</span> {lang === \'en\' ? \'Modern design tropical cabins\' : lang === \'fr\' ? \'Cabines tropicales au design moderne\' : \'Cabañas tropicales de diseño moderno\'}<'
    ),
    (
        '">✓</span> Hotel boutique ecológico<',
        '">✓</span> {lang === \'en\' ? \'Eco-boutique hotel\' : lang === \'fr\' ? \'Hôtel-boutique écologique\' : \'Hotel boutique ecológico\'}<'
    ),
    (
        '">✓</span> Casa Club panorámica<',
        '">✓</span> {lang === \'en\' ? \'Panoramic Clubhouse\' : lang === \'fr\' ? \'Clubhouse Panoramique\' : \'Casa Club panorámica\'}<'
    ),
    (
        '">✓</span> Sala de venta y Restaurante<',
        '">✓</span> {lang === \'en\' ? \'Sales room and Restaurant\' : lang === \'fr\' ? \'Salle de vente et Restaurant\' : \'Sala de venta y Restaurante\'}<'
    ),
    (
        '">✓</span> Piscinas infinity naturales<',
        '">✓</span> {lang === \'en\' ? \'Natural infinity pools\' : lang === \'fr\' ? \'Piscines infinity naturelles\' : \'Piscinas infinity naturales\'}<'
    ),
    (
        '">✓</span> Senderos ecológicos en el bosque<',
        '">✓</span> {lang === \'en\' ? \'Ecological trails in the forest\' : lang === \'fr\' ? \'Sentiers écologiques dans la forêt\' : \'Senderos ecológicos en el bosque\'}<'
    ),
    (
        '">✓</span> Área wellness &amp; spa al aire libre<',
        '">✓</span> {lang === \'en\' ? \'Outdoor wellness & spa area\' : lang === \'fr\' ? \'Espace bien-être et spa en plein air\' : \'Área wellness & spa al aire libre\'}<'
    ),
    (
        '">✓</span> Amenidades deportivas y recreación<',
        '">✓</span> {lang === \'en\' ? \'Sports amenities and recreation\' : lang === \'fr\' ? \'Commodités sportives et loisirs\' : \'Amenidades deportivas y recreación\'}<'
    ),
    (
        '">✓</span> Coworking para nómadas digitales<',
        '">✓</span> {lang === \'en\' ? \'Coworking for digital nomads\' : lang === \'fr\' ? \'Espace de coworking pour nomades numériques\' : \'Coworking para nómadas digitales\'}<'
    ),
    (
        '">✓</span> Miradores y áreas sociales<',
        '">✓</span> {lang === \'en\' ? \'Viewpoints and social areas\' : lang === \'fr\' ? \'Points de vue et espaces sociaux\' : \'Miradores y áreas sociales\'}<'
    ),
    (
        '">✓</span> Huertos y áreas de cultivo orgánico<',
        '">✓</span> {lang === \'en\' ? \'Orchards and organic farming areas\' : lang === \'fr\' ? \'Vergers et zones de culture biologique\' : \'Huertos y áreas de cultivo orgánico\'}<'
    ),
    (
        '"Transmite exclusividad, tranquilidad y conexión con el entorno."',
        "{lang === 'en' ? 'Conveys exclusivity, tranquility, and connection with the surroundings.' : lang === 'fr' ? 'Transmet exclusivité, tranquillité et connexion avec l\\'environnement.' : 'Transmite exclusividad, tranquilidad y conexión con el entorno.'}"
    ),
    (
        '"Además de ser un destino para vivir y desconectarse, el proyecto ha sido concebido bajo un innovador modelo de inversión turística."',
        "{lang === 'en' ? 'In addition to being a destination to live and disconnect, the project has been conceived under an innovative tourism investment model.' : lang === 'fr' ? 'En plus d\\'être une destination pour vivre et se déconnecter, le projet a été conçu selon un modèle d\\'investissement touristique innovant.' : 'Además de ser un destino para vivir y desconectarse, el proyecto ha sido concebido bajo un innovador modelo de inversión turística.'}"
    ),
    (
        '">🔑 Sistema Pool Hotelero<',
        ">{lang === 'en' ? '🔑 Hotel Pool System' : lang === 'fr' ? '🔑 Système de Pool Hôtelier' : '🔑 Sistema Pool Hotelero'}<"
    ),
    (
        '"Las unidades podrán integrarse a un sistema de operación hotelera permitiendo a los propietarios:"',
        "{lang === 'en' ? 'Units can be integrated into a hotel operation system allowing owners to:' : lang === 'fr' ? 'Les unités pourront être intégrées à un système d\\'exploitation hôtelière permettant aux propriétaires :' : 'Las unidades podrán integrarse a un sistema de operación hotelera permitiendo a los propietarios:'}"
    ),
    (
        '"Generar ingresos pasivos constantes"',
        "lang === 'en' ? 'Generate consistent passive income' : lang === 'fr' ? 'Générer des revenus passifs constants' : 'Generar ingresos pasivos constantes'"
    ),
    (
        '"Despreocuparse del mantenimiento y operación diaria"',
        "lang === 'en' ? 'Worry-free maintenance and daily operations' : lang === 'fr' ? 'Ne pas se soucier de l\\'entretien et de l\\'exploitation quotidienne' : 'Despreocuparse del mantenimiento y operación diaria'"
    ),
    (
        '"Disfrutar de la propiedad durante semanas específicas al año"',
        "lang === 'en' ? 'Enjoy the property during specific weeks of the year' : lang === 'fr' ? 'Profiter de la propriété pendant des semaines spécifiques de l\\'année' : 'Disfrutar de la propiedad durante semanas específicas al año'"
    ),
    (
        '"Maximizar la plusvalía de su inversión"',
        "lang === 'en' ? 'Maximize the capital gain of their investment' : lang === 'fr' ? 'Maximiser la plus-value de leur investissement' : 'Maximizar la plusvalía de su inversión'"
    ),
    (
        '">💰 Ventajas de Reservar en Planos<',
        ">{lang === 'en' ? '💰 Advantages of Pre-Construction Reservation' : lang === 'fr' ? '💰 Avantages de la Réservation sur Plan' : '💰 Ventajas de Reservar en Planos'}<"
    ),
    (
        '"El proyecto se encuentra en fase de diseño final, lo que representa una oportunidad inigualable para los primeros inversionistas:"',
        "{lang === 'en' ? 'The project is in its final design phase, representing an unparalleled opportunity for early investors:' : lang === 'fr' ? 'Le projet est dans sa phase finale de conception, représentant une opportunité inégalée pour les premiers investisseurs :' : 'El proyecto se encuentra en fase de diseño final, lo que representa una oportunidad inigualable para los primeros inversionistas:'}"
    ),
    (
        '"Asegurar los mejores precios de entrada"',
        "lang === 'en' ? 'Secure the best entry prices' : lang === 'fr' ? 'Garantir les meilleurs prix d\\'entrée' : 'Asegurar los mejores precios de entrada'"
    ),
    (
        '"Elegir las ubicaciones más premium (frente al río o áreas exclusivas)"',
        "lang === 'en' ? 'Choose the most premium locations (riverfront or exclusive areas)' : lang === 'fr' ? 'Choisir les emplacements les plus exclusifs (face à la rivière ou zones privées)' : 'Elegir las ubicaciones más premium (frente al río o áreas exclusivas)'"
    ),
    (
        '"Beneficiarse de la mayor curva de plusvalía antes de la inauguración"',
        "lang === 'en' ? 'Benefit from the highest appreciation curve before opening' : lang === 'fr' ? 'Bénéficier de la plus grande courbe de plus-value avant l\\'inauguration' : 'Beneficiarse de la mayor curva de plusvalía antes de la inauguración'"
    ),
    (
        '"Plan de pagos flexible durante la construcción"',
        "lang === 'en' ? 'Flexible payment plan during construction' : lang === 'fr' ? 'Plan de paiement flexible pendant la construction' : 'Plan de pagos flexible durante la construcción'"
    ),
    (
        '">Sé de los Primeros en Recibir la Información<',
        ">{lang === 'en' ? 'Be Among the First to Receive Information' : lang === 'fr' ? 'Soyez Parmi les Premiers à Recevoir l\\'Information' : 'Sé de los Primeros en Recibir la Información'}<"
    ),
    (
        '"Este proyecto saldrá a la venta muy pronto. Déjanos tus datos para recibir el brochure oficial, planos y precios de lanzamiento antes de que el proyecto sea público."',
        "{lang === 'en' ? 'This project will go on sale very soon. Leave us your details to receive the official brochure, floor plans, and launch prices before the project goes public.' : lang === 'fr' ? 'Ce projet sera mis en vente très bientôt. Laissez-nous vos coordonnées pour recevoir la brochure officielle, les plans et les prix de lancement avant que le projet ne soit rendu public.' : 'Este proyecto saldrá a la venta muy pronto. Déjanos tus datos para recibir el brochure oficial, planos y precios de lanzamiento antes de que el proyecto sea público.'}"
    ),
    (
        '">Nombre Completo<',
        ">{lang === 'en' ? 'Full Name' : lang === 'fr' ? 'Nom Complet' : 'Nombre Completo'}<"
    ),
    (
        'placeholder="Ej. Juan Pérez"',
        'placeholder={lang === "en" ? "E.g. John Doe" : lang === "fr" ? "Ex. Jean Dupont" : "Ej. Juan Pérez"}'
    ),
    (
        '">Correo Electrónico<',
        ">{lang === 'en' ? 'Email Address' : lang === 'fr' ? 'Adresse E-mail' : 'Correo Electrónico'}<"
    ),
    (
        'placeholder="tu@email.com"',
        'placeholder={lang === "en" ? "your@email.com" : lang === "fr" ? "votre@email.com" : "tu@email.com"}'
    ),
    (
        '">Teléfono / WhatsApp<',
        ">{lang === 'en' ? 'Phone / WhatsApp' : lang === 'fr' ? 'Téléphone / WhatsApp' : 'Teléfono / WhatsApp'}<"
    ),
    (
        'placeholder="+1 (555) 000-0000"',
        'placeholder="+1 (555) 000-0000"'
    ),
    (
        '">Notificarme del Lanzamiento<',
        ">{lang === 'en' ? 'Notify Me of the Launch' : lang === 'fr' ? 'Me Notifier du Lancement' : 'Notificarme del Lanzamiento'}<"
    )
]

for orig, new_text in translations:
    content = content.replace(orig, new_text)

# Also fix the inner content of ul arrays
content = content.replace(
    '["La topografía natural del terreno", "La vegetación existente", "La integración visual con el río", "La circulación ecológica peatonal", "La armonía entre arquitectura y paisaje"]',
    """[
        lang === 'en' ? 'The natural topography of the land' : lang === 'fr' ? 'La topographie naturelle du terrain' : 'La topografía natural del terreno',
        lang === 'en' ? 'The existing vegetation' : lang === 'fr' ? 'La végétation existante' : 'La vegetación existente',
        lang === 'en' ? 'Visual integration with the river' : lang === 'fr' ? 'Intégration visuelle avec la rivière' : 'La integración visual con el río',
        lang === 'en' ? 'Ecological pedestrian circulation' : lang === 'fr' ? 'Circulation piétonne écologique' : 'La circulación ecológica peatonal',
        lang === 'en' ? 'Harmony between architecture and landscape' : lang === 'fr' ? 'Harmonie entre architecture et paysage' : 'La armonía entre arquitectura y paisaje'
    ]"""
)

content = content.replace(
    '["Generar ingresos pasivos constantes", "Despreocuparse del mantenimiento y operación diaria", "Disfrutar de la propiedad durante semanas específicas al año", "Maximizar la plusvalía de su inversión"]',
    """[
        lang === 'en' ? 'Generate consistent passive income' : lang === 'fr' ? 'Générer des revenus passifs constants' : 'Generar ingresos pasivos constantes',
        lang === 'en' ? 'Worry-free maintenance and daily operations' : lang === 'fr' ? 'Ne pas se soucier de l\\'entretien et de l\\'exploitation quotidienne' : 'Despreocuparse del mantenimiento y operación diaria',
        lang === 'en' ? 'Enjoy the property during specific weeks of the year' : lang === 'fr' ? 'Profiter de la propriété pendant des semaines spécifiques de l\\'année' : 'Disfrutar de la propiedad durante semanas específicas al año',
        lang === 'en' ? 'Maximize the capital gain of their investment' : lang === 'fr' ? 'Maximiser la plus-value de leur investissement' : 'Maximizar la plusvalía de su inversión'
    ]"""
)

content = content.replace(
    '["Asegurar los mejores precios de entrada", "Elegir las ubicaciones más premium (frente al río o áreas exclusivas)", "Beneficiarse de la mayor curva de plusvalía antes de la inauguración", "Plan de pagos flexible durante la construcción"]',
    """[
        lang === 'en' ? 'Secure the best entry prices' : lang === 'fr' ? 'Garantir les meilleurs prix d\\'entrée' : 'Asegurar los mejores precios de entrada',
        lang === 'en' ? 'Choose the most premium locations (riverfront or exclusive areas)' : lang === 'fr' ? 'Choisir les emplacements les plus exclusifs (face à la rivière ou zones privées)' : 'Elegir las ubicaciones más premium (frente al río o áreas exclusivas)',
        lang === 'en' ? 'Benefit from the highest appreciation curve before opening' : lang === 'fr' ? 'Bénéficier de la plus grande courbe de plus-value avant l\\'inauguration' : 'Beneficiarse de la mayor curva de plusvalía antes de la inauguración',
        lang === 'en' ? 'Flexible payment plan during construction' : lang === 'fr' ? 'Plan de paiement flexible pendant la construction' : 'Plan de pagos flexible durante la construcción'
    ]"""
)

with open("src/app/[lang]/futuros-proyectos/page.tsx", "w") as f:
    f.write(content)
