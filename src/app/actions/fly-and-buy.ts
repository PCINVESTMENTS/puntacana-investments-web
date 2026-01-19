'use server'

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitFlyAndBuyForm(prevState: any, formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const country = formData.get('country') as string;
    const objective = formData.getAll('objective') as string[];
    const propertyType = formData.getAll('propertyType') as string[];
    const hasSpecificProperty = formData.get('hasSpecificProperty') as string;
    const specificProperty = formData.get('specificProperty') as string;
    const investmentFocus = formData.getAll('investmentFocus') as string[];
    const experience = formData.get('experience') as string;
    const horizon = formData.get('horizon') as string;
    const visited = formData.get('visited') as string;
    const motivation = formData.getAll('motivation') as string[];
    const comments = formData.get('comments') as string;

    const lang = (formData.get('lang') as string) || 'en';

    // Email translations
    const t = {
        en: {
            title: "Fly & Buy Inquiry",
            personalDetails: "Personal Details",
            name: "Name",
            email: "Email",
            phone: "Phone",
            country: "Country",
            interestProfile: "Interest Profile",
            objective: "Main Objective",
            propertyInterest: "Property Interest",
            specificProperty: "Specific Property or Project",
            notSpecified: "Not specified",
            investmentFocus: "Investment Focus",
            experience: "Experience",
            timeframe: "Timeframe",
            flyAndBuyProgram: "Fly & Buy Program",
            visitedBefore: "Visited Before",
            motivation: "Motivation",
            additionalComments: "Additional Comments",
            noComments: "No comments provided.",
            footer: "Sent from Punta Cana Investments Web"
        },
        es: {
            title: "Consulta Fly & Buy",
            personalDetails: "Datos Personales",
            name: "Nombre",
            email: "Correo",
            phone: "Teléfono",
            country: "País",
            interestProfile: "Perfil de Interés",
            objective: "Objetivo Principal",
            propertyInterest: "Tipo de Propiedad",
            specificProperty: "Propiedad o Proyecto Específico",
            notSpecified: "No especificado",
            investmentFocus: "Enfoque de Inversión",
            experience: "Experiencia",
            timeframe: "Plazo",
            flyAndBuyProgram: "Programa Fly & Buy",
            visitedBefore: "¿Ha visitado antes?",
            motivation: "Motivación",
            additionalComments: "Comentarios Adicionales",
            noComments: "Sin comentarios.",
            footer: "Enviado desde Web Punta Cana Investments"
        }
    };

    const dict = t[lang as keyof typeof t] || t.en;

    // Validation
    if (!name || !email || !phone || !country) {
        return {
            success: false,
            message: lang === 'es' ? 'Por favor complete todos los campos requeridos.' : 'Please fill in all required fields.'
        };
    }

    try {
        const data = await resend.emails.send({
            from: 'Punta Cana Investments <onboarding@resend.dev>',
            to: ['uepcrealestate@gmail.com'],
            subject: `${dict.title}: ${name}`,
            html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #000; padding: 20px; text-align: center;">
                <h1 style="color: #E4CA7C; margin: 0;">${dict.title}</h1>
            </div>
            
            <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
                <h2 style="color: #000; border-bottom: 2px solid #E4CA7C; padding-bottom: 10px;">${dict.personalDetails}</h2>
                <p><strong>${dict.name}:</strong> ${name}</p>
                <p><strong>${dict.email}:</strong> ${email}</p>
                <p><strong>${dict.phone}:</strong> ${phone}</p>
                <p><strong>${dict.country}:</strong> ${country}</p>

                <h2 style="color: #000; border-bottom: 2px solid #E4CA7C; padding-bottom: 10px; margin-top: 30px;">${dict.interestProfile}</h2>
                
                <p><strong>${dict.objective}:</strong><br/>
                ${objective.map(o => `• ${o}`).join('<br/>')}</p>

                <p><strong>${dict.propertyInterest}:</strong><br/>
                ${propertyType.map(p => `• ${p}`).join('<br/>')}</p>

                ${hasSpecificProperty === 'yes' ? `
                <p><strong>${dict.specificProperty}:</strong><br/>
                ${specificProperty || dict.notSpecified}</p>
                ` : ''}

                ${investmentFocus.length > 0 ? `
                <p><strong>${dict.investmentFocus}:</strong><br/>
                ${investmentFocus.map(i => `• ${i}`).join('<br/>')}</p>
                ` : ''}

                <p><strong>${dict.experience}:</strong> ${experience}</p>
                <p><strong>${dict.timeframe}:</strong> ${horizon}</p>

                <h2 style="color: #000; border-bottom: 2px solid #E4CA7C; padding-bottom: 10px; margin-top: 30px;">${dict.flyAndBuyProgram}</h2>
                <p><strong>${dict.visitedBefore}:</strong> ${visited}</p>
                
                <p><strong>${dict.motivation}:</strong><br/>
                ${motivation.map(m => `• ${m}`).join('<br/>')}</p>

                <h2 style="color: #000; border-bottom: 2px solid #E4CA7C; padding-bottom: 10px; margin-top: 30px;">${dict.additionalComments}</h2>
                <p style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #E4CA7C;">${comments || dict.noComments}</p>
            </div>
            
            <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #666; margin-top: 20px;">
                ${dict.footer}
            </div>
        </div>
      `
        });

        if (data.error) {
            console.error("Resend Error:", data.error);
            return { success: false, message: 'Failed to send message. Please try again.' };
        }

        return {
            success: true,
            message: 'Message sent successfully!'
        };

    } catch (error) {
        console.error("Server Error:", error);
        return {
            success: false,
            message: 'Internal server error. Please try again later.'
        };
    }
}
