"use server";

import { z } from "zod";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { generateVerficationToken,generateTwoFactorToken } from "@/lib/tokens";
import { getUserByEmail } from "@/data/user";
import { sendTwoFactorTokenEmail, sendVerficationEmail } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";


export async function login(values: z.infer<typeof LoginSchema>) {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, code } = validatedFields.data;
  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist!" };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerficationToken(existingUser.email);
    await sendVerficationEmail(verificationToken.email, verificationToken.token);
    return { success: "Confirmation email sent!" };
  }
if(existingUser.isTwoFactorEnabled && existingUser.email){
 if(code){
const twoFactorToken = await getTwoFactorTokenByEmail(
  existingUser.email
);
if(!twoFactorToken){
  return {error: "Invalid code!"}
}
if(twoFactorToken.token !== code){
  return {error: "Invalid code!"};

}
const hasExpired = new Date(twoFactorToken.expires)< new Date();
if(hasExpired){
  return {error: "Code expired!"}
}
await db.twoFactorToken.delete({
  where: {
    id: twoFactorToken.id
  },
})
const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
if(existingConfirmation){
  await db.twoFactorConfirmation.delete({
    where:{id: existingUser.id}
  });
}

await db.twoFactorConfirmation.create({
  data :{
    userId : existingUser.id
  }
})
 }else{
  const twoFactorToken = await generateTwoFactorToken(existingUser.email);
  await sendTwoFactorTokenEmail(
    twoFactorToken.email,
    twoFactorToken.token
  );
  return {twoFactor : true} }
}
  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // Disable server-side redirect
    });

    if (result?.error) {
      return { error: result.error };
    }

    return { success: "Login successful!" }; // Return success message
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }
}