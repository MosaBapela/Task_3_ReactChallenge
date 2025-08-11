import type { Job, JobFormData } from "./Job";


const JOBS_STORAGE_KEY = 'job_tracker_jobs';

class JobStorageService {
  // Get all jobs from localStorage
  private getAllJobs(): Job[] {
    try {
      const jobs = localStorage.getItem(JOBS_STORAGE_KEY);
      return jobs ? JSON.parse(jobs) : [];
    } catch (error) {
      console.error('Error parsing jobs from localStorage:', error);
      return [];
    }
  }

  // Save all jobs to localStorage
  private saveAllJobs(jobs: Job[]): void {
    try {
      localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs));
    } catch (error) {
      console.error('Error saving jobs to localStorage:', error);
    }
  }

  // Get jobs for a specific user
  getJobsForUser(userId: string): Job[] {
    const allJobs = this.getAllJobs();
    return allJobs.filter(job => job.userId === userId);
  }

  // Add a new job
  addJob(jobData: JobFormData, userId: string): Job {
    const allJobs = this.getAllJobs();
    const newId = allJobs.length > 0 ? Math.max(...allJobs.map(j => j.id)) + 1 : 1;
    
    const newJob: Job = {
      ...jobData,
      id: newId,
      userId,
      createdAt: new Date().toISOString()
    };
    
    allJobs.push(newJob);
    this.saveAllJobs(allJobs);
    
    return newJob;
  }

  // Update an existing job
  updateJob(jobId: number, jobData: JobFormData, userId: string): Job | null {
    const allJobs = this.getAllJobs();
    const jobIndex = allJobs.findIndex(j => j.id === jobId && j.userId === userId);
    
    if (jobIndex === -1) {
      return null; // Job not found or doesn't belong to user
    }
    
    const updatedJob: Job = {
      ...allJobs[jobIndex],
      ...jobData
    };
    
    allJobs[jobIndex] = updatedJob;
    this.saveAllJobs(allJobs);
    
    return updatedJob;
  }

  // Delete a job
  deleteJob(jobId: number, userId: string): boolean {
    const allJobs = this.getAllJobs();
    const jobIndex = allJobs.findIndex(j => j.id === jobId && j.userId === userId);
    
    if (jobIndex === -1) {
      return false; // Job not found or doesn't belong to user
    }
    
    allJobs.splice(jobIndex, 1);
    this.saveAllJobs(allJobs);
    
    return true;
  }

  // Clear all jobs for a user (useful for testing or user data cleanup)
  clearUserJobs(userId: string): void {
    const allJobs = this.getAllJobs();
    const filteredJobs = allJobs.filter(job => job.userId !== userId);
    this.saveAllJobs(filteredJobs);
  }
}

// Export a singleton instance
export const jobStorageService = new JobStorageService();