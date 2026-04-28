interface Props {
  size?: number;
  className?: string;
}

/**
 * Champaign-gold badge logo with outer ring + bold check.
 * Used in splash, header, and auth pages.
 */
export default function AppLogo({ size = 40, className = '' }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Badge background */}
      <rect width="64" height="64" rx="18" fill="url(#logo-grad)" />

      {/* Subtle inner ring */}
      <circle
        cx="32"
        cy="32"
        r="19"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1.5"
        fill="none"
      />

      {/* Bold check mark */}
      <path
        d="M20 33 L29 42 L45 23"
        stroke="white"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#F0D080" />
          <stop offset="50%"  stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#A0762A" />
        </linearGradient>
      </defs>
    </svg>
  );
}