import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';

interface TimerProps {
    onVerificationFailed: () => void;
}

export function Timer({ onVerificationFailed }: TimerProps) {
    const [seconds, setSeconds] = useState(120);
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
            setSeconds(120);
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
        setSeconds(120);
        setVerificationTimer(20);
    };

    return (
        <div className={`fixed top-4 right-4 bg-[#1B2432] ${showVerification ? "rounded-xl p-0" : "rounded-full p-1"} text-white shadow-lg`} style={{ background: `conic-gradient(from 0deg, #ffffff ${((120 - seconds) / 120) * 360}deg, #4caf50 ${((120 - seconds) / 120) * 360}deg)` }}>
            <div className={`bg-[#1B2432] ${showVerification ? "rounded-xl" : "rounded-full"} rounded-full h-full w-full px-6 py-4`}>
                {!showVerification ? (
                    <h2 className='text-lg font-semibold'>
                        {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
                    </h2>
                ) : (
                    <div className="flex flex-col gap-2">
                        <div className="text-red-400 font-medium">
                            Verify! ({verificationTimer}s)
                        </div>
                        <button
                            onClick={handleVerify}
                            className="bg-blue-500 px-4 py-2 rounded-full hover:bg-blue-600"
                        >
                            I'm here
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
