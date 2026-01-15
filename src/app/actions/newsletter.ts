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
        await resend.emails.send({
            from: 'Punta Cana Investments <onboarding@resend.dev>',
            to: ['uepcrealestate@gmail.com'],
            subject: `New Newsletter Subscription (${source})`,
            html: `
        <h1>New Subscription</h1>
        <p><strong>Source:</strong> ${source}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><em>Added to database pending manual processing.</em></p>
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
