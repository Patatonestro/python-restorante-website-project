import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import styles from './Styles.css';

const App = () => {
  return (
    <BrowserRouter>
      <div className="font-['Markazi_Text'] min-h-screen flex flex-col">
        <Header />
        <Main />
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;