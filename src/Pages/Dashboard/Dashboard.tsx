import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import JobForm from "../../Components/JobForm/JobForm";
import JobCard from "../../Components/JobCard/JobCard";

import "./Dashboard.css";
import type { Job, JobFormData } from "../../Types/Job";
import { jobStorageService } from "../../Types/JobStorageService";

const Dashboard: React.FC = () => {
  const auth = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  // Load jobs when component mounts or user changes
  useEffect(() => {
    if (auth.user) {
      setLoading(true);
      try {
        const userJobs = jobStorageService.getJobsForUser(auth.user.username);
        setJobs(userJobs);
      } catch (error) {
        console.error('Error loading jobs:', error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    } else {
      setJobs([]);
      setLoading(false);
    }
  }, [auth.user]);

  const handleAddJob = (jobData: JobFormData) => {
    if (!auth.user) return;

    try {
      const newJob = jobStorageService.addJob(jobData, auth.user.username);
      setJobs(prevJobs => [...prevJobs, newJob]);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error adding job:', error);
    }
  };

  const handleUpdateJob = (jobData: Job) => {
    if (!auth.user) return;

    try {
      const updatedJob = jobStorageService.updateJob(
        jobData.id, 
        {
          company: jobData.company,
          position: jobData.position,
          status: jobData.status
        }, 
        auth.user.username
      );

      if (updatedJob) {
        setJobs(prevJobs => 
          prevJobs.map(job => job.id === updatedJob.id ? updatedJob : job)
        );
      }
      setEditingJob(null);
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  const handleDeleteJob = (jobId: number) => {
    if (!auth.user) return;

    try {
      const success = jobStorageService.deleteJob(jobId, auth.user.username);
      if (success) {
        setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
      }
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const handleSave = (jobData: JobFormData | Job) => {
    if (editingJob) {
      handleUpdateJob(jobData as Job);
    } else {
      handleAddJob(jobData as JobFormData);
    }
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setIsFormOpen(false);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingJob(null);
  };

  const handleOpenAddForm = () => {
    setEditingJob(null);
    setIsFormOpen(true);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-loading">Loading your jobs...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-inner">
        <div className="dashboard-header">
          <h1>Your Job Applications</h1>
          <button
            onClick={handleOpenAddForm}
            className="btn-add-job"
          >
            <span className="plus-icon" aria-hidden="true">+</span>
            Add New Job
          </button>
        </div>

        {(isFormOpen || editingJob) && (
          <JobForm
            job={editingJob}
            onSave={handleSave}
            onCancel={handleCancelForm}
          />
        )}

        {jobs.length > 0 ? (
          <div className="dashboard-jobs-list">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onEdit={handleEditJob}
                onDelete={handleDeleteJob}
              />
            ))}
          </div>
        ) : (
          <div className="dashboard-no-jobs">
            <p>You haven't added any job applications yet.</p>
            <p>Click "Add New Job" to get started tracking your applications!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;