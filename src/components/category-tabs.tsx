'use client';

import Link from 'next/link';
import {
    Smartphone,
    ShieldCheck,
    Headphones,
    BatteryCharging,
    Ear,
    Wrench,
    ShoppingBag,
    MonitorSmartphone,
} from 'lucide-react';

const categories = [
    { name: 'Phones', icon: Smartphone, href: '/phones', color: 'from-blue-500 to-blue-600' },
    { name: 'Phone Cases', icon: ShieldCheck, href: '/phones?category=cases', color: 'from-purple-500 to-purple-600' },
    { name: 'Neckbands', icon: Headphones, href: '/phones?category=neckbands', color: 'from-rose-500 to-rose-600' },
    { name: 'Chargers', icon: BatteryCharging, href: '/phones?category=chargers', color: 'from-green-500 to-green-600' },
    { name: 'Airpods', icon: Ear, href: '/phones?category=airpods', color: 'from-sky-500 to-sky-600' },
    { name: 'Screen Protectors', icon: MonitorSmartphone, href: '/phones?category=screen-protectors', color: 'from-amber-500 to-amber-600' },
    { name: 'Services', icon: Wrench, href: '/repair', color: 'from-orange-500 to-orange-600' },
    { name: 'Accessories', icon: ShoppingBag, href: '/accessories', color: 'from-teal-500 to-teal-600' },
];

export function CategoryTabs() {
    return (
        <section className="py-6 md:py-10 bg-background/50 backdrop-blur-sm border-y border-border/50">
            <div className="container px-4 sm:px-6 lg:px-8">
                <div
                    className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3 sm:gap-4 md:gap-6"
                >
                    {categories.map((cat) => (
                        <Link
                            key={cat.name}
                            href={cat.href}
                            className="group flex flex-col items-center gap-3 transition-transform duration-300 hover:-translate-y-1"
                        >
                            <div
                                className={`
                                    relative w-full aspect-square max-w-[80px] rounded-2xl sm:rounded-3xl
                                    bg-gradient-to-br ${cat.color}
                                    flex items-center justify-center
                                    shadow-lg shadow-${cat.color.split('-')[1]}-500/20
                                    group-hover:shadow-${cat.color.split('-')[1]}-500/40
                                    transition-all duration-300
                                    group-hover:scale-105
                                    group-active:scale-95
                                `}
                            >
                                <cat.icon className="h-7 w-7 sm:h-9 sm:w-9 text-white group-hover:rotate-12 transition-transform duration-300" />
                                <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <span className="text-[10px] sm:text-xs md:text-sm font-bold text-foreground/90 text-center leading-tight group-hover:text-primary transition-colors uppercase tracking-wider">
                                {cat.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
