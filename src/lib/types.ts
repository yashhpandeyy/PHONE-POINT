import type { Models } from 'appwrite';

// This is the shape of the document stored in Appwrite
export interface PhoneDocument extends Models.Document {
  // Common fields
  name: string;
  price: number;
  new_price?: number; // Promotional price
  tag?: 'sale' | 'budget' | 'like-new' | 'none'; // Deal categorization
  description: string;
  image: string[];
  type: 'phone' | 'accessory' | 'repair';

  // Optional fields
  brand?: string;
  Condition?: 'new' | 'used' | 'damaged';
  storage?: '32' | '64' | '128' | '256' | '512' | '1TB';
  Colour?: string; // Note the casing
  camera?: string;
  Battery?: number;
  Processor?: string;
}

// --- Chat Types ---

export interface ConversationDocument extends Models.Document {
  participants: string[]; // Array of user IDs, e.g., [userId, adminId]
  lastMessage: string;
  lastUpdatedAt: string; // ISO 8601 string from new Date().toISOString()
  userName: string; // Name of the non-admin user
  userId: string; // The client's Appwrite user ID
  userEmail: string; // The client's email address
  lastRepliedBy?: string; // ID of the user who sent the last message
}

export interface MessageDocument extends Models.Document {
  conversationId: string; // Relation to the conversations collection
  senderId: string;
  text: string;
}
