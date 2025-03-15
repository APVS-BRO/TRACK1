"use client";
import { UserInfo } from "@/components/user-info";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { RiLoader3Fill } from "react-icons/ri";

const ClientPage = () => {
  const user = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    router.refresh();
  }, [pathname]);

  return (

    user ? (
      <UserInfo user={user} />
    ) : (
      <div className="flex items-center justify-center h-screen w-screen pl-[20vw]">
        <RiLoader3Fill className="animate-spin h-10 w-10 text-white" />
      </div>
    )
  );
};

export default ClientPage;
