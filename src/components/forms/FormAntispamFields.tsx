'use client';

import { useEffect, useId, useState } from 'react';

interface FormAntispamFieldsProps {
    onHoneypotChange?: (value: string) => void;
    onLoadedAtReady?: (timestamp: string) => void;
}

/**
 * Invisible anti-bot honeypot + mount timestamp fields.
 * Zero visible pixels, zero layout shift, zero password-manager autofill interference.
 */
export function FormAntispamFields({
    onHoneypotChange,
    onLoadedAtReady,
}: FormAntispamFieldsProps) {
    const inputId = useId();
    const [loadedAt, setLoadedAt] = useState('');

    useEffect(() => {
        const ts = String(Date.now());
        setLoadedAt(ts);
        onLoadedAtReady?.(ts);
    }, [onLoadedAtReady]);

    return (
        <div
            aria-hidden="true"
            style={{
                position: 'absolute',
                left: '-10000px',
                top: 'auto',
                width: '1px',
                height: '1px',
                overflow: 'hidden',
                opacity: 0,
                pointerEvents: 'none',
            }}
        >
            <label htmlFor={inputId}>Website</label>
            <input
                id={inputId}
                type="text"
                name="website_url"
                defaultValue=""
                tabIndex={-1}
                autoComplete="new-password"
                data-lpignore="true"
                data-1p-ignore="true"
                data-bwignore="true"
                onChange={onHoneypotChange ? (e) => onHoneypotChange(e.target.value) : undefined}
            />
            <input type="hidden" name="form_loaded_at" value={loadedAt} readOnly />
        </div>
    );
}
