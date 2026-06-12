import { useEffect, useState } from 'react';

/**
 * ServerWakeUp overlay — shown after 3 s of API silence.
 * Matches House of Marigold AP editorial branding exactly.
 */
const ServerWakeUp = ({ isVisible }) => {
  const [dots, setDots] = useState(1);
  const marigolds = ['🌼', '🌼🌼', '🌼🌼🌼'];

  // Cycle dot count 1 → 2 → 3 → 1 every 600 ms
  useEffect(() => {
    if (!isVisible) { setDots(1); return; }
    const iv = setInterval(() => setDots(d => d === 3 ? 1 : d + 1), 600);
    return () => clearInterval(iv);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(10,10,10,0.94)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: '36px',
      animation: 'wakeUpFadeIn 0.5s ease forwards',
    }}>

      {/* Pulsing marigold */}
      <div style={{
        fontSize: '52px',
        animation: 'marigoldPulse 2s ease-in-out infinite',
        lineHeight: 1,
        userSelect: 'none',
      }}>
        {marigolds[dots - 1]}
      </div>

      {/* Text block */}
      <div style={{ textAlign: 'center', padding: '0 24px' }}>
        <p style={{
          fontFamily: '"Cormorant Garamond", serif',
          fontWeight: 300,
          fontSize: 'clamp(24px, 4vw, 38px)',
          color: '#F8F5F0',
          letterSpacing: '-0.01em',
          lineHeight: 1.2,
          margin: '0 0 16px',
        }}>
          Waking up the server
          <span style={{ color: '#C9A84C', letterSpacing: '0.08em' }}>
            {'•'.repeat(dots)}
          </span>
        </p>

        <p style={{
          fontFamily: '"Jost", sans-serif',
          fontWeight: 200,
          fontSize: '13px',
          letterSpacing: '0.06em',
          color: 'rgba(248,245,240,0.45)',
          margin: 0,
          lineHeight: 1.85,
          maxWidth: '360px',
        }}>
          Our hosting server takes a moment to wake up<br />
          after being idle. This only happens once.<br />
          Thank you for your patience.
        </p>
      </div>

      {/* Thin gold progress bar */}
      <div style={{
        width: '220px', height: '1px',
        background: 'rgba(201,168,76,0.15)',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(to right, #C9A84C, rgba(201,168,76,0.4))',
          animation: 'wakeUpProgress 40s linear forwards',
          transformOrigin: 'left',
        }} />
      </div>

      {/* Estimated time label */}
      <p style={{
        fontFamily: '"Jost", sans-serif',
        fontWeight: 200,
        fontSize: '10px',
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: 'rgba(201,168,76,0.55)',
        margin: 0,
      }}>
        Usually takes 20 – 40 seconds
      </p>

      {/* AP editorial house wordmark */}
      <p style={{
        position: 'absolute',
        bottom: '32px',
        fontFamily: '"Cormorant Garamond", serif',
        fontWeight: 300,
        fontSize: '13px',
        letterSpacing: '0.1em',
        color: 'rgba(248,245,240,0.12)',
        margin: 0,
        userSelect: 'none',
      }}>
        HOUSE <em style={{ color: 'rgba(201,168,76,0.2)' }}>of</em> MARIGOLD
      </p>
    </div>
  );
};

export default ServerWakeUp;
