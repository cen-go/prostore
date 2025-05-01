"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { Input } from "../ui/input";

export default function AdminSearch() {
  const pathname = usePathname();
  
  const formActionUrl = pathname.includes("/admin/orders")
    ? "/admin/orders"
    : pathname.includes("/admin/users")
    ? "/admin/users"
    : "/admin/products";
  
  const searchParams = useSearchParams();
  const [queryValue, setQueryValue] = useState(searchParams.get("query") || "");

  useEffect(() => {
    setQueryValue(searchParams.get("query") || "");
  }, [searchParams]);

  return (
    <form action={formActionUrl} method="GET">
      <Input
        type="search"
        name="query"
        placeholder="Search by name..."
        className="md:w-[150px] lg:w-[300px]"
        value={queryValue}
        onChange={(e) => setQueryValue(e.target.value)}
      />
      <button type="submit" className="sr-only">Search</button>
    </form>
  );
}
