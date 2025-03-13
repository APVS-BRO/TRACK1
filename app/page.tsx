import { cn } from '@/lib/utils';
import { Poppins } from 'next/font/google';
import Image from 'next/image';
import authlogo from '@/public/authlogo.png';
import { Button } from '@/components/ui/button';
import { LoginButton } from '@/components/auth/login-button';

const font = Poppins({
  subsets: ['latin'],
  weight: ["600"]
});

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center 
      bg-gradient-to-br from-gray-800 to-gray-900 bg-[length:100%_100%] animate-scaleBackground">
      {/* <div className="space-y-6 text-center">
        <h1 className={cn("flex items-center justify-center gap-2 text-6xl font-semibold text-white drop-shadow-md", font.className)}>
          <Image src={authlogo} width={54} height={54} alt="auth_logo" />
          AUTH
        </h1>
        <div>
          <LoginButton>
            <Button variant="secondary" size="lg">
              Sign in
            </Button>
          </LoginButton>
        </div>
      </div> */}
      <div className='flex items-center justify-center gap-3 w-screen h-screen'>
        <div className='flex flex-col w-1/2 px-24 py-3 gap-2'>
          <h1 className={cn("flex items-start justify-start gap-2 text-6xl font-semibold text-white drop-shadow-md", font.className)}>
            <Image src={authlogo} width={54} height={54} alt="auth_logo" />
            AUTH
          </h1>
          <p className='text-lg text-white'>There will be a content here </p>
         <LoginButton>
            <button className='text-lg text-[#1C2533] font-semibold w-fit bg-white/50 rounded-full mt-6 px-6 py-2'>Get Started</button>
         </LoginButton>
        </div>
        <div className='w-1/2 px-24 py-3 bg-white h-full'></div>
      </div>
    </main>
  );
}
