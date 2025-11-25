import { useStripeCheckout } from '@/hooks/useStripeCheckout';
import { Check, Loader2 } from 'lucide-react';

interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  priceId: string;
  isPopular?: boolean;
  buttonText?: string;
  quantity?: number;
  onCustomClick?: () => void;
}

export function PricingCard({
  title,
  price,
  period,
  description,
  features,
  priceId,
  isPopular = false,
  buttonText = 'Get Started',
  quantity = 1,
  onCustomClick,
}: PricingCardProps) {
  const { createCheckoutSession, loading, error } = useStripeCheckout();

  const handlePurchase = async () => {
    if (onCustomClick) {
      onCustomClick();
      return;
    }
    
    await createCheckoutSession({
      priceId,
      quantity,
      mode: 'subscription',
    });
  };

  return (
    <div
      className="rounded-3xl p-8 relative"
      style={{
        background: isPopular 
          ? 'rgba(6, 182, 212, 0.08)' 
          : 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(24px)',
        border: isPopular
          ? '1px solid rgba(6, 182, 212, 0.30)'
          : '1px solid rgba(255, 255, 255, 0.10)',
        boxShadow: isPopular
          ? '0 0 60px rgba(6, 182, 212, 0.20)'
          : '0 0 40px rgba(0, 0, 0, 0.8)',
        transform: isPopular ? 'scale(1.05)' : 'scale(1)'
      }}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-medium"
          style={{
            background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
            color: 'white'
          }}
        >
          Most Popular
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-2xl font-light text-white mb-2">{title}</h3>
        <div className="flex items-baseline mb-2">
          <span className="text-5xl font-light text-white">{price}</span>
          <span className="text-neutral-400 ml-2">{period}</span>
        </div>
        <p className="text-sm text-neutral-400">{description}</p>
      </div>

      <ul className="space-y-4 mb-8">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <span className="text-neutral-300 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={handlePurchase}
        disabled={loading && !onCustomClick}
        className="w-full px-6 py-3 rounded-full text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        style={{
          background: isPopular
            ? 'linear-gradient(135deg, #06b6d4, #2563eb)'
            : 'rgba(255, 255, 255, 0.05)',
          border: isPopular ? 'none' : '1px solid rgba(255, 255, 255, 0.10)',
          color: 'white',
          boxShadow: isPopular ? '0 0 30px rgba(6, 182, 212, 0.3)' : 'none'
        }}
      >
        {loading && !onCustomClick ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          buttonText
        )}
      </button>

      {error && (
        <p className="mt-4 text-sm text-red-400 text-center">{error}</p>
      )}
    </div>
  );
}
