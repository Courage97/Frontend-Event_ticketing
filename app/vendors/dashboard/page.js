'use client';
import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Ticket, 
  ChevronRight, 
  Calendar, 
  RefreshCw, 
  PlusCircle, 
  ClipboardList, 
  CalendarCheck, 
  BarChart3, 
  BellRing,
  Settings,
  LogOut,
  Menu,
  X,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

// Simple Toast component
const Toast = ({ message, type = 'error', onClose }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className={`flex items-center p-4 rounded-lg shadow-md ${
        type === 'error' 
          ? 'bg-error-50 dark:bg-error-900 text-error-600 dark:text-error-300 border border-error-200 dark:border-error-800' 
          : 'bg-success-50 dark:bg-success-900 text-success-600 dark:text-success-300 border border-success-200 dark:border-success-800'
      }`}>
        <div className="mr-3">
          {type === 'error' ? (
            <AlertCircle className="h-5 w-5" />
          ) : (
            <CheckCircle className="h-5 w-5" />
          )}
        </div>
        <p className="font-medium text-sm flex-1">{message}</p>
        <button 
          onClick={onClose}
          className="ml-4 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// Default data structure to prevent null reference errors
const defaultData = {
  total_requests: 0,
  total_bookings: 0,
  confirmed_bookings: 0,
  recent_requests: [],
  recent_bookings: []
};

export default function VendorDashboardPage() {
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('week');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });
  const router = useRouter();
  const pathname = usePathname();

  const navLinks = [
    { href: '/vendors/dashboard', label: 'Dashboard', icon: <BarChart3 className="h-5 w-5" /> },
    { href: '/vendors/my-requests', label: 'Requests', icon: <BellRing className="h-5 w-5" /> },
    { href: '/vendors/my-bookings', label: 'Bookings', icon: <CalendarCheck className="h-5 w-5" /> },
    { href: '/vendors/services', label: 'My Services', icon: <ClipboardList className="h-5 w-5" /> },
    { href: '/vendors/create', label: 'Add Service', icon: <PlusCircle className="h-5 w-5" /> },
  ];

  const quickActions = [
    {
      href: "/vendors/create",
      icon: <PlusCircle className="h-6 w-6 text-primary-600 dark:text-primary-400" />,
      title: "Add Service",
      desc: "Create a new offering"
    },
    {
      href: "/vendors/my-requests",
      icon: <BellRing className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />,
      title: "View Requests",
      desc: "Check pending requests"
    },
    {
      href: "/vendors/my-bookings",
      icon: <CalendarCheck className="h-6 w-6 text-accent-600 dark:text-accent-400" />,
      title: "Bookings",
      desc: "Manage booked services"
    }
  ];

  const showToast = (message, type = 'error') => {
    setToast({ show: true, message, type });
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) {
      localStorage.setItem('post_login_redirect', '/vendors/dashboard');
      return router.push('/login');
    }

    fetchDashboardData();
  }, [router, dateFilter]);

  const fetchDashboardData = () => {
    setLoading(true);
    axios.get(`/vendors/dashboard-summary/?period=${dateFilter}`)
      .then((res) => {
        // Validate and merge with default data to prevent null references
        if (res.data && typeof res.data === 'object') {
          setData({
            ...defaultData,
            ...res.data,
            // Ensure arrays are always defined
            recent_requests: Array.isArray(res.data.recent_requests) ? res.data.recent_requests : [],
            recent_bookings: Array.isArray(res.data.recent_bookings) ? res.data.recent_bookings : []
          });
        } else {
          // If response data is not as expected, use default and show error
          setData(defaultData);
          showToast('Invalid data received. Using default values.');
        }
      })
      .catch((error) => {
        // Keep default data and show error
        setData(defaultData);
        showToast('Failed to load dashboard data. Please try again.');
        console.error('Dashboard error:', error);
      })
      .finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin h-8 w-8 rounded-full border-4 border-primary-300 border-t-primary-600"></div>
          <p className="text-neutral-600 dark:text-neutral-300 font-medium">Loading vendor dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-neutral-900 overflow-hidden">
      {/* Toast notification */}
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(prev => ({ ...prev, show: false }))} 
        />
      )}
      
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-30">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-white dark:bg-neutral-800 shadow-md"
        >
          {sidebarOpen ? 
            <X className="h-6 w-6 text-neutral-700 dark:text-neutral-300" /> : 
            <Menu className="h-6 w-6 text-neutral-700 dark:text-neutral-300" />
          }
        </button>
      </div>
      
      {/* Sidebar Overlay */}
      <div className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden ${
        sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`} onClick={() => setSidebarOpen(false)}></div>
      
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-20 w-64 transform transition-transform duration-300 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 flex flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Logo */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-primary-gradient p-2 rounded-lg shadow-soft-sm group-hover:shadow-soft-md transition-all duration-300">
              <Ticket className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-display font-bold text-neutral-900 dark:text-white">EventHub</h1>
          </Link>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={`flex items-center px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                    isActive 
                      ? 'bg-primary-gradient text-white shadow-soft-md' 
                      : 'hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200'
                  }`}
                >
                  <span className="mr-3">
                    {link.icon}
                  </span>
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>
        
        {/* User Settings */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 space-y-1">
          <Link 
            href="/vendors/settings" 
            className="flex items-center px-4 py-3 rounded-lg font-medium text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 transition-all"
          >
            <Settings className="h-5 w-5 mr-3" />
            Settings
          </Link>
          <button 
            className="w-full flex items-center px-4 py-3 rounded-lg font-medium text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 transition-all"
            onClick={() => {
              localStorage.removeItem('access');
              router.push('/login');
            }}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Header with actions */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-neutral-900 dark:text-white">
              Dashboard Overview
            </h2>
            
            <div className="flex items-center space-x-3">
              <select 
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm font-medium px-3 py-2 focus:ring-2 focus:ring-primary-300 focus:border-primary-500 dark:focus:ring-primary-700 dark:focus:border-primary-600"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
              
              <button 
                onClick={fetchDashboardData}
                className="p-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-all"
              >
                <RefreshCw className="h-5 w-5 text-neutral-600 dark:text-neutral-300" />
              </button>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-glass-light dark:bg-glass-dark backdrop-blur-sm border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 shadow-soft-lg hover:shadow-soft-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <span className="text-neutral-500 dark:text-neutral-400 font-medium text-sm">Requests</span>
                <div className="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
                  <BellRing className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-1">{data.total_requests}</h2>
              <div className="flex items-center text-sm">
                <span className="text-success-500 font-medium">↑ 12%</span>
                <span className="ml-1 text-neutral-500 dark:text-neutral-400">from last period</span>
              </div>
            </div>
            
            <div className="bg-glass-light dark:bg-glass-dark backdrop-blur-sm border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 shadow-soft-lg hover:shadow-soft-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <span className="text-neutral-500 dark:text-neutral-400 font-medium text-sm">Total Bookings</span>
                <div className="p-2 bg-secondary-50 dark:bg-secondary-900/30 rounded-lg">
                  <Calendar className="h-4 w-4 text-secondary-600 dark:text-secondary-400" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-1">{data.total_bookings}</h2>
              <div className="flex items-center text-sm">
                <span className="text-success-500 font-medium">↑ 8%</span>
                <span className="ml-1 text-neutral-500 dark:text-neutral-400">from last period</span>
              </div>
            </div>
            
            <div className="bg-glass-light dark:bg-glass-dark backdrop-blur-sm border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 shadow-soft-lg hover:shadow-soft-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <span className="text-neutral-500 dark:text-neutral-400 font-medium text-sm">Confirmed</span>
                <div className="p-2 bg-success-50 dark:bg-success-600/20 rounded-lg">
                  <CalendarCheck className="h-4 w-4 text-success-600 dark:text-success-500" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-1">{data.confirmed_bookings}</h2>
              <div className="flex items-center text-sm">
                <span className="text-success-500 font-medium">↑ 5%</span>
                <span className="ml-1 text-neutral-500 dark:text-neutral-400">from last period</span>
              </div>
            </div>
          </div>

          {/* Quick Actions Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {quickActions.map((action, idx) => (
              <Link 
                key={idx} 
                href={action.href} 
                className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-soft-md hover:shadow-soft-lg border border-neutral-200 dark:border-neutral-700 transition-all flex items-center"
              >
                <div className="p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg mr-4">
                  {action.icon}
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900 dark:text-white">{action.title}</h4>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{action.desc}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Activity Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Requests Card */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-soft-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
              <div className="p-5 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
                <h3 className="text-lg font-heading font-semibold text-neutral-900 dark:text-white">Recent Requests</h3>
                <Link href="/vendors/my-requests" className="flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                  View all <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              {data.recent_requests.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="mx-auto w-12 h-12 bg-neutral-100 dark:bg-neutral-700 rounded-full flex items-center justify-center mb-3">
                    <BellRing className="h-6 w-6 text-neutral-500 dark:text-neutral-400" />
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 font-medium">No recent requests</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-1">New requests will appear here</p>
                </div>
              ) : (
                <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
                  {data.recent_requests.map((req, idx) => (
                    <div key={idx} className="p-4 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium text-neutral-900 dark:text-white">{req.event_title || 'Untitled Event'}</p>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">from {req.organizer_name || 'Unknown Organizer'}</p>
                        </div>
                        <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                          req.status === 'accepted'
                            ? 'bg-success-50 text-success-600 dark:bg-success-600/20 dark:text-success-500'
                            : req.status === 'declined'
                            ? 'bg-error-50 text-error-600 dark:bg-error-600/20 dark:text-error-500'
                            : 'bg-warning-50 text-warning-600 dark:bg-warning-600/20 dark:text-warning-500'
                        }`}>
                          {req.status || 'pending'}
                        </span>
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {req.created_at ? new Date(req.created_at).toLocaleString() : 'Date unavailable'}
                        </p>
                        {(req.status === 'pending' || !req.status) && (
                          <div className="flex space-x-2">
                            <button className="text-xs px-3 py-1 bg-success-50 text-success-600 dark:bg-success-600/20 dark:text-success-500 rounded-md hover:bg-success-100 dark:hover:bg-success-600/30 transition-colors">
                              Accept
                            </button>
                            <button className="text-xs px-3 py-1 bg-error-50 text-error-600 dark:bg-error-600/20 dark:text-error-500 rounded-md hover:bg-error-100 dark:hover:bg-error-600/30 transition-colors">
                              Decline
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Bookings Card */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-soft-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
              <div className="p-5 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
                <h3 className="text-lg font-heading font-semibold text-neutral-900 dark:text-white">Recent Bookings</h3>
                <Link href="/vendors/my-bookings" className="flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                  View all <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              {data.recent_bookings.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="mx-auto w-12 h-12 bg-neutral-100 dark:bg-neutral-700 rounded-full flex items-center justify-center mb-3">
                    <Calendar className="h-6 w-6 text-neutral-500 dark:text-neutral-400" />
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 font-medium">No recent bookings</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-1">New bookings will appear here</p>
                </div>
              ) : (
                <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
                  {data.recent_bookings.map((book, idx) => (
                    <div key={idx} className="p-4 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium text-neutral-900 dark:text-white">{book.service || 'Unnamed Service'}</p>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">by {book.user || 'Unknown User'}</p>
                        </div>
                        <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                          book.status === 'confirmed'
                            ? 'bg-success-50 text-success-600 dark:bg-success-600/20 dark:text-success-500'
                            : book.status === 'cancelled'
                            ? 'bg-error-50 text-error-600 dark:bg-error-600/20 dark:text-error-500'
                            : 'bg-warning-50 text-warning-600 dark:bg-warning-600/20 dark:text-warning-500'
                        }`}>
                          {book.status || 'pending'}
                        </span>
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {book.date || 'Date unavailable'} {book.time ? `at ${book.time}` : ''}
                        </p>
                        {(book.status === 'pending' || !book.status) && (
                          <button className="text-xs px-3 py-1 bg-success-50 text-success-600 dark:bg-success-600/20 dark:text-success-500 rounded-md hover:bg-success-100 dark:hover:bg-success-600/30 transition-colors">
                            Confirm
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 py-4">
          <div className="max-w-6xl mx-auto px-4">
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
      </main>
    </div>
  );
}