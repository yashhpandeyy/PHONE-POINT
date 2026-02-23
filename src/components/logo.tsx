import Link from 'next/link';
import Image from 'next/image';

export function Logo() {
  return (
    <Link href="/home" className="flex items-center gap-2" prefetch={false}>
      <Image src="/LOGO.png" alt="Phone Point Logo" width={80} height={22} priority />
    </Link>
  );
}
