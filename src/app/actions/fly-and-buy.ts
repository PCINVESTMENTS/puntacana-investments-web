'use server'

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitFlyAndBuyForm(prevState: any, formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const country = formData.get('country') as string;
    const objective = formData.getAll('objective') as string[];
    const propertyType = formData.getAll('propertyType') as string[];
    const investmentFocus = formData.getAll('investmentFocus') as string[];
    const experience = formData.get('experience') as string;
    const horizon = formData.get('horizon') as string;
    const visited = formData.get('visited') as string;
    const motivation = formData.getAll('motivation') as string[];
    const comments = formData.get('comments') as string;

    // Validation
    if (!name || !email || !phone || !country) {
        return {
            success: false,
            message: 'Please fill in all required fields.'
        };
    }

    try {
        const data = await resend.emails.send({
            from: 'Punta Cana Investments <onboarding@resend.dev>',
            to: ['uepcrealestate@gmail.com'],
            subject: `New Fly & Buy Inquiry: ${name}`,
            html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #000; padding: 20px; text-align: center;">
                <h1 style="color: #E4CA7C; margin: 0;">Fly & Buy Inquiry</h1>
            </div>
            
            <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
                <h2 style="color: #000; border-bottom: 2px solid #E4CA7C; padding-bottom: 10px;">Personal Details</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Country:</strong> ${country}</p>

                <h2 style="color: #000; border-bottom: 2px solid #E4CA7C; padding-bottom: 10px; margin-top: 30px;">Interest Profile</h2>
                
                <p><strong>Main Objective:</strong><br/>
                ${objective.map(o => `• ${o}`).join('<br/>')}</p>

                <p><strong>Property Interest:</strong><br/>
                ${propertyType.map(p => `• ${p}`).join('<br/>')}</p>

                ${investmentFocus.length > 0 ? `
                <p><strong>Investment Focus:</strong><br/>
                ${investmentFocus.map(i => `• ${i}`).join('<br/>')}</p>
                ` : ''}

                <p><strong>Experience:</strong> ${experience}</p>
                <p><strong>Timeframe:</strong> ${horizon}</p>

                <h2 style="color: #000; border-bottom: 2px solid #E4CA7C; padding-bottom: 10px; margin-top: 30px;">Fly & Buy Program</h2>
                <p><strong>Visited Before:</strong> ${visited}</p>
                
                <p><strong>Motivation:</strong><br/>
                ${motivation.map(m => `• ${m}`).join('<br/>')}</p>

                <h2 style="color: #000; border-bottom: 2px solid #E4CA7C; padding-bottom: 10px; margin-top: 30px;">Additional Comments</h2>
                <p style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #E4CA7C;">${comments || 'No comments provided.'}</p>
            </div>
            
            <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #666; margin-top: 20px;">
                Sent from Punta Cana Investments Web
            </div>
        </div>
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
