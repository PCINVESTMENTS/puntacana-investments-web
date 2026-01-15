"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import { FaRobot, FaTimes, FaPaperPlane, FaCommentDots } from "react-icons/fa";
import ReactMarkdown from 'react-markdown';

interface ChatBotProps {
    lang: string;
}

export default function ChatBot({ lang }: ChatBotProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: '/api/chat',
        initialMessages: [
            {
                id: 'welcome',
                role: 'assistant',
                content: lang === 'es'
                    ? '¡Hola! Bienvenido a Punta Cana Investments. ¿Cómo te puedo ayudar hoy?'
                    : 'Hello! Welcome to Punta Cana Investments. How can I help you today?'
            }
        ]
    });
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Customize renderer to style links
    const components = {
        a: ({ node, ...props }: any) => (
            <a {...props} className="text-luxury-gold underline hover:text-white font-bold" target="_blank" rel="noopener noreferrer" />
        )
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-50 bg-luxury-gold text-black p-4 rounded-full shadow-2xl hover:bg-white transition-all duration-300 transform hover:scale-110 flex items-center justify-center border-2 border-primary-black ${isOpen ? 'rotate-90' : 'rotate-0'}`}
                aria-label="Toggle Chat"
            >
                {isOpen ? <FaTimes className="text-xl" /> : <FaRobot className="text-2xl" />}
            </button>

            {/* Chat Window */}
            <div
                className={`fixed bottom-24 right-6 z-50 w-[90vw] md:w-[400px] h-[500px] bg-primary-black/95 backdrop-blur-md border border-luxury-gold/30 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 origin-bottom-right ${isOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-90 translate-y-10 invisible'
                    }`}
            >
                {/* Header */}
                <div className="bg-luxury-gold/10 p-4 rounded-t-2xl border-b border-white/10 flex items-center gap-3">
                    <div className="w-10 h-10 bg-luxury-gold rounded-full flex items-center justify-center text-black">
                        <FaRobot className="text-xl" />
                    </div>
                    <div>
                        <h3 className="text-luxury-gold font-bold font-serif text-lg">PCI Assistant</h3>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Online
                        </p>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-luxury-gold/20">
                    {messages.map((m) => (
                        <div
                            key={m.id}
                            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${m.role === 'user'
                                    ? 'bg-luxury-gold text-black rounded-tr-none'
                                    : 'bg-dark-gray text-gray-200 border border-white/10 rounded-tl-none'
                                    }`}
                            >
                                <ReactMarkdown components={components}>{m.content}</ReactMarkdown>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-dark-gray p-3 rounded-2xl rounded-tl-none border border-white/10 flex gap-2 items-center">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 bg-black/40 rounded-b-2xl">
                    <div className="relative flex items-center">
                        <input
                            value={input || ''}
                            onChange={(e) => handleInputChange && handleInputChange(e)}
                            placeholder={lang === 'es' ? "Escribe tu pregunta..." : "Ask about properties..."}
                            className="w-full bg-dark-gray text-white text-sm rounded-full py-3 pl-4 pr-12 border border-white/10 focus:border-luxury-gold focus:outline-none transition-colors shadow-inner"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !(input || '').trim()}
                            className="absolute right-2 w-8 h-8 bg-luxury-gold rounded-full flex items-center justify-center text-black hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Send message"
                        >
                            <FaPaperPlane className="text-xs ml-0.5" />
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
