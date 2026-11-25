"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const SelectContext = React.createContext<{
    value: string;
    onValueChange: (value: string) => void;
    open: boolean;
    setOpen: (open: boolean) => void;
    labelsByValue: Record<string, React.ReactNode>;
} | null>(null);

function extractSelectLabels(children: React.ReactNode, map: Record<string, React.ReactNode>) {
    React.Children.forEach(children, (child) => {
        if (!React.isValidElement(child)) return;
        const props: any = child.props || {};
        if (typeof props.value === "string" && props.children !== undefined) {
            map[props.value] = props.children;
        }
        if (props.children) {
            extractSelectLabels(props.children, map);
        }
    });
}

const Select = ({ children, onValueChange, defaultValue, value: controlledValue }: any) => {
    const [value, setValue] = React.useState(defaultValue || "");
    const [open, setOpen] = React.useState(false);
    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : value;

    const labelsByValue = React.useMemo(() => {
        const map: Record<string, React.ReactNode> = {};
        extractSelectLabels(children, map);
        return map;
    }, [children]);

    const handleValueChange = (val: string) => {
        if (!isControlled) setValue(val);
        onValueChange?.(val);
        setOpen(false);
    };

    return (
        <SelectContext.Provider value={{ value: currentValue, onValueChange: handleValueChange, open, setOpen, labelsByValue }}>
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
                "flex h-10 w-full items-center justify-between rounded-md border border-luxury-gold/50 bg-zinc-900/50 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-luxury-gold disabled:cursor-not-allowed disabled:opacity-50",
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
    const val = context?.value;
    const label = val ? (context?.labelsByValue?.[val] ?? val) : undefined;
    return <span>{label || placeholder}</span>;
}

const SelectContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, children, ...props }, ref) => {
    const context = React.useContext(SelectContext);
    if (!context?.open) return null;
    return (
        <div
            ref={ref}
            className={cn(
                "absolute z-50 min-w-[8rem] max-h-64 overflow-y-auto rounded-md border border-luxury-gold/50 bg-zinc-900 text-white shadow-xl animate-in fade-in-0 zoom-in-95 mt-1 w-full",
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
