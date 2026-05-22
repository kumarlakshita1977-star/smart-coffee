import * as fs from 'fs';
import * as path from 'path';
import { User, Order, FavoriteItem, CRMStats, MenuItem } from './types';
import { CAFE_MENU } from './menu';

const DB_FILE = path.join(process.cwd(), 'crm_db.json');

interface DatabaseSchema {
  users: User[];
  orders: Order[];
  favorites: FavoriteItem[];
  subscriptions: string[];
  recommendationLogs: {
    id: string;
    userId?: string;
    mood: string;
    weather: string;
    activity: string;
    recommendedItemId: string;
    timestamp: string;
    converted: boolean; // Did they order?
  }[];
}

const INITIAL_DB: DatabaseSchema = {
  users: [
    {
      id: "u1",
      email: "alex.coffee@gmail.com",
      name: "Alex Rivera",
      segment: "coffee_lover",
      loyaltyPoints: 340,
      joinedAt: "2026-01-15T08:00:00Z",
      birthDate: "1994-04-12",
      isSubscribed: true,
      preferences: {
        favoriteMoods: ["focused", "tired"],
        coffeeStrength: "strong",
        milkPreference: "oat"
      }
    },
    {
      id: "u2",
      email: "sophia.student@edu.com",
      name: "Sophia Martinez",
      segment: "student",
      loyaltyPoints: 120,
      joinedAt: "2026-03-10T11:30:00Z",
      birthDate: "2002-11-20",
      isSubscribed: true,
      preferences: {
        favoriteMoods: ["stressed", "happy"],
        coffeeStrength: "medium",
        milkPreference: "almond"
      }
    },
    {
      id: "u3",
      email: "marcus.v@regular.com",
      name: "Marcus Vance",
      segment: "regular",
      loyaltyPoints: 780,
      joinedAt: "2025-09-01T07:15:00Z",
      birthDate: "1988-08-08",
      isSubscribed: false,
      preferences: {
        favoriteMoods: ["relaxed", "romantic"],
        coffeeStrength: "medium",
        milkPreference: "whole"
      }
    },
    {
      id: "u4",
      email: "emily.active@fit.com",
      name: "Emily Watson",
      segment: "new",
      loyaltyPoints: 40,
      joinedAt: "2026-05-18T14:22:00Z",
      birthDate: "1997-02-14",
      isSubscribed: true,
      preferences: {
        favoriteMoods: ["energetic"],
        coffeeStrength: "strong",
        milkPreference: "none"
      }
    }
  ],
  orders: [
    // Historical orders to build analytics
    {
      id: "ord_1",
      userId: "u1",
      items: [{ item: CAFE_MENU[1], quantity: 2 }], // Midnight Eclipse
      totalPrice: 8.50,
      pointsEarned: 8,
      createdAt: "2026-05-10T09:00:00Z"
    },
    {
      id: "ord_2",
      userId: "u2",
      items: [{ item: CAFE_MENU[0], quantity: 1 }, { item: CAFE_MENU[9], quantity: 1 }], // Velvet Cloud + Chocolate Muffin
      totalPrice: 10.25,
      pointsEarned: 10,
      createdAt: "2026-05-12T15:40:00Z"
    },
    {
      id: "ord_3",
      userId: "u3",
      items: [{ item: CAFE_MENU[2], quantity: 1 }, { item: CAFE_MENU[8], quantity: 1 }], // Lavender Breeze + Cardamom Bun
      totalPrice: 11.20,
      pointsEarned: 11,
      createdAt: "2026-05-15T10:15:00Z"
    },
    {
      id: "ord_4",
      userId: "u1",
      items: [{ item: CAFE_MENU[5], quantity: 1 }], // Neon Volt
      totalPrice: 6.75,
      pointsEarned: 6,
      createdAt: "2026-05-18T08:30:00Z"
    },
    {
      id: "ord_5",
      userId: "u2",
      items: [{ item: CAFE_MENU[3], quantity: 1 }], // Golden Elixir
      totalPrice: 5.95,
      pointsEarned: 5,
      createdAt: "2026-05-20T16:10:00Z"
    },
    {
      id: "ord_6",
      userId: "u3",
      items: [{ item: CAFE_MENU[4], quantity: 2 }, { item: CAFE_MENU[10], quantity: 1 }], // Rose Quartz + Almond Croissant
      totalPrice: 18.25,
      pointsEarned: 18,
      createdAt: "2026-05-21T11:00:00Z"
    }
  ],
  favorites: [
    { userId: "u1", itemId: "2", addedAt: "2026-01-20T09:00:00Z" },
    { userId: "u1", itemId: "6", addedAt: "2026-01-21T09:00:00Z" },
    { userId: "u2", itemId: "1", addedAt: "2026-03-12T11:00:00Z" },
    { userId: "u3", itemId: "3", addedAt: "2025-10-01T08:00:00Z" },
    { userId: "u3", itemId: "9", addedAt: "2025-10-05T08:00:00Z" }
  ],
  subscriptions: [
    "alex.coffee@gmail.com",
    "sophia.student@edu.com",
    "emily.active@fit.com",
    "john.doe@test.com"
  ],
  recommendationLogs: [
    { id: "rec_1", userId: "u1", mood: "focused", weather: "cloudy", activity: "working", recommendedItemId: "2", timestamp: "2026-05-10T08:55:00Z", converted: true },
    { id: "rec_2", userId: "u2", mood: "stressed", weather: "rainy", activity: "studying", recommendedItemId: "1", timestamp: "2026-05-12T15:35:00Z", converted: true },
    { id: "rec_3", userId: "u3", mood: "relaxed", weather: "cold", activity: "reading", recommendedItemId: "9", timestamp: "2026-05-15T10:10:00Z", converted: true },
    { id: "rec_4", userId: "u1", mood: "energetic", weather: "hot", activity: "working", recommendedItemId: "6", timestamp: "2026-05-18T08:25:00Z", converted: true },
    { id: "rec_5", userId: "u2", mood: "tired", weather: "cold", activity: "studying", recommendedItemId: "4", timestamp: "2026-05-20T16:05:00Z", converted: true },
    { id: "rec_6", userId: "u3", mood: "romantic", weather: "summer", activity: "meeting friends", recommendedItemId: "5", timestamp: "2026-05-21T10:50:00Z", converted: true },
    { id: "rec_7", mood: "happy", weather: "summer", activity: "relaxing", recommendedItemId: "3", timestamp: "2026-05-22T04:15:00Z", converted: false },
    { id: "rec_8", mood: "tired", weather: "rainy", activity: "reading", recommendedItemId: "1", timestamp: "2026-05-22T04:20:00Z", converted: false },
    { id: "rec_9", userId: "u4", mood: "energetic", weather: "hot", activity: "working", recommendedItemId: "6", timestamp: "2026-05-22T04:50:00Z", converted: false }
  ]
};

