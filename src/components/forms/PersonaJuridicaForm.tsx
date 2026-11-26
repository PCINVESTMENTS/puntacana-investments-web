"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { personaJuridicaSchema, type PersonaJuridicaData } from "@/lib/schemas";
import { getKycDict } from "@/dictionaries/kyc";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { precheckKycSubmission, sendKYCEmailNotification } from "@/app/actions/kyc";
import { FormAntispamFields } from "./FormAntispamFields";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FileUpload } from "./file-upload";
import { SignaturePad } from "./signature-pad";
import { Building, Users, UserCheck, Banknote, FileText, CheckCircle, Pencil, Loader2, Landmark, PlusCircle, X } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";

const defaultValues: Partial<PersonaJuridicaData> = {
    customerCode: "",
    date: new Date(),
    companyName: "",
    commercialName: "",
    incorporationDate: new Date(),
    constitutionCountry: "",
    city: "",
    rnc: "",
    socios: [{ nombre: "", identificacion: "", nacionalidad: "", porcentaje: "", cargo: "" }],
    legalRepFirstName: "",
    legalRepLastName: "",
    legalRepId: "",
    legalRepBirthDate: new Date(),
    legalRepAddress: "",
    legalRepPhone: "",
    legalRepEmail: "",
    legalRepProfession: "",
    legalRepProfessionOther: "",
    legalRepPosition: "",
    legalRepPositionOther: "",
    legalRepDesignation: "",
    averageIncome: "",
    annualIncome: "",
    incomeUSD: "",
    fundsOrigin: "",
    isPEP: "no",
    pepPosition: "",
    pepInstitution: "",
    pepCountry: "",
    declaration: false,
    declaration2: false,
    authorization: false,
    declaration4: false,
    signature: "",
};

const FormSection = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
    <div className="py-6">
        <div className="flex items-center gap-3 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-luxury-gold/10 text-luxury-gold">{icon}</div>
            <h2 className="text-xl font-semibold text-white">{title}</h2>
        </div>
        <div className="space-y-6">{children}</div>
    </div>
);

const dataURLtoFile = (dataurl: string, filename: string) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
};

interface KycSuccessMeta {
    dossierId: string;
    sandboxIsolated: boolean;
    emailSent: boolean;
    emailAttempted: boolean;
}

