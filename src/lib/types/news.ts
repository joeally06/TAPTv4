export interface NewsItem {
  id: number;
  title: string;
  date: string;
  category: NewsCategory;
  excerpt: string;
  image: string;
}

export type NewsCategory = 'all' | 'announcements' | 'events' | 'safety' | 'regulations' | 'industry';

export interface CategoryOption {
  id: NewsCategory;
  name: string;
}

export interface NewsFilters {
  searchQuery: string;
  category: NewsCategory;
}
