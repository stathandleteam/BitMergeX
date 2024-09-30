import { render, screen, fireEvent } from '@testing-library/react';
// import { Button } from '../Button';
import { ThemeProvider } from '../../ThemeProvider';
import { Button } from '../Button';

describe('Button Component', () => {
  it('renders with default props', () => {
    render(
      <ThemeProvider>
        <Button>Click me</Button>
      </ThemeProvider>
    );
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('primary');
  });

  it('renders with secondary variant', () => {
    render(
      <ThemeProvider>
        <Button variant="secondary">Secondary Button</Button>
      </ThemeProvider>
    );
    const button = screen.getByRole('button', { name: /secondary button/i });
    expect(button).toHaveClass('secondary');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(
      <ThemeProvider>
        <Button onClick={handleClick}>Clickable</Button>
      </ThemeProvider>
    );
    const button = screen.getByRole('button', { name: /clickable/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  it('is disabled when disabled prop is true', () => {
    render(
      <ThemeProvider>
        <Button disabled>Disabled Button</Button>
      </ThemeProvider>
    );
    const button = screen.getByRole('button', { name: /disabled button/i });
    expect(button).toBeDisabled(); // This assertion should pass if the button is correctly rendered as disabled
  });
});
