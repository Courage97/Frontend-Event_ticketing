'use client';
import { useEffect, useState, useRef } from 'react';
import axios from '@/utils/axios';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import Link from 'next/link';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Download, 
  ArrowLeft, 
  Ticket as TicketIcon, 
  Loader, 
  AlertCircle,
  FileText 
} from 'lucide-react';

// Common style constants
const COLORS = {
  blue: '#2563eb',
  white: '#ffffff',
  black: '#000000',
  transparentBlack: 'rgba(0, 0, 0, 0.4)',
  transparentWhite: 'rgba(255, 255, 255, 0.9)',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937'
  }
};

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);
  const { user, checking } = useAuth();
  const router = useRouter();
  const ticketRefs = useRef({});

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) {
      localStorage.setItem('post_login_redirect', '/my-tickets');
      router.push('/login');
      return;
    }

    const fetchTickets = async () => {
      try {
        const res = await axios.get('/events/my-tickets/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTickets(res.data);
      } catch (err) {
        console.error(err);
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [router]);

  // Handle modern CSS color formats that html2canvas doesn't support
  const sanitizeElementStyles = (element) => {
    // Function to recursively sanitize all elements
    const processElement = (el) => {
      // Get all style properties
      const computedStyle = window.getComputedStyle(el);
      
      // List of problematic color formats to check for
      const problematicFormats = ['oklch', 'oklab', 'lab', 'lch', 'color-mix', 'color('];
      
      // Properties that could contain color values
      const colorProperties = [
        'color', 'backgroundColor', 'borderColor', 'borderTopColor', 'borderRightColor',
        'borderBottomColor', 'borderLeftColor', 'outlineColor', 'textDecorationColor',
        'fill', 'stroke', 'boxShadow', 'textShadow'
      ];
      
      // Safe fallback colors
      const fallbacks = {
        'color': COLORS.gray[800],
        'backgroundColor': COLORS.white,
        'borderColor': COLORS.gray[200],
        'borderTopColor': COLORS.gray[200],
        'borderRightColor': COLORS.gray[200],
        'borderBottomColor': COLORS.gray[200],
        'borderLeftColor': COLORS.gray[200],
        'outlineColor': COLORS.gray[400],
        'textDecorationColor': COLORS.gray[800],
        'fill': COLORS.gray[800],
        'stroke': COLORS.gray[800],
        'boxShadow': 'none',
        'textShadow': 'none'
      };
      
      // Helper function to check if a value contains a problematic format
      const hasProblematicFormat = (value) => {
        if (!value || typeof value !== 'string') return false;
        return problematicFormats.some(format => value.includes(format));
      };
      
      // Apply hardcoded styles for typical Tailwind classes
      const tailwindColorClasses = {
        'text-blue-600': { prop: 'color', value: COLORS.blue },
        'bg-blue-600': { prop: 'backgroundColor', value: COLORS.blue },
        'border-blue-600': { prop: 'borderColor', value: COLORS.blue },
        'text-white': { prop: 'color', value: COLORS.white },
        'bg-white': { prop: 'backgroundColor', value: COLORS.white },
        'text-black': { prop: 'color', value: COLORS.black },
        'bg-black': { prop: 'backgroundColor', value: COLORS.black },
        'text-gray-800': { prop: 'color', value: COLORS.gray[800] },
        'text-gray-700': { prop: 'color', value: COLORS.gray[700] },
        'text-gray-600': { prop: 'color', value: COLORS.gray[600] },
        'text-gray-500': { prop: 'color', value: COLORS.gray[500] },
        'text-gray-400': { prop: 'color', value: COLORS.gray[400] },
        'bg-gray-100': { prop: 'backgroundColor', value: COLORS.gray[100] },
        'bg-gray-50': { prop: 'backgroundColor', value: COLORS.gray[50] }
      };
      
      // Apply tailwind class-based styles
      if (el.classList) {
        for (const className of el.classList) {
          if (tailwindColorClasses[className]) {
            const { prop, value } = tailwindColorClasses[className];
            el.style[prop] = value;
          }
        }
      }
      
      // Direct style fixes for problematic colors
      colorProperties.forEach(prop => {
        try {
          const value = computedStyle[prop];
          
          // Skip empty values
          if (!value || value === 'none' || value === 'transparent') return;
          
          // Fix problematic color formats
          if (hasProblematicFormat(value) || hasProblematicFormat(el.style[prop])) {
            el.style[prop] = fallbacks[prop] || 'inherit';
          }
        } catch (error) {
          // Fallback on error
          el.style[prop] = fallbacks[prop] || 'inherit';
        }
      });
      
      // Fix specific issues with gradients
      if (computedStyle.background && (
        computedStyle.background.includes('gradient') || 
        hasProblematicFormat(computedStyle.background)
      )) {
        if (el.classList.contains('bg-blue-600')) {
          el.style.background = COLORS.blue;
        } else if (el.classList.contains('bg-black/40') || el.classList.contains('bg-black/60')) {
          el.style.background = COLORS.transparentBlack;
        } else if (el.classList.contains('bg-white/90')) {
          el.style.background = COLORS.transparentWhite;
        } else {
          el.style.background = COLORS.white;
        }
      }
      
      // Process child elements recursively
      Array.from(el.children).forEach(child => processElement(child));
    };
    
    // Start processing from the root element
    processElement(element);
    
    return element;
  };

  const downloadTicketAsPDF = async (reference) => {
    setDownloading(reference);
    try {
      const ticket = tickets.find(t => t.reference === reference);
      if (!ticket) throw new Error("Ticket not found");
      
      // Create PDF document - A4 size
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // PDF dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 15; // 15mm margins
      const contentWidth = pdfWidth - (margin * 2);
      
      // Set up styles
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
      
      // Header with logo
      pdf.setFontSize(20);
      pdf.setTextColor(38, 99, 235); // blue-600
      pdf.text('EventHub', margin, margin + 10);
      
      pdf.setFontSize(10);
      pdf.setTextColor(107, 114, 128); // gray-500
      pdf.text('OFFICIAL TICKET', margin, margin + 15);
      
      // Event title
      pdf.setFontSize(18);
      pdf.setTextColor(31, 41, 55); // gray-800
      pdf.text(ticket.event_title, margin, margin + 30);
      
      // Line separator
      pdf.setDrawColor(229, 231, 235); // gray-200
      pdf.line(margin, margin + 35, margin + contentWidth, margin + 35);
      
      // Event details
      const startY = margin + 45;
      const lineHeight = 7;
      
      // Format date
      const eventDate = new Date(ticket.event_date).toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      pdf.setFontSize(10);
      pdf.setTextColor(107, 114, 128); // gray-500
      pdf.text('DATE & TIME', margin, startY);
      
      pdf.setFontSize(12);
      pdf.setTextColor(31, 41, 55); // gray-800
      pdf.text(eventDate, margin, startY + 5);
      
      pdf.setFontSize(10);
      pdf.setTextColor(107, 114, 128); // gray-500
      pdf.text('LOCATION', margin, startY + (lineHeight * 2));
      
      pdf.setFontSize(12);
      pdf.setTextColor(31, 41, 55); // gray-800
      pdf.text(ticket.event_location, margin, startY + (lineHeight * 2) + 5);
      
      pdf.setFontSize(10);
      pdf.setTextColor(107, 114, 128); // gray-500
      pdf.text('TICKETS', margin, startY + (lineHeight * 4));
      
      pdf.setFontSize(12);
      pdf.setTextColor(31, 41, 55); // gray-800
      pdf.text(`${ticket.quantity} ${ticket.quantity > 1 ? 'tickets' : 'ticket'}`, margin, startY + (lineHeight * 4) + 5);
      
      // Right column
      const rightColX = margin + 100;
      
      pdf.setFontSize(10);
      pdf.setTextColor(107, 114, 128); // gray-500
      pdf.text('REFERENCE', rightColX, startY);
      
      pdf.setFontSize(12);
      pdf.setTextColor(31, 41, 55); // gray-800
      pdf.text(ticket.reference, rightColX, startY + 5);
      
      pdf.setFontSize(10);
      pdf.setTextColor(107, 114, 128); // gray-500
      pdf.text('AMOUNT', rightColX, startY + (lineHeight * 2));
      
      pdf.setFontSize(12);
      pdf.setTextColor(31, 41, 55); // gray-800
      pdf.text(`₦${ticket.amount_paid || (ticket.quantity * 2000)}`, rightColX, startY + (lineHeight * 2) + 5);
      
      // Add QR code if available
      if (ticket.qr_code_url) {
        try {
          // Create a temporary image element to load the QR code
          const img = new Image();
          img.crossOrigin = "Anonymous";  // Handle CORS issues
          
          // Wait for the image to load
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = ticket.qr_code_url;
          });
          
          // Add the QR code to the PDF
          const qrSize = 40; // mm
          const qrX = pdfWidth - margin - qrSize;
          const qrY = startY + (lineHeight * 4);
          
          pdf.addImage(img, 'PNG', qrX, qrY, qrSize, qrSize);
        } catch (qrError) {
          console.error("Failed to add QR code:", qrError);
          // Continue without QR code
        }
      }
      
      // Draw a decorative ticket stub line
      pdf.setDrawColor(229, 231, 235); // gray-200
      pdf.setLineDashPattern([2, 2], 0);
      pdf.line(margin, startY + (lineHeight * 6) + 10, margin + contentWidth, startY + (lineHeight * 6) + 10);
      pdf.setLineDashPattern([], 0);
      
      // Footer
      const footerY = pdfHeight - margin - 10;
      pdf.setFontSize(8);
      pdf.setTextColor(156, 163, 175); // gray-400
      pdf.text(`Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, margin, footerY);
      pdf.text('EventHub - Your trusted ticketing platform', pdfWidth - margin - 60, footerY, { align: 'right' });
      
      // Save the PDF
      const safeEventName = ticket.event_title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
      pdf.save(`EventHub-Ticket-${safeEventName}-${ticket.reference}.pdf`);
      
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download ticket as PDF. Please try again.');
    } finally {
      setDownloading(null);
    }
  };

  
  // Component for loading state
  const LoadingState = ({ message }) => (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <BrandLogo />
      <div className="mt-8 flex flex-col items-center">
        <Loader className="h-10 w-10 text-blue-600 animate-spin mb-4" style={{ color: COLORS.blue }} />
        <p className="text-lg font-medium text-gray-700">{message}</p>
      </div>
    </div>
  );

  // Brand logo component
  const BrandLogo = () => (
    <Link href="/" className="flex items-center space-x-2 group">
      <div className="bg-blue-600 p-2 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300" style={{ backgroundColor: COLORS.blue }}>
        <TicketIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
      </div>
      <span className="text-xl sm:text-2xl font-bold text-blue-600" style={{ color: COLORS.blue }}>
        EventHub
      </span>
    </Link>
  );

  // Empty tickets state component
  const EmptyTicketsState = () => (
    <div className="bg-white rounded-xl shadow-md p-8 text-center max-w-md mx-auto">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="h-8 w-8 text-gray-400" />
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">No Tickets Found</h2>
      <p className="text-gray-600 mb-6">You haven't booked any tickets yet.</p>
      <Link 
        href="/events" 
        className="inline-flex items-center justify-center px-5 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition" 
        style={{ backgroundColor: COLORS.blue }}
      >
        Browse Events
      </Link>
    </div>
  );

  // Ticket component
  const TicketCard = ({ ticket }) => (
    <div 
      ref={el => ticketRefs.current[ticket.reference] = el}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition"
    >
      {/* Event Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={ticket.event_flyer || '/placeholder.jpg'}
          alt={ticket.event_title}
          onError={(e) => { e.target.src = '/placeholder.jpg' }}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" style={{ backgroundColor: COLORS.transparentBlack }}></div>
        
        {/* Brand logo overlay */}
        <div className="absolute top-4 left-4 flex items-center">
          <div className="bg-white/90 p-1.5 rounded-lg shadow-sm" style={{ backgroundColor: COLORS.transparentWhite }}>
            <TicketIcon className="h-4 w-4 text-blue-600" style={{ color: COLORS.blue }} />
          </div>
          <span className="ml-2 text-sm font-bold text-white" style={{ color: COLORS.white }}>EventHub</span>
        </div>
      </div>

      {/* Ticket Content */}
      <div className="p-5">
        <h2 className="text-xl font-bold text-gray-800 line-clamp-1">{ticket.event_title}</h2>
        
        {/* Event Details */}
        <div className="mt-4 space-y-3">
          <EventDetailRow 
            icon={<Calendar className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" style={{ color: COLORS.blue }} />}
            label="DATE & TIME"
            value={new Date(ticket.event_date).toLocaleString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          />
          
          <EventDetailRow 
            icon={<MapPin className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" style={{ color: COLORS.blue }} />}
            label="LOCATION"
            value={ticket.event_location}
            className="line-clamp-1"
          />
          
          <EventDetailRow 
            icon={<Users className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" style={{ color: COLORS.blue }} />}
            label="TICKETS"
            value={`${ticket.quantity} ${ticket.quantity > 1 ? 'tickets' : 'ticket'}`}
          />
        </div>

        <div className="mt-5 border-t border-dashed border-gray-200 pt-5">
          {/* QR Code */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">REFERENCE</p>
              <p className="text-sm font-mono text-gray-800">{ticket.reference}</p>
              <p className="text-xs font-medium text-gray-500 mt-2 mb-1">AMOUNT</p>
              <p className="text-sm font-bold text-gray-800">₦{ticket.amount_paid || (ticket.quantity * 2000)}</p>
            </div>
            <div className="bg-white p-1 border border-gray-100 rounded-md shadow-sm">
              <img
                src={ticket.qr_code_url || '/qr-placeholder.png'}
                alt="QR Code"
                className="w-20 h-20 object-contain"
                onError={(e) => { e.target.src = '/qr-placeholder.png' }}
              />
            </div>
          </div>
        </div>

        {/* Download Button */}
        <button
          onClick={() => downloadTicketAsPDF(ticket.reference)}
          disabled={downloading === ticket.reference}
          className="download-btn mt-5 w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:shadow-md transition flex items-center justify-center"
          style={{ backgroundColor: COLORS.blue, color: COLORS.white }}
        >
          {downloading === ticket.reference ? (
            <>
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <FileText className="h-4 w-4 mr-2" />
              Download PDF Ticket
            </>
          )}
        </button>
      </div>
    </div>
  );

  // Event detail row component
  const EventDetailRow = ({ icon, label, value, className = '' }) => (
    <div className="flex items-start">
      {icon}
      <div>
        <p className="text-xs font-medium text-gray-500 mb-0.5">{label}</p>
        <p className={`text-sm text-gray-800 ${className}`}>{value}</p>
      </div>
    </div>
  );

  if (checking) {
    return <LoadingState message="Verifying your account..." />;
  }

  if (loading) {
    return <LoadingState message="Loading your tickets..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div className="mb-4 md:mb-0">
            <BrandLogo />
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => router.push('/events')}
              className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition shadow-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </button>
          </div>
        </div>

        {/* Page Title */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">My Tickets</h1>
          <p className="text-gray-600">Manage and download your event tickets</p>
        </div>

        {/* Tickets List */}
        {tickets.length === 0 ? (
          <EmptyTicketsState />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tickets.map((ticket) => (
                <TicketCard key={ticket.reference} ticket={ticket} />
              ))}
            </div>
            
            {/* Footer */}
            <div className="mt-12 text-center text-gray-600 text-sm">
              <p>Need help with your tickets? <Link href="/contact" className="text-blue-600 hover:underline" style={{ color: COLORS.blue }}>Contact our support team</Link></p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}