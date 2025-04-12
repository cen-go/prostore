import { formatCurrency } from "@/lib/utils";
import { CartItem, OrderItem } from "@/types";

export default function OrderSummary({
  items,
  itemsPrice,
  taxPrice,
  shippingPrice,
  totalPrice,
}: {
  items: CartItem[] | OrderItem[];
  itemsPrice: string;
  taxPrice: string;
  shippingPrice: string;
  totalPrice: string;
}) {
  return (
    <>
      <div className="pb-3 gap-4 flex justify-between">
        <span>Items ({items.reduce((sum, item) => sum + item.qnty, 0)}): </span>
        <span className="font-bold">{formatCurrency(itemsPrice)}</span>
      </div>
      <div className="pb-3 gap-4 flex justify-between">
        <span>Tax: </span>
        <span className="font-bold">{formatCurrency(taxPrice)}</span>
      </div>
      <div className="pb-3 gap-4 flex justify-between border-b-1">
        <span>Shipping: </span>
        <span className="font-bold">{formatCurrency(shippingPrice)}</span>
      </div>
      <div className="pb-3 gap-4 flex justify-between mt-3 text-xl">
        <span>Total: </span>
        <span className="font-bold text-emerald-500">
          {formatCurrency(totalPrice)}
        </span>
      </div>
    </>
  );
}