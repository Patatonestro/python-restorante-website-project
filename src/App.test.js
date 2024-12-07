import { render, screen } from '@testing-library/react';
import App from './App';
import 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import 'react-router-dom';
test('renders App component', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  // 添加你的测试断言
});
