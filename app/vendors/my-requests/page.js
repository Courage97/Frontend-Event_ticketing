'use client';
import { useEffect, useState } from 'react';
import axios from '@/utils/axios';
import toast from 'react-hot-toast';
import { Ticket, RefreshCw, MapPin, Clock, DollarSign, Calendar, Users, MessageSquare } from 'lucide-react';
import Image from 'next/image';

export default function IncomingVendorRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [eventDetails, setEventDetails] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/vendors/my-requests/');
      setRequests(res.data);
      
      // Extract event identifiers from requests
      // This assumes the API returns either event_id, event_slug, or some other identifier
      const eventIdsToFetch = [];
      const eventSlugsMap = {};
      
      res.data.forEach(req => {
        // Check what field is available in the request data
        // We'll try event_slug first, then fall back to other identifiers
        const eventId = req.event_slug || req.event_id || req.id;
        if (eventId && !eventIdsToFetch.includes(eventId)) {
          eventIdsToFetch.push(eventId);
          eventSlugsMap[eventId] = req.vendor_service_slug; // We'll use this for mapping later
        }
      });
      
      // Only fetch details for valid event IDs
      if (eventIdsToFetch.length > 0) {
        const validDetails = {};
        
        // Fetch event details one by one to avoid issues with undefined slugs
        for (const eventId of eventIdsToFetch) {
          if (eventId) {
            try {
              const eventDetail = await getEventDetails(eventId);
              if (eventDetail) {
                validDetails[eventSlugsMap[eventId]] = eventDetail;
              }
            } catch (error) {
              console.log(`Could not fetch details for event: ${eventId}`);
            }
          }
        }
        
        setEventDetails(validDetails);
      }
    } catch (err) {
      toast.error('Failed to fetch vendor requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const getEventDetails = async (slug) => {
    if (!slug) return null;
    
    try {
      const res = await axios.get(`/events/detail/${slug}/`);
      return res.data;
    } catch (err) {
      console.error(`Failed to fetch details for event ${slug}:`, err);
      return null;
    }
  };

  const respondToRequest = async (slug, action) => {
    if (!slug) {
      toast.error('Invalid request identifier');
      return;
    }
    
    try {
      await axios.post(`/vendors/respond-request/${slug}/`, { action });
      toast.success(`Request ${action === 'accepted' ? 'accepted' : 'declined'} successfully`);
      fetchRequests(); // refresh the list
    } catch (err) {
      toast.error('Action failed');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <RefreshCw className="h-8 w-8 text-primary-500 animate-spin" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header with Logo */}
      <div className="flex items-center mb-8">
        <div className="bg-primary-gradient p-2 rounded-md shadow-soft-sm mr-3">
          <Ticket className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold">EventHub Vendor Requests</h1>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Incoming Event Requests</h2>
        <button
          onClick={fetchRequests}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      {!requests.length ? (
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-8 text-center">
          <p className="text-neutral-600">No incoming requests available at this time.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {requests.map((req) => {
            // Use vendor_service_slug as the key for finding event details
            const event = eventDetails[req.vendor_service_slug] || {};
            
            return (
              <div
                key={req.id}
                className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-soft-md"
              >
                <div className="md:flex">
                  {/* Event Flyer */}
                  <div className="md:w-1/3 h-48 md:h-auto relative bg-neutral-100">
                    {event.flyer ? (
                      <Image 
                        src={event.flyer} 
                        alt={event.title || req.event_title}
                        layout="fill"
                        objectFit="cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-neutral-50">
                        <Calendar className="h-12 w-12 text-neutral-400" />
                      </div>
                    )}
                  </div>

                  {/* Event Details */}
                  <div className="p-5 md:w-2/3">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-bold text-neutral-800 mb-2">
                        {event.title || req.event_title || "Untitled Event"}
                      </h3>
                      <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                        req.status === 'accepted' 
                          ? 'bg-success-50 text-success-600' 
                          : req.status === 'declined'
                          ? 'bg-error-50 text-error-600'
                          : 'bg-warning-50 text-warning-600'
                      }`}>
                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                      </span>
                    </div>

                    <div className="space-y-2 mt-3 text-sm text-neutral-600">
                      <div className="flex items-start">
                        <Clock className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p>Start: {formatDate(event.start_date)}</p>
                          <p>End: {formatDate(event.end_date)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        <p>{event.location || 'Location not specified'}</p>
                      </div>
                      
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 flex-shrink-0" />
                        <p>Ticket Price: ${event.ticket_price || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="mt-4 bg-neutral-50 p-3 rounded-md">
                      <div className="flex items-start">
                        <MessageSquare className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium mb-1">Request Message:</p>
                          <p className="text-sm">{req.message || 'No message provided'}</p>
                        </div>
                      </div>
                    </div>

                    {req.status === 'pending' && (
                      <div className="flex gap-3 mt-5">
                        <button
                          onClick={() => respondToRequest(req.vendor_service_slug, 'accepted')}
                          className="bg-success-500 hover:bg-success-600 text-white px-4 py-2 rounded-md flex-1"
                        >
                          Accept Request
                        </button>
                        <button
                          onClick={() => respondToRequest(req.vendor_service_slug, 'declined')}
                          className="bg-error-500 hover:bg-error-600 text-white px-4 py-2 rounded-md flex-1"
                        >
                          Decline Request
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <footer className="bg-white border-t border-neutral-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="bg-primary-gradient p-1.5 rounded-md shadow-soft-sm">
                <Ticket className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium text-neutral-700">EventHub</span>
            </div>
            <div className="text-sm text-neutral-500">
              © {new Date().getFullYear()} EventHub. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}