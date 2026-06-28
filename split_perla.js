const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-05-01',
  token: 'skSVMaZMNlhB8GkG3Fz4AsOWbgEAJoaZfG8VjGkCBYbsAo08oaDnlkkax4q1e9lYrPlZdZ3WCUGVktYLFhegywzjW3Vx6ZPOubvFilxWxJBmHHcEGwEnylguwJizN3ajm8MQ7n5QKl5jKcv2pi6FrifVxczGTt20MHBuSTtvu3srXkS7Hcic'
});

async function splitPerla() {
  const propertyId = 'villas-perla-del-mar-white-sands';
  const doc = await client.getDocument(propertyId);
  if(!doc) { console.error("Doc not found"); return; }
  
  // 1. Prepare data for Villa Grande
  const galleryGrande = doc.gallery.slice(0, 11);
  const titleGrandeEs = "Villas Grande | Perla del Mar White Sands Punta Cana";
  const titleGrandeEn = "Large Villas | Perla del Mar White Sands Punta Cana";
  const titleGrandeFr = "Grandes Villas | Perle de la mer Sables blancs Punta Cana";
  
  const replaceGrandeEs = doc.descriptionEs
    .replace("- **Tamaño:** Desde 155 m² hasta 250 m² (incluyendo rooftop)", "- **Tamaño:** Aprox. 240 m² de construcción en terreno de 285 m² promedio")
    .replace("- **Tipo:** Villas unifamiliares (3 Habitaciones, 2 Niveles)", "- **Tipo:** Villas unifamiliares Grandes (3 Habitaciones, 2 Niveles)");
    
  const replaceGrandeEn = doc.descriptionEn
    .replace("- **Size:** From 155 m² up to 250 m² (including rooftop)", "- **Size:** Approx. 240 m² built area on 285 m² average lots")
    .replace("- **Type:** Single-family Villas (3 Bedrooms, 2 Levels)", "- **Type:** Large Single-family Villas (3 Bedrooms, 2 Levels)");
    
  const replaceGrandeFr = doc.descriptionFr
    .replace("- **Superficie :** De 155 m² à 250 m² (y compris toit)", "- **Superficie :** Env. 240 m² de construction sur des terrains de 285 m² en moyenne")
    .replace("Villas unifamiliales (3 chambres, 2 niveaux)", "Grandes Villas unifamiliales (3 chambres, 2 niveaux)");

  await client.patch(propertyId)
    .set({
      titleEs: titleGrandeEs,
      title: titleGrandeEn,
      titleFr: titleGrandeFr,
      price: 375000,
      area: 240,
      gallery: galleryGrande,
      descriptionEs: replaceGrandeEs,
      descriptionEn: replaceGrandeEn,
      descriptionFr: replaceGrandeFr,
      image: galleryGrande[0]
    })
    .commit();
    
  console.log("Updated original to Villa Grande");

  // 2. Prepare data for Rooftop
  const galleryRooftop = doc.gallery.slice(11);
  const newId = 'villas-perla-del-mar-rooftop-white-sands';
  
  const titleRooftopEs = "Villa con Rooftop | Perla del Mar White Sands Punta Cana";
  const titleRooftopEn = "Rooftop Villa | Perla del Mar White Sands Punta Cana";
  const titleRooftopFr = "Villa avec Rooftop | Perle de la mer Sables blancs Punta Cana";

  const replaceRooftopEs = doc.descriptionEs
    .replace("- **Tamaño:** Desde 155 m² hasta 250 m² (incluyendo rooftop)", "- **Tamaño:** 155 m² de construcción más terraza rooftop en terreno de 205 m² promedio")
    .replace("- **Tipo:** Villas unifamiliares (3 Habitaciones, 2 Niveles)", "- **Tipo:** Villa con Rooftop (2 baños completos, 2 medios baños: uno en primer nivel y otro en rooftop)");
    
  const replaceRooftopEn = doc.descriptionEn
    .replace("- **Size:** From 155 m² up to 250 m² (including rooftop)", "- **Size:** 155 m² built area plus rooftop terrace on 205 m² average lots")
    .replace("- **Type:** Single-family Villas (3 Bedrooms, 2 Levels)", "- **Type:** Rooftop Villa (2 full baths, 2 half baths: one on first level, one on rooftop)");
    
  const replaceRooftopFr = doc.descriptionFr
    .replace("- **Superficie :** De 155 m² à 250 m² (y compris toit)", "- **Superficie :** 155 m² de construction plus terrasse sur le toit sur des terrains de 205 m² en moyenne")
    .replace("Villas unifamiliales (3 chambres, 2 niveaux)", "Villa avec Rooftop (2 salles de bain complètes, 2 demi-salles de bain: une au premier niveau, une sur le toit)");

  const newDoc = {
    ...doc,
    _id: newId,
    titleEs: titleRooftopEs,
    title: titleRooftopEn,
    titleFr: titleRooftopFr,
    price: 275000,
    area: 155,
    baths: 4, // 2 full + 2 half
    gallery: galleryRooftop,
    image: galleryRooftop[0],
    descriptionEs: replaceRooftopEs,
    descriptionEn: replaceRooftopEn,
    descriptionFr: replaceRooftopFr,
    slug: {
      _type: "slug",
      current: newId
    }
  };
  
  delete newDoc._rev;
  delete newDoc._createdAt;
  delete newDoc._updatedAt;

  await client.create(newDoc);
  
  console.log("Created new property for Villa Rooftop");
}

splitPerla().catch(console.error);
