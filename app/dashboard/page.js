'use client';
import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useAuth from '@/hooks/useAuth';
import { 
  Settings, Calendar, List, PlusCircle, ChevronRight, 
  Ticket, Users, DollarSign, Clock, Home, AlertCircle,
  TrendingUp, Activity, LineChart
} from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_events: 0,
    total_tickets: 0,
    total_revenue: 0,
    recent_events: []
  });
  const [greeting, setGreeting] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user, checking } = useAuth('organizer');

  useEffect(() => {
    // Set greeting based on time of day
    const hours = new Date().getHours();
    if (hours < 12) setGreeting('Good morning');
    else if (hours < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    const token = localStorage.getItem('access');
    if (!token) {
      localStorage.setItem('post_login_redirect', '/dashboard');
      return router.push('/login');
    }

    setIsLoading(true);
    axios.get('/events/dashboard/summary/', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => {
      setStats(res.data);
      setIsLoading(false);
    })
    .catch(err => {
      console.error(err);
      alert('Failed to load dashboard data.');
      setIsLoading(false);
    });
  }, [router]);

  if (checking || isLoading) return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="w-full max-w-6xl">
        <div className="animate-pulse flex flex-col space-y-8 p-8">
          <div className="h-12 bg-neutral-200 rounded-lg w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-neutral-200 rounded-2xl"></div>
            ))}
          </div>
          <div className="h-80 bg-neutral-200 rounded-2xl"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Side Navigation */}
      <div className="fixed left-0 top-0 bottom-0 w-20 bg-white shadow-soft-lg flex flex-col items-center py-8 z-10">
        <Link href="/" className="mb-8">
          <div className="bg-primary-gradient p-3 rounded-xl shadow-soft-md">
            <Ticket className="h-6 w-6 text-white" />
          </div>
        </Link>
        
        <Link href="/" className="mb-6">
          <div className="p-3 text-neutral-500 hover:text-primary-600 hover:bg-neutral-100 rounded-xl transition-all">
            <Home size={22} />
          </div>
        </Link>
        
        <Link href="/events" className="mb-6">
          <div className="p-3 text-neutral-500 hover:text-primary-600 hover:bg-neutral-100 rounded-xl transition-all">
            <Calendar size={22} />
          </div>
        </Link>
        
        <Link href="/events" className="mb-6">
          <div className="p-3 text-neutral-500 hover:text-primary-600 hover:bg-neutral-100 rounded-xl transition-all">
            <Ticket size={22} />
          </div>
        </Link>
        
        <Link href="/dashboard" className="mb-6">
          <div className="p-3 text-neutral-500 hover:text-primary-600 hover:bg-neutral-100 rounded-xl transition-all">
            <DollarSign size={22} />
          </div>
        </Link>
        
        <div className="mt-auto">
          <Link href="/dashboard/settings">
            <div className="p-3 text-neutral-500 hover:text-primary-600 hover:bg-neutral-100 rounded-xl transition-all">
              <Settings size={22} />
            </div>
          </Link>
        </div>
      </div>

      <div className="ml-20 p-8">
        {/* Header Area */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2 text-primary-600">EventHub Dashboard</h1>
            <p className="text-neutral-600">{greeting}, {user?.username || 'User'}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/dashboard/profile" className="text-neutral-600 hover:text-primary-600 transition">
              <div className="flex items-center gap-3 bg-primary-gradient shadow-soft-md hover:bg-neutral-100 p-2 px-4 rounded-xl transition-all">
                <div className="w-10 h-10 rounded-full bg-primary-500 text-[#ff6b0f] text-bold text-2xl flex items-center justify-center">
                  {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="hidden md:inline text-white">{user?.username || 'User'}</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Setup Account Alert */}
        <div className="mb-8 bg-accent-50 border-l-4 border-accent-500 rounded-2xl overflow-hidden shadow-soft-md">
          <div className="p-6 flex items-center">
            <div className="bg-accent-100 text-accent-600 p-3 rounded-xl mr-4">
              <AlertCircle size={24} />
            </div>
            <div>
              <h3 className="font-medium text-lg text-accent-700">Complete your account setup</h3>
              <p className="text-accent-600 mt-1">
                Go to <Link href="/dashboard/settings" className="font-medium underline hover:text-accent-800">Settings</Link> to add your payment account for receiving bookings.
              </p>
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Stats Section - 2/3 Width */}
          <div className="col-span-1 lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Stat Card 1 */}
              <div className="bg-white shadow-soft-lg p-6 rounded-2xl relative overflow-hidden group hover:shadow-soft-xl transition-all">
                <div className="absolute top-0 right-0 p-3 bg-primary-50 text-primary-500 rounded-bl-xl">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="opacity-10 absolute -right-8 -bottom-8">
                  <Calendar className="h-32 w-32 text-primary-400" />
                </div>
                <p className="text-primary-600 text-sm mb-1 font-medium">Total Events</p>
                <h2 className="text-4xl font-bold text-primary-700">{stats.total_events}</h2>
                <div className="mt-4 pt-4 border-t border-neutral-100">
                  <Link href="/events" className="text-sm text-primary-600 hover:text-primary-800 flex items-center">
                    View all events
                    <ChevronRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>

              {/* Stat Card 2 */}
              <div className="bg-white shadow-soft-lg p-6 rounded-2xl relative overflow-hidden group hover:shadow-soft-xl transition-all">
                <div className="absolute top-0 right-0 p-3 bg-secondary-50 text-secondary-500 rounded-bl-xl">
                  <Ticket className="h-5 w-5" />
                </div>
                <div className="opacity-10 absolute -right-8 -bottom-8">
                  <Ticket className="h-32 w-32 text-secondary-400" />
                </div>
                <p className="text-secondary-600 text-sm mb-1 font-medium">Tickets Sold</p>
                <h2 className="text-4xl font-bold text-secondary-700">{stats.total_tickets}</h2>
                <div className="mt-4 pt-4 border-t border-neutral-100">
                  <Link href="/tickets" className="text-sm text-secondary-600 hover:text-secondary-800 flex items-center">
                    Manage tickets
                    <ChevronRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>

              {/* Stat Card 3 */}
              <div className="bg-white shadow-soft-lg p-6 rounded-2xl relative overflow-hidden group hover:shadow-soft-xl transition-all">
                <div className="absolute top-0 right-0 p-3 bg-accent-50 text-accent-500 rounded-bl-xl">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div className="opacity-10 absolute -right-8 -bottom-8">
                  <DollarSign className="h-32 w-32 text-accent-400" />
                </div>
                <p className="text-accent-600 text-sm mb-1 font-medium">Total Revenue</p>
                <h2 className="text-4xl font-bold text-accent-700">₦{stats.total_revenue}</h2>
                <div className="mt-4 pt-4 border-t border-neutral-100">
                  <Link href="/revenue" className="text-sm text-accent-600 hover:text-accent-800 flex items-center">
                    View revenue details
                    <ChevronRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Events - Visually Improved */}
            <div className="bg-white shadow-soft-lg rounded-2xl overflow-hidden">
              <div className="bg-neutral-100 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center gap-2 text-neutral-800">
                  <Activity size={20} className="text-primary-500" />
                  Recent Events
                </h2>
                <Link href="/events" className="text-sm text-neutral-600 hover:text-primary-600 flex items-center">
                  View all
                  <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>
              
              <div>
                {Array.isArray(stats.recent_events) && stats.recent_events.length > 0 ? (
                  stats.recent_events.map((e, idx) => (
                    <Link href={`/events/${e.id}`} key={idx} className="block px-6 py-4 hover:bg-neutral-50 transition-colors border-b border-neutral-100 last:border-0">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold shadow-soft-md ${
                          idx % 3 === 0 ? 'bg-primary-100 text-primary-600' : 
                          idx % 3 === 1 ? 'bg-secondary-100 text-secondary-600' : 
                          'bg-accent-100 text-accent-600'
                        }`}>
                          {e.title.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-lg text-neutral-800">{e.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-neutral-500">
                            <span className="flex items-center">
                              <Ticket size={14} className="mr-1" />
                              {e.tickets_sold} tickets
                            </span>
                            <span className="flex items-center">
                              <DollarSign size={14} className="mr-1" />
                              ₦{e.revenue}
                            </span>
                          </div>
                        </div>
                        <div className="bg-neutral-100 p-2 rounded-lg">
                          <ChevronRight size={16} className="text-neutral-400" />
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="px-6 py-12 text-center">
                    <div className="bg-neutral-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                      <Calendar size={32} className="text-neutral-400" />
                    </div>
                    <h3 className="text-xl font-medium mb-2 text-neutral-800">No events yet</h3>
                    <p className="text-neutral-500 mb-6">Create your first event to get started</p>
                    <Link 
                      href="/events/create"
                      className="inline-flex items-center px-6 py-3 bg-primary-gradient text-white rounded-xl font-medium shadow-soft-lg hover:opacity-90 transition-all duration-200"
                    >
                      <PlusCircle size={18} className="mr-2" />
                      Create Event
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Side Section - 1/3 Width */}
          <div className="col-span-1 lg:col-span-4 space-y-6">
            {/* Create Event Card */}
            <div className="bg-primary-50 p-6 rounded-2xl text-center shadow-soft-lg">
              <Link href = "/events/create" className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-soft-md">
                <PlusCircle size={32} className="text-primary-600" />
              </Link>
              <h3 className="text-xl font-bold mb-2 text-primary-700">Create New Event</h3>
              <p className="text-primary-600 mb-4">Launch your next amazing event in minutes</p>
              <Link 
                href="/events/create" 
                className="block w-full py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-all duration-200 shadow-soft-md"
              >
                Get Started
              </Link>
            </div>

            {/* Actions Grid */}
            <div className="bg-white shadow-soft-lg rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-neutral-800">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <Link href="/events" className="bg-neutral-100 rounded-xl p-4 hover:bg-neutral-200 transition-all duration-200 flex flex-col items-center text-center">
                  <List size={24} className="mb-2 text-primary-500" />
                  <span className="text-sm text-neutral-700">Events</span>
                </Link>
                
                <Link href="/events" className="bg-neutral-100 rounded-xl p-4 hover:bg-neutral-200 transition-all duration-200 flex flex-col items-center text-center">
                  <Ticket size={24} className="mb-2 text-secondary-500" />
                  <span className="text-sm text-neutral-700">Tickets</span>
                </Link>
                
                <Link href="/dashboard/profile" className="bg-neutral-100 rounded-xl p-4 hover:bg-neutral-200 transition-all duration-200 flex flex-col items-center text-center">
                  <Users size={24} className="mb-2 text-accent-500" />
                  <span className="text-sm text-neutral-700">Profile</span>
                </Link>
                
                <Link href="/dashboard" className="bg-neutral-100 rounded-xl p-4 hover:bg-neutral-200 transition-all duration-200 flex flex-col items-center text-center">
                  <LineChart size={24} className="mb-2 text-neutral-700" />
                  <span className="text-sm text-neutral-700">Analytics</span>
                </Link>
              </div>
            </div>

            {/* Performance Card */}
            <div className="bg-secondary-50 rounded-2xl p-6 shadow-soft-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-secondary-700">Performance</h3>
                <span className="bg-secondary-100 text-secondary-700 px-3 py-1 rounded-full text-xs">This Month</span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-secondary-600">Ticket Sales</span>
                    <span className="text-secondary-700 font-medium">+{Math.max(1, Math.floor(stats.total_tickets * 0.2))}%</span>
                  </div>
                  <div className="h-2 bg-secondary-100 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary-500 w-3/4 rounded-full"></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-secondary-600">Revenue</span>
                    <span className="text-secondary-700 font-medium">+{Math.max(1, Math.floor(stats.total_revenue * 0.15))}%</span>
                  </div>
                  <div className="h-2 bg-secondary-100 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary-500 w-2/3 rounded-full"></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-secondary-600">New Attendees</span>
                    <span className="text-secondary-700 font-medium">+{Math.max(1, Math.floor(stats.total_tickets * 0.35))}%</span>
                  </div>
                  <div className="h-2 bg-secondary-100 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary-500 w-1/2 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
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