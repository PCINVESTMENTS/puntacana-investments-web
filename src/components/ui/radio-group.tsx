"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const RadioGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { onValueChange?: (val: string) => void, defaultValue?: string }>(
    ({ className, onValueChange, defaultValue, children, ...props }, ref) => {
        // Basic implementation that clones children to pass name if needed, or relies on standard HTML behavior
        // The shadcn Usage passes onValueChange. We need to support that.
        // For a naive implementation without Context, we just render the div.
        // The RadioGroupItem needs to communicate back.
        // We'll use a simplified Context for this as well.
        return (
            <RadioGroupContext.Provider value={{ onValueChange, defaultValue }}>
                <div className={cn("grid gap-2", className)} ref={ref} {...props}>
                    {children}
                </div>
            </RadioGroupContext.Provider>
        )
    }
)
RadioGroup.displayName = "RadioGroup"

const RadioGroupContext = React.createContext<{ onValueChange?: (val: string) => void, defaultValue?: string } | null>(null);

const RadioGroupItem = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { value: string }>(
    ({ className, value, ...props }, ref) => {
        const context = React.useContext(RadioGroupContext);

        return (
            <div className="flex items-center space-x-2">
                <input
                    type="radio"
                    value={value}
                    defaultChecked={context?.defaultValue === value}
                    onChange={(e) => e.target.checked && context?.onValueChange?.(value)}
                    className={cn(
                        "aspect-square h-4 w-4 rounded-full border border-luxury-gold text-luxury-gold ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 accent-luxury-gold bg-zinc-900",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
            </div>
        )
    }
)
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }
