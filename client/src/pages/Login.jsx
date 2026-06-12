import { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import AnimatedContent from '../components/ReactBits/Animations/AnimatedContent/AnimatedContent';

/* ── Step indicator ── */
const BookingSteps = ({ active }) => {
  const steps = ['Login', 'Profile', 'Select Room', 'Confirm'];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '24px',
      marginBottom: '64px', justifyContent: 'center', flexWrap: 'wrap',
    }}>
      {steps.map((step, i) => {
        const done = i < active;
        const current = i === active;
        return (
          <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: done ? '#C9A84C' : current ? '#C9A84C' : 'rgba(139,134,128,0.3)',
                flexShrink: 0,
                boxShadow: current ? '0 0 0 2px rgba(201,168,76,0.25)' : 'none',
                transition: 'all 0.4s ease',
              }} />
              <span style={{
                fontFamily: '"Jost", sans-serif',
                fontWeight: current ? 300 : 200,
                fontSize: '10px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
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

const Login = () => {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [devOtp, setDevOtp] = useState(null);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const inputStyle = {
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid #8B8680',
    padding: '16px 0',
    fontFamily: '"Cormorant Garamond", serif',
    fontWeight: 300,
    fontSize: '24px',
    color: '#0A0A0A',
    outline: 'none',
    borderRadius: 0,
    transition: 'border-color 0.3s ease',
    letterSpacing: '0.02em',
  };
  const labelStyle = {
    fontFamily: '"Jost", sans-serif', fontWeight: 200,
    fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase',
    color: '#8B8680', display: 'block', marginBottom: '8px',
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (mobile.length !== 10) { toast.error('Enter a valid 10-digit mobile number'); return; }
    setLoading(true);
    try {
      const res = await api.post('/auth/send-otp', { mobile });
      toast.success('OTP sent');
      setStep(2);
      if (res.data.devOtp) setDevOtp(res.data.devOtp);
    } catch { toast.error('Failed to send OTP. Try again.'); }
    finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) { toast.error('Enter the 6-digit OTP'); return; }
    setLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', { mobile, otp });
      login(res.data.token, res.data.user);
      toast.success('Verified');
      navigate(res.data.isNewUser ? '/profile' : (location.state?.from?.pathname || '/booking'));
    } catch (err) { toast.error(err.response?.data?.error || 'Invalid OTP'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F8F5F0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '120px 8.33% 80px',
      scrollSnapAlign: 'start',
    }}>
      <BookingSteps active={0} />

      <AnimatedContent distance={40} direction="vertical" reverse={false}
        config={{ tension: 80, friction: 20 }} initialOpacity={0} animateOpacity scale={0.97} animateScale>
        <div style={{ maxWidth: '480px', width: '100%' }}>
          {/* Eyebrow */}
          <span style={{
            fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: '10px',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: '#C9A84C', display: 'block', marginBottom: '24px',
          }}>
            {step === 1 ? 'Step 1 of 4' : 'Verify Your Number'}
          </span>

          <h1 style={{
            fontFamily: '"Cormorant Garamond", serif', fontWeight: 300,
            fontSize: '52px', lineHeight: 1.05, letterSpacing: '-0.01em',
            color: '#0A0A0A', marginBottom: '8px',
          }}>
            {step === 1 ? <>Welcome<br /><em>Back</em></> : <>Enter<br /><em>Your OTP</em></>}
          </h1>

          <div style={{ width: '40px', height: '1px', background: '#C9A84C', margin: '32px 0 48px' }} />

          {/* DEV banner */}
          {devOtp && (
            <div style={{
              background: 'rgba(201,168,76,0.08)',
              border: '1px solid rgba(201,168,76,0.3)',
              padding: '12px 16px',
              marginBottom: '32px',
              fontFamily: '"Jost", sans-serif', fontWeight: 300,
              fontSize: '12px', letterSpacing: '0.1em',
              color: '#C9A84C',
            }}>
              DEV MODE — OTP: <strong>{devOtp}</strong>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSendOtp}>
              <label style={labelStyle}>Mobile Number</label>
              <div style={{ display: 'flex', alignItems: 'baseline', borderBottom: '1px solid #8B8680' }}>
                <span style={{
                  fontFamily: '"Jost", sans-serif', fontWeight: 300,
                  fontSize: '16px', color: '#8B8680', paddingBottom: '16px',
                  paddingRight: '8px', paddingTop: '16px', flexShrink: 0,
                }}>+91</span>
                <input
                  id="mobile"
                  type="tel"
                  required
                  maxLength={10}
                  value={mobile}
                  onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="98765 43210"
                  style={{ ...inputStyle, borderBottom: 'none', flex: 1 }}
                  onFocus={e => { e.target.parentElement.style.borderColor = '#C9A84C'; }}
                  onBlur={e => { e.target.parentElement.style.borderColor = '#8B8680'; }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: '48px', width: '100%',
                  padding: '18px 0', background: '#0A0A0A',
                  border: 'none', cursor: 'pointer',
                  fontFamily: '"Jost", sans-serif', fontWeight: 300,
                  fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: '#F8F5F0', transition: 'background 0.4s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#1c1c1c'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#0A0A0A'; }}
              >
                {loading ? 'Sending…' : 'Send OTP →'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <p style={{
                fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: '13px',
                color: '#8B8680', letterSpacing: '0.04em', marginBottom: '32px',
              }}>
                We sent a 6-digit OTP to +91 {mobile}.
              </p>
              <label style={labelStyle}>One-Time Password</label>
              <input
                id="otp"
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="— — — — — —"
                style={{ ...inputStyle, textAlign: 'center', fontSize: '32px', letterSpacing: '0.3em' }}
                onFocus={e => { e.target.style.borderColor = '#C9A84C'; }}
                onBlur={e => { e.target.style.borderColor = '#8B8680'; }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: '48px', width: '100%',
                  padding: '18px 0', background: '#0A0A0A',
                  border: 'none', cursor: 'pointer',
                  fontFamily: '"Jost", sans-serif', fontWeight: 300,
                  fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: '#F8F5F0', transition: 'background 0.4s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#1c1c1c'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#0A0A0A'; }}
              >
                {loading ? 'Verifying…' : 'Verify & Continue →'}
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
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
                Change Number
              </button>
            </form>
          )}
        </div>
      </AnimatedContent>
    </div>
  );
};

export default Login;
