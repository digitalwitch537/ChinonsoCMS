
import type { LucideIcon } from 'lucide-react';

export interface Service {
  id: string; // Should be unique, can be derived from slug/filename by Decap
  name: string;
  description: string;
  price: string;
  iconName?: string; 
  details?: string[];
  slug?: string; // Optional, can be used for filename by Decap
}

export interface BlogPost {
  id: string; // Can be derived from slug by Decap, or explicit
  slug: string;
  title: string;
  date: string; // Should be YYYY-MM-DD
  author: string;
  excerpt: string;
  content: string; // Markdown content
  htmlContent?: string; // Processed HTML content for rendering
  imageUrl?: string;
  imageDataUri?: string;
  tags?: string[];
}

export interface Project {
  id: string; // Can be derived from slug by Decap, or explicit
  slug?: string; // Optional, can be used for filename by Decap
  title: string;
  description: string; // Markdown content
  imageUrl?: string;
  imageDataUri?: string;
  client?: string;
  dateCompleted?: string; // Should be YYYY-MM-DD
  technologies?: string[];
  liveLink?: string;
}

export interface NavItem {
  href: string;
  label: string;
  icon?: LucideIcon;
}

export interface HomepageContent {
  professionalPhotoUrl?: string;
  imageDataUri?: string;
  bio: string; // Markdown content
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  businessHours?: string; // Markdown content for flexibility
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string; // ISO date string
  recipientEmail: string; 
}
