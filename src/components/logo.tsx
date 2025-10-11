import Link from 'next/link';
import { Smartphone } from 'lucide-react';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" prefetch={false}>
      <Smartphone className="h-8 w-8 text-primary" />
      <span className="text-2xl font-bold text-white">
        Phone <span className="text-primary">Point</span>
      </span>
    </Link>
  );
}
