import type { Job, JobFormData } from '../Types/Job';
import { apiService } from './ApiServices';

class JobService {
  private endpoint = '/jobs';

  async getJobsForUser(userId: number): Promise<Job[]> {
    try {
      return await apiService.get<Job[]>(`${this.endpoint}?userId=${userId}`);
    } catch (error) {
      console.error('Error fetching jobs for user:', error);
      return [];
    }
  }

  async addJob(jobData: JobFormData, userId: number): Promise<Job> {
    const newJobData = {
      ...jobData,
      userId,
      createdAt: new Date().toISOString()
    };
    
    return apiService.post<Job>(this.endpoint, newJobData);
  }

  async updateJob(jobId: number, jobData: JobFormData): Promise<Job> {
    return apiService.put<Job>(`${this.endpoint}/${jobId}`, jobData);
  }

  async deleteJob(jobId: number): Promise<void> {
    await apiService.delete(`${this.endpoint}/${jobId}`);
  }

  async getJobById(jobId: number): Promise<Job | null> {
    try {
      return await apiService.get<Job>(`${this.endpoint}/${jobId}`);
    } catch (error) {
      console.error('Error fetching job by ID:', error);
      return null;
    }
  }

  async clearUserJobs(userId: number): Promise<void> {
    try {
      const jobs = await this.getJobsForUser(userId);
      await Promise.all(jobs.map(job => this.deleteJob(job.id)));
    } catch (error) {
      console.error('Error clearing user jobs:', error);
    }
  }
}

export const jobService = new JobService();