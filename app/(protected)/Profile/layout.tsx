import { Navbar } from "../_components/navbar";

interface ProtectedLayoutProps {
    children: React.ReactNode;
};

const ProtectedLayout = ({children}:ProtectedLayoutProps ) => {
    return ( 
        <div className="h-full w-full flex flex-col gap-y-10 items-center justify-center  bg-gradient-to-br from-gray-800 to-gray-900 bg-[length:100%_100%] animate-scaleBackground">
   <Navbar/>
    {children}
</div>
        
     );
}
 
export default ProtectedLayout;