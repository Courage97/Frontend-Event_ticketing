'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from '@/utils/axios';
import Link from 'next/link';
import { Ticket, CheckCircle, XCircle, AlertTriangle, Loader } from 'lucide-react';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get('reference');
  const [status, setStatus] = useState('verifying');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const token = localStorage.getItem('access');
        const res = await axios.get(`/events/verify-payment/?reference=${reference}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.message === 'Payment verified and event published.') {
          setStatus('success');
        } else {
          setStatus('partial');
        }
      } catch (err) {
        console.error(err);
        setStatus('failed');
      }
    };

    if (reference) {
      verifyPayment();
    } else {
      setStatus('invalid');
    }
  }, [reference]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex flex-col">
      {/* Header with logo */}
      <header className="w-full py-6 px-4 sm:px-6 lg:px-8 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-primary-gradient p-2 rounded-lg shadow-soft-sm group-hover:shadow-soft-md transition-all duration-300">
              <Ticket className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-display font-bold text-neutral-900 dark:text-white">EventHub</h1>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-soft-lg p-8 relative overflow-hidden">
            {status === 'success' && (
              <div className="absolute top-0 right-0 left-0 h-2 bg-success-500" />
            )}
            {status === 'partial' && (
              <div className="absolute top-0 right-0 left-0 h-2 bg-warning-500" />
            )}
            {status === 'failed' || status === 'invalid' ? (
              <div className="absolute top-0 right-0 left-0 h-2 bg-error-500" />
            ) : null}
            
            <div className="flex flex-col items-center text-center">
              {status === 'verifying' && (
                <>
                  <div className="mb-6 bg-primary-50 dark:bg-primary-900/20 p-4 rounded-full">
                    <Loader className="h-12 w-12 text-primary-500 animate-spin" />
                  </div>
                  <h2 className="text-xl font-heading font-semibold text-neutral-900 dark:text-white mb-2">
                    Verifying Payment
                  </h2>
                  <p className="text-neutral-600 dark:text-neutral-300">
                    Please wait while we confirm your transaction...
                  </p>
                </>
              )}

              {status === 'success' && (
                <>
                  <div className="mb-6 bg-success-50 dark:bg-success-600/20 p-4 rounded-full">
                    <CheckCircle className="h-12 w-12 text-success-500" />
                  </div>
                  <h2 className="text-xl font-heading font-semibold text-neutral-900 dark:text-white mb-2">
                    Payment Successful!
                  </h2>
                  <p className="text-neutral-600 dark:text-neutral-300 mb-6">
                    Your event has been published and is now live.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <button
                      onClick={() => router.push('/events')}
                      className="flex-1 bg-primary-gradient text-white font-medium py-3 px-4 rounded-lg hover:shadow-soft-md transition-all duration-300"
                    >
                      View All Events
                    </button>
                    <Link
                      href="/dashboard"
                      className="flex-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-white font-medium py-3 px-4 rounded-lg text-center hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-all duration-300"
                    >
                      Go to Dashboard
                    </Link>
                  </div>
                </>
              )}

              {status === 'partial' && (
                <>
                  <div className="mb-6 bg-warning-50 dark:bg-warning-600/20 p-4 rounded-full">
                    <AlertTriangle className="h-12 w-12 text-warning-500" />
                  </div>
                  <h2 className="text-xl font-heading font-semibold text-neutral-900 dark:text-white mb-2">
                    Payment Processed
                  </h2>
                  <p className="text-neutral-600 dark:text-neutral-300 mb-6">
                    Payment went through, but something unexpected happened. Please check your event list.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <button
                      onClick={() => router.push('/events')}
                      className="flex-1 bg-primary-gradient text-white font-medium py-3 px-4 rounded-lg hover:shadow-soft-md transition-all duration-300"
                    >
                      Check My Events
                    </button>
                    <Link
                      href="/contact"
                      className="flex-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-white font-medium py-3 px-4 rounded-lg text-center hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-all duration-300"
                    >
                      Contact Support
                    </Link>
                  </div>
                </>
              )}

              {status === 'failed' && (
                <>
                  <div className="mb-6 bg-error-50 dark:bg-error-600/20 p-4 rounded-full">
                    <XCircle className="h-12 w-12 text-error-500" />
                  </div>
                  <h2 className="text-xl font-heading font-semibold text-neutral-900 dark:text-white mb-2">
                    Payment Failed
                  </h2>
                  <p className="text-neutral-600 dark:text-neutral-300 mb-6">
                    We couldn't verify your payment. Please try again or contact our support team.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <button
                      onClick={() => router.push('/events/create')}
                      className="flex-1 bg-primary-gradient text-white font-medium py-3 px-4 rounded-lg hover:shadow-soft-md transition-all duration-300"
                    >
                      Try Again
                    </button>
                    <Link
                      href="/contact"
                      className="flex-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-white font-medium py-3 px-4 rounded-lg text-center hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-all duration-300"
                    >
                      Contact Support
                    </Link>
                  </div>
                </>
              )}

              {status === 'invalid' && (
                <>
                  <div className="mb-6 bg-error-50 dark:bg-error-600/20 p-4 rounded-full">
                    <XCircle className="h-12 w-12 text-error-500" />
                  </div>
                  <h2 className="text-xl font-heading font-semibold text-neutral-900 dark:text-white mb-2">
                    Invalid Request
                  </h2>
                  <p className="text-neutral-600 dark:text-neutral-300 mb-6">
                    No payment reference found. Are you lost?
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <Link
                      href="/"
                      className="flex-1 bg-primary-gradient text-white font-medium py-3 px-4 rounded-lg text-center hover:shadow-soft-md transition-all duration-300"
                    >
                      Back to Home
                    </Link>
                    <Link
                      href="/events/create"
                      className="flex-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-white font-medium py-3 px-4 rounded-lg text-center hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-all duration-300"
                    >
                      Create Event
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-4 sm:px-6 lg:px-8 border-t border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
            © {new Date().getFullYear()} EventHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}