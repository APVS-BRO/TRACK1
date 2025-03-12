"use client";
import  { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { Avatar,AvatarImage,AvatarFallback } from "@radix-ui/react-avatar";
import { FaUser } from "react-icons/fa";
import { useCurrentUser } from "@/hooks/use-current-user";
import { LogoutButton } from "./logout-button";
import { BiExit } from "react-icons/bi";


export const UserButton = () =>{
    const user = useCurrentUser();
    return (
      <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar  className="">
            <AvatarImage src={user?.image || ""}/> 
            <AvatarFallback className="bg-sky-500">
            <FaUser className="bg-slate-50" />
            </AvatarFallback>
          
            
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        <LogoutButton>
           <DropdownMenuItem>
          <BiExit className="h-4 w-4 mr-2 text-destructive" />
          Logout
           </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
      </DropdownMenu>
    )
}