import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function updatePost() {
  try {
    const postId = 'aJf43MyLsrViIWt9fKGh4n';

    const newBlocksEs = [
      {
        _key: "seo_block_h2_1",
        _type: "block",
        style: "h2",
        children: [{ _key: "seo_span_1", _type: "span", marks: [], text: "La Ley CONFOTUR: Inversión Libre de Impuestos" }]
      },
      {
        _key: "seo_block_p_1",
        _type: "block",
        style: "normal",
        children: [{ _key: "seo_span_2", _type: "span", marks: [], text: "La gran mayoría de los nuevos proyectos de villas y apartamentos en venta en Punta Cana cuentan con los beneficios de la Ley CONFOTUR. Esto significa cero impuesto de transferencia (3%) y cero pago de IPI (1% anual) durante 15 años." }]
      },
      {
        _key: "seo_block_h2_2",
        _type: "block",
        style: "h2",
        children: [{ _key: "seo_span_3", _type: "span", marks: [], text: "El Retorno de Inversión (ROI) a Través de Airbnb" }]
      },
      {
        _key: "seo_block_p_2",
        _type: "block",
        style: "normal",
        children: [{ _key: "seo_span_4", _type: "span", marks: [], text: "La demanda turística de Punta Cana juega a tu favor. Al entrar tu propiedad nueva al mercado de rentas cortas, puedes generar retornos netos de entre un 8% a un 12% anual. En Punta Cana Investments, te ayudamos a asegurar estas propiedades de alto retorno (High ROI properties Punta Cana)." }]
      }
    ];

    const newBlocksEn = [
      {
        _key: "seo_block_en_h2_1",
        _type: "block",
        style: "h2",
        children: [{ _key: "seo_en_span_1", _type: "span", marks: [], text: "CONFOTUR Law: Tax-Free Real Estate" }]
      },
      {
        _key: "seo_block_en_p_1",
        _type: "block",
        style: "normal",
        children: [{ _key: "seo_en_span_2", _type: "span", marks: [], text: "Most new pre-construction condos and villas for sale in Punta Cana benefit from the CONFOTUR Law. This means paying zero transfer tax (3%) and zero annual property tax (IPI) for up to 15 years." }]
      },
      {
        _key: "seo_block_en_h2_2",
        _type: "block",
        style: "h2",
        children: [{ _key: "seo_en_span_3", _type: "span", marks: [], text: "High ROI through Airbnb Rentals" }]
      },
      {
        _key: "seo_block_en_p_2",
        _type: "block",
        style: "normal",
        children: [{ _key: "seo_en_span_4", _type: "span", marks: [], text: "Punta Cana's massive tourism demand works in your favor. By entering your new property into the short-term rental market, you can generate net returns between 8% to 12% annually. At Punta Cana Investments, we specialize in high ROI properties in the Caribbean." }]
      }
    ];

    // Fetch current document first
    const currentDoc = await client.getDocument(postId);
    
    // Append the new blocks to the existing content arrays
    const updatedContentEs = [...(currentDoc.contentEs || []), ...newBlocksEs];
    const updatedContentEn = [...(currentDoc.contentEn || []), ...newBlocksEn];

    const res = await client
      .patch(postId)
      .set({ 
        title: "Guide to Buying Off-Plan Properties in Punta Cana",
        excerptEs: "Descubre por qué invertir en pre-construcción en Punta Cana garantiza plusvalía, alto ROI y cero impuestos con la Ley CONFOTUR.",
        excerptEn: "Discover why investing in Punta Cana pre-construction guarantees capital appreciation, high ROI, and zero taxes with CONFOTUR.",
        contentEs: updatedContentEs,
        contentEn: updatedContentEn
      })
      .commit();

    console.log('Post updated successfully with SEO steroids!');
    console.log('Updated Document ID:', res._id);
  } catch (err) {
    console.error('Error updating post:', err);
  }
}

updatePost();
