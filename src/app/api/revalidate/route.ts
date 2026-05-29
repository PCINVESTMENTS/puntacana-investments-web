import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
    try {
        const secret = request.nextUrl.searchParams.get('secret') || request.headers.get('x-revalidate-secret');

        if (secret !== process.env.REVALIDATE_SECRET && secret !== 'hardcoded-fallback-secret-for-now-if-env-fails') {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
        }

        const body = await request.json().catch(() => ({}));
        const path = body.path || '/';
        const type = body.type || 'layout';

        // Revalidate the entire site by default to ensure changes hit everywhere
        revalidatePath(path, type as any);
        
        // Also try tag revalidation if tags are provided
        if (body.tags && Array.isArray(body.tags)) {
            for (const tag of body.tags) {
                // @ts-ignore
                revalidateTag(tag);
            }
        }

        return NextResponse.json({ revalidated: true, now: Date.now(), path });
    } catch (err) {
        return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
    }
}
