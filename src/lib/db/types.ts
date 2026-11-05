export type JobCategory = 'Leadership' | 'Technology' | 'Business';

export type JobRecord = {
  id: string;
  title: string;
  type: string;
  category: JobCategory;
  tags: string[];
  description?: string;
  cardBlurb?: string;
  location?: string;
  jdUrl?: string;
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

export type NotificationSettingsRecord = {
  key: 'admin_notifications';
  recipientEmails: string[];
  updatedAt: string;
};

/** Dashboard areas an admin can be granted access to. `admins` = manage other admins (full control). */
export const ADMIN_PERMISSIONS = ['jobs', 'applications', 'investors', 'contacts', 'settings', 'admins'] as const;
export type AdminPermission = (typeof ADMIN_PERMISSIONS)[number];

export type AdminUserRecord = {
  id: string;
  username: string;
  name?: string;
  passwordHash: string;
  permissions: AdminPermission[];
  active: boolean;
  /** Bumped on password change / disable / permission change to invalidate existing sessions. */
  sessionVersion: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  lastLoginAt?: string;
  passwordChangedAt?: string;
};

/** Admin user as exposed to the dashboard (never includes the password hash). */
export type AdminPublic = {
  id: string;
  username: string;
  name: string;
  permissions: AdminPermission[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  lastLoginAt?: string;
  passwordChangedAt?: string;
};

/** @deprecated Legacy shared-password record. Migrated into `admins` on first run. */
export type AdminCredentialsRecord = {
  key: 'admin_credentials';
  usernames: string[];
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
};

export type InvestorType =
  | 'Institutional investor'
  | 'Accredited investor'
  | 'Professional investor (other jurisdiction)'
  | 'Other';

export type InvestorEnquiryRecord = {
  id: string;
  name: string;
  organisation: string;
  role: string;
  email: string;
  country: string;
  investorType: InvestorType | string;
  confirmed: boolean;
  createdAt: string;
  status: 'new';
};
