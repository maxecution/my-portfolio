import cn from '@utils/cn';

type FormFieldProps = {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'textarea';
  placeholder?: string;
  value: string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
};

const baseClass =
  'w-full px-4 py-3 bg-background border border-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all text-foreground placeholder-muted-foreground';

export default function FormField({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  required = true,
  onChange,
  onBlur,
  error,
  containerClassName,
  labelClassName,
  inputClassName,
  errorClassName,
}: FormFieldProps) {
  function getAutoCompleteFormId(id: string): string {
    const AUTOCOMPLETE_TOKENS = ['name', 'email'];
    if (AUTOCOMPLETE_TOKENS.includes(id)) return id;
    return 'off';
  }

  const invalidStyles = error ? 'border-red-500 focus:ring-red-500' : '';
  const describedBy = error ? `${id}-error` : undefined;

  return (
    <div className={containerClassName} data-testid='form-field-container'>
      <div className='flex flex-col xl:flex-row xl:items-baseline gap-1 text-sm mb-2 text-start'>
        <div className='flex items-baseline gap-1'>
          <label htmlFor={id} className={cn('text-foreground', labelClassName)}>
            {label}
          </label>
          {required && (
            <span aria-hidden='true' className='text-secondary'>
              *
            </span>
          )}
        </div>
        {error && (
          <span id={`${id}-error`} role='alert' className={cn('text-red-500 sm:ml-2', errorClassName)}>
            {error}
          </span>
        )}
      </div>

      {type === 'textarea' ? (
        <textarea
          id={id}
          name={id}
          autoComplete={getAutoCompleteFormId(id)}
          value={value}
          rows={5}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={cn(`${baseClass} resize-vertical ${invalidStyles}`, inputClassName)}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          autoComplete={getAutoCompleteFormId(id)}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={cn(`${baseClass} ${invalidStyles}`, inputClassName)}
        />
      )}
    </div>
  );
}
