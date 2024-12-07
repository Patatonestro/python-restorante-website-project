import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Styles.css';
import food1 from '../src/greek salad.jpg';
import food2 from '../src/images.jpeg';
import food3  from '../src/lemon dessert.jpg';
import interior  from '../src/restaurant.jpg';
const SpecialCard = ({ title, price, description, image }) => (
  <div className="special-card">
    <img src={image} alt={title} className="card-image" />
    <div className="card-content">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
        <span className="card-price">${price}</span>
      </div>
      <p className="card-description">{description}</p>
      <button className="order-button">
        Order a delivery
        <span className="delivery-icon">🚲</span>
      </button>
    </div>
  </div>
);

const TestimonialCard = ({ rating, text, author }) => (
  <div className="testimonial-card">
    <div className="rating">
      {[...Array(rating)].map((_, i) => (
        <span key={i} className="star">★</span>
      ))}
    </div>
    <p className="testimonial-text">{text}</p>
    <p className="testimonial-author">{author}</p>
  </div>
);

const Main = () => {
  const specials = [
    {
      title: "Greek salad",
      price: 12.99,
      description: "The famous greek salad of crispy lettuce, peppers, olives and our Chicago style feta cheese, garnished with crunchy garlic and rosemary croutons.",
      image:food1
    },
    {
      title: "Bruschetta",
      price: 5.99,
      description: "Our bruschetta is made from grilled bread that has been smeared with garlic and seasoned with salt and olive oil.",
      image: food2
    },
    {
      title: "Lemon Dessert",
      price: 5.00,
      description: "This comes straight from grandma's recipe book, every last ingredient has been sourced and is as authentic as can be imagined.",
      image: food3
    }
  ];

  return (
    <main>
      <section id="menu" className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">This weeks specials!</h2>
            <button className="button">Online Menu</button>
          </div>
          <div className="cards-grid">
            {specials.map((special) => (
              <SpecialCard key={special.title} {...special} />
            ))}
          </div>
        </div>
      </section>

      <section className="section testimonials">
        <div className="container">
          <h2 className="section-title text-center">Testimonials</h2>
          <div className="cards-grid">
            <TestimonialCard rating={5} text="Amazing food and service!" author="John D." />
            <TestimonialCard rating={4} text="Great Mediterranean cuisine" author="Sarah M." />
            <TestimonialCard rating={5} text="Best restaurant in Chicago" author="Mike R." />
          </div>
        </div>
      </section>

      <section id="about" className="section about">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2 className="about-title">Little Lemon</h2>
              <h3 className="about-subtitle">Chicago</h3>
              <p className="about-description">
                Little Lemon is a family-owned Mediterranean restaurant, focused on traditional recipes served with a modern twist. 
                The restaurant was founded by two Italian brothers, driven by their passion for authentic Mediterranean cuisine and 
                their grandmother's ancient recipes.
              </p>
            </div>
            <div className="about-image">
              <img src={interior} alt="Restaurant interior" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};


export default Main;