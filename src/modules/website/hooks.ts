import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as websiteServices from './services';
import {
  WebsiteInfo,
  WebsitePage,
  WebsiteBanner,
  WebsiteBlogCategory,
  WebsiteBlogPost,
  WebsiteCustomer,
  WebsiteTestimonial,
  WebsiteContactRequest,
  WebsiteJobPosition,
  WebsiteJobApplication
} from './types';

// Website Info Hooks
export const useWebsiteInfo = () => {
  return useQuery({
    queryKey: ['website', 'info'],
    queryFn: websiteServices.getWebsiteInfo
  });
};

export const useUpdateWebsiteInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (info: Partial<WebsiteInfo>) => websiteServices.updateWebsiteInfo(info),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website', 'info'] });
    }
  });
};

// Website Pages Hooks
export const useWebsitePages = (isPublished?: boolean) => {
  return useQuery({
    queryKey: ['website', 'pages', { isPublished }],
    queryFn: () => websiteServices.getWebsitePages(isPublished)
  });
};

export const useWebsitePageBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['website', 'page', slug],
    queryFn: () => websiteServices.getWebsitePageBySlug(slug),
    enabled: !!slug
  });
};

export const useCreateWebsitePage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (page: Omit<WebsitePage, 'id' | 'created_at' | 'updated_at'>) => 
      websiteServices.createWebsitePage(page),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website', 'pages'] });
    }
  });
};

export const useUpdateWebsitePage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, page }: { id: string, page: Partial<WebsitePage> }) => 
      websiteServices.updateWebsitePage(id, page),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['website', 'pages'] });
      queryClient.invalidateQueries({ queryKey: ['website', 'page', variables.page.slug] });
    }
  });
};

export const useDeleteWebsitePage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => websiteServices.deleteWebsitePage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website', 'pages'] });
    }
  });
};

// Website Banners Hooks
export const useActiveBanners = () => {
  return useQuery({
    queryKey: ['website', 'banners', 'active'],
    queryFn: websiteServices.getActiveBanners
  });
};

export const useAllBanners = () => {
  return useQuery({
    queryKey: ['website', 'banners', 'all'],
    queryFn: websiteServices.getAllBanners
  });
};

export const useCreateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (banner: Omit<WebsiteBanner, 'id' | 'created_at' | 'updated_at'>) => 
      websiteServices.createBanner(banner),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website', 'banners'] });
    }
  });
};

export const useUpdateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, banner }: { id: string, banner: Partial<WebsiteBanner> }) => 
      websiteServices.updateBanner(id, banner),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website', 'banners'] });
    }
  });
};

export const useDeleteBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => websiteServices.deleteBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website', 'banners'] });
    }
  });
};

// Blog Categories Hooks
export const useBlogCategories = () => {
  return useQuery({
    queryKey: ['website', 'blog', 'categories'],
    queryFn: websiteServices.getBlogCategories
  });
};

// Blog Posts Hooks
export const usePublishedBlogPosts = (limit?: number, categoryId?: string) => {
  return useQuery({
    queryKey: ['website', 'blog', 'posts', 'published', { limit, categoryId }],
    queryFn: () => websiteServices.getPublishedBlogPosts(limit, categoryId)
  });
};

export const useBlogPostBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['website', 'blog', 'post', slug],
    queryFn: () => websiteServices.getBlogPostBySlug(slug),
    enabled: !!slug
  });
};

// Customers Hooks
export const useActiveCustomers = () => {
  return useQuery({
    queryKey: ['website', 'customers', 'active'],
    queryFn: websiteServices.getActiveCustomers
  });
};

// Testimonials Hooks
export const useActiveTestimonials = () => {
  return useQuery({
    queryKey: ['website', 'testimonials', 'active'],
    queryFn: websiteServices.getActiveTestimonials
  });
};

// Contact Requests Hooks
export const useSubmitContactRequest = () => {
  return useMutation({
    mutationFn: (contact: Omit<WebsiteContactRequest, 'id' | 'status' | 'created_at' | 'updated_at'>) => 
      websiteServices.submitContactRequest(contact)
  });
};

// Job Positions Hooks
export const useActiveJobPositions = () => {
  return useQuery({
    queryKey: ['website', 'jobs', 'active'],
    queryFn: websiteServices.getActiveJobPositions
  });
};

export const useJobPositionBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['website', 'job', slug],
    queryFn: () => websiteServices.getJobPositionBySlug(slug),
    enabled: !!slug
  });
};

// Job Applications Hooks
export const useSubmitJobApplication = () => {
  return useMutation({
    mutationFn: (application: Omit<WebsiteJobApplication, 'id' | 'status' | 'created_at' | 'updated_at'>) => 
      websiteServices.submitJobApplication(application)
  });
}; 