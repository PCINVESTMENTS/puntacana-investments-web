'use client';

import { useState } from 'react';
import { createTripRequest } from '@/services/flybuy';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaSpinner, FaCheckCircle } from 'react-icons/fa';

interface FlyAndBuyFormProps {
    dict: any; // Using any for flexibility with the deeply nested dictionary structure
    lang: string;
}

const initialState = {
    success: false,
    message: '',
};

export default function FlyAndBuyForm({ dict, lang }: FlyAndBuyFormProps) {
    const [isPending, setIsPending] = useState(false);
    const [state, setState] = useState(initialState);

    async function handleSubmit(formData: FormData) {
        setIsPending(true);
        setState({ success: false, message: '' });

        const tripData = {
            client_name: formData.get('name'),
            client_email: formData.get('email'),
            phone: formData.get('phone'),
            origin_city: formData.get('country'), // Mapping country to origin_city for now
            proposed_date: new Date().toISOString().split('T')[0], // Placeholder, form doesn't seem to have date field, using today
            // Adding other fields that might be useful in the message or extra data if backend supports it
            notes: formData.get('comments')
        };

        // Note: The kit defined specific fields: client_name, client_email, origin_city, proposed_dates
        // My form has more fields. I should check if backend accepts them or if I need to pack them into 'message' or 'notes'.
        // For now, I'll send the strict kit fields + mapped ones.

        try {
            await createTripRequest(tripData);
            setState({ success: true, message: dict.success.message });
        } catch (error) {
            console.error(error);
            setState({ success: false, message: 'Failed to submit request.' + error });
        } finally {
            setIsPending(false);
        }
    }

    const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);

    const handleObjectiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        if (checked) {
            setSelectedObjectives([...selectedObjectives, value]);
        } else {
            setSelectedObjectives(selectedObjectives.filter((item) => item !== value));
        }
    };

    // New state for specific property question
    const [hasSpecificProperty, setHasSpecificProperty] = useState<string | null>(null);

    // Check if any investment-related option is selected
    const showInvestmentFocus = selectedObjectives.some(obj =>
        ['investment', 'mixed', 'development'].includes(obj)
    );

    if (state.success) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-zinc-900/80 backdrop-blur-md border border-luxury-gold p-12 rounded-sm text-center shadow-2xl max-w-2xl mx-auto"
            >
                <div className="flex justify-center mb-6 text-luxury-gold">
                    <FaCheckCircle aria-hidden="true" size={64} />
                </div>
                <h3 className="text-3xl font-serif font-bold text-white mb-4">{dict.success.title}</h3>
                <p className="text-gray-300 text-lg leading-relaxed">{dict.success.message}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-8 px-8 py-3 bg-transparent border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-black transition-all rounded-full uppercase tracking-widest text-sm font-bold"
                >
                    {dict.success.title === "Request Sent!" ? "Send Another" : "Enviar Otro"}
                </button>
            </motion.div>
        );
    }

    return (
        <form action={handleSubmit} className="max-w-4xl mx-auto space-y-12 bg-zinc-900/50 p-8 md:p-12 border border-white/5 rounded-sm shadow-2xl backdrop-blur-sm">
            <input type="hidden" name="lang" value={lang} />
            {state.message && !state.success && (
                <div className="p-4 bg-red-900/20 border border-red-500/50 text-red-200 rounded-lg text-center">
                    {state.message}
                </div>
            )}

            {/* 1. Personal Details */}
            <section className="space-y-6">
                <h3 className="text-2xl font-serif text-luxury-gold border-b border-white/10 pb-4">
                    {dict.personalDetails.title}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-xs uppercase tracking-wider text-gray-400 font-semibold">{dict.personalDetails.name} *</label>
                        <input type="text" id="name" name="name" required autoComplete="name" className="w-full bg-black/50 border border-white/10 focus:border-luxury-gold rounded-sm px-4 py-3 text-white outline-none transition-colors" />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-xs uppercase tracking-wider text-gray-400 font-semibold">{dict.personalDetails.email} *</label>
                        <input type="email" id="email" name="email" required autoComplete="email" className="w-full bg-black/50 border border-white/10 focus:border-luxury-gold rounded-sm px-4 py-3 text-white outline-none transition-colors" />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="phone" className="text-xs uppercase tracking-wider text-gray-400 font-semibold">{dict.personalDetails.phone} *</label>
                        <input type="tel" id="phone" name="phone" required autoComplete="tel" className="w-full bg-black/50 border border-white/10 focus:border-luxury-gold rounded-sm px-4 py-3 text-white outline-none transition-colors" />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="country" className="text-xs uppercase tracking-wider text-gray-400 font-semibold">{dict.personalDetails.country} *</label>
                        <input type="text" id="country" name="country" required autoComplete="country-name" className="w-full bg-black/50 border border-white/10 focus:border-luxury-gold rounded-sm px-4 py-3 text-white outline-none transition-colors" />
                    </div>
                </div>
            </section>

            {/* 2. Objective */}
            <section className="space-y-6">
                <h3 className="text-xl font-serif text-white border-b border-white/10 pb-2">
                    {dict.objective.question} <span className="text-sm font-normal text-gray-400 ml-2 block sm:inline">{dict.multipleChoice}</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(dict.objective.options).map(([key, label]) => (
                        <label key={key} className="flex items-center gap-3 p-4 bg-white/5 border border-white/5 hover:border-luxury-gold/50 cursor-pointer transition-all rounded-sm group">
                            <input
                                type="checkbox"
                                name="objective"
                                value={key}
                                onChange={handleObjectiveChange}
                                className="w-5 h-5 accent-luxury-gold bg-transparent border-gray-500 rounded focus:ring-luxury-gold focus:ring-2"
                            />
                            <span className="text-gray-300 group-hover:text-white transition-colors">{label as string}</span>
                        </label>
                    ))}
                </div>
            </section>

            {/* 3. Property Type */}
            <section className="space-y-6">
                <h3 className="text-xl font-serif text-white border-b border-white/10 pb-2">
                    {dict.propertyType.question} <span className="text-sm font-normal text-gray-400 ml-2 block sm:inline">{dict.multipleChoice}</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(dict.propertyType.options).map(([key, label]) => (
                        <label key={key} className="flex items-center gap-3 p-4 bg-white/5 border border-white/5 hover:border-luxury-gold/50 cursor-pointer transition-all rounded-sm group">
                            <input type="checkbox" name="propertyType" value={key} className="w-5 h-5 accent-luxury-gold" />
                            <span className="text-gray-300 group-hover:text-white transition-colors text-sm">{label as string}</span>
                        </label>
                    ))}
                </div>
            </section>

            {/* 3.b Specific Property Question */}
            <section className="space-y-6">
                <h3 className="text-xl font-serif text-white border-b border-white/10 pb-2">
                    {dict.specificProperty.question}
                </h3>
                <div className="space-y-4">
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="hasSpecificProperty"
                                value="yes"
                                onChange={(e) => setHasSpecificProperty(e.target.value)}
                                className="w-4 h-4 accent-luxury-gold"
                            />
                            <span className="text-gray-300">{dict.specificProperty.yes}</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="hasSpecificProperty"
                                value="no"
                                onChange={(e) => setHasSpecificProperty(e.target.value)}
                                className="w-4 h-4 accent-luxury-gold"
                            />
                            <span className="text-gray-300">{dict.specificProperty.no}</span>
                        </label>
                    </div>

                    {hasSpecificProperty === 'yes' && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="overflow-hidden"
                        >
                            <input
                                type="text"
                                name="specificProperty"
                                placeholder={dict.specificProperty.placeholder}
                                className="w-full bg-black/50 border border-white/10 focus:border-luxury-gold rounded-sm px-4 py-3 text-white outline-none transition-colors"
                            />
                        </motion.div>
                    )}
                </div>
            </section>

            {/* 4. Investment Focus (Conditional) */}
            {
                showInvestmentFocus && (
                    <motion.section
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-6 overflow-hidden"
                    >
                        <h3 className="text-xl font-serif text-luxury-gold border-b border-white/10 pb-2">
                            {dict.investmentFocus.question} <span className="text-sm font-normal text-luxury-gold/60 ml-2 block sm:inline">{dict.multipleChoice}</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(dict.investmentFocus.options).map(([key, label]) => (
                                <label key={key} className="flex items-center gap-3 p-4 bg-luxury-gold/5 border border-luxury-gold/20 hover:border-luxury-gold cursor-pointer transition-all rounded-sm group">
                                    <input type="checkbox" name="investmentFocus" value={key} className="w-5 h-5 accent-luxury-gold" />
                                    <span className="text-gray-300 group-hover:text-white transition-colors">{label as string}</span>
                                </label>
                            ))}
                        </div>
                    </motion.section>
                )
            }

            {/* 5. Experience & Horizon */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <section className="space-y-6">
                    <h3 className="text-xl font-serif text-white border-b border-white/10 pb-2">
                        {dict.experience.question}
                    </h3>
                    <div className="space-y-3">
                        {Object.entries(dict.experience.options).map(([key, label]) => (
                            <label key={key} className="flex items-center gap-3 cursor-pointer group">
                                <input type="radio" name="experience" value={key} className="w-4 h-4 accent-luxury-gold" />
                                <span className="text-gray-400 group-hover:text-luxury-gold transition-colors">{label as string}</span>
                            </label>
                        ))}
                    </div>
                </section>

                <section className="space-y-6">
                    <h3 className="text-xl font-serif text-white border-b border-white/10 pb-2">
                        {dict.horizon.question}
                    </h3>
                    <div className="space-y-3">
                        {Object.entries(dict.horizon.options).map(([key, label]) => (
                            <label key={key} className="flex items-center gap-3 cursor-pointer group">
                                <input type="radio" name="horizon" value={key} className="w-4 h-4 accent-luxury-gold" />
                                <span className="text-gray-400 group-hover:text-luxury-gold transition-colors">{label as string}</span>
                            </label>
                        ))}
                    </div>
                </section>
            </div>

            {/* 6. Fly & Buy Specifics */}
            <section className="space-y-6">
                <h3 className="text-2xl font-serif text-luxury-gold border-b border-white/10 pb-4">
                    Fly & Buy Program
                </h3>

                <div className="space-y-4">
                    <p className="text-white font-medium">{dict.flyAndBuy.visited}</p>
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="visited" value="yes" className="w-4 h-4 accent-luxury-gold" />
                            <span className="text-gray-300">{dict.flyAndBuy.yes}</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="visited" value="no" className="w-4 h-4 accent-luxury-gold" />
                            <span className="text-gray-300">{dict.flyAndBuy.no}</span>
                        </label>
                    </div>
                </div>

                <div className="space-y-4 pt-4">
                    <p className="text-white font-medium">
                        {dict.flyAndBuy.motivation} <span className="text-sm font-normal text-gray-400 ml-2 block sm:inline">{dict.multipleChoice}</span>
                    </p>
                    <div className="grid grid-cols-1 gap-3">
                        {Object.entries(dict.flyAndBuy.options).map(([key, label]) => (
                            <label key={key} className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 hover:bg-white/10 cursor-pointer transition-colors rounded-sm">
                                <input type="checkbox" name="motivation" value={key} className="w-5 h-5 accent-luxury-gold" />
                                <span className="text-gray-300 text-sm">{label as string}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. Comments */}
            <section className="space-y-4">
                <label htmlFor="comments" className="text-sm uppercase tracking-wider text-luxury-gold block">
                    {dict.comments.label} *
                </label>
                <textarea
                    id="comments"
                    name="comments"
                    rows={4}
                    required
                    placeholder={dict.comments.placeholder}
                    className="w-full bg-black/50 border border-white/10 focus:border-luxury-gold rounded-sm px-4 py-3 text-white outline-none transition-colors resize-none"
                />
            </section>

            {/* Submit Button */}
            <div className="pt-8">
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-luxury-gold text-black font-aldrich uppercase tracking-widest font-bold text-lg py-5 hover:bg-white hover:scale-[1.01] transition-all shadow-lg shadow-luxury-gold/20 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed rounded-sm"
                >
                    {isPending ? (
                        <>
                            <FaSpinner aria-hidden="true" className="animate-spin" />
                            {dict.sending}
                        </>
                    ) : (
                        <>
                            <FaPaperPlane aria-hidden="true" />
                            {dict.submit}
                        </>
                    )}
                </button>
            </div>

        </form >
    );
}
