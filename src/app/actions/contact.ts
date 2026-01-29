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
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (apiUrl) {
            const backendData = {
                first_name: name.split(' ')[0],
                last_name: name.split(' ').slice(1).join(' ') || '.',
                email: email,
                phone: phone,
                message: message,
                source: "Website Contact Form"
            };

            await fetch(`${apiUrl}/api/public/leads/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(backendData),
            }).then(async (res) => {
                if (!res.ok) {
                    const err = await res.text();
                    console.error("Backend Error:", err);
                    // We don't throw here to ensure email still sends as backup
                } else {
                    console.log("Lead saved to Backend successfully");
                }
            }).catch(err => {
                console.error("Backend Connection Error:", err);
            });
        }

        // 2. Send Notification Email via Resend
        const data = await resend.emails.send({
            from: 'Punta Cana Investments <onboarding@resend.dev>',
            to: ['uepcrealestate@gmail.com'],
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
            console.error("Resend Error:", data.error);
            return { success: false, message: 'Failed to send message via email. Please check backend.' };
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
