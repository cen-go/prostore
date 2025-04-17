import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import Menu from "@/components/shared/header/menu";
import Footer from "@/components/footer";
import MainNav from "./main-nav";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex flex-col h-screen">
        <header className="border-b w-full mx-auto">
          <div className="flex-between wrapper">
            <div className="flex-start">
              <Link href="/">
                <Image
                  src="/images/logo.svg"
                  alt={`${APP_NAME} logo`}
                  height={48}
                  width={48}
                  priority
                />
              </Link>
              <MainNav className="mx-6" />
            </div>
            <Menu />
          </div>
        </header>
        <main className="flex-1 wrapper">{children}</main>
        <Footer />
      </div>
    </>
  );
}