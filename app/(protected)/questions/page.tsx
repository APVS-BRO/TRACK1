'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { questions } from '@/data/questions';
import { calculateSimilarity } from '@/utils/similarity';
import DisableDevtool from 'disable-devtool';
import { Timer } from '@/components/Timer';

export default function Page() {
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [results, setResults] = useState<{ [key: number]: boolean }>({});
    const [showResults, setShowResults] = useState(false);
    const [attempted, setAttempted] = useState(false);
    const [showPasteWarning, setShowPasteWarning] = useState(false);
    const [showDevToolsWarning, setShowDevToolsWarning] = useState(false);
    const [showTabSwitchWarning, setShowTabSwitchWarning] = useState(false);
    const [tabSwitchCount, setTabSwitchCount] = useState(0);
    const [showVerificationWarning, setShowVerificationWarning] = useState(false);

    const handlePasteAttempt = useCallback(() => {
        setShowPasteWarning(true);
        setTimeout(() => setShowPasteWarning(false), 3000);
    }, []);

    const handleVerificationFailed = useCallback(() => {
        setShowVerificationWarning(true);
        setTimeout(() => setShowVerificationWarning(false), 3000);
    }, []);

    useEffect(() => {
        sessionStorage.setItem('tabSwitch', String(tabSwitchCount));
    }, [tabSwitchCount]);

    useEffect(() => {
        const t = sessionStorage.getItem("tabSwitch")
        if (t) setTabSwitchCount(t ? parseInt(t) : 0)
    }, [])


    useEffect(() => {
        // DisableDevtool();

        const handleDevTools = () => {
            setShowDevToolsWarning(true);
            setTimeout(() => setShowDevToolsWarning(false), 3000);
        };

        const handleContextMenu = (e: Event) => {
            e.preventDefault();
            handleDevTools();
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
                (e.metaKey && e.altKey && e.key === 'I') ||
                e.key === 'F12'
            ) {
                e.preventDefault();
                handleDevTools();
            }
        };

        const detectDevTools = () => {
            if (window.outerWidth - window.innerWidth > 160 || window.outerHeight - window.innerHeight > 160) {
                handleDevTools();
            }
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                setTabSwitchCount(prev => prev + 1);
                setShowTabSwitchWarning(true);
                setTimeout(() => setShowTabSwitchWarning(false), 3000);
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);
        window.addEventListener('resize', detectDevTools);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        setInterval(detectDevTools, 1000);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('resize', detectDevTools);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    const isAllAnswered = () => {
        return questions.every(question => answers[question.id]?.trim());
    };

    const handleSubmitAll = () => {
        if (!isAllAnswered()) {
            setAttempted(true);
            return;
        }
        const newResults = {};
        questions.forEach(question => {
            const answer = answers[question.id] || '';
            let isCorrect = false;
            if (question.type === 'mcq') {
                isCorrect = answer === question.correctAnswer;
            } else {
                isCorrect = calculateSimilarity(answer, question.correctAnswer) >= (question.similarityThreshold || 0.9);
            }
            (newResults as any)[question.id] = isCorrect;
        });
        setResults(newResults);
        setShowResults(true);
    };

    return (
        <div className='flex flex-col h-full max-w-screen-xl w-full pl-[20vw] px-24 py-16 overflow-auto'>
            <Timer onVerificationFailed={handleVerificationFailed} />
            <h1 className='text-3xl font-semibold text-white'>Questions</h1>
            <div className='space-y-8 mt-6'>
                {questions.map(question => (
                    <div key={question.id} className={`p-6 rounded-lg`}>
                        <p className='text-white mb-4 font-medium text-lg select-none'>{question.question}</p>
                        {question.type === 'mcq' ? (
                            <div className='space-y-2 border-l border-white/30 pl-2 ml-2'>
                                {question.options?.map(option => (
                                    <button
                                        key={option}
                                        className={`text-left min-w-[500px] text-white font-medium w-fit p-2 px-4 flex gap-3 items-center rounded-full ${answers[question.id] === option ? (showResults ? (results[question.id] ? 'bg-green-500/50' : 'bg-red-500/50') : 'bg-blue-500/50') : ''}`}
                                        onClick={() => setAnswers(prev => ({ ...prev, [question.id]: option }))}
                                        disabled={showResults}
                                    >
                                        <div className={`${answers[question.id] === option ? (showResults ? (results[question.id] ? 'bg-green-300 border-green-700' : 'bg-red-300 border-red-700') : 'bg-blue-300 border-blue-700') : 'bg-transparent border-white'} w-4 h-4 rounded-full border-2`} />{option}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div>
                                <textarea
                                    className={`${showResults ? (results[question.id] ? 'border-green-500' : 'border-red-500') : "border-transparent"} border-2 w-full bg-gray-700 p-2 rounded-lg px-4 text-white`}
                                    rows={4}
                                    disabled={showResults}
                                    value={answers[question.id] || ''}
                                    onChange={(e) => setAnswers(prev => ({ ...prev, [question.id]: e.target.value }))}
                                    onPaste={(e) => {
                                        e.preventDefault();
                                        handlePasteAttempt();
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        handlePasteAttempt();
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.ctrlKey || e.metaKey) {
                                            if (e.key === 'v') {
                                                e.preventDefault();
                                                handlePasteAttempt();
                                            }
                                        }
                                    }}
                                    onCopy={(e) => e.preventDefault()}
                                    onCut={(e) => e.preventDefault()}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className='fixed bottom-8 right-8 flex flex-col items-end gap-2'>
                {showVerificationWarning && (
                    <div className="bg-red-500/90 text-white px-4 py-2 rounded-xl font-medium animate-in slide-in-from-bottom-4">
                        Warning: Verification check failed!
                    </div>
                )}
                {showTabSwitchWarning && (
                    <div className="bg-red-500/90 text-white px-4 py-2 rounded-xl font-medium animate-in slide-in-from-bottom-4">
                        Warning: Do not switch tabs! ({tabSwitchCount} times detected)
                    </div>
                )}
                <button
                    onClick={handleSubmitAll}
                    className={`text-[#1D2735] font-bold py-3 px-7 rounded-full transform transition-all duration-200 border-2 ${isAllAnswered() ? 'bg-white/90 hover:scale-105 border-transparent' : 'bg-white/20 backdrop-blur-lg text-white border-white cursor-not-allowed'}`}
                >
                    Submit All Answers
                </button>
            </div>
        </div>
    );
}
