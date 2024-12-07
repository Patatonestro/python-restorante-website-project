import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const BookingForm = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '17:00',
    guests: 1,
    occasion: 'Birthday'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 验证表单
    if (!formData.date) {
      alert('Please select a date');
      return;
    }

    // 保存预订信息到 localStorage
    const existingReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    const newReservation = {
      id: Date.now(), // 用时间戳作为唯一ID
      ...formData,
      status: 'Confirmed'
    };
    localStorage.setItem('reservations', JSON.stringify([...existingReservations, newReservation]));

    // 显示成功弹窗
    setShowSuccess(true);
    
    // 3秒后返回主页
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  const handleCancel = () => {
    navigate('/'); // 返回主页
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  return (
    <>
      <form className="booking-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="date">Choose date</label>
          <input
            type="date"
            id="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="time">Choose time</label>
          <select
            id="time"
            value={formData.time}
            onChange={handleChange}
            required
          >
            <option>17:00</option>
            <option>18:00</option>
            <option>19:00</option>
            <option>20:00</option>
            <option>21:00</option>
            <option>22:00</option>
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="guests">Number of guests</label>
          <input
            type="number"
            id="guests"
            min="1"
            max="10"
            value={formData.guests}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="occasion">Occasion</label>
          <select
            id="occasion"
            value={formData.occasion}
            onChange={handleChange}
            required
          >
            <option>Birthday</option>
            <option>Anniversary</option>
          </select>
        </div>

        <div className="form-buttons">
          <button type="submit" className="submit-button">
            Make Your reservation
          </button>
          <button type="button" className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>

      {showSuccess && (
        <div className="success-modal">
          <div className="success-content">
            <h2>Reservation Succeeded!</h2>
            <p>Redirecting to homepage...</p>
          </div>
        </div>
      )}
    </>
  );
};



export default BookingForm;