"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { personaFisicaSchema, type PersonaFisicaData } from "@/lib/schemas";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { sendKYCEmailNotification } from "@/app/actions/kyc";
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

const FormSection = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <div className="py-6">
        <div className="flex items-center gap-3 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-luxury-gold/10 text-luxury-gold">{icon}</div>
            <h3 className="text-xl font-semibold text-white">{title}</h3>
        </div>
        <div className="space-y-6">{children}</div>
    </div>
);

const profesiones = [
    "Abogado", "Administrador", "Analista Financiero", "Arquitecto", "Asistente Administrativo", "Contador", "Consultor", "Dentista", "Diseñador", "Economista", "Educador / Maestro", "Empresario", "Enfermero/a", "Estudiante", "Farmacéutico", "Gerente de Proyectos", "Ingeniero", "Médico", "Mercadólogo", "Periodista", "Programador", "Psicólogo", "Publicista", "Vendedor", "Otro"
];

const cargos = [
    "Director", "Gerente", "Analista", "Coordinador", "Especialista", "Asistente", "Consultor", "CEO (Director Ejecutivo)", "CFO (Director Financiero)", "CTO (Director de Tecnología)", "COO (Director de Operaciones)", "Presidente", "Vicepresidente", "Supervisor", "Jefe de Departamento", "Empleado", "Socio / Propietario", "Freelancer / Independiente", "Otro"
];

const fuentesIngresos = [
    "Alquiler de propiedades", "Inversiones / Dividendos", "Servicios profesionales", "Negocio propio", "Herencia", "Pensión / Jubilación", "Otro"
];

const dataURLtoFile = (dataurl: string, filename: string) => {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)![1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}

