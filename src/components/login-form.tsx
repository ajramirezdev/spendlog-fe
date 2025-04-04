"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginInput, loginSchema } from "@/app/login/loginSchema";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoadingSpinner from "./ui/loading-spinner";
import { Icons } from "@/components/icons";
import { useUserStore } from "@/stores/useUserStore";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { fetchUser } = useUserStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      setIsLoading(false);
      await fetchUser();
      router.push("/");
    } catch (error) {
      setErrorMessage("Invalid Credentials");
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google`;
  };

  const handleDiscordAuth = async () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/discord`;
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold">Login</h1>
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
              <div className="relative pt-3">
                {errorMessage && (
                  <p className="text-xs absolute text-destructive -top-3">
                    * {errorMessage}
                  </p>
                )}
                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={isLoading}
                >
                  Login
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
                  className="w-full cursor-pointer"
                  disabled
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
                  className="w-full cursor-pointer"
                  onClick={handleDiscordAuth}
                >
                  <Icons.discord />
                  <span className="sr-only">Login with Discord</span>
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Button
                  onClick={() => router.push("/signup")}
                  className="p-0 cursor-pointer"
                  variant="link"
                  type="button"
                >
                  Sign up
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
