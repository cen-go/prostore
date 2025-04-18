"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

type PaginationProps = {
  page: number | string;
  totalPages: number;
  urlParamName?: string;
}

export default function Pagination({
  page,
  totalPages,
  urlParamName,
}: PaginationProps) {
  const router = useRouter()
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pages: number[] = []

  for (let index = 1; index <= totalPages; index++) {
    pages.push(index);
  }

  function handlePagination(btnType: "next" | "prev") {
    const targetPage = btnType === "next" ? Number(page) +1 : Number(page) - 1;

    const newParams = new URLSearchParams(searchParams);
    newParams.set(urlParamName || "page", targetPage.toString());

    router.push(`${pathname}?${newParams.toString()}`);
  }

  return (
    <div className="flex gap-2 items-center justify-center mt-8">
      <Button
        size="sm"
        variant="outline"
        className="w-28 mr-4"
        onClick={() => handlePagination("prev")}
        disabled={Number(page) <= 1}
      >
        Previous
      </Button>
      {pages.map((p) => (
        <Link
          key={p}
          href={`${pathname}?${urlParamName || "page"}=${p.toString()}`}
          className={cn("px-2", Number(page) === p ? "font-bold" : "")}
        >
          {p}
        </Link>
      ))}
      <Button
        size="sm"
        variant="outline"
        className="w-28 ml-4"
        onClick={() => handlePagination("next")}
        disabled={Number(page) === totalPages}
      >
        Next
      </Button>
    </div>
  );
}