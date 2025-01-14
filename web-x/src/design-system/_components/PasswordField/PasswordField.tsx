import React, { InputHTMLAttributes, RefObject } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import styles from './PasswordField.module.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  ref?: RefObject<HTMLInputElement>; // Add this line
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  showPasswordToggle,
  showPassword,
  onTogglePassword,
  className,
  ...props
}, ref) => {
  return (
    <div className={styles.inputWrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.inputContainer}>
        <input
          className={`${styles.input} ${error ? styles.error : ''} ${className || ''}`}
          ref={ref} // Use the ref here
          {...props}
        />
        {showPasswordToggle && (
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={onTogglePassword}
          >
            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </button>
        )}
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
});

// Set the display name for debugging purposes in React DevTools
Input.displayName = 'Input';