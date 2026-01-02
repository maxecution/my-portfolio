import cn from '@utils/cn';

type FormFieldProps = {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'textarea';
  placeholder?: string;
  value: string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
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
  containerClassName,
  labelClassName,
  inputClassName,
}: FormFieldProps) {
  return (
    <div className={containerClassName}>
      <label htmlFor={id} className={cn('block text-sm mb-2 text-start text-foreground', labelClassName)}>
        {label}
      </label>

      {type === 'textarea' ? (
        <textarea
          id={id}
          name={id}
          autoComplete='off'
          value={value}
          rows={5}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={cn(`${baseClass} resize-vertical`, inputClassName)}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          autoComplete={id}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={cn(`${baseClass}`, inputClassName)}
        />
      )}
    </div>
  );
}
