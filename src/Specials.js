import React from 'react';
import './Specials.css';

function Specials() {
    return (
        <main>
            <section id="specials">
                <div className="specials-header">
                    <h1>Week Specials!</h1>
                    <button className="menu-btn">Online Menu</button>
                </div>
                <div className="cards">
                    <Card 
                        image src="greek salad.jpg" 
                        title="Special 1" 
                        description="A delicious dish that you'll love!" 
                    />
                    <Card 
                        image="images.jpg" 
                        title="Special 2" 
                        description="Perfectly crafted for you!" 
                    />
                    <Card 
                        image="special3.jpg" 
                        title="Special 3" 
                        description="A delightful experience awaits!" 
                    />
                </div>
            </section>
        </main>
    );
}

function Card({ image, title, description }) {
    return (
        <div className="card">
            <img src={image} alt={title} />
            <h3>{title}</h3>
            <p>{description}</p>
            <a href="#">See More</a>
        </div>
    );
}

export default Specials;
