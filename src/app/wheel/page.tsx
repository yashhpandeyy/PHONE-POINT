'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/auth-guard';
import { Trophy, X, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

const SEGMENTS = [
    { label: '₹500 OFF', line1: '₹500', line2: 'OFF', bg: '#0a1744' },
    { label: 'FREE GLASS', line1: 'FREE', line2: 'GLASS', bg: '#122a6b' },
    { label: '10% OFF', line1: '10%', line2: 'OFF', bg: '#0a1744' },
    { label: 'B1G1 COVER', line1: 'B1G1', line2: 'COVER', bg: '#122a6b' },
    { label: 'FREE DELIVERY', line1: 'FREE', line2: 'DELIVERY', bg: '#0a1744' },
    { label: 'VIP SUPPORT', line1: 'VIP', line2: 'SUPPORT', bg: '#122a6b' },
];

const SEG_COUNT = SEGMENTS.length;
const SEG_ANGLE = 360 / SEG_COUNT;

function easeInOutQuart(t: number) {
    return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
}

const STARS = [...Array(60)].map(() => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 0.5,
    delay: Math.random() * 5,
    dur: Math.random() * 3 + 2,
}));

export default function LuckyWheelPage() {
    const router = useRouter();
    const [angle, setAngle] = useState(0);
    const [spinning, setSpinning] = useState(false);
    const [winner, setWinner] = useState<typeof SEGMENTS[0] | null>(null);
    const [showOverlay, setShowOverlay] = useState(false);
    const [bulbFlip, setBulbFlip] = useState(false);
    const rafRef = useRef<number>(0);

    useEffect(() => () => cancelAnimationFrame(rafRef.current), []);
    useEffect(() => {
        const iv = setInterval(() => setBulbFlip(f => !f), 600);
        return () => clearInterval(iv);
    }, []);

    const spin = useCallback(() => {
        if (spinning) return;
        setSpinning(true);
        setWinner(null);
        setShowOverlay(false);

        const winIdx = Math.floor(Math.random() * SEG_COUNT);
        const segCenter = winIdx * SEG_ANGLE + SEG_ANGLE / 2;
        // Wheel rotates clockwise. Pointer (top) reads position (360 - R%360) on the wheel.
        // To land on segment winIdx center, we need: endAngle%360 = (360 - segCenter)
        const targetMod = ((360 - segCenter) % 360 + 360) % 360;
        const currentMod = ((angle % 360) + 360) % 360;
        const adjustment = ((targetMod - currentMod) % 360 + 360) % 360;
        const fullTurns = 360 * (8 + Math.floor(Math.random() * 4));
        const totalDelta = fullTurns + adjustment;
        const startAngle = angle;
        const endAngle = startAngle + totalDelta;
        const duration = 7000;
        const startTime = performance.now();

        const animate = (now: number) => {
            const elapsed = now - startTime;
            const t = Math.min(elapsed / duration, 1);
            const current = startAngle + totalDelta * easeInOutQuart(t);
            setAngle(current);
            if (t < 1) {
                rafRef.current = requestAnimationFrame(animate);
            } else {
                setAngle(endAngle);
                setSpinning(false);
                setWinner(SEGMENTS[winIdx]);
                setTimeout(() => setShowOverlay(true), 400);
            }
        };
        rafRef.current = requestAnimationFrame(animate);
    }, [spinning, angle]);

    const segPaths = SEGMENTS.map((seg, i) => {
        const a1 = ((i * SEG_ANGLE - 90) * Math.PI) / 180;
        const a2 = (((i + 1) * SEG_ANGLE - 90) * Math.PI) / 180;
        const r = 50, cx = 50, cy = 50;
        const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
        const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
        const aMid = ((i * SEG_ANGLE + SEG_ANGLE / 2 - 90) * Math.PI) / 180;
        const tx = cx + 33 * Math.cos(aMid), ty = cy + 33 * Math.sin(aMid);
        const textRotation = i * SEG_ANGLE + SEG_ANGLE / 2;
        return { seg, x1, y1, x2, y2, tx, ty, textRotation };
    });

    const BULB_COUNT = 24;
    const bulbs = [...Array(BULB_COUNT)].map((_, i) => {
        const a = (i * (360 / BULB_COUNT) * Math.PI) / 180;
        return { x: 50 + Math.sin(a) * 50, y: 50 - Math.cos(a) * 50 };
    });

    return (
        <AuthGuard>
            <div className="fixed inset-0 bg-[#020518] overflow-hidden flex flex-col lg:flex-row items-center justify-center">

                {/* ── Back Arrow ── */}
                <button
                    onClick={() => router.push('/')}
                    className="absolute top-6 left-6 z-50 p-3 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>

                {/* ── Starfield Background ── */}
                <div className="absolute inset-0 pointer-events-none">
                    {STARS.map((s, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full bg-white"
                            style={{
                                width: s.size, height: s.size,
                                top: `${s.y}%`, left: `${s.x}%`,
                                opacity: 0,
                                animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
                            }}
                        />
                    ))}
                </div>

                {/* ── Ambient glows ── */}
                <div className="absolute top-0 left-0 w-[50vw] h-[50vh] bg-blue-600/8 rounded-full blur-[250px]" />
                <div className="absolute bottom-0 right-0 w-[50vw] h-[50vh] bg-indigo-500/8 rounded-full blur-[250px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35vw] h-[35vh] bg-primary/5 rounded-full blur-[180px]" />

                {/* ── Mobile Header (above wheel, phone only) ── */}
                <div className="flex lg:hidden flex-col items-center text-center z-10 mb-4 mt-16">
                    <p className="text-primary/70 text-xs font-black tracking-[0.4em] uppercase mb-1">Celebrating · Since 2025</p>
                    <h2 className="text-gold-shine text-3xl font-black italic leading-tight">HAPPY 1 YEAR ANNIVERSARY</h2>
                    <p className="text-white/30 text-sm font-black tracking-[0.3em] italic mt-1">PHONE POINT</p>
                </div>

                {/* ── Left Side Text (desktop only, left-aligned) ── */}
                <div className="absolute left-10 top-1/2 -translate-y-1/2 text-left z-10 hidden lg:flex flex-col gap-4 max-w-[240px]">
                    <p className="text-primary/70 text-base font-black tracking-[0.5em] uppercase">Since 2025</p>
                    <h2 className="text-white text-8xl font-black italic leading-[0.85]">
                        SPIN<br />
                        <span className="text-primary">&</span><br />
                        WIN
                    </h2>
                    <div className="w-16 h-1.5 bg-gradient-to-r from-primary to-transparent rounded-full" />
                    <p className="text-white/25 text-base font-bold tracking-widest uppercase">Exclusive Prizes</p>
                </div>

                {/* ── Right Side Text (right-aligned, no cutoff) ── */}
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-right z-10 hidden lg:flex flex-col gap-3 items-end">
                    <p className="text-primary text-lg font-black tracking-[0.5em] uppercase">Celebrating</p>
                    <h2 className="text-gold-shine text-8xl font-black italic leading-[0.85]">
                        HAPPY
                    </h2>
                    <h2 className="text-gold-shine text-8xl font-black italic leading-[0.85]">
                        1 YEAR
                    </h2>
                    <h3 className="text-white text-5xl font-black italic leading-none tracking-tight">
                        ANNIVERSARY
                    </h3>
                    <div className="w-20 h-1.5 bg-gradient-to-l from-primary to-transparent rounded-full" />
                    <p className="text-white/30 text-2xl font-black tracking-[0.3em] italic">PHONE POINT</p>
                </div>

                {/* ── Center: Wheel ── */}
                <div className="relative z-20 wheel-container">

                    {/* Pointer */}
                    <div className="absolute top-[-32px] left-1/2 -translate-x-1/2 z-50">
                        <svg width="48" height="56" viewBox="0 0 40 48">
                            <polygon points="20,48 2,0 38,0" fill="#F6BD68" />
                            <circle cx="20" cy="14" r="5" fill="#020518" />
                        </svg>
                    </div>

                    {/* Golden ring */}
                    <div
                        className="absolute inset-[-22px] rounded-full"
                        style={{
                            background: 'conic-gradient(from 0deg, #F6BD68, #c8923a, #F6BD68, #a07628, #F6BD68, #c8923a, #F6BD68)',
                            boxShadow: '0 0 80px rgba(246,189,104,0.4), 0 0 150px rgba(246,189,104,0.15), inset 0 0 40px rgba(246,189,104,0.1)',
                        }}
                    />

                    {/* Casino bulbs */}
                    {bulbs.map((b, i) => {
                        const isLit = (i % 2 === 0) === bulbFlip;
                        return (
                            <div
                                key={i}
                                className="absolute z-30 rounded-full transition-all duration-300"
                                style={{
                                    width: 14, height: 14,
                                    background: isLit ? '#FFFFFF' : '#F6BD68',
                                    boxShadow: isLit
                                        ? '0 0 12px 4px rgba(255,255,255,0.9), 0 0 30px #fff'
                                        : '0 0 12px 4px rgba(246,189,104,0.8), 0 0 25px #F6BD68',
                                    top: `calc(${b.y}% - 7px)`,
                                    left: `calc(${b.x}% - 7px)`,
                                }}
                            />
                        );
                    })}

                    {/* Spinning wheel SVG */}
                    <div
                        className="absolute inset-[8px] rounded-full overflow-hidden z-20"
                        style={{ transform: `rotate(${angle}deg)` }}
                    >
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                            {segPaths.map(({ seg, x1, y1, x2, y2, tx, ty, textRotation }, i) => (
                                <g key={i}>
                                    <path
                                        d={`M50 50 L${x1} ${y1} A50 50 0 0 1 ${x2} ${y2} Z`}
                                        fill={seg.bg}
                                        stroke="rgba(255,255,255,0.06)"
                                        strokeWidth="0.3"
                                    />
                                    <text
                                        x={tx} y={ty}
                                        fill="#fff" fontSize="4.5" fontWeight="900" fontStyle="italic"
                                        textAnchor="middle" dominantBaseline="middle"
                                        transform={`rotate(${textRotation}, ${tx}, ${ty})`}
                                    >
                                        <tspan x={tx} dy="-2.5">{seg.line1}</tspan>
                                        <tspan x={tx} dy="5">{seg.line2}</tspan>
                                    </text>
                                </g>
                            ))}
                            <circle cx="50" cy="50" r="16" fill="#020518" stroke="#F6BD68" strokeWidth="1.2" />
                        </svg>
                    </div>

                    {/* Clickable center logo */}
                    <button
                        onClick={spin}
                        disabled={spinning}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 w-[26%] h-[26%] rounded-full bg-[#050A28] border-[6px] border-primary flex items-center justify-center transition-transform duration-200 hover:scale-110 active:scale-90 disabled:opacity-60 disabled:cursor-not-allowed"
                        style={{ boxShadow: '0 0 50px rgba(246,189,104,0.5), inset 0 0 20px rgba(246,189,104,0.1)' }}
                    >
                        <Image src="/LOGO.png" alt="Phone Point" width={100} height={100} className="object-contain w-[65%] h-[65%]" />
                        {!spinning && (
                            <span className="absolute -bottom-11 left-1/2 -translate-x-1/2 bg-primary text-[#050A28] text-[11px] font-black px-4 py-1.5 rounded-full whitespace-nowrap animate-bounce shadow-xl">
                                TAP TO SPIN
                            </span>
                        )}
                    </button>
                </div>

                {/* ── Mobile Bottom Text ── */}
                <div className="flex lg:hidden flex-col items-center text-center z-10 mt-4 mb-6">
                    <p className="text-white/20 text-xs font-black italic tracking-widest">SPIN & WIN · EXCLUSIVE PRIZES</p>
                </div>

                {/* ── Desktop Bottom corners ── */}
                <div className="absolute bottom-5 left-8 text-white/10 font-black italic text-xl z-10 hidden lg:block">PHONE POINT</div>
                <div className="absolute bottom-5 right-8 text-primary/20 font-black italic text-xl z-10 hidden lg:block">ANNIVERSARY SPECIAL</div>

                {/* ═══════════ Winner Overlay ═══════════ */}
                {showOverlay && winner && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-overlay-in">
                        {[...Array(100)].map((_, i) => {
                            const colors = ['#F6BD68', '#ef4444', '#3b82f6', '#22c55e', '#a855f7', '#f97316', '#ec4899', '#14b8a6'];
                            const color = colors[i % colors.length];
                            const size = Math.random() * 10 + 4;
                            return (
                                <div
                                    key={i}
                                    className="absolute"
                                    style={{
                                        width: size,
                                        height: size * (Math.random() > 0.5 ? 0.4 : 1),
                                        backgroundColor: color,
                                        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                                        left: `${Math.random() * 100}%`,
                                        top: '-5%',
                                        animation: `confetti-fall ${Math.random() * 2.5 + 2}s ease-in ${Math.random() * 2}s infinite`,
                                        transform: `rotate(${Math.random() * 360}deg)`,
                                    }}
                                />
                            );
                        })}

                        <div className="relative max-w-lg w-full mx-4 bg-gradient-to-b from-[#0c1a4a] to-[#020518] border-[4px] md:border-[6px] border-primary rounded-[30px] md:rounded-[40px] p-8 md:p-12 text-center animate-content-pop"
                            style={{ boxShadow: '0 0 120px rgba(246,189,104,0.4)' }}>
                            <div className="mb-6 md:mb-8">
                                <div className="inline-block p-4 md:p-6 rounded-full bg-primary/10 border-2 border-primary animate-winner">
                                    <Trophy className="w-14 h-14 md:w-20 md:h-20 text-primary" />
                                </div>
                            </div>
                            <p className="text-primary text-base md:text-xl font-black tracking-[0.3em] md:tracking-[0.5em] mb-3 md:mb-4 uppercase">Congratulations!</p>
                            <h1 className="text-5xl md:text-7xl font-black italic text-gold-shine mb-6 md:mb-8 leading-none">{winner.label}</h1>
                            <p className="text-white/40 text-sm md:text-base">Show this screen at the store to avail your offer!</p>
                            <button onClick={() => setShowOverlay(false)} className="absolute top-4 right-4 md:top-5 md:right-5 p-2 rounded-full text-white/30 hover:text-white transition-colors">
                                <X className="w-5 h-5 md:w-6 md:h-6" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 0.8; transform: scale(1); }
        }
        @keyframes confetti-fall {
          0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0.7; }
        }
        .wheel-container {
          width: min(75vw, 90vh, 680px);
          height: min(75vw, 90vh, 680px);
        }
        @media (min-width: 1024px) {
          .wheel-container {
            width: min(90vh, 680px);
            height: min(90vh, 680px);
          }
        }
      `}</style>
        </AuthGuard>
    );
}
