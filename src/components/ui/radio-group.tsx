"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const RadioGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { onValueChange?: (val: string) => void, value?: string, defaultValue?: string }>(
    ({ className, onValueChange, value, defaultValue, children, ...props }, ref) => {
        return (
            <RadioGroupContext.Provider value={{ onValueChange, value, defaultValue }}>
                <div className={cn("grid gap-2", className)} ref={ref} {...props}>
                    {children}
                </div>
            </RadioGroupContext.Provider>
        )
    }
)
RadioGroup.displayName = "RadioGroup"

const RadioGroupContext = React.createContext<{ onValueChange?: (val: string) => void, value?: string, defaultValue?: string } | null>(null);

const RadioGroupItem = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { value: string }>(
    ({ className, value, ...props }, ref) => {
        const context = React.useContext(RadioGroupContext);
        const isChecked = context?.value !== undefined ? context.value === value : context?.defaultValue === value;

        return (
            <div className="flex items-center space-x-2">
                <input
                    type="radio"
                    value={value}
                    checked={isChecked}
                    onChange={(e) => e.target.checked && context?.onValueChange?.(value)}
                    className={cn(
                        "aspect-square h-4 w-4 rounded-full border border-luxury-gold text-luxury-gold ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 accent-luxury-gold bg-zinc-900",
                        className
                    )}
                    ref={ref}
                    aria-label={props['aria-label'] || value}
                    {...props}
                />
            </div>
        )
    }
)
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }
