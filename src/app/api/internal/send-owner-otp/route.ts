import crypto from "crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const OFFICIAL_SUPERADMIN_EMAIL = "ulisespp9@icloud.com";
const VERIFIED_FROM = "Punta Cana Investments <info@puntacanainvestmentsrd.com>";
const OTP_TTL_MINUTES = 15;

function hasValidSharedKey(req: Request): boolean {
  const expected = String(
    process.env.DASHBOARD_AUTH_API_KEY ||
      process.env.API_SHARED_SECRET ||
      ""
  ).trim();
  const provided = String(req.headers.get("x-api-key") || "").trim();
  if (!expected || !provided) return false;
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(provided, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  if (!hasValidSharedKey(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const otpCode = String(body.otp_code || "").trim();
  const purpose = String(body.purpose || "bootstrap").trim().toLowerCase();
  if (!/^\d{6}$/.test(otpCode)) {
    return NextResponse.json({ error: "Invalid OTP format" }, { status: 400 });
  }
  if (purpose !== "bootstrap" && purpose !== "recovery") {
    return NextResponse.json({ error: "Invalid purpose" }, { status: 400 });
  }

  // Strictly lock delivery to the official owner email ONLY.
  const requestedTo = Array.isArray(body.to)
    ? body.to.map((e) => String(e || "").trim().toLowerCase()).filter(Boolean)
    : [];
  const unauthorized = requestedTo.filter((e) => e !== OFFICIAL_SUPERADMIN_EMAIL);
  if (unauthorized.length > 0) {
    return NextResponse.json(
      { error: "Recipient not authorized for owner OTP" },
      { status: 403 }
    );
  }

  const resendKey = String(process.env.RESEND_API_KEY || "").trim();
  if (!resendKey) {
    return NextResponse.json(
      { error: "RESEND_API_KEY missing on web relay" },
      { status: 500 }
    );
  }

  const isBootstrap = purpose === "bootstrap";
  const subject = isBootstrap
    ? "Código de Activación Super Administrador — Centro de Mando PCI"
    : "Código de Recuperación Super Administrador — Centro de Mando PCI";
  const actionLabel = isBootstrap
    ? "activar tu cuenta de Super Administrador en el Centro de Mando"
    : "restablecer la contraseña de Super Administrador en el Centro de Mando";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #0a0a0a; color: #f5f5f5; padding: 32px; border: 1px solid #d4af37; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="color: #d4af37; font-size: 12px; letter-spacing: 3px; text-transform: uppercase;">Punta Cana Investments</div>
        <h2 style="color: #ffffff; margin: 8px 0 0; font-size: 22px;">Centro de Mando — Verificación de Propietario</h2>
      </div>
      <p style="color: #d4d4d8; font-size: 14px; line-height: 1.6;">
        Usa el siguiente código de un solo uso para ${actionLabel}:
      </p>
      <div style="background: #141414; border: 1px solid rgba(212, 175, 55, 0.5); border-radius: 10px; padding: 20px; text-align: center; margin: 24px 0;">
        <div style="font-size: 36px; font-weight: bold; letter-spacing: 10px; color: #d4af37; font-family: monospace;">${otpCode}</div>
      </div>
      <p style="color: #a1a1aa; font-size: 12px; line-height: 1.6;">
        • Válido durante <strong>${OTP_TTL_MINUTES} minutos</strong> y para un solo uso.<br/>
        • Si no solicitaste este código, ignora este correo: nadie puede modificar tus accesos sin este código.
      </p>
    </div>
  `;

  try {
    const resend = new Resend(resendKey);
    const { data, error } = await resend.emails.send({
      from: VERIFIED_FROM,
      to: [OFFICIAL_SUPERADMIN_EMAIL],
      subject,
      html,
      text: `Punta Cana Investments — Código de verificación (${OTP_TTL_MINUTES} min): ${otpCode}`,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message || "Resend delivery failed" },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { sent: true, id: data?.id || null, to: OFFICIAL_SUPERADMIN_EMAIL },
      { status: 200 }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `Relay exception: ${msg.slice(0, 160)}` },
      { status: 502 }
    );
  }
}
