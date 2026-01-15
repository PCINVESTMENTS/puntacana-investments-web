'use server'

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitContactForm(prevState: any, formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;

    // Simple validation
    if (!name || !email || !message) {
        return {
            success: false,
            message: 'Please fill in all required fields.'
        };
    }

    const subjectInput = formData.get('subject') as string;
    const emailSubject = subjectInput || `New Lead from Website: ${name}`;

    try {
        const data = await resend.emails.send({
            from: 'Punta Cana Investments <onboarding@resend.dev>', // Use verification email or this for testing
            to: ['uepcrealestate@gmail.com'],
            subject: emailSubject,
            html: `
        <h1>New Contact Form Submission</h1>
        <h2>${emailSubject}</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr />
        <p>Sent from Punta Cana Investments Web</p>
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
