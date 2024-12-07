import React from 'react';
import { BrowserRouter,Routes, Route  } from 'react-router-dom';
import Header from './Header';
import BookingPage from './BookingPage';
import Reservations from './Reservations'; 
import ConfirmedBooking from './ConfirmedBooking';
import Main from './Main';
import Footer from './Footer';
import styles from './Styles.css';

const App = () => {
  return (
    <BrowserRouter>
      <div className="font-['Markazi_Text'] min-h-screen flex flex-col">
        <Header />
        <Routes>
          <Route path="/confirmed" element={<ConfirmedBooking />} />
          <Route path="/reservations" element={<BookingPage />} />
          <Route path="/my-reservations" element={<Reservations />} />
        </Routes>
        <Main />
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;