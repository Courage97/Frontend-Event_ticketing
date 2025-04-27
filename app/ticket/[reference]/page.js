'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/utils/axios';

export default function TicketConfirmation({ params }) {
  const { reference } = params;
  const router = useRouter();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/events/ticket/${reference}/`)
      .then(res => {
        setTicket(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        alert("Ticket not found.");
        router.push('/events'); // fallback
      });
  }, [reference]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4 text-center">🎉 Ticket Confirmed</h1>

      <div className="bg-white shadow p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">{ticket.event_title}</h2>
        <p className="text-gray-600 mb-1">{new Date(ticket.event_date).toLocaleString()}</p>
        <p className="text-gray-500 mb-3">{ticket.event_location}</p>

        <div className="mb-4">
          <img 
            src={ticket.qr_code} 
            alt="QR Code" 
            className="mx-auto w-40 h-40 border rounded" 
          />
        </div>

        <div className="text-center">
          <p className="mb-1"><strong>Reference:</strong> {ticket.reference}</p>
          <p><strong>Quantity:</strong> {ticket.quantity}</p>
          <p><strong>Total Paid:</strong> ₦{ticket.amount_paid}</p>
        </div>

        <div className="mt-6 text-center">
          <button 
            onClick={() => router.push('/my-tickets')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            View My Tickets
          </button>
        </div>
      </div>
    </div>
  );
}
