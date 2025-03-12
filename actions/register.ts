"use server";

import { z } from "zod";
import { RegisterSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { generateVerficationToken } from "@/lib/tokens";
import { sendVerficationEmail } from "@/lib/mail";
export async function register(values: z.infer<typeof RegisterSchema>) {
  // Validate the input using Zod's safeParse method
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    // Format the error messages for easier consumption on the client side
    const formattedErrors = validatedFields.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join(', ');
    return { error: formattedErrors };
  }


    const { email, password, name } = values;

    // Trim and normalize inputs
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedName = name.trim();

    // Check if user already exists
    const existingUser = await getUserByEmail(sanitizedEmail);

    if (existingUser) {
      return { error: "User already exists" };
    }

    // Hash password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    await db.user.create({
      data: {
        email: sanitizedEmail,
        name: sanitizedName,
        password: hashedPassword,
      },
    });
const verificationToken = await generateVerficationToken(email);
   await sendVerficationEmail(
    verificationToken.email,
    verificationToken.token
   )
return { success: true };
   
}
