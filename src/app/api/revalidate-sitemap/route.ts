import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { _type, slug } = body;

        // 1. Revalidar Sitemap.xml para Google (SEO Priority)
        revalidatePath('/sitemap.xml');
        revalidatePath('/es/sitemap.xml');
        revalidatePath('/en/sitemap.xml');

        // 2. Revalidar listado y página específica de la propiedad
        if (_type === 'property') {
            revalidatePath('/[lang]/properties', 'page');

            if (slug?.current) {
                revalidatePath(`/[lang]/properties/${slug.current}`, 'page');
            }
        }

        return NextResponse.json({
            revalidated: true,
            message: "Sincronización instantánea activa: Web y Sitemap actualizados."
        });
    } catch (err) {
        return NextResponse.json({ message: 'Error en Webhook', err }, { status: 500 });
    }
}
