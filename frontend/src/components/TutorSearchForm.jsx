import React, { useState, useEffect } from 'react';
import { tutorApi } from '../services/api';
import { SUBJECTS, AVAILABILITY_OPTIONS, DEFAULT_SEARCH_FORM } from '../types';

export default function TutorSearchForm() {
  const [searchParams, setSearchParams] = useState(DEFAULT_SEARCH_FORM);
  const [tutors, setTutors] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchError('');
    setHasSearched(true);

    if (!searchParams.location.trim()) {
      setSearchError('Please enter a location to search');
      return;
    }

    setIsSearching(true);
    try {
      const results = await tutorApi.search({
        location: searchParams.location.trim(),
        subject: searchParams.subject,
        minRating: searchParams.minRating ? parseFloat(searchParams.minRating) : undefined,
        availability: searchParams.availability
      });
      setTutors(results);
    } catch (error) {
      setSearchError('Failed to search tutors. Please try again.');
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClear = () => {
    setSearchParams(DEFAULT_SEARCH_FORM);
    setTutors([]);
    setHasSearched(false);
    setSearchError('');
  };

  // Render tutor card
  const renderTutorCard = (tutor) => (
    <div key={tutor.id} className="card tutor-card">
      <div className="tutor-card-header">
        <h3 className="tutor-name">{tutor.name}</h3>
        <div className="tutor-rating">
          <svg fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
          {tutor.rating.toFixed(1)}
        </div>
      </div>

      <div className="tutor-details">
        <div className="tutor-detail">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/></svg>
          <span>{tutor.location}</span>
        </div>
        <div className="tutor-detail">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253v-13L12 6.253z"/></svg>
          <span>{tutor.subject}</span>
        </div>
      </div>

      <span className="tutor-availability">{tutor.availability.replace('_', ' ')}</span>
    </div>
  );

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Find Tutors Near You</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSearch} noValidate>
            <div className="grid grid-2" style={{ marginBottom: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="search-location" className="form-label">Location *</label>
                <input
                  type="text"
                  id="search-location"
                  name="location"
                  className="form-input"
                  placeholder="e.g., New York, NY"
                  value={searchParams.location}
                  onChange={handleChange}
                  disabled={isSearching}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="search-subject" className="form-label">Subject (Optional)</label>
                <select
                  id="search-subject"
                  name="subject"
                  className="form-select"
                  value={searchParams.subject}
                  onChange={handleChange}
                  disabled={isSearching}
                >
                  <option value="All">All Subjects</option>
                  {SUBJECTS.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-2" style={{ marginBottom: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="search-min-rating" className="form-label">Min Rating (Optional)</label>
                <input
                  type="number"
                  id="search-min-rating"
                  name="minRating"
                  className="form-input"
                  placeholder="e.g., 4.0"
                  value={searchParams.minRating}
                  onChange={handleChange}
                  min="0"
                  max="5"
                  step="0.1"
                  disabled={isSearching}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="search-availability" className="form-label">Availability (Optional)</label>
                <select
                  id="search-availability"
                  name="availability"
                  className="form-select"
                  value={searchParams.availability}
                  onChange={handleChange}
                  disabled={isSearching}
                >
                  <option value="">Any Availability</option>
                  {AVAILABILITY_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="btn btn-primary btn-lg flex-1"
                disabled={isSearching}
              >
                {isSearching ? (
                  <>
                    <svg className="spinner" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="30" strokeDashoffset="30" strokeLinecap="round"/></svg>
                    Searching...
                  </>
                ) : (
                  'Search Tutors'
                )}
              </button>
              {hasSearched && (
                <button
                  type="button"
                  className="btn btn-secondary btn-lg"
                  onClick={handleClear}
                  disabled={isSearching}
                >
                  Clear
                </button>
              )}
            </div>

            {searchError && (
              <div className="alert alert-error mt-3" role="alert">
                <svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
                <span>{searchError}</span>
              </div>
            )}
          </form>
        </div>
      </div>

      {hasSearched && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="card-title">
              {tutors.length > 0
                ? `Found ${tutors.length} tutor${tutors.length !== 1 ? 's' : ''}`
                : 'No tutors found'}
            </h3>
          </div>

          {tutors.length > 0 ? (
            <div className="search-results" role="list">
              {tutors.map(renderTutorCard)}
            </div>
          ) : (
            <div className="card no-results" role="status">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p>No tutors found matching your criteria.</p>
              <p className="form-hint mt-2">Try adjusting your search filters or search in a different location.</p>
            </div>
          )}
        </div>
      )}

      {!hasSearched && (
        <div className="card mt-4" style={{ background: 'var(--bg-secondary)' }}>
          <div className="card-body text-center" style={{ padding: '3rem' }}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '64px', height: '64px', color: 'var(--text-muted)', margin: '0 auto 1rem' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Start your search</h3>
            <p className="form-hint">Enter a location above to find tutors near you</p>
          </div>
        </div>
      )}
    </div>
  );
}