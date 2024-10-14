// InputField.tsx
import React, { InputHTMLAttributes, forwardRef } from 'react';
import styles from './InputField.module.scss';
import { IoIosCheckmark } from "react-icons/io";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: string;
  info?: string;
  warning?: string;
  variant?: 'primary' | 'secondary';
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      helperText,
      error,
      success,
      info,
      warning,
      variant = 'primary',
      disabled,
      ...props
    },
    ref
  ) => {
    const getStateClass = () => {
      if (disabled) return styles.disabled;
      if (error) return styles.error;
      if (success) return styles.success;
      if (info) return styles.info;
      if (warning) return styles.warning;
      return '';
    };

    const getMessage = () => {
      if (error) return error;
      if (success) return success;
      if (info) return info;
      if (warning) return warning;
      return helperText;
    };

    const getMessageClass = () => {
      if (error) return styles.errorMessage;
      if (success) return styles.successMessage;
      if (info) return styles.infoMessage;
      if (warning) return styles.warningMessage;
      return styles.helperText;
    };

    return (
      <div className={`${styles.inputWrapper} ${styles[variant]}`}>
        {label && <label className={styles.label}>{label}</label>}
        <div className={`${styles.inputContainer} ${getStateClass()}`}>
          <input
            ref={ref}
            className={styles.input}
            disabled={disabled}
            {...props}
          />
          <span className={styles.icon}>
              <IoIosCheckmark  size={16} />
          </span>
        </div>
        {getMessage() && (
          <span className={getMessageClass()}>{getMessage()}</span>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';