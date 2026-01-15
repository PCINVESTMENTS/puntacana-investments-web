"use client";

import { FaWhatsapp, FaFacebookF, FaTwitter, FaLinkedinIn, FaLink } from "react-icons/fa";
import { useState } from "react";

interface ShareButtonsProps {
    title: string;
    url: string; // We'll pass the full URL or construct it
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);

    // Encode for URLs
    const encodedTitle = encodeURIComponent(title);
    const encodedUrl = encodeURIComponent(url);

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

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex items-center gap-4 mt-8 pt-8 border-t border-white/10">
            <span className="text-sm text-gray-400 uppercase tracking-widest font-bold">Compartir:</span>
            <div className="flex gap-4">
                {shareLinks.map((link) => (
                    <a
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-gray-400 transition-colors ${link.color} text-xl`}
                        title={`Compartir en ${link.name}`}
                    >
                        <link.icon />
                    </a>
                ))}
                <button
                    onClick={copyToClipboard}
                    className="text-gray-400 hover:text-white transition-colors text-xl relative"
                    title="Copiar Enlace"
                >
                    <FaLink />
                    {copied && (
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-luxury-gold text-black text-xs font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap">
                            ¡Copiado!
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
}
