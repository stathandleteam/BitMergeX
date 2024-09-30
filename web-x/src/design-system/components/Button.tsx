import React from 'react';
import { useTheme } from '../ThemeProvider';
import styles from './Button.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className,
  style,
  ...props
}) => {
  const { theme } = useTheme();

  return (
    <button
      className={`${styles.button} ${styles[variant]} ${className || ''}`}
      style={{
        backgroundColor: theme.colors[variant],
        color: theme.colors.text,
        padding: `${theme.spacing.small} ${theme.spacing.medium}`,
        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily,
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
};