export class CRMDatabase {
  private static load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const data = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(data);
      }
    } catch (e) {
      console.error("Error reading db file. Resetting to initial database.", e);
    }
    this.save(INITIAL_DB);
    return INITIAL_DB;
  }

  private static save(schema: DatabaseSchema) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(schema, null, 2), 'utf-8');
    } catch (e) {
      console.error("Error writing db file.", e);
    }
  }

  static getUsers(): User[] {
    return this.load().users;
  }

  static findUserByEmail(email: string): User | undefined {
    return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  static findUserById(id: string): User | undefined {
    return this.getUsers().find(u => u.id === id);
  }

  static createUser(name: string, email: string, birthDate?: string): User {
    const db = this.load();
    const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) return existing;

    const newUser: User = {
      id: "u_" + Math.random().toString(36).substr(2, 9),
      email: email.toLowerCase(),
      name,
      segment: "new",
      loyaltyPoints: 50, // 50 sign up points welcome bonus!
      joinedAt: new Date().toISOString(),
      birthDate,
      isSubscribed: false
    };

    db.users.push(newUser);
    this.save(db);
    return newUser;
  }

  static updateUserProfile(userId: string, updates: Partial<User>): User {
    const db = this.load();
    const index = db.users.findIndex(u => u.id === userId);
    if (index === -1) throw new Error("User not found");

    db.users[index] = { ...db.users[index], ...updates };
    this.save(db);
    return db.users[index];
  }

  static subscribeEmail(email: string): boolean {
    const db = this.load();
    const cleanEmail = email.toLowerCase().trim();
    if (!db.subscriptions.includes(cleanEmail)) {
      db.subscriptions.push(cleanEmail);
      // Update matching user if any
      const user = db.users.find(u => u.email.toLowerCase() === cleanEmail);
      if (user) {
        user.isSubscribed = true;
      }
      this.save(db);
    }
    return true;
  }

  static toggleFavorite(userId: string, itemId: string): { isFavorite: boolean } {
    const db = this.load();
    const existIndex = db.favorites.findIndex(f => f.userId === userId && f.itemId === itemId);
    let isFavorite = false;

    if (existIndex !== -1) {
      db.favorites.splice(existIndex, 1);
    } else {
      db.favorites.push({
        userId,
        itemId,
        addedAt: new Date().toISOString()
      });
      isFavorite = true;
    }

    this.save(db);
    return { isFavorite };
  }

  static getFavoritesForUser(userId: string): FavoriteItem[] {
    return this.load().favorites.filter(f => f.userId === userId);
  }

  static addOrder(userId: string, items: { itemId: string; name: string; price: number; quantity: number }[], couponCode?: string): Order {
    const db = this.load();
    const userIndex = db.users.findIndex(u => u.id === userId);
    if (userIndex === -1) throw new Error("User not found");

    const user = db.users[userIndex];

    // Build real MenuItem array from catalog IDs
    const resolvedItems = items.map(line => {
      const original = CAFE_MENU.find(m => m.id === line.itemId) || {
        id: line.itemId,
        name: line.name,
        category: "coffee" as const,
        price: line.price,
        description: "",
        moodTags: [],
        weatherTags: [],
        activityTags: [],
        imageType: "cappuccino",
        steamEffect: false
      };
      return { item: original, quantity: line.quantity };
    });

    // Compute raw total
    let subtotal = resolvedItems.reduce((acc, current) => acc + (current.item.price * current.quantity), 0);
    
    // Apply coupon if present
    let discountPct = 0;
    if (couponCode) {
      const code = couponCode.toUpperCase().trim();
      if (code === "WELCOME50") {
        discountPct = 50;
      } else if (code.endsWith("OFF20")) {
        discountPct = 20;
      } else if (code.endsWith("OFF10")) {
        discountPct = 10;
      } else if (code === "BIRTHDAY40") {
        discountPct = 40;
      }
    }

    const discountAmount = subtotal * (discountPct / 100);
    const totalPrice = Number((subtotal - discountAmount).toFixed(2));
    
    // Calculate loyalty points: 1 point per $1 spent
    const pointsEarned = Math.floor(totalPrice);
    user.loyaltyPoints += pointsEarned;

    // Recalculate segment
    const totalOrders = db.orders.filter(o => o.userId === userId).length + 1;
    if (totalOrders > 10) {
      user.segment = "coffee_lover";
    } else if (totalOrders > 3) {
      user.segment = "regular";
    } else {
      user.segment = "new";
    }

    const newOrder: Order = {
      id: "ord_" + Math.random().toString(36).substr(2, 9),
      userId,
      items: resolvedItems,
      totalPrice,
      pointsEarned,
      createdAt: new Date().toISOString(),
      couponUsed: couponCode
    };

    db.orders.push(newOrder);

    // Look for previous recommendations of these items to convert them in logs
    resolvedItems.forEach(line => {
      const matchLog = db.recommendationLogs
        .filter(l => l.userId === userId && l.recommendedItemId === line.item.id && !l.converted)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
      if (matchLog) {
        matchLog.converted = true;
      }
    });

    this.save(db);
    return newOrder;
  }

  static getOrdersForUser(userId: string): Order[] {
    return this.load().orders.filter(o => o.userId === userId).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static logRecommendation(mood: string, weather: string, activity: string, recommendedItemId: string, userId?: string) {
    const db = this.load();
    db.recommendationLogs.push({
      id: "rec_" + Math.random().toString(36).substr(2, 9),
      userId,
      mood,
      weather,
      activity,
      recommendedItemId,
      timestamp: new Date().toISOString(),
      converted: false
    });
    this.save(db);
  }

  static getCRMStats(): CRMStats {
    const db = this.load();
    
    // Total numbers
    const totalCustomers = db.users.length;
    const activeLoyaltyMembers = db.users.filter(u => u.loyaltyPoints > 0).length;
    const totalLoyaltyPoints = db.users.reduce((acc, u) => acc + u.loyaltyPoints, 0);

    // Sales metrics
    const totalSalesNum = db.orders.reduce((acc, o) => acc + o.totalPrice, 0);
    const totalSales = Number(totalSalesNum.toFixed(2));
    const averageOrderValue = db.orders.length > 0 ? Number((totalSalesNum / db.orders.length).toFixed(2)) : 0;

    // Aggregations: Moods
    const moodCounts: { [m: string]: number } = {};
    db.recommendationLogs.forEach(log => {
      moodCounts[log.mood] = (moodCounts[log.mood] || 0) + 1;
    });
    const popularMoods = Object.entries(moodCounts)
      .map(([mood, count]) => ({ mood, count }))
      .sort((a, b) => b.count - a.count);

    // Aggregations: Activities
    const activityCounts: { [a: string]: number } = {};
    db.recommendationLogs.forEach(log => {
      activityCounts[log.activity] = (activityCounts[log.activity] || 0) + 1;
    });
    const popularActivities = Object.entries(activityCounts)
      .map(([activity, count]) => ({ activity, count }))
      .sort((a, b) => b.count - a.count);

    // Aggregations: Products ordered
    const productCounts: { [name: string]: number } = {};
    db.orders.forEach(o => {
      o.items.forEach(line => {
        productCounts[line.item.name] = (productCounts[line.item.name] || 0) + line.quantity;
      });
    });
    const popularProducts = Object.entries(productCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Segments
    const segmentCounts: { [seg: string]: number } = { student: 0, coffee_lover: 0, regular: 0, new: 0 };
    db.users.forEach(u => {
      segmentCounts[u.segment] = (segmentCounts[u.segment] || 0) + 1;
    });
    const segmentationData = Object.entries(segmentCounts).map(([segment, count]) => ({ segment, count }));

    // Conversions by day
    // Group recommendation logs & see how many converted
    const conversionsMap: { [date: string]: { recommended: number; ordered: number } } = {};
    
    // Seed last 5 days
    for (let i = 4; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      conversionsMap[dateStr] = { recommended: 0, ordered: 0 };
    }

    db.recommendationLogs.forEach(log => {
      const dateStr = log.timestamp.split('T')[0];
      if (!conversionsMap[dateStr]) {
        conversionsMap[dateStr] = { recommended: 0, ordered: 0 };
      }
      conversionsMap[dateStr].recommended += 1;
      if (log.converted) {
        conversionsMap[dateStr].ordered += 1;
      }
    });

    const recommendationConversion = Object.entries(conversionsMap)
      .map(([date, vals]) => ({ date, recommended: vals.recommended, ordered: vals.ordered }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      totalCustomers,
      activeLoyaltyMembers,
      totalLoyaltyPoints,
      averageOrderValue,
      totalSales,
      popularMoods,
      popularActivities,
      popularProducts,
      segmentationData,
      recommendationConversion
    };
  }
}
