'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from '@/utils/axios';
import toast from 'react-hot-toast';

export default function VendorServicePage() {
  const { slug } = useParams();
  const router = useRouter();

  const [service, setService] = useState(null);
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [message, setMessage] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [sentRequests, setSentRequests] = useState([]);
  


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/vendors/services/${slug}/`);
        setService(res.data);
      } catch (err) {
        toast.error('Failed to load service.');
        router.push('/vendors');
      }

      const token = localStorage.getItem('access');
      if (token) {
        try {
          const userRes = await axios.get('/auth/profile/');
          setUser(userRes.data);

          // If organizer, load their events
          if (userRes.data.user_type === 'organizer') {
            const eventRes = await axios.get('/events/my-events/');
            setEvents(eventRes.data);
          
            const sentRes = await axios.get('/vendors/sent-requests/');
            setSentRequests(sentRes.data);
          }
          
        } catch {
          toast.error('Failed to fetch user info');
        }
      }
    };

    fetchData();
  }, [slug, router]);

  const hasRequested = (eventId) => {
    return sentRequests.some(
      (req) => req.event === eventId && req.vendor_service === service.id
    );
  };
  

  const handleBooking = async () => {
    if (!date || !time) return toast.error('Select date and time');
    try {
      setLoading(true);
      await axios.post('/vendors/book/', {
        service: service.id,
        date,
        time,
      });
      toast.success('Vendor booked!');
    } catch {
      toast.error('Failed to book service');
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async () => {
    if (!selectedEvent) return toast.error('Select an event first');
  
    try {
        await axios.post('/vendors/request/', {
          event: selectedEvent,
          vendor_service: service.id,
          message,
        });
        toast.success('Request sent to vendor!');
        router.push('/vendors/sent-requests');
      } catch (err) {
        const error = err.response?.data;
      
        // 🧠 Handle duplicate request
        if (error?.non_field_errors?.[0]?.includes('must make a unique set')) {
          toast.error('You’ve already requested this vendor for this event.');
          router.push('/vendors/sent-requests');
        } else {
          toast.error('Failed to send request.');
        }
      }
      
  };
  
  
  if (!service) return <p className="text-center mt-10">Loading service...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">{service.business_name}</h1>
      <p className="text-xl text-gray-600 mb-1">{service.service_name}</p>

      {service.image && (
        <img
          src={service.image}
          alt={service.service_name}
          className="w-full h-64 object-cover rounded mb-4"
        />
      )}

      <p className="mb-6 text-gray-700">{service.description}</p>

      {/* Booking Section */}
      {user?.user_type !== 'vendor' && (
        <div className="bg-gray-50 p-4 rounded shadow mb-6">
          <h3 className="font-semibold text-lg mb-2">📅 Book This Vendor</h3>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded mr-2"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="border p-2 rounded mr-2"
          />
          <button
            onClick={handleBooking}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {loading ? 'Booking...' : 'Book Vendor'}
          </button>
        </div>
      )}

      {/* Organizer Request Section */}
      {user?.user_type === 'organizer' && (
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold text-lg mb-3">📨 Request Vendor for Your Event</h3>

          <select
            className="w-full border p-2 mb-3 rounded"
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
          >
            <option value="">-- Select Event --</option>
            {events.map((e) => (
              <option key={e.id} value={e.id}>
                {e.title}
              </option>
            ))}
          </select>

          <textarea
            className="w-full border p-2 mb-3 rounded"
            rows="3"
            placeholder="Optional message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

            {selectedEvent && hasRequested(selectedEvent) ? (
            <p className="text-yellow-600 font-medium">
                ✅ You’ve already sent a request for this vendor for the selected event.
            </p>
            ) : (
            <button
                onClick={handleSendRequest}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
                Send Request
            </button>
            )}

        </div>
      )}
    </div>
  );
}
