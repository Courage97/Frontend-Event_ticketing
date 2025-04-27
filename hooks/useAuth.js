'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/utils/axios';

export default function useAuth(requiredType = null) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) {
      localStorage.setItem('post_login_redirect', window.location.pathname);
      router.push('/login');
      return;
    }

    axios.get('/auth/profile/', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      const userData = res.data;
      if (requiredType && userData.user_type !== requiredType) {
        router.push('/unauthorized'); // Optional unauthorized page
      } else {
        setUser(userData);
      }
    })
    .catch(() => {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      router.push('/login');
    })
    .finally(() => setChecking(false));
  }, [requiredType, router]);

  return { user, checking };
}
