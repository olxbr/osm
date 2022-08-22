import { render, screen } from '@testing-library/react';
import App from './App';

test('renders main title', () => {
  render(<App />);
  const h1Element = screen.getByText(/Security/i);
  expect(h1Element).toBeInTheDocument();
});
