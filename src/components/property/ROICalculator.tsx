"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaChartLine, FaCheckCircle, FaInfoCircle } from "react-icons/fa";

interface ROICalculatorProps {
    price: number;
    dict: {
        title: string;
        description: string;
        price: string;
        downPayment: string;
        interestRate: string;
        managementFee: string;
        occupancy: string;
        avgNightlyRate: string;
        confotur: string;
        confoturNote: string;
        results: string;
        annualRevenue: string;
        netIncome: string;
        roi: string;
        disclaimer: string;
    };
    propertyType: string;
}

export default function ROICalculator({ price, dict, propertyType }: ROICalculatorProps) {
    const [nightlyRate, setNightlyRate] = useState(price > 500000 ? 500 : 150);
    const [occupancy, setOccupancy] = useState(65);
    const [managementFee, setManagementFee] = useState(20);
    const [useConfotur, setUseConfotur] = useState(true);

    // Results
    const [annualGross, setAnnualGross] = useState(0);
    const [annualNet, setAnnualNet] = useState(0);
    const [roi, setRoi] = useState(0);

    useEffect(() => {
        const gross = nightlyRate * 365 * (occupancy / 100);
        const managedExpenses = gross * (managementFee / 100);

        // Estimated fixed costs (utilities, insurance, etc)
        const fixedMonthly = propertyType === "villa" ? 500 : 250;
        const fixedAnnual = fixedMonthly * 12;

        // IPI Tax (Property Tax) in DR
        // Approx 1% of value above ~9.5M DOP (~175k USD)
        const taxThreshold = 175000;
        let propertyTax = 0;
        if (!useConfotur && price > taxThreshold) {
            propertyTax = (price - taxThreshold) * 0.01;
        }

        const net = gross - managedExpenses - fixedAnnual - propertyTax;

        setAnnualGross(gross);
        setAnnualNet(net);
        setRoi(price > 0 ? (net / price) * 100 : 0);
    }, [price, nightlyRate, occupancy, managementFee, useConfotur, propertyType]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }).format(val);
    };

    return (
        <div className="bg-dark-gray p-8 border border-white/5 rounded-lg relative overflow-hidden">
            {/* Background Texture/glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-luxury-gold/5 blur-3xl rounded-full -mr-32 -mt-32 pointer-events-none"></div>

            <h3 className="text-2xl font-serif font-bold text-luxury-gold mb-2 uppercase tracking-wider flex items-center gap-3">
                <FaChartLine /> {dict.title}
            </h3>
            <p className="text-gray-400 text-sm mb-8 font-light">
                {dict.description}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Inputs */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-gray-400 text-xs uppercase font-bold mb-3 flex justify-between">
                            <span>{dict.avgNightlyRate}</span>
                            <span className="text-luxury-gold font-bold">{formatCurrency(nightlyRate)}</span>
                        </label>
                        <input
                            type="range"
                            min="50"
                            max={Math.max(1000, price * 0.005)}
                            step="10"
                            value={nightlyRate}
                            onChange={(e) => setNightlyRate(Number(e.target.value))}
                            className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-luxury-gold"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 text-xs uppercase font-bold mb-3 flex justify-between">
                            <span>{dict.occupancy}</span>
                            <span className="text-luxury-gold font-bold">{occupancy}%</span>
                        </label>
                        <input
                            type="range"
                            min="30"
                            max="95"
                            step="5"
                            value={occupancy}
                            onChange={(e) => setOccupancy(Number(e.target.value))}
                            className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-luxury-gold"
                        />
                    </div>

                    <div
                        className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-lg group cursor-pointer transition-colors hover:border-luxury-gold/30"
                        onClick={() => setUseConfotur(!useConfotur)}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${useConfotur ? "border-luxury-gold bg-luxury-gold" : "border-gray-600"}`}>
                                {useConfotur && <FaCheckCircle className="text-black text-xs" />}
                            </div>
                            <div>
                                <span className={`text-sm font-bold block ${useConfotur ? "text-luxury-gold" : "text-gray-400"}`}>{dict.confotur}</span>
                                <span className="text-[10px] text-gray-500 uppercase tracking-tighter">{dict.confoturNote}</span>
                            </div>
                        </div>
                        <FaInfoCircle className={`transition-colors ${useConfotur ? "text-luxury-gold" : "text-gray-600"}`} />
                    </div>
                </div>

                {/* Outcome */}
                <div className="bg-black/50 p-8 rounded-xl border border-luxury-gold/20 flex flex-col justify-center text-center relative">
                    <div className="mb-6">
                        <span className="text-gray-400 text-xs uppercase tracking-[0.2em] mb-2 block">{dict.roi}</span>
                        <motion.div
                            key={roi}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-5xl md:text-6xl font-bold text-white font-serif"
                        >
                            {roi.toFixed(1)}%
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                        <div className="text-left">
                            <span className="text-[10px] text-gray-500 uppercase block mb-1">{dict.annualRevenue}</span>
                            <span className="text-lg font-bold text-gray-200">{formatCurrency(annualGross)}</span>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] text-gray-500 uppercase block mb-1">{dict.netIncome}</span>
                            <span className="text-lg font-bold text-luxury-gold">{formatCurrency(annualNet)}</span>
                        </div>
                    </div>

                    <p className="text-[10px] text-gray-600 mt-6 italic leading-tight">
                        {dict.disclaimer}
                    </p>
                </div>
            </div>
        </div>
    );
}
