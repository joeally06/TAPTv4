import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Clock, Users, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Events: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // State for the current filter
  const [filter, setFilter] = useState('upcoming');

  // Event data
  const events = [
    {
      id: 1,
      title: "Annual TAPT Conference",
      date: "June 15-17, 2023",
      time: "8:00 AM - 5:00 PM",
      location: "Knoxville Convention Center",
      address: "701 Henley St, Knoxville, TN 37902",
      image: "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=600",
      description: "Join us for the annual TAPT Conference featuring workshops, networking opportunities, and the latest in pupil transportation.",
      status: "upcoming",
      featured: true
    },
    {
      id: 2,
      title: "Driver Training Workshop",
      date: "May 20, 2023",
      time: "9:00 AM - 4:00 PM",
      location: "Nashville Transportation Center",
      address: "123 Main St, Nashville, TN 37203",
      image: "https://images.pexels.com/photos/6249554/pexels-photo-6249554.jpeg?auto=compress&cs=tinysrgb&w=600",
      description: "Comprehensive training for school bus drivers focusing on safety procedures and student management.",
      status: "upcoming",
      featured: false
    },
    {
      id: 3,
      title: "Regional Directors Meeting",
      date: "May 5, 2023",
      time: "1:00 PM - 3:00 PM",
      location: "Virtual Meeting",
      address: "Zoom (link will be sent to participants)",
      image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600",
      description: "Quarterly meeting for regional transportation directors to discuss issues and share best practices.",
      status: "upcoming",
      featured: false
    },
    {
      id: 4,
      title: "Safety Awards Ceremony",
      date: "April 15, 2023",
      time: "6:00 PM - 9:00 PM",
      location: "Marriott Hotel",
      address: "250 Broadway, Memphis, TN 38103",
      image: "https://images.pexels.com/photos/1709003/pexels-photo-1709003.jpeg?auto=compress&cs=tinysrgb&w=600",
      description: "Annual ceremony recognizing outstanding safety records and achievements in pupil transportation.",
      status: "past",
      featured: false
    },
    {
      id: 5,
      title: "Legislative Update Webinar",
      date: "March 10, 2023",
      time: "10:00 AM - 11:30 AM",
      location: "Virtual Webinar",
      address: "Online (registration required)",
      image: "https://images.pexels.com/photos/7688460/pexels-photo-7688460.jpeg?auto=compress&cs=tinysrgb&w=600",
      description: "Learn about recent legislative changes affecting school transportation in Tennessee.",
      status: "past",
      featured: false
    },
    {
      id: 6,
      title: "Winter Weather Driving Workshop",
      date: "February 8, 2023",
      time: "8:30 AM - 12:30 PM",
      location: "Johnson City Transportation Facility",
      address: "456 School Rd, Johnson City, TN 37601",
      image: "https://images.pexels.com/photos/5694134/pexels-photo-5694134.jpeg?auto=compress&cs=tinysrgb&w=600",
      description: "Specialized training for drivers on navigating winter weather conditions safely.",
      status: "past",
      featured: false
    }
  ];

  // Filter events based on current filter
  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.status === filter;
  });

  // Find featured event
  const featuredEvent = events.find(event => event.featured && event.status === 'upcoming');

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 fade-in">Events & Training</h1>
            <p className="text-xl text-gray-200 mb-8 fade-in">Discover upcoming conferences, workshops, and training opportunities for transportation professionals.</p>
          </div>
        </div>
      </section>

      {/* Featured Event Section (if available) */}
      {featuredEvent && (
        <section className="py-12 bg-gradient-to-b from-gray-100 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-secondary mb-2">Featured Event</h2>
              <div className="w-20 h-1 bg-primary mx-auto"></div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:flex-shrink-0">
                  <img
                    className="h-60 w-full object-cover md:w-64 md:h-full"
                    src={featuredEvent.image}
                    alt={featuredEvent.title}
                  />
                </div>
                <div className="p-8">
                  <div className="uppercase tracking-wide text-sm text-primary font-semibold">Don't Miss!</div>
                  <h3 className="mt-1 text-2xl font-bold text-secondary leading-tight">
                    {featuredEvent.title}
                  </h3>
                  <div className="mt-3 flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>{featuredEvent.date}</span>
                  </div>
                  <div className="mt-1 flex items-center text-gray-600">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>{featuredEvent.time}</span>
                  </div>
                  <div className="mt-1 flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{featuredEvent.location}</span>
                  </div>
                  <p className="mt-4 text-gray-600">
                    {featuredEvent.description}
                  </p>
                  <div className="mt-6">
                    <Link
                      to={`/events/${featuredEvent.id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90"
                    >
                      Event Details
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Events Listing */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Tabs */}
          <div className="mb-8 border-b border-gray-200">
            <div className="flex space-x-8">
              {[
                { key: 'upcoming', label: 'Upcoming Events' },
                { key: 'past', label: 'Past Events' },
                { key: 'all', label: 'All Events' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    filter === tab.key
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setFilter(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.length > 0 ? (
              filteredEvents.map(event => (
                <div key={event.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    {event.status === 'past' && (
                      <div className="inline-block px-2 py-1 mb-3 rounded bg-gray-100 text-gray-800 text-xs uppercase tracking-wide font-semibold">
                        Past Event
                      </div>
                    )}
                    
                    <h3 className="text-xl font-bold text-secondary mb-3">{event.title}</h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-5 w-5 mr-2 text-gray-400" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-5 w-5 mr-2 text-gray-400" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {event.description}
                    </p>
                    
                    <Link
                      to={`/events/${event.id}`}
                      className="inline-block text-primary font-medium hover:underline"
                    >
                      Event Details <ChevronRight className="inline h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-12">
                <div className="bg-gray-100 p-4 rounded-full">
                  <Calendar className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No events found</h3>
                <p className="mt-1 text-sm text-gray-500">Check back soon for updates or adjust your filter.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Calendar Download */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="p-8 md:flex-1">
                <h2 className="text-2xl font-bold text-secondary mb-4">TAPT Event Calendar</h2>
                <p className="text-gray-600 mb-6">
                  Download or subscribe to our event calendar to stay up-to-date with all TAPT events, workshops, and important dates.
                </p>
                <div className="space-y-4">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                    <svg className="mr-2 -ml-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Add to Calendar
                  </button>
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                    <svg className="mr-2 -ml-1 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download iCal File
                  </button>
                </div>
              </div>
              <div className="md:flex-shrink-0 md:w-1/3 bg-gradient-to-br from-primary to-secondary p-8 text-white flex items-center">
                <div>
                  <h3 className="text-xl font-bold mb-3">Host Your Own Event</h3>
                  <p className="mb-4">Are you interested in hosting a TAPT workshop or event in your district?</p>
                  <Link
                    to="/contact"
                    className="inline-flex items-center px-4 py-2 border border-white rounded-md text-sm font-medium text-primary bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-primary"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};