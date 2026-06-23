'use server'

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitNewsletter(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    const source = formData.get('source') || 'Footer Newsletter';

    if (!email) {
        return {
            success: false,
            message: 'Please enter a valid email.'
        };
    }

    try {
        // 1. Send to "Fortaleza Digital" Backend (Django)
        const apiUrl = "https://puntacana-fortress-production.up.railway.app";
        const isOffMarket = String(source).toLowerCase().includes('off market');
        
        const backendData = {
            first_name: isOffMarket ? "Inversor Elite" : "Suscriptor Newsletter",
            last_name: email.split('@')[0],
            email: email,
            message: isOffMarket ? `Solicitud de acceso al club Off Market. Origen: ${source}` : `Suscripción a boletín registrada desde: ${source}`,
            source: source // Conservar 'Off Market Club' o lo que provenga del form ('Footer Newsletter')
        };

        const res = await fetch(`${apiUrl}/api/public/leads/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(backendData),
        });

        if (!res.ok) {
            const errText = await res.text();
            console.error("Backend Error:", errText);
            throw new Error(`Error del sistema central: ${res.status}`);
        }
        await resend.emails.send({
            from: 'Punta Cana Investments <onboarding@resend.dev>',
            to: ['info@puntacanainvestmentsrd.com'],
            subject: `New Investors Club Member (${source})`,
            html: `
        <h1>New Member Joined</h1>
        <p><strong>Source:</strong> ${source}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><em>This user has requested access to the Off-Market portfolio.</em></p>
      `
        });

        // 3. Send Subscriber Confirmation (Welcome Email VIP or Standard)
        // isOffMarket is already defined above
        
        let subjectStr = isOffMarket ? 'Acceso Exclusivo: Off-Market Portfolio | Punta Cana Investments' : 'Bienvenido al Club | Punta Cana Investments';
        
        let htmlBody = isOffMarket ? `
        <html>
            <body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #000000; color: #ffffff; max-width: 600px; margin: 0 auto; padding: 0;">
                <div style="background-color: #111111; padding: 40px 20px; text-align: center; border-bottom: 2px solid #c9ae5d;">
                    <img src="https://puntacanainvestmentsrd.com/images/pci-logo-gold.png" alt="Punta Cana Investments Logo" style="max-width: 180px; height: auto;" />
                </div>
                <div style="padding: 40px 30px; background-color: #0a0a0a;">
                    <h2 style="color: #c9ae5d; text-transform: uppercase; margin-top: 0; font-weight: 400; letter-spacing: 1px; text-align: center;">Acceso Aprobado</h2>
                    <p style="font-size: 16px; line-height: 1.6; color: #e0e0e0; margin-bottom: 20px;">
                        Estimado Inversor,
                    </p>
                    <p style="font-size: 16px; line-height: 1.6; color: #e0e0e0; margin-bottom: 20px;">
                        Su solicitud para ingresar a nuestro <strong>Círculo de Inversionistas Elite</strong> ha sido procesada con éxito.
                    </p>
                    <p style="font-size: 16px; line-height: 1.6; color: #e0e0e0; margin-bottom: 30px;">
                        Debido a la naturaleza altamente confidencial y exclusiva de nuestras propiedades Off Market, no publicamos ni enviamos estos portafolios masivamente. Su acceso ha sido aprobado, y el siguiente paso es agendar una presentación privada 1-a-1 con uno de nuestros Directores de Inversión para estructurar este portafolio acorde a su fondo.
                    </p>
                    
                    <div style="background-color: #1a1a1a; padding: 25px; border-left: 4px solid #c9ae5d; margin: 30px 0; border-radius: 4px;">
                        <p style="margin: 0 0 15px 0; color: #ffffff; font-size: 15px;"><strong>Agende su sesión confidencial:</strong></p>
                        <p style="margin: 0;">
                            <a href="https://calendly.com/ulisespp9/30min" style="display: inline-block; background-color: #c9ae5d; color: #000000; padding: 12px 24px; text-decoration: none; border-radius: 2px; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Programar Videollamada VIP</a>
                        </p>
                    </div>
                </div>
                <div style="background-color: #111111; padding: 30px; text-align: center; border-top: 1px solid #333333;">
                    <p style="margin: 0; font-size: 14px; color: #c9ae5d; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">Punta Cana Investments</p>
                    <p style="margin: 10px 0 0 0; font-size: 12px; color: #888888;">Reserva absoluta.</p>
                </div>
            </body>
        </html>
        ` : `
        <div style="font-family: serif; color: #111; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #d4af37; text-transform: uppercase; letter-spacing: 2px;">Welcome to the Club</h1>
            <p>Dear Investor,</p>
            <p>Thank you for subscribing to our newsletter.</p>
            <p>We will send you our best insights periodically.</p>
            <br/>
            <p>Sincerely,</p>
            <p><strong>The Punta Cana Investments Team</strong></p>
        </div>
        `;

        const welcomeMailObj = await resend.emails.send({
            from: 'Punta Cana Investments <info@puntacanainvestmentsrd.com>',
            to: [email],
            subject: subjectStr,
            html: htmlBody
        });

        if (welcomeMailObj.error) {
            console.error("Resend VIP Client Mail Error:", welcomeMailObj.error);
            return {
                success: false,
                message: `Hubo un error del servidor confirmando tu correo institucional: ${welcomeMailObj.error.message}`
            };
        }

        return {
            success: true,
            message: 'Subscribed successfully!'
        };

    } catch (error) {
        console.error("Newsletter Error:", error);
        return {
            success: false,
            message: `Failed to subscribe. ${error instanceof Error ? error.message : 'Try again.'}`
        };
    }
}
