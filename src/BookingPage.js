import React from 'react';
import { useNavigate } from 'react-router-dom';
import BookingForm from './BookingForm';
import style from './BookingPage.css';

function BookingPage() {
  const navigate = useNavigate();
  const submitAPI = function(formData) {
    return true;
  };
  const submitForm = (formData) => {
    const success = submitAPI(formData);
    if (success) {
      navigate('/confirmed');
    }
    return success;
  };

  return (
    <div className="booking-page">
      <div className="container">
        <h1>Reserve a Table</h1>
        <BookingForm submitForm={submitForm} />
      </div>
    </div>
  );
}

export default BookingPage;