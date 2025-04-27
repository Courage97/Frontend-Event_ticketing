'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from '@/utils/axios';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Download, 
  Ticket, 
  CheckCircle, 
  AlertCircle, 
  Loader,
  ArrowLeft,
  Share2
} from 'lucide-react';

export default function TicketSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get('reference');

  const [ticket, setTicket] = useState(null);
  const [status, setStatus] = useState('verifying');

  useEffect(() => {
    const verifyTicket = async () => {
      try {
        const token = localStorage.getItem('access');
        const res = await axios.get(`/events/verify-ticket-payment/?reference=${reference}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTicket(res.data);
        setStatus('success');
      } catch (err) {
        console.error(err);
        setStatus('failed');
      }
    };

    if (reference) {
      verifyTicket();
    } else {
      setStatus('invalid');
    }
  }, [reference]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = ticket.qr_code;
    link.download = `Ticket-${ticket.reference}.png`;
    link.click();
  };

  // Share ticket details via web share API
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Ticket for ${ticket.event_title}`,
          text: `I'm attending ${ticket.event_title} on ${new Date(ticket.event_date).toLocaleDateString()}. Join me!`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Brand logo component for reuse
  const BrandLogo = () => (
    <Link href="/" className="flex items-center space-x-2 group">
      <div className="bg-primary-gradient p-2 rounded-lg shadow-soft-sm group-hover:shadow-soft-md transition-all duration-300">
        <Ticket className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
      </div>
      <h1 className="text-xl sm:text-2xl font-display font-bold text-neutral-900">EventHub</h1>
    </Link>
  );

  if (status === 'verifying') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-neutral-50">
        <div className="mb-8">
          <BrandLogo />
        </div>
        <div className="flex flex-col items-center bg-white p-8 rounded-xl shadow-soft-lg">
          <div className="relative w-16 h-16 mb-6">
            <div className="absolute inset-0 bg-primary-100 rounded-full animate-ping opacity-75"></div>
            <div className="relative flex items-center justify-center w-full h-full bg-primary-500 rounded-full">
              <Loader className="h-8 w-8 text-white animate-spin" />
            </div>
          </div>
          <p className="text-lg font-medium text-neutral-700">Verifying your ticket...</p>
          <p className="text-neutral-500 mt-2">This will just take a moment</p>
        </div>
      </div>
    );
  }

  if (status === 'failed' || status === 'invalid') {
    return (
      <div className="min-h-screen flex flex-col items-center p-6 bg-neutral-50">
        <div className="w-full max-w-lg">
          <div className="mb-8 flex justify-between items-center">
            <BrandLogo />
            <button 
              onClick={() => router.push('/events')}
              className="flex items-center text-neutral-600 hover:text-neutral-900 transition"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span>Back to Events</span>
            </button>
          </div>
          
          <div className="bg-white shadow-soft-lg rounded-2xl w-full p-8 text-center">
            <div className="w-16 h-16 bg-error-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-error-500" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-neutral-800 mb-3">Ticket Verification Failed</h2>
            <p className="text-neutral-600 mb-6">We couldn't verify your ticket purchase. This might be due to a network issue or an invalid reference.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/events')}
                className="bg-primary-gradient text-white px-6 py-3 rounded-lg font-medium shadow-soft-sm hover:shadow-soft-md transition"
              >
                Browse Events
              </button>
              <button
                onClick={() => router.push('/contact')}
                className="bg-neutral-100 text-neutral-700 px-6 py-3 rounded-lg font-medium hover:bg-neutral-200 transition"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const eventDate = new Date(ticket.event_date);
  
  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-neutral-50">
      <div className="w-full max-w-2xl">
        <div className="mb-8 flex justify-between items-center">
          <BrandLogo />
          <button 
            onClick={() => router.push('/my-ticket')}
            className="flex items-center text-neutral-600 hover:text-neutral-900 transition"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>My Tickets</span>
          </button>
        </div>

        {/* Success notification */}
        <div className="bg-success-50 border border-success-200 rounded-lg p-4 mb-6 flex items-center">
          <div className="bg-success-500 rounded-full p-1 mr-3">
            <CheckCircle className="h-5 w-5 text-white" />
          </div>
          <p className="text-success-800 font-medium">Your ticket was booked successfully!</p>
        </div>

        {/* Ticket card */}
        <div className="bg-white shadow-soft-lg rounded-2xl overflow-hidden border border-neutral-200 mb-8">
          {/* Ticket header with event details */}
          <div className="bg-primary-gradient text-white p-6">
            <h3 className="text-2xl font-heading font-bold mb-2">{ticket.event_title}</h3>
            <div className="flex items-center text-white/80">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{eventDate.toLocaleString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}</span>
            </div>
          </div>

          <div className="p-6">
            {/* QR code */}
            {ticket.qr_code && (
              <div className="flex justify-center mb-6">
                <div className="bg-white p-4 border border-neutral-200 rounded-lg shadow-soft-sm relative">
                  <img
                    src={ticket.qr_code}
                    alt="Ticket QR Code"
                    className="w-48 h-48"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder.jpg';
                    }}
                  />
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-primary-500 text-white text-xs py-1 px-3 rounded-full">
                    Scan at entry
                  </div>
                </div>
              </div>
            )}

            {/* Ticket tear line */}
            <div className="relative py-4 my-2">
              <div className="absolute left-0 w-full border-t-2 border-dashed border-neutral-200"></div>
              <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 h-16 w-16 bg-neutral-50 rounded-full"></div>
              <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 h-16 w-16 bg-neutral-50 rounded-full"></div>
            </div>

            {/* Ticket details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-neutral-700 mb-6">
              <div className="flex items-start bg-neutral-50 p-3 rounded-lg">
                <MapPin className="h-5 w-5 text-secondary-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-xs text-neutral-500 mb-1">LOCATION</p>
                  <p>{ticket.event_location}</p>
                </div>
              </div>
              
              <div className="flex items-start bg-neutral-50 p-3 rounded-lg">
                <Calendar className="h-5 w-5 text-secondary-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-xs text-neutral-500 mb-1">TIME</p>
                  <p>{eventDate.toLocaleString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}</p>
                </div>
              </div>
              
              <div className="flex items-start bg-neutral-50 p-3 rounded-lg">
                <Users className="h-5 w-5 text-secondary-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-xs text-neutral-500 mb-1">TICKETS</p>
                  <p>{ticket.quantity} {ticket.quantity > 1 ? 'tickets' : 'ticket'}</p>
                </div>
              </div>
              
              <div className="flex items-start bg-neutral-50 p-3 rounded-lg">
                <div className="h-5 w-5 text-secondary-500 mr-3 mt-0.5 flex-shrink-0 flex items-center justify-center">
                  <span className="font-bold">₦</span>
                </div>
                <div>
                  <p className="font-medium text-xs text-neutral-500 mb-1">TOTAL PAID</p>
                  <p className="font-medium">₦{Number(ticket.amount_paid).toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            {/* Reference number */}
            <div className="bg-neutral-50 p-3 rounded-lg mb-6">
              <p className="font-medium text-xs text-neutral-500 mb-1 text-center">REFERENCE NUMBER</p>
              <p className="font-mono text-center bg-white p-2 rounded border border-neutral-200">{ticket.reference}</p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {ticket.qr_code && (
                <button
                  onClick={handleDownload}
                  className="flex-1 bg-primary-gradient hover:shadow-soft-md text-white px-6 py-3 rounded-lg font-medium transition flex items-center justify-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Ticket
                </button>
              )}

              <button
                onClick={handleShare}
                className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-6 py-3 rounded-lg font-medium transition flex items-center justify-center"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Event
              </button>
            </div>
          </div>
        </div>

        {/* Help section */}
        <div className="bg-white p-4 rounded-lg border border-neutral-200 text-center mb-6">
          <p className="text-neutral-600">Need help? <Link href="/contact" className="text-primary-600 hover:text-primary-700 font-medium">Contact our support team</Link></p>
        </div>
        
        {/* More events suggestion */}
        <div className="text-center">
          <Link 
            href="/events" 
            className="inline-flex items-center text-secondary-600 hover:text-secondary-700 font-medium"
          >
            <Ticket className="h-4 w-4 mr-2" />
            Discover more events
          </Link>
        </div>
      </div>
    </div>
  );
}