import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Users, Calendar, Award, FileText, BookOpen } from 'lucide-react';
import { 
  validateMembershipForm, 
  type MembershipFormData, 
  type ValidationError,
  formatPhone 
} from '../lib/validation';

export const Members: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState<MembershipFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    position: '',
    membershipType: '',
    isNewMember: '',
    hearAboutUs: '',
    interests: [],
    agreeToTerms: false
  });

  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const getFieldError = (fieldName: string): string => {
    return errors.find(error => error.field === fieldName)?.message || '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === 'phone') {
      // Format phone number as user types
      setFormData(prev => ({
        ...prev,
        [name]: formatPhone(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error for this field when user starts typing
    setErrors(prev => prev.filter(error => error.field !== name));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    
    setFormData(prev => {
      const newInterests = checked
        ? [...prev.interests, value]
        : prev.interests.filter(interest => interest !== value);

      return {
        ...prev,
        interests: newInterests
      };
    });

    // Clear interests error if at least one is selected
    if (checked) {
      setErrors(prev => prev.filter(error => error.field !== 'interests'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors([]);

    // Validate form
    const validationErrors = validateMembershipForm(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      
      // Scroll to first error
      const firstErrorField = document.querySelector(`[name="${validationErrors[0].field}"]`);
      firstErrorField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      setSubmitSuccess(true);
      
      // Reset form after successful submission
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        organization: '',
        position: '',
        membershipType: '',
        isNewMember: '',
        hearAboutUs: '',
        interests: [],
        agreeToTerms: false
      });

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setErrors([{ 
        field: 'submit', 
        message: 'An error occurred while submitting your application. Please try again.' 
      }]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const membershipBenefits = [
    {
      icon: <Calendar className="h-8 w-8 text-white" />,
      title: "Events & Conferences",
      description: "Access to annual conferences, workshops, and regional meetings across Tennessee."
    },
    {
      icon: <BookOpen className="h-8 w-8 text-white" />,
      title: "Resources & Training",
      description: "Exclusive access to training materials, manuals, and educational resources."
    },
    {
      icon: <Users className="h-8 w-8 text-white" />,
      title: "Networking",
      description: "Connect with transportation professionals, vendors, and policymakers statewide."
    },
    {
      icon: <Award className="h-8 w-8 text-white" />,
      title: "Recognition",
      description: "Opportunities for recognition through awards and certification programs."
    },
    {
      icon: <FileText className="h-8 w-8 text-white" />,
      title: "Updates & News",
      description: "Regular updates on regulations, industry news, and state policies."
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-white" />,
      title: "Professional Development",
      description: "Continuous learning opportunities for professional growth and career advancement."
    }
  ];

  const membershipTypes = [
    {
      title: "Individual Membership",
      price: "$50",
      period: "annual",
      description: "For transportation directors, supervisors, drivers, and other individuals involved in school transportation.",
      benefits: [
        "Full access to all TAPT resources",
        "Member pricing for events and conferences",
        "Voting rights in TAPT elections",
        "Networking opportunities",
        "Professional development",
        "Monthly newsletter"
      ]
    },
    {
      title: "District Membership",
      price: "$200",
      period: "annual",
      description: "For school districts and organizations, covering multiple staff members.",
      benefits: [
        "Coverage for up to 5 staff members",
        "Full access to all TAPT resources",
        "Member pricing for events and conferences",
        "Priority registration for training sessions",
        "Customized on-site training options",
        "Recognition on the TAPT website"
      ]
    },
    {
      title: "Vendor/Partner Membership",
      price: "$300",
      period: "annual",
      description: "For companies and organizations that provide products or services to the transportation industry.",
      benefits: [
        "Listing in TAPT vendor directory",
        "Exhibitor opportunities at TAPT events",
        "Advertising opportunities in TAPT publications",
        "Sponsorship opportunities",
        "Access to TAPT membership contact list",
        "Presentation opportunities at events"
      ]
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Membership Application</h1>
            <p className="text-xl text-gray-200">Join our community of transportation professionals and access exclusive benefits.</p>
          </div>
        </div>
      </section>

      {/* Success Message */}
      {submitSuccess && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Application Submitted Successfully
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Thank you for your membership application! Our team will review your information and contact you soon.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-md rounded-lg p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* General Error */}
              {getFieldError('submit') && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{getFieldError('submit')}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Personal Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-secondary">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md ${
                        getFieldError('firstName')
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-primary focus:ring-primary'
                      }`}
                    />
                    {getFieldError('firstName') && (
                      <p className="mt-2 text-sm text-red-600">{getFieldError('firstName')}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md ${
                        getFieldError('lastName')
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-primary focus:ring-primary'
                      }`}
                    />
                    {getFieldError('lastName') && (
                      <p className="mt-2 text-sm text-red-600">{getFieldError('lastName')}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md ${
                        getFieldError('email')
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-primary focus:ring-primary'
                      }`}
                    />
                    {getFieldError('email') && (
                      <p className="mt-2 text-sm text-red-600">{getFieldError('email')}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(123) 456-7890"
                      className={`mt-1 block w-full rounded-md ${
                        getFieldError('phone')
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-primary focus:ring-primary'
                      }`}
                    />
                    {getFieldError('phone') && (
                      <p className="mt-2 text-sm text-red-600">{getFieldError('phone')}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-secondary">Professional Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Organization <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md ${
                        getFieldError('organization')
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-primary focus:ring-primary'
                      }`}
                    />
                    {getFieldError('organization') && (
                      <p className="mt-2 text-sm text-red-600">{getFieldError('organization')}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Position <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md ${
                        getFieldError('position')
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-primary focus:ring-primary'
                      }`}
                    />
                    {getFieldError('position') && (
                      <p className="mt-2 text-sm text-red-600">{getFieldError('position')}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full md:w-auto px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                    isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </div>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Membership Benefits */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary mb-4">Membership Benefits</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join TAPT to access a wealth of resources, connections, and opportunities that will enhance your professional growth in the field of pupil transportation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {membershipBenefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all">
                <div className="p-6">
                  <div className="bg-primary rounded-lg p-4 inline-block mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold text-secondary mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Types */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary mb-4">Membership Options</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the membership type that best fits your role and organization in pupil transportation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {membershipTypes.map((type, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all">
                <div className="px-6 pt-6">
                  <h3 className="text-xl font-bold text-secondary">{type.title}</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-3xl font-extrabold text-primary">{type.price}</span>
                    <span className="ml-1 text-gray-500">/{type.period}</span>
                  </div>
                  <p className="mt-4 text-gray-600">{type.description}</p>
                </div>
                <div className="px-6 py-8">
                  <ul className="space-y-4">
                    {type.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mr-2" />
                        <span className="text-gray-600">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary mb-4">Member Testimonials</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from transportation professionals who have benefited from TAPT membership.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Being a TAPT member has connected me with a network of professionals who share knowledge and support. The resources and training have been invaluable to our district.",
                name: "Michael Johnson",
                title: "Transportation Director",
                district: "Davidson County Schools"
              },
              {
                quote: "TAPT's conferences and workshops have significantly improved our safety protocols. The organization provides practical solutions to the challenges we face daily.",
                name: "Karen Williams",
                title: "Safety Coordinator",
                district: "Hamilton County Schools"
              },
              {
                quote: "As a new transportation supervisor, TAPT has been essential for my professional development. The mentorship and resources have helped me build a stronger transportation program.",
                name: "David Rodriguez",
                title: "Transportation Supervisor",
                district: "Rutherford County Schools"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <svg className="h-8 w-8 text-primary opacity-50 mb-4" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
                <p className="text-gray-600 italic mb-4">{testimonial.quote}</p>
                <div className="mt-4">
                  <p className="font-semibold text-secondary">{testimonial.name}</p>
                  <p className="text-gray-500 text-sm">{testimonial.title}, {testimonial.district}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};