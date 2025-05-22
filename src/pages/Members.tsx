import React, { useState } from 'react';
import { validateMembershipForm } from '../lib/validation';

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  organization: string;
  position: string;
  membership_type: string;
  is_new_member: string;
  hear_about_us: string | null;
  interests: string[];
  agree_to_terms: boolean;
}

interface ValidationError {
  field: string;
  message: string;
}

export default function Members() {
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: null,
    organization: '',
    position: '',
    membership_type: '',
    is_new_member: '',
    hear_about_us: null,
    interests: [],
    agree_to_terms: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors([]);

    const validationErrors = validateMembershipForm(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      
      const firstErrorField = document.querySelector(`[name="${validationErrors[0].field}"]`);
      firstErrorField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl) {
        throw new Error('VITE_SUPABASE_URL is not defined');
      }

      const response = await fetch(
        `${supabaseUrl}/functions/v1/submit-membership`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit application');
      }

      setSubmitSuccess(true);
      
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: null,
        organization: '',
        position: '',
        membership_type: '',
        is_new_member: '',
        hear_about_us: null,
        interests: [],
        agree_to_terms: false
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      console.error('Error submitting application:', error);
      setErrors([{ 
        field: 'submit', 
        message: error.message || 'Failed to submit application. Please try again.' 
      }]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Membership Application
        </h1>
        
        {submitSuccess && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-green-700 text-center">
              Your membership application has been submitted successfully!
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form fields would go here */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>

        {errors.length > 0 && (
          <div className="mt-4">
            {errors.map((error, index) => (
              <p key={index} className="text-red-600">
                {error.message}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export { Members }