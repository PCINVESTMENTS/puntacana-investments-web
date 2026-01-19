"use client";

import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { UploadCloud } from "lucide-react";

interface FileUploadProps {
    name: string;
    label: string;
    description: string;
}

export function FileUpload({ name, label, description }: FileUploadProps) {
    const { register, formState: { errors } } = useFormContext();
    const error = errors[name];

    return (
        <div className="space-y-2">
            <Label htmlFor={name}>{label}</Label>
            <div className="border-2 border-dashed border-white/20 rounded-lg p-6 hover:bg-white/5 transition-colors text-center cursor-pointer relative group">
                <input
                    type="file"
                    id={name}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    accept=".pdf,.jpg,.jpeg,.png"
                    {...register(name)}
                />
                <div className="flex flex-col items-center justify-center space-y-2 text-gray-400 group-hover:text-luxury-gold transition-colors">
                    <div className="p-3 bg-zinc-900 rounded-full border border-white/10 group-hover:border-luxury-gold/50">
                        <UploadCloud size={24} />
                    </div>
                    <div className="text-sm font-medium">Click para subir o arrastrar / Click to upload</div>
                    <div className="text-xs text-gray-500">{description}</div>
                </div>
            </div>
            {error && <p className="text-sm text-red-500">{error.message as string}</p>}
        </div>
    );
}
