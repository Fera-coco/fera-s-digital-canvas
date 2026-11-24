type P = {className?: string}
const s = {fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const}

export const ChatIcon = ({className = 'size-5'}: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
    <path {...s} d="M4 19.5 5.3 15A7.5 7.5 0 1 1 9 18.7L4 19.5Z" />
    <path {...s} d="M9 10.5h6M9 13.5h4" />
  </svg>
)
export const ArrowLeftIcon = ({className = 'size-5'}: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
    <path {...s} strokeWidth={2} d="M15 5 8 12l7 7" />
  </svg>
)
export const ShareIcon = ({className = 'size-5'}: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
    <path {...s} d="M12 15V4M8 8l4-4 4 4M5 12v6.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V12" />
  </svg>
)
export const BellIcon = ({className = 'size-5'}: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
    <path {...s} d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16ZM10 20a2 2 0 0 0 4 0" />
  </svg>
)
export const PlayIcon = ({className = 'size-5'}: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
    <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" fill="currentColor" />
  </svg>
)
export const InstagramIcon = ({className = 'size-5'}: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
    <rect {...s} x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle {...s} cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
  </svg>
)
