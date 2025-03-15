import { ExtendedUser } from "@/next-auth"
import Image from "next/image";
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";

interface UserInfoProps {
    user?: ExtendedUser;
};

const questionDone = {
    done: 32,
    correct: 30,
    wrong: 2,
    correctnessPercentage: 93.75
}

export const UserInfo = ({
    user,
}: UserInfoProps) => {
    return (
        <main className="pl-[20vw] max-w-screen-xl w-full min-h-screen flex flex-col gap-24 h-full px-24 py-16 overflow-auto">
            <div className="flex items-center justify-between">
                <div className="flex flex-row gap-7 items-center">
                    <Image src={user?.image!} width={120} height={120} alt="user" className="w-[120px] h-[120px]" />
                    <div className="flex flex-col gap-2">
                        <h2 className="text-3xl font-semibold text-white">{user?.name}</h2>
                        <pre className="text-sm opacity-80 font-semibold text-white font-mono">{user?.email}</pre>
                    </div>
                </div>
                <div className="bg-white/20 rounded-xl p-2 px-3 flex flex-col">
                    <p className="text-white/80 text-sm">Badges</p>
                    <div className="flex flex-row gap-3 px-3 items-start justify-start py-4">
                        <Image src="/completed.svg" width={30} height={30} alt="completed" className="w-[30px] h-[30px]" />
                        <Image src="/started.svg" width={30} height={30} alt="completed" className="w-[30px] h-[30px]" />
                        <p className="text-white/50 font-bold text-lg">+2</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-5 w-full">
                <div className="flex flex-row gap-4 items-center justify-between">
                    <p className="text-lg opacity-70 text-white font-medium">Questions</p>
                    <p className="text-3xl font-bold text-white">{questionDone.done}</p>
                </div>

                <div className={`flex rounded-full w-full`}>
                    <div style={{ width: `${questionDone.correctnessPercentage}%` }} className="flex flex-col gap-2 items-center justify-center">
                        <div className={`h-full border-green-500 rounded-full flex justify-end bg-green-500/20 border-2 w-full`}  >
                            <div className="p-0.5  rounded-full w-fit aspect-square h-8 flex items-center justify-center"><FaCheck className="text-base text-green-500" /></div>
                        </div>
                        <p className="text-green-500 font-bold">{questionDone.correct}</p>
                    </div>
                    <div style={{ width: `${100 - questionDone.correctnessPercentage}%` }} className="flex flex-col gap-2 items-center justify-center">
                        <div className={`h-full border-red-500 rounded-full flex justify-end bg-red-500/20 border-2 w-full`} >
                            <div className="p-0.5 rounded-full w-fit aspect-square h-8 flex items-center justify-center"><ImCross className="text-base text-red-500" /></div>
                        </div>
                        <p className="text-red-500 font-bold">{questionDone.wrong}</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-5 w-full">
                <div className="flex flex-row gap-4 items-center justify-between">
                    <p className="text-lg opacity-70 text-white font-medium">Badges</p>
                </div>
            <div className="flex flex-row gap-6 items-start justify-start">
                    <Image src="/completed.svg" width={90} height={90} alt="completed" className="w-[90px] h-[90px]" />
                    <Image src="/started.svg" width={90} height={90} alt="started" className="w-[90px] h-[90px]" />
                    <Image src="/silver.svg" width={90} height={90} alt="silver" className="w-[90px] h-[90px]" />
                    <Image src="/new.png" width={90} height={90} alt="getting started" className="w-[90px] h-[90px] object-contain" />
            </div>
            </div>
        </main>
    )
}