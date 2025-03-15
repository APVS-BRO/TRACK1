import { cn } from '@/lib/utils';
import { Poppins } from 'next/font/google';
import Image from 'next/image';
import authlogo from '@/public/authlogo.png';

const font = Poppins({
    subsets: ['latin'],
    weight: ["600"]
});

interface HeaderProps {
    label: string;
}

export const Header = ({ label }: HeaderProps) => {
    return (
        <div className="w-full flex flex-col gap-y-2 items-center justify-center text-center">
            {/* Logo and Title in a single flex row */}
            <div className="flex items-center gap-2">
                <Image src={authlogo} width={40} height={40} alt="auth_logo" className="w-[40px] h-[40px]" />
                <h1 className={cn("text-[24px] font-semibold leading-tight", font.className)}>
                    Proctor Login
                </h1>
            </div>
            <p className="text-muted-foreground text-sm text-[14px] leading-none">
                {label}
            </p>
        </div>
    );
};
