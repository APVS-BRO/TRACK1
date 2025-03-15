"use client";

import { UserButton } from "@/components/auth/user-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-secondary flex justify-between items-center p-4 rounded-xl shadow-sm w-[clamp(330px,90vw,630px)] sm:w-[280px] md:w-[300px] lg:w-[330px] xl:w-[350px] 2xl:w-[380px]  mx-auto">
      <div className="flex gap-x-2">
        <Button asChild variant={pathname === '/instructions' ? 'default' : "outline"}>
          <Link href="/Profile">Profile</Link>
        </Button>
        <Button asChild variant={pathname === '/instructions' ? 'default' : "outline"}>
          <Link href="/settings">Settings</Link>
        </Button>
      </div>
      <UserButton />
    </nav>
  );
};
