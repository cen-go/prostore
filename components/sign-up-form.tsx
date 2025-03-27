"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { signUpUser } from "@/lib/actions/user.actions";

function SignUpButton() {
  const { pending } = useFormStatus();

  return (
    <div>
      <Button className="w-full" disabled={pending}>
        {!pending ? "Sign Up" : "Submitting..."}
      </Button>
    </div>
  );
}

export default function SignUpForm() {
  const [formState, formAction] = useActionState(signUpUser, {
    success: false,
    message: "",
    errors: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <form action={formAction}>
      <Input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            defaultValue=""
          />
          {formState.errors?.name && <p className="text-destructive">{formState.errors?.name}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="text"
            required
            autoComplete="email"
            defaultValue=""
          />
          {formState.errors?.email && <p className="text-destructive">{formState.errors?.email}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            defaultValue=""
          />
          {formState.errors?.password && <p className="text-destructive">{formState.errors?.password}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            defaultValue=""
          />
          {formState.errors?.confirmPassword && <p className="text-destructive">{formState.errors?.confirmPassword}</p>}
        </div>
        <SignUpButton />
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
          Already have an account?{" "}
          <Link href="/sign-in" target="_self" className="link">
            Click to Sign In.
          </Link>
        </div>
      </div>
    </form>
  );
}