import React from "react";
import "./JobCard.css";
import type { Job } from "../../Types/Job";
import EditIcon from "../Icons/EditIcon";
import DeleteIcon from "../Icons/DeleteIcon";


interface JobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (id: number) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onEdit, onDelete }) => {
  const getStatusClass = (status: Job["status"]) => {
    switch (status) {
      case "Applied":
        return "status-applied";
      case "Interviewed":
        return "status-interviewed";
      case "Rejected":
        return "status-rejected";
      case "Offer":
        return "status-offer";
      case "Accepted":
        return "status-accepted";
      default:
        return "status-applied";
    }
  };

  const handleEditClick = () => {
    onEdit(job);
  };

  const handleDeleteClick = () => {
    if (window.confirm(`Are you sure you want to delete the application for ${job.position} at ${job.company}?`)) {
      onDelete(job.id);
    }
  };

  return (
    <div className="jobcard-container">
      <div className="jobcard-header">
        <h3 className="jobcard-position">{job.position}</h3>
        <p className="jobcard-company">{job.company}</p>
        <span className={`jobcard-status ${getStatusClass(job.status)}`}>
          {job.status}
        </span>
      </div>
      <div className="jobcard-actions">
        <button
          onClick={handleEditClick}
          className="jobcard-btn-edit"
          aria-label={`Edit ${job.position} application`}
        >
          <EditIcon />
        </button>
        <button
          onClick={handleDeleteClick}
          className="jobcard-btn-delete"
          aria-label={`Delete ${job.position} application`}
        >
          <DeleteIcon />
        </button>
      </div>
    </div>
  );
};

export default JobCard;