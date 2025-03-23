import { cn } from "@/lib/utils";

export default function ProductPrice({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  // ensure 2 decimal digits
  const stringValue = value.toFixed(2);
  // Get the integer and float
  const [intValue, floatValue] = stringValue.split(".");

  return (
    <p className={cn("text-2xl", className)}>
      <span className="text-xs align-super">$</span>
      <span>{intValue}</span>
      <span className="text-xs align-super">.{floatValue}</span>
    </p>
  );
}
