import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CheckoutOptions {
  priceId: string;
  quantity?: number;
  mode?: 'subscription' | 'payment';
  customerEmail?: string;
}

export function useStripeCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCheckoutSession = async (options: CheckoutOptions) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: functionError } = await supabase.functions.invoke(
        'create-checkout-session',
        {
          body: options,
        }
      );

      if (functionError) throw functionError;

      if (data?.url) {
        // Redirect to Stripe Checkout in a new tab
        window.open(data.url, '_blank');
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return {
    createCheckoutSession,
    loading,
    error,
  };
}
