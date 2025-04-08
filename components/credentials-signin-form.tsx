"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { FcGoogle } from "react-icons/fc";
import { SignInWithCredentials } from "@/lib/actions/user.actions";

function SignInButton() {
  const { pending } = useFormStatus();

  return (
    <div>
      <Button className="w-full" disabled={pending}>
        {!pending ? "Sign In" : "Signing In..."}
      </Button>
    </div>
  );
}

export default function CredentialsSignInForm() {
  const [formState, formAction] = useActionState(SignInWithCredentials, {
    success: false,
    message: "",
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  function handleSignIn(provider: "google") {
    signIn(provider,{
      redirectTo: callbackUrl,
    })
  }

  return (
    <>
      <div className="flex flex-col items-center gap-2">
        <Button
        size="lg"
        variant="outline"
        className="flex-grow cursor-pointer w-full"
        onClick={() => handleSignIn("google")}
      >
        <FcGoogle/> Sign in with Google
      </Button>
      <p>OR</p>
      </div>
      <form action={formAction}>
        <Input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              defaultValue=""
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              defaultValue=""
            />
          </div>
          <SignInButton />
          {formState && !formState.success && formState.message && (
            <div className="text-sm text-destructive bg-destructive/10 px-3 py-1 border-1 border-destructive rounded-sm">
              {formState.message}
            </div>
          )}
          {formState && formState.success && (
            <div className="text-sm text-emerald-800 bg-emerald-600/10 px-3 py-1 border-1 border-emerald-800 rounded-sm">
              {formState.message}
            </div>
          )}
          <div className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" target="_self" className="link">
              Click to Sign Up.
            </Link>
          </div>
        </div>
      </form>
    </>
  );
}
