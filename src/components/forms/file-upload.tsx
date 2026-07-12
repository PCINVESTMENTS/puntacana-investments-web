"use client";

import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { UploadCloud, CheckCircle2, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import imageCompression from "browser-image-compression";

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

    // Register the field internally
    register(name);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setUploadError(null);

        try {
            let fileToUpload = file;
            
            // Aggressive client-side compression for images before setting to form state
            if (file.type.startsWith('image/')) {
                const options = {
                    maxSizeMB: 1, // Compress to under 1MB
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                    initialQuality: 0.7
                };
                fileToUpload = await imageCompression(file, options);
            }

            // Set the raw File in the React Hook Form state so it can be picked up by FormData on final submission
            setValue(name, fileToUpload, { shouldValidate: true, shouldDirty: true });
            setUploadedFileName(file.name);
        } catch (err: any) {
            console.error("Compression Error:", err);
            setUploadError("Error procensando archivo: " + (err.message || 'No se pudo preparar el archivo.'));
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setValue(name, undefined, { shouldValidate: true, shouldDirty: true });
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
                            <div className="text-sm font-medium text-white">Procesando documento... / Processing...</div>
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
                            <div className="text-sm font-medium text-gray-400 group-hover:text-luxury-gold">Click para subir / Click to add</div>
                            <div className="text-xs text-gray-400">{description}</div>
                        </>
                    )}
                </div>
            </div>
            {uploadError && <p className="text-sm text-red-500 font-bold">{uploadError}</p>}
            {error && !uploadError && <p className="text-sm text-red-500">{error.message as string}</p>}
        </div>
    );
}
