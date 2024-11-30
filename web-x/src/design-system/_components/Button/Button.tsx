// src/design-system/components/Button/Button.tsx
import React from 'react';
import styles from './Button.module.scss';
import classNames from '../../utils/classNames';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', children, className, fullWidth, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={classNames(
          styles.button,
          styles[variant],
          {[styles['fullWidth']]: fullWidth},
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';