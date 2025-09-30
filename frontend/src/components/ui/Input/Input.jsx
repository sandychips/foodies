import { forwardRef, useState } from 'react';
import styles from './Input.module.css';

const Input = forwardRef(({
  label,
  type = 'text',
  id,
  name,
  placeholder,
  value,
  defaultValue,
  onChange,
  onBlur,
  onFocus,
  required = false,
  disabled = false,
  error,
  className = '',
  showPasswordToggle = false,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [inputType, setInputType] = useState(type);

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
    setInputType(showPassword ? 'password' : 'text');
  };

  const inputId = id || name || 'input';
  const errorId = error ? `${inputId}-error` : undefined;

  const inputClasses = [
    styles.formInput,
    error && styles.formInputError,
    className,
  ].filter(Boolean).join(' ');

  const isPasswordField = type === 'password' && showPasswordToggle;

  return (
    <div className={styles.formGroup}>
      {label && (
        <label htmlFor={inputId} className={styles.formLabel}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}

      <div className={isPasswordField ? styles.formInputGroup : ''}>
        <input
          ref={ref}
          type={inputType}
          id={inputId}
          name={name}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          required={required}
          disabled={disabled}
          className={inputClasses}
          aria-describedby={errorId}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        />

        {isPasswordField && (
          <button
            type="button"
            className={styles.formInputToggle}
            onClick={handlePasswordToggle}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            <svg
              className={styles.eyeIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {showPassword ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              )}
            </svg>
          </button>
        )}
      </div>

      {error && (
        <div id={errorId} className={styles.formError} role="alert">
          {error}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;