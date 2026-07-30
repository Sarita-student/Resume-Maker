import { render, screen } from '@testing-library/react';
import App from './App';

test('renders build resume button', () => {
  render(<App />);
  const buttonElement = screen.getByText(/Start Building Now/i);
  expect(buttonElement).toBeInTheDocument();
});
