import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Contact.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle form submission, e.g., send data to an API
    
    // For this example, we'll just show a success message
    setStatus('Message sent successfully!');
    setFormData({ name: '', email: '', subject: '', message: '' }); // Clear the form
  };

  return (
    <div className="contact-page-container">
      {/* Hero Section */}
      <section className="contact-hero-section">
        <div className="contact-hero-content">
          <h1>Get In Touch With Us</h1>
          <p className="subheadline">
            We're here to help! Whether you have questions about a policy, need support, or just want to say hello, we'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="section contact-main-section">
        <div className="contact-info-card">
          <h2>Our Contact Information</h2>
          <div className="info-item">
            {/* <span className="icon">📍</span> */}
            <h3>Our Office</h3>
            <p>123 Auto Street, Suite 456<br />Insurance City, IC 78901</p>
          </div>
          <div className="info-item">
            {/* <span className="icon">📞</span> */}
            <h3>Phone</h3>
            <p>+91 9756785414</p>
          </div>
          <div className="info-item">
            {/* <span className="icon">✉️</span> */}
            <h3>Email</h3>
            <p>insurance@secureshield.com</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;