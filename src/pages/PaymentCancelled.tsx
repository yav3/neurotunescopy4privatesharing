import { XCircle } from 'lucide-react';
import { NavigationHeader } from '@/components/navigation/NavigationHeader';
import { Footer } from '@/components/Footer';

export function PaymentCancelled() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#050607' }}>
      <NavigationHeader />
      
      <main className="flex items-center justify-center px-6 pt-32 pb-28">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
          >
            <XCircle className="w-10 h-10 text-red-500" />
          </div>

          <h1 className="text-3xl font-light text-white mb-4">
            Payment Cancelled
          </h1>

          <p className="text-neutral-300 mb-8">
            Your payment was cancelled. No charges were made to your account.
          </p>

          <div className="space-y-4">
            <a
              href="/subscribe"
              className="block w-full py-3 rounded-full font-medium transition"
              style={{
                background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
                color: 'white',
                boxShadow: '0 0 30px rgba(6, 182, 212, 0.3)'
              }}
            >
              View Pricing Again
            </a>

            <a
              href="/"
              className="block w-full py-3 rounded-full font-medium transition"
              style={{
                border: '1px solid rgba(255, 255, 255, 0.10)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'white'
              }}
            >
              Back to Home
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default PaymentCancelled;
