'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AuthGuard } from '@/components/auth-guard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Gift, Sparkles, RefreshCcw, ArrowDown, Share2, Star, X, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

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

        // Randomize rotation (at least 8 full spins + random offset for 6 segments)
        // Offset calculation: (360 / 6) = 60 degrees per segment
        const segmentAngle = 60;
        const randomSegment = Math.floor(Math.random() * 6);
        const targetAngle = 360 - (randomSegment * segmentAngle) - (segmentAngle / 2);
        const totalRotation = rotation + (360 * 8) + targetAngle - (rotation % 360);

        setRotation(totalRotation);

        // Animation duration is 5s
        setTimeout(() => {
            setIsSpinning(false);
            const wonOffer = OFFERS[randomSegment];
            setResult(wonOffer);

            // Delay the full screen overlay slightly for impact
            setTimeout(() => {
                setShowOverlay(true);
            }, 300);

            localStorage.setItem('lucky_offer', wonOffer.text);
        }, 5100);
    };

    return (
        <AuthGuard>
            <div className="container min-h-[90vh] py-8 md:py-16 flex flex-col items-center justify-center relative overflow-hidden bg-[#050A28]">
                {/* Animated Background Lights */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[120px] animate-pulse delay-1000" />

                <div className="text-center mb-10 relative z-10">
                    <Badge variant="outline" className="mb-4 border-primary/50 text-primary px-6 py-1.5 text-sm uppercase tracking-tighter bg-primary/5">
                        Spin to Win Big
                    </Badge>
                    <h1 className="text-6xl md:text-8xl font-black italic text-white mb-2 tracking-tighter drop-shadow-2xl">
                        LUCKY <span className="text-primary">WHEEL</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-sm mx-auto font-medium">
                        Try your luck and win exclusive prizes for your next order!
                    </p>
                </div>

                {/* Wheel Container */}
                <div className="relative w-[320px] h-[320px] md:w-[500px] md:h-[500px] mb-12 z-20 group">
                    {/* Outer Border with Glowing Dots */}
                    <div className="absolute -inset-6 border-[12px] border-[#0a113a] rounded-full shadow-[0_0_60px_rgba(246,189,104,0.15)] flex items-center justify-center">
                        {[...Array(12)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-3 h-3 bg-primary rounded-full shadow-[0_0_10px_#F6BD68]"
                                style={{ transform: `rotate(${i * 30}deg) translateY(-165px) md:translateY(-255px)` }}
                            />
                        ))}
                    </div>

                    {/* SVG Wheel Pointer */}
                    <div className="absolute top-[-25px] left-1/2 -translate-x-1/2 z-40 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                        <svg width="40" height="50" viewBox="0 0 40 50">
                            <path d="M20 50L0 0H40L20 50Z" fill="#F6BD68" />
                            <circle cx="20" cy="15" r="5" fill="#050A28" />
                        </svg>
                    </div>

                    {/* SVG Wheel Implemention for Pixel Perfection */}
                    <div
                        className="w-full h-full transition-transform duration-[5000ms] cubic-bezier(0.2, 0, 0, 1)"
                        style={{ transform: `rotate(${rotation}deg)` }}
                    >
                        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
                            <defs>
                                <filter id="shadow">
                                    <feDropShadow dx="0" dy="0" stdDeviation="0.5" floodOpacity="0.5" />
                                </filter>
                            </defs>
                            {OFFERS.map((offer, i) => {
                                const angle = 60;
                                const startAngle = i * angle;
                                const endAngle = (i + 1) * angle;

                                // SVG arc path calculation
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
                                            strokeWidth="0.5"
                                        />
                                        <g transform={`rotate(${startAngle + angle / 2}, 50, 50)`}>
                                            <text
                                                x="50"
                                                y="20"
                                                fill={offer.textColor}
                                                fontSize="3.5"
                                                fontWeight="900"
                                                textAnchor="middle"
                                                transform="rotate(0, 50, 20)"
                                                className="italic tracking-tighter"
                                                style={{ filter: 'url(#shadow)' }}
                                            >
                                                {offer.text}
                                            </text>
                                        </g>
                                    </g>
                                );
                            })}
                            {/* Inner Circle Decoration */}
                            <circle cx="50" cy="50" r="8" fill="#050A28" stroke="#F6BD68" strokeWidth="1.5" />
                            <text x="50" y="52" fill="#F6BD68" fontSize="4" fontWeight="bold" textAnchor="middle">★</text>
                        </svg>
                    </div>
                </div>

                <div className="z-30">
                    <Button
                        onClick={spinWheel}
                        disabled={isSpinning}
                        size="lg"
                        className={cn(
                            "h-20 px-16 text-2xl font-black rounded-full shadow-[0_10px_30px_rgba(246,189,104,0.3)] transition-all duration-300 bg-primary hover:bg-white text-[#050A28] uppercase italic",
                            isSpinning ? "opacity-50 scale-95" : "hover:scale-110 active:scale-95 translate-y-[-10px]"
                        )}
                    >
                        {isSpinning ? (
                            <RefreshCcw className="mr-3 h-8 w-8 animate-spin" />
                        ) : (
                            <Sparkles className="mr-3 h-8 w-8" />
                        )}
                        {isSpinning ? 'SPINNING...' : 'LUCKY SPIN'}
                    </Button>
                </div>

                {/* Full Screen Winner Overlay */}
                {showOverlay && result && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-overlay-in bg-black/80 backdrop-blur-xl">
                        {/* Confetti Elements */}
                        {[...Array(20)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-2 h-2 bg-primary animate-bounce"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 2}s`
                                }}
                            />
                        ))}

                        <div className="relative max-w-lg w-full bg-card border-4 border-primary rounded-[40px] p-8 md:p-12 text-center animate-content-pop shadow-[0_0_100px_rgba(246,189,104,0.4)] overflow-hidden">
                            {/* Shine Effect */}
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-pulse" />

                            <div className="flex justify-center mb-6">
                                <div className="p-5 rounded-full bg-primary/20 border-2 border-primary animate-winner">
                                    <Trophy className="w-16 h-16 text-primary" />
                                </div>
                            </div>

                            <h2 className="text-white text-2xl md:text-3xl font-bold uppercase tracking-widest mb-2">JACKPOT!</h2>
                            <h1 className="text-7xl md:text-8xl font-black italic text-gold-shine mb-6 leading-none">
                                {result.text}
                            </h1>

                            <div className="space-y-4 mb-8">
                                <p className="text-muted-foreground text-lg">
                                    You've unlocked a special reward. Take a screenshot or show your email at the store to claim it!
                                </p>
                                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                                    <span className="text-white font-mono tracking-widest">EMAIL_VERIFIED_OFFER</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button className="flex-1 h-14 text-lg font-bold rounded-2xl" onClick={() => setShowOverlay(false)}>
                                    AWESOME!
                                </Button>
                                <Button variant="outline" className="h-14 px-8 rounded-2xl border-white/20">
                                    <Share2 className="w-5 h-5" />
                                </Button>
                            </div>

                            <button
                                onClick={() => setShowOverlay(false)}
                                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-white/40 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AuthGuard>
    );
}
