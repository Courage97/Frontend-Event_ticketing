'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from '@/utils/axios';
import toast, { Toaster } from 'react-hot-toast';

export default function ResetPassword() {
  const { uid, token } = useParams();
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [done, setDone] = useState(false);

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      await axios.post(`/reset-password/${uid}/${token}/`, { password });
      setDone(true);
      toast.success('Password reset successful! Redirecting...');
      setTimeout(() => router.push('/login'), 3000);
    } catch (err) {
      toast.error('Invalid or expired reset link.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Toaster position="top-center" />
      <form
        onSubmit={handleReset}
        className="bg-white shadow-md rounded-lg px-8 py-10 w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Reset Password</h2>

        {done ? (
          <p className="text-center text-green-600 font-medium">
            Password updated! Redirecting to login...
          </p>
        ) : (
          <>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Reset Password
            </button>
          </>
        )}
      </form>
    </div>
  );
}
