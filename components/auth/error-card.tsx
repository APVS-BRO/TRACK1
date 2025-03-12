
import { CardWrapper } from "./Cardwrapper";
import { BsExclamationTriangle } from "react-icons/bs";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
const font = Poppins({
  subsets: ['latin'],
  weight: ["600"]
});


export const ErrorCard =()=>{

    return(
         <main className="flex h-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-black via-gray-900 to-gray-600">
              <div className="space-y-6 text-center">
                <h1 className={cn("flex items-center justify-center gap-2 text-6xl font-semibold text-white drop-shadow-md", font.className)}></h1>
       <CardWrapper 
       headerLabel="Oops! Something went wrong!"
       backButtonHref="/auth/login"
       backButtonLabel="Back to login"
       >
<div className="w-full flex justify-center items-center">
<BsExclamationTriangle className="text-destructive"/>
</div>
       </CardWrapper>
       
       </div>
       </main>
    )

}