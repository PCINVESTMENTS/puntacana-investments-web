'use client';

import { useActionState, useRef, useEffect, startTransition } from 'react';
import { submitMonitoringForm } from '@/app/actions/monitoring';
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

const initialState = {
    success: false,
    message: '',
};

export default function MonitoringForm({ t, lang = 'es' }: MonitoringFormProps) {
    const [state, formAction, isPending] = useActionState(submitMonitoringForm, initialState);
    const formRef = useRef<HTMLFormElement>(null);

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

    if (state.success) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900 border border-luxury-gold/30 p-8 md:p-12 text-center shadow-2xl relative"
            >
                <div className="absolute top-0 left-0 right-0 h-1 bg-luxury-gold"></div>
                <div className="flex justify-center mb-4 text-luxury-gold">
                    <FaCheckCircle aria-hidden="true" size={48} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-white mb-2">
                    {lang === 'es' ? '¡Solicitud Recibida!' : lang === 'fr' ? 'Demande Reçue !' : 'Request Received!'}
                </h3>
                <p className="text-gray-300">
                    {lang === 'es' 
                        ? 'Un consultor experto se pondrá en contacto contigo dentro de las próximas 24 horas para presentarte una propuesta a la medida.' 
                        : lang === 'fr' 
                        ? 'Un consultant expert vous contactera dans les prochaines 24 heures pour vous présenter une proposition sur mesure.' 
                        : 'An expert consultant will contact you within the next 24 hours to present a customized proposal.'}
                </p>
                <p className="text-sm text-gray-400 mt-4 italic">
                    {lang === 'es' 
                        ? 'Por favor, revise también su bandeja de correo no deseado (Spam).'
                        : lang === 'fr'
                        ? 'Veuillez également vérifier votre dossier de courrier indésirable (Spam).'
                        : 'Please also check your junk or spam folder.'}
                </p>
            </motion.div>
        );
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(() => {
            formAction(formData);
        });
    };

    return (
        <form onSubmit={handleSubmit} ref={formRef} className="space-y-6 lg:space-y-8">
            <input type="hidden" name="lang" value={lang} />

            {state.message && !state.success && (
                <div className="p-4 bg-red-900/20 border border-red-500/50 text-red-200 rounded-lg text-sm">
                    {state.message}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t.formName}</label>
                    <input type="text" name="name" className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-luxury-gold transition-colors" required />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t.formEmail}</label>
                    <input type="email" name="email" className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-luxury-gold transition-colors" required />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t.formPhone}</label>
                    <input type="tel" name="phone" className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-luxury-gold transition-colors" required />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t.formCountry}</label>
                    <input type="text" name="country" className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-luxury-gold transition-colors" required />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t.formProject}</label>
                    <input type="text" name="project" className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-luxury-gold transition-colors" required />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t.formLocation}</label>
                    <input type="text" name="location" className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-luxury-gold transition-colors" required />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t.formInvestment}</label>
                    <input type="text" name="investment" placeholder={lang === 'en' ? 'Ex: $150,000 USD' : 'Ej: $150,000 USD'} className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-luxury-gold transition-colors" required />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t.formDate}</label>
                    <input type="text" name="date" placeholder={lang === 'en' ? 'Ex: March 2025' : 'Ej: Marzo 2025'} className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-luxury-gold transition-colors" required />
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
