import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-05-01'
});

async function main() {
  try {
    const res = await client.patch('rhCr873ocQgsT58wdCXhjd').set({
      coordinates: { lat: 18.5173, lng: -68.3685 },
      seo: {
        title: {
          es: "Villa de Lujo Frente al Mar en Corales | Punta Cana Investments",
          en: "Luxury Oceanfront Villa in Corales | Punta Cana Investments",
          fr: "Villa de Luxe Face à l'Océan à Corales | Punta Cana Investments"
        },
        description: {
          es: "Majestuosa villa de ultra-lujo de 7 habitaciones frente al mar y campo de golf en Corales, Puntacana Resort & Club. Ideal para inversión y élite.",
          en: "Majestic 7-bedroom ultra-luxury oceanfront and golf course villa in Corales, Puntacana Resort & Club. Ideal for investment and elite lifestyle.",
          fr: "Majestueuse villa ultra-luxe de 7 chambres face à l'océan et au golf à Corales, Puntacana Resort & Club. Idéal pour l'investissement et l'élite."
        },
        keywords: {
          es: ["Villa de Lujo Punta Cana", "Corales Puntacana Resort", "Frente al mar Punta Cana", "Bienes Raíces Lujo República Dominicana", "Inversión Inmobiliaria Punta Cana", "Mansión en venta Punta Cana"],
          en: ["Luxury Villa Punta Cana", "Corales Puntacana Resort", "Oceanfront Punta Cana", "Dominican Republic Luxury Real Estate", "Real Estate Investment Punta Cana", "Mansion for sale Punta Cana"],
          fr: ["Villa de Luxe Punta Cana", "Corales Puntacana Resort", "Face à la mer Punta Cana", "Immobilier de Luxe République Dominicaine", "Investissement Immobilier Punta Cana", "Manoir à vendre Punta Cana"]
        }
      },
      isResale: true,
      is_rental_active: false,
      rental_price: 0
    }).commit();
    console.log('Property details patched successfully:', res._id);
  } catch (error) {
    console.error('Error patching property details:', error);
  }
}

main();
