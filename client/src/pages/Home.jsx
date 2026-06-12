import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';

import SplitText from '../components/ReactBits/TextAnimations/SplitText/SplitText';
import TextType from '../components/ReactBits/TextAnimations/TextType/TextType';
import ScrollVelocity from '../components/ReactBits/TextAnimations/ScrollVelocity/ScrollVelocity';
import Beams from '../components/ReactBits/Backgrounds/Beams/Beams';
import CountUp from '../components/ReactBits/TextAnimations/CountUp/CountUp';
import FadeContent from '../components/ReactBits/Animations/FadeContent/FadeContent';

/* ── Real user images ── */
import heroImg      from '../assets/images/hero.png';
import singleRoomImg from '../assets/images/single-room.jpg';
import doubleRoomImg from '../assets/images/double-room.jpg';
import gallery1 from '../assets/images/gallery-1.jpg';
import gallery2 from '../assets/images/gallery-2.jpg';
import gallery3 from '../assets/images/gallery-3.jpg';
import gallery4 from '../assets/images/gallery-4.jpg';
import gallery5 from '../assets/images/gallery-5.jpg';
import gallery6 from '../assets/images/gallery-6.jpg';

/* ── Shared style tokens ── */
const S = {
  eyebrow: {
    fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: '10px',
    letterSpacing: '0.22em', textTransform: 'uppercase',
    color: '#C9A84C', marginBottom: '24px', display: 'block',
    textShadow: '0 1px 6px rgba(0,0,0,0.6)',
  },
  rule: { width: '40px', height: '1px', background: '#C9A84C', margin: '32px 0' },
  h2light: {
    fontFamily: '"Cormorant Garamond", serif', fontWeight: 300, fontSize: '52px',
    lineHeight: 1.05, letterSpacing: '-0.01em',
  },
  bodyStone: {
    fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: '14px',
    lineHeight: 1.9, letterSpacing: '0.03em', color: '#6E6963',
  },
  amenityTag: {
    fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: '10px',
    letterSpacing: '0.15em', textTransform: 'uppercase',
    borderBottom: '1px solid #C9A84C', paddingBottom: '4px',
  },
};

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ overflowX: 'hidden', background: '#F8F5F0' }}>

      {/* ═══════════════════════════════════════════════════════
          HERO — full viewport, real image background
      ═══════════════════════════════════════════════════════ */}
      <section id="hero" style={{
        height: '100vh', position: 'relative', overflow: 'hidden',
        scrollSnapAlign: 'start',
      }}>
        {/* Background image */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <img
            src={heroImg}
            alt="House of Marigold — Mussoorie valley view"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }}
          />
          {/* Heavy dark overlay so text is always readable */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(5,5,5,0.72) 0%, rgba(5,5,5,0.38) 35%, rgba(5,5,5,0.45) 60%, rgba(5,5,5,0.92) 100%)',
          }} />
          {/* Side vignette */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(5,5,5,0.55) 100%)',
          }} />
        </div>

        {/* Bottom-left hero content */}
        <div style={{
          position: 'absolute', bottom: '10%', left: '8.33%', maxWidth: '700px',
        }}>
          {/* Eyebrow — bigger + pill bg for contrast */}
          <span style={{
            display: 'inline-block',
            fontFamily: '"Jost", sans-serif', fontWeight: 400, fontSize: '12px',
            letterSpacing: '0.25em', textTransform: 'uppercase',
            color: '#C9A84C',
            background: 'rgba(5,5,5,0.45)',
            backdropFilter: 'blur(6px)',
            padding: '6px 14px',
            marginBottom: '28px',
            border: '1px solid rgba(201,168,76,0.35)',
          }}>Gandhi Chowk · Mussoorie, Uttarakhand</span>

          {/* Main headline — larger, heavier, stronger shadow */}
          <SplitText
            text="A Home Above the Clouds"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontWeight: 500,
              fontSize: 'clamp(52px,6.5vw,96px)',
              lineHeight: 1.02,
              letterSpacing: '-0.02em',
              color: '#FFFFFF',
              display: 'block',
              marginBottom: '24px',
              textShadow: '0 2px 32px rgba(0,0,0,0.9), 0 1px 6px rgba(0,0,0,1)',
            }}
            delay={70}
            animationFrom={{ opacity: 0, transform: 'translateY(24px)' }}
            animationTo={{ opacity: 1, transform: 'translateY(0)' }}
            easing="easeOutCubic"
            threshold={0.1}
            rootMargin="-20px"
          />

          {/* Subline — white, clearly readable */}
          <div style={{ minHeight: '28px', marginBottom: '44px' }}>
            <TextType
              text={[
                'Where every morning begins with Himalayan views.',
                "Mussoorie's most beloved hillside home.",
                'Marigolds in bloom. Mountains at your window.',
                'Walk to Mall Road. Wake up to the valley.',
              ]}
              style={{
                fontFamily: '"Jost", sans-serif',
                fontWeight: 400,
                fontSize: '17px',
                letterSpacing: '0.05em',
                color: 'rgba(255,255,255,0.95)',
                display: 'block',
                textShadow: '0 1px 12px rgba(0,0,0,1), 0 0 4px rgba(0,0,0,0.9)',
              }}
              typingSpeed={55}
              deletingSpeed={28}
            />
          </div>

          {/* CTA */}
          <button
            onClick={() => navigate('/login')}
            style={{
              fontFamily: '"Jost", sans-serif', fontWeight: 400, fontSize: '12px',
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: '#FFFFFF', background: 'rgba(201,168,76,0.15)',
              border: '1px solid rgba(201,168,76,0.7)',
              backdropFilter: 'blur(4px)',
              padding: '14px 32px',
              cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: '14px',
              transition: 'background 0.4s ease, gap 0.4s ease, border-color 0.4s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(201,168,76,0.3)';
              e.currentTarget.style.gap = '22px';
              e.currentTarget.style.borderColor = '#C9A84C';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(201,168,76,0.15)';
              e.currentTarget.style.gap = '14px';
              e.currentTarget.style.borderColor = 'rgba(201,168,76,0.7)';
            }}
          >
            Reserve Your Stay <span style={{ fontSize: '18px' }}>→</span>
          </button>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: '28px', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
        }}>
          <p style={{
            fontFamily: '"Jost", sans-serif', fontWeight: 400, fontSize: '9px',
            letterSpacing: '0.28em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.7)', margin: 0,
            textShadow: '0 1px 6px rgba(0,0,0,0.9)',
          }}>Scroll</p>
          <div style={{
            width: '1px', height: '40px',
            background: 'linear-gradient(to bottom, #C9A84C, transparent)',
            animation: 'scrollLine 1.8s ease-in-out infinite',
          }} />
        </div>

        {/* Right-side editorial badge */}
        <div style={{
          position: 'absolute', bottom: '10%', right: '8.33%',
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px',
        }}>
          <div style={{
            fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic',
            fontWeight: 400, fontSize: '14px',
            color: 'rgba(201,168,76,1)',
            letterSpacing: '0.08em',
            textShadow: '0 1px 10px rgba(0,0,0,0.9)',
          }}>Est. in the Hills</div>
          <div style={{
            width: '1px', height: '48px',
            background: 'linear-gradient(to bottom, rgba(201,168,76,0.7), transparent)',
          }} />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SCROLL VELOCITY STRIP
      ═══════════════════════════════════════════════════════ */}
      <section style={{
        background: '#0A0A0A',
        padding: '28px 0',
        overflow: 'hidden',
        borderTop: '1px solid rgba(201,168,76,0.2)',
        borderBottom: '1px solid rgba(201,168,76,0.2)',
      }}>
        <ScrollVelocity
          texts={[
            'House of Marigold  ✦  Mussoorie  ✦  Est. in the Hills  ✦  Gandhi Chowk  ✦  Himalayan Views  ✦  Pahadi Cuisine  ✦  Mall Road — 2 min walk  ✦  ',
          ]}
          velocity={28}
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: '26px',
            color: 'rgba(201,168,76,0.7)',
            letterSpacing: '0.04em',
            whiteSpace: 'nowrap',
          }}
        />
      </section>

      {/* ═══════════════════════════════════════════════════════
          ROOM 01 — image left, warm text right
      ═══════════════════════════════════════════════════════ */}
      <FadeContent blur={false} duration={900} easing="ease-out" initialOpacity={0} threshold={0.08}>
        <section id="rooms" style={{
          minHeight: '100vh',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          scrollSnapAlign: 'start',
          overflow: 'hidden',
        }}
          className="room-grid"
        >
          {/* Image panel with depth */}
          <div style={{
            position: 'relative', overflow: 'hidden',
            boxShadow: 'inset -8px 0 32px rgba(0,0,0,0.15)',
          }}>
            <img
              src={singleRoomImg}
              alt="The Hilltop Room — Single occupancy"
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                transition: 'transform 1s ease',
              }}
              onMouseEnter={e => { e.target.style.transform = 'scale(1.05)'; }}
              onMouseLeave={e => { e.target.style.transform = 'scale(1)'; }}
            />
            {/* Subtle dark vignette on image */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,10,10,0.3) 100%)',
              pointerEvents: 'none',
            }} />
            {/* Room number watermark */}
            <span style={{
              position: 'absolute', top: '36px', left: '36px',
              fontFamily: '"Cormorant Garamond", serif', fontWeight: 300,
              fontSize: '88px', color: 'rgba(255,255,255,0.08)',
              lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
              textShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}>01</span>
            {/* Bottom caption */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              padding: '60px 36px 28px',
              background: 'linear-gradient(to top, rgba(10,10,10,0.7) 0%, transparent 100%)',
            }}>
              <span style={{
                fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: '10px',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: 'rgba(201,168,76,0.9)',
              }}>The Hilltop Room</span>
            </div>
          </div>

          {/* Text panel */}
          <div style={{
            background: '#F8F5F0',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            padding: '80px 72px',
            /* Subtle left-edge shadow for depth */
            boxShadow: 'inset 4px 0 20px rgba(0,0,0,0.04)',
          }}>
            <span style={S.eyebrow}>Single Occupancy</span>

            <h2 style={{
              ...S.h2light,
              color: '#0A0A0A', marginBottom: '8px',
              /* Heading depth */
              textShadow: '0 1px 2px rgba(0,0,0,0.08)',
            }}>
              The Hilltop<br /><em style={{ color: '#C9A84C' }}>Room</em>
            </h2>

            <div style={S.rule} />

            <p style={{ ...S.bodyStone, marginBottom: '40px', maxWidth: '380px' }}>
              A cozy, elegantly furnished room overlooking the Mussoorie valley.
              Plush queen bed, private bathroom, and a window that frames the
              Himalayas like a painting. Perfect for solo travelers and couples
              seeking quiet luxury.
            </p>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '48px', flexWrap: 'wrap' }}>
              {['Valley View', 'Free WiFi', 'Breakfast', 'Private Bath'].map(a => (
                <span key={a} style={{ ...S.amenityTag, color: '#6E6963' }}>{a}</span>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '32px', flexWrap: 'wrap' }}>
              <div>
                <span style={{
                  fontFamily: '"Cormorant Garamond", serif', fontWeight: 300,
                  fontSize: '44px', color: '#0A0A0A', letterSpacing: '-0.02em',
                  display: 'inline-flex', alignItems: 'baseline', gap: '2px',
                }}>
                  ₹<CountUp from={0} to={2500} separator="," duration={1.5} />
                </span>
                <span style={{
                  fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: '11px',
                  letterSpacing: '0.1em', color: '#8B8680', marginLeft: '8px',
                }}>per night</span>
              </div>
              <button
                onClick={() => navigate('/login')}
                style={{
                  fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: '11px',
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: '#0A0A0A', background: 'none', border: 'none',
                  borderBottom: '1px solid #0A0A0A', paddingBottom: '4px',
                  cursor: 'pointer', transition: 'color 0.3s, border-color 0.3s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#C9A84C'; e.currentTarget.style.borderColor = '#C9A84C'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#0A0A0A'; e.currentTarget.style.borderColor = '#0A0A0A'; }}
              >
                Book This Room →
              </button>
            </div>
          </div>
        </section>
      </FadeContent>

      {/* ═══════════════════════════════════════════════════════
          ROOM 02 — dark text left, image right
      ═══════════════════════════════════════════════════════ */}
      <FadeContent blur={false} duration={900} easing="ease-out" initialOpacity={0} threshold={0.08}>
        <section style={{
          minHeight: '100vh',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          scrollSnapAlign: 'start',
          overflow: 'hidden',
        }}
          className="room-grid"
        >
          {/* Text panel — dark */}
          <div style={{
            background: '#0A0A0A',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            padding: '80px 72px',
            boxShadow: 'inset -4px 0 20px rgba(0,0,0,0.3)',
          }}>
            <span style={{ ...S.eyebrow, textShadow: 'none' }}>Double Suite</span>

            <h2 style={{
              ...S.h2light,
              color: '#F8F5F0', marginBottom: '8px',
              textShadow: '0 2px 12px rgba(0,0,0,0.5)',
            }}>
              The Marigold<br /><em style={{ color: '#C9A84C' }}>Suite</em>
            </h2>

            <div style={S.rule} />

            <p style={{
              ...S.bodyStone,
              color: 'rgba(248,245,240,0.68)',
              marginBottom: '40px', maxWidth: '380px',
            }}>
              Two connected rooms with a private balcony overlooking the garden.
              Ideal for families or groups who want space without sacrificing
              warmth. Wake up to marigolds and mountain mist every morning.
            </p>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '48px', flexWrap: 'wrap' }}>
              {['Private Balcony', 'Garden View', 'Breakfast', '2 Bedrooms'].map(a => (
                <span key={a} style={{ ...S.amenityTag, color: 'rgba(248,245,240,0.52)' }}>{a}</span>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '32px', flexWrap: 'wrap' }}>
              <div>
                <span style={{
                  fontFamily: '"Cormorant Garamond", serif', fontWeight: 300,
                  fontSize: '44px', color: '#F8F5F0', letterSpacing: '-0.02em',
                  display: 'inline-flex', alignItems: 'baseline', gap: '2px',
                }}>
                  ₹<CountUp from={0} to={3500} separator="," duration={1.5} />
                </span>
                <span style={{
                  fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: '11px',
                  letterSpacing: '0.1em', color: 'rgba(248,245,240,0.38)', marginLeft: '8px',
                }}>per night</span>
              </div>
              <button
                onClick={() => navigate('/login')}
                style={{
                  fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: '11px',
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: '#F8F5F0', background: 'none', border: 'none',
                  borderBottom: '1px solid rgba(248,245,240,0.38)', paddingBottom: '4px',
                  cursor: 'pointer', transition: 'color 0.3s, border-color 0.3s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#C9A84C'; e.currentTarget.style.borderColor = '#C9A84C'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#F8F5F0'; e.currentTarget.style.borderColor = 'rgba(248,245,240,0.38)'; }}
              >
                Book This Room →
              </button>
            </div>
          </div>

          {/* Image panel */}
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <img
              src={doubleRoomImg}
              alt="The Marigold Suite — Double occupancy"
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                transition: 'transform 1s ease',
              }}
              onMouseEnter={e => { e.target.style.transform = 'scale(1.05)'; }}
              onMouseLeave={e => { e.target.style.transform = 'scale(1)'; }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,10,10,0.3) 100%)',
              pointerEvents: 'none',
            }} />
            <span style={{
              position: 'absolute', top: '36px', right: '36px',
              fontFamily: '"Cormorant Garamond", serif', fontWeight: 300,
              fontSize: '88px', color: 'rgba(255,255,255,0.08)',
              lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
            }}>02</span>
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              padding: '60px 36px 28px',
              background: 'linear-gradient(to top, rgba(10,10,10,0.65) 0%, transparent 100%)',
            }}>
              <span style={{
                fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: '10px',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: 'rgba(201,168,76,0.9)',
              }}>The Marigold Suite</span>
            </div>
          </div>
        </section>
      </FadeContent>

      {/* ═══════════════════════════════════════════════════════
          STORY SECTION
      ═══════════════════════════════════════════════════════ */}
      <FadeContent blur={false} duration={900} easing="ease-out" initialOpacity={0} threshold={0.06}>
        <section id="story" style={{
          minHeight: '100vh',
          background: '#F8F5F0',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          alignItems: 'stretch',
          scrollSnapAlign: 'start',
          overflow: 'hidden',
        }}
          className="room-grid"
        >
          {/* Left — pull quote */}
          <div style={{
            padding: '120px 72px 120px 8.33%',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
          }}>
            <span style={{ ...S.eyebrow, textShadow: 'none' }}>Our Story</span>

            <blockquote style={{
              fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic',
              fontWeight: 300, fontSize: 'clamp(26px,3.2vw,42px)',
              lineHeight: 1.35, color: '#0A0A0A', margin: 0, marginBottom: '48px',
              borderLeft: '2px solid #C9A84C', paddingLeft: '32px',
            }}>
              "A house where strangers arrive and friends leave."
            </blockquote>

            <p style={{ ...S.bodyStone, maxWidth: '420px', marginBottom: '56px' }}>
              Nestled at Gandhi Chowk in the heart of Mussoorie, House of Marigold
              is not a hotel — it's a home that happens to have two beautiful rooms.
              Named after the marigold garden that fills every window with color,
              we offer something no hotel can: the feeling of being genuinely welcomed.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', maxWidth: '380px' }}>
              {[
                { num: '2 min', label: 'Walk to Mall Road'   },
                { num: '∞',     label: 'Valley Views'         },
                { num: '365',   label: 'Days of Hospitality'  },
                { num: '100%',  label: 'Home Cooked Meals'    },
              ].map(s => (
                <div key={s.label}>
                  <p style={{
                    fontFamily: '"Cormorant Garamond", serif', fontWeight: 300,
                    fontSize: '38px', color: '#C9A84C', margin: '0 0 6px', lineHeight: 1,
                  }}>{s.num}</p>
                  <p style={{
                    fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: '10px',
                    letterSpacing: '0.12em', color: '#8B8680', margin: 0,
                    textTransform: 'uppercase',
                  }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Beams + features list */}
          <div style={{
            height: '100%', position: 'relative',
            background: '#1A2E1A', overflow: 'hidden', minHeight: '600px',
          }}>
            <div style={{ position: 'absolute', inset: 0 }}>
              <Beams
                beamWidth={1.5} beamHeight={15} beamNumber={8}
                lightColor="#C9A84C" speed={1.5} noiseIntensity={1.2}
                scale={0.15} rotation={30}
              />
            </div>
            {/* Deep green vignette */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse at center, transparent 30%, rgba(10,20,10,0.5) 100%)',
              pointerEvents: 'none',
            }} />

            <div style={{
              position: 'relative', zIndex: 2,
              padding: '80px 56px',
              height: '100%', display: 'flex', flexDirection: 'column',
              justifyContent: 'center', gap: '44px',
            }}>
              {[
                { icon: '🌄', title: 'Himalayan Valley Views',  desc: 'Wake up to breathtaking panoramas of the Mussoorie valley from every room.' },
                { icon: '🌼', title: 'Marigold Garden',         desc: 'Our signature garden blooms year-round — a carpet of gold at your feet.' },
                { icon: '🍱', title: 'Pahadi Home Cooking',     desc: 'Authentic aloo ke gutke, kafuli, and fresh chai made in our own kitchen.' },
                { icon: '📍', title: 'Steps from Mall Road',    desc: 'Gandhi Chowk puts Kempty Falls, Lal Tibba, and all of Mussoorie at your doorstep.' },
              ].map(f => (
                <div key={f.title} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '18px', marginTop: '3px', flexShrink: 0 }}>{f.icon}</span>
                  <div>
                    <h4 style={{
                      fontFamily: '"Cormorant Garamond", serif', fontWeight: 400,
                      fontSize: '22px', color: '#C9A84C', margin: '0 0 8px', lineHeight: 1.2,
                      textShadow: '0 1px 8px rgba(0,0,0,0.5)',
                    }}>{f.title}</h4>
                    <p style={{
                      fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: '13px',
                      lineHeight: 1.85, color: 'rgba(248,245,240,0.75)', margin: 0,
                    }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeContent>

      {/* ═══════════════════════════════════════════════════════
          GALLERY — real user photos
      ═══════════════════════════════════════════════════════ */}
      <FadeContent blur={false} duration={900} easing="ease-out" initialOpacity={0} threshold={0.04}>
        <section id="gallery" style={{
          background: '#0A0A0A',
          padding: '120px 8.33%',
          scrollSnapAlign: 'start',
        }}>
          {/* Section header */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            marginBottom: '64px', paddingBottom: '32px',
            borderBottom: '1px solid rgba(201,168,76,0.18)',
            flexWrap: 'wrap', gap: '32px',
          }}>
            <div>
              <span style={{ ...S.eyebrow, marginBottom: '16px', textShadow: 'none' }}>The Property</span>
              <h2 style={{
                fontFamily: '"Cormorant Garamond", serif', fontWeight: 300, fontSize: '52px',
                color: '#F8F5F0', margin: 0, lineHeight: 1.05,
                textShadow: '0 2px 12px rgba(0,0,0,0.4)',
              }}>
                Explore the<br /><em style={{ color: '#C9A84C' }}>Marigold World</em>
              </h2>
            </div>
            <p style={{
              fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: '13px',
              color: 'rgba(248,245,240,0.45)', maxWidth: '280px',
              textAlign: 'right', lineHeight: 1.85, margin: 0,
            }}>
              Every corner of House of Marigold tells a story.
              Explore the spaces that will become your home.
            </p>
          </div>

          {/* Primary row: large + 2 stacked */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3px', marginBottom: '3px' }}
            className="gallery-row-1">
            {/* Large image */}
            <GalleryImg src={gallery1} caption="Marigold Garden" height="520px" />
            {/* Stacked pair */}
            <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '3px' }}>
              <GalleryImg src={gallery2} caption="Valley Vista" height="100%" />
              <GalleryImg src={gallery3} height="100%" />
            </div>
          </div>

          {/* Secondary row: 3 equal */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '3px' }}
            className="gallery-row-2">
            <GalleryImg src={gallery4} caption="The Rooms" height="300px" />
            <GalleryImg src={gallery5} caption="Morning Views" height="300px" />
            <GalleryImg src={gallery6} height="300px" />
          </div>
        </section>
      </FadeContent>

      {/* ── Responsive + utility overrides ── */}
      <style>{`
        @media (max-width: 767px) {
          .room-grid { grid-template-columns: 1fr !important; }
          .gallery-row-1 { grid-template-columns: 1fr !important; }
          .gallery-row-2 { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
};

/* ── Reusable gallery image with hover zoom + caption ── */
const GalleryImg = ({ src, caption, height = '320px' }) => (
  <div style={{
    position: 'relative', overflow: 'hidden',
    height, cursor: 'pointer',
  }}>
    <img
      src={src}
      alt={caption || 'House of Marigold'}
      style={{
        width: '100%', height: '100%', objectFit: 'cover',
        transition: 'transform 1.1s ease',
        display: 'block',
      }}
      onMouseEnter={e => { e.target.style.transform = 'scale(1.07)'; }}
      onMouseLeave={e => { e.target.style.transform = 'scale(1)'; }}
    />
    {/* Hover overlay */}
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(to top, rgba(10,10,10,0.7) 0%, transparent 50%)',
      opacity: 0, transition: 'opacity 0.5s ease',
    }}
      onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = '0'; }}
    />
    {caption && (
      <div style={{
        position: 'absolute', bottom: '18px', left: '18px',
        fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: '10px',
        letterSpacing: '0.2em', textTransform: 'uppercase',
        color: 'rgba(248,245,240,0.85)',
        textShadow: '0 1px 6px rgba(0,0,0,0.8)',
      }}>{caption}</div>
    )}
  </div>
);

export default Home;
