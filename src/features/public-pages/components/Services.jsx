import React from "react";
import "./Services.css";
import { useNavigate } from "react-router-dom";
 
// Sample data for services
const servicesData = [
  {
    id: 1,
    icon: "🛡️",
    title: "Comprehensive Coverage",
    description:
      "Protect your vehicle against all types of damage, from accidents to natural disasters.",
  },
  {
    id: 2,
    icon: "🤝",
    title: "Liability Insurance",
    description:
      "Ensure you are financially protected in case you are at fault in an accident.",
  },
  {
    id: 3,
    icon: "👨‍🔧",
    title: "Roadside Assistance",
    description:
      "24/7 help for flat tires, dead batteries, or towing. We’ve got you covered.",
  },
  {
    id: 4,
    icon: "🏡",
    title: "Bundles & Discounts",
    description:
      "Save money by bundling your auto insurance with home or renters insurance.",
  },
  {
    id: 5,
    icon: "💰",
    title: "Customized Plans",
    description: "Build a policy that perfectly fits your needs and budget.",
  },
  {
    id: 6,
    icon: "📱",
    title: "24/7 Digital Claims",
    description:
      "File and track your claims easily through our mobile app or online portal.",
  },
];
 
const Services = () => {
  const navigate = useNavigate();
  return (
    <div className="services-page">
      <header className="section-header">
        <h2>Our Auto Insurance Services</h2>
        <p>
          We offer a comprehensive range of policies designed to protect you and
          your vehicle.
        </p>
      </header>
 
      <main className="services-container">
        {servicesData.map((service) => (
          <div className="service-card" key={service.id}>
            <div className="card-icon">{service.icon}</div>
            <h3 className="card-title">{service.title}</h3>
            <p className="card-description">{service.description}</p>
          </div>
        ))}
      </main>
 
      <section className="cta-section">
        <h3>Ready to find the right coverage?</h3>
        <p>Get a free, no-obligation quote in minutes.</p>
        <button className="cta-button" onClick={() =>navigate('/')}>Get a Quote Now</button>
      </section>
    </div>
  );
};
 
export default Services;