import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { CAFE_MENU } from "./src/menu";
import { CRMDatabase } from "./src/crm-database";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Setup Gemini SDK lazily to protect against start-up crashes
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI | null {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "") {
        try {
          aiClient = new GoogleGenAI({
            apiKey: apiKey,
            httpOptions: {
              headers: {
                "User-Agent": "aistudio-build",
              },
            },
          });
          console.log("Successfully initialized GoogleGenAI client with GEMINI_API_KEY.");
        } catch (err) {
          console.error("Error setting up GoogleGenAI:", err);
        }
      } else {
        console.warn("No valid GEMINI_API_KEY env variable found. Using high-fidelity deterministic fallback sommelier.");
      }
    }
    return aiClient;
  }

  // API 1: Healthcheck
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // API 2: Smart Coffee Recommendation Engine
  app.post("/api/recommend", async (req, res) => {
    const { mood, weather, activity, userId } = req.body;

    if (!mood || !weather || !activity) {
      return res.status(400).json({ error: "Mood, weather, and activity are required." });
    }

    // Try to find user profile details to personalize recommendations
    let userDetails = "";
    let userProf = null;
    if (userId) {
      userProf = CRMDatabase.findUserById(userId);
      if (userProf && userProf.preferences) {
        const pref = userProf.preferences;
        userDetails = `User profile preferences: Name is ${userProf.name}, Coffee strength preference: ${pref.coffeeStrength}, milk/dairy preference: ${pref.milkPreference}.`;
      }
    }

    const ai = getGeminiClient();

    if (ai) {
      // Prompt construction for real-time AI selection and matching 
      const systemPrompt = "You are the premium virtual Coffee Sommelier at Cafe Carousal, a luxurious, cozy French artisan coffee house. Your role is to select products from our catalog and explain why they perfectly fits the guest's profile. You must be witty, elegant, cozy and comforting.";
      
      const prompt = `
Given the customer profile details, current atmospheric conditions, and activity, select the absolute best matching menu items from the Cafe Carousal catalog below.

--- CUSTOMER CONTEXT ---
Mood: ${mood}
Weather: ${weather}
Activity: ${activity}
${userDetails}

--- CAFE CAROUSAL MENU CATALOG ---
${JSON.stringify(CAFE_MENU, null, 2)}

--- RULES ---
1. Select ONE 'primaryId' (from the catalog menu).
2. Write a highly personalized, creative and comforting 'primaryReason' (1-2 sentences) explaining how it matches their mood (${mood}), weather (${weather}), activity (${activity}), and honors their dairy/milk preference (if specified).
3. Select TWO distinct 'otherIds' (from the catalog menu) as high-value secondary match alternatives and write corresponding reasons in 'otherReasons'.
4. Select a complementary pairing as Chef's Special ('chefSpecialId1' and 'chefSpecialId2'). Make sure one is a drink and one is a baker/snack/dessert (category: 'bakery' or 'dessert'), and write a delightful 'chefSpecialReason'.
5. Write a heartwarming, personal 'aiSommelierNote' (2-3 sentences) styled as a friendly, luxurious barista greeting, making them feel extremely pampered at Cafe Carousal. Keep it highly cozy and conversational.
`;

      try {
        const responseHandler = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                primaryId: { type: Type.STRING },
                primaryReason: { type: Type.STRING },
                otherIds: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                otherReasons: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                chefSpecialId1: { type: Type.STRING },
                chefSpecialId2: { type: Type.STRING },
                chefSpecialReason: { type: Type.STRING },
                aiSommelierNote: { type: Type.STRING }
              },
              required: [
                "primaryId",
                "primaryReason",
                "otherIds",
                "otherReasons",
                "chefSpecialId1",
                "chefSpecialId2",
                "chefSpecialReason",
                "aiSommelierNote"
              ]
            }
          }
        });

        const jsonStr = responseHandler.text?.trim() || "{}";
        const result = JSON.parse(jsonStr);

        // Map and reconstruct full menu items
        const primaryItem = CAFE_MENU.find(m => m.id === result.primaryId) || CAFE_MENU[0];
        const otherItems = (result.otherIds || []).map((id: string, index: number) => {
          const item = CAFE_MENU.find(m => m.id === id) || CAFE_MENU[Math.min(index + 1, CAFE_MENU.length - 1)];
          const reason = result.otherReasons?.[index] || "A complementary alternative for your café session.";
          return { ...item, engagingReason: reason };
        });

        const chefId1 = result.chefSpecialId1;
        const chefId2 = result.chefSpecialId2;
        const item1 = CAFE_MENU.find(m => m.id === chefId1) || CAFE_MENU[2];
        const item2 = CAFE_MENU.find(m => m.id === chefId2) || CAFE_MENU[9];

        const chefSpecial = {
          ...item1,
          name: `${item1.name} & ${item2.name}`,
          price: Number((item1.price + item2.price * 0.9).toFixed(2)), // Give a 10% combo discount
          engagingReason: result.chefSpecialReason || "A gourmet combo designed for gourmet tastes."
        };

        // For conversion logs
        CRMDatabase.logRecommendation(mood, weather, activity, primaryItem.id, userId);

        return res.json({
          primaryRecommendation: { ...primaryItem, engagingReason: result.primaryReason },
          otherRecommendations: otherItems,
          chefSpecial: chefSpecial,
          aiSommelierNote: result.aiSommelierNote,
          isAI: true
        });

      } catch (err) {
        console.error("Gemini recommendation invocation failed. Falling back to deterministic recommender:", err);
      }
    }

    // ================= FALLBACK RECOMENDER ENGINE =================
    // Calculated based on mood / activity / weather tag overlaps!
    const scoredMenu = CAFE_MENU.map(item => {
      let score = 0;
      if (item.moodTags.includes(mood)) score += 5;
      if (item.weatherTags.includes(weather)) score += 4;
      if (item.activityTags.includes(activity)) score += 3;

      // Personalized preferences bonus
      if (userProf && userProf.preferences) {
        const pref = userProf.preferences;
        if (pref.milkPreference !== "none" && item.category === "coffee" && item.description.toLowerCase().includes("milk")) {
          score += 1;
        }
        if (pref.coffeeStrength === "strong" && item.name.toLowerCase().includes("espresso") || item.name.toLowerCase().includes("nitro")) {
          score += 2;
        }
      }
      return { item, score };
    }).sort((a,b) => b.score - a.score);

    const primaryRec = scoredMenu[0].item;
    const secondaryRec1 = scoredMenu[1].item;
    const secondaryRec2 = scoredMenu[2].item;

    const backupDrink = CAFE_MENU.find(m => m.category === "coffee" || m.category === "cold_brew" || m.category === "tea") || CAFE_MENU[0];
    const backupPastry = CAFE_MENU.find(m => m.category === "bakery" || m.category === "dessert") || CAFE_MENU[9];

    CRMDatabase.logRecommendation(mood, weather, activity, primaryRec.id, userId);

    res.json({
      primaryRecommendation: {
        ...primaryRec,
        engagingReason: `The Café Carousal Sommelier selected the ${primaryRec.name} because it perfectly blends with a ${mood} mood on a ${weather} day to accompany your ${activity} session. It matches all your flavor criteria perfectly.`
      },
      otherRecommendations: [
        {
          ...secondaryRec1,
          engagingReason: `An exceptional secondary recommendation ideal for ${activity} and matching your ${mood} frame of mind.`
        },
        {
          ...secondaryRec2,
          engagingReason: `A gorgeous alternative to explore, carrying high comforting notes matching the ${weather} atmosphere.`
        }
      ],
      chefSpecial: {
        ...backupDrink,
        name: `${backupDrink.name} & ${backupPastry.name} Harmony`,
        price: Number((backupDrink.price + backupPastry.price * 0.9).toFixed(2)),
        engagingReason: `Our artisanal pairing: Hot ${backupDrink.name} combined with the warm gourmet ${backupPastry.name} to form a premium tasting match.`
      },
      aiSommelierNote: `Welcome back to Café Carousal! It is a ${weather} day and we hope your ${activity} session is going beautifully. We have curated a selection designed to ground your ${mood} mood. Sit back, relax, and let our baristas craft your masterpiece.`,
      isAI: false
    });
  });

  // Client authentication & registration
  app.post("/api/auth/register", (req, res) => {
    const { name, email, birthDate } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required." });
    }
    const user = CRMDatabase.createUser(name, email, birthDate);
    res.json({ user });
  });

  app.post("/api/auth/login", (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }
    let user = CRMDatabase.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User profile not found. Please register to enroll in our CRM rewards program!" });
    }
    res.json({ user });
  });

  app.post("/api/users/:userId/settings", (req, res) => {
    const { userId } = req.params;
    const { name, birthDate, preferences, isSubscribed } = req.body;
    try {
      const updated = CRMDatabase.updateUserProfile(userId, { name, birthDate, preferences, isSubscribed });
      res.json({ user: updated });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Favorites
  app.get("/api/users/:userId/favorites", (req, res) => {
    const { userId } = req.params;
    const favs = CRMDatabase.getFavoritesForUser(userId);
    res.json({ favorites: favs });
  });

  app.post("/api/users/:userId/favorites", (req, res) => {
    const { userId } = req.params;
    const { itemId } = req.body;
    if (!itemId) return res.status(400).json({ error: "Item ID required" });
    const result = CRMDatabase.toggleFavorite(userId, itemId);
    res.json(result);
  });

  // Orders and history
  app.get("/api/users/:userId/orders", (req, res) => {
    const { userId } = req.params;
    const orders = CRMDatabase.getOrdersForUser(userId);
    res.json({ orders });
  });

  app.post("/api/users/:userId/orders", (req, res) => {
    const { userId } = req.params;
    const { items, couponCode } = req.body;
    if (!items || !items.length) {
      return res.status(400).json({ error: "Order items are required." });
    }
    try {
      const order = CRMDatabase.addOrder(userId, items, couponCode);
      const user = CRMDatabase.findUserById(userId);
      res.json({ order, user });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Newsletter subscription
  app.post("/api/subscribe", (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required." });
    CRMDatabase.subscribeEmail(email);
    res.json({ success: true, message: "Enrolled in Cafe Carousal club letters!" });
  });

  // CRM Analytics stats for the premium Admin Panel
  app.get("/api/admin/stats", (req, res) => {
    try {
      const stats = CRMDatabase.getCRMStats();
      res.json({ stats });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite Integration & SPA asset serving fallback
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Cafe Carousal Server] running at http://localhost:${PORT}`);
  });
}

startServer();
