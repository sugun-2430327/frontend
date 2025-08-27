import React, { useState } from 'react';
import './Home.css';
import Footer from "../../../shared/components/Footer";

const Button = ({ children, onClick, className = '' }) => (
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
      <span className={`accordion-icon ${isOpen ? 'open' : ''}`}>&#9660;</span>
    </button>
    {isOpen && <div className="accordion-content">{content}</div>}
  </div>
);

const Home= () => {
  const [quote, setQuote] = useState(0);
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    vehicle: '',
    age: '',
    coverage: 'standard'
  });
  const [openFAQ, setOpenFAQ] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    setFormStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setFormStep((prev) => prev - 1);
  };

  const handleCalculateQuote = () => {
  let basePrice = 4000; // Base price in INR

  if (formData.vehicle.toLowerCase().includes('suv')) basePrice += 1000;
  if (parseInt(formData.age, 10) < 25) basePrice += 2000;
  if (formData.coverage === 'premium') basePrice += 1500;

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
            <input type="text" name="vehicle" value={formData.vehicle} onChange={handleInputChange} style={{padding:"10px"}} placeholder="e.g., Sedan, SUV" />
            <Button onClick={handleNextStep}>Next</Button>
          </>
        );
      case 2:
        return (
          <>
            <label>Driver's Age</label>
            <input type="number" name="age" value={formData.age} onChange={handleInputChange} style={{padding:"10px"}} placeholder="Your age" />
            <div className="form-navigation">
              <Button onClick={handlePrevStep} className="secondary">Back</Button>
              <Button onClick={handleNextStep}>Next</Button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <label>Coverage Plan</label>
            <select name="coverage" value={formData.coverage} onChange={handleInputChange} style={{padding:"10px"}}>
              <option value="standard">Standard</option>
              <option value="plus">Plus</option>
              <option value="premium">Premium</option>
            </select>
            <div className="form-navigation">
              <Button onClick={handlePrevStep} className="secondary">Back</Button>
              <Button onClick={handleCalculateQuote}>Get Quote</Button>
            </div>
          </>
        );
      case 4:
        return (
          <div className="quote-result">
            <h3>Your Estimated Monthly Premium:</h3>
            <p className="price">₹{quote}</p>
            {/* <p>Ready to secure your policy?</p>
            <Button className="primary-cta">Protect My Car Now</Button> */}
          </div>
        );
      default:
        return null;
    }
  };

  // const testimonials = [
  //   { text: "Seamless process and great rates. I'm so glad I switched!", author: "Sarah M." },
  //   { text: "Quick, reliable, and user-friendly. Their support team is fantastic.", author: "John D." },
  //   { text: "My quote was instant, and the coverage options were perfectly clear.", author: "Mike L." }
  // ];

  const faqs = [
    { title: "How does the quote calculator work?", content: "Our calculator uses your vehicle and driver information to provide a real-time, personalized estimate based on our underwriting models." },
    { title: "What types of vehicles do you cover?", content: "We cover a wide range of vehicles, including sedans, SUVs, trucks, and electric vehicles. You can get a quote for any make and model." },
    { title: "Is the claim process really that simple?", content: "Yes! Our streamlined mobile app and web portal allow you to file a claim in just a few clicks, upload photos, and track its status from start to finish." }
  ];

  return (
    <div className="home-page-container">
      {/* Hero Section */}
      <header className="hero-section with-image">
        <div className="hero-content">
          <h1>Effortless Auto Insurance, Complete Peace of Mind</h1>
          <p className="subheadline">
            Your all-in-one platform for seamless automobile insurance tracking, claims, and customer care.
          </p>
          {/* <Button className="primary-cta animated-cta" onClick={() => window.location.href = '#quote-calculator'}>Get My Free Quote</Button> */}
        </div>
      </header>
      
      {/* Quote Calculator Section */}
      <section className="section quote-calculator-section" id="quote-calculator">
        <div className="section-header">
          <h2>Your Instant Premium Awaits</h2>
          <p>Tell us a bit about you and your car to get a personalized estimate.</p>
        </div>
        <div className="quote-form-card glassmorphism">
          <div className="progress-bar">
            <div className="progress" style={{ width: `${(formStep - 1) / 3 * 100}%` }}></div>
          </div>
          <div className="form-step-container">
            {renderFormStep()}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section benefits-section">
        <div className="section-header">
          <h2>Why Choose Our System?</h2>
          <p>We're redefining auto insurance with technology and a customer-first approach.</p>
        </div>
        <div className="benefits-grid">
          <FeatureCard icon={<span role="img" aria-label="shield">🛡️</span>} title="Complete Protection" description="Tailor your coverage with a variety of options to fit your lifestyle and budget." />
          <FeatureCard icon={<span role="img" aria-label="clock">⏳</span>} title="Instant Quotes" description="Get a quote in seconds, not days, with our smart and quick online calculator." />
          <FeatureCard icon={<span role="img" aria-label="phone">📞</span>} title="24/7 Support" description="Our dedicated support team is available around the clock to assist with claims and questions." />
          <FeatureCard icon={<span role="img" aria-label="smartphone">📱</span>} title="Easy Policy Management" description="Access your digital ID card, make payments, and manage claims from a single dashboard." />
        </div>
      </section>

      {/* How It Works Section */}
      {/* <section className="section how-it-works-section">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Securing your car is as easy as 1, 2, 3.</p>
        </div>
        <div className="how-it-works-steps">
          <div className="step-card">
            <span className="step-number">1</span>
            <h3>Get a Quote</h3>
            <p>Use our simple form to get a personalized quote in minutes.</p>
          </div>
          <div className="step-card">
            <span className="step-number">2</span>
            <h3>Choose a Plan</h3>
            <p>Select the perfect coverage plan and finalize your policy details online.</p>
          </div>
          <div className="step-card">
            <span className="step-number">3</span>
            <h3>Drive Protected</h3>
            <p>Download your digital ID card and enjoy the road with peace of mind.</p>
          </div>
        </div>
      </section> */}

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