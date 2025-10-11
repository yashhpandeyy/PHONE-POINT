import Link from 'next/link';
import Image from 'next/image';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" prefetch={false}>
      <Image src="/LOGO.png" alt="Phone Point Logo" width={120} height={34} />
    </Link>
  );
}
