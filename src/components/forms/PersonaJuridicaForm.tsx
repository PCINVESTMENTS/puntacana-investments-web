"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personaJuridicaSchema, type PersonaJuridicaData } from "@/lib/schemas";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { doc, setDoc } from "@/firebase";
import { useFirestore } from "@/firebase";
import { uploadFile } from "@/lib/storage";
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
import { FileUpload } from "./file-upload";
import { SignaturePad } from "./signature-pad";
import { Building, Users, UserCheck, Banknote, FileText, CheckCircle, Pencil, Loader2 } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { sendSubmissionEmail } from "@/lib/actions";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";


const defaultValues: Partial<PersonaJuridicaData> = {
    companyName: "",
    rnc: "",
    legalRepFirstName: "",
    legalRepId: "",
    commercialRegistryFile: undefined,
    legalRepIdFile: undefined,
    shareholderAssemblyFile: undefined,
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

export function PersonaJuridicaForm() {
    const { toast } = useToast();
    const firestore = useFirestore();
    const [draft, setDraft] = useLocalStorage<Partial<PersonaJuridicaData> | null>('persona-juridica-draft', null);

    const form = useForm<PersonaJuridicaData>({
        resolver: zodResolver(personaJuridicaSchema),
        defaultValues: draft || defaultValues,
    });

    useEffect(() => {
        if (draft) {
            form.reset(draft);
            //   toast({
            //     title: "Borrador Cargado",
            //     description: "Se ha cargado un borrador guardado anteriormente.",
            //   });
        }
    }, [draft, form]);

    const legalRepProfession = form.watch('legalRepProfession');
    const legalRepPosition = form.watch('legalRepPosition');

    const onSubmit = (data: PersonaJuridicaData) => {
        // Show immediate feedback
        toast({
            title: "Formulario Enviado",
            description: "Su formulario de Persona Jurídica ha sido enviado con éxito.",
        });

        // Reset form immediately
        setDraft(null);
        form.reset(defaultValues);

        // Perform background tasks
        (async () => {
            const submissionId = crypto.randomUUID();
            const fileFields = ['commercialRegistryFile', 'legalRepIdFile', 'shareholderAssemblyFile', 'authorizedSignaturesFile', 'shareholderListFile', 'financialStatementsFile'];
            const fileUrls: { [key: string]: string } = {};

            try {
                const uploadPromises = fileFields.map(async (field) => {
                    const fileList = data[field as keyof PersonaJuridicaData] as FileList | undefined;
                    if (fileList && fileList.length > 0) {
                        const file = fileList[0];
                        const url = await uploadFile(file, `${submissionId}/${file.name}`);
                        fileUrls[`${field}Url`] = url;
                    }
                });

                await Promise.all(uploadPromises);
            } catch (uploadError) {
                console.error("Error uploading files:", uploadError);
            }

            const submissionData = {
                ...data,
                id: submissionId,
                ...fileUrls,
                formType: 'Persona Jurídica',
                submissionDate: new Date().toISOString(),
                status: 'Pending',
            };

            fileFields.forEach(field => delete (submissionData as any)[field]);

            const docRef = doc(firestore, "personaJuridicaForms", submissionId);

            setDoc(docRef, submissionData)
                .then(() => {
                    sendSubmissionEmail({
                        formType: "Persona Jurídica",
                        customerName: data.companyName,
                        submissionId: submissionId,
                    }).catch(emailError => {
                        console.error("Failed to send submission email:", emailError);
                    });
                })
                .catch((error) => {
                    console.error("Firestore setDoc failed:", error);
                    const permissionError = new FirestorePermissionError({
                        path: docRef.path,
                        operation: 'create',
                        requestResourceData: submissionData,
                    });
                    errorEmitter.emit('permission-error', permissionError);
                });
        })();
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-6 md:p-8 bg-zinc-950 text-white rounded-lg border border-white/10 shadow-2xl">
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

                <div className="print:block hidden mb-8 text-center">
                    <h1 className="text-2xl font-bold uppercase border-b-2 border-black pb-2 mb-4">Formulario de Debida Diligencia - Persona Jurídica</h1>
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
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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

                        <FormField control={form.control} name="legalRepDesignation" render={({ field }) => (<FormItem><FormLabel>Designación / Designation *</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccionar designación / Select designation" /></SelectTrigger></FormControl><SelectContent>
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
                        <FormField control={form.control} name="averageIncome" render={({ field }) => (<FormItem><FormLabel>Ingresos Promedios Mensuales / Average Monthly Income *</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccionar rango / Select range" /></SelectTrigger></FormControl><SelectContent>
                            <SelectItem value="<100000">Menos de RD$100,000</SelectItem>
                            <SelectItem value="100001-500000">RD$100,001 a 500,000</SelectItem>
                            <SelectItem value="500001-1000000">RD$500,001 a 1,000,000</SelectItem>
                            <SelectItem value="1000001-2500000">RD$1,000,001 a 2,500,000</SelectItem>
                            <SelectItem value="2500001-5000000">RD$2,500,001 a 5,000,000</SelectItem>
                            <SelectItem value=">5000000">Más de RD$5,000,000</SelectItem>
                        </SelectContent></Select><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="annualIncome" render={({ field }) => (<FormItem><FormLabel>Ingreso Anual / Annual Income</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="incomeUSD" render={({ field }) => (<FormItem><FormLabel>Equivalente en USD / Equivalent in USD *</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
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
                        <FormField control={form.control} name="declaration" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={!!field.value} onChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel className="font-normal text-white">Declaro que la información contenida en este formulario es verdadera, completa y actualizada, y me comprometo a mantenerla actualizada. / I declare that the information in this form is true, complete, and up-to-date, and I commit to keeping it updated.</FormLabel></div><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="declaration2" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={!!field.value} onChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel className="font-normal text-white">Declaro que los valores declarados como fondos a ser utilizados provienen de una fuente lícita... / I declare that the declared funds to be used come from a lawful source...</FormLabel></div><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="authorization" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={!!field.value} onChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel className="font-normal text-white">Autorizo expresa e irrevocablemente a PCI a realizar las verificaciones necesarias... / I expressly and irrevocably authorize PCI to carry out the necessary verifications...</FormLabel></div><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="declaration4" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={!!field.value} onChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel className="font-normal text-white">Autorizo expresamente compartir información con instituciones financieras y autoridades competentes. / I expressly authorize the sharing of information with financial institutions and competent authorities.</FormLabel></div><FormMessage /></FormItem>)} />
                    </div>
                </FormSection>

                <Separator className="bg-white/10" />

                <FormSection icon={<Pencil size={20} />} title="Firma Digital / Digital Signature">
                    <SignaturePad />
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
