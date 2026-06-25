'use client';

import { useState, useActionState, useRef, startTransition } from 'react';
import { submitFounderForm } from '@/app/actions/founder';
import { FaHome, FaChartLine, FaCheckCircle, FaSpinner, FaPaperPlane } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface FounderInvestmentFormProps {
    dict: Record<string, any>;
    lang: string;
}

const initialState = {
    success: false,
    message: '',
};

export default function FounderInvestmentForm({ dict, lang }: FounderInvestmentFormProps) {
    const [selectedModality, setSelectedModality] = useState<'unidades' | 'capital' | null>(null);
    const [state, formAction, isPending] = useActionState(submitFounderForm, initialState);
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(() => {
            formAction(formData);
        });
    };

    return (
        <div className="space-y-8">
            {!selectedModality && !state.success ? (
                <>
                    <h4 className="text-center text-gray-300 mb-6 font-medium tracking-wide uppercase text-sm">
                        Selecciona tu Perfil de Inversión
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Option 1: Unidades */}
                        <button 
                            onClick={() => setSelectedModality('unidades')}
                            className="bg-zinc-900 border border-white/10 hover:border-luxury-gold hover:bg-luxury-gold/5 p-6 rounded-xl text-left transition-all duration-300 group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <FaHome size={64} className="text-luxury-gold" />
                            </div>
                            <div className="relative z-10">
                                <h4 className="text-xl font-bold text-white mb-2 group-hover:text-luxury-gold transition-colors">Inversor de Unidades</h4>
                                <p className="text-luxury-gold text-sm font-bold uppercase tracking-wider mb-3">Pool Hotelero</p>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Adquiere una o múltiples cabañas eco-luxury. Disfruta de tu propiedad y genera ingresos constantes a través de rentas vacacionales administradas profesionalmente.
                                </p>
                            </div>
                        </button>

                        {/* Option 2: Capital */}
                        <button 
                            onClick={() => setSelectedModality('capital')}
                            className="bg-zinc-900 border border-white/10 hover:border-luxury-gold hover:bg-luxury-gold/5 p-6 rounded-xl text-left transition-all duration-300 group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <FaChartLine size={64} className="text-luxury-gold" />
                            </div>
                            <div className="relative z-10">
                                <h4 className="text-xl font-bold text-white mb-2 group-hover:text-luxury-gold transition-colors">Socio de Capital</h4>
                                <p className="text-luxury-gold text-sm font-bold uppercase tracking-wider mb-3">Desarrollo Global</p>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Participa directamente en la rentabilidad general del proyecto desde su fase semilla. Un modelo corporativo diseñado para inversionistas de alto capital.
                                </p>
                            </div>
                        </button>
                    </div>
                </>
            ) : state.success ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-zinc-900 border border-luxury-gold/30 p-8 rounded-xl text-center shadow-2xl"
                >
                    <div className="flex justify-center mb-4 text-luxury-gold">
                        <FaCheckCircle aria-hidden="true" size={48} />
                    </div>
                    <h3 className="text-2xl font-playfair text-white mb-2">¡Solicitud VIP Recibida!</h3>
                    <p className="text-gray-300 mb-2">Te hemos enviado un correo confirmando la recepción de tu solicitud.</p>
                    <p className="text-luxury-gold text-sm font-medium mb-4 italic">Por favor, verifica tu bandeja de Spam o Correo no deseado.</p>
                    <button
                        onClick={() => {
                            setSelectedModality(null);
                            window.location.reload();
                        }}
                        className="mt-6 px-6 py-2 bg-transparent border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-black transition-colors rounded-full"
                    >
                        Volver
                    </button>
                </motion.div>
            ) : (
                <div className="animate-fade-in-up">
                    <div className="mb-8 flex items-center justify-between bg-luxury-gold/10 border border-luxury-gold/30 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                            <FaCheckCircle className="text-luxury-gold text-xl" />
                            <div>
                                <p className="text-sm text-gray-400 uppercase tracking-wider">Perfil Seleccionado</p>
                                <p className="text-white font-bold">
                                    {selectedModality === 'unidades' ? 'Inversor de Unidades (Pool Hotelero)' : 'Socio de Capital (Desarrollo Global)'}
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setSelectedModality(null)}
                            className="text-sm text-luxury-gold hover:text-white underline transition-colors"
                        >
                            Cambiar
                        </button>
                    </div>
                    
                    <form onSubmit={handleSubmit} ref={formRef} className="space-y-6 hs-do-not-track" data-hs-cf-bound="true">
                        <input type="hidden" name="lang" value={lang} />
                        <input type="hidden" name="modality" value={selectedModality || ''} />

                        {state.message && !state.success && (
                            <div className="p-4 bg-red-900/20 border border-red-500/50 text-red-200 rounded-lg text-sm">
                                {state.message}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm uppercase tracking-wider text-luxury-gold">
                                    Nombre Completo
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
                                    Teléfono Móvil
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
                                Correo Electrónico
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
                                Mensaje Opcional / Comentarios
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
                            className="w-full bg-luxury-gold text-black font-semibold py-4 rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isPending ? (
                                <>
                                    <FaSpinner aria-hidden="true" className="animate-spin" />
                                    Procesando Solicitud VIP...
                                </>
                            ) : (
                                <>
                                    <FaPaperPlane aria-hidden="true" className="group-hover:translate-x-1 transition-transform" />
                                    Solicitar Acceso Fundador
                                </>
                            )}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
