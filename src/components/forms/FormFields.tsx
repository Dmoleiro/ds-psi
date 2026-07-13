import styles from './FormFields.module.css'

export function FormField({
  label,
  htmlFor,
  children,
  required,
}: {
  label: string
  htmlFor: string
  children: React.ReactNode
  required?: boolean
}) {
  return (
    <div className={styles.field}>
      <label htmlFor={htmlFor}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {children}
    </div>
  )
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={styles.input} {...props} />
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={styles.textarea} {...props} />
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={styles.input} {...props} />
}
