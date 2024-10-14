import { render, screen } from '@testing-library/react';
import { Text } from '../Text';
import { ThemeProvider } from '../../ThemeProvider';

describe('Text Component', () => {
  it('renders body text by default', () => {
    render(
      <ThemeProvider>
        <Text>Hello, world!</Text>
      </ThemeProvider>
    );
    const text = screen.getByText(/hello, world!/i);
    expect(text).toBeInTheDocument();
    expect(text).toHaveClass('body');
  });

  it('renders heading variant', () => {
    render(
      <ThemeProvider>
        <Text variant="heading">Heading Text</Text>
      </ThemeProvider>
    );
    const heading = screen.getByText(/heading text/i);
    expect(heading).toHaveClass('heading');
  });

  it('renders subheading variant', () => {
    render(
      <ThemeProvider>
        <Text variant="subheading">Subheading Text</Text>
      </ThemeProvider>
    );
    const subheading = screen.getByText(/subheading text/i);
    expect(subheading).toHaveClass('subheading');
  });
});