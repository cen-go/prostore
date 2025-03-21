import Link from "next/link";
import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import Menu from "./menu";

export default function Header() {
  return (
    <header className="w-full border-b">
      <div className="flex-between wrapper">
        <div className="flex-start">
          <Link href="/" className="flex-start">
            <Image
              src="/images/logo.svg"
              alt={`${APP_NAME} logo`}
              height={48}
              width={48}
              priority
            />
            <span className="font-bold text-2xl ml-3 md:block hidden">
              {APP_NAME}
            </span>
          </Link>
        </div>
        <Menu />
      </div>
    </header>
  );
}
