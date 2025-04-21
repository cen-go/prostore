import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Unauthorized Access",
};

export default function UnauthorizedPage() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center space-y-4 h-[calc(100vh-200px)]">
      <h1 className="h2-bold text-3xl">Unauthorized Access</h1>
      <p className="text-muted-foreground">
        You do not have permission to view this page!
      </p>
      <Button size="lg" asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  )
}