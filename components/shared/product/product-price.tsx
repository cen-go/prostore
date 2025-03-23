import { cn } from "@/lib/utils";

export default function ProductPrice({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {

  // Get the integer and float
  const [intValue, floatValue] = value.split(".");

  return (
    <p className={cn("text-2xl", className)}>
      <span className="text-xs align-super">$</span>
      <span>{intValue}</span>
      <span className="text-xs align-super">.{floatValue}</span>
    </p>
  );
}
