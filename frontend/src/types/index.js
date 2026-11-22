/**
 * @typedef {Object} Tutor
 * @property {number} id
 * @property {string} name
 * @property {string} subject
 * @property {string} location
 * @property {number} rating
 * @property {string} availability
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} TutorRequest
 * @property {string} name
 * @property {string} subject
 * @property {string} location
 * @property {number} rating
 * @property {string} availability
 */

/**
 * @typedef {Object} SearchParams
 * @property {string} location
 * @property {string} [subject]
 * @property {number} [minRating]
 * @property {string} [availability]
 */

/**
 * @typedef {Object} FormErrors
 * @property {string} [name]
 * @property {string} [subject]
 * @property {string} [location]
 * @property {string} [rating]
 * @property {string} [availability]
 */

/**
 * @typedef {Object} ApiError
 * @property {string} message
 * @property {Object} [details]
 * @property {number} [status]
 */

// Subject options
export const SUBJECTS = [
  'Math',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'Programming',
  'Other'
];

// Availability options
export const AVAILABILITY_OPTIONS = [
  { value: 'WEEKDAYS', label: 'Weekdays' },
  { value: 'WEEKENDS', label: 'Weekends' },
  { value: 'FLEXIBLE', label: 'Flexible' },
  { value: 'ONLINE_ONLY', label: 'Online Only' }
];

// Default form values
export const DEFAULT_TUTOR_FORM = {
  name: '',
  subject: 'Math',
  location: '',
  rating: 4.5,
  availability: 'FLEXIBLE'
};

export const DEFAULT_SEARCH_FORM = {
  location: '',
  subject: 'All',
  minRating: '',
  availability: ''
};