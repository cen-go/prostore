import Link from "next/link"
import Image from "next/image"
import { Metadata } from "next"
import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { APP_NAME } from "@/lib/constants"
import SignUpForm from "@/components/sign-up-form"

export const metadata: Metadata = {
  title: "Sign up"
}

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl: string }>;
}) {
  const session = await auth();
  const { callbackUrl } = await searchParams;

  if (session) {
    return redirect(callbackUrl || "/");
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-3">
          <Link href="/" className="flex-center">
            <Image
              src="/images/logo.svg"
              width={80}
              height={80}
              alt={`${APP_NAME} logo`}
              priority
            />
          </Link>
          <CardTitle className="text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Enter your information below to sign up
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  );
}