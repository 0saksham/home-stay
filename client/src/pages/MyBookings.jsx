import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import api from '../utils/api';
import ServerWakeUp from '../components/ServerWakeUp';
import AnimatedContent from '../components/ReactBits/Animations/AnimatedContent/AnimatedContent';

const ROOM_NAMES = {
  single: 'The Hilltop Room',
  double: 'The Marigold Suite',
};

const MyBookings = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const { call, isWakingUp } = useApi();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchMyBookings = async () => {
      try {
        const data = await call('GET', '/api/booking/my-bookings');
        setBookings(data || []);
      } catch (err) {
        toast.error('Failed to load your bookings');
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchMyBookings();
  }, [user, navigate]);

  const handleDownloadPdf = async (bookingId, bookingRef) => {
    setDownloadingId(bookingId);
    try {
      const res = await api.get(`/booking/${bookingId}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `booking-${bookingRef}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Receipt downloaded ✓');
    } catch {
      toast.error('Receipt not ready yet. Please try again shortly.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <>
      <ServerWakeUp isVisible={isWakingUp} />

      <div style={{
        minHeight: '100vh',
        background: '#F8F5F0',
        padding: '120px 8.33% 80px',
        scrollSnapAlign: 'start',
      }}>
        <AnimatedContent distance={40} direction="vertical" reverse={false}
          config={{ tension: 80, friction: 20 }} initialOpacity={0} animateOpacity scale={0.97} animateScale>

          <div style={{ maxWidth: '840px', margin: '0 auto' }}>
            <span style={{
              fontFamily: '"Jost", sans-serif', fontWeight: 400, fontSize: '10px',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: '#B48A2C', display: 'block', marginBottom: '24px',
            }}>
              Your Account
            </span>

            <h1 style={{
              fontFamily: '"Cormorant Garamond", serif', fontWeight: 300,
              fontSize: '52px', lineHeight: 1.05, color: '#0A0A0A', marginBottom: '8px',
            }}>
              Your Stay<br /><em>Bookings</em>
            </h1>

            <div style={{ width: '40px', height: '1px', background: '#C9A84C', margin: '32px 0 48px' }} />

            {loadingBookings ? (
              <p style={{
                fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: '14px',
                color: '#57534E', letterSpacing: '0.05em'
              }}>Loading your bookings…</p>
            ) : bookings.length === 0 ? (
              <div style={{
                background: '#FFFFFF',
                border: '1px solid rgba(201,168,76,0.3)',
                padding: '48px 40px',
                textAlign: 'center'
              }}>
                <p style={{
                  fontFamily: '"Cormorant Garamond", serif', fontWeight: 300,
                  fontSize: '28px', color: '#0A0A0A', marginBottom: '16px'
                }}>No Reservations Found</p>
                <p style={{
                  fontFamily: '"Jost", sans-serif', fontWeight: 400, fontSize: '13px',
                  color: '#57534E', marginBottom: '32px', lineHeight: 1.8
                }}>You have no active or past bookings registered with House of Marigold yet.</p>
                <button
                  onClick={() => navigate('/booking')}
                  style={{
                    padding: '16px 40px', background: '#0A0A0A', border: 'none',
                    color: '#F8F5F0', fontFamily: '"Jost", sans-serif', fontWeight: 400,
                    fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase',
                    cursor: 'pointer'
                  }}
                >
                  Book Your Stay Now →
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {bookings.map((b) => (
                  <div key={b.id} style={{
                    background: '#FFFFFF',
                    border: '1px solid rgba(201,168,76,0.3)',
                    padding: '36px 40px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <span style={{
                          fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: '11px',
                          letterSpacing: '0.15em', textTransform: 'uppercase', color: '#B48A2C'
                        }}>Ref: {b.booking_ref}</span>
                        <h2 style={{
                          fontFamily: '"Cormorant Garamond", serif', fontWeight: 400,
                          fontSize: '32px', color: '#0A0A0A', margin: '4px 0 0'
                        }}>{ROOM_NAMES[b.room_type] || b.room_type}</h2>
                      </div>
                      <span style={{
                        padding: '6px 16px', background: 'rgba(201,168,76,0.12)',
                        border: '1px solid rgba(201,168,76,0.4)',
                        fontFamily: '"Jost", sans-serif', fontWeight: 400, fontSize: '10px',
                        letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8A691E'
                      }}>
                        {b.status || 'CONFIRMED'}
                      </span>
                    </div>

                    <div style={{
                      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                      gap: '24px', padding: '24px 0', borderTop: '1px solid #E7E5E4', borderBottom: '1px solid #E7E5E4',
                      marginBottom: '24px'
                    }}>
                      <div>
                        <span style={{ fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#78716C' }}>Check-In</span>
                        <p style={{ fontFamily: '"Jost", sans-serif', fontWeight: 400, fontSize: '14px', color: '#0A0A0A', margin: '4px 0 0' }}>
                          {new Date(b.checkin_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>

                      <div>
                        <span style={{ fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#78716C' }}>Check-Out</span>
                        <p style={{ fontFamily: '"Jost", sans-serif', fontWeight: 400, fontSize: '14px', color: '#0A0A0A', margin: '4px 0 0' }}>
                          {new Date(b.checkout_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>

                      <div>
                        <span style={{ fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#78716C' }}>Duration</span>
                        <p style={{ fontFamily: '"Jost", sans-serif', fontWeight: 400, fontSize: '14px', color: '#0A0A0A', margin: '4px 0 0' }}>
                          {b.nights} {b.nights === 1 ? 'Night' : 'Nights'}
                        </p>
                      </div>

                      <div>
                        <span style={{ fontFamily: '"Jost", sans-serif', fontWeight: 500, fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#78716C' }}>Total Amount</span>
                        <p style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 600, fontSize: '22px', color: '#B48A2C', margin: '2px 0 0' }}>
                          ₹{b.total_amount?.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                      <button
                        onClick={() => handleDownloadPdf(b.id, b.booking_ref)}
                        disabled={downloadingId === b.id}
                        style={{
                          background: 'none', border: 'none', borderBottom: '1px solid #0A0A0A',
                          padding: '4px 0', fontFamily: '"Jost", sans-serif', fontWeight: 400,
                          fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase',
                          color: '#0A0A0A', cursor: 'pointer'
                        }}
                      >
                        {downloadingId === b.id ? 'Downloading…' : '📄 Download PDF Receipt'}
                      </button>

                      <button
                        onClick={() => navigate(`/confirmation/${b.id}`)}
                        style={{
                          background: '#0A0A0A', border: 'none', padding: '12px 24px',
                          fontFamily: '"Jost", sans-serif', fontWeight: 400, fontSize: '10px',
                          letterSpacing: '0.15em', textTransform: 'uppercase', color: '#F8F5F0',
                          cursor: 'pointer'
                        }}
                      >
                        View Receipt Details →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </AnimatedContent>
      </div>
    </>
  );
};

export default MyBookings;
