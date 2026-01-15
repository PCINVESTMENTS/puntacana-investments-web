"use client";

import { useState, useEffect } from "react";
import { FaCalculator, FaDollarSign, FaPercentage, FaCalendarAlt } from "react-icons/fa";

interface MortgageCalculatorProps {
    price: number;
}

export default function MortgageCalculator({ price }: MortgageCalculatorProps) {
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
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }).format(val);
    };

    return (
        <div className="bg-dark-gray p-8 border border-white/5 rounded-lg">
            <h3 className="text-2xl font-serif font-bold text-luxury-gold mb-6 uppercase tracking-wider flex items-center gap-3">
                <FaCalculator /> Calculadora de Hipoteca
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-gray-400 text-xs uppercase font-bold mb-2">Precio de Propiedad</label>
                        <div className="text-2xl font-bold text-white">{formatCurrency(price)}</div>
                    </div>

                    <div>
                        <label className="block text-gray-400 text-xs uppercase font-bold mb-2 flex justify-between">
                            <span>Inicial (Down Payment)</span>
                            <span className="text-luxury-gold">{Math.round((downPayment / price) * 100)}%</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max={price}
                            step={1000}
                            value={downPayment}
                            onChange={(e) => handleDownPaymentChange(Number(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-luxury-gold mb-2"
                        />
                        <div className="relative">
                            <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="number"
                                value={downPayment}
                                onChange={(e) => handleDownPaymentChange(Number(e.target.value))}
                                className="w-full bg-black border border-white/10 rounded pl-8 pr-4 py-2 text-white focus:border-luxury-gold outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-400 text-xs uppercase font-bold mb-2">Tasa de Interés (%)</label>
                            <div className="relative">
                                <FaPercentage className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
                                <input
                                    type="number"
                                    step="0.1"
                                    value={interestRate}
                                    onChange={(e) => setInterestRate(Number(e.target.value))}
                                    className="w-full bg-black border border-white/10 rounded pl-8 pr-4 py-2 text-white focus:border-luxury-gold outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-400 text-xs uppercase font-bold mb-2">Años</label>
                            <div className="relative">
                                <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
                                <input
                                    type="number"
                                    min="1"
                                    max="40"
                                    value={loanTerm}
                                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                                    className="w-full bg-black border border-white/10 rounded pl-8 pr-4 py-2 text-white focus:border-luxury-gold outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="flex flex-col justify-center items-center bg-black/30 p-6 rounded-lg border border-white/5 text-center">
                    <span className="text-gray-400 text-sm uppercase tracking-widest mb-2">Cuota Mensual Estimada</span>
                    <span className="text-4xl md:text-5xl font-bold text-luxury-gold mb-4">
                        {formatCurrency(monthlyPayment)}
                    </span>
                    <div className="w-full space-y-2 mt-4 text-sm text-gray-500 border-t border-white/10 pt-4">
                        <div className="flex justify-between">
                            <span>Préstamo:</span>
                            <span className="text-gray-300">{formatCurrency(loanAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Pago Inicial:</span>
                            <span className="text-gray-300">{formatCurrency(downPayment)}</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-6 italic">
                        *Cálculo referencial. No incluye seguros ni impuestos.
                    </p>
                </div>
            </div>
        </div>
    );
}
