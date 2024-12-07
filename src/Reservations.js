import React, { useState, useEffect } from 'react';
import style from './Reservations.css';
import { useNavigate } from 'react-router-dom';
const Reservations = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = () => {
    const savedReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    setReservations(savedReservations);
  };

  const handleEdit = (reservation) => {
    setIsEditing(true);
    setEditData(reservation);
    setSelectedReservation(reservation);
  };

  const handleCancelClick = (reservation) => {
    setSelectedReservation(reservation);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    const updatedReservations = reservations.filter(r => r.id !== selectedReservation.id);
    localStorage.setItem('reservations', JSON.stringify(updatedReservations));
    setReservations(updatedReservations);
    setShowCancelModal(false);
    setSuccessMessage('You have cancelled the reservation');
    setShowSuccessModal(true);
    setTimeout(() => setShowSuccessModal(false), 2000);
  };

  const handleSaveEdit = () => {
    const updatedReservations = reservations.map(r => 
      r.id === editData.id ? editData : r
    );
    localStorage.setItem('reservations', JSON.stringify(updatedReservations));
    setReservations(updatedReservations);
    setIsEditing(false);
    setEditData(null);
    setSuccessMessage('Reservation updated successfully');
    setShowSuccessModal(true);
    setTimeout(() => setShowSuccessModal(false), 2000);
  };

  return (
    <div className="reservations-page">
      <div className="container">
        <div className="header-section">
          <h1>Your Reservations</h1>
          <button className="exit-button" onClick={() => navigate('/')}>
            Exit
          </button>
        </div>
        
        {reservations.length === 0 ? (
          <p className="no-reservations">No reservations found.</p>
        ) : (
          <div className="reservations-grid">
            {reservations.map((reservation) => (
              <div key={reservation.id} className="reservation-card">
                {isEditing && selectedReservation?.id === reservation.id ? (
                  // 编辑表单
                  <div className="edit-form">
                    <h3>Edit Reservation</h3>
                    <div className="form-field">
                      <label>Date:</label>
                      <input
                        type="date"
                        value={editData.date}
                        onChange={(e) => setEditData({...editData, date: e.target.value})}
                      />
                    </div>
                    <div className="form-field">
                      <label>Time:</label>
                      <select
                        value={editData.time}
                        onChange={(e) => setEditData({...editData, time: e.target.value})}
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
                      <label>Guests:</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={editData.guests}
                        onChange={(e) => setEditData({...editData, guests: e.target.value})}
                      />
                    </div>
                    <div className="form-field">
                      <label>Occasion:</label>
                      <select
                        value={editData.occasion}
                        onChange={(e) => setEditData({...editData, occasion: e.target.value})}
                      >
                        <option>Birthday</option>
                        <option>Anniversary</option>
                      </select>
                    </div>
                    <div className="edit-buttons">
                      <button onClick={handleSaveEdit} className="save-button">Save</button>
                      <button onClick={() => {
                        setIsEditing(false);
                        setEditData(null);
                      }} className="cancel-button">Cancel</button>
                    </div>
                  </div>
                ) : (
                  // 显示预订信息
                  <>
                    <h3>Reservation Details</h3>
                    <p><strong>Date:</strong> {reservation.date}</p>
                    <p><strong>Time:</strong> {reservation.time}</p>
                    <p><strong>Guests:</strong> {reservation.guests}</p>
                    <p><strong>Occasion:</strong> {reservation.occasion}</p>
                    <p><strong>Status:</strong> {reservation.status}</p>
                    <div className="card-buttons">
                      <button 
                        className="edit-button" 
                        onClick={() => handleEdit(reservation)}
                      >
                        Edit
                      </button>
                      <button 
                        className="cancel-reservation-button"
                        onClick={() => handleCancelClick(reservation)}
                      >
                        Cancel Reservation
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 取消确认弹窗 */}
      {showCancelModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Are you sure to cancel your reservation?</h2>
            <div className="modal-buttons">
              <button onClick={handleConfirmCancel} className="confirm-button">Yes</button>
              <button onClick={() => setShowCancelModal(false)} className="cancel-button">No</button>
            </div>
          </div>
        </div>
      )}

      {/* 成功提示弹窗 */}
      {showSuccessModal && (
        <div className="success-modal">
          <div className="success-content">
            <p>{successMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};
export default Reservations;