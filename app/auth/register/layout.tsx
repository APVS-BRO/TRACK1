const AuthLayout = ({ children }:{children:React.ReactNode}) => {

return (
    <div className="h-full flex items-center justify-center  bg-gradient-to-br from-gray-800 to-gray-900 bg-[length:100%_100%] animate-scaleBackground">
        {children}
    </div>
)

};

export default AuthLayout;