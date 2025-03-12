"use client";
import { UserInfo } from "@/components/user-info";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const ClientPage = () => {
  const user = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname(); 

  useEffect(() => {
    router.refresh();
  }, [pathname]); 

  return (
    <div>
      {user ? (
        <UserInfo label="Profile" user={user} />
      ) : (
        <p>Loading...</p> 
      )}
    </div>
  );
};

export default ClientPage;
