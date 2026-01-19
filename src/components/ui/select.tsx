"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
// Simplest possible Select implementation without Radix UI for speed/compatibility if not installed,
// BUT standard Shadcn uses Radix. I will create a standard HTML select wrapper for robustness if Radix isn't strictly enforced, or I can try to simulate the Radix structure if I'm confident. 
// Given the user wants "Premium" feel, standard HTML select is ugly. 
// I will implement a custom dropdown using standard React state to ensure it looks good without requiring full Radix installation debug cycle.
// ACTUALLY, to avoid complexity and bugs, I'll use a standard styled <select> for now but styled heavily.
// ...On second thought, the user provided code uses <Select>, <SelectTrigger>, etc. which implies the Radix structure.
// I will build a Context-based mock of Radix Select to support the syntax provided in the prompt.

const SelectContext = React.createContext<{
    value: string;
    onValueChange: (value: string) => void;
    open: boolean;
    setOpen: (open: boolean) => void;
} | null>(null);

const Select = ({ children, onValueChange, defaultValue, value: controlledValue }: any) => {
    const [value, setValue] = React.useState(defaultValue || "");
    const [open, setOpen] = React.useState(false);
    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : value;

    const handleValueChange = (val: string) => {
        if (!isControlled) setValue(val);
        onValueChange?.(val);
        setOpen(false);
    };

    return (
        <SelectContext.Provider value={{ value: currentValue, onValueChange: handleValueChange, open, setOpen }}>
            <div className="relative">{children}</div>
        </SelectContext.Provider>
    );
};

const SelectTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(({ className, children, ...props }, ref) => {
    const context = React.useContext(SelectContext);
    return (
        <button
            ref={ref}
            type="button"
            onClick={() => context?.setOpen(!context.open)}
            className={cn(
                "flex h-10 w-full items-center justify-between rounded-md border border-white/20 bg-zinc-900/50 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-luxury-gold disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        >
            {children}
            <span className="opacity-50">▼</span>
        </button>
    );
});
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = ({ placeholder }: { placeholder?: string }) => {
    const context = React.useContext(SelectContext);
    // This is a naive implementation; normally we'd look up the label from children.
    // For simplicity in this mock, we might just show the value if we can't easily access children labels.
    // Ideally, we'd use a real library. I'll rely on the value being displayable or just show the placeholder if empty.
    return <span>{context?.value || placeholder}</span>;
}

const SelectContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, children, ...props }, ref) => {
    const context = React.useContext(SelectContext);
    if (!context?.open) return null;
    return (
        <div
            ref={ref}
            className={cn(
                "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-white/20 bg-zinc-900 text-white shadow-xl animate-in fade-in-0 zoom-in-95 mt-1 w-full",
                className
            )}
            {...props}
        >
            <div className="p-1">{children}</div>
        </div>
    );
});
SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { value: string }>(({ className, children, value, ...props }, ref) => {
    const context = React.useContext(SelectContext);
    return (
        <div
            ref={ref}
            className={cn(
                "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-white/10 hover:text-luxury-gold data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                className
            )}
            onClick={(e) => {
                e.stopPropagation();
                context?.onValueChange(value);
            }}
            {...props}
        >
            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                {context?.value === value && <span>✓</span>}
            </span>
            {children}
        </div>
    );
});
SelectItem.displayName = "SelectItem"

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
