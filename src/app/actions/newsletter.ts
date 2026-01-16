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
        // 1. Send Admin Notification
        await resend.emails.send({
            from: 'Punta Cana Investments <onboarding@resend.dev>',
            to: ['uepcrealestate@gmail.com'],
            subject: `New Investors Club Member (${source})`,
            html: `
        <h1>New Member Joined</h1>
        <p><strong>Source:</strong> ${source}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><em>This user has requested access to the Off-Market portfolio.</em></p>
      `
        });

        // 2. Send Subscriber Confirmation (Welcome Email)
        await resend.emails.send({
            from: 'Punta Cana Investments <onboarding@resend.dev>',
            to: [email],
            subject: 'Welcome to the Club | Punta Cana Investments',
            html: `
        <div style="font-family: serif; color: #111; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #d4af37; text-transform: uppercase; letter-spacing: 2px;">Welcome to the Club</h1>
            <p>Dear Investor,</p>
            <p>Thank you for requesting access to our private <strong>Off-Market Portfolio</strong>.</p>
            <p>We have received your request. One of our senior investment advisors will review your profile and contact you shortly with our current exclusive opportunities that are not available to the public.</p>
            <p>In the meantime, feel free to browse our <a href="https://puntacanainvestments.com">public collection</a>.</p>
            <br/>
            <p>Sincerely,</p>
            <p><strong>The Punta Cana Investments Team</strong></p>
        </div>
      `
        });

        return {
            success: true,
            message: 'Subscribed successfully!'
        };

    } catch (error) {
        console.error("Newsletter Error:", error);
        return {
            success: false,
            message: 'Failed to subscribe. Try again.'
        };
    }
}
