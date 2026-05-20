'use client';

import { useState } from 'react';
import ContactForm from '@/components/contact/ContactForm';
import { FaHome, FaChartLine, FaCheckCircle } from 'react-icons/fa';

interface FounderInvestmentFormProps {
    dict: Record<string, any>;
    lang: string;
}

export default function FounderInvestmentForm({ dict, lang }: FounderInvestmentFormProps) {
    const [selectedModality, setSelectedModality] = useState<'unidades' | 'capital' | null>(null);

    const subject = selectedModality === 'unidades' 
        ? "VIP - Inversor de Unidades (Pool Hotelero) Miches"
        : "VIP - Inversor de Capital (Socio Estratégico) Miches";

    return (
        <div className="space-y-8">
            {!selectedModality ? (
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
                    
                    <ContactForm 
                        dict={dict} 
                        lang={lang} 
                        subject={subject} 
                    />
                </div>
            )}
        </div>
    );
}
