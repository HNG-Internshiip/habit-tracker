import AppLogo from './AppLogo';

export default function SplashScreen() {
  return (
    <div
      data-testid="splash-screen"
      className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg)] transition-colors"
    >
      {/* Logo — floats gently */}
      <div className="animate-float mb-6">
        <AppLogo size={80} />
      </div>

      {/* Wordmark */}
      <h1 className="text-[28px] font-extrabold text-[var(--text)] tracking-tight mb-1 animate-fade-in">
        Habit Tracker
      </h1>
      <p
        className="text-xs font-bold tracking-[0.18em] uppercase animate-fade-in"
        style={{ color: 'var(--gold)', animationDelay: '0.1s' }}
      >
        Build · Streak · Thrive
      </p>

      {/* Animated loader dots */}
      <div className="flex items-center gap-2 mt-12" aria-label="Loading">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="pulse-dot rounded-full"
            style={{
              width:  i === 1 ? 22 : 8,
              height: 8,
              background: i === 1 ? 'var(--gold)' : 'var(--border)',
              display: 'block',
              animationDelay: `${i * 0.2}s`,
              borderRadius: 99,
              transition: 'width 0.3s',
            }}
          />
        ))}
      </div>
    </div>
  );
}