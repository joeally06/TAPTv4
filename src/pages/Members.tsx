import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Users, Calendar, Award, FileText, BookOpen } from 'lucide-react';

export const Members: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    position: '',
    membershipType: '',
    isNewMember: '',
    hearAboutUs: '',
    interests: [] as string[],
    agreeToTerms: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    
    setFormData(prev => {
      if (checked) {
        return {
          ...prev,
          interests: [...prev.interests, value]
        };
      } else {
        return {
          ...prev,
          interests: prev.interests.filter(interest => interest !== value)
        };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would handle the form submission, like sending the data to your server
    alert('Thank you for your membership application! We will contact you soon.');
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6 fade-in">Membership</h1>
            <p className="text-xl text-gray-200 mb-8 fade-in">Join our community of transportation professionals dedicated to safe and efficient student transportation.</p>
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

      {/* Membership Application Form */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-secondary mb-4">Join TAPT Today</h2>
              <p className="text-gray-600">
                Complete the membership application form below to join TAPT. We'll contact you with further instructions.
              </p>
            </div>
            
            <form className="bg-white shadow-lg rounded-lg p-8" onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-bold text-secondary mb-4">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name*</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name*</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address*</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number*</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Professional Information */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-bold text-secondary mb-4">Professional Information</h3>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label htmlFor="organization" className="block text-sm font-medium text-gray-700">School District/Organization*</label>
                      <input
                        type="text"
                        id="organization"
                        name="organization"
                        value={formData.organization}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="position" className="block text-sm font-medium text-gray-700">Position/Title*</label>
                      <input
                        type="text"
                        id="position"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="membershipType" className="block text-sm font-medium text-gray-700">Membership Type*</label>
                      <select
                        id="membershipType"
                        name="membershipType"
                        value={formData.membershipType}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      >
                        <option value="">Select Membership Type</option>
                        <option value="individual">Individual Membership ($50/year)</option>
                        <option value="district">District Membership ($200/year)</option>
                        <option value="vendor">Vendor/Partner Membership ($300/year)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="isNewMember" className="block text-sm font-medium text-gray-700">Are you a new member?*</label>
                      <select
                        id="isNewMember"
                        name="isNewMember"
                        value={formData.isNewMember}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      >
                        <option value="">Select an option</option>
                        <option value="yes">Yes, I'm new to TAPT</option>
                        <option value="no">No, I'm renewing my membership</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="hearAboutUs" className="block text-sm font-medium text-gray-700">How did you hear about TAPT?</label>
                      <select
                        id="hearAboutUs"
                        name="hearAboutUs"
                        value={formData.hearAboutUs}
                        onChange={handleInputChange}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      >
                        <option value="">Select an option</option>
                        <option value="colleague">From a colleague</option>
                        <option value="conference">At a conference</option>
                        <option value="social">Social media</option>
                        <option value="search">Internet search</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Areas of Interest */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-bold text-secondary mb-4">Areas of Interest</h3>
                  <p className="text-gray-600 text-sm mb-4">Select all that apply:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { value: "safety", label: "Safety and Compliance" },
                      { value: "training", label: "Driver Training" },
                      { value: "management", label: "Fleet Management" },
                      { value: "routing", label: "Routing and Scheduling" },
                      { value: "leadership", label: "Leadership Development" },
                      { value: "technology", label: "Transportation Technology" }
                    ].map(interest => (
                      <div key={interest.value} className="flex items-center">
                        <input
                          id={interest.value}
                          name="interests"
                          type="checkbox"
                          value={interest.value}
                          onChange={handleCheckboxChange}
                          checked={formData.interests.includes(interest.value)}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <label htmlFor={interest.value} className="ml-3 text-sm text-gray-700">
                          {interest.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Terms and Conditions */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="agreeToTerms"
                        name="agreeToTerms"
                        type="checkbox"
                        checked={formData.agreeToTerms}
                        onChange={handleInputChange}
                        required
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="agreeToTerms" className="font-medium text-gray-700">
                        I agree to the terms and conditions*
                      </label>
                      <p className="text-gray-500">
                        By submitting this application, I agree to abide by the TAPT bylaws and code of ethics.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Submit Membership Application
                  </button>
                  <p className="mt-3 text-sm text-gray-500 text-center">
                    * Required Fields
                  </p>
                </div>
              </div>
            </form>
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