import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Styles.css';
import logopic from '../src/Logo.svg'
import headerpic from '../src/restauranfood.jpg'

const Header = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header>
      <nav className="nav-bar">
        <div className="nav-container">
          <div className="logo-container">
            <img src={logopic} alt="Little Lemon" className="logo" />
            {/* <img src={logopic} alt="Little Lemon" className="logo" /> */}
          </div>
          <div className="nav-links">
            <a onClick={() => window.scrollTo(0, 0)} className="nav-link">Home</a>
            <a onClick={() => scrollToSection('about')} className="nav-link">About</a>
            <a onClick={() => scrollToSection('menu')} className="nav-link">Menu</a>
            <a href="/reservations" className="nav-link">Reservations</a>
            <a href="/order" className="nav-link">Order Online</a>
            <a href="/login" className="nav-link">Login</a>
          </div>
        </div>
      </nav>
      
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Little Lemon</h1>
            <h2 className="hero-subtitle">Chicago</h2>
            <p className="hero-description">
              We are a family owned Mediterranean restaurant, focused on traditional 
              recipes served with a modern twist.
            </p>
            <button className="button">Reserve a Table</button>
          </div>
          <div className="hero-image">
            <img src={headerpic} alt="Featured dish" />
          </div>
        </div>
      </section>
    </header>
  );
};

export default Header;