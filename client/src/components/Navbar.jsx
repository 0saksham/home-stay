import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useState, useEffect, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const useWindowSize = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const h = () => setWidth(window.innerWidth);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return width;
};

const NAV_LINKS = [
  { label: 'HOME',    path: '/',        sectionId: null      },
  { label: 'ROOMS',   path: '/',        sectionId: 'rooms'   },
  { label: 'GALLERY', path: '/',        sectionId: 'gallery' },
  { label: 'STORY',   path: '/',        sectionId: 'story'   },
];

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const width = useWindowSize();
  const isMobile = width <= 768;

  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('HOME');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Track which section is in view */
  useEffect(() => {
    if (location.pathname !== '/') return;
    const sectionIds = ['rooms', 'gallery', 'story'];
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const id = e.target.id;
            if (id === 'rooms')   setActiveLink('ROOMS');
            if (id === 'gallery') setActiveLink('GALLERY');
            if (id === 'story')   setActiveLink('STORY');
          }
        });
      },
      { threshold: 0.4 }
    );
    // Also reset to HOME when near top
    const heroObs = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) setActiveLink('HOME'); },
      { threshold: 0.3 }
    );
    const heroEl = document.getElementById('hero');
    if (heroEl) heroObs.observe(heroEl);
    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => { observer.disconnect(); heroObs.disconnect(); };
  }, [location.pathname]);

  const scrollToSection = useCallback((sectionId, label) => {
    setMobileOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation then scroll
      setTimeout(() => {
        const el = document.getElementById(sectionId || 'hero');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } else {
      const el = document.getElementById(sectionId || 'hero');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setActiveLink(label);
  }, [location.pathname, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  /* Styles */
  const navStyle = {
    position: 'fixed', top: 0, left: 0, right: 0,
    height: '72px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 6%',
    zIndex: 100,
    transition: 'background 0.5s ease, box-shadow 0.5s ease',
    background: scrolled ? 'rgba(10,10,10,0.94)' : 'transparent',
    backdropFilter: scrolled ? 'blur(16px)' : 'none',
    boxShadow: scrolled ? '0 1px 0 rgba(201,168,76,0.12)' : 'none',
  };

  const makeLinkStyle = (label) => ({
    fontFamily: '"Jost", sans-serif',
    fontWeight: activeLink === label ? 300 : 200,
    fontSize: '11px',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: activeLink === label ? '#C9A84C' : '#F8F5F0',
    textDecoration: 'none',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: '4px 0',
    position: 'relative',
    transition: 'color 0.3s ease',
    /* Active underline */
    ...(activeLink === label && {
      borderBottom: '1px solid #C9A84C',
      paddingBottom: '3px',
    }),
  });

  return (
    <>
      <nav style={navStyle}>
        {/* Wordmark — styled with depth */}
        <button
          onClick={() => scrollToSection(null, 'HOME')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            fontFamily: '"Cormorant Garamond", serif',
            fontWeight: 300,
            fontSize: isMobile ? '16px' : '19px',
            letterSpacing: '0.08em',
            color: '#F8F5F0',
            whiteSpace: 'nowrap',
            textShadow: '0 2px 12px rgba(0,0,0,0.5)',
            transition: 'color 0.3s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#C9A84C'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#F8F5F0'; }}
        >
          HOUSE{' '}
          <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>of</em>
          {' '}MARIGOLD
        </button>

        {/* Desktop: center links */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '36px', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            {NAV_LINKS.map(({ label, sectionId }) => (
              <button
                key={label}
                onClick={() => scrollToSection(sectionId, label)}
                style={makeLinkStyle(label)}
                onMouseEnter={e => { if (activeLink !== label) e.currentTarget.style.color = 'rgba(201,168,76,0.8)'; }}
                onMouseLeave={e => { if (activeLink !== label) e.currentTarget.style.color = '#F8F5F0'; }}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Right side */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            {user && (
              <span style={{
                fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: '11px',
                letterSpacing: '0.1em', color: 'rgba(248,245,240,0.55)',
              }}>
                {user.name?.split(' ')[0] || 'Guest'}
              </span>
            )}
            {user && (
              <button onClick={handleLogout} style={{
                fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: '11px',
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: 'rgba(248,245,240,0.5)', background: 'none', border: 'none', cursor: 'pointer',
                transition: 'color 0.3s',
              }}
                onMouseEnter={e => { e.currentTarget.style.color = '#C9A84C'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(248,245,240,0.5)'; }}
              >
                SIGN OUT
              </button>
            )}
            <Link
              to="/login"
              style={{
                fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: '11px',
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: '#C9A84C', textDecoration: 'none',
                borderBottom: '1px solid rgba(201,168,76,0.45)',
                paddingBottom: '3px',
                transition: 'border-color 0.3s, color 0.3s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#C9A84C'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.45)'; }}
            >
              {user ? 'RESERVE' : 'RESERVE NOW'}
            </Link>
          </div>
        )}

        {/* Mobile: hamburger */}
        {isMobile && (
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '7px', padding: '4px' }}
          >
            <span style={{ display: 'block', width: '22px', height: '1px', background: '#C9A84C', transition: 'all 0.3s' }} />
            <span style={{ display: 'block', width: '22px', height: '1px', background: '#C9A84C', transition: 'all 0.3s' }} />
          </button>
        )}
      </nav>

      {/* Mobile fullscreen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: '#0A0A0A',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '44px',
            }}
          >
            <button
              onClick={() => setMobileOpen(false)}
              style={{
                position: 'absolute', top: '28px', right: '6%',
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: '"Jost", sans-serif', fontWeight: 200,
                fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase',
                color: 'rgba(248,245,240,0.45)',
              }}
            >
              CLOSE ×
            </button>

            {NAV_LINKS.map(({ label, sectionId }) => (
              <button
                key={label}
                onClick={() => scrollToSection(sectionId, label)}
                style={{
                  fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic',
                  fontWeight: 300, fontSize: '38px',
                  color: activeLink === label ? '#C9A84C' : '#F8F5F0',
                  background: 'none', border: 'none', cursor: 'pointer',
                  transition: 'color 0.3s ease', letterSpacing: '0.02em',
                }}
              >
                {label.charAt(0) + label.slice(1).toLowerCase()}
              </button>
            ))}

            <div style={{ width: '36px', height: '1px', background: 'rgba(201,168,76,0.3)' }} />

            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              style={{
                fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: '11px',
                letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C',
                textDecoration: 'none', borderBottom: '1px solid rgba(201,168,76,0.4)', paddingBottom: '6px',
              }}
            >
              RESERVE NOW
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
