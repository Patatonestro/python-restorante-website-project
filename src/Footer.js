import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Styles.css';
import endlogo  from '../src/endlogo.png';
const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-section">
            <img src={endlogo} alt="Little Lemon" className="footer-logo" />
            {/* <img src={endlogo} alt="Little Lemon" className="footer-logo" /> */}
            <p className="footer-description">
              Bringing Mediterranean flavors to Chicago since 2023
            </p>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-heading">Navigation</h3>
            <ul className="footer-list">
              <li><a href="/" className="footer-link">Home</a></li>
              <li><a href="#about" className="footer-link">About</a></li>
              <li><a href="#menu" className="footer-link">Menu</a></li>
              <li><a href="/reservations" className="footer-link">Reservations</a></li>
              <li><a href="/order" className="footer-link">Order Online</a></li>
              <li><a href="/login" className="footer-link">Login</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-heading">Contact</h3>
            <ul className="footer-list">
              <li>123 Food Street</li>
              <li>Chicago, IL 60601</li>
              <li>312-555-0123</li>
              <li>info@littlelemon.com</li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-heading">Social Media</h3>
            <ul className="footer-list">
              <li><a href="#" className="footer-link">Facebook</a></li>
              <li><a href="#" className="footer-link">Instagram</a></li>
              <li><a href="#" className="footer-link">Twitter</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};



export default Footer;