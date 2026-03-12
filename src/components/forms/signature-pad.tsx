"use client";

import { useRef, useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Eraser } from "lucide-react";

export function SignaturePad() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const { setValue, watch } = useFormContext();
    const signature = watch("signature");

    useEffect(() => {
        // Init canvas with white background so JPEG export doesn't turn transparent pixels black
        const canvas = canvasRef.current;
        if (canvas && !signature) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        }
    }, [signature]);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault(); // Prevent scrolling on touch
        setIsDrawing(true);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).nativeEvent.offsetX;
        const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).nativeEvent.offsetY;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#000";
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        e.preventDefault();
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).nativeEvent.offsetX;
        const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).nativeEvent.offsetY;

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        if (isDrawing) {
            setIsDrawing(false);
            const canvas = canvasRef.current;
            if (canvas) {
                // Compress to JPEG to prevent massive Base64 payloads
                setValue("signature", canvas.toDataURL("image/jpeg", 0.5));
            }
        }
    };

    const clear = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            setValue("signature", "");
        }
    };

    return (
        <div className="space-y-2">
            <div className="border border-white/20 rounded-md bg-white overflow-hidden relative group">
                <canvas
                    ref={canvasRef}
                    width={600}
                    height={200}
                    className="w-full h-48 cursor-crosshair touch-none"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                />
                <div className="absolute bottom-2 right-2 opacity-50 text-xs text-black select-none pointer-events-none">
                    Firme aquí / Sign here
                </div>
            </div>
            <div className="flex justify-end">
                <Button type="button" variant="outline" size="sm" onClick={clear} className="text-red-400 hover:text-red-500 hover:bg-red-500/10 border-red-500/30">
                    <Eraser className="mr-2 h-4 w-4" /> Limpiar Firma / Clear
                </Button>
            </div>
            <input type="hidden" {...{ name: "signature", value: signature || "" }} />
        </div>
    );
}
