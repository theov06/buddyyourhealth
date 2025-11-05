import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders create account button', () => {
  render(<App />);
  const buttonElement = screen.getByText(/create account/i);
  expect(buttonElement).toBeInTheDocument();
});
