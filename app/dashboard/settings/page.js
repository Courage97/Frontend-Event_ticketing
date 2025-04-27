'use client';
import { useState, useEffect } from 'react';
import axios from '@/utils/axios';
import { Toaster, toast } from 'react-hot-toast';
import { Ticket, Info, CheckCircle, AlertCircle, Loader2, Building, CreditCard, Plus } from 'lucide-react';
import Link from 'next/link';

// Bank codes list - you would typically fetch this from an API
const BANK_CODES = [
  { code: '058', name: 'Guaranty Trust Bank' },
  { code: '011', name: 'First Bank of Nigeria' },
  { code: '057', name: 'Zenith Bank' },
  { code: '044', name: 'Access Bank' },
  { code: '050', name: 'Ecobank Nigeria' },
  { code: '100004', name: 'Paycom/ Opay' },
  { code: '100033', name: 'Palmpay' },
  { code: '090406', name: 'Moniepoint' },
  { code: '090267', name: 'Kuda' },
  
  

  // Add more banks as needed
];

export default function SetupSubaccount() {
  const [formData, setFormData] = useState({
    accountNumber: '',
    bankCode: '',
    customBankName: '',
    customBankCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState({
    accountNumberValid: null,
    bankCodeValid: null,
    customBankValid: null,
    submitAttempted: false
  });
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [showCustomBank, setShowCustomBank] = useState(false);

  useEffect(() => {
    // Simulate loading state for demonstration
    const timer = setTimeout(() => {
      setIsLoadingPage(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const validateAccountNumber = (value) => {
    return value.length === 10 && /^\d+$/.test(value);
  };

  const validateBankCode = (value) => {
    if (showCustomBank) {
      return formData.customBankName.trim() !== '' && 
             formData.customBankCode.trim() !== '' && 
             /^\d{3}$/.test(formData.customBankCode);
    }
    return value !== '';
  };

  const validateCustomBank = () => {
    return formData.customBankName.trim() !== '' && 
           formData.customBankCode.trim() !== '' && 
           /^\d{3}$/.test(formData.customBankCode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'accountNumber') {
      setFormState({
        ...formState,
        accountNumberValid: validateAccountNumber(value)
      });
    } else if (name === 'bankCode') {
      setFormState({
        ...formState,
        bankCodeValid: validateBankCode(value)
      });
    } else if (name === 'customBankName' || name === 'customBankCode') {
      setFormState({
        ...formState,
        customBankValid: validateCustomBank()
      });
    }
  };

  const toggleCustomBank = () => {
    setShowCustomBank(!showCustomBank);
    if (!showCustomBank) {
      setFormData({
        ...formData,
        bankCode: ''
      });
    } else {
      setFormData({
        ...formData,
        customBankName: '',
        customBankCode: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormState({ ...formState, submitAttempted: true });

    const accountNumberValid = validateAccountNumber(formData.accountNumber);
    const bankCodeValid = validateBankCode(formData.bankCode);

    if (!accountNumberValid || !bankCodeValid) {
      toast.error('Please check the form for errors.');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('access');
      
      // Determine which bank code to send
      const bankCodeToSubmit = showCustomBank ? formData.customBankCode : formData.bankCode;
      
      await axios.post(
        '/auth/organizer/setup-subaccount/',
        {
          account_number: formData.accountNumber,
          bank_code: bankCodeToSubmit,
          business_name: showCustomBank ? formData.customBankName : BANK_CODES.find(b => b.code === formData.bankCode)?.name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      toast.success('Bank account successfully connected!');
      setTimeout(() => router.push('/dashboard'), 1000);

      setFormData({ accountNumber: '', bankCode: '', customBankName: '', customBankCode: '' });
      setFormState({
        accountNumberValid: null,
        bankCodeValid: null,
        customBankValid: null,
        submitAttempted: false
      });
      setShowCustomBank(false);
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.error || 'Failed to create subaccount.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingPage) {
    return (
      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-soft-lg p-6 space-y-6 animate-pulse">
          {/* Skeleton for header */}
          <div className="space-y-3">
            <div className="h-7 bg-neutral-200 dark:bg-neutral-700 rounded-lg w-3/4"></div>
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded-md w-full"></div>
          </div>
          
          {/* Skeleton for form fields */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3"></div>
              <div className="h-12 bg-neutral-200 dark:bg-neutral-700 rounded-lg w-full"></div>
            </div>
            <div className="space-y-2">
              <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-1/4"></div>
              <div className="h-12 bg-neutral-200 dark:bg-neutral-700 rounded-lg w-full"></div>
            </div>
            <div className="h-12 bg-neutral-200 dark:bg-neutral-700 rounded-lg w-full mt-6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <Toaster />
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-soft-lg p-6 md:p-8">
        {/* Header with brand logo */}
        <div className="flex items-start mb-8">
          <div className="flex-1">
            <Link href="/" className="flex items-center space-x-2 group mb-6">
              <div className="bg-primary-gradient p-2 rounded-lg shadow-soft-sm group-hover:shadow-soft-md transition-all duration-300">
                <Ticket className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-neutral-900 dark:text-white">EventHub</h1>
            </Link>
            <h2 className="text-2xl font-bold font-heading text-neutral-900 dark:text-white">Connect Payment Account</h2>
            <p className="text-neutral-500 dark:text-neutral-400 mt-2">
              Link your bank account to receive payouts from ticket sales automatically
            </p>
          </div>
        </div>

        {/* Form with visual sections */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Account Number Field */}
          <div className="space-y-2">
            <div className="relative">
              <label 
                htmlFor="accountNumber" 
                className={`block text-sm font-medium ${
                  formState.submitAttempted && formState.accountNumberValid === false 
                    ? 'text-error-600' 
                    : 'text-neutral-700 dark:text-neutral-300'
                }`}
              >
                <div className="flex items-center gap-1">
                  <CreditCard className="h-4 w-4" />
                  <span>Bank Account Number</span>
                </div>
              </label>
              <input
                id="accountNumber"
                name="accountNumber"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={formData.accountNumber}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-4 py-3 rounded-lg border ${
                  formState.submitAttempted && formState.accountNumberValid === false
                    ? 'border-error-500 bg-error-50 dark:bg-error-500/10'
                    : formState.accountNumberValid
                    ? 'border-success-500 bg-success-50 dark:bg-success-500/10'
                    : 'border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700'
                } focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-base md:text-lg`}
                placeholder="Enter your 10-digit account number"
                required
              />
              {formState.submitAttempted && formState.accountNumberValid === false && (
                <p className="mt-1 text-sm text-error-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  Account number must be 10 digits
                </p>
              )}
              {formState.accountNumberValid && (
                <p className="mt-1 text-sm text-success-600 flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  Valid account number format
                </p>
              )}
            </div>
          </div>

          {/* Bank Selection Section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                <div className="flex items-center gap-1">
                  <Building className="h-4 w-4" />
                  <span>{showCustomBank ? "Enter Bank Details" : "Select Bank"}</span>
                </div>
              </label>
              <button
                type="button"
                onClick={toggleCustomBank}
                className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center gap-1 transition-colors"
              >
                {showCustomBank ? (
                  <>Choose from list</>
                ) : (
                  <>
                    <Plus className="h-3 w-3" />
                    <span>My bank isn't listed</span>
                  </>
                )}
              </button>
            </div>

            {!showCustomBank ? (
              <div className="relative">
                <select
                  id="bankCode"
                  name="bankCode"
                  value={formData.bankCode}
                  onChange={handleInputChange}
                  className={`block w-full px-4 py-3 rounded-lg border ${
                    formState.submitAttempted && !formData.bankCode
                      ? 'border-error-500 bg-error-50 dark:bg-error-500/10'
                      : formData.bankCode
                      ? 'border-success-500 bg-success-50 dark:bg-success-500/10'
                      : 'border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700'
                  } focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-base md:text-lg`}
                  required={!showCustomBank}
                  disabled={showCustomBank}
                >
                  <option value="">Select your bank</option>
                  {BANK_CODES.map(bank => (
                    <option key={bank.code} value={bank.code}>
                      {bank.name} ({bank.code})
                    </option>
                  ))}
                </select>
                {formState.submitAttempted && !formData.bankCode && !showCustomBank && (
                  <p className="mt-1 text-sm text-error-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    Please select your bank
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Custom Bank Name Field */}
                <div className="relative">
                  <label 
                    htmlFor="customBankName" 
                    className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    Bank Name
                  </label>
                  <input
                    id="customBankName"
                    name="customBankName"
                    type="text"
                    value={formData.customBankName}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-4 py-3 rounded-lg border ${
                      formState.submitAttempted && showCustomBank && !formData.customBankName
                        ? 'border-error-500 bg-error-50 dark:bg-error-500/10'
                        : formData.customBankName
                        ? 'border-success-500 bg-success-50 dark:bg-success-500/10'
                        : 'border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700'
                    } focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-base md:text-lg`}
                    placeholder="Enter bank name"
                    required={showCustomBank}
                  />
                  {formState.submitAttempted && showCustomBank && !formData.customBankName && (
                    <p className="mt-1 text-sm text-error-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      Bank name is required
                    </p>
                  )}
                </div>

                {/* Custom Bank Code Field */}
                <div className="relative">
                  <label 
                    htmlFor="customBankCode" 
                    className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    Bank Code
                  </label>
                  <input
                    id="customBankCode"
                    name="customBankCode"
                    type="text"
                    inputMode="numeric"
                    value={formData.customBankCode}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-4 py-3 rounded-lg border ${
                      formState.submitAttempted && showCustomBank && (!formData.customBankCode || !/^\d{3}$/.test(formData.customBankCode))
                        ? 'border-error-500 bg-error-50 dark:bg-error-500/10'
                        : /^\d{3}$/.test(formData.customBankCode)
                        ? 'border-success-500 bg-success-50 dark:bg-success-500/10'
                        : 'border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700'
                    } focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-base md:text-lg`}
                    placeholder="Enter 3-digit bank code"
                    required={showCustomBank}
                    maxLength={3}
                  />
                  {formState.submitAttempted && showCustomBank && (!formData.customBankCode || !/^\d{3}$/.test(formData.customBankCode)) && (
                    <p className="mt-1 text-sm text-error-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      Bank code must be 3 digits
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4 flex gap-3">
            <div className="mt-0.5">
              <Info className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-sm text-primary-800 dark:text-primary-300">
                We use Paystack to process payouts securely. Your bank account information is encrypted and never stored on our servers.
              </p>
            </div>
          </div>

          {/* Submit Button with animated states */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 ${
              loading
                ? 'bg-primary-400 cursor-not-allowed'
                : 'bg-primary-gradient hover:shadow-soft-md active:bg-primary-700'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                <span>Connecting Account...</span>
              </>
            ) : (
              'Connect Bank Account'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}