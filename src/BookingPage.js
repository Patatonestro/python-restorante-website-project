import React from 'react';
import BookingForm from './BookingForm';
import style from './BookingPage.css';
const BookingPage = () => {
  return (
    <div className="booking-page">
      <div className="container">
        <h1>Reserve a Table</h1>
        <BookingForm />
      </div>
    </div>
  );
};

export default BookingPage;