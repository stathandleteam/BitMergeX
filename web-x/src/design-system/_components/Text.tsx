import React from 'react';
import { useTheme } from '../ThemeProvider';
import styles from './Text.module.scss';

interface TextProps {
  variant?: 'body' | 'heading' | 'subheading';
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  children,
}) => {
  const { theme } = useTheme();

  const getStylesForVariant = () => {
    switch (variant) {
      case 'heading':
        return {
          fontSize: theme.typography.fontSize.large,
          fontWeight: 'bold',
        };
      case 'subheading':
        return {
          fontSize: theme.typography.fontSize.medium,
          fontWeight: 'bold',
        };
      default:
        return {
          fontSize: theme.typography.fontSize.medium,
        };
    }
  };

  return (
    <span
      className={`${styles.text} ${styles[variant]}`}
      style={{
        color: theme.colors.text,
        fontFamily: theme.typography.fontFamily,
        ...getStylesForVariant(),
      }}
    >
      {children}
    </span>
  );
};