// Types for Website Module

export interface WebsiteInfo {
  id: string;
  company_name: string;
  logo_url?: string;
  slogan?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  tax_code?: string;
  social_media?: Record<string, string>;
  meta_description?: string;
  meta_keywords?: string;
  created_at: Date;
  updated_at: Date;
}

export interface WebsitePage {
  id: string;
  title: string;
  slug: string;
  content?: string;
  meta_title?: string;
  meta_description?: string;
  is_published: boolean;
  publish_date?: Date;
  sort_order?: number;
  created_at: Date;
  updated_at: Date;
}

export interface WebsiteBanner {
  id: string;
  title: string;
  image_url: string;
  link?: string;
  description?: string;
  is_active: boolean;
  display_order?: number;
  start_date?: Date;
  end_date?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface WebsiteBlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  created_at: Date;
  updated_at: Date;
}

export interface WebsiteBlogTag {
  id: string;
  name: string;
  slug: string;
  created_at: Date;
  updated_at: Date;
}

export interface WebsiteBlogPost {
  id: string;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  featured_image?: string;
  author_id: string;
  status: 'draft' | 'published' | 'archived';
  publish_date?: Date;
  category_id?: string;
  views_count: number;
  meta_title?: string;
  meta_description?: string;
  created_at: Date;
  updated_at: Date;
  // Relations (optional)
  category?: WebsiteBlogCategory;
  tags?: WebsiteBlogTag[];
}

export interface WebsiteCustomer {
  id: string;
  name: string;
  logo_url?: string;
  description?: string;
  url?: string;
  display_order?: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface WebsiteTestimonial {
  id: string;
  customer_name: string;
  customer_position?: string;
  customer_company?: string;
  content: string;
  rating?: number;
  avatar_url?: string;
  is_active: boolean;
  display_order?: number;
  created_at: Date;
  updated_at: Date;
}

export interface WebsiteContactRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: 'new' | 'in_progress' | 'responded' | 'closed';
  response?: string;
  responded_by?: string;
  responded_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface WebsiteJobPosition {
  id: string;
  title: string;
  slug: string;
  department?: string;
  location?: string;
  job_type?: 'full_time' | 'part_time' | 'contract' | 'internship';
  description?: string;
  requirements?: string;
  benefits?: string;
  salary_range?: string;
  is_active: boolean;
  application_deadline?: Date;
  publish_date?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface WebsiteJobApplication {
  id: string;
  job_position_id: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone?: string;
  resume_url?: string;
  cover_letter?: string;
  status: 'received' | 'reviewing' | 'interview' | 'rejected' | 'accepted';
  notes?: string;
  created_at: Date;
  updated_at: Date;
  // Relations (optional)
  job_position?: WebsiteJobPosition;
} 