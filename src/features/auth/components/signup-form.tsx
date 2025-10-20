"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const router = useRouter();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    authClient.signUp.email(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          toast.success("Registered successfully!");
          router.push("/");
        },
        onError: (ctx) => {
          toast.error(`Registration failed: ${ctx.error.message}`);
        },
      },
    );
  };

  const isPending = form.formState.isSubmitting;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="mb-4 text-center text-2xl">
          Get Started with Automa
        </CardTitle>
        <CardDescription className="text-center text-sm">
          Please enter your email and password to register.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Button
              variant="outline"
              className="w-full"
              disabled={isPending}
              type="button"
            >
              <Image
                src="/logos/github.svg"
                alt="Github"
                width={16}
                height={16}
              />
              Continue with Github
            </Button>
            <Button
              variant="outline"
              className="w-full"
              disabled={isPending}
              type="button"
            >
              <Image
                src="/logos/google.svg"
                alt="Google"
                width={16}
                height={16}
              />
              Continue with Google
            </Button>

            <Separator />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
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
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Signing up..." : "Sign Up"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="flex w-full items-center justify-center text-sm">
          Already have an account?
          <Link href="/login" className="ml-1 font-bold underline">
            Log In
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
