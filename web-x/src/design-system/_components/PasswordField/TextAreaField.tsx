import React, { TextareaHTMLAttributes, RefObject, useEffect, MutableRefObject } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import styles from './TextAreaField.module.scss';

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  ref?: RefObject<HTMLTextAreaElement>;
}

export const TextAreaField = React.forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(({
  label,
  error,
  showPasswordToggle,
  showPassword,
  onTogglePassword,
  className,
  ...props
}, ref) => {

  useEffect(() => {
    const adjustHeight = () => {
      if ((ref as MutableRefObject<HTMLTextAreaElement | null>)?.current) {
        const textarea = (ref as MutableRefObject<HTMLTextAreaElement | null>).current;
        if (textarea){
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
    
        }
      }
    };

    if ((ref as MutableRefObject<HTMLTextAreaElement | null>)?.current) {
      const textarea = (ref as MutableRefObject<HTMLTextAreaElement | null>).current;
      if (textarea){
        textarea.addEventListener('input', adjustHeight);
        adjustHeight(); // Initial adjustment

        return () => {
            textarea?.removeEventListener('input', adjustHeight);
        };
      }
    }
  }, [ref]);

  return (
    <div className={styles.inputWrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.textareaContainer}>
        <textarea
          className={`${styles.textarea} ${error ? styles.error : ''} ${className || ''}`}
          ref={ref}
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
TextAreaField.displayName = 'TextAreaField';
