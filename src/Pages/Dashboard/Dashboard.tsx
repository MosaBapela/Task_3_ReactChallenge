import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../Context/AuthContext";
import JobForm from "../../Components/JobForm/JobForm";
import JobCard from "../../Components/JobCard/JobCard";
import SearchAndFilter from "../../Components/SearchAndFilter/SearchAndFilter";
import { jobService } from "../../Services/JobService";

import "./Dashboard.css";
import type { Job, JobFormData } from "../../Types/Job";

const Dashboard: React.FC = () => {
  const auth = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("dateAdded");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Load jobs when component mounts or user changes
  useEffect(() => {
    const loadJobs = async () => {
      if (auth.user && !auth.loading) {
        setLoading(true);
        setError(null);
        try {
          const userJobs = await jobService.getJobsForUser(auth.user.id);
          setJobs(userJobs);
        } catch (error) {
          console.error('Error loading jobs:', error);
          setError('Failed to load jobs. Please try again.');
          setJobs([]);
        } finally {
          setLoading(false);
        }
      } else if (!auth.loading) {
        setJobs([]);
        setLoading(false);
      }
    };

    loadJobs();
  }, [auth.user, auth.loading]);

  // Filter and sort jobs based on search term, status filter, and sort options
  const filteredAndSortedJobs = useMemo(() => {
    let filtered = jobs;

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(job => 
        job.company.toLowerCase().includes(searchLower) ||
        job.position.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter(job => job.status === statusFilter);
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "company":
          comparison = a.company.localeCompare(b.company);
          break;
        case "position":
          comparison = a.position.localeCompare(b.position);
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        case "dateAdded":
          // Sort by ID as a proxy for date added (assuming newer jobs have higher IDs)
          comparison = a.id - b.id;
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [jobs, searchTerm, statusFilter, sortBy, sortOrder]);

  const handleAddJob = async (jobData: JobFormData) => {
    if (!auth.user) return;

    try {
      setError(null);
      const newJob = await jobService.addJob(jobData, auth.user.id);
      setJobs(prevJobs => [...prevJobs, newJob]);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error adding job:', error);
      setError('Failed to add job. Please try again.');
    }
  };

  const handleUpdateJob = async (jobData: Job) => {
    if (!auth.user) return;

    try {
      setError(null);
      const updatedJob = await jobService.updateJob(jobData.id, {
        company: jobData.company,
        position: jobData.position,
        status: jobData.status
      });

      setJobs(prevJobs => 
        prevJobs.map(job => job.id === updatedJob.id ? updatedJob : job)
      );
      setEditingJob(null);
    } catch (error) {
      console.error('Error updating job:', error);
      setError('Failed to update job. Please try again.');
    }
  };

  const handleDeleteJob = async (jobId: number) => {
    if (!auth.user) return;

    try {
      setError(null);
      await jobService.deleteJob(jobId);
      setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
    } catch (error) {
      console.error('Error deleting job:', error);
      setError('Failed to delete job. Please try again.');
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

  if (auth.loading || loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-loading">Loading your jobs...</div>
      </div>
    );
  }

  const hasActiveFilters = searchTerm.trim() || statusFilter !== "All" || sortBy !== "dateAdded" || sortOrder !== "desc";

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

        {error && (
          <div className="dashboard-error">
            <p>{error}</p>
            <button onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}

        {/* Search and Filter Component */}
        {jobs.length > 0 && (
          <>
            <SearchAndFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
              sortOrder={sortOrder}
              onSortOrderChange={setSortOrder}
            />

            {/* Results Summary */}
            {(hasActiveFilters || filteredAndSortedJobs.length !== jobs.length) && (
              <div className="search-results-summary">
                <p>
                  Showing {filteredAndSortedJobs.length} of {jobs.length} job applications
                  {searchTerm && ` matching "${searchTerm}"`}
                  {statusFilter !== "All" && ` with status "${statusFilter}"`}
                </p>
              </div>
            )}
          </>
        )}

        {(isFormOpen || editingJob) && (
          <JobForm
            job={editingJob}
            onSave={handleSave}
            onCancel={handleCancelForm}
          />
        )}

        {jobs.length > 0 ? (
          filteredAndSortedJobs.length > 0 ? (
            <div className="dashboard-jobs-list">
              {filteredAndSortedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onEdit={handleEditJob}
                  onDelete={handleDeleteJob}
                />
              ))}
            </div>
          ) : (
            <div className="dashboard-no-results">
              <p>No jobs match your current search and filter criteria.</p>
              <p>Try adjusting your search term or filters to see more results.</p>
            </div>
          )
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