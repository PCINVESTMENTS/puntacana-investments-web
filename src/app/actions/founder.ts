'use server'

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitFounderForm(prevState: Record<string, any>, formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;
    const modality = formData.get('modality') as string;
    const lang = (formData.get('lang') as string) || 'es';

    const t = {
        en: {
            title: "New Founder Investor Submission",
            error: "Please fill in all required fields."
        },
        es: {
            title: "Nuevo Inversor Fundador",
            error: "Por favor complete todos los campos requeridos."
        }
    };

    const dict = t[lang as keyof typeof t] || t.es;

    if (!name || !email || !phone || !modality) {
        return {
            success: false,
            message: dict.error
        };
    }

    try {
        // Enviar al Backend dedicado de Founder Leads
        const apiUrl = "https://puntacana-fortress-production.up.railway.app";
        
        const backendData = {
            first_name: name.split(' ')[0],
            last_name: name.split(' ').slice(1).join(' ') || '.',
            email: email,
            phone: phone,
            modality: modality,
            message: message || "Sin mensaje adicional."
        };

        let sequenceNumber = "FND-???";

        try {
            const res = await fetch(`${apiUrl}/api/public/founder-leads/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(backendData),
            });

            if (!res.ok) {
                const errText = await res.text();
                console.error("Backend Validation Error (Founder Lead):", errText);
                throw new Error(`Error: ${res.status}`);
            }
            
            const data = await res.json();
            sequenceNumber = data.sequence_number || sequenceNumber;
            console.log(`Founder Lead saved successfully: ${sequenceNumber}`);
        } catch (backendError) {
            console.error("Cannot reach Founder Lead API:", backendError);
            return {
                success: false,
                message: 'Error de conexión con el servidor. Por favor intente más tarde.'
            };
        }

        // Enviar Correo de Confirmación al Cliente con su Número
        try {
            const firstName = name.split(' ')[0] || 'Inversor';
            const htmlTemplate = `
            <html>
                <body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #000000; color: #ffffff; max-width: 600px; margin: 0 auto; padding: 0;">
                    <div style="background-color: #111111; padding: 40px 20px; text-align: center; border-bottom: 2px solid #c9ae5d;">
                        <img src="https://puntacanainvestmentsrd.com/images/logo-email.jpg" alt="Punta Cana Investments Logo" style="max-width: 320px; height: auto;" />
                    </div>
                    <div style="padding: 40px 30px; background-color: #0a0a0a;">
                        <h2 style="color: #c9ae5d; text-transform: uppercase; margin-top: 0; font-weight: 400; letter-spacing: 1px; text-align: center;">Acceso Lista Cero Confirmado</h2>
                        <p style="font-size: 16px; line-height: 1.6; color: #e0e0e0; margin-bottom: 20px;">
                            Estimado/a <strong>${firstName}</strong>,
                        </p>
                        <p style="font-size: 16px; line-height: 1.6; color: #e0e0e0; margin-bottom: 20px;">
                            Hemos recibido tu aplicación para la fase exclusiva de lanzamiento del nuevo Eco-Resort en Miches bajo la modalidad: <strong>${modality === 'capital' ? 'Socio de Capital' : 'Inversor de Unidades'}</strong>.
                        </p>
                        
                        <p style="font-size: 16px; line-height: 1.6; color: #e0e0e0; margin-bottom: 30px;">
                            La dirección ejecutiva revisará tu perfil de inversión. Si eres aprobado, te enviaremos el Dossier Financiero Privado o el Acuerdo de Confidencialidad correspondiente a tu modalidad.
                        </p>
                        
                        <p style="font-size: 14px; line-height: 1.6; color: #a0a0a0; margin-bottom: 20px; font-style: italic;">
                            Nota: Por favor verifica tu bandeja de Spam o Correo no deseado para asegurar que recibes nuestras futuras comunicaciones.
                        </p>
                    </div>
                    <div style="background-color: #111111; padding: 30px; text-align: center; border-top: 1px solid #333333;">
                        <p style="margin: 0; font-size: 14px; color: #c9ae5d; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">Punta Cana Investments</p>
                        <p style="margin: 10px 0 0 0; font-size: 12px; color: #888888;">Gestión de Inversiones de Alto Capital</p>
                    </div>
                </body>
            </html>
            `;

            await resend.emails.send({
                from: 'Punta Cana Investments <info@puntacanainvestmentsrd.com>',
                to: [email],
                subject: `Solicitud VIP Recibida - Punta Cana Investments`,
                html: htmlTemplate
            });

        } catch (emailError) {
            console.error("Client Founder Autoresponder Exception:", emailError);
        }

        return {
            success: true,
            message: 'Application sent successfully!'
        };

    } catch (error) {
        console.error("Server Error in Founder Action:", error);
        return {
            success: false,
            message: 'Internal server error. Please try again later.'
        };
    }
}
