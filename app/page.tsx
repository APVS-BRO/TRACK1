import { cn } from '@/lib/utils';
import { Poppins } from 'next/font/google';
import Image from 'next/image';
import authlogo from '@/public/authlogo.png';
import { LoginButton } from '@/components/auth/login-button';

const font = Poppins({
  subsets: ['latin'],
  weight: ["600"]
});

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center 
      bg-gradient-to-br from-gray-800 to-gray-900 bg-[length:100%_100%] animate-scaleBackground">

      <div className='flex items-center justify-center gap-3 w-screen h-screen'>
        <div className='flex flex-col w-1/2 px-24 py-3 gap-2'>
          <h1 className={cn("flex items-start justify-start gap-2 text-6xl font-semibold text-white drop-shadow-md", font.className)}>
            <Image src={authlogo} width={54} height={54} alt="auth_logo" />
            Proctor System
          </h1>
          <p className='text-lg text-white'>An online proctor system built at <span className='font-bold underline'>"The Great Bengaluru Hackathon"</span></p>
         <LoginButton>
            <button className='text-lg w-fit text-[#1C2533] font-semibold bg-white/50 rounded-full mt-6 px-6 py-2'>Get Started</button>
         </LoginButton>
        </div>
        <div className='w-1/2 bg-white h-full border-l-4 border-white'>
          <img src='/vector.jpg' className='w-full h-full object-contain'/>
        </div>
      </div>
    </main>
  );
}
