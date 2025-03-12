const AuthLayout = ({ children }:{children:React.ReactNode}) => {

return (
    <div className="h-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-black via-gray-900 to-gray-600">
        {children}
    </div>
)

};

export default AuthLayout;