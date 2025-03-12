"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useTransition } from "react";
import { RegisterSchema } from "@/schemas";
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
import { register as registerAction } from "@/actions/register";

export const RegisterForm = () => {
  const [isPending, startTransition] = useTransition();

  const [registerError, setRegisterError] = useState<string>("");
  const [registerSuccess, setRegisterSuccess] = useState<string>("");

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setRegisterError("");
    setRegisterSuccess("");

    startTransition(async () => {
      try {
        const response = await registerAction(values);
        if (response.success) {
          setRegisterSuccess("Confirmation email sent! Verify now.");
        } else if (response.error) {
          setRegisterError(response.error);
        } else {
          setRegisterError("Registration failed");
        }
      } catch (error) {
        console.error("Registration error", error);
        setRegisterError("Registration failed");
      }
    });
  };

  return (
    <CardWrapper
      headerLabel="Create an account"
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
      showSocials
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage>{form.formState.errors.name?.message}</FormMessage>
              </FormItem>
            )}
          />
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
                <FormMessage>{form.formState.errors.email?.message}</FormMessage>
              </FormItem>
            )}
          />
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
                <FormMessage>
                  {form.formState.errors.password?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          {/* Render error and success messages conditionally */}
          {registerError && <FormError message={registerError} />}
          {registerSuccess && <FormSuccess message={registerSuccess} />}
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Registering..." : "Register"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
