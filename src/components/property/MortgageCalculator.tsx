"use client";

import { useState, useEffect } from "react";
import { FaCalculator, FaDollarSign, FaPercentage, FaCalendarAlt } from "react-icons/fa";

interface MortgageCalculatorProps {
    price: number;
    lang?: string;
}

const MORTGAGE_COPY = {
    es: {
        title: "Calculadora de Hipoteca",
        propertyPrice: "Precio de Propiedad",
        downPayment: "Inicial (Down Payment)",
        downPaymentPctAria: "Porcentaje de pago inicial",
        downPaymentAmtAria: "Monto de pago inicial",
        interestRate: "Tasa de Interés (%)",
        interestRateAria: "Tasa de interés anual",
        years: "Años",
        yearsAria: "Plazo del préstamo en años",
        estimatedMonthly: "Cuota Mensual Estimada",
        loan: "Préstamo:",
        initialPayment: "Pago Inicial:",
        disclaimer: "*Cálculo referencial. No incluye seguros ni impuestos.",
    },
    en: {
        title: "Mortgage Calculator",
        propertyPrice: "Property Price",
        downPayment: "Down Payment",
        downPaymentPctAria: "Down payment percentage",
        downPaymentAmtAria: "Down payment amount",
        interestRate: "Interest Rate (%)",
        interestRateAria: "Annual interest rate",
        years: "Years",
        yearsAria: "Loan term in years",
        estimatedMonthly: "Estimated Monthly Payment",
        loan: "Loan Amount:",
        initialPayment: "Down Payment:",
        disclaimer: "*Indicative estimate. Excludes insurance and taxes.",
    },
    fr: {
        title: "Calculateur Hypothécaire",
        propertyPrice: "Prix de la Propriété",
        downPayment: "Apport Initial",
        downPaymentPctAria: "Pourcentage d'apport initial",
        downPaymentAmtAria: "Montant de l'apport initial",
        interestRate: "Taux d'Intérêt (%)",
        interestRateAria: "Taux d'intérêt annuel",
        years: "Années",
        yearsAria: "Durée du prêt en années",
        estimatedMonthly: "Mensualité Estimée",
        loan: "Montant du Prêt :",
        initialPayment: "Apport Initial :",
        disclaimer: "*Calcul indicatif. Hors assurances et taxes.",
    },
};

export default function MortgageCalculator({ price, lang = "es" }: MortgageCalculatorProps) {
    const l = (lang === "en" || lang === "fr" ? lang : "es") as "es" | "en" | "fr";
    const copy = MORTGAGE_COPY[l];
    const [loanAmount, setLoanAmount] = useState(price * 0.8); // Default 20% down
    const [downPayment, setDownPayment] = useState(price * 0.2);
    const [interestRate, setInterestRate] = useState(7.5); // Default interest
    const [loanTerm, setLoanTerm] = useState(20); // Default years
    const [monthlyPayment, setMonthlyPayment] = useState(0);

    useEffect(() => {
        // Recalculate loan amount if down payment changes (or ensure consistency)
        // Actually, simple logic: Loan = Price - DownPayment
        const principal = price - downPayment;
        setLoanAmount(principal);

        // Monthly Payment Calculation
        // M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ]
        // i = monthly interest rate (annual / 12)
        // n = number of payments (years * 12)

        if (principal <= 0) {
            setMonthlyPayment(0);
            return;
        }

        const r = interestRate / 100 / 12;
        const n = loanTerm * 12;

        if (interestRate === 0) {
            setMonthlyPayment(principal / n);
        } else {
            const payment = principal * ((r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
            setMonthlyPayment(payment);
        }

    }, [price, downPayment, interestRate, loanTerm]);

    const handleDownPaymentChange = (val: number) => {
        setDownPayment(val);
    };

    const formatCurrency = (val: number) => {
        if (l === "fr") {
            const num = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 })
                .format(Math.round(val))
                .replace(/[\u202f\u00a0]/g, " ");
            return `${num} $US`;
        }
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }).format(val);
    };

    return (
        <div className="bg-dark-gray p-8 border border-white/5 rounded-lg" data-mortgage-calculator="true" data-lang={l}>
            <h3 className="text-2xl font-serif font-bold text-luxury-gold mb-6 uppercase tracking-wider flex items-center gap-3">
                <FaCalculator /> {copy.title}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-gray-400 text-xs uppercase font-bold mb-2">{copy.propertyPrice}</label>
                        <div className="text-2xl font-bold text-white">{formatCurrency(price)}</div>
                    </div>

                    <div>
                        <label className="block text-gray-400 text-xs uppercase font-bold mb-2 flex justify-between">
                            <span>{copy.downPayment}</span>
                            <span className="text-luxury-gold">{Math.round((downPayment / price) * 100)}%</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max={price}
                            step={1000}
                            value={downPayment}
                            aria-label={copy.downPaymentPctAria}
                            onChange={(e) => handleDownPaymentChange(Number(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-luxury-gold mb-2"
                        />
                        <div className="relative">
                            <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="number"
                                value={downPayment}
                                aria-label={copy.downPaymentAmtAria}
                                onChange={(e) => handleDownPaymentChange(Number(e.target.value))}
                                className="w-full bg-black border border-white/10 rounded pl-8 pr-4 py-2 text-white focus:border-luxury-gold outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-400 text-xs uppercase font-bold mb-2">{copy.interestRate}</label>
                            <div className="relative">
                                <FaPercentage className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
                                <input
                                    type="number"
                                    step="0.1"
                                    value={interestRate}
                                    aria-label={copy.interestRateAria}
                                    onChange={(e) => setInterestRate(Number(e.target.value))}
                                    className="w-full bg-black border border-white/10 rounded pl-8 pr-4 py-2 text-white focus:border-luxury-gold outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-400 text-xs uppercase font-bold mb-2">{copy.years}</label>
                            <div className="relative">
                                <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
                                <input
                                    type="number"
                                    min="1"
                                    max="40"
                                    value={loanTerm}
                                    aria-label={copy.yearsAria}
                                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                                    className="w-full bg-black border border-white/10 rounded pl-8 pr-4 py-2 text-white focus:border-luxury-gold outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="flex flex-col justify-center items-center bg-black/30 p-6 rounded-lg border border-white/5 text-center">
                    <span className="text-gray-400 text-sm uppercase tracking-widest mb-2">{copy.estimatedMonthly}</span>
                    <span className="text-4xl md:text-5xl font-bold text-luxury-gold mb-4">
                        {formatCurrency(monthlyPayment)}
                    </span>
                    <div className="w-full space-y-2 mt-4 text-sm text-gray-300 font-medium border-t border-white/10 pt-4">
                        <div className="flex justify-between">
                            <span>{copy.loan}</span>
                            <span className="text-gray-300">{formatCurrency(loanAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>{copy.initialPayment}</span>
                            <span className="text-gray-300">{formatCurrency(downPayment)}</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 font-medium mt-6 italic">
                        {copy.disclaimer}
                    </p>
                </div>
            </div>
        </div>
    );
}
