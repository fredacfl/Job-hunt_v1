
export interface LinkedInProfile {
  name: string;
  role: string;
  url: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  experience: string;
  industry: string;
  source: 'LinkedIn' | '104' | '1111' | 'CakeResume' | 'Yourator' | 'Other';
  description: string;
  requirements: string[];
  postedAt: string;
  link: string;
  linkedInEmployees?: LinkedInProfile[];
  mentorAnalysis?: string;
  companyReviews?: string;
}

export interface SearchFilters {
  jobTitle: string;
  industries: string[];
  locations: string[];
  experienceLevels: string[];
}

export enum LoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}
