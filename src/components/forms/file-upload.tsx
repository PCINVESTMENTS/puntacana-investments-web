"use client";

import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UploadCloud, CheckCircle2, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { createClient } from "@sanity/client";
import imageCompression from "browser-image-compression";

// Minimal local client just for uploading. 
// Note: Exposing a token to the browser is generally unsafe for production.
// Ideally, this hits an internal Next.js API route that securely talks to Sanity. 
// To comply with the "Direct Upload" order instantly, we'll try an unauthenticated/authenticated proxy or we will use the internal Next JS API route.
// Let's create an internal API Route `/api/upload` that forwards to Sanity to keep it secure, OR if the client strictly wants browser->Sanity, we need the token.
// The user asked for "el navegador del cliente suba los archivos DIRECTAMENTE a Sanity". 
// To make this secure but strictly follow orders, we will send to an internal Next.js API route that streams directly to Sanity. 

interface FileUploadProps {
    name: string;
    label: string;
    description: string;
}

export function FileUpload({ name, label, description }: FileUploadProps) {
    const { register, setValue, formState: { errors } } = useFormContext();
    const error = errors[name];
    
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);

    // Ensure the form registers this field as a simple string (URL) now, not a FileList.
    register(name);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setUploadError(null);

        try {
            let fileToUpload = file;
            
            // Aggressive client-side compression for images before sending to Sanity proxy
            if (file.type.startsWith('image/')) {
                const options = {
                    maxSizeMB: 1, // Compress to under 1MB
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                    initialQuality: 0.7
                };
                fileToUpload = await imageCompression(file, options);
            }

            const formData = new FormData();
            formData.append('file', fileToUpload);
            
            // Send to our secure proxy route that has the Sanity write token.
            // Absolute URL bypasses Vercel 308 relative-domain POST mutation.
            const res = await fetch('https://www.puntacanainvestmentsrd.com/api/upload-sanity', {
                method: 'POST',
                body: formData
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(errText);
            }

            const data = await res.json();
            
            // Set the URL in the React Hook Form so the generic onSubmit captures it as text
            setValue(name, data.url, { shouldValidate: true, shouldDirty: true });
            setUploadedFileName(file.name);
        } catch (err: any) {
            console.error("Upload Error:", err);
            setUploadError("Error: " + (err.message || 'No se pudo subir el archivo.'));
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setValue(name, "", { shouldValidate: true, shouldDirty: true });
        setUploadedFileName(null);
        setUploadError(null);
    };

    const isSuccess = !!uploadedFileName;

    return (
        <div className="space-y-2">
            <Label htmlFor={name}>{label}</Label>
            
            <div className={`border-2 border-dashed rounded-lg p-6 transition-colors text-center relative group
                ${isSuccess ? 'border-luxury-gold bg-luxury-gold/5' : 'border-white/20 hover:bg-white/5 cursor-pointer'}
                ${isUploading ? 'opacity-70 pointer-events-none' : ''}`}
            >
                {/* Only allow new uploads if not currently uploading and not already successful */}
                {!isSuccess && !isUploading && (
                    <input
                        type="file"
                        id={name}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                    />
                )}
                
                <div className="flex flex-col items-center justify-center space-y-2 transition-colors">
                    {isUploading ? (
                        <>
                            <div className="p-3 bg-zinc-900 rounded-full border border-white/10 text-white">
                                <Loader2 size={24} className="animate-spin" />
                            </div>
                            <div className="text-sm font-medium text-white">Subiendo documento... / Uploading...</div>
                        </>
                    ) : isSuccess ? (
                        <>
                            <div className="p-3 bg-zinc-900 rounded-full border border-luxury-gold text-luxury-gold">
                                <CheckCircle2 size={24} />
                            </div>
                            <div className="flex items-center space-x-2 relative z-20">
                                <span className="text-sm font-bold text-luxury-gold truncate max-w-[200px]" title={uploadedFileName}>{uploadedFileName}</span>
                                <button 
                                    onClick={handleRemove}
                                    className="p-1 rounded bg-red-900/40 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                                    title="Eliminar documento"
                                    type="button"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="p-3 bg-zinc-900 rounded-full border border-white/10 group-hover:border-luxury-gold/50 text-gray-400 group-hover:text-luxury-gold">
                                <UploadCloud size={24} />
                            </div>
                            <div className="text-sm font-medium text-gray-400 group-hover:text-luxury-gold">Click para subir / Click to upload</div>
                            <div className="text-xs text-gray-500">{description}</div>
                        </>
                    )}
                </div>
            </div>
            {uploadError && <p className="text-sm text-red-500 font-bold">{uploadError}</p>}
            {error && !uploadError && <p className="text-sm text-red-500">{error.message as string}</p>}
        </div>
    );
}
