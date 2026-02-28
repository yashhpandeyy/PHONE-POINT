'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AuthGuard } from '@/components/auth-guard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Gift, Sparkles, RefreshCcw, ArrowDown, Share2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const OFFERS = [
    { id: 1, text: "₹500 OFF", color: "bg-[#050A28]", textColor: "text-white", icon: Gift },
    { id: 2, text: "FREE GLASS", color: "bg-[#F6BD68]", textColor: "text-[#050A28]", icon: Sparkles },
    { id: 3, text: "10% OFF", color: "bg-[#032B7A]", textColor: "text-white", icon: Star },
    { id: 4, text: "B1G1 COVER", color: "bg-[#F6BD68]", textColor: "text-[#050A28]", icon: Gift },
    { id: 5, text: "FREE DELIVERY", color: "bg-[#050A28]", textColor: "text-white", icon: Sparkles },
    { id: 6, text: "VIP SUPPORT", color: "bg-[#032B7A]", textColor: "text-white", icon: Trophy },
];

export default function LuckyWheelPage() {
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [result, setResult] = useState<typeof OFFERS[0] | null>(null);
    const [hasSpun, setHasSpun] = useState(false);
    const { toast } = useToast();
    const wheelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Check if user already spun today in local storage
        const lastSpin = localStorage.getItem('last_spin_date');
        const today = new Date().toDateString();
        if (lastSpin === today) {
            // For demo purposes, we allow multiple spins but could restrict here
            // setHasSpun(true);
        }
    }, []);

    const spinWheel = () => {
        if (isSpinning) return;

        setIsSpinning(true);
        setResult(null);

        // Randomize rotation (at least 5 full spins + random offset)
        const extraDegrees = Math.floor(Math.random() * 360);
        const newRotation = rotation + 1800 + extraDegrees;
        setRotation(newRotation);

        // Calculate result after animation ends (4s)
        setTimeout(() => {
            setIsSpinning(false);
            setHasSpun(true);

            // Calculate which segment it landed on
            // Each segment is 60 degrees (360 / 6)
            const normalizedDegrees = (360 - (newRotation % 360)) % 360;
            const index = Math.floor(normalizedDegrees / 60);
            const wonOffer = OFFERS[index];
            setResult(wonOffer);

            localStorage.setItem('last_spin_date', new Date().toDateString());
            localStorage.setItem('lucky_offer', wonOffer.text);

            toast({
                title: "🎉 Congratulations!",
                description: `You won: ${wonOffer.text}`,
            });
        }, 4100);
    };

    return (
        <AuthGuard>
            <div className="container min-h-[90vh] py-8 md:py-16 flex flex-col items-center justify-center relative overflow-hidden">
                {/* Background Decorative Elements */}
                <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-700" />

                <div className="text-center mb-12 relative z-10">
                    <Badge variant="outline" className="mb-4 border-primary text-primary px-4 py-1 animate-bounce">
                        LUCKY DRAW LIVE
                    </Badge>
                    <h1 className="text-5xl md:text-7xl font-black italic bg-gradient-to-r from-primary via-white to-accent bg-clip-text text-transparent mb-4 tracking-tighter">
                        LUCKY WHEEL
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-md mx-auto">
                        Spin the wheel to unlock exclusive offers on your next purchase!
                    </p>
                </div>

                <div className="relative w-80 h-80 md:w-[450px] md:h-[450px] mb-12 z-20">
                    {/* External Border/Glow */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 to-accent/30 rounded-full blur-xl opacity-50" />

                    {/* Wheel Pointer */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-30 drop-shadow-lg">
                        <ArrowDown className="w-12 h-12 text-primary fill-primary" />
                    </div>

                    {/* The Wheel */}
                    <div
                        ref={wheelRef}
                        className={cn(
                            "w-full h-full rounded-full border-8 border-[#050A28] shadow-[0_0_50px_rgba(246,189,104,0.3)] relative overflow-hidden transition-transform duration-[4000ms] cubic-bezier(0.15,0,0.15,1)",
                            isSpinning ? "pointer-events-none" : ""
                        )}
                        style={{ transform: `rotate(${rotation}deg)` }}
                    >
                        {OFFERS.map((offer, i) => (
                            <div
                                key={offer.id}
                                className={cn(
                                    "absolute top-0 left-0 w-full h-full flex items-start justify-center pt-12 md:pt-16 origin-center",
                                    offer.color
                                )}
                                style={{
                                    transform: `rotate(${i * 60}deg) skewY(-30deg)`,
                                    width: '50%',
                                    height: '50%',
                                    left: '50%',
                                    top: '50%',
                                    transformOrigin: '0 0'
                                }}
                            >
                                <div
                                    className={cn(
                                        "flex flex-col items-center justify-center transform skewY(30deg) rotate(30deg) mt-4 whitespace-nowrap",
                                        offer.textColor
                                    )}
                                    style={{ width: '100px', marginLeft: '-50px' }}
                                >
                                    <offer.icon className="w-6 h-6 md:w-8 md:h-8 mb-2" />
                                    <span className="font-black text-xs md:text-sm tracking-tighter">{offer.text}</span>
                                </div>
                            </div>
                        ))}

                        {/* Center Pin */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 bg-[#050A28] border-4 border-primary rounded-full z-40 flex items-center justify-center shadow-xl">
                            <LogoIcon />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 items-center z-10">
                    <Button
                        onClick={spinWheel}
                        disabled={isSpinning || (hasSpun && !result)}
                        size="lg"
                        className={cn(
                            "h-16 px-12 text-xl font-bold rounded-full shadow-2xl transition-all duration-300",
                            isSpinning ? "opacity-50 scale-95" : "hover:scale-105 hover:shadow-primary/20"
                        )}
                    >
                        {isSpinning ? (
                            <RefreshCcw className="mr-2 h-6 w-6 animate-spin" />
                        ) : (
                            <Sparkles className="mr-2 h-6 w-6" />
                        )}
                        {isSpinning ? 'SPINNING...' : hasSpun ? 'SPIN AGAIN' : 'SPIN THE WHEEL'}
                    </Button>

                    {result && (
                        <Card className="mt-8 bg-primary/10 border-primary animate-winner max-w-xs w-full">
                            <CardContent className="p-6 text-center">
                                <p className="text-sm font-medium text-primary mb-1 uppercase tracking-widest">You Won!</p>
                                <h3 className="text-2xl font-black text-white">{result.text}</h3>
                                <p className="text-xs text-muted-foreground mt-2">Claim this at checkout using your email.</p>
                                <div className="flex gap-2 justify-center mt-4">
                                    <Button variant="outline" size="sm" className="h-8 text-[10px] gap-1">
                                        <Share2 className="w-3 h-3" /> SHARE
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AuthGuard>
    );
}

function LogoIcon() {
    return (
        <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" stroke="#F6BD68" strokeWidth="2" />
            <path d="M30 70V30L50 50L70 30V70" stroke="#F6BD68" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
