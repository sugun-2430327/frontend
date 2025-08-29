import React, { useState } from "react";
import "./Home.css";
import Footer from "../../../shared/components/Footer";
 
const Button = ({ children, onClick, className = "" }) => (
  <button onClick={onClick} className={`btn ${className}`}>
    {children}
  </button>
);
 
const FeatureCard = ({ icon, title, description }) => (
  <div className="feature-card">
    <div className="icon-container">{icon}</div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);
 
const AccordionItem = ({ title, content, isOpen, onClick }) => (
  <div className="accordion-item">
    <button className="accordion-title" onClick={onClick}>
      <span>{title}</span>
      <span className={`accordion-icon ${isOpen ? "open" : ""}`}>&#9660;</span>
    </button>
    {isOpen && <div className="accordion-content">{content}</div>}
  </div>
);
 
const Home = () => {
  const [quote, setQuote] = useState(0);
  const [formStep, setFormStep] = useState(1);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    vehicle: "",
    age: "",
    coverage: "standard",
  });
  const [openFAQ, setOpenFAQ] = useState(null);
 
 
 
  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };
 
  const faqs = [
    {
      title: "Can I insure more than one vehicle?",
      content:
        "Yes, you can add and manage multiple vehicles under one account.",
    },
    {
      title: "How do I file a claim?",
      content:
        "Log in, go to “Claims,” fill out the form, and submit your documents.",
    },
    {
      title: "Can I check my policy details anytime?",
      content:
        "Yes, just log in and go to the “My Policies” section..",
    },
  ];
 
  return (
    <div className="home-page-container">
      {/* Hero Section */}
      <header className="hero-section with-image">
        <div className="hero-content">
          <h1>Effortless Auto Insurance, Complete Peace of Mind</h1>
          <p className="subheadline">
            Your all-in-one platform for seamless automobile insurance tracking,
            claims, and customer care.
          </p>
        </div>
      </header>
 
      {/* Benefits Section */}
      <section className="section benefits-section">
        <div className="section-header">
          <h2>Why Choose Our System?</h2>
          <p>
            We're redefining auto insurance with technology and a customer-first
            approach.
          </p>
        </div>
        <div className="benefits-grid">
          <FeatureCard
            icon={
              <span role="img" aria-label="shield">
                🛡️
              </span>
            }
            title="Complete Protection"
            description="Tailor your coverage with a variety of options to fit your lifestyle and budget."
          />
          <FeatureCard
            icon={
              <span role="img" aria-label="clock">
                ⏳
              </span>
            }
            title="Instant Quotes"
            description="Get a quote in seconds, not days, with our smart and quick online calculator."
          />
          <FeatureCard
            icon={
              <span role="img" aria-label="phone">
                📞
              </span>
            }
            title="24/7 Support"
            description="Our dedicated support team is available around the clock to assist with claims and questions."
          />
          <FeatureCard
            icon={
              <span role="img" aria-label="smartphone">
                📱
              </span>
            }
            title="Easy Policy Management"
            description="Access your digital ID card, make payments, and manage claims from a single dashboard."
          />
        </div>
      </section>
 
      {/* FAQ Section */}
      <section className="section faq-section">
        <div className="section-header">
          <h2>Frequently Asked Questions</h2>
          <p>Got questions? We've got answers.</p>
        </div>
        <div className="accordion-container">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              title={faq.title}
              content={faq.content}
              isOpen={openFAQ === index}
              onClick={() => toggleFAQ(index)}
            />
          ))}
        </div>
      </section>
 
      <Footer />
    </div>
  );
};
 
export default Home;
 