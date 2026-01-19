"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Simplified DatePicker using native HTML date input but styled to match the theme.
// A full calendar component is heavy. The prompts imply "DatePicker", I'll use a styled native input for robustness.

const DatePicker = React.forwardRef<HTMLInputElement, any>(
    ({ field, className, ...props }, ref) => {
        // field prop usually comes from react-hook-form's controller
        // We need to handle the value conversion if it's a Date object
        const value = field?.value instanceof Date
            ? field.value.toISOString().split('T')[0]
            : field?.value || "";

        return (
            <div className="relative">
                <input
                    type="date"
                    className={cn(
                        "flex h-10 w-full rounded-md border border-white/20 bg-zinc-900/50 px-3 py-2 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [color-scheme:dark]",
                        className
                    )}
                    ref={ref}
                    {...props}
                    {...field}
                    value={value}
                    onChange={(e) => field.onChange?.(new Date(e.target.value))}
                />
            </div>
        )
    }
)
DatePicker.displayName = "DatePicker"

export { DatePicker }
