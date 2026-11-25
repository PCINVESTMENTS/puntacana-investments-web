'use client';

import { useState, useRef } from 'react';
import { FaHome, FaChartLine, FaCheckCircle, FaSpinner, FaPaperPlane, FaExclamationTriangle } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface FounderInvestmentFormProps {
    dict: Record<string, any>;
    lang: string;
}

interface FounderSubmitState {
    success: boolean;
    message: string;
    sequence_number?: string;
    deduplicated?: boolean;
    sandbox_isolated?: boolean;
    email_sent?: boolean;
    canRetry?: boolean;
}

const initialState: FounderSubmitState = {
    success: false,
    message: '',
};

const founderCopy = {
    es: {
        selectProfile: 'Selecciona tu Perfil de Inversión',
        unitsTitle: 'Inversor de Unidades',
        unitsBadge: 'Pool Hotelero',
        unitsDesc: 'Adquiere una o múltiples cabañas eco-luxury. Disfruta de tu propiedad y genera ingresos constantes a través de rentas vacacionales administradas profesionalmente.',
        capitalTitle: 'Socio de Capital',
        capitalBadge: 'Desarrollo Global',
        capitalDesc: 'Participa directamente en la rentabilidad general del proyecto desde su fase semilla. Un modelo corporativo diseñado para inversionistas de alto capital.',
        selectedProfile: 'Perfil Seleccionado',
        unitsSelected: 'Inversor de Unidades (Pool Hotelero)',
        capitalSelected: 'Socio de Capital (Desarrollo Global)',
        change: 'Cambiar',
        fullName: 'Nombre Completo',
        phone: 'Teléfono Móvil',
        email: 'Correo Electrónico',
        message: 'Mensaje Opcional / Comentarios',
        processing: 'Procesando Solicitud VIP...',
        submit: 'Solicitar Acceso Fundador',
        retryBtn: 'Reintentar envío sin duplicar',
        successTitle: '¡Solicitud VIP Recibida!',
        dedupTitle: 'Solicitud Ya Registrada (Sin Duplicar)',
        refLabel: 'Código de Referencia:',
        localNotice: 'Modo local aislado: registro verificado en el buzón interno sin enviar correos externos.',
        prodEmailNotice: 'Te hemos enviado un correo confirmando la recepción de tu solicitud. Verifica tu carpeta de Spam si no lo ves.',
        networkError: 'Se perdió la respuesta de red antes de confirmar. Puedes reintentar de forma segura: tu código de idempotencia evita registros duplicados.',
        back: 'Volver',
    },
    en: {
        selectProfile: 'Select Your Investment Profile',
        unitsTitle: 'Unit Investor',
        unitsBadge: 'Hotel Rental Pool',
        unitsDesc: 'Acquire one or multiple eco-luxury villas. Enjoy your property and generate steady income through professionally managed vacation rentals.',
        capitalTitle: 'Capital Partner',
        capitalBadge: 'Master Development',
        capitalDesc: 'Participate directly in the overall profitability of the project from its seed phase. A corporate model built for high-capital investors.',
        selectedProfile: 'Selected Profile',
        unitsSelected: 'Unit Investor (Hotel Rental Pool)',
        capitalSelected: 'Capital Partner (Master Development)',
        change: 'Change',
        fullName: 'Full Name',
        phone: 'Mobile Phone',
        email: 'Email Address',
        message: 'Optional Message / Comments',
        processing: 'Processing VIP Request...',
        submit: 'Request Founder Access',
        retryBtn: 'Retry Safely (No Duplicate)',
        successTitle: 'VIP Request Received!',
        dedupTitle: 'Request Already Registered (No Duplicate)',
        refLabel: 'Reference Code:',
        localNotice: 'Isolated local mode: saved in internal sandbox inbox without sending external emails.',
        prodEmailNotice: 'We sent you a confirmation email. Please check your Spam folder if you do not see it.',
        networkError: 'Network response was lost before confirmation. You can retry safely — your idempotency key prevents duplicate records.',
        back: 'Back',
    },
    fr: {
        selectProfile: 'Sélectionnez Votre Profil d\'Investissement',
        unitsTitle: 'Investisseur d\'Unités',
        unitsBadge: 'Pool Hôtelier',
        unitsDesc: 'Acquérez une ou plusieurs villas éco-luxe. Profitez de votre propriété et générez des revenus réguliers grâce à la location saisonnière gérée professionnellement.',
        capitalTitle: 'Partenaire en Capital',
        capitalBadge: 'Développement Global',
        capitalDesc: 'Participez directement à la rentabilité globale du projet dès sa phase d\'amorçage. Un modèle structuré pour les investisseurs institutionnels et privés.',
        selectedProfile: 'Profil Sélectionné',
        unitsSelected: 'Investisseur d\'Unités (Pool Hôtelier)',
        capitalSelected: 'Partenaire en Capital (Développement Global)',
        change: 'Modifier',
        fullName: 'Nom Complet',
        phone: 'Téléphone Mobile',
        email: 'Adresse E-mail',
        message: 'Message Optionnel / Commentaires',
        processing: 'Traitement de la Demande VIP...',
        submit: 'Demander l\'Accès Fondateur',
        retryBtn: 'Réessayer sans doublon',
        successTitle: 'Demande VIP Reçue !',
        dedupTitle: 'Demande Déjà Enregistrée (Sans Doublon)',
        refLabel: 'Code de Référence :',
        localNotice: 'Mode local isolé : dossier enregistré dans la boîte interne sans envoi d\'e-mail externe.',
        prodEmailNotice: 'Un e-mail de confirmation vous a été envoyé. Veuillez vérifier vos courriers indésirables.',
        networkError: 'La réponse réseau a été interrompue avant confirmation. Vous pouvez réessayer sans risque : la clé d\'idempotence empêche tout doublon.',
        back: 'Retour',
    },
};

