import Image from "next/image"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Image
        src="/images/logo.svg"
        height={64}
        width={64}
        alt={`${APP_NAME} logo`}
        priority
      />
      <div className="p-6 w-1/3 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold mb-4">Not Found</h1>
        <p className="text-destructive">
          Could not find the requested page
        </p>
        <Button asChild variant="outline" className="mt-4 ml-2">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}