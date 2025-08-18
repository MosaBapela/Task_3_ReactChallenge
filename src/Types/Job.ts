export interface Job {
  id: number;
  company: string;
  position: string;
  status: "Applied" | "Interviewed" | "Rejected" | "Offer" | "Accepted";
  userId: number;
  dateAdded?: string; // ISO date string
}

export interface JobFormData {
  company: string;
  position: string;
  status: "Applied" | "Interviewed" | "Rejected" | "Offer" | "Accepted";
}

export interface JobUpdateData {
  company: string;
  position: string;
  status: "Applied" | "Interviewed" | "Rejected" | "Offer" | "Accepted";
}

export type JobStatus = Job["status"];

export interface JobFilterOptions {
  searchTerm: string;
  statusFilter: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}