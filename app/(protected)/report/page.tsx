'use client'
import React, { useEffect, useState } from 'react'
import { ImCross } from 'react-icons/im';
import { FaCheck } from 'react-icons/fa';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
export default function Report() {
    const searchParams = useSearchParams();
        const [tabSwitch, setTabSwitch] = useState(0)
    
        useEffect(() => {
            const t = sessionStorage.getItem("tabSwitch")
            setTabSwitch(t ? parseInt(t) : 0)
        }, [])
    const total = searchParams.get('total');
    const correct = searchParams.get('correct');

    const totalQuestions = parseInt(total as string, 10);
    const correctAnswers = parseInt(correct as string, 10);
    const wrongAnswers = totalQuestions - correctAnswers;
    const correctnessPercentage = (correctAnswers / totalQuestions) * 100;

    const questionDone = {
        done: totalQuestions,
        correct: correctAnswers,
        wrong: wrongAnswers,
        correctnessPercentage: correctnessPercentage,
    };

    return (
        <main className="pl-[20vw] max-w-screen-xl w-full min-h-screen flex flex-col gap-24 h-full px-24 py-16 overflow-auto">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-semibold text-white">Report</h2>
                    <p className="text-sm opacity-80 font-semibold text-white ">Let&apos;s see if you did well in this test</p>
                </div>
            </div>

            <div className="flex flex-col gap-5 w-full">
                <div className="flex flex-row gap-4 items-center justify-between">
                    <p className="text-lg opacity-70 text-white font-medium">Questions</p>
                    <p className="text-3xl font-bold text-white">{questionDone.correctnessPercentage.toFixed(2)}%</p>
                </div>

                <div className={`flex rounded-full w-full`}>
                    <div style={{ width: `${questionDone.correctnessPercentage}%` }} className="flex flex-col gap-2 items-center justify-center">
                        <div className={`h-full border-green-500 rounded-full flex justify-end bg-green-500/20 border-2 w-full`}  >
                            <div className="p-0.5  rounded-full w-fit aspect-square h-8 flex items-center justify-center"><FaCheck className="text-base text-green-500" /></div>
                        </div>
                        <p className="text-green-500 font-bold">{questionDone.correct}</p>
                    </div>
                    <div style={{ width: `${100 - questionDone.correctnessPercentage}%` }} className="flex flex-col gap-2 items-center justify-center">
                        <div className={`h-full border-red-500 rounded-full flex justify-end bg-red-500/20 border-2 w-full`} >
                            <div className="p-0.5 rounded-full w-fit aspect-square h-8 flex items-center justify-center"><ImCross className="text-base text-red-500" /></div>
                        </div>
                        <p className="text-red-500 font-bold">{questionDone.wrong}</p>
                    </div>
                </div>
            </div>

            <h2 className='text-2xl text-white font-semibold text-center mt-24'>
                You got <span className='text-red-500'>{tabSwitch ?? 0} warnings</span> with {
                    tabSwitch >= 8 ? <span className='text-red-400'>Rank 1</span> : tabSwitch >= 4 ? <span className='text-blue-400'>Rank 2</span> : <span className='text-green-400'>Rank 3</span>
                }
            </h2>

            <div className='flex items-center justify-center'>
                <Link href={"/instructions"} className='px-6 py-3 bg-blue-500/40 text-white font-semibold text-lg w-fit rounded-full'>Continue</Link>
            </div>
        </main>
    )
}
