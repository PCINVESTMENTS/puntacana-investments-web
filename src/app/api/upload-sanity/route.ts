import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST() {
    // 🔴 OPERACIÓN CANCELADA: Por cumplimiento Anti-Lavado AML y Protección de Datos.
    // Todos los Buffers e ID Sensitivos deben transmitirse usando la encapsulación via API de 'api/kyc/'
    return NextResponse.json({ 
        error: "Forbidden. Inseguridad de CDN detectada. Use endpoints de Bóveda Fortress internos." 
    }, { status: 403 });
}
