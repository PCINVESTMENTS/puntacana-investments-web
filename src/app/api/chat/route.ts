import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages } = await req.json();

    // 1. Fetch latest properties from Sanity
    // We fetch minimal data to keep context small but useful
    const properties = await client.fetch(groq`
    *[_type == "property"] {
      title,
      "slug": slug.current,
      price,
      location,
      type,
      "status": status,
      bedrooms,
      bathrooms
    }
  `);

    // 2. Format properties into a context string
    const propertyContext = properties.map((p: any) =>
        `- ${p.title} (${p.type} in ${p.location}): $${p.price.toLocaleString()} | ${p.bedrooms} Beds | ${p.status} | Link: /properties/${p.slug}`
    ).join('\n');

    // 3. Define System Prompt
    const systemPrompt = `
    You are 'Puntacana AI', the intelligent sales assistant for "Punta Cana Investments".
    
    YOUR GOAL: Help users find their dream property in Punta Cana. Be professional, persuasive, luxurious, yet helpful.
    
    KNOWLEDGE BASE (Real-time Inventory):
    ${propertyContext}

    RULES:
    1. LANGUAGE: Respond in the same language as the user (Spanish or English). Default to Spanish if unsure.
    2. LINKS: When recommending a property, YOU MUST provide its link in markdown format, e.g., [Title of Property](/es/properties/slug). 
       - Use '/es/' prefix for Spanish users and '/en/' for English.
    3. SALES STYLE: Highlight investment potential (ROI), luxury lifestyle, and proximity to beaches/airport.
    4. CONTACT: If they want to buy, ask them to fill out the contact form or use the WhatsApp button on the site.
    5. UNKNOWN: If you don't know something, admit it and suggest contacting a human agent. Don't make up properties.

    Start by being welcoming and asking what they are looking for (Investment, Vacation Home, or Permanent Residence?).
  `;

    // 4. Call OpenAI
    const result = streamText({
        model: openai('gpt-4o'),
        system: systemPrompt,
        messages,
    });

    return result.toDataStreamResponse();
}
