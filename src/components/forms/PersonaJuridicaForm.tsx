"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { personaJuridicaSchema, type PersonaJuridicaData } from "@/lib/schemas";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";
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
import { Building, Users, UserCheck, Banknote, FileText, CheckCircle, Pencil, Loader2, Landmark } from "lucide-react";
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

const dataURLtoFile = (dataurl: string, filename: string) => {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)![1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}

export function PersonaJuridicaForm() {
    const { toast } = useToast();
    const [draft, setDraft] = useLocalStorage<Partial<PersonaJuridicaData> | null>('persona-juridica-draft', null);

    const form = useForm<PersonaJuridicaData>({
        resolver: zodResolver(personaJuridicaSchema),
        defaultValues: draft || defaultValues,
    });

    const isPEP = form.watch('isPEP');

    useEffect(() => {
        if (draft) {
            const parsedDraft = { ...draft };
            if (typeof parsedDraft.date === 'string') parsedDraft.date = new Date(parsedDraft.date);
            if (typeof parsedDraft.incorporationDate === 'string') parsedDraft.incorporationDate = new Date(parsedDraft.incorporationDate);
            if (typeof parsedDraft.legalRepBirthDate === 'string') parsedDraft.legalRepBirthDate = new Date(parsedDraft.legalRepBirthDate);
            form.reset(parsedDraft);
        }
    }, [draft, form]);

    const legalRepProfession = form.watch('legalRepProfession');
    const legalRepPosition = form.watch('legalRepPosition');

    // Auto-Save: Watch all fields and save to local storage
    const currentValues = form.watch();
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDraft(currentValues as Partial<PersonaJuridicaData>);
        }, 500); // 500ms debounce
        return () => clearTimeout(timeoutId);
    }, [currentValues, setDraft]);

    const onSubmit = async (data: PersonaJuridicaData) => {
        try {
            const formData = new FormData();
            formData.append('formType', 'Persona Jurídica');

            const textFields = [
                'customerCode', 'companyName', 'commercialName', 'constitutionCountry', 'city', 'rnc',
                'legalRepFirstName', 'legalRepLastName', 'legalRepId', 'legalRepAddress', 'legalRepPhone',
                'legalRepEmail', 'legalRepProfession', 'legalRepProfessionOther', 'legalRepPosition',
                'legalRepPositionOther', 'legalRepDesignation', 'averageIncome', 'annualIncome', 'incomeUSD',
                'fundsOrigin', 'isPEP', 'pepPosition', 'pepInstitution', 'pepCountry'
            ];

            const dateFields = ['date', 'incorporationDate', 'legalRepBirthDate'];
            const booleanFields = ['declaration', 'declaration2', 'authorization', 'declaration4'];

            const fieldMap: Record<string, string> = {
                customerCode: 'codigo_cliente',
                companyName: 'razon_social',
                commercialName: 'nombre_comercial',
                constitutionCountry: 'pais_constitucion',
                city: 'ciudad',
                rnc: 'rnc',
                legalRepFirstName: 'rep_nombres',
                legalRepLastName: 'rep_apellidos',
                legalRepId: 'rep_id',
                legalRepAddress: 'rep_direccion',
                legalRepPhone: 'rep_telefono',
                legalRepEmail: 'rep_email',
                legalRepProfession: 'rep_profesion',
                legalRepPosition: 'rep_cargo',
                legalRepDesignation: 'rep_designacion',
                averageIncome: 'ingreso_promedio',
                annualIncome: 'ingreso_anual',
                incomeUSD: 'equivalente_usd',
                fundsOrigin: 'origen_fondos',
                isPEP: 'es_pep',
            };

            const dateFieldsMap: Record<string, string> = {
                incorporationDate: 'fecha_constitucion',
                legalRepBirthDate: 'rep_fecha_nacimiento'
            };

            const booleanFieldsMap: Record<string, string> = {
                declaration: 'declaracion_jurada'
            };

            textFields.forEach(field => {
                const val = data[field as keyof PersonaJuridicaData];
                if (val !== undefined && val !== null && fieldMap[field]) {
                    const stringVal = String(val).trim();
                    formData.append(fieldMap[field], stringVal !== '' ? stringVal : 'No especificado');
                }
            });

            dateFields.forEach(field => {
                const val = data[field as keyof PersonaJuridicaData];
                if (val && dateFieldsMap[field]) {
                    if (val instanceof Date) formData.append(dateFieldsMap[field], val.toISOString().split('T')[0]);
                    else if (typeof val === 'string') formData.append(dateFieldsMap[field], val.split('T')[0]); 
                }
            });

            booleanFields.forEach(field => {
                const val = data[field as keyof PersonaJuridicaData];
                if (booleanFieldsMap[field]) {
                    formData.append(booleanFieldsMap[field], val ? 'true' : 'false');
                }
            });

            // Map Frontend File Names to Django Model Field Names
            const fileMappings: Record<string, keyof PersonaJuridicaData> = {
                'doc_registro_mercantil': 'commercialRegistryFile',
                'doc_rep_id': 'legalRepIdFile',
                'doc_asamblea': 'shareholderAssemblyFile',
                'doc_firmas': 'authorizedSignaturesFile',
                'doc_nomina_socios': 'shareholderListFile',
                'doc_estados_financieros': 'financialStatementsFile'
            };

            for (const [djangoField, formField] of Object.entries(fileMappings)) {
                const file = data[formField];
                if (file instanceof File) {
                    formData.append(djangoField, file);
                }
            }

            if (data.signature) {
                const sigFile = dataURLtoFile(data.signature, 'firma.png');
                formData.append('firma_digital', sigFile);
            }

            // Enviar los datos a la capa intermedia de Next.js (ruta serverless)
            // Esto asegura que la X-API-KEY se inyecte de manera segura desde el entorno del servidor sin exponerla.
            const res = await fetch('/api/kyc', {
                method: 'POST',
                body: formData
            });

            // CRITICO: Atrapar el 201 OK INMEDIATAMENTE para evitar fallos de parseo de JSON
            if (res.ok || res.status === 201) {
                toast({
                    title: "Formulario Enviado",
                    description: "Su formulario de Persona Jurídica ha sido enviado con éxito.",
                });
                setDraft(null);
                form.reset(defaultValues);
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
                title: "Error de Validación",
                description: typeof result?.error === 'string' ? result.error : "Ocurrió un error guardando el formulario o subiendo documentos.",
            });
            console.error("KYC Submission Error:", result);
        } catch (error) {
            toast({
                title: "Error de Conexión",
                description: "No se pudo conectar con el servidor para procesar la petición.",
            });
            console.error("Critical submission failed", error);
        }
    };

    const onError = (errors: any) => {
        const firstErrorKey = Object.keys(errors)[0];
        const errorElement = document.querySelector(`[name="${firstErrorKey}"]`);
        
        toast({
            title: "Cuidado, faltan campos",
            description: "Por favor, complete los campos remarcados en rojo para continuar.",
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
            title: "Borrador Guardado",
            description: "Su progreso ha sido guardado localmente.",
        });
    };

    const handleDownload = () => {
        toast({
            title: "Preparando descarga...",
            description: "Su navegador abrirá un diálogo de impresión. Por favor, seleccione 'Guardar como PDF'.",
        });
        setTimeout(() => window.print(), 500);
    };

    const { isSubmitting } = form.formState;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-4 p-6 md:p-8 bg-zinc-950 text-white rounded-lg border border-white/10 shadow-2xl">
                <div className="sticky top-0 z-10 bg-zinc-950/95 backdrop-blur-sm border-b border-white/10 px-6 py-4 -mx-6 md:-mx-8 print:hidden">
                    <div className="flex justify-between items-center text-center text-xs font-medium text-gray-400">
                        {['Datos Generales', 'Socios', 'Representante', 'Económica', 'Docs'].map((step, i) => (
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
                                src="/form-logo.png"
                                alt="Punta Cana Investments"
                                fill
                                style={{ objectFit: 'contain' }}
                                priority
                            />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold uppercase border-b-2 border-black pb-2 mb-4">Formulario de Debida Diligencia - Persona Jurídica / Due Diligence Form - Legal Entity</h1>
                </div>

                <FormSection icon={<Building size={20} />} title="Datos Generales / General Data">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <FormField control={form.control} name="customerCode" render={({ field }) => (<FormItem><FormLabel>Código Cliente / Customer Code *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="date" render={({ field }) => (<FormItem><FormLabel>Fecha / Date *</FormLabel><FormControl><DatePicker field={field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="companyName" render={({ field }) => (<FormItem><FormLabel>Nombre o Razón Social / Company Name or Business Name *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="commercialName" render={({ field }) => (<FormItem><FormLabel>Nombre Comercial / Commercial Name *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="incorporationDate" render={({ field }) => (<FormItem><FormLabel>Fecha de Constitución / Incorporation Date *</FormLabel><FormControl><DatePicker field={field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="constitutionCountry" render={({ field }) => (<FormItem><FormLabel>País de Constitución / Country of Incorporation *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="city" render={({ field }) => (<FormItem><FormLabel>Ciudad / City *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="rnc" render={({ field }) => (<FormItem><FormLabel>Registro Mercantil (RNC) / Commercial Registry (RNC) *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                </FormSection>

                <Separator className="bg-white/10" />

                <FormSection icon={<Users size={20} />} title="Información sobre Socios/Accionistas / Information on Partners/Shareholders">
                    {/* Dyanmic shareholder fields could be added here in future updates as noted in original code */}
                    <div className="p-4 bg-white/5 rounded border border-white/10">
                        <p className="text-sm text-gray-400">Esta sección se implementará con carga dinámica en una futura actualización. Por favor, adjunte la lista de accionistas en la sección de documentos.</p>
                    </div>
                </FormSection>

                <Separator className="bg-white/10" />

                <FormSection icon={<UserCheck size={20} />} title="Datos del Apoderado o Representante Legal / Data of the Attorney-in-Fact or Legal Representative">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <FormField control={form.control} name="legalRepFirstName" render={({ field }) => (<FormItem><FormLabel>Nombres / First Name *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="legalRepLastName" render={({ field }) => (<FormItem><FormLabel>Apellidos / Last Name *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="legalRepId" render={({ field }) => (<FormItem><FormLabel>Número de Identificación / ID Number *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="legalRepBirthDate" render={({ field }) => (<FormItem><FormLabel>Fecha de Nacimiento / Date of Birth *</FormLabel><FormControl><DatePicker field={field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="legalRepAddress" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>Dirección / Address *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="legalRepPhone" render={({ field }) => (<FormItem><FormLabel>Teléfono / Phone *</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="legalRepEmail" render={({ field }) => (<FormItem><FormLabel>Correo Electrónico / Email *</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />

                        <FormField
                            control={form.control}
                            name="legalRepProfession"
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
                        {legalRepProfession === 'otro' && (
                            <FormField control={form.control} name="legalRepProfessionOther" render={({ field }) => (<FormItem><FormLabel>Especifique su profesión / Specify your profession</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        )}

                        <FormField
                            control={form.control}
                            name="legalRepPosition"
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
                        {legalRepPosition === 'otro' && (
                            <FormField control={form.control} name="legalRepPositionOther" render={({ field }) => (<FormItem><FormLabel>Especifique su cargo / Specify your position</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        )}

                        <FormField control={form.control} name="legalRepDesignation" render={({ field }) => (<FormItem><FormLabel>Designación / Designation *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccionar designación / Select designation" /></SelectTrigger></FormControl><SelectContent>
                            <SelectItem value="presidente">Presidente / President</SelectItem>
                            <SelectItem value="vicepresidente">Vicepresidente / Vice President</SelectItem>
                            <SelectItem value="secretario">Secretario / Secretary</SelectItem>
                            <SelectItem value="tesorero">Tesorero / Treasurer</SelectItem>
                            <SelectItem value="director">Director / Director</SelectItem>
                            <SelectItem value="gerente">Gerente / Manager</SelectItem>
                            <SelectItem value="apoderado">Apoderado / Attorney-in-fact</SelectItem>
                            <SelectItem value="miembro_consejo">Miembro del Consejo / Board Member</SelectItem>
                            <SelectItem value="socio_gerente">Socio Gerente / Managing Partner</SelectItem>
                        </SelectContent></Select><FormMessage /></FormItem>)} />
                    </div>
                </FormSection>

                <Separator className="bg-white/10" />

                <FormSection icon={<Banknote size={20} />} title="Información Económica / Economic Information">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <FormField control={form.control} name="averageIncome" render={({ field }) => (<FormItem><FormLabel>Ingresos Promedios Mensuales / Average Monthly Income *</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccionar rango / Select range" /></SelectTrigger></FormControl><SelectContent>
                            <SelectItem value="<100000">Menos de RD$100,000</SelectItem>
                            <SelectItem value="100001-500000">RD$100,001 a 500,000</SelectItem>
                            <SelectItem value="500001-1000000">RD$500,001 a 1,000,000</SelectItem>
                            <SelectItem value="1000001-2500000">RD$1,000,001 a 2,500,000</SelectItem>
                            <SelectItem value="2500001-5000000">RD$2,500,001 a 5,000,000</SelectItem>
                            <SelectItem value=">5000000">Más de RD$5,000,000</SelectItem>
                        </SelectContent></Select><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="annualIncome" render={({ field }) => (<FormItem><FormLabel>Ingreso Anual / Annual Income</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="incomeUSD" render={({ field }) => (<FormItem><FormLabel>Equivalente en USD / Equivalent in USD *</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="fundsOrigin" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>Origen de los Fondos / Source of Funds *</FormLabel><FormControl><Input placeholder="Ej. Ahorros, Salario, Inversiones / e.g. Savings, Salary, Investments" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                </FormSection>

                <Separator className="bg-white/10" />

                <FormSection icon={<Landmark size={20} />} title="Información Política (Vinculación PEP) / Political Information (PEP Affiliation)">
                    <div className="space-y-4">
                        <FormField control={form.control} name="isPEP" render={({ field }) => (<FormItem><FormLabel>¿Es el representante o beneficiario final una Persona Políticamente Expuesta (PEP)? / Is the representative or ultimate beneficial owner a Politically Exposed Person (PEP)? *</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} value={field.value} className="flex items-center gap-4 pt-2"><div className="flex items-center space-x-2"><RadioGroupItem value="si" /><FormLabel className="font-normal text-white">Sí / Yes</FormLabel></div><div className="flex items-center space-x-2"><RadioGroupItem value="no" /><FormLabel className="font-normal text-white">No</FormLabel></div></RadioGroup></FormControl><FormMessage /></FormItem>)} />
                        {isPEP === 'si' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-4 border-t border-dashed border-white/20 mt-4 animate-in fade-in slide-in-from-top-4">
                                <FormField control={form.control} name="pepPosition" render={({ field }) => (<FormItem><FormLabel>Cargo que desempeña / Position held</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="pepInstitution" render={({ field }) => (<FormItem><FormLabel>Institución / Institution</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="pepCountry" render={({ field }) => (<FormItem><FormLabel>País / Country</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            </div>
                        )}
                    </div>
                </FormSection>

                <Separator className="bg-white/10" />

                <FormSection icon={<FileText size={20} />} title="Documentos Requeridos / Required Documents">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FileUpload name="commercialRegistryFile" label="Fotocopia del Registro Mercantil / Copy of Commercial Registry" description="PDF o JPG (máx. 5MB)" />
                        <FileUpload name="legalRepIdFile" label="Fotocopia de la cédula del representante legal / Copy of legal representative's ID" description="PDF o JPG (máx. 5MB)" />
                        <FileUpload name="shareholderAssemblyFile" label="Acta de Asamblea o poder legal / Assembly Minutes or Power of Attorney" description="PDF o JPG (máx. 5MB)" />
                        <FileUpload name="authorizedSignaturesFile" label="Documentos de identificación de firmas autorizadas / ID documents of authorized signatures" description="PDF o JPG (máx. 5MB)" />
                        <FileUpload name="shareholderListFile" label="Nómina de accionistas/socios / List of shareholders/partners" description="PDF o JPG (máx. 5MB)" />
                        <FileUpload name="financialStatementsFile" label="Estados financieros / Financial statements" description="PDF o JPG (máx. 5MB)" />
                    </div>
                </FormSection>

                <Separator className="bg-white/10" />

                <FormSection icon={<CheckCircle size={20} />} title="Declaraciones y Autorización / Declarations and Authorization">
                    <div className="space-y-4">
                        <FormField control={form.control} name="declaration" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={!!field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel className="font-normal text-white">Declaro que la información contenida en este formulario es verdadera, completa y actualizada, y me comprometo a mantenerla actualizada. / I declare that the information in this form is true, complete, and up-to-date, and I commit to keeping it updated. *</FormLabel></div><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="declaration2" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={!!field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none">
                            <FormLabel className="font-normal text-white">
                                <span className="font-bold text-luxury-gold block mb-2">Declaración de Origen Lícito de Fondos y Prevención de Lavado de Activos / Declaration of Lawful Origin of Funds and Prevention of Money Laundering *</span>
                                Declaro y garantizo que los fondos utilizados en la presente operación provienen de actividades lícitas, y que no constituyen ni provendrán, directa o indirectamente, de actos vinculados al lavado de activos, al financiamiento del terrorismo ni de ninguna otra actividad ilícita tipificada por las leyes de la República Dominicana o por convenios internacionales suscritos y ratificados por el país.
                                <br /><br />
                                <span className="italic block mt-1 opacity-80">I declare and guarantee that the funds used in this transaction come from lawful activities, and that they do not constitute nor will they come, directly or indirectly, from acts related to money laundering, financing of terrorism, or any other illicit activity defined by the laws of the Dominican Republic or by international conventions subscribed and ratified by the country.</span>
                                <br /><br />
                                Asimismo, me obligo a cumplir con las disposiciones de la Ley No. 155-17 sobre Lavado de Activos y Financiamiento del Terrorismo, así como con todas las normas reglamentarias vigentes, liberando a la otra parte de cualquier responsabilidad que pudiera derivarse por falsedad en esta declaración.
                            </FormLabel>
                        </div><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="authorization" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={!!field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel className="font-normal text-white">Autorizo expresa e irrevocablemente a PCI a realizar las verificaciones necesarias... / I expressly and irrevocably authorize PCI to carry out the necessary verifications... *</FormLabel></div><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="declaration4" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={!!field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel className="font-normal text-white">Autorizo expresamente compartir información con instituciones financieras y autoridades competentes. / I expressly authorize the sharing of information with financial institutions and competent authorities. *</FormLabel></div><FormMessage /></FormItem>)} />
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
                    <Button type="button" variant="outline" onClick={handleSaveDraft} disabled={isSubmitting} className="border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-black">Guardar Borrador / Save Draft</Button>
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
