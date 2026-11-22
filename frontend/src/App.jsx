import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import TutorRegistrationForm from './components/TutorRegistrationForm';
import TutorSearchForm from './components/TutorSearchForm';

function Header() {
  const location = useLocation();

  return (
    <header className="header" role="banner">
      <div className="header-content">
        <Link to="/" className="logo" aria-label="TutorNearMe Home">
          <span className="logo-icon">T</span>
          TutorNearMe
        </Link>
        <nav role="navigation" aria-label="Main navigation">
          <ul className="nav-links">
            <li>
              <Link
                to="/"
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              >
                Find Tutors
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`}
              >
                Register as Tutor
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-content">
        <p>TutorNearMe &copy; {new Date().getFullYear()} - Connecting students with local tutors</p>
        <p className="form-hint mt-1">Built with React + Spring Boot</p>
      </div>
    </footer>
  );
}

function HomePage() {
  return (
    <div className="app">
      <Header />
      <main className="main-content" role="main">
        <div className="page-header">
          <h1 className="page-title">Find Local Tutors</h1>
          <p className="page-subtitle">Search for qualified tutors in your area</p>
        </div>
        <TutorSearchForm />
      </main>
      <Footer />
    </div>
  );
}

function RegisterPage() {
  return (
    <div className="app">
      <Header />
      <main className="main-content" role="main">
        <div className="page-header">
          <h1 className="page-title">Register as a Tutor</h1>
          <p className="page-subtitle">Create your tutor profile and start teaching</p>
        </div>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <TutorRegistrationForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}

export default App;