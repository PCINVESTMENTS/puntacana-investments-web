import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

// Construct the Sanity Client using secure server-side environment variables
const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "vj4eb90m",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    token: process.env.SANITY_API_TOKEN, // Critical: Only available on the server
    apiVersion: "2024-01-01",
    useCdn: false // Don't use CDN for uploads
});

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Upload directly to Sanity Assets API
        const asset = await client.assets.upload('file', buffer, {
            filename: file.name,
            contentType: file.type
        });

        // Return the resulting URL to the frontend component
        return NextResponse.json({ url: asset.url }, { status: 200 });

    } catch (error: any) {
        console.error("Sanity Direct Upload Error:", error);
        return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
    }
}
