const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'w7gp05my',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-05-01'
});

const propertyId = 'FAM7sl14R2NFN68aB3Bdus';

const seoData = {
  title: {
    en: 'Exclusive Luxury Villa with Golf and Lake Views in Corales | Punta Cana Investments',
    es: 'Exclusiva Villa de Lujo con Vistas al Golf y al Lago en Corales | Punta Cana Investments',
    fr: 'Villa de Luxe Exclusive avec Vue sur le Golf et le Lac à Corales | Punta Cana Investments'
  },
  description: {
    en: 'Acquire this exclusive contemporary-tropical villa in Corales. 7 bedrooms, infinity pool, golf and lake views for US$6,950,000.',
    es: 'Adquiere esta exclusiva villa de diseño contemporáneo-tropical en Corales. 7 habitaciones, piscina infinity, vistas al golf y al lago por US$6,950,000.',
    fr: 'Acquérez cette villa exclusive au design contemporain-tropical à Corales. 7 chambres, piscine à débordement, vues sur le golf et le lac pour 6 950 000 $ US.'
  },
  keywords: {
    es: [
      'villa con vista al lago Punta Cana',
      'villa frente al golf Punta Cana',
      'casas de lujo en campos de golf Punta Cana',
      'Corales Puntacana Resort',
      'Puntacana Resort & Club',
      'bienes raíces de lujo Punta Cana',
      'luxury real estate Dominican Republic',
      'mansión en venta Punta Cana',
      'mansion for sale Punta Cana',
      'villa de ultra lujo Punta Cana',
      'ultra-luxury homes Caribbean',
      'Punta Cana luxury homes',
      'casas millonarias Punta Cana',
      'comprar villa de lujo Punta Cana',
      'buy luxury villa Punta Cana',
      'propiedades exclusivas Punta Cana',
      'inversiones inmobiliarias Punta Cana',
      'Caribbean luxury real estate',
      'Corales Golf Course',
      'PGA Tour Corales',
      'villa contemporánea Punta Cana',
      'Punta Cana Investments'
    ],
    en: [
      'lake view villa Punta Cana',
      'golf front villa Punta Cana',
      'luxury golf villas Caribbean',
      'Corales Golf Course real estate',
      'Punta Cana golf properties',
      'exclusive homes Dominican Republic',
      'Punta Cana luxury real estate',
      'luxury real estate Dominican Republic',
      'mansion for sale Punta Cana',
      'ultra-luxury homes Caribbean',
      'Punta Cana luxury homes',
      'million dollar homes Punta Cana',
      'buy luxury villa Punta Cana',
      'exclusive properties Punta Cana',
      'Punta Cana real estate investments',
      'Caribbean luxury real estate',
      'Punta Cana Investments'
    ],
    fr: [
      'villa avec vue sur le lac Punta Cana',
      'villa sur golf Punta Cana',
      'villas de luxe golf Caraïbes',
      'immobilier golf Punta Cana',
      'Puntacana Resort & Club',
      'Corales Puntacana Resort',
      'immobilier de luxe Punta Cana',
      'immobilier de luxe République Dominicaine',
      'manoir à vendre Punta Cana',
      'maisons ultra-luxe Caraïbes',
      'maisons de luxe Punta Cana',
      'maisons de millionnaires Punta Cana',
      'acheter villa de luxe Punta Cana',
      'propriétés exclusives Punta Cana',
      'investissements immobiliers Punta Cana',
      'immobilier de luxe Caraïbes',
      'Corales Golf Course',
      'Punta Cana Investments'
    ]
  }
};

async function patchSEO() {
  try {
    console.log('Patching SEO data for property', propertyId);
    
    await client.patch(propertyId)
      .set({ seo: seoData })
      .commit();

    console.log('SEO data successfully patched!');
  } catch (error) {
    console.error('Error patching SEO data:', error);
  }
}

patchSEO();
