import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Phone, MapPin, DollarSign, Building, User, Users } from 'lucide-react';

interface Attendee {
  firstName: string;
  lastName: string;
  email: string;
}

const TechConferenceRegistration: React.FC = () => {
  const [formData, setFormData] = useState({
    schoolDistrict: '',
    firstName: '',
    lastName: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    email: '',
    phone: '',
    totalAttendees: 1,
    additionalAttendees: [] as Attendee[]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<{
    success?: boolean;
    message?: string;
  }>({});

  const registrationFee = 250.00; // Fee per attendee
  const totalAmount = formData.totalAttendees * registrationFee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'totalAttendees') {
      const attendees = Math.max(1, parseInt(value) || 1);
      const currentAttendees = formData.additionalAttendees;
      
      if (attendees > 1) {
        const diff = attendees - 1 - currentAttendees.length;
        if (diff > 0) {
          const newAttendees = [...currentAttendees];
          for (let i = 0; i < diff; i++) {
            newAttendees.push({ firstName: '', lastName: '', email: '' });
          }
          setFormData(prev => ({
            ...prev,
            [name]: attendees,
            additionalAttendees: newAttendees
          }));
        } else if (diff < 0) {
          setFormData(prev => ({
            ...prev,
            [name]: attendees,
            additionalAttendees: currentAttendees.slice(0, attendees - 1)
          }));
        }
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: attendees,
          additionalAttendees: []
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAttendeeChange = (index: number, field: keyof Attendee, value: string) => {
    setFormData(prev => {
      const newAttendees = [...prev.additionalAttendees];
      newAttendees[index] = { ...newAttendees[index], [field]: value };
      return { ...prev, additionalAttendees: newAttendees };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({});

    try {
      // Insert main registration
      const { data: registrationData, error: registrationError } = await supabase
        .from('tech_conference_registrations')
        .insert([
          {
            school_district: formData.schoolDistrict,
            first_name: formData.firstName,
            last_name: formData.lastName,
            street_address: formData.streetAddress,
            city: formData.city,
            state: formData.state,
            zip_code: formData.zipCode,
            email: formData.email,
            phone: formData.phone,
            total_attendees: formData.totalAttendees,
            total_amount: totalAmount
          }
        ])
        .select()
        .single();

      if (registrationError) throw registrationError;

      // Insert additional attendees if any
      if (formData.additionalAttendees.length > 0) {
        const { error: attendeesError } = await supabase
          .from('tech_conference_attendees')
          .insert(
            formData.additionalAttendees.map(attendee => ({
              registration_id: registrationData.id,
              first_name: attendee.firstName,
              last_name: attendee.lastName,
              email: attendee.email
            }))
          );

        if (attendeesError) throw attendeesError;
      }

      setFormStatus({
        success: true,
        message: 'Registration submitted successfully!'
      });

      // Reset form
      setFormData({
        schoolDistrict: '',
        firstName: '',
        lastName: '',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        email: '',
        phone: '',
        totalAttendees: 1,
        additionalAttendees: []
      });
    } catch (error: any) {
      console.error('Error submitting registration:', error);
      setFormStatus({
        success: false,
        message: `Error submitting registration: ${error.message}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 fade-in">Tech Conference Registration</h1>
            <p className="text-xl text-gray-200 mb-8 fade-in">Join us for the latest in educational technology and innovation.</p>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {formStatus.message && (
            <div className={`mb-8 p-4 rounded-md ${formStatus.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {formStatus.success ? (
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm ${formStatus.success ? 'text-green-800' : 'text-red-800'}`}>
                    {formStatus.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8">
            {/* Organization Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-secondary mb-6">Organization Information</h2>
              <div>
                <label htmlFor="schoolDistrict" className="block text-sm font-medium text-gray-700 mb-1">
                  School District or Organization <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="schoolDistrict"
                    name="schoolDistrict"
                    value={formData.schoolDistrict}
                    onChange={handleChange}
                    required
                    className="pl-10 block w-full shadow-sm focus:ring-primary focus:border-primary rounded-md border-gray-300"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-secondary mb-6">Primary Contact</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="pl-10 block w-full shadow-sm focus:ring-primary focus:border-primary rounded-md border-gray-300"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="pl-10 block w-full shadow-sm focus:ring-primary focus:border-primary rounded-md border-gray-300"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="pl-10 block w-full shadow-sm focus:ring-primary focus:border-primary rounded-md border-gray-300"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="pl-10 block w-full shadow-sm focus:ring-primary focus:border-primary rounded-md border-gray-300"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-secondary mb-6">Address</h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="streetAddress"
                      name="streetAddress"
                      value={formData.streetAddress}
                      onChange={handleChange}
                      required
                      className="pl-10 block w-full shadow-sm focus:ring-primary focus:border-primary rounded-md border-gray-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="block w-full shadow-sm focus:ring-primary focus:border-primary rounded-md border-gray-300"
                    />
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="block w-full shadow-sm focus:ring-primary focus:border-primary rounded-md border-gray-300"
                    >
                      <option value="">Select State</option>
                      <option value="TN">Tennessee</option>
                      {/* Add other states as needed */}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      required
                      className="block w-full shadow-sm focus:ring-primary focus:border-primary rounded-md border-gray-300"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Attendees */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-secondary mb-6">Registration Details</h2>
              <div>
                <label htmlFor="totalAttendees" className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Attendees <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="totalAttendees"
                    name="totalAttendees"
                    value={formData.totalAttendees}
                    onChange={handleChange}
                    required
                    min="1"
                    className="pl-10 block w-full shadow-sm focus:ring-primary focus:border-primary rounded-md border-gray-300"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">Registration fee: ${registrationFee.toFixed(2)} per attendee</p>
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Amount:</span>
                    <span className="text-xl font-bold text-primary">${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Attendees */}
            {formData.totalAttendees > 1 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-secondary mb-6">Additional Attendees</h2>
                {formData.additionalAttendees.map((attendee, index) => (
                  <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-700 mb-4">Attendee {index + 2}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={attendee.firstName}
                          onChange={(e) => handleAttendeeChange(index, 'firstName', e.target.value)}
                          required
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={attendee.lastName}
                          onChange={(e) => handleAttendeeChange(index, 'lastName', e.target.value)}
                          required
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={attendee.email}
                          onChange={(e) => handleAttendeeChange(index, 'email', e.target.value)}
                          required
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <DollarSign className="mr-2 h-5 w-5" />
                    Submit Registration
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default TechConferenceRegistration;