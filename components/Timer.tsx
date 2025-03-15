import { useEffect, useState, useRef } from 'react';

interface TimerProps {
    onVerificationFailed: () => void;
}

export function Timer({ onVerificationFailed }: TimerProps) {
    const getRandomInterval = () => Math.floor(Math.random() * (25 - 15 + 1) + 15);
    const [seconds, setSeconds] = useState(getRandomInterval());
    const [showVerification, setShowVerification] = useState(false);
    const [verificationTimer, setVerificationTimer] = useState(20);
    const ref = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (seconds > 0 && !showVerification) {
            const timer = setInterval(() => setSeconds(s => s - 1), 1000);
            return () => clearInterval(timer);
        } else if (seconds === 0 && !showVerification) {
            setShowVerification(true);
        }
    }, [seconds, showVerification]);

    useEffect(() => {
        if (showVerification && verificationTimer > 0) {
            const timer = setInterval(() => setVerificationTimer(t => t - 1), 1000);
            return () => clearInterval(timer);
        } else if (showVerification && verificationTimer === 0) {
            onVerificationFailed();
            setShowVerification(false);
            setSeconds(getRandomInterval());
            setVerificationTimer(20);
        }
    }, [showVerification, verificationTimer, onVerificationFailed]);

    useEffect(() => {
        const elememnt = document.getElementById('timer-portal');
        if (ref.current) {
            ref.current = elememnt;
        }
    }, [])
    const handleVerify = () => {
        setShowVerification(false);
        setSeconds(getRandomInterval());
        setVerificationTimer(20);
    };

    return (
        showVerification ? <div className="flex flex-col gap-2 fixed top-6 right-6">
            <div className="text-red-400 font-medium">
                Verify! ({verificationTimer}s)
            </div>
            <button
                onClick={handleVerify}
                className="bg-blue-500 px-4 py-2 rounded-full hover:bg-blue-600"
            >
                I'm here
            </button>
        </div> : null
    )
}
