'use client';
import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Ticket, ChevronRight, Calendar, RefreshCw, CheckCircle, Clock, XCircle, Mail, ArrowLeft } from 'lucide-react';

export default function SentRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const router = useRouter();

  const fetchRequests = () => {
    setLoading(true);
    const token = localStorage.getItem('access');
    if (!token) {
      localStorage.setItem('post_login_redirect', '/vendors/sent-requests');
      return router.push('/login');
    }

    axios.get('/vendors/sent-requests/')
      .then(res => setRequests(res.data))
      .catch(() => toast.error('Failed to load sent requests'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, [router]);

  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case 'pending':
        return <Clock className="text-yellow-500" size={18} />;
      case 'accepted':
        return <CheckCircle className="text-green-500" size={18} />;
      case 'rejected':
        return <XCircle className="text-red-500" size={18} />;
      default:
        return <Mail className="text-blue-500" size={18} />;
    }
  };

  const getStatusClass = (status) => {
    switch(status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const filteredRequests = filterStatus === 'all' 
    ? requests 
    : requests.filter(req => req.status.toLowerCase() === filterStatus);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <button onClick={() => router.push('/dashboard')} className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft size={18} className="mr-1" />
            <span>Back to Dashboard</span>
          </button>
        </div>
        <button 
          onClick={fetchRequests} 
          className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          <RefreshCw size={16} className="mr-2" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Ticket className="mr-2 text-blue-600" />
          Sent Vendor Requests
        </h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 rounded-md border ${filterStatus === 'all' ? 'bg-blue-100 border-blue-300 text-blue-800' : 'bg-white border-gray-300'}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1 rounded-md border ${filterStatus === 'pending' ? 'bg-yellow-100 border-yellow-300 text-yellow-800' : 'bg-white border-gray-300'}`}
          >
            Pending
          </button>
          <button 
            onClick={() => setFilterStatus('accepted')}
            className={`px-3 py-1 rounded-md border ${filterStatus === 'accepted' ? 'bg-green-100 border-green-300 text-green-800' : 'bg-white border-gray-300'}`}
          >
            Accepted
          </button>
          <button 
            onClick={() => setFilterStatus('rejected')}
            className={`px-3 py-1 rounded-md border ${filterStatus === 'rejected' ? 'bg-red-100 border-red-300 text-red-800' : 'bg-white border-gray-300'}`}
          >
            Rejected
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <RefreshCw size={24} className="animate-spin text-blue-600 mr-3" />
          <span className="text-lg text-gray-600">Loading sent requests...</span>
        </div>
      ) : !requests.length ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Mail className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-xl text-gray-700 mb-2">You haven't sent any requests yet</h3>
          <p className="text-gray-500 mb-6">When you send requests to vendors, they will appear here</p>
          <button 
            onClick={() => router.push('/vendors/explore')}
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Find Vendors
          </button>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Mail className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-xl text-gray-700 mb-2">No {filterStatus} requests found</h3>
          <p className="text-gray-500">Try changing your filter or check back later</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRequests.map((req) => (
            <div key={req.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100">
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">{req.event_title}</h3>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full border flex items-center ${getStatusClass(req.status)}`}>
                    {getStatusIcon(req.status)}
                    <span className="ml-1">{req.status}</span>
                  </span>
                </div>
                
                <p className="text-blue-600 font-medium mb-3">→ {req.vendor_service_name}</p>
                
                {req.message && (
                  <div className="bg-gray-50 p-3 rounded-md mb-3 border-l-4 border-gray-300 text-gray-700 text-sm italic">
                    "{req.message}"
                  </div>
                )}
                
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <Calendar size={16} className="mr-1" />
                  <span>Sent on: {new Date(req.created_at).toLocaleString()}</span>
                </div>
                
                <div className="pt-3 border-t border-gray-100 mt-2 flex justify-between">
                  <button
                    onClick={() => router.push(`/vendors/request-details/${req.id}`)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                  >
                    View Details
                    <ChevronRight size={16} className="ml-1" />
                  </button>
                  {req.status.toLowerCase() === 'accepted' && (
                    <button
                      onClick={() => router.push('/dashboard/events')}
                      className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center"
                    >
                      Go to Event
                      <ChevronRight size={16} className="ml-1" />
                    </button>
                  )}
                </div>
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