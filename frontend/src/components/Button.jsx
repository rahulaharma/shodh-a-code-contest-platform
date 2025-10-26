const baseStyles =
  'inline-flex items-center justify-center rounded-lg font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60'

const variants = {
  primary:
    'bg-brand-500 text-white hover:bg-brand-400 focus-visible:outline-brand-300',
  secondary:
    'bg-white/10 text-white hover:bg-white/20 border border-white/20 focus-visible:outline-white',
  ghost:
    'bg-transparent text-white hover:bg-white/5 focus-visible:outline-white/60',
}

export function Button({ variant = 'primary', className = '', ...props }) {
  const styles = `${baseStyles} ${variants[variant] ?? variants.primary} ${className}`
  return <button className={styles} {...props} />
}
