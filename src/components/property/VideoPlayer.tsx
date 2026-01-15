"use client";

interface VideoPlayerProps {
    url: string;
    title?: string;
}

export default function VideoPlayer({ url, title }: VideoPlayerProps) {
    if (!url) return null;

    return (
        <div className="aspect-video w-full rounded-lg overflow-hidden border border-white/10 shadow-2xl relative bg-black">
            <iframe
                src={url}
                title={title || "Video"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
            ></iframe>
        </div>
    );
}
