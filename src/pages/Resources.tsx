import React, { useEffect, useState } from 'react';
import { Search, Download, FileText, Book, FileCheck, Folder } from 'lucide-react';

export const Resources: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const resourceCategories = [
    { id: 'all', name: 'All Resources' },
    { id: 'manuals', name: 'Manuals & Guides' },
    { id: 'forms', name: 'Forms & Documents' },
    { id: 'laws', name: 'Laws & Regulations' },
    { id: 'training', name: 'Training Materials' },
    { id: 'safety', name: 'Safety Resources' },
  ];

  const resourceItems = [
    {
      title: "School Bus Driver Handbook",
      category: "manuals",
      description: "Comprehensive guide for school bus drivers covering operations, safety, and best practices.",
      date: "January 2023",
      type: "PDF",
      size: "4.2 MB",
      link: "/resources/driver-handbook.pdf"
    },
    {
      title: "Pre-Trip Inspection Checklist",
      category: "forms",
      description: "Daily pre-trip inspection form for school bus drivers to ensure vehicle safety.",
      date: "February 2023",
      type: "PDF",
      size: "215 KB",
      link: "/resources/pre-trip-checklist.pdf"
    },
    {
      title: "Tennessee Pupil Transportation Laws",
      category: "laws",
      description: "Complete compilation of Tennessee laws pertaining to student transportation.",
      date: "March 2023",
      type: "PDF",
      size: "2.8 MB",
      link: "/resources/tn-transportation-laws.pdf"
    },
    {
      title: "Emergency Evacuation Procedures",
      category: "training",
      description: "Step-by-step guide for conducting emergency evacuations from school buses.",
      date: "April 2023",
      type: "PDF",
      size: "1.5 MB",
      link: "/resources/evacuation-procedures.pdf"
    },
    {
      title: "Student Management Techniques",
      category: "training",
      description: "Effective strategies for managing student behavior on school buses.",
      date: "May 2023",
      type: "PDF",
      size: "950 KB",
      link: "/resources/student-management.pdf"
    },
    {
      title: "Bus Route Planning Guide",
      category: "manuals",
      description: "Guide to planning efficient and safe bus routes for school districts.",
      date: "June 2023",
      type: "PDF",
      size: "3.1 MB",
      link: "/resources/route-planning.pdf"
    },
    {
      title: "Incident Report Form",
      category: "forms",
      description: "Standard form for reporting incidents that occur during student transportation.",
      date: "July 2023",
      type: "PDF",
      size: "325 KB",
      link: "/resources/incident-report.pdf"
    },
    {
      title: "Safety Award Application",
      category: "forms",
      description: "Application for annual safety recognition program for drivers and districts.",
      date: "August 2023",
      type: "PDF",
      size: "420 KB",
      link: "/resources/safety-award.pdf"
    },
    {
      title: "Federal Motor Carrier Safety Regulations",
      category: "laws",
      description: "Summary of FMCSR regulations applicable to school bus operations.",
      date: "September 2023",
      type: "PDF",
      size: "1.8 MB",
      link: "/resources/fmcsr-summary.pdf"
    },
    {
      title: "Winter Driving Guide",
      category: "safety",
      description: "Special considerations and procedures for operating school buses in winter conditions.",
      date: "October 2023",
      type: "PDF",
      size: "1.2 MB",
      link: "/resources/winter-driving.pdf"
    },
    {
      title: "Student Loading/Unloading Procedures",
      category: "safety",
      description: "Detailed procedures for the safe loading and unloading of students.",
      date: "November 2023",
      type: "PDF",
      size: "875 KB",
      link: "/resources/loading-procedures.pdf"
    },
    {
      title: "New Driver Training Curriculum",
      category: "training",
      description: "Comprehensive curriculum for training new school bus drivers.",
      date: "December 2023",
      type: "PDF",
      size: "5.3 MB",
      link: "/resources/new-driver-curriculum.pdf"
    }
  ];

  // Filter resources based on search and category
  const filteredResources = resourceItems.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || resource.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Function to get icon based on category
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'manuals':
        return <Book className="h-6 w-6" />;
      case 'forms':
        return <FileCheck className="h-6 w-6" />;
      case 'laws':
        return <FileText className="h-6 w-6" />;
      case 'training':
        return <Folder className="h-6 w-6" />;
      case 'safety':
        return <FileText className="h-6 w-6" />;
      default:
        return <FileText className="h-6 w-6" />;
    }
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 fade-in">Resources</h1>
            <p className="text-xl text-gray-200 mb-8 fade-in">Access guidelines, forms, and educational materials to support your transportation program.</p>
          </div>
        </div>
      </section>

      {/* Resource Center */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-md rounded-lg p-6 md:p-8">
            {/* Search and Filter */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                {/* Search Bar */}
                <div className="relative max-w-md w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary transition duration-150 ease-in-out"
                    placeholder="Search resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                {/* Category Tabs (Desktop) */}
                <div className="hidden md:flex space-x-2">
                  {resourceCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeCategory === category.id
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
                
                {/* Category Select (Mobile) */}
                <div className="md:hidden w-full">
                  <select
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md"
                    value={activeCategory}
                    onChange={(e) => setActiveCategory(e.target.value)}
                  >
                    {resourceCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Results */}
            <div className="space-y-6">
              <div className="text-sm text-gray-600 mb-4">
                {filteredResources.length === 0 ? 'No resources found' : `Showing ${filteredResources.length} resources`}
              </div>
              
              <div className="divide-y divide-gray-200">
                {filteredResources.map((resource, index) => (
                  <div key={index} className="py-6 flex flex-col md:flex-row md:items-center">
                    <div className="flex-shrink-0 mr-4 mb-4 md:mb-0 bg-primary/10 p-4 rounded-md">
                      {getCategoryIcon(resource.category)}
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-secondary">{resource.title}</h3>
                      <p className="text-gray-600 mb-2">{resource.description}</p>
                      <div className="flex flex-wrap items-center text-sm text-gray-500 gap-x-4">
                        <span>Updated: {resource.date}</span>
                        <span>{resource.type}</span>
                        <span>{resource.size}</span>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex-shrink-0">
                      <a
                        href={resource.link}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Request Resources */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 rounded-lg shadow-inner p-8 md:p-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-secondary mb-4">Need a specific resource?</h2>
              <p className="text-lg text-gray-600 mb-8">
                If you can't find what you're looking for, our team is here to help. Contact us with your resource request.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Request a Resource
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};