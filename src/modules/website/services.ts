import { createClient } from '@supabase/supabase-js';
import {
  WebsiteInfo,
  WebsitePage,
  WebsiteBanner,
  WebsiteBlogCategory,
  WebsiteBlogTag,
  WebsiteBlogPost,
  WebsiteCustomer,
  WebsiteTestimonial,
  WebsiteContactRequest,
  WebsiteJobPosition,
  WebsiteJobApplication
} from './types';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// Website Info Services
export const getWebsiteInfo = async (): Promise<WebsiteInfo | null> => {
  const { data, error } = await supabase
    .from('website_info')
    .select('*')
    .single();

  if (error) {
    console.error('Error fetching website info:', error);
    return null;
  }

  return data as WebsiteInfo;
};

export const updateWebsiteInfo = async (info: Partial<WebsiteInfo>): Promise<WebsiteInfo | null> => {
  const { data, error } = await supabase
    .from('website_info')
    .update(info)
    .eq('id', info.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating website info:', error);
    return null;
  }

  return data as WebsiteInfo;
};

// Website Pages Services
export const getWebsitePages = async (isPublished?: boolean): Promise<WebsitePage[]> => {
  let query = supabase.from('website_pages').select('*');
  
  if (isPublished !== undefined) {
    query = query.eq('is_published', isPublished);
  }
  
  const { data, error } = await query.order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching website pages:', error);
    return [];
  }

  return data as WebsitePage[];
};

export const getWebsitePageBySlug = async (slug: string): Promise<WebsitePage | null> => {
  const { data, error } = await supabase
    .from('website_pages')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error(`Error fetching page with slug ${slug}:`, error);
    return null;
  }

  return data as WebsitePage;
};

export const createWebsitePage = async (page: Omit<WebsitePage, 'id' | 'created_at' | 'updated_at'>): Promise<WebsitePage | null> => {
  const { data, error } = await supabase
    .from('website_pages')
    .insert(page)
    .select()
    .single();

  if (error) {
    console.error('Error creating website page:', error);
    return null;
  }

  return data as WebsitePage;
};

export const updateWebsitePage = async (id: string, page: Partial<WebsitePage>): Promise<WebsitePage | null> => {
  const { data, error } = await supabase
    .from('website_pages')
    .update(page)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating page with id ${id}:`, error);
    return null;
  }

  return data as WebsitePage;
};

export const deleteWebsitePage = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('website_pages')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting page with id ${id}:`, error);
    return false;
  }

  return true;
};

// Website Banners Services
export const getActiveBanners = async (): Promise<WebsiteBanner[]> => {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('website_banners')
    .select('*')
    .eq('is_active', true)
    .or(`start_date.is.null,start_date.lte.${now}`)
    .or(`end_date.is.null,end_date.gte.${now}`)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching active banners:', error);
    return [];
  }

  return data as WebsiteBanner[];
};

export const getAllBanners = async (): Promise<WebsiteBanner[]> => {
  const { data, error } = await supabase
    .from('website_banners')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching all banners:', error);
    return [];
  }

  return data as WebsiteBanner[];
};

export const createBanner = async (banner: Omit<WebsiteBanner, 'id' | 'created_at' | 'updated_at'>): Promise<WebsiteBanner | null> => {
  const { data, error } = await supabase
    .from('website_banners')
    .insert(banner)
    .select()
    .single();

  if (error) {
    console.error('Error creating banner:', error);
    return null;
  }

  return data as WebsiteBanner;
};

export const updateBanner = async (id: string, banner: Partial<WebsiteBanner>): Promise<WebsiteBanner | null> => {
  const { data, error } = await supabase
    .from('website_banners')
    .update(banner)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating banner with id ${id}:`, error);
    return null;
  }

  return data as WebsiteBanner;
};

export const deleteBanner = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('website_banners')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting banner with id ${id}:`, error);
    return false;
  }

  return true;
};

// Blog Categories Services
export const getBlogCategories = async (): Promise<WebsiteBlogCategory[]> => {
  const { data, error } = await supabase
    .from('website_blog_categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching blog categories:', error);
    return [];
  }

  return data as WebsiteBlogCategory[];
};

// Blog Posts Services
export const getPublishedBlogPosts = async (limit?: number, categoryId?: string): Promise<WebsiteBlogPost[]> => {
  let query = supabase
    .from('website_blog_posts')
    .select('*, category:website_blog_categories(*)')
    .eq('status', 'published')
    .lte('publish_date', new Date().toISOString())
    .order('publish_date', { ascending: false });

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching published blog posts:', error);
    return [];
  }

  return data as WebsiteBlogPost[];
};

export const getBlogPostBySlug = async (slug: string): Promise<WebsiteBlogPost | null> => {
  const { data, error } = await supabase
    .from('website_blog_posts')
    .select('*, category:website_blog_categories(*)')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error);
    return null;
  }

  // Increment views count
  if (data) {
    await supabase
      .from('website_blog_posts')
      .update({ views_count: (data.views_count || 0) + 1 })
      .eq('id', data.id);
  }

  return data as WebsiteBlogPost;
};

// Customers Services
export const getActiveCustomers = async (): Promise<WebsiteCustomer[]> => {
  const { data, error } = await supabase
    .from('website_customers')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching active customers:', error);
    return [];
  }

  return data as WebsiteCustomer[];
};

// Testimonials Services
export const getActiveTestimonials = async (): Promise<WebsiteTestimonial[]> => {
  const { data, error } = await supabase
    .from('website_testimonials')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching active testimonials:', error);
    return [];
  }

  return data as WebsiteTestimonial[];
};

// Contact Requests Services
export const submitContactRequest = async (contact: Omit<WebsiteContactRequest, 'id' | 'status' | 'created_at' | 'updated_at'>): Promise<WebsiteContactRequest | null> => {
  const newContact = {
    ...contact,
    status: 'new'
  };

  const { data, error } = await supabase
    .from('website_contact_requests')
    .insert(newContact)
    .select()
    .single();

  if (error) {
    console.error('Error submitting contact request:', error);
    return null;
  }

  return data as WebsiteContactRequest;
};

// Job Positions Services
export const getActiveJobPositions = async (): Promise<WebsiteJobPosition[]> => {
  const now = new Date().toISOString();
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('website_job_positions')
    .select('*')
    .eq('is_active', true)
    .lte('publish_date', now)
    .or(`application_deadline.is.null,application_deadline.gte.${today}`)
    .order('publish_date', { ascending: false });

  if (error) {
    console.error('Error fetching active job positions:', error);
    return [];
  }

  return data as WebsiteJobPosition[];
};

export const getJobPositionBySlug = async (slug: string): Promise<WebsiteJobPosition | null> => {
  const { data, error } = await supabase
    .from('website_job_positions')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error(`Error fetching job position with slug ${slug}:`, error);
    return null;
  }

  return data as WebsiteJobPosition;
};

// Job Applications Services
export const submitJobApplication = async (application: Omit<WebsiteJobApplication, 'id' | 'status' | 'created_at' | 'updated_at'>): Promise<WebsiteJobApplication | null> => {
  const newApplication = {
    ...application,
    status: 'received'
  };

  const { data, error } = await supabase
    .from('website_job_applications')
    .insert(newApplication)
    .select()
    .single();

  if (error) {
    console.error('Error submitting job application:', error);
    return null;
  }

  return data as WebsiteJobApplication;
}; 