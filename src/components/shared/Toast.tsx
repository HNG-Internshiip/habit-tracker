'use client';

import { useEffect, useState } from 'react';
import { Info, X } from 'lucide-react';

interface Props {
  message: string;
  onDismiss: () => void;
  duration?: number;
}

export default function Toast({ message, onDismiss, duration = 3000 }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Tiny delay so the enter animation triggers
    const enterTimer = setTimeout(() => setVisible(true), 10);
    const exitTimer  = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300); // wait for exit animation
    }, duration);

    return () => { clearTimeout(enterTimer); clearTimeout(exitTimer); };
  }, [duration, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: 88,           // sit above the FAB
        left: '50%',
        transform: `translateX(-50%) translateY(${visible ? '0' : '16px'})`,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.25s ease, transform 0.25s cubic-bezier(0.22,1,0.36,1)',
        zIndex: 100,
        maxWidth: 'calc(100vw - 32px)',
        width: 'max-content',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 14px',
          borderRadius: 14,
          background: 'var(--surface)',
          border: '1px solid rgba(201,168,76,0.35)',
          boxShadow: '0 8px 28px rgba(0,0,0,0.18)',
          color: 'var(--text)',
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        <Info size={15} style={{ color: 'var(--gold)', flexShrink: 0 }} />
        <span>{message}</span>
        <button
          onClick={() => { setVisible(false); setTimeout(onDismiss, 300); }}
          aria-label="Dismiss"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 2,
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            marginLeft: 4,
          }}
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}