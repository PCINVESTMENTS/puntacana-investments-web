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
        }
    };

    const dict = t[lang as keyof typeof t] || t.en;

    // Simple validation
    if (!name || !email || !message) {
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
            const firstName = name.split(' ')[0] || 'Cliente';
            // Custom message depending on if it's a property inquiry or general
            let contextualMessage = `Hemos recibido tu mensaje exitosamente.`;
            if (subjectInput) {
                 contextualMessage = `Hemos recibido tu solicitud de información relacionada con: <strong>${subjectInput.replace(/^(Inquiry about|Consulta sobre):\s*/, '')}</strong>.`;
            }

            const htmlTemplate = `
            <html>
                <body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #000000; color: #ffffff; max-width: 600px; margin: 0 auto; padding: 0;">
                    <div style="background-color: #111111; padding: 40px 20px; text-align: center; border-bottom: 2px solid #c9ae5d;">
                        <img src="https://puntacanainvestmentsrd.com/images/logo-email.jpg" alt="Punta Cana Investments Logo" style="max-width: 320px; height: auto;" />
                    </div>
                    <div style="padding: 40px 30px; background-color: #0a0a0a;">
                        <h2 style="color: #c9ae5d; text-transform: uppercase; margin-top: 0; font-weight: 400; letter-spacing: 1px; text-align: center;">Confirmación de Contacto</h2>
                        <p style="font-size: 16px; line-height: 1.6; color: #e0e0e0; margin-bottom: 20px;">
                            Hola <strong>${firstName}</strong>,
                        </p>
                        <p style="font-size: 16px; line-height: 1.6; color: #e0e0e0; margin-bottom: 20px;">
                            ${contextualMessage}
                        </p>
                        <p style="font-size: 16px; line-height: 1.6; color: #e0e0e0; margin-bottom: 30px;">
                            Un asesor de nuestro equipo está revisando tu solicitud y se comunicará contigo a la mayor brevedad posible para brindarte la atención premium que mereces.
                        </p>
                        
                        <div style="background-color: #1a1a1a; padding: 25px; border-left: 4px solid #c9ae5d; margin: 30px 0; border-radius: 4px;">
                            <p style="margin: 0 0 15px 0; color: #ffffff; font-size: 15px;"><strong>¿Deseas agilizar el proceso?</strong><br>
                            Puedes agendar una videollamada personalizada con nuestros expertos inmediatamente:</p>
                            <p style="margin: 0;">
                                <a href="https://calendly.com/" style="display: inline-block; background-color: #c9ae5d; color: #000000; padding: 12px 24px; text-decoration: none; border-radius: 2px; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Agendar Videollamada</a>
                            </p>
                        </div>
                    </div>
                    <div style="background-color: #111111; padding: 30px; text-align: center; border-top: 1px solid #333333;">
                        <p style="margin: 0; font-size: 14px; color: #c9ae5d; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">Punta Cana Investments</p>
                        <p style="margin: 10px 0 0 0; font-size: 12px; color: #888888;">Construyendo tu patrimonio en el paraíso</p>
                    </div>
                </body>
            </html>
            `;

            const clientEmailRes = await resend.emails.send({
                from: 'Punta Cana Investments <info@puntacanainvestmentsrd.com>',
                to: [email],
                subject: 'Hemos recibido tu solicitud - Punta Cana Investments',
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
            await resend.emails.send({
                from: 'Sistema Web <info@puntacanainvestmentsrd.com>',
                to: ['info@puntacanainvestmentsrd.com'],
                subject: `NUEVO LEAD WEB: ${name} - ${backendData.interest}`,
                html: `
                    <div style="font-family: sans-serif; padding: 20px; color: #333;">
                        <h2>Nuevo Lead Registrado desde la Web</h2>
                        <p><strong>Nombre:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Teléfono:</strong> ${phone}</p>
                        <p><strong>Interés/Propiedad:</strong> ${backendData.interest}</p>
                        <p><strong>Mensaje:</strong><br/>${message}</p>
                        <hr/>
                        <p><small>Este lead ya ha sido enviado a HubSpot y al CRM Dashboard automáticamente.</small></p>
                    </div>
                `
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
