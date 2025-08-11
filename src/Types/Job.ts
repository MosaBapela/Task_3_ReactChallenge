export interface Job {
  id: number;
  company: string;
  position: string;
  status: "Applied" | "Interviewed" | "Rejected" | "Offer" | "Accepted";
  userId: string; // Add userId to associate jobs with users
  createdAt: string; // Add timestamp for better data management
}

export type JobFormData = Omit<Job, "id" | "userId" | "createdAt">;