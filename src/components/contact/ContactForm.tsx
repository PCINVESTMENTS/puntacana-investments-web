'use client';

import { useActionState, useRef, useEffect } from 'react';
import { submitContactForm } from '@/app/actions/contact';
import { FormAntispamFields } from '@/components/forms/FormAntispamFields';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaSpinner, FaCheckCircle } from 'react-icons/fa';

interface ContactFormProps {
    dict: {
        name: string;
        phone: string;
        email: string;
        message: string;
        send: string;
        sending: string;
        success: string;
        successText: string;
        placeholders: {
            name: string;
            email: string;
            message: string;
        };
    };
    subject?: string;
    className?: string; // Allow custom styling
    lang?: string;
    propertyData?: string;
}

const initialState = {
    success: false,
    message: '',
};

export default function ContactForm({ dict, subject, className, lang = 'en', propertyData }: ContactFormProps) {
    const [state, formAction, isPending] = useActionState(submitContactForm, initialState);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state.success && typeof window !== 'undefined') {
            try {
                // Meta Pixel Conversion
                if ((window as any).fbq) {
                    (window as any).fbq('track', 'Lead');
                }
                // Google Ads / Analytics Conversion
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

    // No client-side handleSubmit needed, formAction handles it

    if (state.success) {
        const refCode = (state as any).reference_code as string | undefined;
        const isSandbox = Boolean((state as any).sandbox_isolated);
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                data-contact-confirmation="true"
                className="bg-zinc-900 border border-luxury-gold/30 p-8 rounded-xl text-center shadow-2xl"
            >
                <div className="flex justify-center mb-4 text-luxury-gold">
                    <FaCheckCircle aria-hidden="true" size={48} />
                </div>
                <h3 className="text-2xl font-playfair text-white mb-2">{dict.success}</h3>
                {refCode && (
                    <div
                        data-contact-ref-code={refCode}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-luxury-gold/15 border border-luxury-gold/40 text-luxury-gold font-mono text-xs font-bold mb-3"
                    >
                        <span>{lang === 'es' ? 'Referencia:' : lang === 'fr' ? 'Référence :' : 'Reference:'}</span>
                        <span>{refCode}</span>
                    </div>
                )}
                <p className="text-gray-300">
                    {isSandbox && state.message ? state.message : dict.successText}
                </p>
                <p className="text-sm text-gray-400 mt-4 italic">
                    {isSandbox
                        ? lang === 'es'
                            ? 'Modo local aislado: visible de inmediato en el Buzón Local de Pruebas del Dashboard (0 correos reales enviados).'
                            : lang === 'fr'
                            ? 'Mode local isolé : visible immédiatement dans la boîte de test du Dashboard (0 e-mail réel envoyé).'
                            : 'Isolated local mode: visible immediately in the Dashboard Local Test Inbox (0 real emails sent).'
                        : lang === 'es' 
                        ? 'Por favor, revise también su bandeja de correo no deseado (Spam).'
                        : lang === 'fr'
                        ? 'Veuillez également vérifier votre dossier de courrier indésirable (Spam).'
                        : 'Please also check your junk or spam folder.'}
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-6 px-6 py-2 bg-transparent border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-black transition-colors rounded-full"
                >
                    {lang === 'es' ? 'Enviar otro mensaje' : lang === 'fr' ? 'Envoyer un autre message' : 'Send another message'}
                </button>
            </motion.div>
        );
    }

    return (
        <form action={formAction} ref={formRef} className={`space-y-6 ${className || ''}`}>
            {subject && <input type="hidden" name="subject" value={subject} />}
            <input type="hidden" name="lang" value={lang} />
            {propertyData && <input type="hidden" name="propertyData" value={propertyData} />}
            <FormAntispamFields />

            {state.message && !state.success && (
                <div className="p-4 bg-red-900/20 border border-red-500/50 text-red-200 rounded-lg text-sm">
                    {state.message}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm uppercase tracking-wider text-luxury-gold">
                        {dict.name}
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder={dict.placeholders.name}
                        required
                        autoComplete="name"
                        className="w-full bg-zinc-900 border border-zinc-800 focus:border-luxury-gold rounded-lg px-4 py-3 text-white placeholder-zinc-600 outline-none transition-colors"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm uppercase tracking-wider text-luxury-gold">
                        {dict.phone}
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="+1 (555) 000-0000"
                        autoComplete="tel"
                        required
                        className="w-full bg-zinc-900 border border-zinc-800 focus:border-luxury-gold rounded-lg px-4 py-3 text-white placeholder-zinc-600 outline-none transition-colors"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="email" className="text-sm uppercase tracking-wider text-luxury-gold">
                    {dict.email}
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder={dict.placeholders.email}
                    required
                    autoComplete="email"
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-luxury-gold rounded-lg px-4 py-3 text-white placeholder-zinc-600 outline-none transition-colors"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="message" className="text-sm uppercase tracking-wider text-luxury-gold">
                    {dict.message}
                </label>
                <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder={dict.placeholders.message}
                    required
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-luxury-gold rounded-lg px-4 py-3 text-white placeholder-zinc-600 outline-none transition-colors resize-none"
                />
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full bg-luxury-gold text-black font-semibold py-4 rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isPending ? (
                    <>
                        <FaSpinner aria-hidden="true" className="animate-spin" />
                        {dict.sending}
                    </>
                ) : (
                    <>
                        <FaPaperPlane aria-hidden="true" className="group-hover:translate-x-1 transition-transform" />
                        {dict.send}
                    </>
                )}
            </button>
        </form>
    );
}
