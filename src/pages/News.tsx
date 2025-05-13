import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Calendar, ChevronDown, Search, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { NewsItem, NewsCategory, CategoryOption, NewsFilters } from '../lib/types/news';

const NewsCard: React.FC<{ item: NewsItem; categoryName: string }> = React.memo(({ item, categoryName }) => (
  <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all">
    <img src={item.image} alt="" className="w-full h-48 object-cover" />
    <div className="p-6">
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <Calendar className="h-4 w-4 mr-2" />
        {item.date}
        <Tag className="h-4 w-4 ml-4 mr-2" />
        {categoryName}
      </div>
      <h2 className="text-xl font-bold text-secondary mb-2">{item.title}</h2>
      <p className="text-gray-600 mb-4">{item.excerpt}</p>
      <Link
        to={`/news/${item.id}`}
        className="text-primary hover:text-primary/80 font-medium"
      >
        Read More →
      </Link>
    </div>
  </article>
));

export const News: React.FC = () => {
  // Initialize scroll position
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Combined filters state to prevent race conditions
  const [filters, setFilters] = useState<NewsFilters>({
    searchQuery: '',
    category: 'all'
  });

  // Memoized categories
  const categories: CategoryOption[] = useMemo(() => [
    { id: 'all', name: 'All Categories' },
    { id: 'announcements', name: 'Announcements' },
    { id: 'events', name: 'Events' },
    { id: 'safety', name: 'Safety' },
    { id: 'regulations', name: 'Regulations' },
    { id: 'industry', name: 'Industry News' },
  ], []);

  // Memoized category lookup map
  const categoryMap = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.id] = category.name;
      return acc;
    }, {} as Record<string, string>);
  }, [categories]);

  // Memoized news items
  const newsItems: NewsItem[] = useMemo(() => [
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
  ], []);

  // Debounced filter updates
  const updateFilters = useCallback((updates: Partial<NewsFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  // Memoized search handler with debounce
  const handleSearch = useCallback((value: string) => {
    const timeoutId = setTimeout(() => {
      updateFilters({ searchQuery: value });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [updateFilters]);

  // Memoized filtered news items
  const filteredNews = useMemo(() => {
    return newsItems.filter(item => {
      const matchesSearch = filters.searchQuery === '' || 
        item.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) || 
        item.excerpt.toLowerCase().includes(filters.searchQuery.toLowerCase());
        
      const matchesCategory = filters.category === 'all' || item.category === filters.category;
      
      return matchesSearch && matchesCategory;
    });
  }, [filters, newsItems]);

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">News & Updates</h1>
            <p className="text-xl text-gray-200">Stay informed about the latest developments in pupil transportation.</p>
          </div>
        </div>
      </section>

      {/* News Filters */}
      <section className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search news..."
                value={filters.searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>
            
            <div className="flex space-x-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => updateFilters({ category: category.id })}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    filters.category === category.id
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((item) => (
              <NewsCard key={item.id} item={item} categoryName={categoryMap[item.category]} />
            ))}
          </div>

          {filteredNews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No news items found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};