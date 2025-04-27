'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from '@/utils/axios';
import toast from 'react-hot-toast';
import { Ticket, ChevronRight, Calendar, Upload, ArrowLeft } from 'lucide-react';

export default function CreateVendorServicePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    business_name: '',
    service_name: '',
    description: '',
    image: null,
    imagePreview: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ 
          ...prev, 
          image: file,
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('business_name', form.business_name);
    data.append('service_name', form.service_name);
    data.append('description', form.description);
    if (form.image) data.append('image', form.image);

    try {
      await axios.post('/vendors/services/create/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Service created successfully!');
      router.push('/vendors/dashboard');
    } catch (err) {
      toast.error('Failed to create service.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Header with navigation and branding */}
      <header className="bg-white dark:bg-neutral-800 shadow-soft-sm border-b border-neutral-200 dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="bg-primary-gradient p-2 rounded-lg shadow-soft-sm group-hover:shadow-soft-md transition-all duration-300">
                <Ticket className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-neutral-900 dark:text-white">EventHub</h1>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <button 
            onClick={() => router.back()} 
            className="flex items-center text-neutral-600 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400 mb-4 group transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1 group-hover:translate-x-[-2px] transition-transform" />
            <span>Back</span>
          </button>
          
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-neutral-900 dark:text-white">Add New Vendor Service</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">Create a new service offering for your business</p>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-soft-md border border-neutral-200 dark:border-neutral-700 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1" htmlFor="business_name">
                  Business Name
                </label>
                <input
                  id="business_name"
                  type="text"
                  name="business_name"
                  value={form.business_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-700 dark:text-white"
                  placeholder="Your business name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1" htmlFor="service_name">
                  Service Name
                </label>
                <input
                  id="service_name"
                  type="text"
                  name="service_name"
                  value={form.service_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-700 dark:text-white"
                  placeholder="What service are you offering?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                  required
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-700 dark:text-white"
                  placeholder="Describe your service in detail"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Service Image
                </label>
                
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 dark:border-neutral-600 border-dashed rounded-lg hover:border-primary-500 dark:hover:border-primary-500 transition-colors cursor-pointer">
                  <div className="space-y-2 text-center">
                    {form.imagePreview ? (
                      <div className="flex flex-col items-center">
                        <img 
                          src={form.imagePreview} 
                          alt="Preview" 
                          className="h-32 w-auto object-cover rounded-lg mb-2"
                        />
                        <button
                          type="button"
                          onClick={() => setForm(prev => ({ ...prev, image: null, imagePreview: null }))}
                          className="text-sm text-error-600 hover:text-error-800 dark:text-error-400 dark:hover:text-error-300"
                        >
                          Remove image
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-center">
                          <Upload className="h-12 w-12 text-neutral-400" />
                        </div>
                        <div className="flex text-sm text-neutral-600 dark:text-neutral-400">
                          <label
                            htmlFor="image-upload"
                            className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 focus-within:outline-none"
                          >
                            <span>Upload a file</span>
                            <input
                              id="image-upload"
                              name="image"
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="sr-only"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 bg-primary-gradient text-white rounded-lg shadow-soft-md hover:opacity-90 transition-all flex items-center justify-center ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Service'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

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