import React from 'react';
import './About.css';

// const teamMembers = [
//   {
//     name: "Jane Doe",
//     title: "Co-founder & CEO",
//     bio: "Jane is a visionary leader with over 15 years in the insurance tech space. Her passion for simplifying complex processes is the driving force behind our platform.",
//     photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MDc1NTR8MHwxfHNlYXJjaHw0fHxmZW1hbGUlMjBwb3J0cmFpdHxlbnwwfHx8fDE3MjE1MDcxNjR8MA&ixlib=rb-4.0.3&q=80&w=400"
//   },
//   {
//     name: "John Smith",
//     title: "Co-founder & CTO",
//     bio: "John is a full-stack engineering expert. He's responsible for architecting the robust and secure platform that provides our users with a seamless experience.",
//     photo: "https://images.unsplash.com/photo-1564564321837-a1643c1a3641?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MDc1NTR8MHwxfHNlYXJjaHwxfHxtYWxlJTIwcG9ydHJhaXR8ZW58MHx8fHwxNzIxNTA3MTU5fDA&ixlib=rb-4.0.3&q=80&w=400"
//   },
//   {
//     name: "Sarah Lee",
//     title: "Head of Customer Success",
//     bio: "Sarah ensures our customers are always supported. Her empathy and dedication to service have built the foundation of our reliable customer success team.",
//     photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MDc1NTR8MHwxfHNlYXJjaHw1fHxmZW1hbGUlMjBwb3J0cmFpdHxlbnwwfHx8fDE3MjE1MDcxNjR8MA&ixlib=rb-4.0.3&q=80&w=400"
//   }
// ];

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

      {/* Team Section */}
      {/* <section className="section team-section">
        <h2>Meet the Team</h2>
        <p className="team-intro">
          We're a dedicated group of professionals passionate about technology, design, and customer service.
        </p>
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div className="team-member-card" key={index}>
              <img src={member.photo} alt={member.name} className="team-photo" />
              <h3>{member.name}</h3>
              <p className="member-title">{member.title}</p>
              <p className="member-bio">{member.bio}</p>
            </div>
          ))}
        </div>
      </section> */}

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

      {/* Final CTA Section */}
      {/* <section className="section contact-cta">
        <h2>Ready to Experience the Difference?</h2>
        <p>Join thousands of drivers who trust our platform for their insurance needs.</p>
        <button className="btn primary-cta">Get a Free Quote Now</button>
      </section> */}
    </div>
  );
};

export default About;