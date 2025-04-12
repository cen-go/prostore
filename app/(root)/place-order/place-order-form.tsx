"use client"

import { useRouter } from "next/navigation"
import { useFormStatus } from "react-dom"
import { createOrder } from "@/lib/actions/order.actions"
import { Button } from "@/components/ui/button"
import { Loader, Check } from "lucide-react"
import React from "react"

function PlaceOrderButton() {
  const formStatus = useFormStatus()

  return (
    <Button disabled={formStatus.pending} className="w-full">
      {formStatus.pending ? (
        <Loader className="animate-spin" />
      ): (
        <Check />
      )} Place Order
    </Button>
  );
}

export default function PlaceOrderForm() {
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const res = await createOrder();

    if (res.redirectTo) router.push(res.redirectTo);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <PlaceOrderButton />
    </form>
  )
}