import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Users, Calendar, BookOpen, AlertCircle } from 'lucide-react';

export const Home: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const announcementItems = [
    {
      title: "Annual Conference Registration Open",
      date: "May 15, 2023",
      description: "Registration for the 2023 Annual TAPT Conference is now open. Early bird discounts available until June 15th.",
      link: "/events/annual-conference"
    },
    {
      title: "New State Transportation Guidelines Released",
      date: "April 28, 2023",
      description: "The Tennessee Department of Education has released updated guidelines for school transportation. Review the changes now.",
      link: "/resources/guidelines"
    },
    {
      title: "Driver Training Workshop",
      date: "April 10, 2023",
      description: "Join us for a comprehensive driver training workshop focused on emergency procedures and student management.",
      link: "/events/driver-workshop"
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-secondary to-primary text-white">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/5905700/pexels-photo-5905700.jpeg')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32 relative z-10">
          <div className="md:max-w-2xl lg:max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 slide-in-left">
              Student Safety is Our Priority
            </h1>
            <p className="text-lg md:text-xl text-gray-100 mb-8 slide-in-left" style={{ animationDelay: '0.1s' }}>
              Education is Our Destination! The Tennessee Association of Pupil Transportation promotes safe transportation for all Tennessee school children through education, training, and advocacy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 slide-in-left" style={{ animationDelay: '0.2s' }}>
              <Link to="/about" className="bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-md font-medium inline-flex items-center transition-all">
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link to="/members" className="bg-transparent text-white border border-white hover:bg-white/10 px-6 py-3 rounded-md font-medium transition-all">
                Become a Member
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Announcement Banner */}
      <div className="bg-accent/10 border-y border-accent/20">
        <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap">
            <div className="flex-1 flex items-center">
              <AlertCircle className="flex-shrink-0 h-5 w-5 text-accent" />
              <p className="ml-3 font-medium text-secondary truncate">
                <span className="hidden md:inline">Important: </span>
                The site is currently under construction. Check back soon for more features and content!
              </p>
            </div>
            <div className="order-3 mt-2 w-full sm:mt-0 sm:w-auto">
              <Link to="/contact" className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-accent bg-white/50 hover:bg-white">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-t-4 border-primary">
              <div className="flex items-center mb-4">
                <Calendar className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-semibold ml-3">Upcoming Events</h3>
              </div>
              <p className="text-gray-600 mb-4">Stay informed about conferences, workshops, and training opportunities.</p>
              <Link to="/events" className="text-primary font-medium inline-flex items-center hover:underline">
                View Calendar <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-t-4 border-primary">
              <div className="flex items-center mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-semibold ml-3">Resources</h3>
              </div>
              <p className="text-gray-600 mb-4">Access guidelines, training materials, and important documentation.</p>
              <Link to="/resources" className="text-primary font-medium inline-flex items-center hover:underline">
                Browse Resources <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-t-4 border-primary">
              <div className="flex items-center mb-4">
                <Users className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-semibold ml-3">Membership</h3>
              </div>
              <p className="text-gray-600 mb-4">Join TAPT to connect with professionals and access exclusive benefits.</p>
              <Link to="/members" className="text-primary font-medium inline-flex items-center hover:underline">
                Join Today <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News/Announcements */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary mb-2">Latest Announcements</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Stay updated with the latest news, events, and important information from TAPT.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {announcementItems.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="text-xs font-medium text-primary mb-1">{item.date}</div>
                  <h3 className="text-xl font-bold text-secondary mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <Link to={item.link} className="text-primary font-medium inline-flex items-center hover:underline">
                    Read More <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link to="/news" className="bg-white hover:bg-gray-50 text-primary border border-primary font-medium py-3 px-6 rounded-md inline-flex items-center transition-colors">
              View All News & Announcements <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Join TAPT */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary mb-2">Why Join TAPT?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Membership in the Tennessee Association of Pupil Transportation provides numerous benefits to transportation professionals.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: "Professional Development",
                description: "Access to training workshops, conferences, and educational resources to enhance your skills."
              },
              {
                title: "Networking Opportunities",
                description: "Connect with peers and experts in the field of student transportation across Tennessee."
              },
              {
                title: "Industry Updates",
                description: "Stay current with the latest regulations, best practices, and technology advancements."
              },
              {
                title: "Advocacy & Support",
                description: "Be represented at the state level for issues concerning pupil transportation."
              }
            ].map((benefit, index) => (
              <div key={index} className="flex">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-secondary">{benefit.title}</h3>
                  <p className="mt-1 text-gray-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link to="/members" className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-8 rounded-md transition-colors">
              Become a Member Today
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-primary to-accent py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to connect with transportation professionals?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">Join the Tennessee Association of Pupil Transportation today to access exclusive resources, networking opportunities, and professional development.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/members" className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-md font-medium transition-colors">
              Join TAPT
            </Link>
            <Link to="/contact" className="bg-transparent border border-white hover:bg-white/10 text-white px-8 py-3 rounded-md font-medium transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};