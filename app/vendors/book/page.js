'use client';
import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Ticket, ChevronRight, Calendar, RefreshCw, Search, Filter, 
         ChevronDown, ArrowUpDown, Clock, CheckCircle, XCircle, Mail, ArrowLeft } from 'lucide-react';

export default function SentRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('created');
  const [sortDirection, setSortDirection] = useState('desc');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const router = useRouter();

  const fetchRequests = async () => {
    const token = localStorage.getItem('access');
    if (!token) {
      localStorage.setItem('post_login_redirect', '/vendors/sent-requests');
      return router.push('/login');
    }

    try {
      setLoading(true);
      const res = await axios.get('/vendors/sent-requests/');
      setRequests(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load sent requests. Please try again later.');
      toast.error('Failed to load sent requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [router]);

  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case 'pending':
        return <Clock className="text-warning-600" size={16} />;
      case 'accepted':
        return <CheckCircle className="text-success-600" size={16} />;
      case 'rejected':
        return <XCircle className="text-error-600" size={16} />;
      default:
        return <Mail className="text-neutral-600" size={16} />;
    }
  };

  const getStatusClass = (status) => {
    switch(status.toLowerCase()) {
      case 'pending':
        return 'bg-warning-50 text-warning-600 border border-warning-500/30';
      case 'accepted':
        return 'bg-success-50 text-success-600 border border-success-500/30';
      case 'rejected':
        return 'bg-error-50 text-error-600 border border-error-500/30';
      default:
        return 'bg-neutral-100 text-neutral-600 border border-neutral-400/30';
    }
  };

  const filteredAndSortedRequests = requests
    .filter(req => {
      // Filter by search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          req.event_title.toLowerCase().includes(searchLower) ||
          req.vendor_service_name.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .filter(req => {
      // Filter by status
      if (filterStatus !== 'all') {
        return req.status.toLowerCase() === filterStatus;
      }
      return true;
    })
    .sort((a, b) => {
      // Sort logic
      const factor = sortDirection === 'asc' ? 1 : -1;
      
      if (sortBy === 'event') {
        return a.event_title.localeCompare(b.event_title) * factor;
      } else if (sortBy === 'vendor') {
        return a.vendor_service_name.localeCompare(b.vendor_service_name) * factor;
      } else if (sortBy === 'status') {
        return a.status.localeCompare(b.status) * factor;
      } else {
        // Default sort by creation date
        return (new Date(a.created_at) - new Date(b.created_at)) * factor;
      }
    });

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Header with navigation and branding */}
      <header className="bg-white dark:bg-neutral-800 shadow-soft-sm border-b border-neutral-200 dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="bg-primary-gradient p-2 rounded-lg shadow-soft-sm group-hover:shadow-soft-md transition-all duration-300">
                <Ticket className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-neutral-900 dark:text-white">EventHub</h1>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-neutral-900 dark:text-white">Sent Vendor Requests</h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-1">Track and manage all your vendor service requests</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/dashboard')}
              className="inline-flex items-center justify-center bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 shadow-soft-sm transition-all"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Dashboard
            </button>
            <button 
              onClick={fetchRequests} 
              className="inline-flex items-center justify-center bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 shadow-soft-sm transition-all"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </button>
            <Link 
              href="/vendors/explore"
              className="inline-flex items-center justify-center bg-primary-gradient text-white rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90 shadow-soft-md transition-all"
            >
              Find Vendors
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-soft-md border border-neutral-200 dark:border-neutral-700 mb-6 overflow-hidden">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-neutral-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by event or vendor service..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-neutral-300 dark:border-neutral-600 focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-700 dark:text-white rounded-lg"
                />
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="inline-flex items-center justify-center bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-lg px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-600 shadow-soft-sm transition-all w-full sm:w-auto"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  <ChevronDown className={`h-4 w-4 ml-2 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isFilterOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-soft-lg z-10 p-4">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Status</label>
                      <select
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                        className="w-full border-neutral-300 dark:border-neutral-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-700 dark:text-white"
                      >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Sort By</label>
                      <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                        className="w-full border-neutral-300 dark:border-neutral-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-700 dark:text-white"
                      >
                        <option value="created">Date Sent</option>
                        <option value="event">Event Name</option>
                        <option value="vendor">Vendor Service</option>
                        <option value="status">Status</option>
                      </select>
                    </div>
                    
                    <div className="flex justify-between">
                      <button
                        onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                        className="inline-flex items-center text-sm text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        <ArrowUpDown className="h-4 w-4 mr-1" />
                        {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
                      </button>
                      
                      <button
                        onClick={() => {
                          setFilterStatus('all');
                          setSortBy('created');
                          setSortDirection('desc');
                          setSearchTerm('');
                        }}
                        className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                      >
                        Reset All
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-12 w-12 rounded-full border-4 border-neutral-200 border-l-primary-500 animate-spin mb-4"></div>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg">Loading your requests...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-error-50 border border-error-500/30 text-error-600 rounded-xl p-4 mb-6">
            <div className="flex">
              <XCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredAndSortedRequests.length === 0 && (
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-soft-md border border-neutral-200 dark:border-neutral-700 p-8 text-center">
            <div className="bg-primary-50 dark:bg-primary-900/20 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">No requests found</h3>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? "No requests match your current filters. Try adjusting your search criteria."
                : "You haven't sent any vendor requests yet. Start by exploring our available vendors."}
            </p>
            <Link
              href="/vendors/explore"
              className="inline-flex items-center justify-center bg-primary-gradient text-white rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90 shadow-soft-md transition-all"
            >
              Explore Vendors
            </Link>
          </div>
        )}

        {/* Requests List */}
        {!loading && !error && filteredAndSortedRequests.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAndSortedRequests.map((req) => (
              <div 
                key={req.id} 
                className="bg-white dark:bg-neutral-800 rounded-xl shadow-soft-md border border-neutral-200 dark:border-neutral-700 overflow-hidden hover:shadow-soft-lg transition-all duration-300"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">{req.event_title}</h2>
                      <p className="text-sm text-primary-600 dark:text-primary-400 font-medium flex items-center">
                        <ChevronRight size={16} className="mr-1" />
                        {req.vendor_service_name}
                      </p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full flex items-center ${getStatusClass(req.status)}`}>
                      {getStatusIcon(req.status)}
                      <span className="ml-1">{req.status.charAt(0).toUpperCase() + req.status.slice(1)}</span>
                    </span>
                  </div>
                  
                  {/* Booking details grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4 mt-4 p-3 bg-neutral-50 dark:bg-neutral-900/50 rounded-md">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-primary-500 dark:text-primary-400 mr-2" />
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">{req.booking_date || 'Date pending'}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-primary-500 dark:text-primary-400 mr-2" />
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">{req.booking_time || 'Time pending'}</span>
                    </div>
                  </div>
                  
                  {req.message && (
                    <div className="bg-neutral-50 dark:bg-neutral-900/50 p-3 rounded-md mb-3 border-l-2 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm italic">
                      "{req.message}"
                    </div>
                  )}

                  <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-500 pt-3 border-t border-neutral-200 dark:border-neutral-700">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Sent on: {new Date(req.created_at).toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-neutral-50 dark:bg-neutral-900/50 px-5 py-3 border-t border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    {req.price ? `Price: ${req.price}` : 'Price to be confirmed'}
                  </div>

                  {req.status.toLowerCase() === 'accepted' && (
                    <button 
                      className="text-sm font-medium text-success-600 hover:text-success-700 dark:text-success-500 dark:hover:text-success-400 transition-colors"
                      onClick={() => router.push('/dashboard/events')}
                    >
                      Go to Event
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

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