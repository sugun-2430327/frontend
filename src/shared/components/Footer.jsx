import React from 'react';
import './Footer.css';
 
const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-section footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/services">Our Services</a></li>
            <li><a href="/">Get Premium Estimation</a></li>
            <li><a href="/">FAQ</a></li>
          </ul>
        </div>
       
        <div className="footer-section footer-contact">
          <h3>Contact Us</h3>
          <p>Email: <a href="mailto:info@automile.com">insurance@secureshield.com</a></p>
          <p>Phone: +91 9756785414</p>
          <p>Address: 1-76/546 Raj Enclave, Shyamlal Street, Chennai</p>
        </div>
       
        <div className="footer-section footer-social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://facebook.com" aria-label="Facebook"><i className="fab fa-facebook"></i>Facebook</a><br/>
            <a href="https://twitter.com" aria-label="Twitter"><i className="fab fa-twitter"></i>X</a><br/>
            <a href="https://linkedin.com" aria-label="LinkedIn"><i className="fab fa-linkedin"></i>Linkedin</a>
          </div>
        </div>
      </div>
     
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} SecureShield Insurance. All rights reserved.</p>
        <div className="legal-links">
          <a href="/privacy-policy">Privacy Policy</a> | <a href="/terms-of-service">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};
 
export default Footer;
 