// FormControls.tsx
import React from 'react';
import styles from './FormControls.module.scss';

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  children?: React.ReactNode;
  error?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked = true,
  onChange,
  disabled = false,
  children,
  error = false,
}) => {
  return (
    <label
      className={`${styles.checkboxContainer} ${disabled ? styles.disabled : ''} ${
        error ? styles.error : ''
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={disabled}
        className={styles.hiddenInput}
      />
      <span className={styles.checkbox}>
        {checked && (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className={styles.checkIcon}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 6L9 17L4 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className={styles.label}>{children}</span>
    </label>
  );
};