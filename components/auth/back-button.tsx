"use-client";   

import Link from "next/link";
import { Button } from "../ui/button";

interface BackButtonProps { href: string; label: string; };

export const BackButton = ({href,label}:BackButtonProps)=> {
return(
    <Button size='sm' variant={'link'} className={" font-normal w-full"} asChild onClick={() => console.log('Back')}>
        <Link href={href}>
        {label}
        </Link>
    </Button>
)

};