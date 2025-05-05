import { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/shared/product/product-card";
import { getAllProducts, getAllCategories } from "@/lib/actions/product.actions";

const prices = [,
  {name: "$1 tp $50", value: "1-50"},
  {name: "$51 tp $100", value: "51-100"},
  {name: "$101 tp $200", value: "101-200"},
  {name: "$201 tp $500", value: "201-500"},
  {name: "$501 tp $1000", value: "501-1000"},
];

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    q?: string;
  }>;
}) {
  const queryParams = await searchParams;
  const category = queryParams.category || "all";
  const q = queryParams.q || "all";

  const metadata: Metadata = {
    title: `Search ${q !== "all" ? q : ""}${
      category !== "all" ? " in " + category : ""
    }`,
  };

  return metadata;
}

const ratings = ["4", "3", "2", "1"];

const sortOrders = ["newest", "lowest", "highest", "rating"];

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    q?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const queryParams = await searchParams;
  const category = queryParams.category || "all";
  const q = queryParams.q || "all";
  const price = queryParams.price || "all";
  const rating = queryParams.rating || "all";
  const sort = queryParams.sort || "newest";
  const page = queryParams.page || "1";

  // Construct the filter url
  function getFilterUrl({
    ctg,
    srt,
    pr,
    rt,
    pg,
  }: {
    ctg?: string;
    srt?: string;
    pr?: string;
    rt?: string;
    pg?: string;
  }) {
    const params = {category, q, price, rating, sort, page,};

    if (ctg) params.category = ctg;
    if (pr) params.price = pr;
    if (rt) params.rating = rt;
    if (srt) params.sort = srt;
    if (pg) params.page = pg;

    return `/search?${new URLSearchParams(params).toString()}`;
  }

  const products = await getAllProducts({
    page: Number(page),
    category,
    query: q,
    price,
    rating,
    sort,
  });

  const categories = await getAllCategories();

  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      {/* FILTERS */}
      <div className="filter-links">
        {/* CATEGORY FILTERS */}
        <div className="text-lg mb-1 mt-3">Category</div>
        <div className="ps-3">
          <ul className="space-y-1">
            <li>
              <Link
                href={getFilterUrl({ ctg: "all" })}
                className={`${
                  category === "all" || category === "" ? "font-bold" : ""
                }`}
              >
                Any
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.category}>
                <Link
                  href={getFilterUrl({ ctg: c.category })}
                  className={`${category === c.category ? "font-bold" : ""}`}
                >
                  {c.category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* PRICE FILTERS */}
        <div className="text-lg mb-1 mt-5">Price</div>
        <div className="ps-3">
          <ul className="space-y-1">
            <li>
              <Link
                href={getFilterUrl({ pr: "all" })}
                className={`${
                  price === "all" || price === "" ? "font-bold" : ""
                }`}
              >
                Any
              </Link>
            </li>
            {prices.map((p) => (
              <li key={p?.value}>
                <Link
                  href={getFilterUrl({ pr: p?.value })}
                  className={`${price === p?.value ? "font-bold" : ""}`}
                >
                  {p?.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* PRICE FILTERS */}
        <div className="text-lg mb-1 mt-5">Customer Rating</div>
        <div className="ps-3">
          <ul className="space-y-1">
            <li>
              <Link
                href={getFilterUrl({ rt: "all" })}
                className={`${
                  rating === "all" || rating === "" ? "font-bold" : ""
                }`}
              >
                Any
              </Link>
            </li>
            {ratings.map((r) => (
              <li key={r}>
                <Link
                  href={getFilterUrl({ rt: r })}
                  className={`${rating === r ? "font-bold" : ""}`}
                >
                  {r} stars & up
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* PRODUCTS GRID */}
      <div className="md:col-span-4 space-y-4">
        {/* FILTERS & SORTING */}
        <div className="flex-between items-start flex-col lg:flex-row my-4">
          <div className="flex items-center text-sm">
            {q !== "all" && q !== "" && `Query: ${q}, `}
            {category !== "all" && category !== "" && `Category: ${category}, `}
            {price !== "all" && price !== "" && `Price: ${price}, `}
            {rating !== "all" && rating !== "" && `Rating: ${rating} & up,`}
            &nbsp;
            {((q !== "all" && q !== "") ||
              (category !== "all" && category !== "") ||
              (price !== "all" && price !== "") ||
              (rating !== "all" && rating !== "")) && (
              <Link href="/search" className="underline">
                Clear filters
              </Link>
            )}
          </div>
          <div>
            Sort by:
            {sortOrders.map((s) => (
              <Link
                key={s}
                href={getFilterUrl({ srt: s })}
                className={sort === s ? "font-bold mx-1 underline" : "mx-1"}
              >{s}</Link>
            ))}
          </div>
        </div>
        {/* PRODUCT CARDS */}
        {products.data.length > 0 ? (
          <div className="grid gap-3 grid-cols-1 md:grid-cols-3">
            {products.data.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        ) : (
          <div>
            <p>No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}
