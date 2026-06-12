import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useApi } from '../hooks/useApi';
import ServerWakeUp from '../components/ServerWakeUp';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import BlurText from '../components/ReactBits/TextAnimations/BlurText/BlurText';

const Confirmation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const { call, isWakingUp } = useApi();

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await call('GET', `/api/booking/${id}`);
        setBooking(data);
      } catch {
        toast.error('Could not fetch booking details');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]); // eslint-disable-line

  /* Canvas confetti on mount */
  useEffect(() => {
    if (!booking) return;
    const end = Date.now() + 2500;
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#C9A84C', '#1A2E1A', '#F8F5F0'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#C9A84C', '#1A2E1A', '#F8F5F0'],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, [booking]);

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      const res = await api.get(`/booking/${id}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `booking-${booking.booking_ref}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Receipt downloaded');
    } catch {
      toast.error('Receipt not ready yet. Please try again shortly.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return (
    <>
      <ServerWakeUp isVisible={isWakingUp} />
      <div style={{
        minHeight: '100vh', background: '#0A0A0A',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: '"Jost", sans-serif', fontWeight: 200,
        fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase',
        color: 'rgba(248,245,240,0.4)',
      }}>
        Loading…
      </div>
    </>
  );

  if (!booking) return (
    <div style={{
      minHeight: '100vh', background: '#0A0A0A',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: '"Cormorant Garamond", serif', fontWeight: 300,
      fontSize: '28px', color: '#F8F5F0',
    }}>
      Booking not found.
    </div>
  );

  const detail = [
    ['Booking Reference', booking.booking_ref],
    ['Check-in',  new Date(booking.checkin_date).toLocaleDateString('en-IN',  { day: 'numeric', month: 'long', year: 'numeric' })],
    ['Check-out', new Date(booking.checkout_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })],
    ['Total',     `₹${booking.total_amount.toLocaleString('en-IN')}`],
  ];

  return (
    <>
      <ServerWakeUp isVisible={isWakingUp} />
      <section style={{
      minHeight: '100vh',
      background: '#0A0A0A',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '120px 8.33% 80px',
      textAlign: 'center',
      scrollSnapAlign: 'start',
    }}>
      {/* Thin gold checkmark ring */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          width: '64px', height: '64px', borderRadius: '50%',
          border: '1px solid #C9A84C',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '48px',
        }}
      >
        <span style={{ color: '#C9A84C', fontSize: '24px', lineHeight: 1 }}>✓</span>
      </motion.div>

      {/* BlurText headline */}
      <BlurText
        text="Your Stay is Confirmed"
        delay={60}
        animateBy="words"
        direction="top"
        animationFrom={{ filter: 'blur(12px)', opacity: 0 }}
        animationTo={{ filter: 'blur(0px)', opacity: 1 }}
        style={{
          fontFamily: '"Cormorant Garamond", serif',
          fontWeight: 300,
          fontSize: 'clamp(36px,5vw,64px)',
          color: '#F8F5F0',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          marginBottom: '24px',
          display: 'block',
        }}
      />

      <p style={{
        fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: '14px',
        color: 'rgba(248,245,240,0.5)', letterSpacing: '0.08em',
        marginBottom: '64px', lineHeight: 1.8, maxWidth: '480px',
      }}>
        House of Marigold will reach you within 2 hours to confirm your arrival details.
      </p>

      {/* AP-style receipt card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        style={{
          border: '1px solid rgba(201,168,76,0.3)',
          padding: '48px',
          maxWidth: '480px',
          width: '100%',
          textAlign: 'left',
          marginBottom: '48px',
        }}
      >
        {detail.map(([label, value], i) => (
          <div key={label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            paddingBottom: '20px',
            marginBottom: i < detail.length - 1 ? '20px' : 0,
            borderBottom: i < detail.length - 1 ? '1px solid rgba(248,245,240,0.06)' : 'none',
          }}>
            <span style={{
              fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: '10px',
              letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(248,245,240,0.4)',
            }}>{label}</span>
            <span style={{
              fontFamily: label === 'Total'
                ? '"Cormorant Garamond", serif'
                : '"Jost", sans-serif',
              fontWeight: 300,
              fontSize: label === 'Total' ? '28px' : '14px',
              color: label === 'Total' ? '#C9A84C' : '#F8F5F0',
              letterSpacing: label === 'Total' ? '-0.01em' : '0.02em',
            }}>{value}</span>
          </div>
        ))}
      </motion.div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={handleDownloadPdf}
          disabled={downloading}
          style={{
            fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: '11px',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'rgba(248,245,240,0.6)', background: 'none',
            border: 'none', borderBottom: '1px solid rgba(248,245,240,0.2)',
            paddingBottom: '6px', cursor: 'pointer',
            transition: 'color 0.3s, border-color 0.3s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#C9A84C'; e.currentTarget.style.borderColor = '#C9A84C'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(248,245,240,0.6)'; e.currentTarget.style.borderColor = 'rgba(248,245,240,0.2)'; }}
        >
          {downloading ? 'Downloading…' : 'Download Receipt'}
        </button>

        <button
          onClick={() => navigate('/')}
          style={{
            fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: '11px',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: '#F8F5F0', background: 'none',
            border: 'none', borderBottom: '1px solid rgba(248,245,240,0.4)',
            paddingBottom: '6px', cursor: 'pointer',
            transition: 'color 0.3s, border-color 0.3s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#C9A84C'; e.currentTarget.style.borderColor = '#C9A84C'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#F8F5F0'; e.currentTarget.style.borderColor = 'rgba(248,245,240,0.4)'; }}
        >
          Return to Home
        </button>
      </div>
    </section>
    </>
  );
};

export default Confirmation;
