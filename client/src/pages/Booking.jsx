import { useState, useContext, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';
import { differenceInDays, addDays } from 'date-fns';
import { AuthContext } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import ServerWakeUp from '../components/ServerWakeUp';
import AgreementModal from '../components/AgreementModal';
import AnimatedContent from '../components/ReactBits/Animations/AnimatedContent/AnimatedContent';
import CountUp from '../components/ReactBits/TextAnimations/CountUp/CountUp';

import singleRoomImg from '../assets/images/single-room.jpg';
import doubleRoomImg from '../assets/images/double-room.jpg';

const ROOMS = [
  {
    id: 'single', num: '01',
    name: 'The Hilltop Room', tag: 'Single Occupancy',
    price: 2500, maxGuests: 2,
    image: singleRoomImg,
    amenities: ['Valley View', 'Free WiFi', 'Breakfast', 'Private Bath'],
    desc: 'Plush queen bed, private bathroom, and a window that frames the Himalayas like a painting.',
  },
  {
    id: 'double', num: '02',
    name: 'The Marigold Suite', tag: 'Double Suite',
    price: 3500, maxGuests: 4,
    image: doubleRoomImg,
    amenities: ['Private Balcony', 'Garden View', 'Breakfast', '2 Bedrooms'],
    desc: 'Two connected rooms with a private balcony overlooking the marigold garden.',
  },
];

/* Step indicator */
const BookingSteps = ({ active }) => {
  const steps = ['Login', 'Profile', 'Select Room', 'Confirm'];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '64px', justifyContent: 'center', flexWrap: 'wrap' }}>
      {steps.map((step, i) => {
        const done = i < active;
        const current = i === active;
        return (
          <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: done || current ? '#C9A84C' : 'rgba(139,134,128,0.3)',
                boxShadow: current ? '0 0 0 2px rgba(201,168,76,0.25)' : 'none',
              }} />
              <span style={{
                fontFamily: '"Jost", sans-serif', fontWeight: current ? 300 : 200,
                fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase',
                color: done || current ? (current ? '#C9A84C' : '#0A0A0A') : '#8B8680',
              }}>{step}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ width: '32px', height: '1px', background: done ? '#C9A84C' : 'rgba(139,134,128,0.3)' }} />
            )}
          </div>
        );
      })}
    </div>
  );
};

