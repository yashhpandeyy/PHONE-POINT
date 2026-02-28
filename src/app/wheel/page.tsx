'use client';

import React, { useState, useEffect } from 'react';
import { AuthGuard } from '@/components/auth-guard';
import { Button } from '@/components/ui/button';
import { Trophy, Gift, Sparkles, RefreshCcw, Share2, Star, X, CheckCircle2, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const OFFERS = [
    { id: 1, text: "₹500 OFF", color: "#050A28", textColor: "#FFFFFF" },
    { id: 2, text: "FREE GLASS", color: "#032B7A", textColor: "#FFFFFF" },
    { id: 3, text: "10% OFF", color: "#050A28", textColor: "#FFFFFF" },
    { id: 4, text: "B1G1 COVER", color: "#032B7A", textColor: "#FFFFFF" },
    { id: 5, text: "FREE DELIVERY", color: "#050A28", textColor: "#FFFFFF" },
    { id: 6, text: "VIP SUPPORT", color: "#032B7A", textColor: "#FFFFFF" },
];

export default function LuckyWheelPage() {
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [result, setResult] = useState<typeof OFFERS[0] | null>(null);
    const [showOverlay, setShowOverlay] = useState(false);

    // Smooth spin logic with high tension
    const spinWheel = () => {
        if (isSpinning) return;

        setIsSpinning(true);
        setResult(null);
        setShowOverlay(false);

        const segmentAngle = 60;
        const randomSegment = Math.floor(Math.random() * 6);
        const targetAngle = 360 - (randomSegment * segmentAngle) - (segmentAngle / 2);

        // 15-20 full rotations for an epic feel
        const extraRotations = 15 * 360;
        const totalRotation = rotation + extraRotations + targetAngle - (rotation % 360);

        setRotation(totalRotation);

        // 8 seconds total spin time for "smooth" feel
        setTimeout(() => {
            setIsSpinning(false);
            const wonOffer = OFFERS[randomSegment];
            setResult(wonOffer);

            setTimeout(() => {
                setShowOverlay(true);
            }, 500);
        }, 8100);
    };

    return (
        <AuthGuard>
            <div className="fixed inset-0 bg-[#020518] flex flex-col items-center justify-center overflow-hidden font-inter select-none">

                {/* Immersive Casino Backdrop (Happy Anniversary Marquee) */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex flex-col justify-around py-12">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className={cn("flex whitespace-nowrap text-8xl font-black italic", i % 2 === 0 ? "animate-marquee" : "animate-marquee-reverse")}>
                            {[...Array(10)].map((_, j) => (
                                <span key={j} className="mx-8">HAPPY 1 YEAR ANNIVERSARY PHONE POINT SPECIAL</span>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Ambient Glows */}
                <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-primary/20 rounded-full blur-[200px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-blue-600/10 rounded-full blur-[200px] animate-pulse delay-1000" />

                {/* Floating Decors (Website Optimized) */}
                <div className="absolute inset-0 flex items-center justify-between px-20 pointer-events-none z-0">
                    <div className="flex flex-col gap-20">
                        <Trophy className="w-24 h-24 text-primary/20 rotate-[-15deg] animate-bounce" />
                        <Star className="w-16 h-16 text-primary/10 animate-pulse delay-300" />
                        <Heart className="w-20 h-20 text-blue-400/10 animate-bounce delay-700" />
                    </div>
                    <div className="flex flex-col gap-20 items-end">
                        <Sparkles className="w-24 h-24 text-primary/20 rotate-[15deg] animate-pulse" />
                        <Gift className="w-16 h-16 text-blue-400/10 animate-bounce delay-500" />
                        <Star className="w-20 h-20 text-primary/10 animate-pulse delay-700" />
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="relative z-10 flex flex-col items-center scale-90 md:scale-100 xl:scale-110">

                    {/* Top Branding */}
                    <div className="text-center mb-10">
                        <h2 className="text-primary text-2xl font-black italic tracking-[0.5em] mb-2 drop-shadow-[0_0_10px_#F6BD68]">
                            SINCE 2025
                        </h2>
                        <h1 className="text-white text-8xl md:text-9xl font-black italic leading-none tracking-tighter">
                            LUCKY <span className="text-primary glow-text">WHEEL</span>
                        </h1>
                        <p className="text-white/40 font-bold tracking-widest mt-4">THE PREMIER ANNIVERSARY CASINO EXPERIENCE</p>
                    </div>

                    {/* Epic Wheel Section */}
                    <div className="relative">
                        {/* The Pointer */}
                        <div className="absolute top-[-40px] left-1/2 -translate-x-1/2 z-[60] drop-shadow-2xl">
                            <svg width="60" height="80" viewBox="0 0 40 50">
                                <path d="M20 50L0 0H40L20 50Z" fill="#F6BD68" className="drop-shadow-glow" />
                                <circle cx="20" cy="15" r="7" fill="#020518" />
                            </svg>
                        </div>

                        {/* Glowing Golden Outer Case */}
                        <div className="p-8 rounded-full bg-gradient-to-b from-[#F6BD68] via-[#8c6b3a] to-[#F6BD68] shadow-[0_0_100px_rgba(246,189,104,0.4)] relative">

                            {/* Decorative Lamps around the border */}
                            {[...Array(24)].map((_, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "absolute w-4 h-4 rounded-full shadow-[0_0_15px_#fff]",
                                        i % 2 === 0 ? "bg-white animate-pulse" : "bg-primary animate-pulse delay-150"
                                    )}
                                    style={{
                                        transform: `rotate(${i * 15}deg) translateY(-265px) md:translateY(-315px)`,
                                        left: 'calc(50% - 8px)',
                                        top: 'calc(50% - 8px)'
                                    }}
                                />
                            ))}

                            {/* The Spin Container */}
                            <div
                                className="w-[500px] h-[500px] md:w-[600px] md:h-[600px] rounded-full border-[10px] border-[#020518] overflow-hidden relative transition-transform duration-[8000ms]"
                                style={{
                                    transform: `rotate(${rotation}deg)`,
                                    // Slow start -> high speed -> gradual smooth stop
                                    transitionTimingFunction: 'cubic-bezier(0.15, 0, 0, 1)'
                                }}
                            >
                                <svg viewBox="0 0 100 100" className="w-full h-full">
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
                                                    stroke="#ffffff10"
                                                    strokeWidth="0.2"
                                                />
                                                <g transform={`rotate(${startAngle + angle / 2}, 50, 50)`}>
                                                    <text
                                                        x="50"
                                                        y="25"
                                                        fill="#fff"
                                                        fontSize="4.5"
                                                        fontWeight="900"
                                                        textAnchor="middle"
                                                        className="italic tracking-tighter"
                                                    >
                                                        {offer.text}
                                                    </text>
                                                </g>
                                            </g>
                                        );
                                    })}
                                    <circle cx="50" cy="50" r="15" fill="#020518" />
                                </svg>
                            </div>

                            {/* Stationary Clickable Logo Center */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70]">
                                <button
                                    onClick={spinWheel}
                                    disabled={isSpinning}
                                    className={cn(
                                        "w-32 h-32 md:w-44 md:h-44 rounded-full border-8 border-primary bg-[#050A28] p-4 flex items-center justify-center transition-all duration-300 shadow-[0_0_50px_#F6BD68]",
                                        isSpinning ? "cursor-not-allowed grayscale" : "hover:scale-110 active:scale-90 cursor-pointer group"
                                    )}
                                >
                                    <Image src="/LOGO.png" alt="Logo" width={120} height={120} className="object-contain" />
                                    {!isSpinning && (
                                        <div className="absolute inset-[-20px] rounded-full border-4 border-dashed border-primary animate-[spin_10s_linear_infinite]" />
                                    )}
                                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-white text-[#050A28] px-4 py-1.5 rounded-full font-black text-xs whitespace-nowrap animate-bounce shadow-2xl">
                                        {isSpinning ? 'GOOD LUCK!' : 'CLICK TO SPIN'}
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Info (Standalone) */}
                <div className="fixed bottom-10 left-10 text-white/20 font-black italic text-3xl z-10">PHONE POINT</div>
                <div className="fixed bottom-10 right-10 text-white/20 font-black italic text-3xl z-10 underline decoration-primary">ANNIVERSARY SPECIAL</div>

                {/* Casino Winner Overlay */}
                {showOverlay && result && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-[20px] animate-overlay-in">

                        {/* Multi-Color Party Popper Confetti */}
                        {[...Array(60)].map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "absolute w-3 h-3 rounded-full",
                                    i % 4 === 0 ? "bg-red-500 animate-popper-l" :
                                        i % 4 === 1 ? "bg-blue-500 animate-popper-r" :
                                            i % 4 === 2 ? "bg-yellow-500 animate-popper-l" : "bg-green-500 animate-popper-r"
                                )}
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 2}s`
                                }}
                            />
                        ))}

                        <div className="relative max-w-2xl w-full bg-gradient-to-b from-[#0a113a] to-[#020518] border-[10px] border-primary rounded-[60px] p-16 text-center animate-content-pop shadow-[0_0_200px_rgba(246,189,104,0.6)]">

                            <div className="flex justify-center mb-10">
                                <div className="relative">
                                    <div className="absolute inset-[-40px] bg-primary rounded-full blur-[60px] opacity-40 animate-pulse" />
                                    <Trophy className="w-32 h-32 text-primary drop-shadow-[0_0_20px_#F6BD68] animate-winner" />
                                </div>
                            </div>

                            <h3 className="text-primary text-3xl font-black italic tracking-[0.4em] mb-6 animate-pulse">JACKPOT WINNER!</h3>
                            <h1 className="text-8xl md:text-9xl font-black italic text-gold-shine mb-10 leading-tight">
                                {result.text}
                            </h1>

                            <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] mb-12">
                                <p className="text-white/60 text-lg font-bold mb-4 uppercase tracking-widest text-center">Your Exclusive Anniversary Code</p>
                                <div className="text-white text-5xl font-black font-mono tracking-widest text-center py-4 border-2 border-dashed border-primary/40 rounded-3xl">
                                    WINNER_POPT_1YR
                                </div>
                            </div>

                            <Button
                                onClick={() => setShowOverlay(false)}
                                className="h-20 px-16 text-2xl font-black rounded-3xl bg-primary text-[#050A28] hover:bg-white transition-all shadow-2xl uppercase italic"
                            >
                                COLLECT PRIZE
                            </Button>

                            <button
                                onClick={() => setShowOverlay(false)}
                                className="absolute top-10 right-10 p-4 rounded-full bg-white/5 text-white/20 hover:text-white transition-all"
                            >
                                <X className="w-10 h-10" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AuthGuard>
    );
}
