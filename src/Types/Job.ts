export interface Job {
  id: number;
  company: string;
  position: string;
  status: "Applied" | "Interviewed" | "Rejected" | "Offer" | "Accepted";
  userId: number;
  createdAt: string;
}

export type JobFormData = Omit<Job, "id" | "userId" | "createdAt">;