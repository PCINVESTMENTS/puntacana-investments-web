"use client";

import { FaWhatsapp, FaFacebookF, FaTwitter, FaLinkedinIn, FaLink, FaCheck } from "react-icons/fa";
import { useRef, useState } from "react";

interface ShareButtonsProps {
    title: string;
    url: string;
    lang?: "es" | "en" | "fr" | string;
}

function copyViaExecCommand(text: string): boolean {
    if (typeof document === "undefined") return false;
    const activeEl = document.activeElement as HTMLElement | null;
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.setAttribute("aria-hidden", "true");
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "-9999px";
    textarea.style.width = "1px";
    textarea.style.height = "1px";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);

    let copied = false;
    try {
        textarea.focus({ preventScroll: true });
        textarea.select();
        textarea.setSelectionRange(0, text.length);
        copied = document.execCommand("copy");
    } catch {
        copied = false;
    } finally {
        document.body.removeChild(textarea);
        if (activeEl && typeof activeEl.focus === "function") {
            try {
                activeEl.focus({ preventScroll: true });
            } catch {
                // ignore focus restore failures
            }
        }
    }
    return copied;
}

export default function ShareButtons({ title, url, lang = "es" }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const encodedTitle = encodeURIComponent(title);
    const encodedUrl = encodeURIComponent(url);

    const isEn = lang === "en";
    const isFr = lang === "fr";
    const shareHeading = isEn ? "Share:" : isFr ? "Partager :" : "Compartir:";
    const copyLabel = isEn ? "Copy Link" : isFr ? "Copier le lien" : "Copiar Enlace";
    const copiedToast = isEn ? "Copied!" : isFr ? "Copié !" : "¡Copiado!";

    const shareLinks = [
        {
            name: "WhatsApp",
            icon: FaWhatsapp,
            href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
            color: "hover:text-green-500"
        },
        {
            name: "Facebook",
            icon: FaFacebookF,
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            color: "hover:text-blue-600"
        },
        {
            name: "Twitter",
            icon: FaTwitter,
            href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
            color: "hover:text-sky-500"
        },
        {
            name: "LinkedIn",
            icon: FaLinkedinIn,
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            color: "hover:text-blue-700"
        }
    ];

    const copyToClipboard = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const btn = e.currentTarget;
        try {
            btn.focus({ preventScroll: true });
        } catch {
            // ignore
        }

        // 1. Synchronous copy inside active user gesture (guarantees click & Enter both write clipboard even on http://127.0.0.1)
        let ok = copyViaExecCommand(url);

        // 2. Also invoke modern Clipboard API when available (and treat success as authoritative)
        if (typeof navigator !== "undefined" && navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
            try {
                await navigator.clipboard.writeText(url);
                ok = true;
            } catch {
                // If async API failed (e.g. non-HTTPS origin or focus restriction), retry sync fallback if needed
                if (!ok) {
                    ok = copyViaExecCommand(url);
                }
            }
        }

        if (ok) {
            setCopied(true);
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => setCopied(false), 2500);
        }
    };

    return (
        <div className="flex items-center gap-4 mt-8 pt-8 border-t border-white/10" data-share-url={url}>
            <span className="text-sm text-gray-400 uppercase tracking-widest font-bold">{shareHeading}</span>
            <div className="flex items-center gap-2">
                {shareLinks.map((link) => (
                    <a
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center justify-center w-9 h-9 rounded-md text-gray-400 transition-colors ${link.color} text-xl`}
                        title={`${isEn ? "Share on" : isFr ? "Partager sur" : "Compartir en"} ${link.name}`}
                        aria-label={`${isEn ? "Share on" : isFr ? "Partager sur" : "Compartir en"} ${link.name}`}
                    >
                        <link.icon aria-hidden="true" className="pointer-events-none" />
                    </a>
                ))}
                <button
                    type="button"
                    onClick={copyToClipboard}
                    data-copy-url={url}
                    data-copied={copied ? "true" : "false"}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors text-xl relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                    title={copyLabel}
                    aria-label={copyLabel}
                >
                    {copied ? (
                        <FaCheck aria-hidden="true" className="pointer-events-none text-luxury-gold text-base" />
                    ) : (
                        <FaLink aria-hidden="true" className="pointer-events-none" />
                    )}
                    {copied && (
                        <span
                            role="status"
                            aria-live="polite"
                            className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 bg-luxury-gold text-black text-xs font-bold px-2.5 py-1 rounded shadow-lg whitespace-nowrap"
                        >
                            {copiedToast}
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
}
