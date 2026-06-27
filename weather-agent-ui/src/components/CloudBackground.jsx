import React from 'react'

const CLOUDS = [
  { w: 180, h: 50, top: '8%',  dur: '55s', delay: '0s',   opacity: 0.65,
    before: { w: 80,  h: 60, top: -25, left: 20 },
    after:  { w: 60,  h: 45, top: -18, left: 80 } },
  { w: 120, h: 35, top: '18%', dur: '72s', delay: '-22s',  opacity: 0.45,
    before: { w: 55,  h: 45, top: -18, left: 15 },
    after:  { w: 45,  h: 35, top: -12, left: 55 } },
  { w: 220, h: 60, top: '5%',  dur: '95s', delay: '-45s',  opacity: 0.35,
    before: { w: 100, h: 75, top: -30, left: 30 },
    after:  { w: 80,  h: 60, top: -22, left: 105 } },
  { w: 100, h: 30, top: '28%', dur: '68s', delay: '-12s',  opacity: 0.5,
    before: { w: 48,  h: 40, top: -14, left: 12 },
    after:  { w: 38,  h: 30, top: -10, left: 48 } },
]

export default function CloudBackground() {
  return (
    <div style={{
      position: 'fixed', inset: 0, pointerEvents: 'none',
      zIndex: 0, overflow: 'hidden',
    }}>
      {/* Sky gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(ellipse 80% 40% at 20% -10%, rgba(197,213,255,0.55) 0%, transparent 70%),
          radial-gradient(ellipse 60% 30% at 85% 5%, rgba(245,201,78,0.12) 0%, transparent 60%),
          linear-gradient(180deg, #EEF4FF 0%, #F8FAFF 100%)
        `,
      }} />

      {/* Clouds */}
      {CLOUDS.map((c, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: c.top,
            left: -c.w - 20,
            width: c.w,
            height: c.h,
            borderRadius: 50,
            background: 'rgba(255,255,255,0.78)',
            filter: 'blur(0.8px)',
            opacity: c.opacity,
            animation: `drift ${c.dur} linear infinite`,
            animationDelay: c.delay,
          }}
        >
          {/* puff 1 */}
          <div style={{
            position: 'absolute',
            width: c.before.w, height: c.before.h,
            top: c.before.top, left: c.before.left,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.78)',
          }} />
          {/* puff 2 */}
          <div style={{
            position: 'absolute',
            width: c.after.w, height: c.after.h,
            top: c.after.top, left: c.after.left,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.78)',
          }} />
        </div>
      ))}
    </div>
  )
}
