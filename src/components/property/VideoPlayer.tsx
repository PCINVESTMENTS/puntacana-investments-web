"use client";

interface VideoPlayerProps {
    url: string;
    title?: string;
}

function toEmbedUrl(rawUrl: string): string {
    const trimmed = String(rawUrl || "").trim();
    if (!trimmed) return "";
    try {
        const parsed = new URL(trimmed);
        const host = parsed.hostname.replace(/^www\./i, "").toLowerCase();
        if (host === "youtube.com" || host === "m.youtube.com") {
            if (parsed.pathname === "/watch" && parsed.searchParams.get("v")) {
                return `https://www.youtube.com/embed/${parsed.searchParams.get("v")}`;
            }
            const shortsMatch = /^\/shorts\/([^/?#]+)/i.exec(parsed.pathname);
            if (shortsMatch) {
                return `https://www.youtube.com/embed/${shortsMatch[1]}`;
            }
        }
        if (host === "youtu.be") {
            const vid = parsed.pathname.replace(/^\/+/, "").split("/")[0];
            if (vid) return `https://www.youtube.com/embed/${vid}`;
        }
        if (host === "vimeo.com") {
            const vmMatch = /^\/(\d+)/.exec(parsed.pathname);
            if (vmMatch) return `https://player.vimeo.com/video/${vmMatch[1]}`;
        }
    } catch {
        // Keep raw URL when not a standard absolute URL
    }
    return trimmed;
}

export default function VideoPlayer({ url, title }: VideoPlayerProps) {
    if (!url) return null;
    const embedSrc = toEmbedUrl(url);

    return (
        <div className="aspect-video w-full rounded-lg overflow-hidden border border-white/10 shadow-2xl relative bg-black">
            <iframe
                src={embedSrc}
                title={title || "Video"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
            ></iframe>
        </div>
    );
}
