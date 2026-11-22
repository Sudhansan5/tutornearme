import React, { useState } from 'react';
import { tutorApi } from '../services/api';
import { SUBJECTS, AVAILABILITY_OPTIONS, DEFAULT_TUTOR_FORM } from '../types';

export default function TutorRegistrationForm() {
  const [formData, setFormData] = useState(DEFAULT_TUTOR_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null
  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Name must be less than 100 characters';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    } else if (formData.location.trim().length < 2) {
      newErrors.location = 'Location must be at least 2 characters';
    } else if (formData.location.trim().length > 100) {
      newErrors.location = 'Location must be less than 100 characters';
    }

    if (formData.rating < 0 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 0 and 5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const newValue = type === 'number' ? parseFloat(value) : value;
    setFormData(prev => ({ ...prev, [name]: newValue }));
    // Clear error for this field on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    setErrorMessage('');

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await tutorApi.register({
        name: formData.name.trim(),
        subject: formData.subject.trim(),
        location: formData.location.trim(),
        rating: formData.rating,
        availability: formData.availability
      });
      setSubmitStatus('success');
      setFormData(DEFAULT_TUTOR_FORM); // Reset form
    } catch (error) {
      setSubmitStatus('error');
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else if (error.response?.data?.details) {
        // Validation errors from backend
        const details = error.response.data.details;
        setErrors(prev => ({ ...prev, ...details }));
        setErrorMessage('Please fix the errors below');
      } else {
        setErrorMessage('Failed to register tutor. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingChange = (value) => {
    setFormData(prev => ({ ...prev, rating: value }));
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Register as a Tutor</h2>
      </div>
      <div className="card-body">
        {submitStatus === 'success' && (
          <div className="alert alert-success" role="alert">
            <svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            <span>Tutor registered successfully! You can now search for tutors.</span>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="alert alert-error" role="alert">
            <svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-2">
            <div className="form-group">
              <label htmlFor="name" className="form-label">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                placeholder="e.g., Jane Smith"
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
                aria-invalid={errors.name ? 'true' : 'false'}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p id="name-error" className="form-error" role="alert">{errors.name}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="subject" className="form-label">Subject *</label>
              <select
                id="subject"
                name="subject"
                className="form-select"
                value={formData.subject}
                onChange={handleChange}
                disabled={isSubmitting}
                aria-invalid={errors.subject ? 'true' : 'false'}
                aria-describedby={errors.subject ? 'subject-error' : undefined}
              >
                {SUBJECTS.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
              {errors.subject && (
                <p id="subject-error" className="form-error" role="alert">{errors.subject}</p>
              )}
            </div>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label htmlFor="location" className="form-label">Location (City/Area) *</label>
              <input
                type="text"
                id="location"
                name="location"
                className="form-input"
                placeholder="e.g., San Francisco, CA"
                value={formData.location}
                onChange={handleChange}
                disabled={isSubmitting}
                aria-invalid={errors.location ? 'true' : 'false'}
                aria-describedby={errors.location ? 'location-error' : undefined}
              />
              {errors.location && (
                <p id="location-error" className="form-error" role="alert">{errors.location}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="rating" className="form-label">Rating (0.0 - 5.0)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input
                  type="range"
                  id="rating"
                  name="rating"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => handleRatingChange(parseFloat(e.target.value))}
                  disabled={isSubmitting}
                  style={{ flex: 1 }}
                  aria-label="Rating"
                />
                <span style={{ minWidth: '40px', fontWeight: 600, color: 'var(--primary-color)' }}>
                  {formData.rating.toFixed(1)}
                </span>
              </div>
              <p className="form-hint">Drag to set rating between 0.0 and 5.0</p>
              {errors.rating && (
                <p className="form-error" role="alert">{errors.rating}</p>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="availability" className="form-label">Availability</label>
            <select
              id="availability"
              name="availability"
              className="form-select"
              value={formData.availability}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              {AVAILABILITY_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="card-footer">
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="spinner" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="30" strokeDashoffset="30" strokeLinecap="round"/></svg>
                  Registering...
                </>
              ) : (
                'Register Tutor'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}