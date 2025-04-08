import { Fragment } from "react";
import { cn } from "@/lib/utils";

export default function CheckoutSteps({ current = 0 }) {
  return (
    <div className="flex-between flex-col md:flex-row  space-x-2 space-y-2 mb-10">
      {["User Login", "Shipping Address", "Payment Method", "Place Order"].map(
        (step, index) => (
          <Fragment key={step}>
            <div
              className={cn(
                "px-7 py-2 w-56 rounded-full text-center text-sm",
                index === current ? "bg-secondary" : ""
              )}
            >
              {step}
            </div>
            {step !== "Place Order" ? (
              <hr className="w-16 md:w-32 lg:w-40 border-t border-gray-300 mx-2" />
            ) : <hr className="w-0" />}
          </Fragment>
        )
      )}
    </div>
  );
}
