'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import api from '@/utils/axios';
import { Ticket, Mail, Lock, User, Sparkles } from 'lucide-react';

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    user_type: 'organizer',
  });

  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.username || !form.email || !form.password) {
      toast.error('All fields are required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error('Invalid email address');
      return false;
    }

    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const res = await api.post('/auth/register/', form);
      localStorage.setItem('access', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);
      toast.success('Registration successful! Redirecting...');
      setTimeout(() => router.push('/login'), 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-soft-gradient py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-ticket-pattern pointer-events-none"></div>
      <div className="absolute top-20 right-20 w-32 h-32 bg-secondary-gradient rounded-full blur-xl opacity-20 animate-float pointer-events-none"></div>
      <div className="absolute bottom-20 left-20 w-40 h-40 bg-accent-gradient rounded-full blur-xl opacity-20 animate-float pointer-events-none"></div>
      
      <Toaster position="top-right" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-gradient p-4 rounded-2xl shadow-soft-lg rotate-3 hover:rotate-0 transition-all duration-300">
              <Ticket size={36} className="text-white drop-shadow-md" />
            </div>
          </div>
          <h1 className="font-display text-4xl font-bold text-neutral-800">EventHub</h1>
          <p className="mt-2 text-neutral-600 font-sans">Your gateway to exceptional event experiences</p>
        </div>
        
        <div className="bg-glass-light backdrop-blur-md border border-neutral-200 shadow-soft-xl rounded-2xl overflow-hidden">
          <div className="bg-primary-gradient px-6 py-5 shadow-inner-highlight">
            <h2 className="text-2xl font-heading font-bold text-white flex items-center">
              Create Account
              <span className="ml-2 bg-white/20 p-1 rounded-lg">
                <Sparkles size={16} className="text-white" />
              </span>
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="px-6 py-8 space-y-6">
            <div className="space-y-5">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-primary-500 transition-colors">
                  <User size={18} />
                </div>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Username"
                  className="pl-12 w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-primary-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  type="email"
                  className="pl-12 w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-primary-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password (min. 6 characters)"
                  type="password"
                  className="pl-12 w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div className="pt-2">
                <label className="block text-sm font-medium text-neutral-700 mb-2 ml-1">I am joining as:</label>
                <div className="grid grid-cols-3 gap-3">
                  <div 
                    className={`cursor-pointer rounded-xl border transition-all duration-200 ${
                      form.user_type === 'organizer' 
                        ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-soft-sm' 
                        : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
                    } flex items-center justify-center py-3 px-2`}
                    onClick={() => setForm({...form, user_type: 'organizer'})}
                  >
                    <span className="font-medium">Event Organizer</span>
                  </div>
                  <div 
                    className={`cursor-pointer rounded-xl border transition-all duration-200 ${
                      form.user_type === 'vendor' 
                        ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-soft-sm' 
                        : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
                    } flex items-center justify-center py-3 px-2`}
                    onClick={() => setForm({...form, user_type: 'vendor'})}
                  >
                    <span className="font-medium">Event Vendor</span>
                  </div>
                  <div 
                    className={`cursor-pointer rounded-xl border transition-all duration-200 ${
                      form.user_type === 'guest' 
                        ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-soft-sm' 
                        : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
                    } flex items-center justify-center py-3 px-2`}
                    onClick={() => setForm({...form, user_type: 'guest'})}
                  >
                    <span className="font-medium">Event Guest</span>
                  </div>
                </div>
                <input 
                  type="hidden" 
                  name="user_type" 
                  value={form.user_type} 
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-gradient text-white font-medium py-3.5 px-4 rounded-xl shadow-soft-md hover:shadow-soft-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : 'Create Account'}
            </button>
            
            <div className="text-center mt-6">
              <p className="text-neutral-600 font-sans">
                Already have an account?{' '}
                <Link href="/login" className="text-primary-600 font-medium hover:text-primary-700 underline-offset-2 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-xs text-neutral-500">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="text-primary-600 hover:underline underline-offset-2">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-primary-600 hover:underline underline-offset-2">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}