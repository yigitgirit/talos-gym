import { useState, useEffect, useCallback } from 'react';

/**
 * A custom hook to manage a countdown timer.
 * Useful for OTP resends, rate limiting, or temporary UI states.
 */
export function useCountdownTimer(initialSeconds: number) {
    const [timeLeft, setTimeLeft] = useState(initialSeconds);

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
    }, [timeLeft]);

    const resetTimer = useCallback(() => setTimeLeft(initialSeconds), [initialSeconds]);

    return { timeLeft, isFinished: timeLeft === 0, resetTimer };
}