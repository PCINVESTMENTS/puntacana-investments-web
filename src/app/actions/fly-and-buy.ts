'use server'

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitFlyAndBuyForm(prevState: any, formData: FormData) {
    // Obligamos a la acción a ir directo a Railway, ignorando NEXT_PUBLIC_API_URL de Vercel.
    const apiUrl = "https://puntacana-fortress-production.up.railway.app";

    // Extract data from FormData
    const name = (formData.get('name') as string) || '';
    const email = (formData.get('email') as string) || '';
    const phone = (formData.get('phone') as string) || '';
    const country = (formData.get('country') as string) || '';
    const comments = (formData.get('comments') as string) || '';

    // Additional fields
    const experience = formData.get('experience') as string || 'N/A';
    const horizon = formData.get('horizon') as string || 'N/A';
    const visited = formData.get('visited') as string || 'N/A';
    
    // Arrays for multiple checkboxes
    const objectives = formData.getAll('objective').join(', ') || 'N/A';
    const propertyTypes = formData.getAll('propertyType').join(', ') || 'N/A';
    const investmentFocus = formData.getAll('investmentFocus').join(', ') || 'N/A';
    const motivation = formData.getAll('motivation').join(', ') || 'N/A';

    // Check dynamic select/input correctly
    const propertySelection = formData.get('specificPropertySelect') as string;
    const propertyInput = formData.get('specificPropertyName') as string;
    const specificProperty = (propertySelection === 'other' || !propertySelection) ? propertyInput : propertySelection; 

    const tripData = {
        client_name: name,
        client_email: email,
        client_phone: phone,
        origin_city: country,
        proposed_dates: 'Por Definir',
        notes: `Comentarios: ${comments}\nObjetivos: ${objectives}\nTipo de Propiedad: ${propertyTypes}\nEnfoque de Inversión: ${investmentFocus}\nExperiencia: ${experience}\nHorizonte: ${horizon}\nHa visitado RD: ${visited}\nMotivación: ${motivation}\nPropiedad Específica: ${specificProperty || 'Ninguna'}`
    };

    const cleanedApiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

    try {
        const res = await fetch(`${cleanedApiUrl}/api/public/fly-buy/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tripData),
        });

        // Cortocircuito de éxito inmediato si el servidor responde 200 o 201
        if (res.ok || res.status === 201 || res.status === 200) {
            
            // Send the exact same Auto-Responder via Resend instead of Django SMTP
            try {
                const firstName = name.split(' ')[0] || 'Cliente';
                const htmlTemplate = `
                <html>
                    <body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #000000; color: #ffffff; max-width: 600px; margin: 0 auto; padding: 0;">
                        <div style="background-color: #111111; padding: 40px 20px; text-align: center; border-bottom: 2px solid #c9ae5d;">
                            <img src="https://puntacanainvestmentsrd.com/images/logo-email.jpg" alt="Punta Cana Investments Logo" style="max-width: 320px; height: auto;" />
                        </div>
                        <div style="padding: 40px 30px; background-color: #0a0a0a;">
                            <h2 style="color: #c9ae5d; text-transform: uppercase; margin-top: 0; font-weight: 400; letter-spacing: 1px; text-align: center;">Confirmación de Solicitud</h2>
                            <p style="font-size: 16px; line-height: 1.6; color: #e0e0e0; margin-bottom: 20px;">
                                Hola <strong>${firstName}</strong>,
                            </p>
                            <p style="font-size: 16px; line-height: 1.6; color: #e0e0e0; margin-bottom: 20px;">
                                Hemos recibido exitosamente tu solicitud de participación para nuestro programa exclusivo <strong>Fly &amp; Buy</strong>.
                            </p>
                            <p style="font-size: 16px; line-height: 1.6; color: #e0e0e0; margin-bottom: 30px;">
                                Un agente de nuestro equipo estará evaluando tu perfil comercial y se comunicará contigo a la mayor brevedad posible para estructurar tu visita a la República Dominicana.
                            </p>
                            
                            <div style="background-color: #1a1a1a; padding: 25px; border-left: 4px solid #c9ae5d; margin: 30px 0; border-radius: 4px;">
                                <p style="margin: 0 0 15px 0; color: #ffffff; font-size: 15px;"><strong>¿Deseas agilizar el proceso?</strong><br>
                                Puedes seleccionar el horario de tu preferencia para una videollamada accediendo directamente a nuestra agenda comercial:</p>
                                <p style="margin: 0;">
                                    <a href="https://calendly.com/" style="display: inline-block; background-color: #c9ae5d; color: #000000; padding: 12px 24px; text-decoration: none; border-radius: 2px; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Agendar Videollamada</a>
                                </p>
                            </div>
                        </div>
                        <div style="background-color: #111111; padding: 30px; text-align: center; border-top: 1px solid #333333;">
                            <p style="margin: 0; font-size: 14px; color: #c9ae5d; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">Punta Cana Investments</p>
                            <p style="margin: 10px 0 0 0; font-size: 12px; color: #888888;">El paraíso de tus inversiones inmobiliarias</p>
                        </div>
                    </body>
                </html>
                `;

                const { error, data } = await resend.emails.send({
                    from: 'Punta Cana Investments <info@puntacanainvestmentsrd.com>',
                    to: [email],
                    subject: 'Confirmación de Solicitud Fly & Buy - Punta Cana Investments',
                    html: htmlTemplate
                });
                
                if (error) {
                    console.error("Resend internal autoresponder failed:", error);
                    // Do not block success if email fails, lead is already saved
                }
            } catch (emailErr: any) {
                console.error("Resend internal autoresponder exception exception:", emailErr);
                // Do not block success
            }

            return { success: true, message: 'Request sent successfully!' };
        }

        const errorText = await res.text();
        console.error("Backend Error:", res.status, errorText);
        return { success: false, message: `Rechazado por el servidor: ${res.status} - ${errorText}` };

    } catch (error: any) {
        console.error("Server Action Error:", error);
        return { success: false, message: `Error de red: ${error.message}` };
    }
}
