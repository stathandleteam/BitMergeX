// FormControls.tsx
import React from 'react';
import styles from './FormControls.module.scss';

interface RadioProps {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
    children?: React.ReactNode;
    error?: boolean;
  }
  
  export const Radio: React.FC<RadioProps> = ({
    checked = false,
    onChange,
    disabled = false,
    children,
    error = false,
  }) => {
    return (
      <label
        className={`${styles.radioContainer} ${disabled ? styles.disabled : ''} ${
          error ? styles.error : ''
        }`}
      >
        <input
          type="radio"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          className={styles.hiddenInput}
        />
        <span className={styles.radio}>
          {checked && <span className={styles.radioInner} />}
        </span>
        <span className={styles.label}>{children}</span>
      </label>
    );
  };