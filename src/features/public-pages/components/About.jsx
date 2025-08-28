import React from 'react';
import './About.css';
 
const About = () => {
  return (
    <div className="about-page-container">
      {/* Hero Section */}
      <section className="about-hero-section">
        <div className="about-hero-content">
          <h1>Redefining Auto Insurance for the Digital Age</h1>
          <p className="subheadline">
            We believe that managing your car insurance should be as simple as driving it.
          </p>
        </div>
      </section>
 
      {/* Mission Section */}
      <section className="section mission-section">
        <div className="mission-content">
          <h2>Our Mission</h2>
          <p>
            Our mission is to empower car owners by providing a seamless, transparent, and user-friendly platform to manage their insurance. We aim to take the stress out of paperwork and claims, offering peace of mind at your fingertips.
          </p>
          <p>
            We're building more than just an insurance system; we're building a trust-based relationship with our users, one simple click at a time.
          </p>
        </div>
        <div className="mission-visual">
          <img src="aboutpageimg.png" alt="Car insurance simplified" />
        </div>
      </section>
 
      {/* Values Section */}
      <section className="section values-section">
        <h2>Our Core Values</h2>
        <div className="values-grid">
          <div className="value-item">
            <span role="img" aria-label="trust">🤝</span>
            <h3>Transparency</h3>
            <p>We believe in honest and clear communication, with no hidden fees or confusing jargon.</p>
          </div>
          <div className="value-item">
            <span role="img" aria-label="innovation">💡</span>
            <h3>Innovation</h3>
            <p>We continuously innovate to provide a more efficient and smarter solution for our users.</p>
          </div>
          <div className="value-item">
            <span role="img" aria-label="service">❤️</span>
            <h3>Customer-Centricity</h3>
            <p>Our users are at the heart of every decision we make. Their satisfaction is our top priority.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
 
export default About;