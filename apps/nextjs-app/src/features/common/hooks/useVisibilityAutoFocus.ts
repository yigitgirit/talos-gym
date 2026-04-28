import { useEffect, useRef } from 'react';

/**
 * A custom hook that automatically focuses an HTML element on mount 
 * and whenever the user switches back to the browser tab.
 * 
 * @param shouldFocus - If false, temporarily disables the auto-focus behavior.
 */
export function useVisibilityAutoFocus<T extends HTMLElement>(shouldFocus: boolean = true) {
    const ref = useRef<T>(null);

    useEffect(() => {
        if (!shouldFocus) return;

        const focusElement = () => ref.current?.focus();
        
        focusElement(); // Focus immediately on mount

        const handleVisibilityChange = () => {
            if (!document.hidden) focusElement();
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [shouldFocus]);

    return ref;
}