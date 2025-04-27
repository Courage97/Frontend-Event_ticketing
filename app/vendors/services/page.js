'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/utils/axios';

export default function VendorServiceListPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/vendors/services/')
      .then(res => setServices(res.data))
      .catch(err => {
        console.error(err);
        alert('Failed to fetch vendor services.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">🛍 Browse Vendor Services</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading services...</p>
      ) : services.length === 0 ? (
        <p className="text-center text-gray-400">No vendor services found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {services.map(service => (
            <div key={service.slug} className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition">
              <img
                src={service.image || '/placeholder.jpg'}
                alt={service.service_name}
                className="w-full h-48 object-cover"
                onError={(e) => { e.target.src = '/placeholder.jpg'; }}
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{service.business_name}</h3>
                <p className="text-sm text-gray-500">{service.service_name}</p>

                <Link
                  href={`/vendors/services/${service.slug}`}
                  className="inline-block mt-3 px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
        <div className="flex justify-center items-center mb-2">
          <span className="font-medium text-gray-700">EventHub</span>
        </div>
        <p>© {new Date().getFullYear()} EventHub. All rights reserved.</p>
      </footer>


    </div>
  );
}
