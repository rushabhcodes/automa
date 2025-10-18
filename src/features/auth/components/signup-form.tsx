"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardTitle,
    CardContent,
    CardFooter,
    CardHeader,
    CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
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
            }
        )
    };

    const isPending = form.formState.isSubmitting;

    return (

        <Card>
            <CardHeader>
                <CardTitle className="text-2xl text-center mb-4">
                    Get Started with Automa
                </CardTitle>
                <CardDescription className="text-sm text-center">
                    Please enter your email and password to register.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <Button
                            variant="outline" className="w-full" disabled={isPending} type="button"
                        >
                            <Image src="/logos/github.svg" alt="Github" width={16} height={16} />
                            Continue with Github</Button>
                        <Button
                            variant="outline" className="w-full" disabled={isPending} type="button"
                        >
                            <Image src="/logos/google.svg" alt="Google" width={16} height={16} />
                            Continue with Google</Button>

                        <Separator />

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your name"
                                            {...field}
                                        />
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
                                        <Input
                                            placeholder="Enter your email"
                                            {...field}
                                        />
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
                <p className="w-full flex items-center justify-center text-sm">
                    Already have an account?
                    <Link href="/login" className="font-bold underline ml-1">
                        Log In
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
};