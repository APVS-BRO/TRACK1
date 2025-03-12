"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useTransition } from "react";
import { LoginSchema } from "@/schemas";
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
import { login } from "@/actions/login";
import { useSearchParams, useRouter } from "next/navigation"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import Link from "next/link";

export const LoginForm = () => {
  const searchParams = useSearchParams();

  const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
    ? "Email already in use with different provider"
    : "";
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      code:""
    },
  });

  const router = useRouter();

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values)
        .then((data) => {
          if (data?.error) { form.reset(); setError(data.error) };
          if (data?.success) {
            form.reset()
            setSuccess(data.success);
            if (data.success === "Login successful!") {
              router.push(DEFAULT_LOGIN_REDIRECT);
            }

          }
          if (data?.twoFactor) {
            setShowTwoFactor(true);
            form.setValue("code", ""); // Ensure "code" input is empty but form isn't reset
          }
        })
        .catch(() => setError("Something went wrong"));
    });
  };
  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocials
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Input */}
          {showTwoFactor && (
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Two Factor Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123456"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {!showTwoFactor && (

            <>
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
                    <Button size="sm" variant="link" asChild className="px-0 font-normal">
                      <Link href="/auth/reset">
                        Forgot Password?
                      </Link>
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>)}
          {/* Error & Success Messages */}
          <FormError message={urlError || error} />
          <FormSuccess message={success} />

          <Button
            type="submit"
            disabled={isPending}
            className="w-full"
          >
            {isPending ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};