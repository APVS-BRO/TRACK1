
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
      <main className="flex h-full flex-col items-center justify-center  bg-gradient-to-br from-gray-800 to-gray-900 bg-[length:100%_100%] animate-scaleBackground">
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