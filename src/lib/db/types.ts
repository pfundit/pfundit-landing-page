export type JobCategory = 'Leadership' | 'Technology' | 'Business';

export type JobRecord = {
  id: string;
  title: string;
  type: string;
  category: JobCategory;
  tags: string[];
  description?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type JobApplicationRecord = {
  id: string;
  role: string;
  category?: string;
  type?: string;
  name: string;
  email: string;
  linkedin?: string;
  resumeName?: string;
  resumeUrl?: string;
  resumeLink?: string;
  whyPfundit: string;
  createdAt: string;
  status: 'new';
};

export type ContactSubmissionRecord = {
  id: string;
  name: string;
  email: string;
  company?: string;
  subject?: string;
  message: string;
  createdAt: string;
  status: 'new';
};
