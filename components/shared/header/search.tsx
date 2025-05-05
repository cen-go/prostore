import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SelectContent,
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { getAllCategories } from "@/lib/actions/product.actions";
import { SearchIcon } from "lucide-react";

export default async function Search() {
  const categories = await getAllCategories();

  return (
    <form action="/search" method="GET">
      <div className="flex items-center w-full max-w-sm space-x-2">
        <Select name="category">
          <SelectTrigger className="w-[70px] md:w-[100px] lg:w-[180px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.category} value={c.category.toLowerCase()}>
                {c.category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          name="q"
          type="text"
          className="w-[120px] md:w-[150px] lg:w-[300px]"
          placeholder="Search..."
        />
        <Button size="sm">
          <SearchIcon />
        </Button>
      </div>
    </form>
  );
}
