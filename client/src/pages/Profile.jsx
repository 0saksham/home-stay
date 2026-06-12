import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import AnimatedContent from '../components/ReactBits/Animations/AnimatedContent/AnimatedContent';

/* Reusable step indicator (identical to Login's) */
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

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', age: '', city: '',
    id_type: 'Aadhaar', id_number: '', guests_count: 1,
  });

  useEffect(() => {
    if (user?.name) {
      setFormData({
        name: user.name || '', email: user.email || '', age: user.age || '',
        city: user.city || '', id_type: user.id_type || 'Aadhaar',
        id_number: user.id_number || '', guests_count: user.guests_count || 1,
      });
    }
  }, [user]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/user/profile', formData);
      localStorage.setItem('token', res.data.token);
      const userRes = await api.get('/user/me');
      setUser(userRes.data);
      toast.success('Profile saved');
      navigate('/booking');
    } catch { toast.error('Failed to save profile'); }
    finally { setLoading(false); }
  };

  const inputStyle = {
    width: '100%', background: 'transparent',
    border: 'none', borderBottom: '1px solid #8B8680',
    padding: '14px 0', fontFamily: '"Cormorant Garamond", serif',
    fontWeight: 300, fontSize: '20px', color: '#0A0A0A',
    outline: 'none', borderRadius: 0,
    transition: 'border-color 0.3s ease',
  };
  const labelStyle = {
    fontFamily: '"Jost", sans-serif', fontWeight: 200,
    fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase',
    color: '#8B8680', display: 'block', marginBottom: '6px',
  };
  const focusIn = e => { e.target.style.borderColor = '#C9A84C'; };
  const focusOut = e => { e.target.style.borderColor = '#8B8680'; };

  const Field = ({ label, name, type = 'text', required, min, max, placeholder, children }) => (
    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '40px' }}>
      <label style={labelStyle} htmlFor={name}>{label}</label>
      {children || (
        <input
          id={name} name={name} type={type} required={required}
          min={min} max={max} placeholder={placeholder}
          value={formData[name]} onChange={handleChange}
          style={inputStyle} onFocus={focusIn} onBlur={focusOut}
        />
      )}
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh', background: '#F8F5F0',
      padding: '120px 8.33% 80px',
      scrollSnapAlign: 'start',
    }}>
      <BookingSteps active={1} />

      <AnimatedContent distance={40} direction="vertical" reverse={false}
        config={{ tension: 80, friction: 20 }} initialOpacity={0} animateOpacity scale={0.97} animateScale>

        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <span style={{
            fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: '10px',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: '#C9A84C', display: 'block', marginBottom: '24px',
          }}>Step 2 of 4</span>

          <h1 style={{
            fontFamily: '"Cormorant Garamond", serif', fontWeight: 300,
            fontSize: '52px', lineHeight: 1.05, color: '#0A0A0A', marginBottom: '8px',
          }}>
            Guest<br /><em>Profile</em>
          </h1>

          <div style={{ width: '40px', height: '1px', background: '#C9A84C', margin: '32px 0 16px' }} />

          <p style={{
            fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: '14px',
            lineHeight: 1.9, letterSpacing: '0.04em', color: '#8B8680',
            marginBottom: '56px', maxWidth: '480px',
          }}>
            Please complete your profile to proceed. This information is required for check-in formalities.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 48px' }}>
              <Field label="Full Name" name="name" required placeholder="Riya Sharma" />
              <Field label="Email Address" name="email" type="email" required placeholder="riya@example.com" />
              <Field label="Age" name="age" type="number" required min="18" max="120" placeholder="28" />
              <Field label="City / State" name="city" required placeholder="Delhi, NCR" />

              <Field label="ID Proof Type" name="id_type" required>
                <select
                  id="id_type" name="id_type" value={formData.id_type} onChange={handleChange}
                  style={{ ...inputStyle, cursor: 'pointer', appearance: 'none', fontSize: '16px', fontFamily: '"Jost", sans-serif', fontWeight: 200 }}
                  onFocus={focusIn} onBlur={focusOut}
                >
                  {['Aadhaar', 'PAN', 'Passport', 'Driving License'].map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </Field>

              <Field label="ID Number" name="id_number" required placeholder="XXXX XXXX XXXX" />

              <div style={{ gridColumn: '1 / -1', marginBottom: '40px' }}>
                <label style={labelStyle}>Number of Guests</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', paddingTop: '8px' }}>
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, guests_count: n }))}
                      style={{
                        width: '40px', height: '40px',
                        background: formData.guests_count === n ? '#0A0A0A' : 'transparent',
                        border: `1px solid ${formData.guests_count === n ? '#0A0A0A' : '#8B8680'}`,
                        color: formData.guests_count === n ? '#F8F5F0' : '#8B8680',
                        fontFamily: '"Cormorant Garamond", serif', fontWeight: 300,
                        fontSize: '20px', cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '20px 64px', background: '#0A0A0A', border: 'none',
                cursor: 'pointer', fontFamily: '"Jost", sans-serif', fontWeight: 300,
                fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase',
                color: '#F8F5F0', transition: 'background 0.4s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1c1c1c'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#0A0A0A'; }}
            >
              {loading ? 'Saving…' : 'Save & Continue →'}
            </button>
          </form>
        </div>
      </AnimatedContent>
    </div>
  );
};

export default Profile;
