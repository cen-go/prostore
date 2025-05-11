"use client"

import { FormEvent, useState } from 'react';
import {loadStripe} from '@stripe/stripe-js';
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
  LinkAuthenticationElement,
} from '@stripe/react-stripe-js';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { SERVER_URL } from '@/lib/constants';

export default function StripePayment({
  priceInCents,
  orderId,
  clientSecret,
}: {
  priceInCents: number;
  orderId: string;
  clientSecret: string;
}) {

  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

  const {theme, systemTheme} = useTheme();

  // Stripe Form component
  const StripeForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const [isLoading, setIsloading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [email, setEmail] = useState("");

    async function handleSubmit(e: FormEvent) {
      e.preventDefault();

      if (stripe === null || elements === null || email === null) return;

      setIsloading(true);

      stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${SERVER_URL}/order/${orderId}/stripe-payment-success`
        },
      }).then(({error}) => {
        if (error?.type === "card_error" || error?.type === "validation_error") {
          setErrorMessage(error?.message ?? "An unknown error occured!");
        } else if (error) {
          setErrorMessage("An unknown error occured");
        }
      }).finally(() => setIsloading(false));
    }

    return (
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="text-lg">Stripe Checkout</div>
        {errorMessage && <div className="text-destructive">{errorMessage}</div>}
        <PaymentElement />
        <LinkAuthenticationElement onChange={(e) => setEmail(e.value.email)} />
        <Button
          className="w-full"
          disabled={stripe === null || elements === null || isLoading}
        >
          {isLoading ? "Purchasing..." : `Purchase ${formatCurrency(priceInCents / 100)}`}
        </Button>
      </form>
    );
  }

  return (
    <Elements
      options={{
        clientSecret,
        appearance: {
          theme:
            theme === 'dark'
              ? 'night'
              : theme === 'light'
              ? 'stripe'
              : systemTheme === 'light'
              ? 'stripe'
              : 'night',
        },
      }}
      stripe={stripePromise}
    >
      <StripeForm />
    </Elements>
  );
}
