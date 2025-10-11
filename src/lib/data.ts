export type Phone = {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  condition: 'Excellent' | 'Good' | 'Fair';
  storage: '64GB' | '128GB' | '256GB' | '512GB';
  color: string;
  image: string; // Placeholder ID from placeholder-images.json
  description: string;
  specs: {
    display: string;
    camera: string;
    battery: string;
    processor: string;
  };
};

export const phones: Phone[] = [
  {
    id: 'iphone-14-pro',
    name: 'iPhone 14 Pro',
    brand: 'Apple',
    price: 899,
    originalPrice: 999,
    condition: 'Excellent',
    storage: '256GB',
    color: 'Deep Purple',
    image: 'iphone-14-pro-purple',
    description: 'The iPhone 14 Pro features the Dynamic Island, a 48MP Main camera for up to 4x greater resolution, and an Always-On display.',
    specs: {
      display: '6.1" Super Retina XDR display',
      camera: '48MP Main, 12MP Ultra Wide, 12MP Telephoto',
      battery: 'Up to 23 hours video playback',
      processor: 'A16 Bionic chip',
    },
  },
  {
    id: 'samsung-galaxy-s23-ultra',
    name: 'Galaxy S23 Ultra',
    brand: 'Samsung',
    price: 949,
    originalPrice: 1199,
    condition: 'Excellent',
    storage: '512GB',
    color: 'Phantom Black',
    image: 'samsung-s23-ultra-black',
    description: 'The Galaxy S23 Ultra comes with a built-in S Pen, an epic 200MP camera, and our most powerful processor ever.',
    specs: {
      display: '6.8" Dynamic AMOLED 2X',
      camera: '200MP Wide, 12MP Ultra Wide, 10MP Telephoto (2)',
      battery: '5000mAh',
      processor: 'Snapdragon 8 Gen 2 for Galaxy',
    },
  },
  {
    id: 'google-pixel-7-pro',
    name: 'Pixel 7 Pro',
    brand: 'Google',
    price: 599,
    originalPrice: 899,
    condition: 'Good',
    storage: '128GB',
    color: 'Obsidian',
    image: 'pixel-7-pro-obsidian',
    description: 'The Google Pixel 7 Pro is the most powerful Pixel yet, with Google Tensor G2 and a pro-level camera system.',
    specs: {
      display: '6.7" QHD+ LTPO OLED',
      camera: '50MP Wide, 12MP Ultra Wide, 48MP Telephoto',
      battery: '5000mAh',
      processor: 'Google Tensor G2',
    },
  },
  {
    id: 'iphone-13',
    name: 'iPhone 13',
    brand: 'Apple',
    price: 529,
    originalPrice: 699,
    condition: 'Good',
    storage: '128GB',
    color: 'Midnight',
    image: 'iphone-13-midnight',
    description: 'The iPhone 13 boasts a beautiful Super Retina XDR display and the advanced A15 Bionic chip for lightning-fast performance.',
    specs: {
      display: '6.1" Super Retina XDR display',
      camera: '12MP Wide, 12MP Ultra Wide',
      battery: 'Up to 19 hours video playback',
      processor: 'A15 Bionic chip',
    },
  },
    {
    id: 'samsung-galaxy-z-fold-4',
    name: 'Galaxy Z Fold 4',
    brand: 'Samsung',
    price: 1099,
    originalPrice: 1799,
    condition: 'Excellent',
    storage: '256GB',
    color: 'Graygreen',
    image: 'samsung-z-fold-4-green',
    description: 'Unfold an immersive experience with the Galaxy Z Fold 4, featuring a massive main screen and PC-like multitasking.',
    specs: {
      display: '7.6" Main, 6.2" Cover',
      camera: '50MP Wide, 12MP Ultra Wide, 10MP Telephoto',
      battery: '4400mAh',
      processor: 'Snapdragon 8+ Gen 1',
    },
  },
  {
    id: 'google-pixel-6a',
    name: 'Pixel 6a',
    brand: 'Google',
    price: 299,
    originalPrice: 449,
    condition: 'Fair',
    storage: '128GB',
    color: 'Chalk',
    image: 'pixel-6a-chalk',
    description: 'Experience the power of Google Tensor at an amazing price. The Pixel 6a is smart, powerful, and helpful.',
    specs: {
      display: '6.1" FHD+ OLED',
      camera: '12.2MP Wide, 12MP Ultra Wide',
      battery: '4410mAh',
      processor: 'Google Tensor',
    },
  },
];
