import { render, screen } from '@testing-library/react';
/*We are pulling our tools out of the toolbox.
 render allows us to draw a component invisibly.
 screen allows us to search that invisible drawing for text.*/ 
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
