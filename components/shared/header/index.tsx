import Link from "next/link";
import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import Menu from "./menu";
import CategoryDrawer from "./category-drawer";
import Search from "./search";

export default function Header() {
  return (
    <header className="w-full border-b">
      <div className="flex-between wrapper">
        <div className="flex-start">
          <CategoryDrawer />
          <Link href="/" className="flex-start mx-2">
            <Image
              src="/images/logo.png"
              alt={`${APP_NAME} logo`}
              height={48}
              width={48}
              priority
            />
            <span className="font-bold text-2xl md:block hidden">
              {APP_NAME}
            </span>
          </Link>
        </div>
        <Search />
        <Menu />
      </div>
    </header>
  );
}
