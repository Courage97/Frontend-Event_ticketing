'use client';
import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { User, Mail, Calendar, Tag, LogOut, Loader2, ChevronLeft, Ticket } from 'lucide-react';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('access');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await axios.get('/auth/profile/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch (error) {
        console.error('Profile fetch error:', error);
        toast.error('Session expired. Please login again.');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    toast.success('Logged out successfully');
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <Toaster position="top-center" />
      
      {/* Header with brand logo */}
      <header className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-primary-gradient p-1.5 rounded-md shadow-soft-sm group-hover:shadow-soft-md transition-all duration-300">
              <Ticket className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-lg font-display font-bold text-neutral-900 dark:text-white">EventHub</h1>
          </Link>
          
          <button 
            onClick={() => router.back()}
            className="text-primary-600 hover:text-primary-700 bg-primary-gradient hover:shadow-soft-md text-white dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300"
                >
            <ChevronLeft className="h-6 w-6 mr-1" />
            Back
          </button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-lg mx-auto">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-soft-md overflow-hidden">
            {/* Profile Header */}
            <div className="bg-primary-gradient p-6 relative">
              <div className="flex justify-center">
                <div className="h-20 w-20 rounded-full border-4 border-white dark:border-neutral-800 bg-white dark:bg-neutral-800 flex items-center justify-center shadow-soft-md">
                  <span className="text-2xl font-bold text-primary-600">
                    {user?.username ? user.username.charAt(0).toUpperCase() : ''}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Profile Content */}
            <div className="p-6">
              {loading ? (
                <div className="py-8 flex flex-col items-center justify-center">
                  <Loader2 className="h-8 w-8 text-primary-500 animate-spin mb-4" />
                  <p className="text-neutral-500 dark:text-neutral-400">Loading profile information...</p>
                </div>
              ) : user ? (
                <>
                  <h1 className="text-xl font-bold text-center text-neutral-900 dark:text-white mb-6">
                    {user.username}
                  </h1>
                  
                  <div className="space-y-4">
                    <div className="flex items-center p-3 bg-neutral-100 dark:bg-neutral-700/50 rounded-lg">
                      <Mail className="h-5 w-5 text-primary-500 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">Email</p>
                        <p className="font-medium text-neutral-900 dark:text-white">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-neutral-100 dark:bg-neutral-700/50 rounded-lg">
                      <Tag className="h-5 w-5 text-primary-500 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">User Type</p>
                        <div className="flex items-center">
                          <span className="font-medium text-neutral-900 dark:text-white capitalize">{user.user_type}</span>
                          {user.user_type === 'organizer' && (
                            <span className="ml-2 px-2 py-0.5 bg-accent-500/10 text-accent-600 dark:text-accent-400 text-xs rounded-full">
                              Event Creator
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-neutral-100 dark:bg-neutral-700/50 rounded-lg">
                      <Calendar className="h-5 w-5 text-primary-500 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">Member Since</p>
                        <p className="font-medium text-neutral-900 dark:text-white">
                          {new Date(user.date_joined).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <button
                      onClick={handleLogout}
                      className="w-full bg-primary-gradient hover:shadow-soft-md text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-all duration-300"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-error-600 dark:text-error-400 mb-4">Failed to load profile information</p>
                  <button
                    onClick={() => router.push('/login')}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    Return to Login
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Additional section */}
          {user && (
            <div className="mt-4 bg-white dark:bg-neutral-800 rounded-2xl shadow-soft-md p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Ticket className="h-5 w-5 text-primary-500 mr-2" />
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {user.user_type === 'organizer' ? 'Manage Your Events' : 'Tickets & Bookings'}
                  </span>
                </div>
                <Link 
                  href={user.user_type === 'organizer' ? '/dashboard' : '/tickets'} 
                  className="text-primary-600 hover:text-primary-700 bg-primary-gradient hover:shadow-soft-md text-white dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300"
                >
                  View
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}