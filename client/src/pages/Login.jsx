import { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import ServerWakeUp from '../components/ServerWakeUp';
import AnimatedContent from '../components/ReactBits/Animations/AnimatedContent/AnimatedContent';

/* ── Gold dot step indicator ── */
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
                boxShadow: current ? '0 0 0 3px rgba(201,168,76,0.2)' : 'none',
                transition: 'all 0.4s ease',
              }} />
              <span style={{
                fontFamily: '"Jost", sans-serif', fontWeight: current ? 300 : 200,
                fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase',
                color: done || current ? (current ? '#C9A84C' : '#0A0A0A') : '#8B8680',
                transition: 'color 0.4s ease',
              }}>{step}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                width: '32px', height: '1px',
                background: done ? '#C9A84C' : 'rgba(139,134,128,0.3)',
                transition: 'background 0.4s ease',
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
};

/* ── Shared style tokens ── */
const labelStyle = {
  fontFamily: '"Jost", sans-serif', fontWeight: 200,
  fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase',
  color: '#8B8680', display: 'block', marginBottom: '8px',
};
const inputStyle = {
  width: '100%', background: 'transparent',
  border: 'none', borderBottom: '1px solid #8B8680',
  padding: '14px 0',
  fontFamily: '"Cormorant Garamond", serif', fontWeight: 300, fontSize: '22px',
  color: '#0A0A0A', outline: 'none', borderRadius: 0,
  transition: 'border-color 0.3s ease', letterSpacing: '0.02em',
};
const primaryBtn = {
  width: '100%', padding: '18px 0', background: '#0A0A0A',
  border: 'none', cursor: 'pointer',
  fontFamily: '"Jost", sans-serif', fontWeight: 300,
  fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase',
  color: '#F8F5F0', transition: 'background 0.4s ease',
};

