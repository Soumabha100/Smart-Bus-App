import { forwardRef } from 'react';

export interface AuthFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  leadingIcon?: React.ReactNode;
  trailingElement?: React.ReactNode;
}

export const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(
  ({ id, label, error, hint, leadingIcon, trailingElement, className = '', ...props }, ref) => {
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;

    return (
      <div className="flex flex-col gap-1 w-full">
        <label
          htmlFor={id}
          className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider"
        >
          {label}
        </label>

        <div
          className={`flex items-center bg-surface-2/80 border rounded-xl px-3 py-0.5 transition-all duration-150 focus-within:bg-surface focus-within:ring-2 ${
            error
              ? 'border-danger focus-within:ring-danger/25'
              : 'border-line/60 focus-within:border-brand focus-within:ring-brand/20'
          }`}
        >
          {leadingIcon && (
            <div className="flex items-center text-ink-muted mr-2 shrink-0" aria-hidden="true">
              {leadingIcon}
            </div>
          )}

          <input
            id={id}
            ref={ref}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            className={`w-full bg-transparent py-2 font-sans text-sm text-ink-strong placeholder:text-ink-muted/60 focus:outline-none min-h-[40px] ${className}`}
            {...props}
          />

          {trailingElement && (
            <div className="flex items-center ml-2 shrink-0">{trailingElement}</div>
          )}
        </div>

        {error ? (
          <p id={errorId} className="text-xs text-danger font-medium flex items-center gap-1 mt-0.5" role="alert">
            <span className="material-symbols-outlined text-[14px]">error</span>
            <span>{error}</span>
          </p>
        ) : hint ? (
          <p id={hintId} className="text-xs text-ink-muted mt-0.5">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);

AuthField.displayName = 'AuthField';