const Booking = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState('single');
  const [checkin,  setCheckin]  = useState(addDays(new Date(), 1));
  const [checkout, setCheckout] = useState(addDays(new Date(), 3));
  const [specialRequests, setSpecialRequests] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { call, isWakingUp, isLoading: loading } = useApi();

  useEffect(() => {
    if (!user)       navigate('/login', { state: { from: { pathname: '/booking' } } });
    else if (!user.name) navigate('/profile');
  }, [user, navigate]);

  useEffect(() => {
    if (checkin >= checkout) setCheckout(addDays(checkin, 1));
  }, [checkin, checkout]);

  const nights = useMemo(() => Math.max(1, differenceInDays(checkout, checkin)), [checkin, checkout]);
  const room   = ROOMS.find(r => r.id === selectedRoom);
  const total  = nights * room.price;

  const handleProceed = () => {
    if (user.guests_count > room.maxGuests) {
      toast.error(`${room.name} allows max ${room.maxGuests} guests.`);
      return;
    }
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    try {
      const data = await call('POST', '/api/booking/confirm', {
        room_type: selectedRoom,
        checkin_date: checkin.toISOString(),
        checkout_date: checkout.toISOString(),
        nights, total_amount: total,
        special_requests: specialRequests,
      });
      setIsModalOpen(false);
      navigate(`/confirmation/${data.id}`);
    } catch { toast.error('Failed to confirm booking. Try again.'); }
  };

  if (!user?.name) return null;

  /* Shared styles */
  const dpInputStyle = {
    width: '100%', background: 'transparent', border: 'none',
    borderBottom: '1px solid #8B8680', padding: '14px 0',
    fontFamily: '"Cormorant Garamond", serif', fontWeight: 300,
    fontSize: '20px', color: '#0A0A0A', outline: 'none', borderRadius: 0,
    cursor: 'pointer',
  };

  return (
    <>
      <ServerWakeUp isVisible={isWakingUp} />
      <div style={{ minHeight: '100vh', background: '#F8F5F0', padding: '120px 8.33% 80px', scrollSnapAlign: 'start' }}>
      <BookingSteps active={2} />

      <AnimatedContent distance={40} direction="vertical" reverse={false}
        config={{ tension: 80, friction: 20 }} initialOpacity={0} animateOpacity scale={0.97} animateScale>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '80px', alignItems: 'start' }}
          className="booking-layout">

          {/* ── LEFT COLUMN ── */}
          <div>
            {/* Section eyebrow */}
            <span style={{
              fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: '10px',
              letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C',
              display: 'block', marginBottom: '24px',
            }}>Step 3 of 4</span>

            <h1 style={{
              fontFamily: '"Cormorant Garamond", serif', fontWeight: 300,
              fontSize: '52px', lineHeight: 1.05, color: '#0A0A0A', marginBottom: '8px',
            }}>
              Select Your<br /><em>Room & Dates</em>
            </h1>
            <div style={{ width: '40px', height: '1px', background: '#C9A84C', margin: '32px 0 56px' }} />

            {/* ── Room selection ── */}
            <p style={{
              fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: '10px',
              letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8B8680',
              marginBottom: '24px',
            }}>Choose Room</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginBottom: '64px' }}>
              {ROOMS.map(r => {
                const isSelected = selectedRoom === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedRoom(r.id)}
                    style={{
                      display: 'grid', gridTemplateColumns: '180px 1fr auto',
                      gap: '32px', alignItems: 'center',
                      padding: '24px 32px',
                      background: isSelected ? '#0A0A0A' : '#F8F5F0',
                      border: `1px solid ${isSelected ? '#C9A84C' : 'rgba(139,134,128,0.2)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.4s ease',
                    }}
                  >
                    <div style={{ height: '100px', overflow: 'hidden', flexShrink: 0 }}>
                      <img src={r.image} alt={r.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <p style={{
                        fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: '10px',
                        letterSpacing: '0.15em', textTransform: 'uppercase',
                        color: isSelected ? '#C9A84C' : '#8B8680', marginBottom: '8px',
                      }}>{r.tag}</p>
                      <p style={{
                        fontFamily: '"Cormorant Garamond", serif', fontWeight: 300,
                        fontSize: '24px', color: isSelected ? '#F8F5F0' : '#0A0A0A',
                        marginBottom: '8px', lineHeight: 1,
                      }}>{r.name}</p>
                      <p style={{
                        fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: '12px',
                        color: isSelected ? 'rgba(248,245,240,0.5)' : '#8B8680', lineHeight: 1.7,
                      }}>{r.desc}</p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <span style={{
                        fontFamily: '"Cormorant Garamond", serif', fontWeight: 300,
                        fontSize: '32px', color: isSelected ? '#C9A84C' : '#0A0A0A',
                        letterSpacing: '-0.02em', display: 'block', lineHeight: 1,
                      }}>₹{r.price.toLocaleString('en-IN')}</span>
                      <span style={{
                        fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: '10px',
                        color: isSelected ? 'rgba(248,245,240,0.4)' : '#8B8680',
                        letterSpacing: '0.1em',
                      }}>/ night</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Dates ── */}
            <p style={{
              fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: '10px',
              letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8B8680',
              marginBottom: '24px',
            }}>Select Dates</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', marginBottom: '64px' }}>
              <div>
                <label style={{
                  fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: '10px',
                  letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8B8680',
                  display: 'block', marginBottom: '8px',
                }}>Check-in</label>
                <DatePicker
                  selected={checkin}
                  onChange={setCheckin}
                  selectsStart startDate={checkin} endDate={checkout}
                  minDate={new Date()}
                  dateFormat="dd MMM yyyy"
                  customInput={<input style={dpInputStyle} />}
                />
              </div>
              <div>
                <label style={{
                  fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: '10px',
                  letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8B8680',
                  display: 'block', marginBottom: '8px',
                }}>Check-out</label>
                <DatePicker
                  selected={checkout}
                  onChange={setCheckout}
                  selectsEnd startDate={checkin} endDate={checkout}
                  minDate={addDays(checkin, 1)}
                  dateFormat="dd MMM yyyy"
                  customInput={<input style={dpInputStyle} />}
                />
              </div>
            </div>

            {/* ── Special requests ── */}
            <p style={{
              fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: '10px',
              letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8B8680',
              marginBottom: '24px',
            }}>Special Requests <span style={{ color: 'rgba(139,134,128,0.5)' }}>(optional)</span></p>
            <textarea
              value={specialRequests}
              onChange={e => setSpecialRequests(e.target.value)}
              placeholder="Dietary requirements, arrival time, special arrangements…"
              rows={4}
              style={{
                width: '100%', background: 'transparent', border: 'none',
                borderBottom: '1px solid #8B8680', padding: '14px 0',
                fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: '14px',
                color: '#0A0A0A', outline: 'none', borderRadius: 0, resize: 'none',
                letterSpacing: '0.04em', lineHeight: 1.8,
              }}
            />
          </div>

          {/* ── RIGHT: Summary sidebar ── */}
          <div style={{ position: 'sticky', top: '100px' }}>
            <div style={{
              background: '#0A0A0A',
              padding: '48px 40px',
            }}>
              <p style={{
                fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: '10px',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: '#C9A84C', marginBottom: '32px',
              }}>Booking Summary</p>

              {[
                ['Room',     room.name],
                ['Guests',   user.guests_count],
                ['Nights',   `${nights} night${nights > 1 ? 's' : ''}`],
                ['Rate',     `₹${room.price.toLocaleString('en-IN')} / night`],
              ].map(([label, value]) => (
                <div key={label} style={{
                  display: 'flex', justifyContent: 'space-between',
                  marginBottom: '20px', paddingBottom: '20px',
                  borderBottom: '1px solid rgba(248,245,240,0.06)',
                }}>
                  <span style={{
                    fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: '11px',
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: 'rgba(248,245,240,0.4)',
                  }}>{label}</span>
                  <span style={{
                    fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: '13px',
                    color: '#F8F5F0', letterSpacing: '0.02em',
                  }}>{value}</span>
                </div>
              ))}

              {/* CountUp total */}
              <div style={{ margin: '32px 0 40px', paddingTop: '16px' }}>
                <p style={{
                  fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: '10px',
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: 'rgba(248,245,240,0.4)', marginBottom: '8px',
                }}>Total Amount</p>
                <div style={{
                  fontFamily: '"Cormorant Garamond", serif', fontWeight: 300,
                  fontSize: '48px', color: '#C9A84C', letterSpacing: '-0.02em',
                  lineHeight: 1, display: 'flex', alignItems: 'baseline',
                }}>
                  ₹<CountUp from={0} to={total} separator="," duration={1} />
                </div>
              </div>

              <button
                onClick={handleProceed}
                style={{
                  width: '100%', padding: '20px',
                  background: '#C9A84C', border: 'none', cursor: 'pointer',
                  fontFamily: '"Jost", sans-serif', fontWeight: 300,
                  fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: '#0A0A0A', transition: 'background 0.4s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#b8963e'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#C9A84C'; }}
              >
                Proceed to Agreement →
              </button>
            </div>
          </div>
        </div>
      </AnimatedContent>

      {/* Responsive override */}
      <style>{`
        @media (max-width: 767px) {
          .booking-layout { grid-template-columns: 1fr !important; }
        }
        /* DatePicker overrides */
        .react-datepicker { border: 1px solid rgba(139,134,128,0.3) !important; border-radius: 0 !important; font-family: "Jost", sans-serif !important; }
        .react-datepicker__header { background: #0A0A0A !important; border-bottom: 1px solid rgba(201,168,76,0.2) !important; border-radius: 0 !important; }
        .react-datepicker__current-month, .react-datepicker__day-name { color: #F8F5F0 !important; font-weight: 200 !important; }
        .react-datepicker__day--selected, .react-datepicker__day--in-range { background: #C9A84C !important; border-radius: 0 !important; color: #0A0A0A !important; }
        .react-datepicker__day:hover { background: rgba(201,168,76,0.2) !important; border-radius: 0 !important; }
      `}</style>

      {isModalOpen && (
        <AgreementModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          bookingDetails={{ user, room_type: selectedRoom, checkin, checkout, nights, totalAmount: total }}
          onConfirm={handleConfirm}
          loading={loading}
        />
      )}
    </div>
    </>
  );
};

export default Booking;
