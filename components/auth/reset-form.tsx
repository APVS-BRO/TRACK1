"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useTransition } from "react";
import {  ResetSchema } from "@/schemas";
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
import { reset } from "@/actions/reset";
import { useRouter } from "next/navigation"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const ResetForm = () => {

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const router = useRouter();

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError("");
    setSuccess("");
  
    startTransition(() => {
      reset(values)
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
      headerLabel="Forgot your password"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Input */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
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
            {isPending ? "resetting..." : "Send reset email "}
          </Button>
        </form>
      </Form>
    </CardWrapper>
    </div>
    </>
  );
};