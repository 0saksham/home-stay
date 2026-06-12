import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import ServerWakeUp from './components/ServerWakeUp';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Booking from './pages/Booking';
import Confirmation from './pages/Confirmation';

import MagnetLines from './components/ReactBits/Animations/MagnetLines/MagnetLines';

/* ── AP Editorial Footer ── */
const Footer = () => {
  const col = {
    fontFamily: '"Jost", sans-serif',
    fontWeight: 200,
    fontSize: '13px',
    color: 'rgba(248,245,240,0.5)',
    letterSpacing: '0.05em',
    lineHeight: 1,
    textDecoration: 'none',
    display: 'block',
  };

  const headStyle = {
    fontFamily: '"Jost", sans-serif',
    fontWeight: 300,
    fontSize: '10px',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: '#C9A84C',
    marginBottom: '24px',
    display: 'block',
  };

  return (
    <footer style={{ background: '#0A0A0A', borderTop: '1px solid rgba(201,168,76,0.15)', padding: '80px 8.33% 48px' }}>

      {/* MagnetLines decoration */}
      <div style={{ marginBottom: '64px', opacity: 0.12, pointerEvents: 'none' }}>
        <MagnetLines rows={3} columns={10} containerSize="100%" lineColor="#C9A84C" lineWidth="0.8px" lineBaseLength="30px" baseAngle={0} />
      </div>

      {/* Top grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '48px',
        marginBottom: '64px',
        paddingBottom: '64px',
        borderBottom: '1px solid rgba(248,245,240,0.08)',
      }}>

        {/* Brand */}
        <div>
          <h3 style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontWeight: 300,
            fontSize: '28px',
            color: '#F8F5F0',
            marginBottom: '16px',
            lineHeight: 1.2,
          }}>
            House of<br /><em>Marigold</em>
          </h3>
          <p style={{ ...col, lineHeight: 1.8, maxWidth: '260px', marginBottom: '24px' }}>
            Gandhi Chowk, near Sumitra Bhawan<br />
            Mussoorie, Uttarakhand 248179
          </p>
          <a
            href="https://maps.google.com/?q=Gandhi+Chowk+Mussoorie"
            target="_blank"
            rel="noreferrer"
            style={{ ...col, color: '#C9A84C', marginBottom: '10px' }}
          >
            📍 View on Google Maps
          </a>
          <a href="tel:+919876543210" style={{ ...col, marginTop: '8px' }}>+91 98765 43210</a>
        </div>

        {/* Explore */}
        <div>
          <span style={headStyle}>Explore</span>
          {['Home', 'Our Rooms', 'Gallery', 'Our Story', 'Book Now'].map(l => (
            <p key={l} style={{ marginBottom: '14px' }}>
              <a href="#" style={col}>{l}</a>
            </p>
          ))}
        </div>

        {/* Your Stay */}
        <div>
          <span style={headStyle}>Your Stay</span>
          {['Check-in: 2:00 PM', 'Check-out: 11:00 AM', 'Single Room: ₹2,500/night', 'Double Suite: ₹3,500/night', 'Breakfast Included'].map(i => (
            <p key={i} style={{ ...col, marginBottom: '14px' }}>{i}</p>
          ))}
        </div>

        {/* Nearby */}
        <div>
          <span style={headStyle}>Nearby</span>
          {['Mall Road — 2 min', 'Kempty Falls — 20 min', 'Lal Tibba — 10 min', 'Gun Hill — 15 min', 'Dehradun — 35 km'].map(i => (
            <p key={i} style={{ ...col, marginBottom: '14px' }}>{i}</p>
          ))}
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <p style={{ fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: '11px', color: 'rgba(248,245,240,0.25)', letterSpacing: '0.1em', margin: 0 }}>
          © {new Date().getFullYear()} House of Marigold · Mussoorie, Uttarakhand
        </p>
        <p style={{ fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: '11px', color: 'rgba(248,245,240,0.25)', letterSpacing: '0.1em', margin: 0 }}>
          Available on Booking.com · Direct Reservations Welcome
        </p>
      </div>
    </footer>
  );
};

function App() {
  // Silent ping on mount — wakes Render free-tier server BEFORE user clicks anything
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/health`)
      .catch(() => {}); // fire-and-forget, ignore errors
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/confirmation/:id" element={<Confirmation />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#0A0A0A',
              color: '#F8F5F0',
              fontFamily: '"Jost", sans-serif',
              fontWeight: 200,
              fontSize: '13px',
              letterSpacing: '0.05em',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: 0,
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
