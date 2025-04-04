"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpInput, signUpSchema } from "@/app/signup/signupSchema";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import LoadingSpinner from "./ui/loading-spinner";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpInput) => {
    try {
      setIsLoading(true);
      const { confirmPassword, ...otherFields } = data;
      const response = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(otherFields),
      });

      if (!response.ok) {
        throw new Error("Signup failed");
      }

      setIsLoading(false);
      router.push("/");
    } catch (error: any) {
      setErrorMessage(error.message);
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    window.location.href = "http://localhost:3000/api/auth/google";
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold">Create an account</h1>
              </div>
              <div className="flex gap-2 relative">
                <div className="grid gap-3 flex-1">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input {...register("firstName")} />
                </div>
                <div className="grid gap-3 flex-1">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input {...register("lastName")} />
                </div>
                {(errors.firstName || errors.lastName) && (
                  <p className="text-xs text-destructive absolute -bottom-5">
                    * {errors.firstName?.message ?? errors.lastName?.message}
                  </p>
                )}
              </div>
              <div className="grid gap-3 relative">
                <Label htmlFor="email">Email</Label>
                <Input {...register("email")} placeholder="example@email.com" />
                {errors.email && (
                  <p className="text-xs text-destructive absolute -bottom-5">
                    * {errors.email.message}
                  </p>
                )}
              </div>
              <div className="grid gap-3 relative">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input {...register("password")} type="password" />
                {errors.password && (
                  <p className="text-xs text-destructive absolute -bottom-5">
                    * {errors.password.message}
                  </p>
                )}
              </div>
              <div className="grid gap-3 relative">
                <div className="flex items-center">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                </div>
                <Input {...register("confirmPassword")} type="password" />
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive absolute -bottom-5">
                    * {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <div className="relative pt-3">
                {errorMessage && (
                  <p className="text-xs absolute text-destructive -top-3">
                    * {errorMessage}
                  </p>
                )}
                <Button type="submit" className="w-full cursor-pointer mt-3">
                  Sign up
                </Button>
              </div>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  type="button"
                  className="w-full  cursor-pointer"
                >
                  <Icons.gitHub />
                  <span className="sr-only">Login with GitHub</span>
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  className="w-full cursor-pointer"
                  onClick={handleGoogleAuth}
                >
                  <Icons.google />
                  <span className="sr-only">Login with Google</span>
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  className="w-full  cursor-pointer"
                >
                  <Icons.discord />
                  <span className="sr-only">Login with Discord</span>
                </Button>
              </div>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Button
                  onClick={() => router.push("/login")}
                  className="p-0 cursor-pointer"
                  variant="link"
                  type="button"
                >
                  Sign in
                </Button>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/images/black-sand.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      {isLoading && (
        <div className="absolute inset-0 m-auto flex justify-center items-center bg-black/30 backdrop-blur-xs z-50">
          <LoadingSpinner size={60} />
        </div>
      )}
    </div>
  );
}
