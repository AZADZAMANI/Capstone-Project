// /frontend/src/App.test.js

import { render, screen } from '@testing-library/react';
import App from './App';
import { AuthProvider } from './AuthContext'; // Import AuthProvider
import { BrowserRouter } from 'react-router-dom';

test('renders Healthcare made easy slogan', () => {
  render(
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  );
  const sloganElement = screen.getByText(/Healthcare made easy./i);
  expect(sloganElement).toBeInTheDocument();
});
