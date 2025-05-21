// Add this to the imports
import { supabase } from '../lib/supabase';
import type { NewsItem } from '../lib/types/news';

// Add this after the existing useEffect
const [featuredEvents, setFeaturedEvents] = useState<NewsItem[]>([]);

useEffect(() => {
  const fetchFeaturedEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('type', 'event')
        .eq('status', 'published')
        .eq('is_featured', true)
        .order('date', { ascending: true });

      if (error) throw error;
      setFeaturedEvents(data || []);
    } catch (error) {
      console.error('Error fetching featured events:', error);
    }
  };

  fetchFeaturedEvents();
}, []);

// Add this section after the Hero section
{featuredEvents.length > 0 && (
  <section className="py-12 bg-gradient-to-b from-gray-100 to-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-secondary mb-2">Featured Events</h2>
        <div className="w-20 h-1 bg-primary mx-auto"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredEvents.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            {event.image_url && (
              <img
                className="w-full h-48 object-cover"
                src={event.image_url}
                alt={event.title}
              />
            )}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                  Featured Event
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(event.date).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-xl font-bold text-secondary mb-2">{event.title}</h3>
              <p className="text-gray-600 mb-4">{event.description}</p>
              <Link
                to={`/events/${event.id}`}
                className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
              >
                Learn More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)}