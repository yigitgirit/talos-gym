import React, { useState, useEffect } from "react";

interface UseBufferedInputProps {
    value: string | number;
    onChange: (value: string | number) => void;
    debounce?: number;
}

export function useBufferedInput({ value: externalValue, onChange, debounce = 500 }: UseBufferedInputProps) {
    const [internalValue, setInternalValue] = useState(externalValue);

    // Sync internal state when externalValue changes (e.g., "Clear all" clicked)
    useEffect(() => {
        setInternalValue(externalValue);
    }, [externalValue]);

    // The wait-then-fire logic
    useEffect(() => {
        const timer = setTimeout(() => {
            if (internalValue !== externalValue) {
                onChange(internalValue);
            }
        }, debounce);

        return () => clearTimeout(timer);
    }, [internalValue, externalValue, debounce, onChange]);

    return {
        value: internalValue,
        // TODO: only HTMLInputElement | HTMLTextAreaElement ???
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setInternalValue(e.target.value),
    };
}