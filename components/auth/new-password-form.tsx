"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useTransition } from "react";
import {  NewPasswordSchema } from "@/schemas";
import { CardWrapper } from "./Cardwrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { newPassword} from "@/actions/new-password";
import { useRouter } from "next/navigation"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { useSearchParams } from "next/navigation";

export const NewPasswordForm = () => {
const searchParams = useSearchParams();
const token = searchParams.get("token");


  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const router = useRouter();

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError("");
    setSuccess("");
  
    startTransition(() => {
      newPassword(values, token)
        .then((data) => {
          if (data?.error) setError(data.error);
          if (data?.success) {
            setSuccess(data.success);
            if (data.success === "Login successful!") {
              router.push(DEFAULT_LOGIN_REDIRECT);
            }
          }
        })
        .catch(() => setError("Something went wrong"));
    });
  };
  return (
    <>
      <div className="h-full flex items-center justify-center  bg-gradient-to-br from-gray-800 to-gray-900 bg-[length:100%_100%] animate-scaleBackground">
    <CardWrapper
      headerLabel="Enter your new password"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Input */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Input */}
       

          {/* Error & Success Messages */}
          <FormError message={ error} />
          <FormSuccess message={success} />

          <Button 
            type="submit" 
            disabled={isPending} 
            className="w-full"
          >
            {isPending ? "resetting..." : "Send reset password "}
          </Button>
        </form>
      </Form>
    </CardWrapper>
    </div>
    </>
  );
};