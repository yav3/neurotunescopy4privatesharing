import { useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { NavigationHeader } from '@/components/navigation/NavigationHeader';
import { Footer } from '@/components/Footer';

export function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#050607' }}>
      <NavigationHeader />
      
      <main className="flex items-center justify-center px-6 pt-32 pb-28">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)' }}
          >
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>

          <h1 className="text-3xl font-light text-white mb-4">
            Payment Successful!
          </h1>

          <p className="text-neutral-300 mb-8">
            Thank you for subscribing to NeuroTunes. You'll receive a confirmation email shortly.
          </p>

          <div className="space-y-4">
            <a
              href="/"
              className="block w-full py-3 rounded-full font-medium transition"
              style={{
                background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
                color: 'white',
                boxShadow: '0 0 30px rgba(6, 182, 212, 0.3)'
              }}
            >
              Back to Home
            </a>

            <a
              href="/goals"
              className="block w-full py-3 rounded-full font-medium transition"
              style={{
                border: '1px solid rgba(255, 255, 255, 0.10)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'white'
              }}
            >
              Start Listening
            </a>
          </div>

          {sessionId && (
            <p className="mt-8 text-xs text-neutral-600">
              Session ID: {sessionId}
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default PaymentSuccess;
