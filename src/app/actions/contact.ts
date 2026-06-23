'use server'

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitContactForm(prevState: any, formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;

    const lang = (formData.get('lang') as string) || 'en';

    // Email translations
    const t = {
        en: {
            title: "New Contact Form Submission",
            name: "Name",
            email: "Email",
            phone: "Phone",
            messageLabel: "Message",
            footer: "Sent from Punta Cana Investments Web",
            error: "Please fill in all required fields."
        },
        es: {
            title: "Nuevo Mensaje de Contacto",
            name: "Nombre",
            email: "Correo",
            phone: "Teléfono",
            messageLabel: "Mensaje",
            footer: "Enviado desde Web Punta Cana Investments",
            error: "Por favor complete todos los campos requeridos."
        },
        fr: {
            title: "Nouvelle Soumission du Formulaire de Contact",
            name: "Nom",
            email: "E-mail",
            phone: "Téléphone",
            messageLabel: "Message",
            footer: "Envoyé depuis le site Web de Punta Cana Investments",
            error: "Veuillez remplir tous les champs obligatoires."
        }
    };

    const dict = t[lang as keyof typeof t] || t.en;

    // Simple validation
    if (!name || !email || !phone || !message) {
        return {
            success: false,
            message: dict.error
        };
    }

    const subjectInput = formData.get('subject') as string;
    const emailSubject = subjectInput || `New Lead from Website: ${name}`;

    try {
        // 1. Send to "Fortaleza Digital" Backend (Django) - Server-to-Server (No CORS issues)
        // FORCE PRODUCTION URL: Vercel's environment variables are injecting 'dashboard.puntacanainvestmentsrd.com' (Next.js app).
        // We MUST hardcode the Railway Django Backend URL here to avoid hitting our own frontend and getting a 404 HTML response.
        const apiUrl = "https://puntacana-fortress-production.up.railway.app";
        
        const backendData = {
                first_name: name.split(' ')[0],
                last_name: name.split(' ').slice(1).join(' ') || '.',
                email: email,
                phone: phone,
                message: message,
                source: "Website Contact Form",
                interest: subjectInput ? subjectInput.replace(/^(Inquiry about|Consulta sobre):\s*/, '') : "General"
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
            console.log("Lead saved to Backend successfully");
        } catch (backendError) {
            console.error("FATAL: Cannot reach Backend or payload rejected:", backendError);
            // We forcefully return the error to the frontend so it DOES NOT show a green checkmark
            return {
                success: false,
                message: 'Error de conexión con el servidor principal. ' + (backendError instanceof Error ? backendError.message : 'Fallo desconocido.')
            };
        }

        // 2. Send Notification Email via Resend
        const data = await resend.emails.send({
            from: 'Punta Cana Investments <onboarding@resend.dev>',
            to: ['info@puntacanainvestmentsrd.com'],
            subject: emailSubject,
            html: `
        <h1>${dict.title}</h1>
        <h2>${emailSubject}</h2>
        <p><strong>${dict.name}:</strong> ${name}</p>
        <p><strong>${dict.email}:</strong> ${email}</p>
        <p><strong>${dict.phone}:</strong> ${phone}</p>
        <p><strong>${dict.messageLabel}:</strong></p>
        <p>${message}</p>
        <hr />
        <p>${dict.footer}</p>
      `
        });

        if (data.error) {
            console.error("Resend Error (Internal Notification):", data.error);
            // IMPORTANT: Never return an error to the user if the lead is saved in Django. 
            // The email failure is temporal, the data is safe.
        }

        // 3. Send Auto-Responder to the CLIENT
        try {
            const firstName = name.split(' ')[0] || (lang === 'en' ? 'Client' : lang === 'fr' ? 'Client' : 'Cliente');
            
            // Localization variables
            let subject = 'Hemos recibido tu solicitud - Punta Cana Investments';
            let title = 'Confirmación de Contacto';
            let greeting = `Hola <strong>${firstName}</strong>,`;
            let body = 'Un asesor de nuestro equipo está revisando tu solicitud y se comunicará contigo a la mayor brevedad posible para brindarte la atención premium que mereces.';
            let speedUpTitle = '¿Deseas agilizar el proceso?';
            let speedUpText = 'Puedes agendar una videollamada personalizada con nuestros expertos inmediatamente:';
            let buttonText = 'Agendar Videollamada';
            let slogan = 'Construyendo tu patrimonio en el paraíso';
            
            // Custom message depending on if it's a property inquiry or general
            let cleanSubject = subjectInput ? subjectInput.replace(/^(Inquiry about|Consulta sobre|Demande concernant):\s*/i, '') : "";
            let contextualMessage = `Hemos recibido tu mensaje exitosamente.`;
            if (cleanSubject) {
                 contextualMessage = `Hemos recibido tu solicitud de información relacionada con: <strong>${cleanSubject}</strong>.`;
            }

            if (lang === 'en') {
                subject = 'We have received your request - Punta Cana Investments';
                title = 'Contact Confirmation';
                greeting = `Hello <strong>${firstName}</strong>,`;
                body = 'An advisor from our team is reviewing your request and will contact you as soon as possible to provide the premium attention you deserve.';
                speedUpTitle = 'Want to speed up the process?';
                speedUpText = 'You can schedule a personalized video call with our experts immediately:';
                buttonText = 'Schedule Video Call';
                slogan = 'Building your wealth in paradise';
                contextualMessage = cleanSubject 
                    ? `We have successfully received your information request regarding: <strong>${cleanSubject}</strong>.`
                    : `We have successfully received your message.`;
            } else if (lang === 'fr') {
                subject = 'Nous avons reçu votre demande - Punta Cana Investments';
                title = 'Confirmation de Contact';
                greeting = `Bonjour <strong>${firstName}</strong>,`;
                body = 'Un conseiller de notre équipe examine votre demande et vous contactera dans les plus brefs délais pour vous offrir le service premium que vous méritez.';
                speedUpTitle = 'Vous souhaitez accélérer le processus ?';
                speedUpText = 'Vous pouvez planifier un appel vidéo personnalisé avec nos experts dès maintenant :';
                buttonText = "Planifier l'Appel Vidéo";
                slogan = 'Construire votre patrimoine au paradis';
                contextualMessage = cleanSubject 
                    ? `Nous avons bien reçu votre demande d'informations concernant : <strong>${cleanSubject}</strong>.`
                    : `Nous avons bien reçu votre message.`;
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
                        <p style="font-size: 16px; line-height: 1.6; color: #e0e0e0; margin-bottom: 20px;">
                            ${contextualMessage}
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

            const clientEmailRes = await resend.emails.send({
                from: 'Punta Cana Investments <info@puntacanainvestmentsrd.com>',
                to: [email],
                subject: subject,
                html: htmlTemplate
            });

            if (clientEmailRes.error) {
                console.error("Resend Error (Client Autoresponder):", clientEmailRes.error);
                // Si la Vercel Env no tiene el dominio verificado, esto fallará. Devolvemos el error visible en el form si queremos debugguear rápido.
                // return { success: false, message: `Request sent but autoresponder failed: ${clientEmailRes.error.message}` };
            }
        } catch (autoResponderError: any) {
            console.error("Client Autoresponder Exception:", autoResponderError);
            // return { success: false, message: `Request sent but inner autoresponder failed: ${autoResponderError.message}` };
        }

        // 4. Send Admin Notification Email via Resend
        try {
            const propertyDataStr = formData.get('propertyData') as string;
            let propertyDetailsHtml = '';
            
            if (propertyDataStr) {
                try {
                    const pd = JSON.parse(propertyDataStr);
                    propertyDetailsHtml = `
                        <div style="background-color: #1a1a1a; padding: 20px; border-left: 4px solid #c9ae5d; margin: 20px 0; border-radius: 4px;">
                            <p style="margin: 0 0 10px 0; color: #c9ae5d; font-size: 15px; font-weight: bold; text-transform: uppercase;">Datos de la Propiedad</p>
                            <p style="margin: 5px 0; color: #e0e0e0;"><strong>Nombre:</strong> ${pd.title}</p>
                            <p style="margin: 5px 0; color: #e0e0e0;"><strong>Ubicación:</strong> ${pd.location || 'N/A'}</p>
                            <p style="margin: 5px 0; color: #e0e0e0;"><strong>Precio:</strong> $${pd.price.toLocaleString()}</p>
                            <p style="margin: 5px 0; color: #e0e0e0;"><strong>Área:</strong> ${pd.area ? pd.area + ' m²' : 'N/A'}</p>
                        </div>
                    `;
                } catch(e) {}
            }

            const adminHtmlTemplate = `
            <html>
                <body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #000000; color: #ffffff; max-width: 600px; margin: 0 auto; padding: 0;">
                    <div style="background-color: #111111; padding: 40px 20px; text-align: center; border-bottom: 2px solid #c9ae5d;">
                        <img src="https://puntacanainvestmentsrd.com/images/logo-email.jpg" alt="Punta Cana Investments Logo" style="max-width: 320px; height: auto;" />
                    </div>
                    <div style="padding: 40px 30px; background-color: #0a0a0a;">
                        <h2 style="color: #c9ae5d; text-transform: uppercase; margin-top: 0; font-weight: 400; letter-spacing: 1px; text-align: center;">NUEVO LEAD WEB</h2>
                        <p style="font-size: 16px; line-height: 1.6; color: #e0e0e0; margin-bottom: 20px;">
                            Se ha registrado un nuevo lead en el sistema web.
                        </p>
                        
                        <div style="background-color: #1a1a1a; padding: 20px; border-left: 4px solid #c9ae5d; margin: 20px 0; border-radius: 4px;">
                            <p style="margin: 0 0 10px 0; color: #c9ae5d; font-size: 15px; font-weight: bold; text-transform: uppercase;">Datos del Cliente</p>
                            <p style="margin: 5px 0; color: #e0e0e0;"><strong>Nombre:</strong> ${name}</p>
                            <p style="margin: 5px 0; color: #e0e0e0;"><strong>Email:</strong> ${email}</p>
                            <p style="margin: 5px 0; color: #e0e0e0;"><strong>Teléfono:</strong> ${phone}</p>
                            <p style="margin: 5px 0; color: #e0e0e0;"><strong>Interés:</strong> ${backendData.interest}</p>
                        </div>

                        ${propertyDetailsHtml}

                        <div style="background-color: #1a1a1a; padding: 20px; border-left: 4px solid #c9ae5d; margin: 20px 0; border-radius: 4px;">
                            <p style="margin: 0 0 10px 0; color: #c9ae5d; font-size: 15px; font-weight: bold; text-transform: uppercase;">Mensaje del Cliente</p>
                            <p style="margin: 5px 0; color: #e0e0e0; white-space: pre-wrap;">${message}</p>
                        </div>
                        
                        <p style="font-size: 12px; color: #888888; text-align: center; margin-top: 30px;">Este lead ya fue enviado a HubSpot de forma automática.</p>
                    </div>
                </body>
            </html>
            `;

            await resend.emails.send({
                from: 'Web Punta Cana Investments <info@puntacanainvestmentsrd.com>',
                to: ['info@puntacanainvestmentsrd.com'],
                subject: `NUEVO LEAD WEB: ${name} - ${backendData.interest}`,
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
