'use client'
import React, { useEffect, useState } from 'react'

export default function Ranking() {
    const [tabSwitch, setTabSwitch] = useState(0)

    useEffect(() => {
        const t = sessionStorage.getItem("tabSwitch")
        setTabSwitch(t ? parseInt(t) : 0)
    }, [])
    return (
        <div className='flex flex-col h-full max-w-screen-xl w-full pl-[20vw] px-24 py-16 overflow-auto text-white'>
            <h2 className='text-3xl font-semibold'>Ranking</h2>

            <table className='table-auto w-full *:text-center mb-32 mt-12'>
                <thead>
                    <tr>
                        <th className='px-4 py-2'>Rank</th>
                        <th className='px-4 py-2'>Warnings</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className='border px-4 py-2 bg-red-700'>1</td>
                        <td className='border px-4 py-2 bg-red-700'>8-12</td>
                    </tr>
                    <tr>
                        <td className='border px-4 py-2 bg-blue-700'>2</td>
                        <td className='border px-4 py-2  bg-blue-700'>4-8</td>
                    </tr>
                    <tr>
                        <td className='border px-4 py-2 bg-green-800'>3</td>
                        <td className='border px-4 py-2 bg-green-800'>1-4</td>
                    </tr>
                </tbody>
            </table>

            <h2 className='text-2xl font-semibold text-center mt-24'>
                You got <span className='text-red-500'>{tabSwitch ?? 0} warnings</span> with {
                    tabSwitch >= 8 ? <span className='text-red-400'>Rank 1</span> : tabSwitch >= 4 ? <span className='text-blue-400'>Rank 2</span> : <span className='text-green-400'>Rank 3</span>
                }
            </h2>
        </div>
    )
}
