'use server'

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitMonitoringForm(prevState: any, formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const country = formData.get('country') as string;
    const project = formData.get('project') as string;
    const location = formData.get('location') as string;
    const investment = formData.get('investment') as string;
    const date = formData.get('date') as string;

    const lang = (formData.get('lang') as string) || 'en';

    // Email translations
    const t = {
        en: {
            title: "New Monitoring Plan Request",
            error: "Please fill in all required fields."
        },
        es: {
            title: "Nueva Solicitud de Plan de Monitoreo",
            error: "Por favor complete todos los campos requeridos."
        },
        fr: {
            title: "Nouvelle Demande de Plan de Suivi",
            error: "Veuillez remplir tous les champs obligatoires."
        }
    };

    const dict = t[lang as keyof typeof t] || t.en;

    // Simple validation
    if (!name || !email || !phone) {
        return {
            success: false,
            message: dict.error
        };
    }

    try {
        // Construct message for the CRM
        const combinedMessage = `Solicitud de Monitoreo Técnico:
País de Residencia: ${country || 'N/A'}
Proyecto: ${project || 'N/A'}
Ubicación: ${location || 'N/A'}
Monto Inversión: ${investment || 'N/A'}
Fecha Entrega: ${date || 'N/A'}`;

        const apiUrl = "https://puntacana-fortress-production.up.railway.app";
        
        const backendData = {
                first_name: name.split(' ')[0],
                last_name: name.split(' ').slice(1).join(' ') || '.',
                email: email,
                phone: phone,
                message: combinedMessage,
                source: "Website Monitoring Form",
                interest: "Servicio de Monitoreo de Inversión"
            };

        try {
            const res = await fetch(`${apiUrl}/api/public/leads/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(backendData),
            });

            if (!res.ok) {
                const errText = await res.text();
                console.error("CRITICAL: Backend rejected the Lead payload:", errText);
                throw new Error(`Backend Validation Error: ${res.status} - ${errText}`);
            }
        } catch (backendError) {
            console.error("FATAL: Cannot reach Backend or payload rejected:", backendError);
            return {
                success: false,
                message: 'Error de conexión con el servidor principal. ' + (backendError instanceof Error ? backendError.message : 'Fallo desconocido.')
            };
        }

        // Send Auto-Responder to the CLIENT
        try {
            const firstName = name.split(' ')[0] || (lang === 'en' ? 'Client' : lang === 'fr' ? 'Client' : 'Cliente');
            
            // Localization variables
            let subject = 'Hemos recibido tu solicitud de Monitoreo - Punta Cana Investments';
            let title = 'Solicitud en Proceso';
            let greeting = `Hola <strong>${firstName}</strong>,`;
            let body = 'Un consultor experto de nuestro equipo está revisando los datos de tu proyecto y se comunicará contigo en menos de 24 horas para presentarte una propuesta de monitoreo a la medida.';
            let speedUpTitle = '¿Deseas agilizar el proceso?';
            let speedUpText = 'Puedes agendar una videollamada personalizada con nuestros expertos inmediatamente:';
            let buttonText = 'Agendar Videollamada';
            let slogan = 'Tus ojos en la obra, tu capital asegurado.';
            
            if (lang === 'en') {
                subject = 'We have received your Monitoring request - Punta Cana Investments';
                title = 'Request in Process';
                greeting = `Hello <strong>${firstName}</strong>,`;
                body = 'An expert consultant from our team is reviewing your project details and will contact you in less than 24 hours to present a customized monitoring proposal.';
                speedUpTitle = 'Want to speed up the process?';
                speedUpText = 'You can schedule a personalized video call with our experts immediately:';
                buttonText = 'Schedule Video Call';
                slogan = 'Your eyes on the ground, your capital secured.';
            } else if (lang === 'fr') {
                subject = 'Nous avons reçu votre demande de suivi - Punta Cana Investments';
                title = 'Demande en cours';
                greeting = `Bonjour <strong>${firstName}</strong>,`;
                body = 'Un consultant expert de notre équipe examine les détails de votre projet et vous contactera dans moins de 24 heures pour vous présenter une proposition de suivi sur mesure.';
                speedUpTitle = 'Vous souhaitez accélérer le processus ?';
                speedUpText = 'Vous pouvez planifier un appel vidéo personnalisé avec nos experts dès maintenant :';
                buttonText = "Planifier l'Appel Vidéo";
                slogan = 'Vos yeux sur le terrain, votre capital sécurisé.';
            }

            const htmlTemplate = `
            <html>
                <body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #000000; color: #ffffff; max-width: 600px; margin: 0 auto; padding: 0;">
                    <div style="background-color: #111111; padding: 40px 20px; text-align: center; border-bottom: 2px solid #c9ae5d;">
                        <img src="https://puntacanainvestmentsrd.com/images/logo-email.jpg" alt="Punta Cana Investments Logo" style="max-width: 320px; height: auto;" />
                    </div>
                    <div style="padding: 40px 30px; background-color: #0a0a0a;">
                        <h2 style="color: #c9ae5d; text-transform: uppercase; margin-top: 0; font-weight: 400; letter-spacing: 1px; text-align: center;">${title}</h2>
                        <p style="font-size: 16px; line-height: 1.6; color: #e0e0e0; margin-bottom: 20px;">
                            ${greeting}
                        </p>
                        <p style="font-size: 16px; line-height: 1.6; color: #e0e0e0; margin-bottom: 30px;">
                            ${body}
                        </p>
                        
                        <div style="background-color: #1a1a1a; padding: 25px; border-left: 4px solid #c9ae5d; margin: 30px 0; border-radius: 4px;">
                            <p style="margin: 0 0 15px 0; color: #ffffff; font-size: 15px;"><strong>${speedUpTitle}</strong><br>
                            ${speedUpText}</p>
                            <p style="margin: 0;">
                                <a href="https://calendly.com/ulisespp9/30min" style="display: inline-block; background-color: #c9ae5d; color: #000000; padding: 12px 24px; text-decoration: none; border-radius: 2px; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">${buttonText}</a>
                            </p>
                        </div>
                    </div>
                    <div style="background-color: #111111; padding: 30px; text-align: center; border-top: 1px solid #333333;">
                        <p style="margin: 0; font-size: 14px; color: #c9ae5d; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">Punta Cana Investments</p>
                        <p style="margin: 10px 0 0 0; font-size: 12px; color: #888888;">${slogan}</p>
                    </div>
                </body>
            </html>
            `;

            await resend.emails.send({
                from: 'Punta Cana Investments <info@puntacanainvestmentsrd.com>',
                to: [email],
                subject: subject,
                html: htmlTemplate
            });

        } catch (autoResponderError: any) {
            console.error("Client Autoresponder Exception:", autoResponderError);
        }

        // Send Admin Notification Email via Resend
        try {
            const adminHtmlTemplate = `
            <html>
                <body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #000000; color: #ffffff; max-width: 600px; margin: 0 auto; padding: 0;">
                    <div style="background-color: #111111; padding: 40px 20px; text-align: center; border-bottom: 2px solid #c9ae5d;">
                        <img src="https://puntacanainvestmentsrd.com/images/logo-email.jpg" alt="Punta Cana Investments Logo" style="max-width: 320px; height: auto;" />
                    </div>
                    <div style="padding: 40px 30px; background-color: #0a0a0a;">
                        <h2 style="color: #c9ae5d; text-transform: uppercase; margin-top: 0; font-weight: 400; letter-spacing: 1px; text-align: center;">NUEVO LEAD MONITOREO</h2>
                        
                        <div style="background-color: #1a1a1a; padding: 20px; border-left: 4px solid #c9ae5d; margin: 20px 0; border-radius: 4px;">
                            <p style="margin: 0 0 10px 0; color: #c9ae5d; font-size: 15px; font-weight: bold; text-transform: uppercase;">Datos del Inversor</p>
                            <p style="margin: 5px 0; color: #e0e0e0;"><strong>Nombre:</strong> ${name}</p>
                            <p style="margin: 5px 0; color: #e0e0e0;"><strong>Email:</strong> ${email}</p>
                            <p style="margin: 5px 0; color: #e0e0e0;"><strong>Teléfono:</strong> ${phone}</p>
                            <p style="margin: 5px 0; color: #e0e0e0;"><strong>País:</strong> ${country}</p>
                        </div>

                        <div style="background-color: #1a1a1a; padding: 20px; border-left: 4px solid #c9ae5d; margin: 20px 0; border-radius: 4px;">
                            <p style="margin: 0 0 10px 0; color: #c9ae5d; font-size: 15px; font-weight: bold; text-transform: uppercase;">Datos del Proyecto</p>
                            <p style="margin: 5px 0; color: #e0e0e0;"><strong>Proyecto:</strong> ${project}</p>
                            <p style="margin: 5px 0; color: #e0e0e0;"><strong>Ubicación:</strong> ${location}</p>
                            <p style="margin: 5px 0; color: #e0e0e0;"><strong>Inversión:</strong> ${investment}</p>
                            <p style="margin: 5px 0; color: #e0e0e0;"><strong>Fecha Entrega:</strong> ${date}</p>
                        </div>
                        
                        <p style="font-size: 12px; color: #888888; text-align: center; margin-top: 30px;">Este lead ya fue enviado al Backend de forma automática.</p>
                    </div>
                </body>
            </html>
            `;

            await resend.emails.send({
                from: 'Web Punta Cana Investments <info@puntacanainvestmentsrd.com>',
                to: ['info@puntacanainvestmentsrd.com'],
                subject: `LEAD MONITOREO: ${name} - ${project}`,
                html: adminHtmlTemplate
            });
        } catch (adminEmailError) {
            console.error("Admin Email Exception:", adminEmailError);
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
