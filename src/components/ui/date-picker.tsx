"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Professional multi-select DatePicker to ensure explicit Year selection
const DatePicker = React.forwardRef<HTMLInputElement, any>(
    ({ field, className, ...props }, ref) => {
        // Parse current value
        const dateObj = field?.value instanceof Date 
            ? field.value 
            : field?.value ? new Date(field.value) : new Date();

        const [day, setDay] = React.useState(dateObj.getDate().toString());
        const [month, setMonth] = React.useState((dateObj.getMonth() + 1).toString());
        const [year, setYear] = React.useState(dateObj.getFullYear().toString());

        React.useEffect(() => {
            // Update external form when internal state changes
            if (day && month && year) {
                const newDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                // Only trigger if valid date
                if (!isNaN(newDate.getTime())) {
                    const currentDate = field?.value instanceof Date ? field.value : field?.value ? new Date(field.value) : null;
                    if (!currentDate || currentDate.getTime() !== newDate.getTime()) {
                        field?.onChange?.(newDate);
                    }
                }
            }
        }, [day, month, year, field?.value, field?.onChange]);

        // Generate options
        const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
        const months = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];
        
        // Year range: From current year down to 100 years ago
        const currentYear = new Date().getFullYear();
        const years = Array.from({ length: 120 }, (_, i) => (currentYear - i).toString());

        const selectClass = "flex h-10 w-full items-center justify-between rounded-md border border-luxury-gold/50 bg-zinc-900/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-luxury-gold cursor-pointer";

        return (
            <div className={cn("flex gap-2 w-full", className)} ref={ref}>
                <select 
                    value={day} 
                    onChange={(e) => setDay(e.target.value)}
                    className={selectClass}
                    aria-label="Día"
                >
                    <option value="" disabled>Día</option>
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select 
                    value={month} 
                    onChange={(e) => setMonth(e.target.value)}
                    className={selectClass}
                    aria-label="Mes"
                >
                    <option value="" disabled>Mes</option>
                    {months.map((m, i) => <option key={m} value={(i + 1).toString()}>{m}</option>)}
                </select>
                <select 
                    value={year} 
                    onChange={(e) => setYear(e.target.value)}
                    className={selectClass}
                    aria-label="Año"
                >
                    <option value="" disabled>Año</option>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
            </div>
        )
    }
)
DatePicker.displayName = "DatePicker"

export { DatePicker }
