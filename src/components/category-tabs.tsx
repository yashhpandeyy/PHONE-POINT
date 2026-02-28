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
        <section className="py-4 md:py-6">
            <div className="container px-4 sm:px-6 lg:px-8">
                <div
                    className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {categories.map((cat) => (
                        <Link
                            key={cat.name}
                            href={cat.href}
                            className="flex-shrink-0 group"
                        >
                            <div className="flex flex-col items-center gap-2 w-20 sm:w-24">
                                <div
                                    className={`
                    w-14 h-14 sm:w-16 sm:h-16 rounded-2xl
                    bg-gradient-to-br ${cat.color}
                    flex items-center justify-center
                    shadow-md group-hover:shadow-lg
                    transition-all duration-300
                    group-hover:scale-110 group-hover:-translate-y-1
                    group-active:scale-95
                  `}
                                >
                                    <cat.icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                                </div>
                                <span className="text-[11px] sm:text-xs font-medium text-foreground/80 text-center leading-tight group-hover:text-primary transition-colors">
                                    {cat.name}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
