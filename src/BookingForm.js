import React, { useEffect, useReducer, useState } from 'react';
import style from './BookingForm.css';
import { useNavigate } from 'react-router-dom';
const seededRandom = function (seed) {
  var m = 2**35 - 31;
  var a = 185852;
  var s = seed % m;
  return function () {
      return (s = s * a % m) / m;
  };
}

const fetchAPI = function(date) {
  let result = [];
  let random = seededRandom(date.getDate());

  for(let i = 17; i <= 23; i++) {
      if(random() < 0.5) {
          result.push(i + ':00');
      }
      if(random() < 0.5) {
          result.push(i + ':30');
      }
  }
  return result;
};

const timesReducer = (state, action) => {
switch (action.type) {
  case 'SET_TIMES':
    return action.payload;
  default:
    return state;
}
};

const initializeTimes = () => {
  const today = new Date();
  return fetchAPI(today);
};

const BookingForm = ({ submitForm }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const [availableTimes, dispatch] = useReducer(timesReducer, []);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    guests: 1,
    occasion: '',
    comments: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const loadInitialTimes = () => {
      const initialTimes = initializeTimes();
      dispatch({ type: 'SET_TIMES', payload: initialTimes });
    };
    loadInitialTimes();
  }, []);

  const updateTimes = (date) => {
    const times = fetchAPI(new Date(date));
    dispatch({ type: 'SET_TIMES', payload: times });
  };

  const validateField = (name, value) => {
    let errors = { ...formErrors };
    switch (name) {
      case 'name':
        if (!value.trim()) {
          errors.name = 'Name is required';
        } else if (value.length < 2) {
          errors.name = 'Name must be at least 2 characters';
        } else {
          delete errors.name;
        }
        break;
      case 'email':
        if (!value) {
          errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          errors.email = 'Email is invalid';
        } else {
          delete errors.email;
        }
        break;
      case 'guests':
        if (!value) {
          errors.guests = 'Number of guests is required';
        } else if (value < 1) {
          errors.guests = 'Must be at least 1 guest';
        } else if (value > 10) {
          errors.guests = 'Maximum 10 guests allowed';
        } else {
          delete errors.guests;
        }
        break;
      default:
        break;
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isFormValid = () => {
    return (
      formData.name.trim() !== '' &&
      formData.email !== '' &&
      selectedDate !== '' &&
      selectedTime !== '' &&
      formData.guests >= 1 &&
      formData.guests <= 10 &&
      Object.keys(formErrors).length === 0
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid()) {
      const finalFormData = {
        id: Date.now(),
        ...formData,
        date: selectedDate,
        time: selectedTime,
        status: 'Confirmed'
      };
      
      const existingReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
      localStorage.setItem('reservations', JSON.stringify([...existingReservations, finalFormData]));
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    validateField(name, value);
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    updateTimes(newDate);
  };

  return (
    <div className="booking-form-container">
      <form className="booking-form" onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="date">Choose date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={selectedDate}
            onChange={handleDateChange}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="time">Choose time</label>
          <select
            id="time"
            name="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            required
          >
            <option value="">Select a time</option>
            {availableTimes.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
          {!selectedTime && <span className="error">Please select a time</span>}
        </div>

        <div className="form-field">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            minLength="2"
          />
          {formErrors.name && <span className="error">{formErrors.name}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          {formErrors.email && <span className="error">{formErrors.email}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="guests">Number of guests</label>
          <input
            type="number"
            id="guests"
            name="guests"
            value={formData.guests}
            onChange={handleInputChange}
            min="1"
            max="10"
            required
          />
          {formErrors.guests && <span className="error">{formErrors.guests}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="occasion">Occasion (optional)</label>
          <select
            id="occasion"
            name="occasion"
            value={formData.occasion}
            onChange={handleInputChange}
          >
            <option value="">Select an occasion</option>
            <option value="birthday">Birthday</option>
            <option value="anniversary">Anniversary</option>
            <option value="business">Business</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="comments">Special comments (optional)</label>
          <textarea
            id="comments"
            name="comments"
            value={formData.comments}
            onChange={handleInputChange}
            rows="4"
          />
        </div>

        <div className="form-buttons">
          <button 
            type="submit"
            disabled={!isFormValid()}
            onClick={() => submitForm(formData)}
          >
            Make Your reservation
          </button>
        </div>
      </form>
      <button 
        type="button"
        onClick={() => navigate('/')}> {/* 注意这里直接使用导航函数 */}
        Cancel
      </button>
    </div>
    
  );
};

export default BookingForm;