function getOrCreateIdempotencyKey(email: string, modality: string): string {
    const cleanEmail = email.trim().toLowerCase();
    const storageKey = `pci_founder_idem::${cleanEmail}::${modality}`;
    try {
        const existing = sessionStorage.getItem(storageKey);
        if (existing) return existing;
        const created = `fnd-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
        sessionStorage.setItem(storageKey, created);
        return created;
    } catch {
        return `fnd-${cleanEmail}-${modality}`;
    }
}

export default function FounderInvestmentForm({ lang }: FounderInvestmentFormProps) {
    const l = (lang === 'en' || lang === 'fr' ? lang : 'es') as 'es' | 'en' | 'fr';
    const c = founderCopy[l];

    const [selectedModality, setSelectedModality] = useState<'unidades' | 'capital' | null>(null);
    const [state, setState] = useState<FounderSubmitState>(initialState);
    const [isPending, setIsPending] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    // Synchronous guard prevents rapid double-clicks BEFORE React re-renders disabled state
    const inFlightRef = useRef(false);
    const pendingKeyRef = useRef<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (inFlightRef.current) return;
        inFlightRef.current = true;
        setIsPending(true);

        const formData = new FormData(e.currentTarget);
        const name = String(formData.get('name') || '').trim();
        const email = String(formData.get('email') || '').trim();
        const phone = String(formData.get('phone') || '').trim();
        const message = String(formData.get('message') || '').trim();
        const modality = selectedModality || String(formData.get('modality') || 'unidades');

        const idemKey = pendingKeyRef.current || getOrCreateIdempotencyKey(email, modality);
        pendingKeyRef.current = idemKey;

        try {
            const res = await fetch('/api/founder-leads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Idempotency-Key': idemKey,
                },
                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    message,
                    modality,
                    lang: l,
                    project_slug: 'miches-eco-resort',
                    idempotency_key: idemKey,
                }),
            });

            const data = await res.json().catch(() => ({}));
            if (res.ok && data?.success) {
                pendingKeyRef.current = null;
                setState({
                    success: true,
                    message: data.message || c.successTitle,
                    sequence_number: data.sequence_number,
                    deduplicated: Boolean(data.deduplicated),
                    sandbox_isolated: Boolean(data.sandbox_isolated),
                    email_sent: Boolean(data.email_sent),
                });
            } else {
                setState({
                    success: false,
                    message: data?.message || c.networkError,
                    canRetry: true,
                });
            }
        } catch {
            // Preserve pendingKeyRef so immediate retry sends the exact same idempotency key
            setState({
                success: false,
                message: c.networkError,
                canRetry: true,
            });
        } finally {
            inFlightRef.current = false;
            setIsPending(false);
        }
    };

    return (
        <div className="space-y-8">
            {!selectedModality && !state.success ? (
                <>
                    <h4 className="text-center text-gray-300 mb-6 font-medium tracking-wide uppercase text-sm">
                        {c.selectProfile}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <button
                            type="button"
                            data-founder-modality="unidades"
                            onClick={() => setSelectedModality('unidades')}
                            className="bg-zinc-900 border border-white/10 hover:border-luxury-gold hover:bg-luxury-gold/5 p-6 rounded-xl text-left transition-all duration-300 group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <FaHome size={64} className="text-luxury-gold" />
                            </div>
                            <div className="relative z-10">
                                <h4 className="text-xl font-bold text-white mb-2 group-hover:text-luxury-gold transition-colors">{c.unitsTitle}</h4>
                                <p className="text-luxury-gold text-sm font-bold uppercase tracking-wider mb-3">{c.unitsBadge}</p>
                                <p className="text-gray-400 text-sm leading-relaxed">{c.unitsDesc}</p>
                            </div>
                        </button>

                        <button
                            type="button"
                            data-founder-modality="capital"
                            onClick={() => setSelectedModality('capital')}
                            className="bg-zinc-900 border border-white/10 hover:border-luxury-gold hover:bg-luxury-gold/5 p-6 rounded-xl text-left transition-all duration-300 group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <FaChartLine size={64} className="text-luxury-gold" />
                            </div>
                            <div className="relative z-10">
                                <h4 className="text-xl font-bold text-white mb-2 group-hover:text-luxury-gold transition-colors">{c.capitalTitle}</h4>
                                <p className="text-luxury-gold text-sm font-bold uppercase tracking-wider mb-3">{c.capitalBadge}</p>
                                <p className="text-gray-400 text-sm leading-relaxed">{c.capitalDesc}</p>
                            </div>
                        </button>
                    </div>
                </>
            ) : state.success ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    data-founder-confirmation="true"
                    data-founder-deduplicated={state.deduplicated ? 'true' : 'false'}
                    data-founder-sequence={state.sequence_number || ''}
                    className="bg-zinc-900 border border-luxury-gold/30 p-8 rounded-xl text-center shadow-2xl"
                >
                    <div className="flex justify-center mb-4 text-luxury-gold">
                        <FaCheckCircle aria-hidden="true" size={48} />
                    </div>
                    <h3 className="text-2xl font-playfair text-white mb-2">
                        {state.deduplicated ? c.dedupTitle : c.successTitle}
                    </h3>
                    {state.sequence_number && (
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-luxury-gold/15 border border-luxury-gold/40 text-luxury-gold font-mono text-sm font-bold mb-4">
                            <span>{c.refLabel}</span>
                            <span data-founder-ref-code="true">{state.sequence_number}</span>
                        </div>
                    )}
                    <p className="text-gray-200 mb-3 max-w-xl mx-auto">{state.message}</p>
                    <p className="text-luxury-gold/90 text-xs font-medium mb-4 italic">
                        {state.sandbox_isolated || state.email_sent === false ? c.localNotice : c.prodEmailNotice}
                    </p>
                    <button
                        type="button"
                        onClick={() => {
                            setState(initialState);
                            setSelectedModality(null);
                            pendingKeyRef.current = null;
                        }}
                        className="mt-4 px-6 py-2 bg-transparent border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-black transition-colors rounded-full"
                    >
                        {c.back}
                    </button>
                </motion.div>
            ) : (
                <div className="animate-fade-in-up">
                    <div className="mb-8 flex items-center justify-between bg-luxury-gold/10 border border-luxury-gold/30 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                            <FaCheckCircle className="text-luxury-gold text-xl" />
                            <div>
                                <p className="text-sm text-gray-400 uppercase tracking-wider">{c.selectedProfile}</p>
                                <p className="text-white font-bold">
                                    {selectedModality === 'unidades' ? c.unitsSelected : c.capitalSelected}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setSelectedModality(null)}
                            className="text-sm text-luxury-gold hover:text-white underline transition-colors"
                        >
                            {c.change}
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} ref={formRef} className="space-y-6 hs-do-not-track" data-hs-cf-bound="true">
                        <input type="hidden" name="lang" value={l} />
                        <input type="hidden" name="modality" value={selectedModality || ''} />

                        {state.message && !state.success && (
                            <div
                                data-founder-error="true"
                                className="p-4 bg-amber-950/50 border border-amber-500/50 text-amber-200 rounded-lg text-sm flex items-start gap-3"
                            >
                                <FaExclamationTriangle className="shrink-0 mt-0.5 text-amber-400" />
                                <span>{state.message}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm uppercase tracking-wider text-luxury-gold">
                                    {c.fullName}
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-luxury-gold rounded-lg px-4 py-3 text-white placeholder-zinc-600 outline-none transition-colors"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-sm uppercase tracking-wider text-luxury-gold">
                                    {c.phone}
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    required
                                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-luxury-gold rounded-lg px-4 py-3 text-white placeholder-zinc-600 outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm uppercase tracking-wider text-luxury-gold">
                                {c.email}
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                className="w-full bg-zinc-900 border border-zinc-800 focus:border-luxury-gold rounded-lg px-4 py-3 text-white placeholder-zinc-600 outline-none transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm uppercase tracking-wider text-luxury-gold">
                                {c.message}
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                rows={4}
                                className="w-full bg-zinc-900 border border-zinc-800 focus:border-luxury-gold rounded-lg px-4 py-3 text-white placeholder-zinc-600 outline-none transition-colors resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            data-founder-submit="true"
                            className="w-full bg-luxury-gold text-black font-semibold py-4 rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isPending ? (
                                <>
                                    <FaSpinner aria-hidden="true" className="animate-spin" />
                                    {c.processing}
                                </>
                            ) : (
                                <>
                                    <FaPaperPlane aria-hidden="true" className="group-hover:translate-x-1 transition-transform" />
                                    {state.canRetry ? c.retryBtn : c.submit}
                                </>
                            )}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
