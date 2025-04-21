"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const linkClass = "text-sm font-medium transition-colors hover:text-primary"

const links = [
  {title: "Overview", href: "/admin/overview"},
  {title: "Products", href: "/admin/products"},
  {title: "Orders", href: "/admin/orders"},
  {title: "Users", href: "/admin/users"},
];

export default function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {

  const pathName = usePathname();


  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {links.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          className={cn(
            linkClass,
            pathName.includes(item.href)
              ? ""
              : "text-muted-foreground"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}