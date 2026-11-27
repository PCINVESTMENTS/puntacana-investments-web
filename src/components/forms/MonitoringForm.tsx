'use client';

import { useActionState, useRef, useEffect, useState, startTransition } from 'react';
import { submitMonitoringForm } from '@/app/actions/monitoring';
import { FormAntispamFields } from '@/components/forms/FormAntispamFields';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaSpinner, FaCheckCircle } from 'react-icons/fa';

interface MonitoringFormProps {
    t: {
        formName: string;
        formEmail: string;
        formPhone: string;
        formCountry: string;
        formProject: string;
        formLocation: string;
        formInvestment: string;
        formDate: string;
        formButton: string;
    };
    lang?: string;
}

interface MonitoringSubmitState {
    success: boolean;
    message: string;
    reference_code?: string;
    crm_inquiry_code?: string;
    deduplicated?: boolean;
    sandbox_isolated?: boolean;
    email_sent?: boolean;
}

const initialState: MonitoringSubmitState = {
    success: false,
    message: '',
    reference_code: '',
    crm_inquiry_code: '',
    deduplicated: false,
    sandbox_isolated: false,
    email_sent: undefined,
};

function getOrCreateMonitoringIdemKey(email: string, project: string): string {
    const cleanEmail = email.trim().toLowerCase();
    const cleanProject = project.trim().toLowerCase().replace(/\s+/g, ' ');
    const storageKey = `pci_monitoring_idem::${cleanEmail}::${cleanProject}`;
    try {
        const existing = sessionStorage.getItem(storageKey);
        if (existing) return existing;
        const created = `cnt-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
        sessionStorage.setItem(storageKey, created);
        return created;
    } catch {
        return `cnt-${cleanEmail}-${cleanProject}`;
    }
}

export default function MonitoringForm({ t, lang = 'es' }: MonitoringFormProps) {
    const [state, formAction, isPending] = useActionState(submitMonitoringForm as any, initialState);
    const [dismissedSuccess, setDismissedSuccess] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const inFlightRef = useRef(false);

    useEffect(() => {
        if (!isPending) {
            inFlightRef.current = false;
        }
    }, [isPending]);

    useEffect(() => {
        if (state.success) {
            setDismissedSuccess(false);
        }
    }, [state]);

    useEffect(() => {
        if (state.success && typeof window !== 'undefined') {
            try {
                if ((window as any).fbq) {
                    (window as any).fbq('track', 'Lead');
                }
                if ((window as any).gtag) {
                    (window as any).gtag('event', 'generate_lead', {
                        currency: 'USD',
                        value: 500
                    });
                }
            } catch (e) {
                console.error("Tracking error:", e);
            }
        }
    }, [state.success]);

    if (state.success && !dismissedSuccess) {
        const refLabel =
            lang === 'fr'
                ? 'Référence de Suivi :'
                : lang === 'en'
                ? 'Tracking Reference:'
                : 'Referencia de Seguimiento:';
        const titleText = state.deduplicated
            ? lang === 'fr'
                ? 'Demande Déjà Enregistrée (Sans Doublon)'
                : lang === 'en'
                ? 'Request Already Registered (No Duplicate)'
                : 'Solicitud Ya Registrada (Sin Duplicar)'
            : lang === 'fr'
            ? 'Demande Reçue !'
            : lang === 'en'
            ? 'Request Received!'
            : '¡Solicitud Recibida!';

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                data-monitoring-confirmation="true"
                data-monitoring-ref={state.reference_code || ''}
                data-monitoring-deduplicated={state.deduplicated ? 'true' : 'false'}
                className="bg-zinc-900 border border-luxury-gold/30 p-8 md:p-12 text-center shadow-2xl relative"
            >
                <div className="absolute top-0 left-0 right-0 h-1 bg-luxury-gold"></div>
                <div className="flex justify-center mb-4 text-luxury-gold">
                    <FaCheckCircle aria-hidden="true" size={48} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-white mb-3">
                    {titleText}
                </h3>
                {state.reference_code && (
                    <div className="inline-flex flex-wrap items-center justify-center gap-2 px-5 py-2 rounded-full bg-luxury-gold/15 border border-luxury-gold/40 text-luxury-gold font-mono text-sm font-bold mb-4">
                        <span>{refLabel}</span>
                        <span data-monitoring-ref-code="true">{state.reference_code}</span>
                    </div>
                )}
                <p className="text-gray-300 max-w-xl mx-auto">
                    {state.reference_code
                        ? lang === 'es'
                            ? `Conserva tu código ${state.reference_code} para dar seguimiento a tu solicitud. Un consultor experto se pondrá en contacto contigo dentro de las próximas 24 horas.`
                            : lang === 'fr'
                            ? `Conservez votre code ${state.reference_code} pour suivre votre demande. Un consultant expert vous contactera dans les prochaines 24 heures.`
                            : `Keep your reference ${state.reference_code} to follow up on your request. An expert consultant will contact you within the next 24 hours.`
                        : lang === 'es'
                        ? 'Un consultor experto se pondrá en contacto contigo dentro de las próximas 24 horas para presentarte una propuesta a la medida.'
                        : lang === 'fr'
                        ? 'Un consultant expert vous contactera dans les prochaines 24 heures pour vous présenter une proposition sur mesure.'
                        : 'An expert consultant will contact you within the next 24 hours to present a customized proposal.'}
                </p>
                {state.sandbox_isolated ? (
                    <p data-monitoring-local-notice="true" className="text-xs text-luxury-gold/90 mt-3 italic">
                        {lang === 'fr'
                            ? 'Environnement Staging simulé : dossier enregistré dans la boîte interne et relié au CRM sans envoi d\'e-mail externe.'
                            : lang === 'en'
                            ? 'Simulated Staging environment: saved in internal inbox and linked to CRM without sending external emails.'
                            : 'Entorno Staging simulado: solicitud guardada en buzón interno y vinculada a M04 sin enviar correos externos.'}
                    </p>
                ) : state.email_sent === true ? (
                    <p data-monitoring-spam-notice="true" className="text-sm text-gray-400 mt-4 italic">
                        {lang === 'es' 
                            ? 'Por favor, revise también su bandeja de correo no deseado (Spam).'
                            : lang === 'fr'
                            ? 'Veuillez également vérifier votre dossier de courrier indésirable (Spam).'
                            : 'Please also check your junk or spam folder.'}
                    </p>
                ) : null}
                <button
                    type="button"
                    data-monitoring-new-btn="true"
                    onClick={() => setDismissedSuccess(true)}
                    className="mt-6 px-6 py-2 bg-transparent border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-black transition-colors rounded-full text-xs uppercase tracking-widest font-bold"
                >
                    {lang === 'fr' ? 'Nouvelle demande' : lang === 'en' ? 'New request' : 'Registrar otra solicitud'}
                </button>
            </motion.div>
        );
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (inFlightRef.current || isPending) return;
        inFlightRef.current = true;
        const formData = new FormData(e.currentTarget);
        const email = String(formData.get('email') || '').trim();
        const project = String(formData.get('project') || '').trim();
        formData.set('idempotency_key', getOrCreateMonitoringIdemKey(email, project));
        startTransition(() => {
            formAction(formData);
        });
    };

    return (
        <form onSubmit={handleSubmit} ref={formRef} className="space-y-6 lg:space-y-8">
            <input type="hidden" name="lang" value={lang} />
            <FormAntispamFields />

            {state.message && !state.success && (
                <div className="p-4 bg-red-900/20 border border-red-500/50 text-red-200 rounded-lg text-sm">
                    {state.message}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="name" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t.formName}</label>
                    <input id="name" type="text" name="name" className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-luxury-gold transition-colors" required />
                </div>
                <div>
                    <label htmlFor="email" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t.formEmail}</label>
                    <input id="email" type="email" name="email" className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-luxury-gold transition-colors" required />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t.formPhone}</label>
                    <input id="phone" type="tel" name="phone" className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-luxury-gold transition-colors" required />
                </div>
                <div>
                    <label htmlFor="country" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t.formCountry}</label>
                    <input id="country" type="text" name="country" className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-luxury-gold transition-colors" required />
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="project" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t.formProject}</label>
                    <input id="project" type="text" name="project" className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-luxury-gold transition-colors" required />
                </div>
                <div>
                    <label htmlFor="location" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t.formLocation}</label>
                    <input id="location" type="text" name="location" className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-luxury-gold transition-colors" required />
                </div>
                <div>
                    <label htmlFor="investment" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t.formInvestment}</label>
                    <input id="investment" type="text" name="investment" placeholder={lang === 'en' ? 'Ex: $150,000 USD' : 'Ej: $150,000 USD'} className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-luxury-gold transition-colors" required />
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="date" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t.formDate}</label>
                    <input id="date" type="text" name="date" placeholder={lang === 'en' ? 'Ex: March 2025' : 'Ej: Marzo 2025'} className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-luxury-gold transition-colors" required />
                </div>
            </div>
            
            <button
                type="submit"
                disabled={isPending}
                className="w-full bg-luxury-gold text-black font-bold uppercase tracking-widest py-5 mt-6 hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
                {isPending ? (
                    <>
                        <FaSpinner aria-hidden="true" className="animate-spin" />
                        {lang === 'en' ? 'SENDING...' : lang === 'fr' ? 'ENVOI EN COURS...' : 'ENVIANDO...'}
                    </>
                ) : (
                    <>
                        <FaPaperPlane aria-hidden="true" className="group-hover:translate-x-1 transition-transform" />
                        {t.formButton}
                    </>
                )}
            </button>
        </form>
    );
}
