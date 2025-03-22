import { SignupForm } from "@/components/signup-form";

export default function SignupPage() {
  return (
    <div className="bg-primary-foreground flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <SignupForm />
      </div>
    </div>
  );
}
