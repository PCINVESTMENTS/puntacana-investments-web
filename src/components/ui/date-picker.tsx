"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { cn } from "@/lib/utils"

const DATE_LABELS = {
    es: {
        day: "Día",
        month: "Mes",
        year: "Año",
        months: [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
        ],
    },
    en: {
        day: "Day",
        month: "Month",
        year: "Year",
        months: [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December",
        ],
    },
    fr: {
        day: "Jour",
        month: "Mois",
        year: "Année",
        months: [
            "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
            "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
        ],
    },
}

// Professional multi-select DatePicker to ensure explicit Year selection
const DatePicker = React.forwardRef<HTMLInputElement, any>(
    ({ field, className }, ref) => {
        const params = useParams()
        const langKey = (params?.lang === "en" || params?.lang === "fr" ? params.lang : "es") as "es" | "en" | "fr"
        const loc = DATE_LABELS[langKey]

        const dateObj = field?.value instanceof Date
            ? field.value
            : field?.value ? new Date(field.value) : new Date()

        const [day, setDay] = React.useState(dateObj.getDate().toString())
        const [month, setMonth] = React.useState((dateObj.getMonth() + 1).toString())
        const [year, setYear] = React.useState(dateObj.getFullYear().toString())

        React.useEffect(() => {
            if (day && month && year) {
                const newDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
                if (!isNaN(newDate.getTime())) {
                    const currentDate = field?.value instanceof Date ? field.value : field?.value ? new Date(field.value) : null
                    if (!currentDate || currentDate.getTime() !== newDate.getTime()) {
                        field?.onChange?.(newDate)
                    }
                }
            }
        }, [day, month, year, field?.value, field?.onChange])

        const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString())
        const currentYear = new Date().getFullYear()
        const years = Array.from({ length: 120 }, (_, i) => (currentYear - i).toString())

        const selectClass = "flex h-10 w-full items-center justify-between rounded-md border border-luxury-gold/50 bg-zinc-900/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-luxury-gold cursor-pointer"

        return (
            <div className={cn("flex gap-2 w-full", className)} ref={ref}>
                <select
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    className={selectClass}
                    aria-label={loc.day}
                >
                    <option value="" disabled>{loc.day}</option>
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className={selectClass}
                    aria-label={loc.month}
                >
                    <option value="" disabled>{loc.month}</option>
                    {loc.months.map((m, i) => <option key={m} value={(i + 1).toString()}>{m}</option>)}
                </select>
                <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className={selectClass}
                    aria-label={loc.year}
                >
                    <option value="" disabled>{loc.year}</option>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
            </div>
        )
    }
)
DatePicker.displayName = "DatePicker"

export { DatePicker }
