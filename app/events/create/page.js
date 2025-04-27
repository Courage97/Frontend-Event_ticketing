'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/utils/axios';
import {Ticket} from 'lucide-react'

export default function CreateEventPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [errors, setErrors] = useState({});
  const [priceTiers, setPriceTiers] = useState([
    { name: 'Regular', price: '', capacity: '' }
  ]);

  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    start_date: '',
    end_date: '',
    ticket_price: '',
    capacity: '',
    flyer: null,
  });

  // 🔒 Redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) {
      localStorage.setItem('post_login_redirect', '/events/create');
      router.push('/login');
    }
  }, [router]);

  const validateField = (name, value) => {
    let errorMessage = '';
    
    if (!value && name !== 'flyer') {
      errorMessage = 'This field is required';
    } else {
      switch (name) {
        case 'title':
          if (value.length < 5) errorMessage = 'Title must be at least 5 characters';
          break;
        case 'description':
          if (value.length < 20) errorMessage = 'Description must be at least 20 characters';
          break;
        case 'start_date':
        case 'end_date':
          const dateValue = new Date(value);
          if (isNaN(dateValue.getTime())) errorMessage = 'Please enter a valid date';
          if (name === 'end_date' && form.start_date && new Date(value) <= new Date(form.start_date)) {
            errorMessage = 'End date must be after start date';
          }
          break;
        case 'ticket_price':
          if (isNaN(value) || Number(value) <= 0) errorMessage = 'Please enter a valid price';
          break;
        case 'capacity':
          if (isNaN(value) || !Number.isInteger(Number(value)) || Number(value) <= 0) {
            errorMessage = 'Please enter a valid capacity';
          }
          break;
      }
    }
    
    return errorMessage;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'flyer') {
      setForm((prev) => ({ ...prev, flyer: files[0] }));
      
      // Validate image
      if (files && files[0]) {
        const fileType = files[0].type.split('/')[0];
        if (fileType !== 'image') {
          setErrors(prev => ({ ...prev, flyer: 'Please upload an image file' }));
        } else {
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.flyer;
            return newErrors;
          });
        }
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
      
      // Validate the field
      const errorMessage = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: errorMessage || undefined
      }));
    }
  };

  const handlePriceTierChange = (index, field, value) => {
    const newTiers = [...priceTiers];
    newTiers[index][field] = value;
    setPriceTiers(newTiers);
  };

  const addPriceTier = () => {
    setPriceTiers([...priceTiers, { name: '', price: '', capacity: '' }]);
  };

  const removePriceTier = (index) => {
    const newTiers = [...priceTiers];
    newTiers.splice(index, 1);
    setPriceTiers(newTiers);
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(form).forEach(key => {
      if (key !== 'flyer') {
        const errorMessage = validateField(key, form[key]);
        if (errorMessage) newErrors[key] = errorMessage;
      }
    });
    
    if (!form.flyer) {
      newErrors.flyer = 'Please upload an event flyer';
    }
    
    // Validate price tiers
    if (priceTiers.length > 0) {
      priceTiers.forEach((tier, index) => {
        if (!tier.name) newErrors[`tier_${index}_name`] = 'Tier name is required';
        if (!tier.price || isNaN(tier.price) || Number(tier.price) <= 0) {
          newErrors[`tier_${index}_price`] = 'Please enter a valid price';
        }
        if (!tier.capacity || isNaN(tier.capacity) || !Number.isInteger(Number(tier.capacity)) || Number(tier.capacity) <= 0) {
          newErrors[`tier_${index}_capacity`] = 'Please enter a valid capacity';
        }
      });
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setFormStatus({
        type: 'error',
        message: 'Please fix the errors in the form before submitting'
      });
      return;
    }
    
    setIsSubmitting(true);
    setFormStatus({ type: 'loading', message: 'Creating your event...' });

    try {
      const token = localStorage.getItem('access');
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });
      
      // Add price tiers to form data
      formData.append('price_tiers', JSON.stringify(priceTiers));

      // 👉 Step 1: Create the event
      const res = await axios.post('/events/create/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const eventId = res.data.id;
      console.log('✅ Event Created:', res.data);
      console.log('📦 Submitting with Event ID:', eventId);

      if (!eventId) {
        setFormStatus({
          type: 'error',
          message: 'Event created but no ID returned!'
        });
        setIsSubmitting(false);
        return;
      }

      setFormStatus({
        type: 'success',
        message: 'Event created! Initializing payment...'
      });

      // 👉 Step 2: Initiate payment
      const payment = await axios.post(
        '/events/initiate-payment/',
        { event_id: eventId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log('✅ Payment URL:', payment.data);
      router.push(payment.data.payment_url);
    } catch (err) {
      console.error('❌ Error:', err);
      setIsSubmitting(false);
      
      if (err.response) {
        setFormStatus({
          type: 'error',
          message: err.response.data?.message || 'Failed to create event. Please try again.'
        });
      } else {
        setFormStatus({
          type: 'error',
          message: 'Failed to create event or initiate payment.'
        });
      }
    }
  };

  // Helper function to format date for preview
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-neutral-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-heading font-bold text-neutral-900 mb-6 text-center">Create New Event</h1>
        
        {formStatus.type && (
          <div className={`mb-6 p-4 rounded-lg ${
            formStatus.type === 'error' ? 'bg-error-50 text-error-600 border border-error-500' : 
            formStatus.type === 'success' ? 'bg-success-50 text-success-600 border border-success-500' : 
            'bg-neutral-50 text-neutral-600 border border-neutral-300'
          }`}>
            <div className="flex items-center">
              {formStatus.type === 'loading' && (
                <div className="mr-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
                </div>
              )}
              <p>{formStatus.message}</p>
            </div>
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Section */}
          <div className="w-full lg:w-2/3 bg-white rounded-xl shadow-soft-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info Section */}
              <div>
                <h3 className="text-xl font-bold text-neutral-800 mb-4">Event Information</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Event Title</label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Give your event a catchy title"
                    className={`w-full px-4 py-3 rounded-lg border ${errors.title ? 'border-error-500 bg-error-50' : 'border-neutral-300'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  />
                  {errors.title && <p className="mt-1 text-sm text-error-600">{errors.title}</p>}
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Tell people what your event is about"
                    rows="4"
                    className={`w-full px-4 py-3 rounded-lg border ${errors.description ? 'border-error-500 bg-error-50' : 'border-neutral-300'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  />
                  {errors.description && <p className="mt-1 text-sm text-error-600">{errors.description}</p>}
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Location</label>
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Where will your event be held?"
                    className={`w-full px-4 py-3 rounded-lg border ${errors.location ? 'border-error-500 bg-error-50' : 'border-neutral-300'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  />
                  {errors.location && <p className="mt-1 text-sm text-error-600">{errors.location}</p>}
                </div>
              </div>
              
              {/* Date & Time Section */}
              <div className="border-t border-neutral-200 pt-6">
                <h3 className="text-xl font-bold text-neutral-800 mb-4">Date & Time</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Start Date & Time</label>
                    <input
                      type="datetime-local"
                      name="start_date"
                      value={form.start_date}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.start_date ? 'border-error-500 bg-error-50' : 'border-neutral-300'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    />
                    {errors.start_date && <p className="mt-1 text-sm text-error-600">{errors.start_date}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">End Date & Time</label>
                    <input
                      type="datetime-local"
                      name="end_date"
                      value={form.end_date}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${errors.end_date ? 'border-error-500 bg-error-50' : 'border-neutral-300'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    />
                    {errors.end_date && <p className="mt-1 text-sm text-error-600">{errors.end_date}</p>}
                  </div>
                </div>
              </div>
              
              {/* Ticket Pricing Section */}
              <div className="border-t border-neutral-200 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-neutral-800">Ticket Pricing</h3>
                  <button 
                    type="button" 
                    onClick={addPriceTier}
                    className="text-sm px-3 py-1 bg-primary-50 text-primary-600 rounded-md hover:bg-primary-100 transition"
                  >
                    + Add Tier
                  </button>
                </div>
                
                {/* Legacy fields still maintained for backward compatibility */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Default Ticket Price (₦)</label>
                    <input
                      name="ticket_price"
                      type="number"
                      value={form.ticket_price}
                      onChange={handleChange}
                      placeholder="0.00"
                      className={`w-full px-4 py-3 rounded-lg border ${errors.ticket_price ? 'border-error-500 bg-error-50' : 'border-neutral-300'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    />
                    {errors.ticket_price && <p className="mt-1 text-sm text-error-600">{errors.ticket_price}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Total Capacity</label>
                    <input
                      name="capacity"
                      type="number"
                      value={form.capacity}
                      onChange={handleChange}
                      placeholder="How many people can attend?"
                      className={`w-full px-4 py-3 rounded-lg border ${errors.capacity ? 'border-error-500 bg-error-50' : 'border-neutral-300'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    />
                    {errors.capacity && <p className="mt-1 text-sm text-error-600">{errors.capacity}</p>}
                  </div>
                </div>
                
                {/* Price Tiers */}
                {priceTiers.map((tier, index) => (
                  <div 
                    key={index} 
                    className="mb-6 p-4 border border-neutral-200 rounded-lg bg-neutral-50"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-neutral-800">Price Tier {index + 1}</h4>
                      {priceTiers.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removePriceTier(index)}
                          className="text-sm text-error-600 hover:text-error-500"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
                        <input
                          value={tier.name}
                          onChange={(e) => handlePriceTierChange(index, 'name', e.target.value)}
                          placeholder="e.g. VIP, Regular, Early Bird"
                          className={`w-full px-4 py-2 rounded-lg border ${errors[`tier_${index}_name`] ? 'border-error-500 bg-error-50' : 'border-neutral-300'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                        />
                        {errors[`tier_${index}_name`] && (
                          <p className="mt-1 text-sm text-error-600">{errors[`tier_${index}_name`]}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Price (₦)</label>
                        <input
                          type="number"
                          value={tier.price}
                          onChange={(e) => handlePriceTierChange(index, 'price', e.target.value)}
                          placeholder="0.00"
                          className={`w-full px-4 py-2 rounded-lg border ${errors[`tier_${index}_price`] ? 'border-error-500 bg-error-50' : 'border-neutral-300'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                        />
                        {errors[`tier_${index}_price`] && (
                          <p className="mt-1 text-sm text-error-600">{errors[`tier_${index}_price`]}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Capacity</label>
                        <input
                          type="number"
                          value={tier.capacity}
                          onChange={(e) => handlePriceTierChange(index, 'capacity', e.target.value)}
                          placeholder="Number of tickets"
                          className={`w-full px-4 py-2 rounded-lg border ${errors[`tier_${index}_capacity`] ? 'border-error-500 bg-error-50' : 'border-neutral-300'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                        />
                        {errors[`tier_${index}_capacity`] && (
                          <p className="mt-1 text-sm text-error-600">{errors[`tier_${index}_capacity`]}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Event Flyer Section */}
              <div className="border-t border-neutral-200 pt-6">
                <h3 className="text-xl font-bold text-neutral-800 mb-4">Event Flyer</h3>
                
                <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
                  <label className="block cursor-pointer">
                    <span className="block text-sm text-neutral-600 mb-2">
                      {form.flyer ? form.flyer.name : 'Upload your event flyer image'}
                    </span>
                    
                    {form.flyer ? (
                      <div className="flex justify-center">
                        <img 
                          src={URL.createObjectURL(form.flyer)} 
                          alt="Event flyer preview" 
                          className="h-40 object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-full py-8">
                        <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-primary-50 text-primary-500 mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-sm text-neutral-500">Click to upload or drag and drop</p>
                        <p className="text-xs text-neutral-400 mt-1">PNG, JPG, GIF up to 5MB</p>
                      </div>
                    )}
                    
                    <input
                      type="file"
                      name="flyer"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                    />
                  </label>
                  
                  {errors.flyer && (
                    <p className="mt-3 text-sm text-error-600">{errors.flyer}</p>
                  )}
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="border-t border-neutral-200 pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full px-6 py-4 rounded-lg text-lg font-semibold text-white 
                  ${isSubmitting 
                    ? 'bg-neutral-400 cursor-not-allowed' 
                    : 'bg-primary-gradient hover:opacity-90 transition duration-300'
                  }`}
                >
                  {isSubmitting ? 'Creating Event...' : 'Create & Publish Event'}
                </button>
              </div>
            </form>
          </div>
          
          {/* Preview Section */}
          <div className="w-full lg:w-1/3 sticky top-8 self-start">
            <div className="bg-white rounded-xl shadow-soft-lg overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 bg-neutral-200">
                {form.flyer ? (
                  <img 
                    src={URL.createObjectURL(form.flyer)} 
                    alt="Event flyer" 
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-neutral-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                  {form.title || 'Event Title'}
                </h3>
                
                <div className="flex items-center text-neutral-700 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{form.location || 'Event Location'}</span>
                </div>
                
                <div className="flex items-center text-neutral-700 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>
                    {formatDate(form.start_date) || 'Start Date & Time'} 
                    {form.end_date && ` - ${formatDate(form.end_date)}`}
                  </span>
                </div>
                
                <div className="border-t border-neutral-200 pt-4 mb-4">
                  <h4 className="text-sm font-medium text-neutral-600 mb-2">Description</h4>
                  <p className="text-neutral-700 line-clamp-3">
                    {form.description || 'Your event description will appear here...'}
                  </p>
                </div>
                
                <div className="border-t border-neutral-200 pt-4">
                  <h4 className="text-sm font-medium text-neutral-600 mb-3">Ticket Options</h4>
                  
                  {priceTiers.length > 0 ? (
                    <div className="space-y-3">
                      {priceTiers.map((tier, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                          <div>
                            <p className="font-medium text-neutral-800">{tier.name || `Tier ${index + 1}`}</p>
                            {tier.capacity && (
                              <p className="text-xs text-neutral-500">{tier.capacity} tickets available</p>
                            )}
                          </div>
                          <div className="text-lg font-bold text-accent-600">
                            ₦{tier.price || '0.00'}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg">
                      <div>
                        <p className="font-medium text-neutral-800">Regular Ticket</p>
                        {form.capacity && (
                          <p className="text-xs text-neutral-500">{form.capacity} tickets available</p>
                        )}
                      </div>
                      <div className="text-lg font-bold text-accent-600">
                        ₦{form.ticket_price || '0.00'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-neutral-50 p-4 rounded-lg border border-neutral-200">
              <h4 className="font-medium text-neutral-800 mb-2">Preview Notes</h4>
              <p className="text-sm text-neutral-600">
                This preview shows how your event will appear to attendees. Complete all fields above to see a more accurate preview.
              </p>
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="bg-primary-gradient p-1.5 rounded-md shadow-soft-sm">
                <Ticket className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">EventHub</span>
            </div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              © {new Date().getFullYear()} EventHub. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}