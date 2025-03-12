import { ExtendedUser } from "@/next-auth"
import { Card, CardContent, CardHeader } from "./ui/card";

interface UserInfoProps{
user?: ExtendedUser;
label:string;
};


export const UserInfo = ({
    user,
    label
}:UserInfoProps) =>{
    return (
    <Card className="sm:w-[280px] md:w-[300px] lg:w-[330px] xl:w-[350px] 2xl:w-[380px]  w-[clamp(330px,70vw,630px)] shadow-md mx-auto">
            <CardHeader>
                <p className="text-2xl font-semibold text-center"></p>
                {label}
            </CardHeader>
            <CardContent className="space-y-4">
            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <p className="text-sm font-medium">
                Name
            </p>
            <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
            {user?.name}
            </p>
            </div>
            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <p className="text-sm font-medium">
                Email
            </p>
            <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
            {user?.email}
            </p>
            </div>
            </CardContent>
        </Card>
    )
}