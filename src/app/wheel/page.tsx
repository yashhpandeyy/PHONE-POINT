'use client';

import React, { useState, useEffect } from 'react';
import { AuthGuard } from '@/components/auth-guard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Gift, Sparkles, RefreshCcw, ArrowDown, Share2, Star, X, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

const OFFERS = [
    { id: 1, text: "₹500 OFF", color: "#050A28", textColor: "#FFFFFF", icon: Gift },
    { id: 2, text: "FREE GLASS", color: "#F6BD68", textColor: "#050A28", icon: Sparkles },
    { id: 3, text: "10% OFF", color: "#032B7A", textColor: "#FFFFFF", icon: Star },
    { id: 4, text: "B1G1 COVER", color: "#F6BD68", textColor: "#050A28", icon: Gift },
    { id: 5, text: "FREE DELIVERY", color: "#050A28", textColor: "#FFFFFF", icon: Sparkles },
    { id: 6, text: "VIP SUPPORT", color: "#032B7A", textColor: "#FFFFFF", icon: Trophy },
];

export default function LuckyWheelPage() {
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [result, setResult] = useState<typeof OFFERS[0] | null>(null);
    const [showOverlay, setShowOverlay] = useState(false);
    const { toast } = useToast();

    const spinWheel = () => {
        if (isSpinning) return;

        setIsSpinning(true);
        setResult(null);
        setShowOverlay(false);

        // Randomize rotation (at least 10 full spins + random offset for 6 segments)
        const segmentAngle = 60;
        const randomSegment = Math.floor(Math.random() * 6);
        const targetAngle = 360 - (randomSegment * segmentAngle) - (segmentAngle / 2);
        // Increase rotation significantly for a longer, more exciting spin
        const totalRotation = rotation + (360 * 12) + targetAngle - (rotation % 360);

        setRotation(totalRotation);

        // Animation duration is 6s for the slow-fast-slow effect
        setTimeout(() => {
            setIsSpinning(false);
            const wonOffer = OFFERS[randomSegment];
            setResult(wonOffer);

            setTimeout(() => {
                setShowOverlay(true);
            }, 300);

            localStorage.setItem('lucky_offer', wonOffer.text);
        }, 6100);
    };

    return (
        <AuthGuard>
            <div className="container min-h-screen py-8 md:py-12 flex flex-col items-center justify-start relative overflow-hidden bg-[#050A28]">
                {/* Animated Background Lights */}
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-accent/20 rounded-full blur-[150px] animate-pulse delay-1000" />

                {/* Floating Stars/Particles */}
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(30)].map((_, i) => (
                        <Star
                            key={i}
                            className="absolute text-primary/30 animate-pulse"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                width: `${Math.random() * 20 + 10}px`,
                                animationDelay: `${Math.random() * 5}s`
                            }}
                        />
                    ))}
                </div>

                {/* Side-by-Side Header Layout */}
                <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 mb-12 relative z-10 px-4">
                    <div className="text-center md:text-left flex-1">
                        <Badge variant="outline" className="mb-4 border-primary/50 text-primary px-6 py-1.5 text-sm uppercase tracking-tighter bg-primary/5 shadow-[0_0_15px_rgba(246,189,104,0.2)]">
                            LUCKY WHEEL LIVE
                        </Badge>
                        <h1 className="text-5xl md:text-7xl font-black italic text-white leading-none tracking-tighter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                            SPIN <span className="text-primary italic">&</span> WIN
                        </h1>
                    </div>

                    <div className="text-center md:text-right flex-1 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8">
                        <h2 className="text-3xl md:text-4xl font-black italic text-gold-shine leading-tight tracking-tighter mb-2">
                            HAPPY 1 YEAR<br />ANNIVERSARY
                        </h2>
                        <p className="text-primary font-bold tracking-[0.2em] text-sm uppercase">PHONE POINT SPECIAL</p>
                    </div>
                </div>

                {/* Wheel Container */}
                <div className="relative w-[340px] h-[340px] md:w-[540px] md:h-[540px] mb-8 z-20">
                    {/* Outer Border with Glowing Dots */}
                    <div className="absolute -inset-8 border-[15px] border-[#0a113a] rounded-full shadow-[0_0_80px_rgba(246,189,104,0.25)] flex items-center justify-center">
                        {[...Array(18)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-3.5 h-3.5 bg-primary rounded-full shadow-[0_0_15px_#F6BD68]"
                                style={{ transform: `rotate(${i * 20}deg) translateY(-185px) md:translateY(-290px)` }}
                            />
                        ))}
                    </div>

                    {/* SVG Wheel Pointer */}
                    <div className="absolute top-[-35px] left-1/2 -translate-x-1/2 z-40 drop-shadow-[0_8px_15px_rgba(0,0,0,0.6)]">
                        <svg width="60" height="70" viewBox="0 0 40 50">
                            <path d="M20 50L0 0H40L20 50Z" fill="#F6BD68" />
                            <circle cx="20" cy="15" r="5" fill="#050A28" />
                        </svg>
                    </div>

                    {/* SVG Wheel - Redesigned with clickable center */}
                    <div
                        className="w-full h-full transition-transform duration-[6000ms]"
                        style={{
                            transform: `rotate(${rotation}deg)`,
                            // Custom cubic-bezier for Slow Start -> High Speed -> Gradual Slowdown
                            transitionTimingFunction: 'cubic-bezier(0.45, 0.05, 0, 1)'
                        }}
                    >
                        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
                            <defs>
                                <filter id="shadow">
                                    <feDropShadow dx="0" dy="0" stdDeviation="0.4" floodOpacity="0.8" />
                                </filter>
                            </defs>
                            {OFFERS.map((offer, i) => {
                                const angle = 60;
                                const startAngle = i * angle;
                                const endAngle = (i + 1) * angle;

                                const x1 = 50 + 50 * Math.cos((Math.PI * (startAngle - 90)) / 180);
                                const y1 = 50 + 50 * Math.sin((Math.PI * (startAngle - 90)) / 180);
                                const x2 = 50 + 50 * Math.cos((Math.PI * (endAngle - 90)) / 180);
                                const y2 = 50 + 50 * Math.sin((Math.PI * (endAngle - 90)) / 180);

                                return (
                                    <g key={offer.id}>
                                        <path
                                            d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                                            fill={offer.color}
                                            stroke="#050A28"
                                            strokeWidth="0.8"
                                        />
                                        <g transform={`rotate(${startAngle + angle / 2}, 50, 50)`}>
                                            <text
                                                x="50"
                                                y="22"
                                                fill={offer.textColor}
                                                fontSize="3.8"
                                                fontWeight="900"
                                                textAnchor="middle"
                                                transform="rotate(0, 50, 22)"
                                                className="italic tracking-tighter"
                                                style={{ filter: 'url(#shadow)' }}
                                            >
                                                {offer.text.split(' ')[0]}
                                            </text>
                                            <text
                                                x="50"
                                                y="27"
                                                fill={offer.textColor}
                                                fontSize="2.5"
                                                fontWeight="700"
                                                textAnchor="middle"
                                                transform="rotate(0, 50, 27)"
                                                className="tracking-tight opacity-90"
                                            >
                                                {offer.text.split(' ').slice(1).join(' ')}
                                            </text>
                                        </g>
                                    </g>
                                );
                            })}
                            {/* Inner Circle Border */}
                            <circle cx="50" cy="50" r="14" fill="#050A28" stroke="#F6BD68" strokeWidth="1.5" />
                        </svg>
                    </div>

                    {/* Clickable Center Logo Overlay (Stays static) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-40 md:h-40 z-50 flex items-center justify-center">
                        <button
                            onClick={spinWheel}
                            disabled={isSpinning}
                            className={cn(
                                "relative w-full h-full rounded-full bg-[#050A28] border-4 border-primary p-4 shadow-[0_0_30px_rgba(246,189,104,0.4)] flex items-center justify-center transition-all duration-300",
                                isSpinning ? "cursor-wait opacity-80" : "hover:scale-110 hover:shadow-[0_0_50px_rgba(246,189,104,0.6)] cursor-pointer active:scale-95 group"
                            )}
                        >
                            <div className="relative w-full h-full">
                                <Image
                                    src="/LOGO.png"
                                    alt="Phone Point Logo"
                                    fill
                                    className="object-contain p-1"
                                />
                            </div>
                            {!isSpinning && (
                                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-primary text-[#050A28] text-[10px] font-black px-3 py-1 rounded-full whitespace-nowrap animate-bounce shadow-lg">
                                    CLICK TO SPIN
                                </div>
                            )}
                        </button>
                    </div>
                </div>

                <div className="mt-8 text-center animate-pulse z-10 flex flex-col items-center gap-2">
                    <p className="text-white/40 text-sm font-medium italic tracking-widest">TAP THE LOGO TO CELEBRATE OUR ANNIVERSARY</p>
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-primary fill-primary" />)}
                    </div>
                </div>

                {/* Full Screen Winner Overlay */}
                {showOverlay && result && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-overlay-in bg-black/90 backdrop-blur-2xl">
                        {/* Improved Confetti Elements */}
                        {[...Array(40)].map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "absolute w-2 h-2 rounded-sm",
                                    i % 3 === 0 ? "bg-primary" : i % 3 === 1 ? "bg-accent" : "bg-white"
                                )}
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    animation: `confetti-pop ${Math.random() * 3 + 2}s ease-out infinite`,
                                    animationDelay: `${Math.random() * 2}s`,
                                    opacity: Math.random()
                                }}
                            />
                        ))}

                        <div className="relative max-w-xl w-full bg-[#0a113a] border-[6px] border-primary rounded-[50px] p-10 md:p-16 text-center animate-content-pop shadow-[0_0_150px_rgba(246,189,104,0.5)] overflow-hidden">
                            {/* Shine Effect */}
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

                            <div className="flex justify-center mb-8">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-primary blur-3xl opacity-30 animate-pulse" />
                                    <div className="relative p-8 rounded-full bg-primary/20 border-4 border-primary animate-winner shadow-[0_0_40px_rgba(246,189,104,0.4)]">
                                        <Trophy className="w-20 h-20 text-primary" />
                                    </div>
                                </div>
                            </div>

                            <p className="text-primary text-xl font-black italic tracking-[0.3em] mb-4">CONGRATULATIONS!</p>

                            <h1 className="text-7xl md:text-9xl font-black italic text-gold-shine mb-8 leading-none drop-shadow-2xl">
                                {result.text}
                            </h1>

                            <div className="space-y-6 mb-10">
                                <p className="text-white/80 text-xl font-medium leading-relaxed">
                                    Thank you for being part of our <strong>1 Year Journey</strong>. This special anniversary gift is yours!
                                </p>
                                <div className="bg-primary/10 border-2 border-primary/20 p-5 rounded-3xl group transition-all hover:bg-primary/15 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    <p className="text-primary/60 text-xs uppercase font-black mb-1">Redemption Code</p>
                                    <span className="text-white text-3xl font-black font-mono tracking-[0.2em]">ANNIVERSARY1YR</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    variant="ghost"
                                    className="flex-1 h-16 text-xl font-black rounded-2xl bg-primary text-[#050A28] hover:bg-white hover:text-[#050A28] shadow-[0_10px_20px_rgba(0,0,0,0.3)]"
                                    onClick={() => setShowOverlay(false)}
                                >
                                    CLAIM MY GIFT
                                </Button>
                                <Button variant="outline" className="h-16 px-8 rounded-2xl border-white/20 bg-white/5 hover:bg-white/10 text-white">
                                    <Share2 className="w-6 h-6" />
                                </Button>
                            </div>

                            <button
                                onClick={() => setShowOverlay(false)}
                                className="absolute top-8 right-8 p-3 rounded-full bg-white/5 text-white/40 hover:text-white transition-all hover:rotate-90"
                            >
                                <X className="w-8 h-8" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AuthGuard>
    );
}
