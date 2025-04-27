'use client';
import { useState } from 'react';
import axios from '@/utils/axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { Ticket, Mail, Lock, LogIn } from 'lucide-react';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.email || !form.password) {
      toast.error('Email and password are required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error('Invalid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
    setLoading(true);
  
    try {
      const res = await axios.post('/auth/login/', form);
      const { access, refresh, user } = res.data;
      const user_type = user.user_type;


  
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
  
      const redirect = localStorage.getItem('post_login_redirect');
      localStorage.removeItem('post_login_redirect');
  
      // 🎯 Dynamic redirect logic
      if (redirect) {
        router.push(redirect);
      } else {
        switch (user_type) {
          case 'organizer':
            router.push('/dashboard');
            break;
          case 'guest':
            router.push('/events');
            break;
          case 'vendor':
            router.push('/vendors/dashboard');
            break;
          default:
            router.push('/'); // fallback
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-soft-gradient py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-ticket-pattern pointer-events-none"></div>
      <div className="absolute top-20 left-20 w-32 h-32 bg-primary-gradient rounded-full blur-xl opacity-20 animate-float pointer-events-none"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-secondary-gradient rounded-full blur-xl opacity-20 animate-float pointer-events-none"></div>
      
      <Toaster position="top-right" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-gradient p-4 rounded-2xl shadow-soft-lg rotate-3 hover:rotate-0 transition-all duration-300">
              <Ticket size={36} className="text-white drop-shadow-md" />
            </div>
          </div>
          <h1 className="font-display text-4xl font-bold text-neutral-800">EventHub</h1>
          <p className="mt-2 text-neutral-600 font-sans">Welcome back to your event platform</p>
        </div>
        
        <div className="bg-glass-light backdrop-blur-md border border-neutral-200 shadow-soft-xl rounded-2xl overflow-hidden">
          <div className="bg-primary-gradient px-6 py-5 shadow-inner-highlight">
            <h2 className="text-2xl font-heading font-bold text-white flex items-center">
              Sign In
              <span className="ml-2 bg-white/20 p-1 rounded-lg">
                <LogIn size={16} className="text-white" />
              </span>
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="px-6 py-8 space-y-6">
            <div className="space-y-5">
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
                  placeholder="Password"
                  type="password"
                  className="pl-12 w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-600">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <Link href="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500 hover:underline underline-offset-2">
                    Forgot password?
                  </Link>
                </div>
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
                  Signing In...
                </span>
              ) : 'Sign In'}
            </button>
            
            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-neutral-200"></div>
              <span className="px-4 text-sm text-neutral-500">Or continue with</span>
              <div className="flex-grow border-t border-neutral-200"></div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center py-2.5 px-4 border border-neutral-200 rounded-xl bg-white hover:bg-neutral-50 shadow-soft-sm transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center py-2.5 px-4 border border-neutral-200 rounded-xl bg-white hover:bg-neutral-50 shadow-soft-sm transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" fill="#1877F2"/>
                </svg>
                Facebook
              </button>
            </div>
            
            <div className="text-center mt-6">
              <p className="text-neutral-600 font-sans">
                Don't have an account?{' '}
                <Link href="/register" className="text-primary-600 font-medium hover:text-primary-700 underline-offset-2 hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-xs text-neutral-500">
            By signing in, you agree to our{' '}
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