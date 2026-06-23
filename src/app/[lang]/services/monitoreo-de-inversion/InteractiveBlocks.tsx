"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";

export default function InteractiveBlocks({ blocks, translations }: any) {
    const [activeBlock, setActiveBlock] = useState<number | null>(null);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (activeBlock !== null) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; }
    }, [activeBlock]);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {blocks.map((block: any, idx: number) => (
                    <div 
                        key={idx}
                        onClick={() => setActiveBlock(idx)}
                        className="group relative aspect-[4/5] cursor-pointer overflow-hidden border border-white/10 hover:border-luxury-gold/50 transition-all duration-500 shadow-xl"
                    >
                        <Image 
                            src={block.image} 
                            alt={block.title} 
                            fill 
                            className="object-cover transform group-hover:scale-110 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent group-hover:from-black/80 transition-all duration-500"></div>
                        <div className="absolute inset-x-0 bottom-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <h3 className="text-xl md:text-2xl font-serif font-bold text-white mb-2 leading-tight">{block.title}</h3>
                            <p className="text-luxury-gold text-xs uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 flex items-center gap-2">
                                <span className="w-4 h-px bg-luxury-gold"></span> {translations.clickToExpand}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {activeBlock !== null && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-12">
                    <div 
                        className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer transition-opacity" 
                        onClick={() => setActiveBlock(null)}
                    ></div>
                    <div className="relative bg-[#0A0A0A] border border-luxury-gold/30 w-full max-w-6xl max-h-full overflow-hidden flex flex-col lg:flex-row shadow-[0_0_50px_rgba(212,175,55,0.15)] animate-fade-in-up">
                        <button 
                            onClick={() => setActiveBlock(null)}
                            className="absolute top-4 right-4 z-20 bg-black/80 border border-white/20 hover:border-luxury-gold hover:text-luxury-gold text-white p-3 rounded-full transition-all"
                        >
                            <FaTimes />
                        </button>
                        
                        <div className="w-full lg:w-2/5 relative h-64 lg:h-auto border-b lg:border-b-0 lg:border-r border-white/10">
                            <Image 
                                src={blocks[activeBlock].image} 
                                alt={blocks[activeBlock].title} 
                                fill 
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent lg:hidden"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0A0A0A] hidden lg:block"></div>
                        </div>
                        
                        <div className="w-full lg:w-3/5 p-6 sm:p-10 lg:p-16 overflow-y-auto max-h-[60vh] lg:max-h-[85vh] custom-scrollbar">
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-luxury-gold mb-8 leading-tight">
                                {blocks[activeBlock].title}
                            </h2>
                            <div className="text-gray-300 space-y-6 text-lg font-light leading-relaxed">
                                {blocks[activeBlock].content}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
