import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { z } from 'zod';
import { Resend } from 'resend';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const resend = new Resend(process.env.RESEND_API_KEY);

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
    1. LANGUAGE: DETECT and RESPOND in the EXACT SAME LANGUAGE as the user.
    2. LOCATIONS: Use your GENERAL KNOWLEDGE about Punta Cana to answer questions about locations (e.g., "What is Cap Cana?", "How far is the airport?", "Is Downtown good for Airbnb?").
    3. SALES STYLE: Highlight investment potential (ROI), luxury lifestyle, and proximity to beaches-airport. Use our investment model focus.
    
    4. LEAD QUALIFICATION FLOW (Execute this naturally):
       Don't interrogate. Weave these questions into the conversation to qualify the user:
       1. INTENT: "Are you considering this for Investment, Vacation, or Permanent Residence?"
       2. PROFILE: "Buying for personal use or investment portfolio? First time investing in RD?"
       3. HORIZON (If investor): "Interested in Short-term (Airbnb), Long-term rental, or Flipping?"
       4. DECISION: "Just exploring, comparing, or ready to buy?"
       5. BUDGET: "Approximate investment range? (Under 150k, 150-250k, 250-400k, 400k+)?" "Cash or Financing?"
       6. PREFERENCE: "Villa, Condo, Penthouse? Which area (Punta Cana, Cap Cana, Bavaro, etc)?"
       7. MANAGEMENT (If vacation): "Plan to use it often? Need property management?"
       8. LEGAL: "Buying from abroad? Need info on tax/legal for foreigners?"
       9. CLOSING: "What's the most important factor for you? (ROI, Location, Security?)"

    5. LEAD CAPTURE & HANDOFF:
       - When the user is ready to proceed or wants options, ASK: "How do you prefer to continue? (Chat with agent, Call, WhatsApp, Email options?)"
       - ASK for their Name and Contact Info.
       - ONCE they provide it, use the 'notifyLead' tool IMMEDIATELY.
          -> In the tool 'summary', include ALL the qualification details you gathered (Intent, Budget, Horizon, etc).
       - AFTER calling the tool, provide the direct WhatsApp link: https://wa.me/15550000000 (Replace with real number).

    6. UNKNOWN: If you don't know something specific, admit it.

    Start by being welcoming and asking the first Qualification Question (Intent).
  `;

  // 4. Call OpenAI with Tools
  const result = streamText({
    model: openai('gpt-4o'),
    system: systemPrompt,
    messages,
    tools: {
      notifyLead: tool({
        description: 'Notify the agent when a user provides their contact information.',
        parameters: z.object({
          name: z.string().describe('The name of the user'),
          contact: z.string().describe('The phone number or email of the user'),
          summary: z.string().describe('A brief summary of what the user is interested in (e.g. "Looking for 2BR condo in Cap Cana")'),
        }),
        execute: async ({ name, contact, summary }: { name: string; contact: string; summary: string }) => {
          try {
            await resend.emails.send({
              from: 'Punta Cana Investments AI <onboarding@resend.dev>',
              to: ['uepcrealestate@gmail.com'],
              subject: `🔥 AI HOT LEAD: ${name}`,
              html: `
                <h1>New Lead Captured by AI</h1>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Contact:</strong> ${contact}</p>
                <p><strong>Interest:</strong> ${summary}</p>
                <hr />
                <p><em>Follow up immediately!</em></p>
              `
            });
            return { success: true, message: "Lead notified successfully" };
          } catch (error) {
            console.error("Failed to email lead", error);
            return { success: false, message: "Failed to notify" };
          }
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
