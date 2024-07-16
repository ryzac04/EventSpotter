import { render, screen } from '@testing-library/react';
import App from './App';

test('renders welcome message', () => {
  render(<App />);
  const welcomeElement = screen.getByText(/Fun at your fingertips/i);
  expect(welcomeElement).toBeInTheDocument();
});
