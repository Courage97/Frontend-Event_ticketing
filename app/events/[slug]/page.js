'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import axios from '@/utils/axios';
import { Calendar, Share2, MapPin, Clock, Users, ChevronDown, ChevronUp, Ticket } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EventDetail() {
  const { slug } = useParams();
  const router = useRouter();

  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    if (!slug) return;

    axios.get(`/events/detail/${slug}/`)
      .then((res) => {
        setEvent(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('❌ Failed to fetch event:', err);
        alert('Event not found or network error.');
        router.push('/events');
      });
  }, [slug, router]);

  // Countdown timer
  useEffect(() => {
    if (!event) return;

    const calculateTimeRemaining = () => {
      const eventTime = new Date(event.start_date).getTime();
      const now = new Date().getTime();
      const difference = eventTime - now;

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0 };
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      return { days, hours, minutes };
    };

    setTimeRemaining(calculateTimeRemaining());
    
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [event]);

  const handleBooking = async () => {
    const token = localStorage.getItem('access');
    if (!token) {
      localStorage.setItem('post_login_redirect', `/events/${slug}`);
      return router.push('/login');
    }

    try {
      setBookingLoading(true);
      const res = await axios.post(
        '/events/book-ticket/',
        { event_id: event.id, quantity },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.data.payment_url) {
        window.location.href = res.data.payment_url;
      } else {
        alert('No payment link returned.');
      }
    } catch (err) {
      console.error(err);
      alert('Booking failed!');
    } finally {
      setBookingLoading(false);
    }
  };

  const incrementQuantity = () => {
    if (event && quantity < (event.capacity - event.tickets_sold)) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-6">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-primary-gradient p-2 rounded-lg shadow-soft-sm group-hover:shadow-soft-md transition-all duration-300">
              <Ticket className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-display font-bold text-neutral-900">EventHub</h1>
          </Link>
        </div>
        <div className="animate-pulse">
          <div className="w-full h-64 bg-neutral-200 rounded mb-6"></div>
          <div className="h-8 bg-neutral-200 rounded mb-4 w-3/4"></div>
          <div className="h-4 bg-neutral-200 rounded mb-2 w-1/2"></div>
          <div className="h-4 bg-neutral-200 rounded mb-6 w-1/4"></div>
          <div className="h-24 bg-neutral-200 rounded mb-6"></div>
          <div className="h-12 bg-neutral-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (!event) return null;

  const isSoldOut = event.tickets_sold >= event.capacity;
  const ticketsRemaining = event.capacity - event.tickets_sold;
  const percentageSold = (event.tickets_sold / event.capacity) * 100;
  const eventDate = new Date(event.start_date);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Logo header */}
      <div className="mb-8">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="bg-primary-gradient p-2 rounded-lg shadow-soft-sm group-hover:shadow-soft-md transition-all duration-300">
            <Ticket className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-neutral-900">EventHub</h1>
        </Link>
      </div>

      {/* Event image */}
      <img
        src={event.flyer || '/placeholder.jpg'}
        alt={event.title}
        className="w-full h-64 sm:h-80 object-cover rounded-2xl shadow-soft-lg mb-8"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/placeholder.jpg';
        }}
      />

      {/* Event countdown */}
      {eventDate > new Date() && (
        <div className="mb-8 flex flex-wrap gap-3 justify-center sm:justify-start">
          <div className="bg-secondary-50 rounded-lg px-4 py-2 text-center">
            <p className="text-2xl font-bold text-secondary-700">{timeRemaining.days}</p>
            <p className="text-xs font-medium text-secondary-600">DAYS</p>
          </div>
          <div className="bg-secondary-50 rounded-lg px-4 py-2 text-center">
            <p className="text-2xl font-bold text-secondary-700">{timeRemaining.hours}</p>
            <p className="text-xs font-medium text-secondary-600">HOURS</p>
          </div>
          <div className="bg-secondary-50 rounded-lg px-4 py-2 text-center">
            <p className="text-2xl font-bold text-secondary-700">{timeRemaining.minutes}</p>
            <p className="text-xs font-medium text-secondary-600">MINUTES</p>
          </div>
          <div className="bg-accent-50 rounded-lg flex-grow flex items-center justify-center px-3 py-2">
            <Clock size={18} className="text-accent-600 mr-2" />
            <span className="text-sm font-medium text-accent-700">Starting Soon!</span>
          </div>
        </div>
      )}

      {/* Event metadata */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-3 text-neutral-800">{event.title}</h1>
        
        <div className="space-y-3">
          <div className="flex items-center text-neutral-700">
            <MapPin size={18} className="text-secondary-500 mr-2 flex-shrink-0" />
            <span className="text-base">{event.location}</span>
          </div>
          
          <div className="flex items-center text-neutral-700">
            <Calendar size={18} className="text-secondary-500 mr-2 flex-shrink-0" />
            <span className="text-base">{eventDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</span>
          </div>
          
          <div className="flex items-center text-neutral-700">
            <Users size={18} className="text-secondary-500 mr-2 flex-shrink-0" />
            <span className="text-base">Capacity: {event.capacity} attendees</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-10">
        <h3 className="text-xl font-heading font-semibold mb-3 text-neutral-800">About this event</h3>
        <p className="text-neutral-700 text-base leading-relaxed">{event.description}</p>
      </div>

      {/* Ticket card section */}
      <div className="rounded-2xl bg-white border border-neutral-200 overflow-hidden shadow-ticket mb-8">
        <div className="bg-ticket-pattern bg-secondary-gradient text-white p-4">
          <div className="flex items-center">
            <Ticket className="h-5 w-5 mr-2" />
            <h3 className="font-heading text-xl font-bold">Book Your Ticket</h3>
          </div>
        </div>
        
        <div className="p-6 relative">
          {/* Price and availability */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <span className="text-2xl font-bold text-neutral-900">₦{event.ticket_price}</span>
              <p className="text-sm text-neutral-500">per person</p>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-medium text-neutral-700">{ticketsRemaining} tickets left</p>
              {/* Ticket availability progress bar */}
              <div className="w-28 h-2 bg-neutral-200 rounded-full mt-1">
                <div 
                  className="h-2 bg-secondary-500 rounded-full" 
                  style={{ width: `${100 - percentageSold}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Quantity selector */}
          {!isSoldOut && (
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-neutral-700">
                Number of Tickets
              </label>
              <div className="flex items-center">
                <button 
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="bg-neutral-100 hover:bg-neutral-200 rounded-l-lg p-2 text-neutral-700 disabled:opacity-50"
                >
                  <ChevronDown size={20} />
                </button>
                <div className="border-y border-neutral-200 py-2 px-6 font-semibold text-lg text-center">
                  {quantity}
                </div>
                <button 
                  onClick={incrementQuantity}
                  disabled={quantity >= ticketsRemaining}
                  className="bg-neutral-100 hover:bg-neutral-200 rounded-r-lg p-2 text-neutral-700 disabled:opacity-50"
                >
                  <ChevronUp size={20} />
                </button>
              </div>
            </div>
          )}
          
          {/* Total price calculation */}
          <div className="flex justify-between items-center mb-6 py-3 border-t border-dashed border-neutral-200">
            <span className="font-medium text-neutral-700 text-base">Total</span>
            <span className="font-bold text-xl text-accent-700">₦{(event.ticket_price * quantity).toLocaleString()}</span>
          </div>
          
          {/* Book button */}
          <button
            onClick={handleBooking}
            disabled={isSoldOut || bookingLoading}
            className={`w-full py-3 rounded-lg font-semibold text-base transition flex items-center justify-center ${
              isSoldOut
                ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                : 'bg-secondary-gradient hover:shadow-soft-md text-white'
            }`}
          >
            {isSoldOut ? (
              'Sold Out'
            ) : bookingLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Book Now'
            )}
          </button>
          
          {/* Perforated edge effect for ticket */}
          <div className="absolute top-0 left-0 w-full h-1">
            <div className="flex justify-between">
              {[...Array(40)].map((_, i) => (
                <div key={i} className="h-1 w-1 rounded-full bg-neutral-200"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Back to events link with logo branding */}
      <div className="text-center mt-8">
        <Link href="/events" className="inline-flex items-center text-secondary-600 hover:text-secondary-700 font-medium">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
            <path d="M15.8332 10H4.1665" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9.99984 15.8334L4.1665 10.0001L9.99984 4.16675" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Events
        </Link>
      </div>
      <footer className="bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 mt-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="flex items-center space-x-2 mb-4 md:mb-0">
                    <div className="bg-primary-gradient p-1.5 rounded-md shadow-soft-sm">
                      <Ticket className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">EventHub</span>
                  </div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">
                    © {new Date().getFullYear()} EventHub. All rights reserved.
                  </div>
                </div>
              </div>
            </footer>
    </div>
  );
}