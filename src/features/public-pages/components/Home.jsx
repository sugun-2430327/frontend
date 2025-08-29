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
 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };
 
  const handleNextStep = () => {
    setError("");
 
    if (formStep === 1) {
      if (!formData.vehicle.trim()) {
        setError("Please enter a valid vehicle type.");
        return;
      }
    }
 
    if (formStep === 2) {
      const age = parseInt(formData.age, 10);
      if ( age < 18) {
        setError("You must be at least 18 years old to proceed.");
        return;
      }
      if(!age){
        setError("please fill this field");
        return;
      }
    }
 
    setFormStep((prev) => prev + 1);
  };
 
  const handlePrevStep = () => {
    setError("");
    setFormStep((prev) => prev - 1);
  };
 
  const handleCalculateQuote = () => {
    let basePrice = 4000;
    const age = parseInt(formData.age, 10);
 
    setError("");
 
    if (!formData.coverage) {
      setError("Please select a coverage plan.");
      return;
    }
 
    if (!age || isNaN(age) || age < 18) {
      setError("You must be older than 18 to receive a quote.");
      return;
    }
 
    if (formData.vehicle.toLowerCase().includes("suv")) basePrice += 1000;
    if (age < 25) basePrice += 2000;
 
    switch (formData.coverage) {
      case "standard":
        basePrice += 1000;
        break;
      case "plus":
        basePrice += 2000;
        break;
      case "premium":
        basePrice += 3000;
        break;
      default:
        setError("Invalid coverage type selected.");
        return;
    }
 
    setQuote(basePrice);
    setFormStep(4);
  };
 
  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };
 
  const renderFormStep = () => {
    switch (formStep) {
      case 1:
        return (
          <>
            <label>Vehicle Type</label>
            <input
              type="text"
              name="vehicle"
              value={formData.vehicle}
              onChange={handleInputChange}
              style={{ padding: "10px" }}
              placeholder="e.g., Sedan, SUV"
            />
            {error && (
              <div style={{ color: "red", marginTop: "8px" }}>{error}</div>
            )}
            <Button onClick={handleNextStep}>Next</Button>
          </>
        );
      case 2:
        return (
          <>
            <label>Driver's Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              style={{ padding: "10px" }}
              placeholder="Your age"
              required
            />
            {error && (
              <div style={{ color: "red", marginTop: "8px" }}>{error}</div>
            )}
            <div className="form-navigation">
              <Button onClick={handlePrevStep} className="secondary">
                Back
              </Button>
              <Button onClick={handleNextStep}>Next</Button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <label>Coverage Plan</label>
            <select
              name="coverage"
              value={formData.coverage}
              onChange={handleInputChange}
              style={{ padding: "10px" }}
            >
              <option value="standard">Standard</option>
              <option value="plus">Plus</option>
              <option value="premium">Premium</option>
            </select>
            {error && (
              <div style={{ color: "red", marginTop: "8px" }}>{error}</div>
            )}
            <div className="form-navigation">
              <Button onClick={handlePrevStep} className="secondary">
                Back
              </Button>
              <Button onClick={handleCalculateQuote}>Get Premium</Button>
            </div>
          </>
        );
      case 4:
        return (
          <div className="quote-result">
            <h3>Your Estimated Monthly Premium:</h3>
            <p className="price">₹{quote}</p>
          </div>
        );
      default:
        return null;
    }
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
 