const Login = () => {
  const [mobile, setMobile] = useState('');
  const [email,  setEmail]  = useState('');
  const [otp,    setOtp]    = useState('');
  const [step,   setStep]   = useState(1);
  const [devOtp, setDevOtp] = useState(null);

  const { call, isWakingUp, isLoading: loading } = useApi();
  const { login } = useContext(AuthContext);
  const navigate  = useNavigate();
  const location  = useLocation();

  /* ── Step 1: send OTP to email ── */
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (mobile.replace(/\D/g, '').length !== 10) {
      toast.error('Enter a valid 10-digit mobile number');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Enter a valid email address');
      return;
    }
    try {
      const data = await call('POST', '/api/auth/send-otp', {
        mobile: mobile.replace(/\D/g, ''),
        email:  email.trim().toLowerCase(),
      });
      toast.success(data.devOtp ? 'OTP shown below (dev mode)' : `OTP sent to ${email}`);
      setStep(2);
      if (data.devOtp) setDevOtp(data.devOtp);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send OTP. Try again.');
    }
  };

  /* ── Step 2: verify OTP ── */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.replace(/\D/g, '').length !== 6) {
      toast.error('Enter the 6-digit OTP from your email');
      return;
    }
    try {
      const data = await call('POST', '/api/auth/verify-otp', {
        mobile: mobile.replace(/\D/g, ''),
        email:  email.trim().toLowerCase(),
        otp:    otp.replace(/\D/g, ''),
      });
      login(data.token, data.user);
      toast.success('Email verified ✓');
      navigate(data.isNewUser
        ? '/profile'
        : (location.state?.from?.pathname || '/booking'));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid OTP. Please try again.');
    }
  };

  return (
    <>
      <ServerWakeUp isVisible={isWakingUp} />

      <div style={{
        minHeight: '100vh', background: '#F8F5F0',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '120px 8.33% 80px',
        scrollSnapAlign: 'start',
      }}>
        <BookingSteps active={0} />

        <AnimatedContent
          distance={40} direction="vertical" reverse={false}
          config={{ tension: 80, friction: 20 }} initialOpacity={0}
          animateOpacity scale={0.97} animateScale
        >
          <div style={{ maxWidth: '480px', width: '100%' }}>

            {/* Eyebrow */}
            <span style={{
              fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: '10px',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: '#C9A84C', display: 'block', marginBottom: '24px',
            }}>
              {step === 1 ? 'Step 1 of 4' : 'Verify Your Email'}
            </span>

            {/* Heading */}
            <h1 style={{
              fontFamily: '"Cormorant Garamond", serif', fontWeight: 300,
              fontSize: '52px', lineHeight: 1.05, letterSpacing: '-0.01em',
              color: '#0A0A0A', marginBottom: '8px',
            }}>
              {step === 1
                ? <><span>Welcome</span><br /><em style={{ color: '#C9A84C' }}>Back</em></>
                : <><span>Enter</span><br /><em style={{ color: '#C9A84C' }}>Your Code</em></>}
            </h1>

            <div style={{ width: '40px', height: '1px', background: '#C9A84C', margin: '32px 0 48px' }} />

            {/* DEV MODE banner */}
            {devOtp && (
              <div style={{
                background: 'rgba(201,168,76,0.07)',
                border: '1px solid rgba(201,168,76,0.3)',
                padding: '14px 18px', marginBottom: '32px',
                display: 'flex', alignItems: 'center', gap: '12px',
              }}>
                <span style={{ fontSize: '18px' }}>🧪</span>
                <span style={{
                  fontFamily: '"Jost", sans-serif', fontWeight: 300,
                  fontSize: '12px', letterSpacing: '0.1em', color: '#C9A84C',
                }}>
                  DEV MODE — Your OTP is{' '}
                  <strong style={{ fontSize: '16px', letterSpacing: '0.15em' }}>{devOtp}</strong>
                </span>
              </div>
            )}

            {/* ── STEP 1: Mobile + Email ── */}
            {step === 1 && (
              <form onSubmit={handleSendOtp} noValidate>

                <div style={{ marginBottom: '40px' }}>
                  <label style={labelStyle} htmlFor="mobile">Mobile Number</label>
                  <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #8B8680' }}>
                    <span style={{
                      fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: '16px',
                      color: '#8B8680', padding: '14px 8px 14px 0', flexShrink: 0,
                    }}>+91</span>
                    <input
                      id="mobile" type="tel" required maxLength={10}
                      value={mobile}
                      onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="98765 43210"
                      style={{ ...inputStyle, borderBottom: 'none', flex: 1 }}
                      onFocus={e => { e.target.closest('div').style.borderColor = '#C9A84C'; }}
                      onBlur={e => { e.target.closest('div').style.borderColor = '#8B8680'; }}
                    />
                  </div>
                  <p style={{
                    fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: '11px',
                    color: '#8B8680', letterSpacing: '0.03em', margin: '8px 0 0',
                  }}>Saved for check-in records only — not used for SMS</p>
                </div>

                <div style={{ marginBottom: '48px' }}>
                  <label style={labelStyle} htmlFor="email">Email Address</label>
                  <input
                    id="email" type="email" required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    style={inputStyle}
                    onFocus={e => { e.target.style.borderBottomColor = '#C9A84C'; }}
                    onBlur={e => { e.target.style.borderBottomColor = '#8B8680'; }}
                  />
                  <p style={{
                    fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: '11px',
                    color: '#8B8680', letterSpacing: '0.03em', margin: '8px 0 0',
                  }}>Your OTP booking code will be sent here</p>
                </div>

                <button
                  type="submit" disabled={loading}
                  style={primaryBtn}
                  onMouseEnter={e => { e.currentTarget.style.background = '#1c1c1c'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#0A0A0A'; }}
                >
                  {loading ? 'Sending Code…' : 'Send Booking Code →'}
                </button>
              </form>
            )}

            {/* ── STEP 2: OTP entry ── */}
            {step === 2 && (
              <form onSubmit={handleVerifyOtp} noValidate>

                <div style={{
                  display: 'flex', gap: '12px', alignItems: 'flex-start',
                  marginBottom: '40px', padding: '18px 20px',
                  background: 'rgba(201,168,76,0.05)',
                  border: '1px solid rgba(201,168,76,0.2)',
                }}>
                  <span style={{ fontSize: '20px', flexShrink: 0, marginTop: '2px' }}>✉️</span>
                  <p style={{
                    fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: '13px',
                    color: '#6E6963', letterSpacing: '0.03em', lineHeight: 1.8, margin: 0,
                  }}>
                    A 6-digit code was sent to{' '}
                    <strong style={{ fontWeight: 400, color: '#0A0A0A' }}>{email}</strong>.
                    <br />Check your inbox and spam folder.
                    Code expires in <strong style={{ fontWeight: 400 }}>10 minutes</strong>.
                  </p>
                </div>

                <label style={labelStyle} htmlFor="otp">One-Time Password</label>
                <input
                  id="otp" type="text" inputMode="numeric" required maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="· · · · · ·"
                  style={{
                    ...inputStyle,
                    textAlign: 'center', fontSize: '36px',
                    letterSpacing: '0.35em', marginBottom: '48px',
                  }}
                  onFocus={e => { e.target.style.borderBottomColor = '#C9A84C'; }}
                  onBlur={e => { e.target.style.borderBottomColor = '#8B8680'; }}
                  autoFocus
                />

                <button
                  type="submit" disabled={loading}
                  style={primaryBtn}
                  onMouseEnter={e => { e.currentTarget.style.background = '#1c1c1c'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#0A0A0A'; }}
                >
                  {loading ? 'Verifying…' : 'Verify & Continue →'}
                </button>

                <button
                  type="button"
                  onClick={() => { setStep(1); setOtp(''); setDevOtp(null); }}
                  style={{
                    marginTop: '20px', width: '100%', background: 'none',
                    border: 'none', cursor: 'pointer',
                    fontFamily: '"Jost", sans-serif', fontWeight: 200,
                    fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase',
                    color: '#8B8680', transition: 'color 0.3s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#C9A84C'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#8B8680'; }}
                >
                  ← Change Details
                </button>
              </form>
            )}

          </div>
        </AnimatedContent>
      </div>
    </>
  );
};

export default Login;
