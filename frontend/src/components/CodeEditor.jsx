import { useId } from 'react'

/**
 * Placeholder textarea-based code editor.
 * Swap with Monaco/Ace later while keeping the same API surface.
 */
export function CodeEditor({
  language = 'javascript',
  value,
  onChange,
  readOnly = false,
  className = '',
  ...props
}) {
  const id = useId()

  return (
    <label className={`flex flex-col text-sm text-white/70 ${className}`} htmlFor={id}>
      <span className="mb-2 font-semibold text-white">
        {language.toUpperCase()} editor
      </span>
      <textarea
        id={id}
        spellCheck={false}
        value={value}
        readOnly={readOnly}
        onChange={(event) => onChange?.(event.target.value)}
        className="min-h-[280px] w-full rounded-2xl border border-white/10 bg-black/50 p-4 font-mono text-sm text-white focus:border-brand-400 focus:outline-none"
        {...props}
      />
    </label>
  )
}