export function PersonaFisicaForm() {
    const { toast } = useToast();
    const params = useParams();
    const lang = params.lang as string || 'es';
    
    const t = {
        en: {
            submitSuccessTitle: "Form Submitted Successfully",
            submitSuccessDesc: "Your KYC dossier has been encrypted and securely saved in our Fortress Vault. Our team will review your data shortly.",
            submitSuccessImportant: "We have sent you a confirmation email. Please check your SPAM or Junk folder if you do not see it in your inbox.",
            completeAnother: "Complete Another Form",
            notifyWhatsapp: "Notify via WhatsApp",
            toastSuccessTitle: "Form Submitted",
            toastSuccessDesc: "Your Individual due diligence form has been successfully sent.",
            toastValErrorTitle: "Validation Error",
            toastValErrorDesc: "An error occurred while saving the form or uploading documents.",
            toastConnErrorTitle: "Connection Error",
            toastConnErrorDesc: "Could not connect to the server to process the request.",
            toastMissingFieldsTitle: "Attention, missing fields",
            toastMissingFieldsDesc: "Please complete the fields highlighted in red to continue.",
            toastDraftSavedTitle: "Draft Saved",
            toastDraftSavedDesc: "Your progress has been saved locally.",
            toastPdfPrepTitle: "Preparing download...",
            toastPdfPrepDesc: "Your browser will open a print dialog. Please select 'Save as PDF'."
        },
        es: {
            submitSuccessTitle: "Formulario Registrado con Éxito",
            submitSuccessDesc: "Su expediente KYC ha sido encriptado y guardado de manera segura en nuestra Bóveda de Fortress. Nuestro equipo evaluará sus datos próximamente.",
            submitSuccessImportant: "Le hemos enviado un correo de confirmación. Por favor, verifique su bandeja de SPAM o Correo no Deseado si no lo ve en su bandeja principal.",
            completeAnother: "Completar Otro Formulario",
            notifyWhatsapp: "Notificar por WhatsApp",
            toastSuccessTitle: "Formulario Enviado",
            toastSuccessDesc: "Su formulario de Persona Física ha sido enviado con éxito.",
            toastValErrorTitle: "Error de Validación",
            toastValErrorDesc: "Ocurrió un error guardando el formulario o subiendo documentos.",
            toastConnErrorTitle: "Error de Conexión",
            toastConnErrorDesc: "No se pudo conectar con el servidor para procesar la petición.",
            toastMissingFieldsTitle: "Cuidado, faltan campos",
            toastMissingFieldsDesc: "Por favor, complete los campos remarcados en rojo para continuar.",
            toastDraftSavedTitle: "Borrador Guardado",
            toastDraftSavedDesc: "Su progreso ha sido guardado localmente.",
            toastPdfPrepTitle: "Preparando descarga...",
            toastPdfPrepDesc: "Su navegador abrirá un diálogo de impresión. Por favor, seleccione 'Guardar como PDF'."
        },
        fr: {
            submitSuccessTitle: "Formulaire Enregistré avec Succès",
            submitSuccessDesc: "Votre dossier KYC a été crypté et enregistré en toute sécurité dans notre coffre Fortress. Notre équipe évaluera vos données très prochainement.",
            submitSuccessImportant: "Nous vous avons envoyé un e-mail de confirmation. Veuillez vérifier votre dossier SPAM ou Courrier Indésirable si vous ne le voyez pas dans votre boîte de réception.",
            completeAnother: "Remplir un Autre Formulaire",
            notifyWhatsapp: "Notifier par WhatsApp",
            toastSuccessTitle: "Formulaire Envoyé",
            toastSuccessDesc: "Votre formulaire de Personne Physique a été envoyé avec succès.",
            toastValErrorTitle: "Erreur de Validation",
            toastValErrorDesc: "Une erreur est survenue lors de l'enregistrement du formulaire ou du téléchargement des documents.",
            toastConnErrorTitle: "Erreur de Connexion",
            toastConnErrorDesc: "Impossible de se connecter au serveur pour traiter la demande.",
            toastMissingFieldsTitle: "Attention, champs manquants",
            toastMissingFieldsDesc: "Veuillez remplir les champs surbrillants en rouge pour continuer.",
            toastDraftSavedTitle: "Brouillon Enregistré",
            toastDraftSavedDesc: "Votre progression a été enregistrée localement.",
            toastPdfPrepTitle: "Préparation du téléchargement...",
            toastPdfPrepDesc: "Votre navigateur va ouvrir une boîte de dialogue d'impression. Veuillez sélectionner 'Enregistrer au format PDF'."
        }
    };
    const d = t[lang as 'en' | 'es' | 'fr'] || t.es;

    const [draft, setDraft] = useLocalStorage<Partial<PersonaFisicaData> | null>('persona-fisica-draft', null);

    const form = useForm<PersonaFisicaData>({
        resolver: zodResolver(personaFisicaSchema),
        defaultValues: draft || defaultValues,
    });

    const [hasLoadedDraft, setHasLoadedDraft] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (draft && !hasLoadedDraft) {
            const parsedDraft = { ...draft };
            if (typeof parsedDraft.date === 'string') parsedDraft.date = new Date(parsedDraft.date);
            if (typeof parsedDraft.birthDate === 'string') parsedDraft.birthDate = new Date(parsedDraft.birthDate);
            if (typeof parsedDraft.spouseBirthDate === 'string') parsedDraft.spouseBirthDate = new Date(parsedDraft.spouseBirthDate);
            form.reset(parsedDraft);
            setHasLoadedDraft(true);
        } else if (!draft && !hasLoadedDraft) {
            setHasLoadedDraft(true);
        }
    }, [draft, form, hasLoadedDraft]);


    const { fields: personalFields, append: appendPersonal, remove: removePersonal } = useFieldArray({ control: form.control, name: "personalReferences" });
    const { fields: commercialFields, append: appendCommercial, remove: removeCommercial } = useFieldArray({ control: form.control, name: "commercialReferences" });
    const { fields: bankFields, append: appendBank, remove: removeBank } = useFieldArray({ control: form.control, name: "bankReferences" });

    const hasSpouse = form.watch('hasSpouse');
    const isPEP = form.watch('isPEP');
    const profession = form.watch('profession');
    const position = form.watch('position');
    const hasOtherIncome = form.watch('hasOtherIncome');
    const otherIncomeSource = form.watch('otherIncomeSource');

    // Auto-Save: Watch all fields and save to local storage
    const currentValues = form.watch();
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDraft(currentValues as Partial<PersonaFisicaData>);
        }, 500); // 500ms debounce
        return () => clearTimeout(timeoutId);
    }, [currentValues, setDraft]);

    const onSubmit = async (data: PersonaFisicaData) => {
        try {
            const formData = new FormData();
            formData.append('formType', 'Persona Física');

            const textFields = [
                'customerCode', 'idType', 'idDocument', 'firstName', 'lastName', 'email', 'gender',
                'birthPlace', 'nationality', 'maritalStatus', 'homePhone', 'mobilePhone1', 'mobilePhone2',
                'address', 'province', 'state', 'residenceCountry', 'hasSpouse', 'spouseFirstName',
                'spouseLastName', 'spouseIdType', 'spouseIdDocument', 'spouseBirthPlace', 'spouseNationality',
                'spouseEmail', 'spouseHomePhone', 'spouseMobilePhone', 'profession', 'professionOther',
                'position', 'positionOther', 'company', 'monthlyIncome', 'fundsOrigin', 'hasOtherIncome',
                'otherIncomeSource', 'otherIncomeSourceOther', 'otherIncomeAmount', 'incomeUSD',
                'pepPosition', 'pepInstitution', 'pepCountry'
            ];

            const dateFields = ['date', 'birthDate', 'spouseBirthDate'];
            const booleanFields = ['declaration1', 'declarationLicitFunds', 'authorization', 'declaration4'];
            const arrayFields = ['personalReferences', 'commercialReferences', 'bankReferences'];

            const fieldMap: Record<string, string> = {
                firstName: 'nombres',
                lastName: 'apellidos',
                idDocument: 'pasaporte_cedula',
                nationality: 'nacionalidad',
                maritalStatus: 'estado_civil',
                birthPlace: 'lugar_nacimiento',
                homePhone: 'tel_residencia',
                mobilePhone1: 'tel_celular',
                email: 'email',
                address: 'direccion',
                province: 'ciudad', // Mapped province/city
                residenceCountry: 'pais',
                profession: 'profesion_ocupacion',
                company: 'lugar_trabajo',
                position: 'posicion',
                monthlyIncome: 'ingreso_promedio',
                incomeUSD: 'equivalente_usd',
                fundsOrigin: 'origen_fondos',
                spouseFirstName: 'conyuge_nombres',
                spouseLastName: 'conyuge_apellidos',
                spouseIdDocument: 'conyuge_pasaporte_cedula',
                spouseNationality: 'conyuge_nacionalidad',
                spouseHomePhone: 'conyuge_tel_residencia',
                spouseMobilePhone: 'conyuge_tel_celular',
                spouseEmail: 'conyuge_email',
                otherIncomeSource: 'fuente_otros_ingresos',
                otherIncomeAmount: 'monto_otros_ingresos',
                pepPosition: 'pep_cargo',
                pepInstitution: 'pep_institucion',
                pepCountry: 'pep_pais',
            };

            const dateFieldsMap: Record<string, string> = {
                birthDate: 'fecha_nacimiento',
                spouseBirthDate: 'conyuge_fecha_nacimiento'
            };

            const booleanFieldsMap: Record<string, string> = {
                declaration1: 'declaracion_jurada',
                declarationLicitFunds: 'declaracion_licitud_fondos',
                authorization: 'autorizacion_compartir_info',
                declaration4: 'declaracion_veracidad'
            };

            const arrayFieldsMap: Record<string, string> = {
                personalReferences: 'referencias_personales',
                commercialReferences: 'referencias_comerciales',
                bankReferences: 'referencias_bancarias',
            };

            textFields.forEach(field => {
                const val = data[field as keyof PersonaFisicaData];
                if (val !== undefined && val !== null && fieldMap[field]) {
                    const stringVal = String(val).trim();
                    if (stringVal !== '') {
                        formData.append(fieldMap[field], stringVal);
                    }
                }
            });

            dateFields.forEach(field => {
                const val = data[field as keyof PersonaFisicaData];
                if (val && dateFieldsMap[field]) {
                    if (val instanceof Date) formData.append(dateFieldsMap[field], val.toISOString().split('T')[0]);
                    else if (typeof val === 'string') formData.append(dateFieldsMap[field], val.split('T')[0]); 
                }
            });

            booleanFields.forEach(field => {
                const val = data[field as keyof PersonaFisicaData];
                if (booleanFieldsMap[field]) {
                    formData.append(booleanFieldsMap[field], val ? 'true' : 'false');
                }
            });

            // Handle isPEP manually since it's "si" / "no" in the frontend
            formData.append('es_pep', data.isPEP === 'si' ? 'true' : 'false');
            // Handle hasOtherIncome manually
            formData.append('tiene_otros_ingresos', data.hasOtherIncome === 'si' ? 'true' : 'false');

            arrayFields.forEach(field => {
                const val = data[field as keyof PersonaFisicaData];
                if (val && Array.isArray(val) && arrayFieldsMap[field]) {
                    formData.append(arrayFieldsMap[field], JSON.stringify(val));
                }
            });

            // Map Frontend File Names to Django Model Field Names
            const fileMappings: Record<string, keyof PersonaFisicaData> = {
                'doc_identidad_file': 'idDocumentFile',
                'doc_estado_cuenta_file': 'proofOfFundsFile',
                'doc_comprobante_domicilio_file': 'proofOfAddressFile',
                'doc_certificado_laboral_file': 'workLetterFile',
                'doc_bureau_credito_file': 'creditBureauFile'
            };

            for (const [djangoField, formField] of Object.entries(fileMappings)) {
                const fileData = data[formField as keyof typeof data];
                if (!fileData) continue;
                
                // Allow both File and Blob (image compression might return Blob in some browsers)
                if (fileData instanceof Blob || fileData instanceof File) {
                    formData.append(djangoField, fileData);
                } else if (typeof FileList !== 'undefined' && fileData instanceof FileList && fileData.length > 0) {
                    formData.append(djangoField, fileData[0]);
                } else if (Array.isArray(fileData) && fileData.length > 0 && (fileData[0] instanceof Blob || fileData[0] instanceof File)) {
                    formData.append(djangoField, fileData[0]);
                }
            }

            if (data.signature) {
                const sigFile = dataURLtoFile(data.signature, 'firma.png');
                formData.append('firma_digital', sigFile);
            }

            // Enviar los datos directamente al backend de Django en Railway sin headers bloqueantes
            const res = await fetch('https://puntacana-fortress-production.up.railway.app/api/public/kyc/fisica/', {
                method: 'POST',
                body: formData
            });

            // CRITICO: Atrapar el 201 OK INMEDIATAMENTE para evitar fallos de parseo de JSON
            if (res.ok || res.status === 201) {
                // Send email notification using Server Action safely AFTER Django success
                try {
                    await sendKYCEmailNotification({
                        type: 'Persona Física',
                        clientEmail: data.email,
                        subjectName: `${data.firstName} ${data.lastName}`.trim()
                    });
                } catch (emailError) {
                    console.error("Failed to send KYC confirmation email", emailError);
                }

                toast({
                    title: d.toastSuccessTitle,
                    description: d.toastSuccessDesc,
                });
                setDraft(null);
                form.reset(defaultValues);
                setIsSuccess(true);
                return; // Termina la ejecución exitosa aquí
            }

            let result: any;
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                try {
                    result = await res.json();
                } catch (e) {
                    result = { error: "Unparseable JSON error." };
                }
            } else {
                const text = await res.text().catch(() => '');
                console.error("Non-JSON API response:", text);
                result = { success: false, error: `Error del servidor (${res.status}): Respuesta no válida.` };
            }
            
            // Llegamos aquí solo si res.ok es FALSE
            toast({
                title: d.toastValErrorTitle,
                description: typeof result?.error === 'string' ? result.error : d.toastValErrorDesc,
            });
            console.error("KYC Submission Error:", result);
        } catch (error) {
            toast({
                title: d.toastConnErrorTitle,
                description: d.toastConnErrorDesc,
            });
            console.error("Critical submission failed", error);
        }
    };

    const onError = (errors: any) => {
        const firstErrorKey = Object.keys(errors)[0];
        const errorElement = document.querySelector(`[name="${firstErrorKey}"]`);
        
        toast({
            title: d.toastMissingFieldsTitle,
            description: d.toastMissingFieldsDesc,
        });

        if (errorElement) {
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            (errorElement as HTMLElement).focus();
        }
    };

    const handleSaveDraft = () => {
        const values = form.getValues();
        setDraft(values);
        toast({
            title: d.toastDraftSavedTitle,
            description: d.toastDraftSavedDesc,
        });
    };

    const handleDownload = () => {
        toast({
            title: d.toastPdfPrepTitle,
            description: d.toastPdfPrepDesc,
        });
        setTimeout(() => window.print(), 500);
    };

    const { isSubmitting } = form.formState;

    if (isSuccess) {
        const waMsg = lang === 'es'
            ? "Hola, acabo de enviar mi expediente KYC (Debida Diligencia) a través del portal de Punta Cana Investments. Quedo atento/a a su revisión."
            : lang === 'fr'
            ? "Bonjour, je viens d'envoyer mon dossier KYC (Diligence Raisonnable) via le portail de Punta Cana Investments. Je reste en attente de votre examen."
            : "Hello, I have just submitted my KYC (Due Diligence) dossier through the Punta Cana Investments portal. I look forward to your review.";

        return (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-zinc-950 rounded-lg border border-luxury-gold/50 shadow-2xl min-h-[50vh] animate-in fade-in zoom-in duration-500">
                <CheckCircle className="w-24 h-24 text-green-500 mb-6" />
                <h2 className="text-3xl font-bold text-white mb-4">{d.submitSuccessTitle}</h2>
                <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                    {d.submitSuccessDesc}
                </p>
                
                <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 p-4 rounded-lg max-w-md mx-auto mb-8 text-sm">
                    <strong>{lang === 'es' ? 'Importante:' : lang === 'fr' ? 'Important :' : 'Important:'}</strong> {d.submitSuccessImportant}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button onClick={() => setIsSuccess(false)} className="bg-luxury-gold text-black hover:bg-white font-bold px-8">
                        {d.completeAnother}
                    </Button>
                    <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(waMsg)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-8 py-2 bg-[#25D366] text-white hover:bg-[#20bd5a]">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                        {d.notifyWhatsapp}
                    </a >
                </div >
            </div >
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8 print:space-y-4 border-2 border-luxury-gold/50 rounded-xl p-8 bg-black/40">
                <div className="sticky top-0 z-10 bg-zinc-950/95 backdrop-blur-sm border-b border-white/10 px-6 py-4 -mx-6 md:-mx-8 print:hidden">
                    <div className="flex justify-between items-center text-center text-xs font-medium text-gray-400">
                        {['Datos Generales', 'Cónyuge', 'Ocupación', 'Político', 'Ref. & Decl.'].map((step, i) => (
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
                            <Image
                                src="/form-logo.jpg"
                                alt="Punta Cana Investments"
                                fill
                                style={{ objectFit: 'contain' }}
                                priority
                            />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold uppercase border-b-2 border-black pb-2 mb-4">Formulario de Debida Diligencia - Persona Física / Due Diligence Form - Individual</h1>
                </div>

                <FormSection icon={<CircleUserRound size={20} />} title="Datos Generales del Cliente / Customer General Data">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <FormField control={form.control} name="customerCode" render={({ field }) => (<FormItem><FormLabel>Código Cliente / Customer Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="date" render={({ field }) => (<FormItem><FormLabel>Fecha / Date *</FormLabel><FormControl><DatePicker field={field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="idType" render={({ field }) => (<FormItem><FormLabel>Tipo de Identificación / ID Type *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccionar tipo / Select type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="cedula">Cédula</SelectItem><SelectItem value="pasaporte">Pasaporte</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="idDocument" render={({ field }) => (<FormItem><FormLabel>Número de Identificación / ID Number *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="firstName" render={({ field }) => (<FormItem><FormLabel>Nombres / First Name *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="lastName" render={({ field }) => (<FormItem><FormLabel>Apellidos / Last Name *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Correo Electrónico / Email *</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="gender" render={({ field }) => (<FormItem><FormLabel>Sexo / Gender *</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} value={field.value} className="flex items-center gap-4 pt-2"><div className="flex items-center space-x-2"><RadioGroupItem value="femenino" /><FormLabel className="font-normal text-white">Femenino / Female</FormLabel></div><div className="flex items-center space-x-2"><RadioGroupItem value="masculino" /><FormLabel className="font-normal text-white">Masculino / Male</FormLabel></div></RadioGroup></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="birthDate" render={({ field }) => (<FormItem><FormLabel>Fecha de Nacimiento / Date of Birth *</FormLabel><FormControl><DatePicker field={field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="birthPlace" render={({ field }) => (<FormItem><FormLabel>Lugar de Nacimiento / Place of Birth *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="nationality" render={({ field }) => (<FormItem><FormLabel>Nacionalidad / Nationality *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="maritalStatus" render={({ field }) => (<FormItem><FormLabel>Estado Civil / Marital Status *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccionar / Select" /></SelectTrigger></FormControl><SelectContent><SelectItem value="soltero">Soltero/a / Single</SelectItem><SelectItem value="casado">Casado/a / Married</SelectItem><SelectItem value="union_libre">Unión Libre / Domestic Partnership</SelectItem><SelectItem value="divorciado">Divorciado/a / Divorced</SelectItem><SelectItem value="viudo">Viudo/a / Widowed</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="homePhone" render={({ field }) => (<FormItem><FormLabel>Teléfono Residencial / Home Phone</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="mobilePhone1" render={({ field }) => (<FormItem><FormLabel>Teléfono Móvil 1 / Mobile Phone 1 *</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="mobilePhone2" render={({ field }) => (<FormItem><FormLabel>Teléfono Móvil 2 / Mobile Phone 2</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="address" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>Dirección / Address *</FormLabel><FormControl><Input placeholder="Sector, Calle, #, Residencial, Apto. / Neighborhood, Street, #, Building, Apt." {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="province" render={({ field }) => (<FormItem><FormLabel>Provincia / Province *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="state" render={({ field }) => (<FormItem><FormLabel>Estado / State</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="residenceCountry" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>País de Residencia / Country of Residence *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                </FormSection>

                <Separator className="bg-white/10" />

                <FormSection icon={<Gem size={20} />} title="Datos del Cónyuge / Spouse's Data">
                    <FormField control={form.control} name="hasSpouse" render={({ field }) => (<FormItem><FormLabel>¿Aplica Cónyuge? / Does Spouse Apply? *</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} value={field.value} className="flex items-center gap-4 pt-2"><div className="flex items-center space-x-2"><RadioGroupItem value="si" /><FormLabel className="font-normal text-white">Sí / Yes</FormLabel></div><div className="flex items-center space-x-2"><RadioGroupItem value="no" /><FormLabel className="font-normal text-white">No</FormLabel></div></RadioGroup></FormControl><FormMessage /></FormItem>)} />
                    {hasSpouse === 'si' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-4 border-t border-dashed border-white/20 mt-4 animate-in fade-in slide-in-from-top-4">
                            <FormField control={form.control} name="spouseFirstName" render={({ field }) => (<FormItem><FormLabel>Nombres del Cónyuge / Spouse's First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="spouseLastName" render={({ field }) => (<FormItem><FormLabel>Apellidos del Cónyuge / Spouse's Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="spouseIdType" render={({ field }) => (<FormItem><FormLabel>Tipo de Identificación / ID Type</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccionar tipo / Select type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="cedula">Cédula</SelectItem><SelectItem value="pasaporte">Pasaporte</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="spouseIdDocument" render={({ field }) => (<FormItem><FormLabel>Número de Identificación / ID Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="spouseBirthDate" render={({ field }) => (<FormItem><FormLabel>Fecha de Nacimiento / Date of Birth</FormLabel><FormControl><DatePicker field={field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="spouseBirthPlace" render={({ field }) => (<FormItem><FormLabel>Lugar de Nacimiento / Place of Birth</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="spouseNationality" render={({ field }) => (<FormItem><FormLabel>Nacionalidad / Nationality</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="spouseEmail" render={({ field }) => (<FormItem><FormLabel>Correo Electrónico / Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="spouseHomePhone" render={({ field }) => (<FormItem><FormLabel>Teléfono Residencial / Home Phone</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="spouseMobilePhone" render={({ field }) => (<FormItem><FormLabel>Teléfono Móvil / Mobile Phone</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                    )}
                </FormSection>

                <Separator className="bg-white/10" />

                <FormSection icon={<Briefcase size={20} />} title="Datos Ocupacionales / Occupational Data">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <FormField
                            control={form.control}
                            name="profession"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Profesión / Profession *</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Seleccionar profesión / Select profession" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {profesiones.map(p => <SelectItem key={p} value={p.toLowerCase().replace(/ /g, '_')} >{p}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {profession === 'otro' && (
                            <FormField control={form.control} name="professionOther" render={({ field }) => (<FormItem><FormLabel>Especifique su profesión / Specify your profession</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        )}
                        <FormField
                            control={form.control}
                            name="position"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cargo / Position *</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Seleccionar cargo / Select position" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {cargos.map(c => <SelectItem key={c} value={c.toLowerCase().replace(/ /g, '_')} >{c}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {position === 'otro' && (
                            <FormField control={form.control} name="positionOther" render={({ field }) => (<FormItem><FormLabel>Especifique su cargo / Specify your position</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        )}

                        <FormField control={form.control} name="company" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>Nombre de la Empresa / Company Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="monthlyIncome" render={({ field }) => (<FormItem><FormLabel>Ingresos Mensuales / Monthly Income *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccionar rango / Select range" /></SelectTrigger></FormControl><SelectContent>
                            <SelectItem value="<50000">Menos de RD$50,000.00</SelectItem>
                            <SelectItem value="50001-100000">RD$50,001 a 100,000</SelectItem>
                            <SelectItem value="100001-500000">RD$100,001 a 500,000</SelectItem>
                            <SelectItem value="500001-1000000">RD$500,001 a 1,000,000</SelectItem>
                            <SelectItem value=">1000000">Más de RD$1,000,000.00</SelectItem>
                        </SelectContent></Select><FormMessage /></FormItem>)} />

                        <FormField control={form.control} name="fundsOrigin" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>Origen de los Fondos / Source of Funds *</FormLabel><FormControl><Input placeholder="Ej. Ahorros, Salario, Inversiones / e.g. Savings, Salary, Investments" {...field} /></FormControl><FormMessage /></FormItem>)} />

                        <div className="md:col-span-2">
                            <FormField control={form.control} name="hasOtherIncome" render={({ field }) => (<FormItem><FormLabel>¿Posee otros ingresos? / Do you have other income?</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} value={field.value} className="flex items-center gap-4 pt-2"><div className="flex items-center space-x-2"><RadioGroupItem value="si" /><FormLabel className="font-normal text-white">Sí / Yes</FormLabel></div><div className="flex items-center space-x-2"><RadioGroupItem value="no" /><FormLabel className="font-normal text-white">No</FormLabel></div></RadioGroup></FormControl><FormMessage /></FormItem>)} />
                        </div>

                        {hasOtherIncome === 'si' && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="otherIncomeSource"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Fuente de Otros Ingresos / Source of Other Income</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger><SelectValue placeholder="Seleccionar fuente / Select source" /></SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {fuentesIngresos.map(f => <SelectItem key={f} value={f.toLowerCase().replace(/ /g, '_')} >{f}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {otherIncomeSource === 'otro' && (
                                    <FormField control={form.control} name="otherIncomeSourceOther" render={({ field }) => (<FormItem><FormLabel>Especifique la fuente / Specify the source</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                )}
                                <FormField control={form.control} name="otherIncomeAmount" render={({ field }) => (<FormItem><FormLabel>Monto de Otros Ingresos / Other Income Amount</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            </>
                        )}

                        <FormField control={form.control} name="incomeUSD" render={({ field }) => (<FormItem><FormLabel>Equivalente en USD / Equivalent in USD</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                </FormSection>

                <Separator className="bg-white/10" />

                <FormSection icon={<Landmark size={20} />} title="Información Política (Vinculación PEP) / Political Information (PEP Affiliation)">
                    <FormField control={form.control} name="isPEP" render={({ field }) => (<FormItem><FormLabel>¿Es usted o tiene vinculación con una Persona Políticamente Expuesta (PEP)? / Are you or do you have a connection with a Politically Exposed Person (PEP)? *</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} value={field.value} className="flex items-center gap-4 pt-2"><div className="flex items-center space-x-2"><RadioGroupItem value="si" /><FormLabel className="font-normal text-white">Sí / Yes</FormLabel></div><div className="flex items-center space-x-2"><RadioGroupItem value="no" /><FormLabel className="font-normal text-white">No</FormLabel></div></RadioGroup></FormControl><FormMessage /></FormItem>)} />
                    {isPEP === 'si' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-4 border-t border-dashed border-white/20 mt-4 animate-in fade-in slide-in-from-top-4">
                            <FormField control={form.control} name="pepPosition" render={({ field }) => (<FormItem><FormLabel>Cargo que desempeña / Position held</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="pepInstitution" render={({ field }) => (<FormItem><FormLabel>Institución / Institution</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="pepCountry" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>País / Country</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                    )}
                </FormSection>

                <Separator className="bg-white/10" />

                <FormSection icon={<Handshake size={20} />} title="Referencias / References">
                    <div className="space-y-6">
                        <div>
                            <h4 className="font-medium mb-2 text-white">Referencias Personales / Personal References</h4>
                            {personalFields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-4 p-4 border border-white/10 rounded-md relative bg-white/5">
                                    <FormField control={form.control} name={`personalReferences.${index}.name`} render={({ field }) => (<FormItem><FormLabel>Nombre / Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={form.control} name={`personalReferences.${index}.relationship`} render={({ field }) => (<FormItem><FormLabel>Parentesco / Relationship</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={form.control} name={`personalReferences.${index}.phone`} render={({ field }) => (<FormItem><FormLabel>Teléfono / Phone</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    {personalFields.length > 1 && (<Button type="button" variant="ghost" size="icon" className="absolute -top-3 -right-3 h-6 w-6 rounded-full bg-red-900/40 text-red-500 hover:bg-red-900/60" onClick={() => removePersonal(index)}><X size={14} /></Button>)}
                                </div>
                            ))}
                            <Button type="button" variant="link" size="sm" className="text-luxury-gold hover:text-white" onClick={() => appendPersonal({ name: "", relationship: "", phone: "" })}><PlusCircle className="mr-2" size={16} />Agregar otra referencia personal</Button>
                        </div>

                        <div>
                            <h4 className="font-medium mb-2 text-white">Referencias Comerciales / Commercial References</h4>
                            {commercialFields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-4 p-4 border border-white/10 rounded-md relative bg-white/5">
                                    <FormField control={form.control} name={`commercialReferences.${index}.entity`} render={({ field }) => (<FormItem><FormLabel>Entidad / Entity</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={form.control} name={`commercialReferences.${index}.relationshipType`} render={({ field }) => (<FormItem><FormLabel>Tipo de Relación / Relationship Type</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={form.control} name={`commercialReferences.${index}.phone`} render={({ field }) => (<FormItem><FormLabel>Teléfono / Phone</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    {commercialFields.length > 1 && (<Button type="button" variant="ghost" size="icon" className="absolute -top-3 -right-3 h-6 w-6 rounded-full bg-red-900/40 text-red-500 hover:bg-red-900/60" onClick={() => removeCommercial(index)}><X size={14} /></Button>)}
                                </div>
                            ))}
                            <Button type="button" variant="link" size="sm" className="text-luxury-gold hover:text-white" onClick={() => appendCommercial({ entity: "", relationshipType: "", phone: "" })}><PlusCircle className="mr-2" size={16} />Agregar otra referencia comercial</Button>
                        </div>

                        <div>
                            <h4 className="font-medium mb-2 text-white">Referencias Bancarias / Bank References</h4>
                            {bankFields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-4 p-4 border border-white/10 rounded-md relative bg-white/5">
                                    <FormField control={form.control} name={`bankReferences.${index}.entity`} render={({ field }) => (<FormItem><FormLabel>Entidad / Entity</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={form.control} name={`bankReferences.${index}.type`} render={({ field }) => (
                                        <FormItem><FormLabel>Tipo / Type</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Seleccionar... / Select..." /></SelectTrigger></FormControl>
                                                <SelectContent><SelectItem value="cuenta">Cuenta / Account</SelectItem><SelectItem value="tarjeta_credito">Tarjeta de Crédito / Credit Card</SelectItem><SelectItem value="otro">Otro / Other</SelectItem></SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name={`bankReferences.${index}.phone`} render={({ field }) => (<FormItem><FormLabel>Teléfono / Phone</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    {bankFields.length > 1 && (<Button type="button" variant="ghost" size="icon" className="absolute -top-3 -right-3 h-6 w-6 rounded-full bg-red-900/40 text-red-500 hover:bg-red-900/60" onClick={() => removeBank(index)}><X size={14} /></Button>)}
                                </div>
                            ))}
                            <Button type="button" variant="link" size="sm" className="text-luxury-gold hover:text-white" onClick={() => appendBank({ entity: "", type: "", phone: "" })}><PlusCircle className="mr-2" size={16} />Agregar otra referencia bancaria</Button>
                        </div>
                    </div>
                </FormSection>

                <Separator className="bg-white/10" />

                <div className="print:hidden"><FormSection icon={<FileText size={20} />} title="Documentos Requeridos / Required Documents">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FileUpload name="idDocumentFile" label="Fotocopia de dos documentos de identidad / Copy of two ID documents" description="Formatos PDF o JPG (máx. 5MB) / PDF or JPG formats (max. 5MB)" />
                        <FileUpload name="proofOfFundsFile" label="Constancia de fondos / Proof of funds" description="Formatos PDF o JPG (máx. 5MB) / PDF or JPG formats (max. 5MB)" />
                        <FileUpload name="creditBureauFile" label="Bureau de crédito (si aplica) / Credit bureau (if applicable)" description="Formatos PDF o JPG (máx. 5MB) / PDF or JPG formats (max. 5MB)" />
                        <FileUpload name="proofOfAddressFile" label="Constancia de domicilio / Proof of address" description="Formatos PDF o JPG (máx. 5MB) / PDF or JPG formats (max. 5MB)" />
                        <div className="md:col-span-2">
                            <FileUpload name="workLetterFile" label="Carta de trabajo / Work letter" description="Formatos PDF o JPG (máx. 5MB) / PDF or JPG formats (max. 5MB)" />
                        </div>
                    </div>
                </FormSection>

                </div>
                <Separator className="print:hidden bg-white/10" />

                <FormSection icon={<CheckCircle size={20} />} title="Declaraciones y Autorización / Declarations and Authorization">
                    <div className="space-y-4">
                        <FormField control={form.control} name="declaration1" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={!!field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel className="font-normal text-white">Declaro que la información contenida en este formulario es verdadera, completa y actualizada. / I declare that the information contained in this form is true, complete, and up-to-date. *</FormLabel></div><FormMessage /></FormItem>)} />
                        <FormField
                            control={form.control}
                            name="declarationLicitFunds"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            checked={!!field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel className="font-normal text-white">
                                            <span className="font-bold text-luxury-gold block mb-2">Declaración de Origen Lícito de Fondos y Prevención de Lavado de Activos / Declaration of Lawful Origin of Funds and Prevention of Money Laundering *</span>
                                            Declaro y garantizo que los fondos utilizados en la presente operación provienen de actividades lícitas, y que no constituyen ni provendrán, directa o indirectamente, de actos vinculados al lavado de activos, al financiamiento del terrorismo ni de ninguna otra actividad ilícita tipificada por las leyes de la República Dominicana o por convenios internacionales suscritos y ratificados por el país.
                                            <br /><br />
                                            <span className="italic block mt-1 opacity-80">I declare and guarantee that the funds used in this transaction come from lawful activities, and that they do not constitute nor will they come, directly or indirectly, from acts related to money laundering, financing of terrorism, or any other illicit activity defined by the laws of the Dominican Republic or by international conventions subscribed and ratified by the country.</span>
                                            <br /><br />
                                            Asimismo, me obligo a cumplir con las disposiciones de la Ley No. 155-17 sobre Lavado de Activos y Financiamiento del Terrorismo, así como con todas las normas reglamentarias vigentes, liberando a la otra parte de cualquier responsabilidad que pudiera derivarse por falsedad en esta declaración.
                                        </FormLabel>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control} name="authorization" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={!!field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel className="font-normal text-white">Autorizo expresa e irrevocablemente a Punta Cana Real Estate and Investment U&E S.R.L. a realizar el análisis y las verificaciones que considere necesarias... / I expressly and irrevocably authorize Punta Cana Real Estate and Investment U&E S.R.L. to carry out the analysis and verifications it deems necessary... *</FormLabel></div><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="declaration4" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={!!field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel className="font-normal text-white">Autorizo expresamente compartir información con instituciones financieras dominicanas y autoridades competentes según leyes vigentes. / I expressly authorize the sharing of information with Dominican financial institutions and competent authorities according to current laws. *</FormLabel></div><FormMessage /></FormItem>)} />
                    </div>
                </FormSection>

                <Separator className="bg-white/10" />

                <FormSection icon={<Pencil size={20} />} title="Firma Digital / Digital Signature">
                    <div className="space-y-4">
                        <FormLabel className="text-white block mb-2 font-medium underline">Firma Digital / Digital Signature *</FormLabel>
                        <SignaturePad />
                    </div>
                </FormSection>

                <div className="flex flex-col-reverse gap-4 pt-8 sm:flex-row sm:justify-end print:hidden">
                    <Button type="button" variant="outline" onClick={handleSaveDraft} disabled={isSubmitting} className="border-white/20 text-white hover:bg-white/10">Guardar Borrador / Save Draft</Button>
                    <Button type="button" variant="outline" onClick={handleDownload} disabled={isSubmitting} className="border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-black">Vista Previa / Preview</Button>
                    <Button type="button" variant="outline" onClick={handleDownload} disabled={isSubmitting} className="text-green-500 border-green-500 hover:bg-green-500/10">Descargar como PDF / Download as PDF</Button>
                    <Button type="submit" disabled={isSubmitting} className="bg-luxury-gold text-black hover:bg-white font-bold">
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Enviar Formulario / Submit Form
                    </Button>
                </div>
            </form>
        </Form>
    );
}
