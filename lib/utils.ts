import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Conver prisma object into a regular JS object
export function convertToPlainObject<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

// Format number with decimal places
const NUMBER_FORMATTER = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatNumberWithDecimal(num: number): string {
  return NUMBER_FORMATTER.format(num);
}