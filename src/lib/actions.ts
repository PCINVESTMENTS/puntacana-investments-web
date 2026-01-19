'use server';

export async function sendSubmissionEmail(data: any) {
    console.log("Mock sending email:", data);
    return Promise.resolve(true);
}
