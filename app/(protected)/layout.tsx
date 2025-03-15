import Image from 'next/image'
import React from 'react'
import authlogo from '@/public/authlogo.png';
import Link from 'next/link';
import { BsFillBarChartFill, BsInfoCircleFill, BsPersonFill } from 'react-icons/bs';
import { UserButton } from '@/components/auth/user-button';
import { BiQuestionMark } from 'react-icons/bi';


export default function layout({ children }:
    { children: React.ReactNode }
) {
    return (
        <div className="h-full w-full flex flex-col gap-y-10 items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 bg-[length:100%_100%] animate-scaleBackground fixed">
            <nav className='flex  px-6 py-4 flex-col justify-between gap-2 w-[15vw] bg-white/80 backdrop-blur-lg fixed top-0 left-0 h-screen shadow-md'>
                <div className='flex flex-col gap-2'>
                    <div className='flex items-center justify-center w-fit gap-2 mb-2'>
                        <Image src={authlogo} width={40} height={40} alt="auth_logo" className="w-[40px] h-[40px]" />
                        <h1 className='text-xl font-semibold'>APVS</h1>
                    </div>
                    <Link href='/instructions' className='flex items-center gap-2 rounded-lg font-medium hover:bg-white/20 px-4 py-2'>
                        <BsInfoCircleFill className='text-lg' /> Instructions
                    </Link>
                    <Link href='/questions' className='flex items-center gap-2 rounded-lg font-medium hover:bg-white/20 px-4 py-2'>
                        <BiQuestionMark className='text-lg' /> Questions
                    </Link>
                    <Link href='/ranking' className='flex items-center gap-2 rounded-lg font-medium hover:bg-white/20 px-4 py-2'>
                        <BsFillBarChartFill className='text-lg' /> Ranking
                    </Link>
                    <Link href='/profile' className='flex items-center gap-2 rounded-lg font-medium hover:bg-white/20 px-4 py-2'>
                        <BsPersonFill className='text-lg' /> Profile
                    </Link>



                </div>
                <UserButton />
            </nav>
            
            {children}
        </div>
    )
}
