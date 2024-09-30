export const lightTheme = {
  colors: {
    primary: '#1976d2',
    secondary: '#dc004e',
    background: '#ffffff',
    text: '#000000',
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px',
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    fontSize: {
      small: '12px',
      medium: '16px',
      large: '20px',
    },
  },
};

export const darkTheme = {
  colors: {
    primary: '#90caf9',
    secondary: '#f48fb1',
    background: '#121212',
    text: '#ffffff',
  },
  spacing: lightTheme.spacing,
  typography: lightTheme.typography,
};

export type Theme = typeof lightTheme;