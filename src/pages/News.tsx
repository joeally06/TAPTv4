import React, { useEffect, useState } from 'react';
import { Calendar, ChevronDown, Search, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

export const News: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'announcements', name: 'Announcements' },
    { id: 'events', name: 'Events' },
    { id: 'safety', name: 'Safety' },
    { id: 'regulations', name: 'Regulations' },
    { id: 'industry', name: 'Industry News' },
  ];

  const newsItems = [
    {
      id: 1,
      title: "Annual Conference Registration Now Open",
      date: "May 15, 2023",
      category: "events",
      excerpt: "Registration for the 2023 Annual TAPT Conference is now open. Join us for three days of professional development, networking, and the latest in pupil transportation.",
      image: "https://images.pexels.com/photos/2977547/pexels-photo-2977547.jpeg?auto=compress&cs=tinysrgb&h=300",
    },
    {
      id: 2,
      title: "New State Transportation Guidelines Released",
      date: "April 28, 2023",
      category: "regulations",
      excerpt: "The Tennessee Department of Education has released updated guidelines for school transportation. These changes affect driver qualifications, vehicle inspections, and student safety procedures.",
      image: "https://images.pexels.com/photos/3184432/pexels-photo-3184432.jpeg?auto=compress&cs=tinysrgb&h=300",
    },
    {
      id: 3,
      title: "Driver Training Workshop Announced",
      date: "April 10, 2023",
      category: "events",
      excerpt: "TAPT will host a comprehensive driver training workshop on June 5-7, 2023. The workshop will focus on emergency procedures, student management, and defensive driving techniques.",
      image: "https://images.pexels.com/photos/6249579/pexels-photo-6249579.jpeg?auto=compress&cs=tinysrgb&h=300",
    },
    {
      id: 4,
      title: "Safety Study Shows Declining Incident Rates",
      date: "March 22, 2023",
      category: "safety",
      excerpt: "A recent study conducted by the National Association for Pupil Transportation shows a 12% decrease in school bus-related incidents over the past year. Tennessee ranks among the top states for school transportation safety.",
      image: "https://images.pexels.com/photos/8055847/pexels-photo-8055847.jpeg?auto=compress&cs=tinysrgb&h=300",
    },
    {
      id: 5,
      title: "TAPT Presents at National Conference",
      date: "February 18, 2023",
      category: "announcements",
      excerpt: "TAPT representatives presented Tennessee's innovative approach to driver retention at the National Conference on School Transportation. The presentation highlighted strategies that have helped increase driver retention by 15%.",
      image: "https://images.pexels.com/photos/6801642/pexels-photo-6801642.jpeg?auto=compress&cs=tinysrgb&h=300",
    },
    {
      id: 6,
      title: "Electric School Bus Pilot Program Expands",
      date: "January 30, 2023",
      category: "industry",
      excerpt: "Three additional Tennessee school districts will join the Electric School Bus Pilot Program in the 2023-2024 school year. This expansion brings the total number of electric buses in the state to 25.",
      image: "https://images.pexels.com/photos/9799757/pexels-photo-9799757.jpeg?auto=compress&cs=tinysrgb&h=300",
    },
    {
      id: 7,
      title: "Winter Weather Driving Guidelines Updated",
      date: "December 15, 2022",
      category: "safety",
      excerpt: "TAPT has updated its Winter Weather Driving Guidelines to include new procedures for extreme cold conditions. The document includes input from transportation directors across the state.",
      image: "https://images.pexels.com/photos/5837166/pexels-photo-5837166.jpeg?auto=compress&cs=tinysrgb&h=300",
    },
    {
      id: 8,
      title: "TAPT Honors Outstanding Transportation Professionals",
      date: "November 22, 2022",
      category: "announcements",
      excerpt: "TAPT recognized 12 transportation professionals at its annual awards ceremony. Categories included Driver of the Year, Director of the Year, and Lifetime Achievement Award.",
      image: "https://images.pexels.com/photos/9035381/pexels-photo-9035381.jpeg?auto=compress&cs=tinysrgb&h=300",
    }
  ];

  // Filter news items based on search query and category
  const filteredNews = newsItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 fade-in">News & Announcements</h1>
            <p className="text-xl text-gray-200 mb-8 fade-in">Stay updated with the latest news, events, and important information from TAPT.</p>
          </div>
        </div>
      </section>

      {/* News Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search and Filter */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 md:items-center">
              {/* Search Bar */}
              <div className="relative flex-grow max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary transition duration-150 ease-in-out"
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Category Filter */}
              <div className="relative inline-block text-left">
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* News Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.length > 0 ? (
              filteredNews.map((item) => (
                <article key={item.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{item.date}</span>
                      <span className="mx-2">•</span>
                      <Tag className="h-4 w-4 mr-1" />
                      <span className="capitalize">{item.category}</span>
                    </div>
                    <h3 className="text-xl font-bold text-secondary mb-2">
                      <Link to={`/news/${item.id}`} className="hover:text-primary transition-colors">
                        {item.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 mb-4">{item.excerpt}</p>
                    <Link 
                      to={`/news/${item.id}`}
                      className="text-primary font-medium hover:underline inline-flex items-center"
                    >
                      Read More
                      <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-12">
                <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No results found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter Sign-up */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl mb-8">Subscribe to our newsletter to receive the latest news and updates directly to your inbox.</p>
            
            <form className="sm:flex justify-center">
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-5 py-3 placeholder-gray-500 focus:ring-white focus:border-white sm:max-w-xs border-white rounded-md text-gray-900"
                placeholder="Enter your email"
              />
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-white"
                >
                  Subscribe
                </button>
              </div>
            </form>
            
            <p className="mt-3 text-sm text-white/80">
              We care about your data. Read our <a href="#" className="font-medium text-white underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};