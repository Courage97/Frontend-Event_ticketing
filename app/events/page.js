'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from '@/utils/axios';
import { useRouter } from 'next/navigation';
import { Menu, X, Ticket, Bell, Search, User, Calendar, Grid, ChevronDown, ArrowUpDown, Clock, MapPin, Tag, Users } from 'lucide-react';

export default function Event() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest', 'oldest', 'price-low', 'price-high'
  const [showSortMenu, setShowSortMenu] = useState(false);
  const router = useRouter();

  // Sample categories - replace with your actual categories from API
  const eventCategories = {
    'music': { label: 'Music', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    'tech': { label: 'Tech', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    'sports': { label: 'Sports', color: 'bg-green-100 text-green-800 border-green-200' },
    'art': { label: 'Art', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    'food': { label: 'Food', color: 'bg-orange-100 text-orange-800 border-orange-200' },
    'education': { label: 'Education', color: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
    'social': { label: 'Social', color: 'bg-pink-100 text-pink-800 border-pink-200' },
    'other': { label: 'Other', color: 'bg-gray-100 text-gray-800 border-gray-200' }
  };

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/events/list/');
        // Add random categories for demo - remove this in production
        const eventsWithCategories = res.data.map(event => ({
          ...event,
          category: event.category || Object.keys(eventCategories)[Math.floor(Math.random() * Object.keys(eventCategories).length)]
        }));
        setEvents(eventsWithCategories);
        setFilteredEvents(eventsWithCategories);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Apply sorting
  useEffect(() => {
    if (events.length === 0) return;
    
    const sortEvents = () => {
      const sorted = [...events];
      
      switch (sortOrder) {
        case 'newest':
          sorted.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
          break;
        case 'oldest':
          sorted.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
          break;
        case 'price-low':
          sorted.sort((a, b) => parseFloat(a.ticket_price) - parseFloat(b.ticket_price));
          break;
        case 'price-high':
          sorted.sort((a, b) => parseFloat(b.ticket_price) - parseFloat(a.ticket_price));
          break;
        default:
          break;
      }
      
      setFilteredEvents(sorted);
    };
    
    sortEvents();
  }, [sortOrder, events]);

  const handleCTA = () => {
    const token = localStorage.getItem('access');
    if (!token) {
      // Save redirect path after login
      localStorage.setItem('post_login_redirect', '/events/create');
      router.push('/login');
    } else {
      router.push('/events/create');
    }
  };

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Format date helper function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NG', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Format time helper function
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-NG', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Calculate days from now helper
  const getDaysFromNow = (dateString) => {
    const today = new Date();
    const eventDate = new Date(dateString);
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 0) return 'Past event';
    if (diffDays <= 7) return `In ${diffDays} days`;
    return formatDate(dateString);
  };

  // Skeleton loader component
  const EventCardSkeleton = () => (
    <div className="bg-white rounded-xl overflow-hidden shadow-soft-md animate-pulse">
      <div className="h-48 bg-neutral-200"></div>
      <div className="p-5 space-y-3">
        <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
        <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
        <div className="flex space-x-2 pt-1">
          <div className="h-6 bg-neutral-200 rounded w-16"></div>
        </div>
        <div className="h-3 bg-neutral-200 rounded w-2/3"></div>
        <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
        <div className="h-10 bg-neutral-200 rounded w-full mt-4"></div>
      </div>
    </div>
  );

  return (
    <div className="font-sans bg-gradient-to-b from-primary-50 to-white min-h-screen">
      {/* Header with glassmorphism effect */}
      <header 
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled 
            ? 'backdrop-blur-md bg-white/80 dark:bg-neutral-900/80 shadow-soft-md' 
            : 'bg-white dark:bg-neutral-900'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="bg-primary-gradient p-2 rounded-lg shadow-soft-sm group-hover:shadow-soft-md transition-all duration-300">
                  <Ticket className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h1 className="text-xl sm:text-2xl font-display font-bold text-neutral-900 dark:text-white">EventHub</h1>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {[
                { name: 'Events', href: '/events' },
                { name: 'Discover', href: '/' },
                { name: 'Venues', href: '/events' },
                { name: 'Vendors', href: '/vendors/services' }
              ].map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className="px-3 py-2 text-neutral-700 dark:text-neutral-200 font-medium hover:text-primary-600 dark:hover:text-primary-400 transition-colors relative group"
                >
                  <span>{item.name}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-gradient group-hover:w-full transition-all duration-300 ease-out"></span>
                </Link>
              ))}
            </nav>
            
            {/* Action Buttons */}
            <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
              {/* Tickets */}
              <Link href="/my-ticket" className="px-4 py-2 text-sm text-white rounded-full font-medium bg-primary-gradient hover:shadow-soft-md hover:scale-105 transition-all">
                  My-Tickets
              </Link>
              
              {/* Auth Buttons */}
              <div className="flex items-center space-x-2">
                <Link href="/login" className="px-4 py-2 text-sm text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 hover:border-primary-400 dark:hover:border-primary-600 rounded-full font-medium hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors">
                  Sign In
                </Link>
                <Link href="/events/create" className="px-4 py-2 text-sm text-white rounded-full font-medium bg-primary-gradient hover:shadow-soft-md hover:scale-105 transition-all">
                  Create Event
                </Link>
              </div>
            </div>
            
            {/* Mobile menu button */}
            <div className="flex items-center space-x-3 md:hidden">
              <Link href="/my-ticket" className="px-4 py-2 text-sm text-white rounded-full font-medium bg-primary-gradient hover:shadow-soft-md hover:scale-105 transition-all">
                  My-Tickets
              </Link>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-neutral-700 dark:text-neutral-200 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation Slide-down Panel */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-96 border-b border-neutral-200 dark:border-neutral-700' : 'max-h-0'
          }`}
        >
          <nav className="px-4 pt-2 pb-6 space-y-1 bg-white dark:bg-neutral-900">
            {[
              { name: 'Events', href: '/events' },
              { name: 'Discover', href: '/' },
              { name: 'Venues', href: '/events' },
              { name: 'Vendors', href: '/vendors/services' }
            ].map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className="block px-3 py-2 text-base font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            <div className="pt-4 space-y-2">
              <Link 
                href="/login" 
                className="block w-full px-4 py-2 text-center text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 rounded-full font-medium hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link 
                href="/events/create" 
                className="block w-full px-4 py-2 text-center text-white bg-primary-gradient rounded-full font-medium hover:shadow-soft-md transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Create Event
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Events Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4 text-neutral-900 dark:text-white">Discover Events</h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
            Find and attend exciting events near you, from tech conferences to music festivals
          </p>
        </div>

        {/* Filters and Sort */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Filters here if needed */}
          <div></div>
          
          {/* Sort Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowSortMenu(!showSortMenu)} 
              className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
            >
              <ArrowUpDown size={16} />
              <span>Sort: {
                sortOrder === 'newest' ? 'Newest First' :
                sortOrder === 'oldest' ? 'Oldest First' :
                sortOrder === 'price-low' ? 'Price: Low to High' :
                'Price: High to Low'
              }</span>
              <ChevronDown size={16} className={`transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Sort Dropdown Menu */}
            {showSortMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-soft-xl z-10 border border-neutral-200 dark:border-neutral-700">
                <div className="py-1">
                  {[
                    { value: 'newest', label: 'Newest First' },
                    { value: 'oldest', label: 'Oldest First' },
                    { value: 'price-low', label: 'Price: Low to High' },
                    { value: 'price-high', label: 'Price: High to Low' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortOrder(option.value);
                        setShowSortMenu(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        sortOrder === option.value 
                          ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
                          : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          // Skeleton loader
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(6)].map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          // Error state
          <div className="bg-error-50 border border-error-200 rounded-xl p-8 text-center text-error-800">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error-100 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-error-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">{error}</h3>
            <p className="mb-4">We couldn't load the events. Please try refreshing the page.</p>
            <button 
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 bg-error-600 text-white rounded-lg hover:bg-error-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        ) : filteredEvents.length === 0 ? (
          // Empty state
          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 mb-4">
              <Calendar className="h-8 w-8 text-primary-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">No Events Found</h3>
            <p className="text-neutral-600 mb-6 max-w-md mx-auto">
              We couldn't find any events matching your criteria. Try changing your filters or check back later.
            </p>
            <button 
              onClick={() => setSortOrder('newest')}
              className="inline-flex items-center px-4 py-2 bg-primary-gradient text-white rounded-lg hover:shadow-soft-md transition-all"
            >
              Show All Events
            </button>
          </div>
        ) : (
          // Events grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredEvents.map((event) => {
              const isSoldOut = event.tickets_sold >= event.capacity;
              const daysFromNow = getDaysFromNow(event.start_date);
              const isUpcoming = new Date(event.start_date) > new Date();
              const soldPercentage = event.capacity > 0 ? Math.min(100, Math.round((event.tickets_sold / event.capacity) * 100)) : 0;
              const almostSoldOut = soldPercentage >= 80 && soldPercentage < 100;
              
              return (
                <div
                  key={event.id}
                  className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-soft-md hover:shadow-soft-lg transition-all duration-300 group"
                >
                  {/* Event Image with Category Badge */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.flyer || '/placeholder.jpg'}
                      alt={event.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder.jpg';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    {/* Status Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {isSoldOut && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-error-500 text-white">
                          Sold Out
                        </span>
                      )}
                      
                      {!isSoldOut && almostSoldOut && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-warning-500 text-white">
                          Almost Sold Out
                        </span>
                      )}
                      
                      {!isUpcoming && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-700 text-white">
                          Past Event
                        </span>
                      )}
                    </div>
                    
                    {/* Date Badge */}
                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-xs rounded-lg p-2 text-center min-w-16">
                      <span className="block text-sm font-bold text-neutral-900 dark:text-white">
                        {new Date(event.start_date).getDate()}
                      </span>
                      <span className="block text-xs text-neutral-600 dark:text-neutral-400">
                        {new Date(event.start_date).toLocaleString('default', { month: 'short' })}
                      </span>
                    </div>
                  </div>
                  
                  {/* Event Content */}
                  <div className="p-5">
                    {/* Category Tag */}
                    {event.category && eventCategories[event.category] && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${eventCategories[event.category].color}`}>
                        <Tag size={12} className="mr-1" />
                        {eventCategories[event.category].label}
                      </span>
                    )}
                    
                    {/* Event Title */}
                    <h3 className="mt-3 text-lg font-bold text-neutral-900 dark:text-white line-clamp-2">
                      {event.title}
                    </h3>
                    
                    {/* Event Details */}
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-300">
                        <Clock size={14} className="mr-1.5 flex-shrink-0" />
                        <span>{formatTime(event.start_date)}</span>
                        <span className="mx-1">•</span>
                        <span>{daysFromNow}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-300 truncate">
                        <MapPin size={14} className="mr-1.5 flex-shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                      
                      {!isSoldOut && (
                        <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-300">
                          <Users size={14} className="mr-1.5 flex-shrink-0" />
                          <div className="w-full">
                            <div className="flex justify-between mb-1">
                              <span className="text-xs">{soldPercentage}% Booked</span>
                              <span className="text-xs">{event.capacity - (event.tickets_sold || 0)} left</span>
                            </div>
                            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-1.5">
                              <div 
                                className={`h-1.5 rounded-full ${
                                  soldPercentage >= 80 ? 'bg-warning-500' : 'bg-primary-500'
                                }`}
                                style={{ width: `${soldPercentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Price and Action Button */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-lg font-bold text-accent-600 dark:text-accent-400">
                        ₦{event.ticket_price || 'Free'}
                      </div>
                      
                      <Link
                        href={`/events/${event.slug}`}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          isSoldOut || !isUpcoming
                            ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400'
                            : 'bg-primary-gradient text-white hover:shadow-soft-md'
                        }`}
                      >
                        {isSoldOut ? 'Sold Out' : !isUpcoming ? 'View Details' : 'Book Now'}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Organizer CTA */}
    <div className="mt-16 bg-glass-light dark:bg-glass-dark backdrop-blur-md border border-neutral-200 dark:border-neutral-700 rounded-2xl p-8 text-center">
  <div className="max-w-2xl mx-auto">
    <h2 className="text-2xl md:text-3xl font-bold font-heading mb-4 text-neutral-900 dark:text-white">Ready to host your own event?</h2>
    <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-8">
      Create and promote your events to thousands of attendees and sell tickets online.
    </p>
    <button
      onClick={handleCTA}
      className="px-8 py-4 bg-primary-gradient text-white rounded-lg font-medium text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-pulse-subtle relative overflow-hidden before:absolute before:inset-0 before:bg-white before:opacity-20 before:transform before:translate-x-full hover:before:animate-shine"
    >
      Create Your Event
    </button>
  </div>
</div>
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