export function PersonaJuridicaForm() {
    const { toast } = useToast();
    const params = useParams();
    const lang = (params.lang as string) || "es";
    const dict = getKycDict(lang);
    const c = dict.common;
    const j = dict.juridica;
    const opts = dict.options;

    const [draft, setDraft] = useLocalStorage<Partial<PersonaJuridicaData> | null>("persona-juridica-draft", null);

    const form = useForm<PersonaJuridicaData>({
        resolver: zodResolver(personaJuridicaSchema),
        defaultValues: draft || defaultValues,
    });

    const { fields: socioFields, append: appendSocio, remove: removeSocio } = useFieldArray({
        control: form.control,
        name: "socios",
    });

    const isPEP = form.watch("isPEP");
    const legalRepProfession = form.watch("legalRepProfession");
    const legalRepPosition = form.watch("legalRepPosition");

    const [hasLoadedDraft, setHasLoadedDraft] = useState(false);
    const [successMeta, setSuccessMeta] = useState<KycSuccessMeta | null>(null);

    useEffect(() => {
        if (draft && !hasLoadedDraft) {
            const parsedDraft = { ...draft };
            if (typeof parsedDraft.date === "string") parsedDraft.date = new Date(parsedDraft.date);
            if (typeof parsedDraft.incorporationDate === "string") parsedDraft.incorporationDate = new Date(parsedDraft.incorporationDate);
            if (typeof parsedDraft.legalRepBirthDate === "string") parsedDraft.legalRepBirthDate = new Date(parsedDraft.legalRepBirthDate);
            if (!Array.isArray(parsedDraft.socios) || parsedDraft.socios.length === 0) {
                parsedDraft.socios = [{ nombre: "", identificacion: "", nacionalidad: "", porcentaje: "", cargo: "" }];
            }
            form.reset(parsedDraft);
            setHasLoadedDraft(true);
        } else if (!draft && !hasLoadedDraft) {
            setHasLoadedDraft(true);
        }
    }, [draft, form, hasLoadedDraft]);

    const currentValues = form.watch();
    const honeypotRef = useRef("");
    const formLoadedAtRef = useRef("");
    const handleHoneypotChange = useCallback((val: string) => {
        honeypotRef.current = val;
    }, []);
    const handleLoadedAtReady = useCallback((ts: string) => {
        formLoadedAtRef.current = ts;
    }, []);
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDraft(currentValues as Partial<PersonaJuridicaData>);
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [currentValues, setDraft]);

    const onSubmit = async (data: PersonaJuridicaData) => {
        try {
            const subjectName = data.companyName.trim();
            const isLocalHost =
                typeof window !== "undefined" &&
                (window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost");

            let precheckRefCode = "";
            if (!isLocalHost) {
                const precheck = await precheckKycSubmission({
                    email: data.legalRepEmail,
                    formType: "Persona Jurídica",
                    lang,
                    honeypot: honeypotRef.current,
                    formLoadedAt: formLoadedAtRef.current,
                });
                if (!precheck.allowed) {
                    if (precheck.silentDrop) {
                        setDraft(null);
                        form.reset(defaultValues);
                        setSuccessMeta({ dossierId: "", sandboxIsolated: false, emailSent: false, emailAttempted: false });
                        return;
                    }
                    toast({ title: c.toastValErrorTitle, description: precheck.error || c.toastValErrorDesc });
                    return;
                }
                precheckRefCode = precheck.referenceCode;
                if (precheck.skipExternalBackend) {
                    const mailRes = await sendKYCEmailNotification({
                        type: "Persona Jurídica",
                        clientEmail: data.legalRepEmail,
                        subjectName,
                        lang,
                        referenceCode: precheckRefCode,
                        phone: data.legalRepPhone || "",
                        country: data.constitutionCountry || "",
                    });
                    if (!mailRes?.success) {
                        toast({ title: c.toastValErrorTitle, description: (mailRes as any)?.error || c.toastValErrorDesc });
                        return;
                    }
                    toast({ title: c.toastSuccessTitle, description: j.toastSuccessDesc });
                    setDraft(null);
                    form.reset(defaultValues);
                    setSuccessMeta({ dossierId: precheckRefCode, sandboxIsolated: false, emailSent: true, emailAttempted: true });
                    return;
                }
            }

            const formData = new FormData();
            formData.set("formType", "Persona Jurídica");
            formData.set("lang", lang);
            formData.set("website_url", honeypotRef.current);
            formData.set("form_loaded_at", formLoadedAtRef.current);

            // Complete field mapping (zero dropped fields)
            const fieldMap: Record<string, string> = {
                customerCode: "codigo_cliente",
                companyName: "razon_social",
                commercialName: "nombre_comercial",
                constitutionCountry: "pais_constitucion",
                city: "ciudad",
                rnc: "rnc",
                legalRepFirstName: "rep_nombres",
                legalRepLastName: "rep_apellidos",
                legalRepId: "rep_id",
                legalRepAddress: "rep_direccion",
                legalRepPhone: "rep_telefono",
                legalRepEmail: "rep_email",
                legalRepProfession: "rep_profesion",
                legalRepProfessionOther: "rep_profesion_otra",
                legalRepPosition: "rep_cargo",
                legalRepPositionOther: "rep_cargo_otro",
                legalRepDesignation: "rep_designacion",
                averageIncome: "ingreso_promedio",
                annualIncome: "ingreso_anual",
                incomeUSD: "equivalente_usd",
                fundsOrigin: "origen_fondos",
                pepPosition: "pep_cargo",
                pepInstitution: "pep_institucion",
                pepCountry: "pep_pais",
            };

            const dateFieldsMap: Record<string, string> = {
                date: "fecha_formulario",
                incorporationDate: "fecha_constitucion",
                legalRepBirthDate: "rep_fecha_nacimiento",
            };

            const booleanFieldsMap: Record<string, string> = {
                declaration: "declaracion_jurada",
                declaration2: "declaracion_licitud_fondos",
                authorization: "autorizacion_compartir_info",
                declaration4: "declaracion_veracidad",
            };

            for (const [formField, targetKey] of Object.entries(fieldMap)) {
                const val = data[formField as keyof PersonaJuridicaData];
                if (val !== undefined && val !== null) {
                    const stringVal = String(val).trim();
                    if (stringVal !== "") {
                        formData.append(targetKey, stringVal);
                    }
                }
            }

            for (const [formField, targetKey] of Object.entries(dateFieldsMap)) {
                const val = data[formField as keyof PersonaJuridicaData];
                if (val) {
                    if (val instanceof Date && !Number.isNaN(val.getTime())) {
                        formData.append(targetKey, val.toISOString().split("T")[0]);
                    } else if (typeof val === "string" && val.trim()) {
                        formData.append(targetKey, val.split("T")[0]);
                    }
                }
            }

            for (const [formField, targetKey] of Object.entries(booleanFieldsMap)) {
                const val = data[formField as keyof PersonaJuridicaData];
                formData.append(targetKey, val ? "true" : "false");
            }

            formData.append("es_pep", data.isPEP === "si" ? "true" : "false");

            const cleanSocios = Array.isArray(data.socios)
                ? data.socios.filter((s) =>
                      [s?.nombre, s?.identificacion, s?.nacionalidad, s?.porcentaje, s?.cargo].some(
                          (v) => String(v || "").trim() !== ""
                      )
                  )
                : [];
            formData.append("socios", JSON.stringify(cleanSocios));

            const fileMappings: Record<string, keyof PersonaJuridicaData> = {
                doc_registro_mercantil_file: "commercialRegistryFile",
                doc_rep_id_file: "legalRepIdFile",
                doc_asamblea_file: "shareholderAssemblyFile",
                doc_firmas_file: "authorizedSignaturesFile",
                doc_nomina_socios_file: "shareholderListFile",
                doc_estados_financieros_file: "financialStatementsFile",
            };

            for (const [djangoField, formField] of Object.entries(fileMappings)) {
                const fileData = data[formField as keyof typeof data];
                if (!fileData) continue;

                if (fileData instanceof Blob || fileData instanceof File) {
                    formData.append(djangoField, fileData);
                } else if (typeof FileList !== "undefined" && fileData instanceof FileList && fileData.length > 0) {
                    formData.append(djangoField, fileData[0]);
                } else if (Array.isArray(fileData) && fileData.length > 0 && (fileData[0] instanceof Blob || fileData[0] instanceof File)) {
                    formData.append(djangoField, fileData[0]);
                }
            }

            if (data.signature) {
                const sigFile = dataURLtoFile(data.signature, "firma.png");
                formData.append("firma_digital", sigFile);
            }

            let res: Response;
            if (isLocalHost) {
                res = await fetch("/api/kyc", {
                    method: "POST",
                    body: formData,
                });
            } else {
                res = await fetch("https://puntacana-fortress-production.up.railway.app/api/public/kyc/juridica/", {
                    method: "POST",
                    body: formData,
                });
            }

            if (res.ok || res.status === 201) {
                const payload = await res.json().catch(() => ({}));
                const dossierId = String(payload?.data?.id || payload?.id || precheckRefCode || "");
                const sandboxIsolated = Boolean(isLocalHost || payload?.sandbox_isolated);
                let emailSent = false;
                let emailAttempted = false;

                if (!sandboxIsolated) {
                    emailAttempted = true;
                    try {
                        const mailRes = await sendKYCEmailNotification({
                            type: "Persona Jurídica",
                            clientEmail: data.legalRepEmail,
                            subjectName,
                            lang,
                            referenceCode: precheckRefCode || undefined,
                            phone: data.legalRepPhone || "",
                            country: data.constitutionCountry || "",
                        });
                        emailSent = Boolean((mailRes as any)?.success);
                    } catch (emailError) {
                        console.error("Failed to send KYC confirmation email", emailError);
                        emailSent = false;
                    }
                }

                toast({
                    title: c.toastSuccessTitle,
                    description: j.toastSuccessDesc,
                });
                setDraft(null);
                form.reset(defaultValues);
                setSuccessMeta({
                    dossierId,
                    sandboxIsolated,
                    emailSent,
                    emailAttempted,
                });
                return;
            }

            let result: any;
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                try {
                    result = await res.json();
                } catch {
                    result = { error: "Unparseable JSON error." };
                }
            } else {
                result = { success: false, error: `Error (${res.status})` };
            }

            toast({
                title: c.toastValErrorTitle,
                description: typeof result?.error === "string" ? result.error : c.toastValErrorDesc,
            });
            console.error("KYC Submission Error:", result);
        } catch (error) {
            toast({
                title: c.toastConnErrorTitle,
                description: c.toastConnErrorDesc,
            });
            console.error("Critical submission failed", error);
        }
    };

    const onError = (errors: any) => {
        const firstErrorKey = Object.keys(errors)[0];
        const errorElement = document.querySelector(`[name="${firstErrorKey}"]`);

        toast({
            title: c.toastMissingFieldsTitle,
            description: c.toastMissingFieldsDesc,
        });

        if (errorElement) {
            errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
            (errorElement as HTMLElement).focus();
        }
    };

    const handleSaveDraft = () => {
        const values = form.getValues();
        setDraft(values);
        toast({
            title: c.toastDraftSavedTitle,
            description: c.toastDraftSavedDesc,
        });
    };

    const handleDownload = () => {
        toast({
            title: c.toastPdfPrepTitle,
            description: c.toastPdfPrepDesc,
        });
        setTimeout(() => window.print(), 500);
    };

    const { isSubmitting } = form.formState;

    if (successMeta) {
        const descText = successMeta.sandboxIsolated ? j.submitSuccessDescLocal : j.submitSuccessDescProd;
        const emailText = successMeta.sandboxIsolated
            ? j.submitSuccessEmailLocal
            : successMeta.emailSent
            ? j.submitSuccessEmailSent
            : j.submitSuccessEmailFailed;
        const storageBadge = successMeta.sandboxIsolated ? c.storageBadgeLocal : c.storageBadgeProd;

        return (
            <div
                data-kyc-success="juridica"
                data-kyc-dossier-id={successMeta.dossierId}
                data-kyc-sandbox={successMeta.sandboxIsolated ? "true" : "false"}
                className="flex flex-col items-center justify-center p-10 md:p-12 text-center bg-zinc-950 rounded-lg border border-luxury-gold/50 shadow-2xl min-h-[50vh] animate-in fade-in zoom-in duration-500"
            >
                <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
                <h2 className="text-3xl font-bold text-white mb-3">{j.submitSuccessTitle}</h2>
                {successMeta.dossierId && (
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-luxury-gold/15 border border-luxury-gold/40 text-luxury-gold font-mono text-sm font-bold mb-4">
                        <span>{c.refLabel}</span>
                        <span data-kyc-ref-code="true">{successMeta.dossierId}</span>
                    </div>
                )}
                <p className="text-gray-300 text-base md:text-lg mb-4 max-w-2xl mx-auto">{descText}</p>
                <p className="text-xs text-gray-400 font-mono mb-6">{storageBadge}</p>

                <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-4 rounded-lg max-w-lg mx-auto mb-8 text-sm">
                    <strong>{c.importantLabel}</strong> {emailText}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button onClick={() => setSuccessMeta(null)} className="bg-luxury-gold text-black hover:bg-white font-bold px-8">
                        {c.completeAnother}
                    </Button>
                    <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(j.waMsg)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-8 py-2 bg-[#25D366] text-white hover:bg-[#20bd5a]"
                    >
                        {c.notifyWhatsapp}
                    </a>
                </div>
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8 print:space-y-4 border-2 border-luxury-gold/50 rounded-xl p-6 md:p-8 bg-black/40">
                <FormAntispamFields onHoneypotChange={handleHoneypotChange} onLoadedAtReady={handleLoadedAtReady} />
                <div className="sticky top-0 z-10 bg-zinc-950/95 backdrop-blur-sm border-b border-white/10 px-6 py-4 -mx-6 md:-mx-8 print:hidden">
                    <div className="flex justify-between items-center text-center text-xs font-medium text-gray-400">
                        {j.steps.map((step, i) => (
                            <div key={step} className="flex flex-col items-center gap-2 flex-1">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-luxury-gold text-luxury-gold font-bold bg-black">{i + 1}</div>
                                <span className="hidden md:block">{step}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="print:block hidden mb-8 text-center space-y-4">
                    <div className="flex justify-center mb-4">
                        <div className="relative w-48 h-24">
                            <Image src="/form-logo.jpg" alt="Punta Cana Investments" fill style={{ objectFit: "contain" }} priority />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold uppercase border-b-2 border-black pb-2 mb-4">{j.printHeader}</h2>
                </div>

                <FormSection icon={<Building size={20} />} title={j.secGeneral}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <FormField control={form.control} name="customerCode" render={({ field }) => (<FormItem><FormLabel>{j.customerCode}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="date" render={({ field }) => (<FormItem><FormLabel>{j.date}</FormLabel><FormControl><DatePicker field={field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="companyName" render={({ field }) => (<FormItem><FormLabel>{j.companyName}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="commercialName" render={({ field }) => (<FormItem><FormLabel>{j.commercialName}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="incorporationDate" render={({ field }) => (<FormItem><FormLabel>{j.incorporationDate}</FormLabel><FormControl><DatePicker field={field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="constitutionCountry" render={({ field }) => (<FormItem><FormLabel>{j.constitutionCountry}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="city" render={({ field }) => (<FormItem><FormLabel>{j.city}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="rnc" render={({ field }) => (<FormItem><FormLabel>{j.rnc}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                </FormSection>

                <Separator className="bg-white/10" />

                {/* Dynamic Shareholders / Ultimate Beneficial Owners Capture */}
                <FormSection icon={<Users size={20} />} title={j.secShareholders}>
                    <p className="text-xs text-gray-400">{j.shareholdersHint}</p>
                    <div className="space-y-4" data-kyc-socios-section="true">
                        {socioFields.map((field, index) => (
                            <div
                                key={field.id}
                                data-kyc-socio-row={index}
                                className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end p-4 border border-white/15 rounded-md relative bg-white/5"
                            >
                                <FormField control={form.control} name={`socios.${index}.nombre`} render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>{j.shareholderName}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name={`socios.${index}.identificacion`} render={({ field }) => (<FormItem><FormLabel>{j.shareholderId}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name={`socios.${index}.nacionalidad`} render={({ field }) => (<FormItem><FormLabel>{j.shareholderNationality}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name={`socios.${index}.porcentaje`} render={({ field }) => (<FormItem><FormLabel>{j.shareholderPct}</FormLabel><FormControl><Input placeholder="50%" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name={`socios.${index}.cargo`} render={({ field }) => (<FormItem className="md:col-span-5"><FormLabel>{j.shareholderRole}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                {socioFields.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute -top-3 -right-3 h-6 w-6 rounded-full bg-red-900/40 text-red-500 hover:bg-red-900/60"
                                        onClick={() => removeSocio(index)}
                                    >
                                        <X size={14} />
                                    </Button>
                                )}
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="link"
                            size="sm"
                            data-kyc-add-socio="true"
                            className="text-luxury-gold hover:text-white"
                            onClick={() => appendSocio({ nombre: "", identificacion: "", nacionalidad: "", porcentaje: "", cargo: "" })}
                        >
                            <PlusCircle className="mr-2" size={16} />
                            {j.addShareholder}
                        </Button>
                    </div>
                </FormSection>

                <Separator className="bg-white/10" />

                <FormSection icon={<UserCheck size={20} />} title={j.secLegalRep}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <FormField control={form.control} name="legalRepFirstName" render={({ field }) => (<FormItem><FormLabel>{j.repFirstName}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="legalRepLastName" render={({ field }) => (<FormItem><FormLabel>{j.repLastName}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="legalRepId" render={({ field }) => (<FormItem><FormLabel>{j.repId}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="legalRepBirthDate" render={({ field }) => (<FormItem><FormLabel>{j.repBirthDate}</FormLabel><FormControl><DatePicker field={field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="legalRepAddress" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>{j.repAddress}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="legalRepPhone" render={({ field }) => (<FormItem><FormLabel>{j.repPhone}</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="legalRepEmail" render={({ field }) => (<FormItem><FormLabel>{j.repEmail}</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />

                        <FormField
                            control={form.control}
                            name="legalRepProfession"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{j.repProfession}</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder={c.selectProfession} /></SelectTrigger></FormControl>
                                        <SelectContent>{opts.professions.map((p) => (<SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>))}</SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {legalRepProfession === "otro" && (
                            <FormField control={form.control} name="legalRepProfessionOther" render={({ field }) => (<FormItem><FormLabel>{j.repProfessionOther}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        )}

                        <FormField
                            control={form.control}
                            name="legalRepPosition"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{j.repPosition}</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder={c.selectPosition} /></SelectTrigger></FormControl>
                                        <SelectContent>{opts.positions.map((pos) => (<SelectItem key={pos.value} value={pos.value}>{pos.label}</SelectItem>))}</SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {legalRepPosition === "otro" && (
                            <FormField control={form.control} name="legalRepPositionOther" render={({ field }) => (<FormItem><FormLabel>{j.repPositionOther}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        )}

                        <FormField
                            control={form.control}
                            name="legalRepDesignation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{j.repDesignation}</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder={c.selectDesignation} /></SelectTrigger></FormControl>
                                        <SelectContent>{opts.designations.map((des) => (<SelectItem key={des.value} value={des.value}>{des.label}</SelectItem>))}</SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </FormSection>

                <Separator className="bg-white/10" />

                <FormSection icon={<Banknote size={20} />} title={j.secEconomic}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <FormField control={form.control} name="averageIncome" render={({ field }) => (<FormItem><FormLabel>{j.averageIncome}</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder={c.selectRange} /></SelectTrigger></FormControl><SelectContent>{opts.monthlyIncomeJuridica.map((r) => (<SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="annualIncome" render={({ field }) => (<FormItem><FormLabel>{j.annualIncome}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="incomeUSD" render={({ field }) => (<FormItem><FormLabel>{j.incomeUSD}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="fundsOrigin" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>{j.fundsOrigin}</FormLabel><FormControl><Input placeholder={j.fundsOriginPlaceholder} {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                </FormSection>

                <Separator className="bg-white/10" />

                <FormSection icon={<Landmark size={20} />} title={j.secPep}>
                    <div className="space-y-4">
                        <FormField control={form.control} name="isPEP" render={({ field }) => (<FormItem><FormLabel>{j.isPepQuestion}</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} value={field.value} className="flex items-center gap-4 pt-2"><div className="flex items-center space-x-2"><RadioGroupItem value="si" /><FormLabel className="font-normal text-white">{c.yes}</FormLabel></div><div className="flex items-center space-x-2"><RadioGroupItem value="no" /><FormLabel className="font-normal text-white">{c.no}</FormLabel></div></RadioGroup></FormControl><FormMessage /></FormItem>)} />
                        {isPEP === "si" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-4 border-t border-dashed border-white/20 mt-4 animate-in fade-in slide-in-from-top-4">
                                <FormField control={form.control} name="pepPosition" render={({ field }) => (<FormItem><FormLabel>{j.pepPosition}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="pepInstitution" render={({ field }) => (<FormItem><FormLabel>{j.pepInstitution}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="pepCountry" render={({ field }) => (<FormItem><FormLabel>{j.pepCountry}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            </div>
                        )}
                    </div>
                </FormSection>

                <Separator className="bg-white/10" />

                <div className="print:hidden">
                    <FormSection icon={<FileText size={20} />} title={j.secDocuments}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FileUpload name="commercialRegistryFile" label={j.docRegistry} description={c.fileDesc} />
                            <FileUpload name="legalRepIdFile" label={j.docRepId} description={c.fileDesc} />
                            <FileUpload name="shareholderAssemblyFile" label={j.docAssembly} description={c.fileDesc} />
                            <FileUpload name="authorizedSignaturesFile" label={j.docSignatures} description={c.fileDesc} />
                            <FileUpload name="shareholderListFile" label={j.docShareholders} description={c.fileDesc} />
                            <FileUpload name="financialStatementsFile" label={j.docFinancials} description={c.fileDesc} />
                        </div>
                    </FormSection>
                </div>

                <Separator className="print:hidden bg-white/10" />

                <FormSection icon={<CheckCircle size={20} />} title={j.secDeclarations}>
                    <div className="space-y-4">
                        <FormField control={form.control} name="declaration" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={!!field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel className="font-normal text-white">{j.decl1}</FormLabel></div><FormMessage /></FormItem>)} />
                        <FormField
                            control={form.control}
                            name="declaration2"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl><Checkbox checked={!!field.value} onCheckedChange={field.onChange} /></FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel className="font-normal text-white leading-relaxed">
                                            <span className="font-bold text-luxury-gold block mb-2">{j.declLicitTitle}</span>
                                            {j.declLicitP1}
                                            <br /><br />
                                            {j.declLicitP2}
                                        </FormLabel>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control} name="authorization" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={!!field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel className="font-normal text-white">{j.declAuth}</FormLabel></div><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="declaration4" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={!!field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel className="font-normal text-white">{j.decl4}</FormLabel></div><FormMessage /></FormItem>)} />
                    </div>
                </FormSection>

                <Separator className="bg-white/10" />

                <FormSection icon={<Pencil size={20} />} title={c.signatureTitle}>
                    <div className="space-y-4">
                        <FormLabel className="text-white block mb-2 font-medium underline">{c.signatureRequired}</FormLabel>
                        <SignaturePad />
                    </div>
                </FormSection>

                <div className="flex flex-col-reverse gap-4 pt-8 sm:flex-row sm:justify-end print:hidden">
                    <Button type="button" variant="outline" onClick={handleSaveDraft} disabled={isSubmitting} className="bg-black/60 border-white/25 text-white hover:bg-white/10">{c.saveDraft}</Button>
                    <Button type="button" variant="outline" onClick={handleDownload} disabled={isSubmitting} className="bg-black/60 border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-black">{c.preview}</Button>
                    <Button type="button" variant="outline" onClick={handleDownload} disabled={isSubmitting} className="bg-black/60 text-green-400 border-green-500/60 hover:bg-green-500/15">{c.printPdf}</Button>
                    <Button type="submit" disabled={isSubmitting} data-kyc-submit="juridica" className="bg-luxury-gold text-black hover:bg-white font-bold">
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {c.submit}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
