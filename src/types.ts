export interface User {
  id: string;
  email: string;
  name: string;
  segment: 'student' | 'coffee_lover' | 'regular' | 'new';
  loyaltyPoints: number;
  joinedAt: string;
  birthDate?: string;
  isSubscribed: boolean;
  preferences?: {
    favoriteMoods: string[];
    coffeeStrength: 'light' | 'medium' | 'strong';
    milkPreference: 'whole' | 'oat' | 'almond' | 'coconut' | 'none';
  };
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'coffee' | 'cold_brew' | 'tea' | 'bakery' | 'dessert';
  price: number;
  description: string;
  moodTags: string[];
  weatherTags: string[];
  activityTags: string[];
  imageType: string; // Used to select specific rich icons/visuals
  steamEffect: boolean;
}

export interface RecommendationResponse {
  primaryRecommendation: MenuItem & { engagingReason: string; discountCode?: string; discountPct?: number };
  otherRecommendations: (MenuItem & { engagingReason: string })[];
  chefSpecial: MenuItem & { engagingReason: string };
  aiSommelierNote: string;
}

export interface FavoriteItem {
  userId: string;
  itemId: string;
  addedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  items: { item: MenuItem; quantity: number }[];
  totalPrice: number;
  pointsEarned: number;
  createdAt: string;
  couponUsed?: string;
}

export interface Coupon {
  code: string;
  discountPct: number;
  description: string;
  isRedeemed: boolean;
  expiresBy: string;
}

export interface CRMStats {
  totalCustomers: number;
  activeLoyaltyMembers: number;
  totalLoyaltyPoints: number;
  averageOrderValue: number;
  totalSales: number;
  popularMoods: { mood: string; count: number }[];
  popularActivities: { activity: string; count: number }[];
  popularProducts: { name: string; count: number }[];
  segmentationData: { segment: string; count: number }[];
  recommendationConversion: { date: string; recommended: number; ordered: number }[];
}
