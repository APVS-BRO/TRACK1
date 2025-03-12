import NextAuth from "next-auth"
import {PrismaAdapter} from "@auth/prisma-adapter"
import { getUserById } from "./data/user"
import authConfig from "./auth.config"
import { db } from "./lib/db"
import { UserRole } from "@prisma/client"
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation"

// Extend the session user type to include the role property


export const { auth, handlers, signIn, signOut } = NextAuth({
 pages:{
signIn:"/auth/login",
error:"/auth/error"
 },
  events:{
async linkAccount({user}){
  await db.user.update({
    where:{id: user.id},
    data: {emailVerified:new Date()}
  })
}
 },
  callbacks:{
  async signIn({user,account}){

    if(account?.provider !== "credentials") return true;
    if (!user.id) throw new Error("User ID is undefined");
    const existingUser = await getUserById(user.id);
    if(!existingUser?.emailVerified) return false;
    
    if(existingUser.isTwoFactorEnabled){

const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

if(!twoFactorConfirmation) return false;

await db.twoFactorConfirmation.delete({
  where: {id:twoFactorConfirmation.id}
})
    }
   
    return true;
  },
  async session({token,session}){
if(token.sub && session.user)
  {
    session.user.id=token.sub;

  }
  if(token.role && session.user ){
    session.user.role =token.role as UserRole;
  }
  return session;
  },
  async jwt({token}){
    if(!token.sub)return token;
    const existingUser =await getUserById(token.sub);

    if(!existingUser) return token;
token.role = existingUser.role;
    return token
  }
 },
  adapter: PrismaAdapter(db),
  session:{strategy: "jwt"},
...authConfig,

})