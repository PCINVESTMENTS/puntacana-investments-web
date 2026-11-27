"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { personaFisicaSchema, type PersonaFisicaData } from "@/lib/schemas";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FileUpload } from "./file-upload";
import { SignaturePad } from "./signature-pad";
import { CircleUserRound, Gem, Briefcase, Landmark, Handshake, FileText, CheckCircle, Pencil, PlusCircle, X, Loader2 } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";

const defaultValues: Partial<PersonaFisicaData> = {
    customerCode: "",
    date: new Date(),
    idType: "",
    idDocument: "",
    firstName: "",
    lastName: "",
    email: "",
    gender: undefined,
    birthDate: new Date(),
    birthPlace: "",
    nationality: "",
    maritalStatus: "",
    homePhone: "",
    mobilePhone1: "",
    mobilePhone2: "",
    address: "",
    province: "",
    state: "",
    residenceCountry: "",
    hasSpouse: "no",
    spouseFirstName: "",
    spouseLastName: "",
    spouseIdType: "",
    spouseIdDocument: "",
    spouseBirthDate: undefined,
    spouseBirthPlace: "",
    spouseNationality: "",
    spouseEmail: "",
    spouseHomePhone: "",
    spouseMobilePhone: "",
    profession: "",
    professionOther: "",
    position: "",
    positionOther: "",
    company: "",
    monthlyIncome: "",
    fundsOrigin: "",
    hasOtherIncome: "no",
    otherIncomeSource: "",
    otherIncomeSourceOther: "",
    otherIncomeAmount: "",
    incomeUSD: "",
    isPEP: "no",
    pepPosition: "",
    pepInstitution: "",
    pepCountry: "",
    personalReferences: [{ name: "", relationship: "", phone: "" }],
    commercialReferences: [{ entity: "", relationshipType: "", phone: "" }],
    bankReferences: [{ entity: "", type: "", phone: "" }],
    signature: "",
    declaration1: false,
    declarationLicitFunds: false,
    authorization: false,
    declaration4: false,
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

export function PersonaFisicaForm() {
    const { toast } = useToast();
    const params = useParams();
    const lang = (params.lang as string) || "es";
    const dict = getKycDict(lang);
    const c = dict.common;
    const f = dict.fisica;
    const opts = dict.options;

    const [draft, setDraft] = useLocalStorage<Partial<PersonaFisicaData> | null>("persona-fisica-draft", null);

    const form = useForm<PersonaFisicaData>({
        resolver: zodResolver(personaFisicaSchema),
        defaultValues: draft || defaultValues,
    });

    const [hasLoadedDraft, setHasLoadedDraft] = useState(false);
    const [successMeta, setSuccessMeta] = useState<KycSuccessMeta | null>(null);

    useEffect(() => {
        if (draft && !hasLoadedDraft) {
            const parsedDraft = { ...draft };
            if (typeof parsedDraft.date === "string") parsedDraft.date = new Date(parsedDraft.date);
            if (typeof parsedDraft.birthDate === "string") parsedDraft.birthDate = new Date(parsedDraft.birthDate);
            if (typeof parsedDraft.spouseBirthDate === "string") parsedDraft.spouseBirthDate = new Date(parsedDraft.spouseBirthDate);
            form.reset(parsedDraft);
            setHasLoadedDraft(true);
        } else if (!draft && !hasLoadedDraft) {
            setHasLoadedDraft(true);
        }
    }, [draft, form, hasLoadedDraft]);

    const { fields: personalFields, append: appendPersonal, remove: removePersonal } = useFieldArray({ control: form.control, name: "personalReferences" });
    const { fields: commercialFields, append: appendCommercial, remove: removeCommercial } = useFieldArray({ control: form.control, name: "commercialReferences" });
    const { fields: bankFields, append: appendBank, remove: removeBank } = useFieldArray({ control: form.control, name: "bankReferences" });

    const hasSpouse = form.watch("hasSpouse");
    const isPEP = form.watch("isPEP");
    const profession = form.watch("profession");
    const position = form.watch("position");
    const hasOtherIncome = form.watch("hasOtherIncome");
    const otherIncomeSource = form.watch("otherIncomeSource");

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
            setDraft(currentValues as Partial<PersonaFisicaData>);
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [currentValues, setDraft]);

    const onSubmit = async (data: PersonaFisicaData) => {
        try {
            const subjectName = `${data.firstName} ${data.lastName}`.trim();
            const isLocalHost =
                typeof window !== "undefined" &&
                (window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost");

            let precheckRefCode = "";
            if (!isLocalHost) {
                const precheck = await precheckKycSubmission({
                    email: data.email,
                    formType: "Persona Física",
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
                        type: "Persona Física",
                        clientEmail: data.email,
                        subjectName,
                        lang,
                        referenceCode: precheckRefCode,
                        phone: data.mobilePhone1 || data.homePhone || "",
                        country: data.residenceCountry || "",
                    });
                    if (!mailRes?.success) {
                        toast({ title: c.toastValErrorTitle, description: (mailRes as any)?.error || c.toastValErrorDesc });
                        return;
                    }
                    toast({ title: c.toastSuccessTitle, description: f.toastSuccessDesc });
                    setDraft(null);
                    form.reset(defaultValues);
                    setSuccessMeta({ dossierId: precheckRefCode, sandboxIsolated: false, emailSent: Boolean((mailRes as any)?.emailSent), emailAttempted: true });
                    return;
                }
            }

            const formData = new FormData();
            formData.set("formType", "Persona Física");
            formData.set("lang", lang);
            formData.set("website_url", honeypotRef.current);
            formData.set("form_loaded_at", formLoadedAtRef.current);
            const kycIdemStorageKey = `pci_kyc_pf_idem::${String(data.email || "").trim().toLowerCase()}::${String(data.idDocument || "").trim().toLowerCase()}`;
            let kycIdemKey = "";
            try {
                kycIdemKey = sessionStorage.getItem(kycIdemStorageKey) || "";
                if (!kycIdemKey) {
                    kycIdemKey = `kyc-pf-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
                    sessionStorage.setItem(kycIdemStorageKey, kycIdemKey);
                }
            } catch {
                kycIdemKey = `kyc-pf-${String(data.email || "").trim().toLowerCase()}-${String(data.idDocument || "").trim().toLowerCase()}`;
            }
            formData.set("idempotency_key", kycIdemKey);

            // Complete field mapping (zero dropped fields)
            const fieldMap: Record<string, string> = {
                customerCode: "codigo_cliente",
                idType: "tipo_identificacion",
                idDocument: "pasaporte_cedula",
                firstName: "nombres",
                lastName: "apellidos",
                email: "email",
                gender: "sexo",
                birthPlace: "lugar_nacimiento",
                nationality: "nacionalidad",
                maritalStatus: "estado_civil",
                homePhone: "tel_residencia",
                mobilePhone1: "tel_celular",
                mobilePhone2: "tel_celular_2",
                address: "direccion",
                province: "ciudad",
                state: "estado_provincia",
                residenceCountry: "pais",
                hasSpouse: "tiene_conyuge",
                spouseFirstName: "conyuge_nombres",
                spouseLastName: "conyuge_apellidos",
                spouseIdType: "conyuge_tipo_id",
                spouseIdDocument: "conyuge_pasaporte_cedula",
                spouseBirthPlace: "conyuge_lugar_nacimiento",
                spouseNationality: "conyuge_nacionalidad",
                spouseEmail: "conyuge_email",
                spouseHomePhone: "conyuge_tel_residencia",
                spouseMobilePhone: "conyuge_tel_celular",
                profession: "profesion_ocupacion",
                professionOther: "profesion_otra",
                position: "posicion",
                positionOther: "posicion_otra",
                company: "lugar_trabajo",
                monthlyIncome: "ingreso_promedio",
                incomeUSD: "equivalente_usd",
                fundsOrigin: "origen_fondos",
                otherIncomeSource: "fuente_otros_ingresos",
                otherIncomeSourceOther: "fuente_otros_ingresos_otra",
                otherIncomeAmount: "monto_otros_ingresos",
                pepPosition: "pep_cargo",
                pepInstitution: "pep_institucion",
                pepCountry: "pep_pais",
            };

            const dateFieldsMap: Record<string, string> = {
                date: "fecha_formulario",
                birthDate: "fecha_nacimiento",
                spouseBirthDate: "conyuge_fecha_nacimiento",
            };

            const booleanFieldsMap: Record<string, string> = {
                declaration1: "declaracion_jurada",
                declarationLicitFunds: "declaracion_licitud_fondos",
                authorization: "autorizacion_compartir_info",
                declaration4: "declaracion_veracidad",
            };

            const arrayFieldsMap: Record<string, string> = {
                personalReferences: "referencias_personales",
                commercialReferences: "referencias_comerciales",
                bankReferences: "referencias_bancarias",
            };

            for (const [formField, targetKey] of Object.entries(fieldMap)) {
                const val = data[formField as keyof PersonaFisicaData];
                if (val !== undefined && val !== null) {
                    const stringVal = String(val).trim();
                    if (stringVal !== "") {
                        formData.append(targetKey, stringVal);
                    }
                }
            }

            for (const [formField, targetKey] of Object.entries(dateFieldsMap)) {
                const val = data[formField as keyof PersonaFisicaData];
                if (val) {
                    if (val instanceof Date && !Number.isNaN(val.getTime())) {
                        formData.append(targetKey, val.toISOString().split("T")[0]);
                    } else if (typeof val === "string" && val.trim()) {
                        formData.append(targetKey, val.split("T")[0]);
                    }
                }
            }

            for (const [formField, targetKey] of Object.entries(booleanFieldsMap)) {
                const val = data[formField as keyof PersonaFisicaData];
                formData.append(targetKey, val ? "true" : "false");
            }

            formData.append("es_pep", data.isPEP === "si" ? "true" : "false");
            formData.append("tiene_otros_ingresos", data.hasOtherIncome === "si" ? "true" : "false");

            for (const [formField, targetKey] of Object.entries(arrayFieldsMap)) {
                const val = data[formField as keyof PersonaFisicaData];
                if (val && Array.isArray(val)) {
                    const nonEmpty = val.filter((item: any) =>
                        Object.values(item || {}).some((v) => String(v || "").trim() !== "")
                    );
                    formData.append(targetKey, JSON.stringify(nonEmpty));
                }
            }

            const fileMappings: Record<string, keyof PersonaFisicaData> = {
                doc_identidad_file: "idDocumentFile",
                doc_estado_cuenta_file: "proofOfFundsFile",
                doc_comprobante_domicilio_file: "proofOfAddressFile",
                doc_certificado_laboral_file: "workLetterFile",
                doc_bureau_credito_file: "creditBureauFile",
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
                const sigExt = data.signature.startsWith("data:image/jpeg") ? "jpg" : "png";
                const sigFile = dataURLtoFile(data.signature, `firma.${sigExt}`);
                formData.append("firma_digital", sigFile);
            }

            // Always submit through same-origin /api/kyc so server-side policy enforces
            // isolated local sandbox, Cloud Staging Stage 1 encrypted storage, or fail-closed Preview guards
            // (NEVER directly posting from browser to production Railway).
            const res = await fetch("/api/kyc", {
                method: "POST",
                body: formData,
            });

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
                            type: "Persona Física",
                            clientEmail: data.email,
                            subjectName,
                            lang,
                            referenceCode: precheckRefCode || undefined,
                            phone: data.mobilePhone1 || data.homePhone || "",
                            country: data.residenceCountry || "",
                        });
                        emailSent = Boolean((mailRes as any)?.emailSent);
                    } catch (emailError) {
                        console.error("Failed to send KYC confirmation email", emailError);
                        emailSent = false;
                    }
                }

                toast({
                    title: c.toastSuccessTitle,
                    description: f.toastSuccessDesc,
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
        const descText = successMeta.sandboxIsolated ? f.submitSuccessDescLocal : f.submitSuccessDescProd;
        const emailText = successMeta.sandboxIsolated
            ? f.submitSuccessEmailLocal
            : successMeta.emailSent
            ? f.submitSuccessEmailSent
            : f.submitSuccessEmailFailed;
        const storageBadge = successMeta.sandboxIsolated ? c.storageBadgeLocal : c.storageBadgeProd;

        return (
            <div
                data-kyc-success="fisica"
                data-kyc-dossier-id={successMeta.dossierId}
                data-kyc-sandbox={successMeta.sandboxIsolated ? "true" : "false"}
                className="flex flex-col items-center justify-center p-10 md:p-12 text-center bg-zinc-950 rounded-lg border border-luxury-gold/50 shadow-2xl min-h-[50vh] animate-in fade-in zoom-in duration-500"
            >
                <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
                <h2 className="text-3xl font-bold text-white mb-3">{f.submitSuccessTitle}</h2>
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
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(f.waMsg)}`}
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
                        {f.steps.map((step, i) => (
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
                    <h2 className="text-2xl font-bold uppercase border-b-2 border-black pb-2 mb-4">{f.printHeader}</h2>
                </div>

                <FormSection icon={<CircleUserRound size={20} />} title={f.secGeneral}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <FormField control={form.control} name="customerCode" render={({ field }) => (<FormItem><FormLabel>{f.customerCode}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="date" render={({ field }) => (<FormItem><FormLabel>{f.date}</FormLabel><FormControl><DatePicker field={field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="idType" render={({ field }) => (<FormItem><FormLabel>{f.idType}</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder={c.selectType} /></SelectTrigger></FormControl><SelectContent>{opts.idTypes.map((o) => (<SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="idDocument" render={({ field }) => (<FormItem><FormLabel>{f.idDocument}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="firstName" render={({ field }) => (<FormItem><FormLabel>{f.firstName}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="lastName" render={({ field }) => (<FormItem><FormLabel>{f.lastName}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>{f.email}</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="gender" render={({ field }) => (<FormItem><FormLabel>{f.gender}</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} value={field.value} className="flex items-center gap-4 pt-2"><div className="flex items-center space-x-2"><RadioGroupItem value="femenino" /><FormLabel className="font-normal text-white">{c.female}</FormLabel></div><div className="flex items-center space-x-2"><RadioGroupItem value="masculino" /><FormLabel className="font-normal text-white">{c.male}</FormLabel></div></RadioGroup></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="birthDate" render={({ field }) => (<FormItem><FormLabel>{f.birthDate}</FormLabel><FormControl><DatePicker field={field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="birthPlace" render={({ field }) => (<FormItem><FormLabel>{f.birthPlace}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="nationality" render={({ field }) => (<FormItem><FormLabel>{f.nationality}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="maritalStatus" render={({ field }) => (<FormItem><FormLabel>{f.maritalStatus}</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder={c.selectPlaceholder} /></SelectTrigger></FormControl><SelectContent>{opts.maritalStatuses.map((o) => (<SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="homePhone" render={({ field }) => (<FormItem><FormLabel>{f.homePhone}</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="mobilePhone1" render={({ field }) => (<FormItem><FormLabel>{f.mobilePhone1}</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="mobilePhone2" render={({ field }) => (<FormItem><FormLabel>{f.mobilePhone2}</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="address" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>{f.address}</FormLabel><FormControl><Input placeholder={f.addressPlaceholder} {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="province" render={({ field }) => (<FormItem><FormLabel>{f.province}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="state" render={({ field }) => (<FormItem><FormLabel>{f.state}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="residenceCountry" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>{f.residenceCountry}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                </FormSection>

                <Separator className="bg-white/10" />

                <FormSection icon={<Gem size={20} />} title={f.secSpouse}>
                    <FormField control={form.control} name="hasSpouse" render={({ field }) => (<FormItem><FormLabel>{f.hasSpouse}</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} value={field.value} className="flex items-center gap-4 pt-2"><div className="flex items-center space-x-2"><RadioGroupItem value="si" /><FormLabel className="font-normal text-white">{c.yes}</FormLabel></div><div className="flex items-center space-x-2"><RadioGroupItem value="no" /><FormLabel className="font-normal text-white">{c.no}</FormLabel></div></RadioGroup></FormControl><FormMessage /></FormItem>)} />
                    {hasSpouse === "si" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-4 border-t border-dashed border-white/20 mt-4 animate-in fade-in slide-in-from-top-4">
                            <FormField control={form.control} name="spouseFirstName" render={({ field }) => (<FormItem><FormLabel>{f.spouseFirstName}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="spouseLastName" render={({ field }) => (<FormItem><FormLabel>{f.spouseLastName}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="spouseIdType" render={({ field }) => (<FormItem><FormLabel>{f.spouseIdType}</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder={c.selectType} /></SelectTrigger></FormControl><SelectContent>{opts.idTypes.map((o) => (<SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="spouseIdDocument" render={({ field }) => (<FormItem><FormLabel>{f.spouseIdDocument}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="spouseBirthDate" render={({ field }) => (<FormItem><FormLabel>{f.spouseBirthDate}</FormLabel><FormControl><DatePicker field={field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="spouseBirthPlace" render={({ field }) => (<FormItem><FormLabel>{f.spouseBirthPlace}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="spouseNationality" render={({ field }) => (<FormItem><FormLabel>{f.spouseNationality}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="spouseEmail" render={({ field }) => (<FormItem><FormLabel>{f.spouseEmail}</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="spouseHomePhone" render={({ field }) => (<FormItem><FormLabel>{f.spouseHomePhone}</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="spouseMobilePhone" render={({ field }) => (<FormItem><FormLabel>{f.spouseMobilePhone}</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                    )}
                </FormSection>

                <Separator className="bg-white/10" />

                <FormSection icon={<Briefcase size={20} />} title={f.secOccupation}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <FormField
                            control={form.control}
                            name="profession"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{f.profession}</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder={c.selectProfession} /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {opts.professions.map((p) => (<SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {profession === "otro" && (
                            <FormField control={form.control} name="professionOther" render={({ field }) => (<FormItem><FormLabel>{f.professionOther}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        )}
                        <FormField
                            control={form.control}
                            name="position"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{f.position}</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder={c.selectPosition} /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {opts.positions.map((pos) => (<SelectItem key={pos.value} value={pos.value}>{pos.label}</SelectItem>))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {position === "otro" && (
                            <FormField control={form.control} name="positionOther" render={({ field }) => (<FormItem><FormLabel>{f.positionOther}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        )}

                        <FormField control={form.control} name="company" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>{f.company}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="monthlyIncome" render={({ field }) => (<FormItem><FormLabel>{f.monthlyIncome}</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder={c.selectRange} /></SelectTrigger></FormControl><SelectContent>{opts.monthlyIncomeFisica.map((r) => (<SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="incomeUSD" render={({ field }) => (<FormItem><FormLabel>{f.incomeUSD}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="fundsOrigin" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>{f.fundsOrigin}</FormLabel><FormControl><Input placeholder={f.fundsOriginPlaceholder} {...field} /></FormControl><FormMessage /></FormItem>)} />

                        <div className="md:col-span-2">
                            <FormField control={form.control} name="hasOtherIncome" render={({ field }) => (<FormItem><FormLabel>{f.hasOtherIncome}</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} value={field.value} className="flex items-center gap-4 pt-2"><div className="flex items-center space-x-2"><RadioGroupItem value="si" /><FormLabel className="font-normal text-white">{c.yes}</FormLabel></div><div className="flex items-center space-x-2"><RadioGroupItem value="no" /><FormLabel className="font-normal text-white">{c.no}</FormLabel></div></RadioGroup></FormControl><FormMessage /></FormItem>)} />
                        </div>

                        {hasOtherIncome === "si" && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="otherIncomeSource"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{f.otherIncomeSource}</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger><SelectValue placeholder={c.selectSource} /></SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {opts.otherIncomeSources.map((s) => (<SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {otherIncomeSource === "otro" && (
                                    <FormField control={form.control} name="otherIncomeSourceOther" render={({ field }) => (<FormItem><FormLabel>{f.otherIncomeSourceOther}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                )}
                                <FormField control={form.control} name="otherIncomeAmount" render={({ field }) => (<FormItem><FormLabel>{f.otherIncomeAmount}</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            </>
                        )}
                    </div>
                </FormSection>

                <Separator className="bg-white/10" />

                <FormSection icon={<Landmark size={20} />} title={f.secPep}>
                    <FormField control={form.control} name="isPEP" render={({ field }) => (<FormItem><FormLabel>{f.isPepQuestion}</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} value={field.value} className="flex items-center gap-4 pt-2"><div className="flex items-center space-x-2"><RadioGroupItem value="si" /><FormLabel className="font-normal text-white">{c.yes}</FormLabel></div><div className="flex items-center space-x-2"><RadioGroupItem value="no" /><FormLabel className="font-normal text-white">{c.no}</FormLabel></div></RadioGroup></FormControl><FormMessage /></FormItem>)} />
                    {isPEP === "si" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-4 border-t border-dashed border-white/20 mt-4 animate-in fade-in slide-in-from-top-4">
                            <FormField control={form.control} name="pepPosition" render={({ field }) => (<FormItem><FormLabel>{f.pepPosition}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="pepInstitution" render={({ field }) => (<FormItem><FormLabel>{f.pepInstitution}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="pepCountry" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>{f.pepCountry}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                    )}
                </FormSection>

                <Separator className="bg-white/10" />

                <FormSection icon={<Handshake size={20} />} title={f.secReferences}>
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-medium mb-2 text-white">{f.personalRefs}</h3>
                            {personalFields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-4 p-4 border border-white/10 rounded-md relative bg-white/5">
                                    <FormField control={form.control} name={`personalReferences.${index}.name`} render={({ field }) => (<FormItem><FormLabel>{f.refName}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={form.control} name={`personalReferences.${index}.relationship`} render={({ field }) => (<FormItem><FormLabel>{f.refRelationship}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={form.control} name={`personalReferences.${index}.phone`} render={({ field }) => (<FormItem><FormLabel>{f.refPhone}</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    {personalFields.length > 1 && (<Button type="button" variant="ghost" size="icon" className="absolute -top-3 -right-3 h-6 w-6 rounded-full bg-red-900/40 text-red-500 hover:bg-red-900/60" onClick={() => removePersonal(index)}><X size={14} /></Button>)}
                                </div>
                            ))}
                            <Button type="button" variant="link" size="sm" className="text-luxury-gold hover:text-white" onClick={() => appendPersonal({ name: "", relationship: "", phone: "" })}><PlusCircle className="mr-2" size={16} />{f.addPersonalRef}</Button>
                        </div>

                        <div>
                            <h3 className="font-medium mb-2 text-white">{f.commercialRefs}</h3>
                            {commercialFields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-4 p-4 border border-white/10 rounded-md relative bg-white/5">
                                    <FormField control={form.control} name={`commercialReferences.${index}.entity`} render={({ field }) => (<FormItem><FormLabel>{f.refEntity}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={form.control} name={`commercialReferences.${index}.relationshipType`} render={({ field }) => (<FormItem><FormLabel>{f.refRelType}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={form.control} name={`commercialReferences.${index}.phone`} render={({ field }) => (<FormItem><FormLabel>{f.refPhone}</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    {commercialFields.length > 1 && (<Button type="button" variant="ghost" size="icon" className="absolute -top-3 -right-3 h-6 w-6 rounded-full bg-red-900/40 text-red-500 hover:bg-red-900/60" onClick={() => removeCommercial(index)}><X size={14} /></Button>)}
                                </div>
                            ))}
                            <Button type="button" variant="link" size="sm" className="text-luxury-gold hover:text-white" onClick={() => appendCommercial({ entity: "", relationshipType: "", phone: "" })}><PlusCircle className="mr-2" size={16} />{f.addCommercialRef}</Button>
                        </div>

                        <div>
                            <h3 className="font-medium mb-2 text-white">{f.bankRefs}</h3>
                            {bankFields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-4 p-4 border border-white/10 rounded-md relative bg-white/5">
                                    <FormField control={form.control} name={`bankReferences.${index}.entity`} render={({ field }) => (<FormItem><FormLabel>{f.refEntity}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={form.control} name={`bankReferences.${index}.type`} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{f.refBankType}</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder={c.selectPlaceholder} /></SelectTrigger></FormControl>
                                                <SelectContent>{opts.bankTypes.map((bt) => (<SelectItem key={bt.value} value={bt.value}>{bt.label}</SelectItem>))}</SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name={`bankReferences.${index}.phone`} render={({ field }) => (<FormItem><FormLabel>{f.refPhone}</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    {bankFields.length > 1 && (<Button type="button" variant="ghost" size="icon" className="absolute -top-3 -right-3 h-6 w-6 rounded-full bg-red-900/40 text-red-500 hover:bg-red-900/60" onClick={() => removeBank(index)}><X size={14} /></Button>)}
                                </div>
                            ))}
                            <Button type="button" variant="link" size="sm" className="text-luxury-gold hover:text-white" onClick={() => appendBank({ entity: "", type: "", phone: "" })}><PlusCircle className="mr-2" size={16} />{f.addBankRef}</Button>
                        </div>
                    </div>
                </FormSection>

                <Separator className="bg-white/10" />

                <div className="print:hidden">
                    <FormSection icon={<FileText size={20} />} title={f.secDocuments}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FileUpload name="idDocumentFile" label={f.docId} description={c.fileDesc} />
                            <FileUpload name="proofOfFundsFile" label={f.docFunds} description={c.fileDesc} />
                            <FileUpload name="creditBureauFile" label={f.docCredit} description={c.fileDesc} />
                            <FileUpload name="proofOfAddressFile" label={f.docAddress} description={c.fileDesc} />
                            <div className="md:col-span-2">
                                <FileUpload name="workLetterFile" label={f.docWork} description={c.fileDesc} />
                            </div>
                        </div>
                    </FormSection>
                </div>

                <Separator className="print:hidden bg-white/10" />

                <FormSection icon={<CheckCircle size={20} />} title={f.secDeclarations}>
                    <div className="space-y-4">
                        <FormField control={form.control} name="declaration1" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={!!field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel className="font-normal text-white">{f.decl1}</FormLabel></div><FormMessage /></FormItem>)} />
                        <FormField
                            control={form.control}
                            name="declarationLicitFunds"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl><Checkbox checked={!!field.value} onCheckedChange={field.onChange} /></FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel className="font-normal text-white leading-relaxed">
                                            <span className="font-bold text-luxury-gold block mb-2">{f.declLicitTitle}</span>
                                            {f.declLicitP1}
                                            <br /><br />
                                            {f.declLicitP2}
                                        </FormLabel>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control} name="authorization" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={!!field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel className="font-normal text-white">{f.declAuth}</FormLabel></div><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="declaration4" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={!!field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel className="font-normal text-white">{f.decl4}</FormLabel></div><FormMessage /></FormItem>)} />
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
                    <Button type="submit" disabled={isSubmitting} data-kyc-submit="fisica" className="bg-luxury-gold text-black hover:bg-white font-bold">
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {c.submit}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
