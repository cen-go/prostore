import Link from "next/link"
import Image from "next/image"
import { Metadata } from "next"
import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { APP_NAME } from "@/lib/constants"
import CredentialsSignInForm from "@/components/credentials-signin-form"

export const metadata: Metadata = {
  title: "Sign in"
}

export default async function SignInPage() {
  const session = await auth();

  if (session) {
    return redirect("/");
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
          <CardTitle className="text-center">Sign in</CardTitle>
          <CardDescription className="text-center">
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CredentialsSignInForm />
        </CardContent>
      </Card>
    </div>
  );
}