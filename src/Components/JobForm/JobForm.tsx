import React, { useState } from "react";
import "./JobForm.css";
import CloseIcon from "../Icons/CloseIcon";
import type { Job, JobFormData } from "../../Types/Job";


interface JobFormProps {
  job?: Job | null;
  onSave: (job: JobFormData | Job) => void;
  onCancel: () => void;
}

const statusOptions = ["Applied", "Interviewed", "Rejected", "Offer", "Accepted"] as const;

const JobForm: React.FC<JobFormProps> = ({ job, onSave, onCancel }) => {
  const [formData, setFormData] = useState<JobFormData>({
    company: job?.company || "",
    position: job?.position || "",
    status: job?.status || "Applied"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: value as any // Type assertion needed for status field
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.company.trim() || !formData.position.trim()) {
      return; // Basic validation
    }

    if (job) {
      // When editing, include the job id and other metadata
      onSave({ 
        ...job, 
        company: formData.company.trim(),
        position: formData.position.trim(),
        status: formData.status
      });
    } else {
      // When creating new job, just pass the form data
      onSave({
        company: formData.company.trim(),
        position: formData.position.trim(),
        status: formData.status
      });
    }
  };

  return (
    <div className="jobform-overlay">
      <div className="jobform-container">
        <button onClick={onCancel} className="jobform-close-btn" aria-label="Close form">
          <CloseIcon />
        </button>
        <h2 className="jobform-title">{job ? "Edit Job Application" : "Add New Job Application"}</h2>
        <form onSubmit={handleSubmit} className="jobform-form">
          <div className="jobform-field">
            <label htmlFor="company" className="jobform-label">
              Company
            </label>
            <input
              id="company"
              name="company"
              type="text"
              value={formData.company}
              onChange={handleChange}
              required
              className="jobform-input"
              placeholder="Enter company name"
            />
          </div>
          <div className="jobform-field">
            <label htmlFor="position" className="jobform-label">
              Position
            </label>
            <input
              id="position"
              name="position"
              type="text"
              value={formData.position}
              onChange={handleChange}
              required
              className="jobform-input"
              placeholder="Enter job position"
            />
          </div>
          <div className="jobform-field">
            <label htmlFor="status" className="jobform-label">
              Application Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="jobform-select"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="jobform-buttons">
            <button
              type="button"
              onClick={onCancel}
              className="jobform-btn-cancel"
            >
              Cancel
            </button>
            <button type="submit" className="jobform-btn-save">
              {job ? "Update" : "Save"} Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobForm;