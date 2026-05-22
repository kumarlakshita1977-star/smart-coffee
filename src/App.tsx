import React, { useState, useEffect } from "react";
import { MenuItem, User, Order, RecommendationResponse } from "./types";
import { RecommendationCard } from "./components/RecommendationCard";
import { AdminPanel } from "./components/AdminPanel";
import { CRMAccount } from "./components/CRMAccount";
import { motion, AnimatePresence } from "motion/react";
import { 
  Coffee, 
  Compass, 
  Users, 
  BarChart3, 
  CloudRain, 
  Award, 
  Loader2, 
  ShoppingCart, 
  Smile, 
  Heart, 
  Gift, 
  ChevronRight, 
  Flame, 
  Sparkles, 
  Plus, 
  Minus, 
  X,
  Mail,
  ThumbsUp
} from "lucide-react";

// Predefined available selects
const MOODS = [
  { value: "happy", label: "Happy ☀️", desc: "Joyful, sweet and uplifting" },
  { value: "tired", label: "Tired 🥱", desc: "Needs a heavy espresso charge" },
  { value: "stressed", label: "Stressed 🤯", desc: "Soothing lavender and calming notes" },
  { value: "relaxed", label: "Relaxed 🧘", desc: "Smooth, balanced slow-sipping" },
  { value: "energetic", label: "Energetic ⚡", desc: "High octane cold brew rush" },
  { value: "romantic", label: "Romantic 💕", desc: "Decadent cream and rose infusion" },
  { value: "focused", label: "Focused 🎯", desc: "Intense clean dark roast power" }
];

const WEATHERS = [
  { value: "cloudy", label: "Cloudy ☁️", desc: "Creamy vanilla cozy matches" },
  { value: "rainy", label: "Rainy 🌧️", desc: "Rich hot chocolate melter" },
  { value: "cold", label: "Freezing Cold ❄️", desc: "Steaming spiced herbal chai" },
  { value: "hot", label: "Scorching Hot ☀️", desc: "Nitro-iced slow flow tall cups" },
  { value: "summer", label: "Balmy Summer 🌊", desc: "Gelato-topped affogato sweets" },
  { value: "winter", label: "Cosy Winter ☃️", desc: "Cinnamon cardamom baked buns" }
];

const ACTIVITIES = [
  { value: "working", label: "Deep Working 💻", desc: "Continuous clean buzz" },
  { value: "studying", label: "Studying 📚", desc: "Smooth milk focused lattes" },
  { value: "relaxing", label: "Relaxing 🎹", desc: "Comforting spice sweet buns" },
  { value: "meeting friends", label: "Meeting Friends 👥", desc: "Sharing affogatos & desserts" },
  { value: "gaming", label: "Hardcore Gaming 🎮", desc: "High energy cold rush" },
  { value: "reading", label: "Cozy Reading 📖", desc: "Slow micro-layered cappuccino" }
];

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<"sommelier" | "crm" | "admin" | "about">("sommelier");

  // Selection configurations
  const [selectedMood, setSelectedMood] = useState("relaxed");
  const [selectedWeather, setSelectedWeather] = useState("cloudy");
  const [selectedActivity, setSelectedActivity] = useState("reading");

  // Outputs state
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<RecommendationResponse | null>(null);

  // CRM auth variables
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userFavorites, setUserFavorites] = useState<string[]>([]);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);

  // Cart handles
  const [cart, setCart] = useState<{ item: MenuItem; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  // Footer subscriptions details
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // Trigger default recommendations on initial mounting
  useEffect(() => {
    handleFetchRecommendation(true);
  }, []);

  // Sync favorites and orders when currentUser shifts
  useEffect(() => {
    if (currentUser) {
      fetchUserFavorites();
      fetchUserOrders();
    } else {
      setUserFavorites([]);
      setOrderHistory([]);
    }
  }, [currentUser]);

  // Network fetch for active recommendations
  async function handleFetchRecommendation(isMount = false) {
    try {
      setIsProcessing(true);
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood: isMount ? "relaxed" : selectedMood,
          weather: isMount ? "cloudy" : selectedWeather,
          activity: isMount ? "reading" : selectedActivity,
          userId: currentUser?.id
        })
      });

      if (!res.ok) throw new Error("Recommendation service failed");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  }

  // Favorites tracking
  async function fetchUserFavorites() {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/users/${currentUser.id}/favorites`);
      if (res.ok) {
        const data = await res.json();
        setUserFavorites(data.favorites.map((f: any) => f.itemId));
      }
    } catch (err) {
      console.error("Failed to load user favorites", err);
    }
  }

  async function handleToggleFavorite(itemId: string) {
    if (!currentUser) {
      // Prompt user to login first
      setActiveTab("crm");
      alert("Please quick sign-up or log-in on our Cafe CRM tab to save your favorite drinks!");
      return;
    }
    try {
      const res = await fetch(`/api/users/${currentUser.id}/favorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.isFavorite) {
          setUserFavorites(prev => [...prev, itemId]);
        } else {
          setUserFavorites(prev => prev.filter(id => id !== itemId));
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Orders tracking
  async function fetchUserOrders() {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/users/${currentUser.id}/orders`);
      if (res.ok) {
        const data = await res.json();
        setOrderHistory(data.orders);
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Checkout operations
  function handleAddToCart(item: MenuItem) {
    // Add point and display feedback
    setCart(prev => {
      const existIdx = prev.findIndex(c => c.item.id === item.id);
      if (existIdx !== -1) {
        const copy = [...prev];
        copy[existIdx].quantity += 1;
        return copy;
      }
      return [...prev, { item, quantity: 1 }];
    });
    setIsCartOpen(true);
  }

  function handleUpdateCartQuantity(itemId: string, delta: number) {
    setCart(prev => {
      return prev.map(line => {
        if (line.item.id === itemId) {
          const newQty = line.quantity + delta;
          return { ...line, quantity: newQty > 0 ? newQty : 0 };
        }
        return line;
      }).filter(line => line.quantity > 0);
    });
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUser) {
      // Must have user registered to check loyalty rewards
      setActiveTab("crm");
      setIsCartOpen(false);
      alert("Please quickly login or enroll in the Loyalty CRM program to complete your order and earn reward points!");
      return;
    }

    try {
      const payloadItems = cart.map(line => ({
        itemId: line.item.id,
        name: line.item.name,
        price: line.item.price,
        quantity: line.quantity
      }));

      const res = await fetch(`/api/users/${currentUser.id}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: payloadItems,
          couponCode: couponCode || undefined
        })
      });

      if (!res.ok) throw new Error("Order checkout transaction failed");
      const data = await res.json();
      
      // Update local user and historical list
      setCurrentUser(data.user);
      setCart([]);
      setCouponCode("");
      await fetchUserOrders();
      setOrderSuccess(`Success! Ordered logged. You earned ${data.order.pointsEarned} loyalty rewards!`);
      setTimeout(() => setOrderSuccess(null), 5500);
      setIsCartOpen(false);
    } catch (err: any) {
      alert(err.message || "Checkout failed");
    }
  }

  // Auth logins / registrations
  async function handleLoginEmail(email: string): Promise<boolean> {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Profile not found");
    }
    const data = await res.json();
    setCurrentUser(data.user);
    // Switch to sommelier after login to see recommendations personalized!
    setTimeout(() => setActiveTab("sommelier"), 500);
    return true;
  }

  async function handleRegisterUser(name: string, email: string, birthDate?: string): Promise<boolean> {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, birthDate })
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Email already registered");
    }
    const data = await res.json();
    setCurrentUser(data.user);
    setTimeout(() => setActiveTab("sommelier"), 500);
    return true;
  }

  async function handleUpdateCRMUser(updates: Partial<User>) {
    if (!currentUser) return;
    const res = await fetch(`/api/users/${currentUser.id}/settings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates)
    });
    if (res.ok) {
      const data = await res.json();
      setCurrentUser(data.user);
    }
  }

  function handleLogout() {
    setCurrentUser(null);
    setCart([]);
  }

  // Newsletter signup
  async function handleNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newsletterEmail) return;
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: newsletterEmail })
    });
    if (res.ok) {
      setNewsletterSuccess(true);
      setNewsletterEmail("");
      setTimeout(() => setNewsletterSuccess(false), 5000);
    }
  }

  // Compute cart summary price before checking out
  const cartSubtotal = cart.reduce((acc, line) => acc + (line.item.price * line.quantity), 0);
  let discountPct = 0;
  if (couponCode.toUpperCase() === "WELCOME50") {
    discountPct = 50;
  } else if (couponCode.toUpperCase().endsWith("OFF20") || couponCode.toUpperCase() === "STUDIO20") {
    discountPct = 20;
  } else if (couponCode.toUpperCase() === "BIRTHDAY40") {
    discountPct = 40;
  }
  const discountAmount = cartSubtotal * (discountPct / 100);
  const cartTotal = Math.max(cartSubtotal - discountAmount, 0);

  return (
    <div className="min-h-screen bg-[#140b08] text-[#faf3eb] font-sans relative overflow-x-hidden select-none">
      
      {/* Dynamic warm aura lights in the background */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-amber-950/20 rounded-full filter blur-[150px] pointer-events-none select-none"></div>
      <div className="absolute bottom-[-100px] right-0 w-[500px] h-[500px] bg-stone-900/40 rounded-full filter blur-[120px] pointer-events-none select-none"></div>

      {/* Primary Brand Top Floating Header */}
      <header className="sticky top-0 z-40 bg-[#140b08]/85 backdrop-blur-md border-b border-[#8b5a2b]/15 px-6 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Logo brand */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab("sommelier")}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-800 flex items-center justify-center border border-amber-400/25 shadow-md">
              <Coffee className="w-5.5 h-5.5 text-stone-950 fill-stone-950" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-base sm:text-lg block text-[#faf3eb] hover:text-amber-300 transition-colors">
                Café Carousal
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#bf8f54] leading-none block">
                Smart Coffee & CRM
              </span>
            </div>
          </div>

          {/* Navigation items bar */}
          <nav className="hidden sm:flex items-center gap-1.5 bg-stone-950/40 rounded-xl border border-[#8b5a2b]/15 p-1 text-sm">
            <button
              onClick={() => setActiveTab("sommelier")}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === "sommelier"
                  ? "bg-amber-500 text-stone-950 shadow font-semibold"
                  : "text-stone-300 hover:text-stone-100"
              }`}
            >
              Virtual Sommelier
            </button>
            <button
              onClick={() => setActiveTab("crm")}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === "crm"
                  ? "bg-amber-500 text-stone-950 shadow font-semibold"
                  : "text-stone-300 hover:text-stone-100"
              }`}
            >
              <Award className="w-4 h-4" />
              CRM Loyalty Ledger
            </button>
            <button
              onClick={() => setActiveTab("admin")}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === "admin"
                  ? "bg-amber-500 text-stone-950 shadow font-semibold"
                  : "text-stone-300 hover:text-stone-100"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Insights Dashboard
            </button>
          </nav>

          {/* User Account State & Cart indicator */}
          <div className="flex items-center gap-3">
            
            {/* Quick shopping cart controller */}
            <button
              id="open-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative h-10 w-10 rounded-full border border-[#8b5a2b]/25 bg-stone-900/60 flex items-center justify-center hover:bg-[#8b5a2b]/15 transition-all text-stone-200"
            >
              <ShoppingCart className="w-4.5 h-4.5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-stone-950 shadow animate-bounce">
                  {cart.reduce((sum, line) => sum + line.quantity, 0)}
                </span>
              )}
            </button>

            {/* Profile Avatar Trigger */}
            <div
              id="header-user-badge"
              onClick={() => setActiveTab("crm")}
              className="flex items-center gap-2 cursor-pointer rounded-full bg-stone-950/40 p-1 pr-2 sm:pr-3.5 border border-[#8b5a2b]/15 shadow-sm hover:border-[#8b5a2b]/40 transition-all select-none"
            >
              {currentUser ? (
                <>
                  <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-[#3b2314] to-[#c69a68] text-stone-100 font-bold text-xs flex items-center justify-center shadow-inner uppercase">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="text-left font-mono leading-tight">
                    <span className="text-[10px] text-stone-400 block max-w-16 truncate">{currentUser.name}</span>
                    <span className="text-[9px] text-[#bf8f54] block leading-none">{currentUser.loyaltyPoints} pts</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-7 w-7 rounded-full bg-stone-900 flex items-center justify-center text-stone-500 border border-stone-800">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs text-stone-300 font-medium">Club Join</span>
                </>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Floating alert banners */}
      {orderSuccess && (
        <div className="sticky top-20 z-40 max-w-7xl mx-auto px-6">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300 font-medium flex justify-between items-center shadow-md animate-pulse">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              {orderSuccess}
            </span>
            <button onClick={() => setOrderSuccess(null)} className="text-emerald-400 hover:text-emerald-300">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Body Grid Container */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Small Navigation for Mobile responsive users */}
        <div className="flex sm:hidden overflow-x-auto gap-2 mb-6 pb-2 select-none">
          <button
            onClick={() => setActiveTab("sommelier")}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
              activeTab === "sommelier" ? "bg-amber-500 text-stone-950" : "bg-stone-900 border border-[#8b5a2b]/15 text-stone-300"
            }`}
          >
            AI Sommelier
          </button>
          <button
            onClick={() => setActiveTab("crm")}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all flex items-center gap-1 ${
              activeTab === "crm" ? "bg-amber-500 text-stone-950" : "bg-stone-900 border border-[#8b5a2b]/15 text-stone-300"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            CRM Loyalty Hub
          </button>
          <button
            onClick={() => setActiveTab("admin")}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all flex items-center gap-1 ${
              activeTab === "admin" ? "bg-amber-500 text-stone-950" : "bg-stone-900 border border-[#8b5a2b]/15 text-stone-300"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Admin Telemetry
          </button>
        </div>

        {/* View switching render */}
        <AnimatePresence mode="wait">
          {activeTab === "sommelier" && (
            <motion.div
              key="sommelier"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-10"
            >
              
              {/* Slogan Banner */}
              <div className="text-center max-w-2xl mx-auto mt-2">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#bf8f54] bg-[#2c1810]/50 border border-[#8b5a2b]/25 px-3 py-1 rounded-full inline-block mb-3.5 select-none animate-pulse">
                  ✨ Micro-Artisan Flavor Customizer
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#faf3eb]">
                  Indulge in Personalized Craft
                </h1>
                <p className="text-xs sm:text-sm text-stone-400 mt-2.5 max-w-lg mx-auto font-light leading-relaxed">
                  Welcome to Cafe Carousal. Specify your emotional framework, active atmospheric condition, and task to generate smart suggestions aligned with your body and mind.
                </p>
              </div>

              {/* Wizard Selector block layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Inputs selections parameters selector */}
                <div className="lg:col-span-4 rounded-2xl border border-[#8b5a2b]/20 bg-[#25150f]/60 backdrop-blur-xl p-6 space-y-6">
                  <h2 className="text-sm font-bold text-[#faf3eb] uppercase tracking-wider font-mono border-b border-[#8b5a2b]/15 pb-2 flex items-center gap-1.5 select-none">
                    <Compass className="w-4 h-4 text-amber-400 animate-spin-slow" />
                    Barista Configuration
                  </h2>

                  {/* Attribute 1: Mood selects */}
                  <div className="space-y-2 select-none">
                    <div className="flex justify-between items-baseline">
                      <label className="text-xs font-mono uppercase text-stone-300">1. Current Mood</label>
                      <span className="text-[10px] text-amber-500 italic lowercase">affects flavor profile</span>
                    </div>
                    <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto pr-1">
                      {MOODS.map(m => (
                        <button
                          key={m.value}
                          onClick={() => setSelectedMood(m.value)}
                          className={`flex items-center justify-between px-3.5 py-1.5 rounded-xl border text-left text-xs transition-all ${
                            selectedMood === m.value
                              ? "bg-amber-500 text-stone-950 border-amber-400 font-semibold shadow-md translate-x-1"
                              : "bg-[#140b08]/45 border-[#8b5a2b]/15 hover:border-[#8b5a2b]/35 text-stone-300"
                          }`}
                        >
                          <span>{m.label}</span>
                          <span className={`text-[10px] ${selectedMood === m.value ? "text-stone-900" : "text-stone-500"}`}>{m.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Attribute 2: Weather Selects */}
                  <div className="space-y-2 select-none">
                    <div className="flex justify-between items-baseline">
                      <label className="text-xs font-mono uppercase text-stone-300">2. Current Weather</label>
                      <span className="text-[10px] text-amber-500 italic lowercase">sets drink temperature</span>
                    </div>
                    <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto pr-1">
                      {WEATHERS.map(w => (
                        <button
                          key={w.value}
                          onClick={() => setSelectedWeather(w.value)}
                          className={`flex items-center justify-between px-3.5 py-1.5 rounded-xl border text-left text-xs transition-all ${
                            selectedWeather === w.value
                              ? "bg-amber-500 text-stone-950 border-amber-400 font-semibold shadow-md translate-x-1"
                              : "bg-[#140b08]/45 border-[#8b5a2b]/15 hover:border-[#8b5a2b]/35 text-stone-300"
                          }`}
                        >
                          <span>{w.label}</span>
                          <span className={`text-[10px] ${selectedWeather === w.value ? "text-stone-900" : "text-stone-500"}`}>{w.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Attribute 3: Activity Selects */}
                  <div className="space-y-2 select-none">
                    <div className="flex justify-between items-baseline">
                      <label className="text-xs font-mono uppercase text-stone-300">3. Engaged Task</label>
                      <span className="text-[10px] text-amber-500 italic lowercase">determines cafe pairing</span>
                    </div>
                    <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto pr-1">
                      {ACTIVITIES.map(a => (
                        <button
                          key={a.value}
                          onClick={() => setSelectedActivity(a.value)}
                          className={`flex items-center justify-between px-3.5 py-1.5 rounded-xl border text-left text-xs transition-all ${
                            selectedActivity === a.value
                              ? "bg-amber-500 text-stone-950 border-amber-400 font-semibold shadow-md translate-x-1"
                              : "bg-[#140b08]/45 border-[#8b5a2b]/15 hover:border-[#8b5a2b]/35 text-stone-300"
                          }`}
                        >
                          <span>{a.label}</span>
                          <span className={`text-[10px] ${selectedActivity === a.value ? "text-stone-900" : "text-stone-500"}`}>{a.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Trigger Recommendation Query action */}
                  <button
                    id="find-coffee-btn"
                    onClick={() => handleFetchRecommendation(false)}
                    disabled={isProcessing}
                    className="w-full relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-500 select-none py-3 text-sm font-bold tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98 transition-all"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin text-stone-950" />
                        <span className="text-stone-950 font-bold">Consulting Coffee Sommelier...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4.5 h-4.5 text-stone-950 fill-stone-950 animate-pulse" />
                        <span className="text-stone-950 font-bold">Generate AI Recommendation</span>
                      </>
                    )}
                  </button>

                  {currentUser?.preferences && (
                    <div className="rounded-xl border border-dashed border-[#8b5a2b]/20 p-3 select-none text-center">
                      <p className="text-[10px] text-[#bf8f54]">
                        🔒 Customizing with profile: {currentUser.preferences.coffeeStrength} strength & {currentUser.preferences.milkPreference} milk base
                      </p>
                    </div>
                  )}

                </div>

                {/* Outputs results rendering block */}
                <div className="lg:col-span-8 space-y-8">
                  
                  {isProcessing ? (
                    /* High-fidelity cozy interactive pre-loading screen */
                    <div className="rounded-2xl border border-[#8b5a2b]/15 bg-[#25150f]/40 p-12 text-center flex flex-col items-center justify-center select-none space-y-4">
                      
                      {/* Interactive pulsing cup steam */}
                      <div className="relative w-20 h-20 flex items-center justify-center rounded-full bg-stone-900 border border-amber-500/25 animate-pulse">
                        <Coffee className="w-10 h-10 text-amber-400 animate-bounce" />
                        <div className="absolute inset-0 rounded-full border border-amber-500/10 scale-125 animate-ping"></div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-amber-300 font-mono">STEEPING AI ESPRESSO FLAVORS...</h3>
                        <p className="text-xs text-stone-400 max-w-sm mx-auto leading-relaxed">
                          "Brewing your mood traits, climate metrics, and active task profile with luxurious single-origin beans at Cafe Carousal..."
                        </p>
                      </div>
                    </div>
                  ) : result ? (
                    <div className="space-y-8">
                      
                      {/* Cozy Barista Greeting Message */}
                      <div className="rounded-2xl border border-[#8b5a2b]/20 bg-gradient-to-r from-[#2c1810]/80 to-[#1d100b]/80 p-5 flex gap-4 items-start shadow-md group border-l-4 border-l-amber-500">
                        <div className="h-10 w-10 shrink-0 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                          <Smile className="w-5.5 h-5.5" />
                        </div>
                        <div>
                          <div className="flex gap-1.5 items-baseline">
                            <h4 className="font-bold text-stone-100 text-sm">Virtual Barista Sommelier Greeting</h4>
                            {result.isAI ? (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono tracking-wider font-semibold animate-pulse">AI Generated</span>
                            ) : (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 font-mono tracking-wider font-semibold">Match Scoring</span>
                            )}
                          </div>
                          <p className="text-stone-300 text-xs sm:text-xs leading-relaxed italic mt-1.5 p-1 rounded font-light">
                            "{result.aiSommelierNote}"
                          </p>
                        </div>
                      </div>

                      {/* Primary suggestion product card */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-baseline select-none">
                          <h3 className="font-mono text-xs uppercase text-[#bf8f54] tracking-widest font-bold">
                            🏆 Premium Match Masterpiece
                          </h3>
                        </div>
                        <RecommendationCard
                          item={result.primaryRecommendation}
                          isFavorite={userFavorites.includes(result.primaryRecommendation.id)}
                          onToggleFavorite={handleToggleFavorite}
                          onOrder={handleAddToCart}
                          badge="Absolute Peak Match"
                        />
                      </div>

                      {/* Secondary alternative recomendations */}
                      <div className="space-y-4">
                        <h3 className="font-mono text-xs uppercase text-[#bf8f54] tracking-widest font-bold select-none">
                          🌿 Other Complementary Explorations
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {result.otherRecommendations && result.otherRecommendations.map((item) => (
                            <RecommendationCard
                              key={item.id}
                              item={item}
                              isFavorite={userFavorites.includes(item.id)}
                              onToggleFavorite={handleToggleFavorite}
                              onOrder={handleAddToCart}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Chef's special pairing combos */}
                      <div className="space-y-4">
                        <h3 className="font-mono text-xs uppercase text-[#bf8f54] tracking-widest font-bold select-none">
                          💖 Specialty Chef Pairings (Drink & Bakery Harmony Combo)
                        </h3>
                        <div className="relative rounded-2xl border border-dashed border-amber-500/30 bg-gradient-to-tr from-[#1d100b]/50 to-amber-950/20 p-6 flex flex-col md:flex-row justify-between items-center gap-6 group">
                          
                          {/* Left contents */}
                          <div className="flex-1 space-y-2">
                            <span className="rounded bg-amber-500/10 border border-amber-400/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 tracking-wider inline-block">
                              10% COMBO TARIFF DISCOUNT ACTIVE
                            </span>
                            <h3 className="text-lg font-bold text-[#faf3eb]">{result.chefSpecial.name}</h3>
                            <p className="text-stone-300 text-xs font-light leading-relaxed">
                              {result.chefSpecial.engagingReason}
                            </p>
                            <span className="block font-mono text-sm font-semibold text-amber-400">
                              Combo Price: ${result.chefSpecial.price.toFixed(2)}
                            </span>
                          </div>

                          {/* Right Checkout Trigger */}
                          <div>
                            <button
                              id="chef-combo-order-btn"
                              onClick={() => handleAddToCart(result.chefSpecial)}
                              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-stone-950 font-semibold text-sm shadow hover:bg-amber-400 active:scale-98 cursor-pointer transition-all"
                            >
                              <Plus className="w-4.5 h-4.5" />
                              Order Combo Plate
                            </button>
                          </div>

                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="text-center py-12 text-stone-500">
                      <p>Generate selection parameters to steep recommendations</p>
                    </div>
                  )}

                </div>
              </div>

            </motion.div>
          )}

          {activeTab === "crm" && (
            <motion.div
              key="crm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="text-center max-w-lg mx-auto mb-4">
                  <h1 className="text-3xl font-extrabold text-[#faf3eb] tracking-tight">CRM loyalty Ledger</h1>
                  <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
                    Access your account settings, track past coffees ordered, customize your milk bases, and unlock exclusive birthday reward vouchers completely customized to your profile.
                  </p>
                </div>

                <CRMAccount
                  currentUser={currentUser}
                  onLogin={handleLoginEmail}
                  onRegister={handleRegisterUser}
                  onUpdateSettings={handleUpdateCRMUser}
                  onLogout={handleLogout}
                  orderHistory={orderHistory}
                />
              </div>
            </motion.div>
          )}

          {activeTab === "admin" && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-6">
                <div className="text-center max-w-xl mx-auto mb-2">
                  <h1 className="text-3xl font-extrabold text-[#faf3eb] tracking-tight">Admin Insights & Telemetry</h1>
                  <p className="text-xs text-stone-400 mt-1leading-relaxed">
                    Cafe Carousal CRM database monitoring ledger. Track converting recommendations, user segment trends, and popular drinks automatically mapped in real time.
                  </p>
                </div>

                <AdminPanel />
              </div>
            </motion.div>
          )}

          {activeTab === "about" && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-3xl mx-auto rounded-2xl border border-[#8b5a2b]/20 bg-[#25150f]/60 p-8 space-y-6"
            >
              <h2 className="text-2xl font-bold text-amber-300">About Smart Café recommendation System</h2>
              <div className="space-y-4 text-xs tracking-wide leading-relaxed text-stone-300 font-light">
                <p>
                  This intelligent web feature built for <strong>Café Carousal</strong> bridges the gap between digital ordering and premium sensory experiences. Every coffee generated integrates actual environmental and state indicators with a fully fleshed customer CRM record database.
                </p>
                <p>
                  Our recommendation algorithms utilize <strong>Google Gemini Flash</strong> model architectures to parse user preferences alongside local conditions. When the API key is not active, a highly matching fallback scoring indexing matrix triggers synchronously to preserve performance, keeping operational latency virtually imperceptible.
                </p>
                <p className="border-t border-[#8b5a2b]/15 pt-4 text-stone-400 italic">
                  Café Carousal Slogan: "Where artisan beans match your distinct emotional profile."
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Online Side Slide-out Cart Panel */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black z-50 pointer-events-auto"
            />
            {/* Sliding cabinet */}
            <motion.div
              initial={{ translateX: "100%" }}
              animate={{ translateX: 0 }}
              exit={{ translateX: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 max-w-md w-full bg-[#1b0d09] border-l border-[#8b5a2b]/20 px-6 py-6 z-50 flex flex-col justify-between shadow-2xl overflow-y-auto"
            >
              <div>
                <div className="flex justify-between items-center border-b border-[#8b5a2b]/15 pb-4 select-none">
                  <h3 className="text-base font-bold text-[#faf3eb] flex items-center gap-2">
                    <ShoppingCart className="w-4.5 h-4.5 text-amber-500" />
                    Checking Out Coffee Cart
                  </h3>
                  <button onClick={() => setIsCartOpen(false)} className="text-stone-400 hover:text-stone-100 p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Cart Lines list */}
                <div className="space-y-3.5 my-6 max-h-96 overflow-y-auto pr-1">
                  {cart.length > 0 ? (
                    cart.map((line, idx) => (
                      <div
                        key={line.item.id + "-" + idx}
                        className="rounded-xl border border-[#8b5a2b]/10 bg-stone-950/60 p-3 flex justify-between items-center text-xs"
                      >
                        <div className="flex-1 pr-3">
                          <span className="text-[10px] text-amber-500/80 uppercase tracking-widest block font-mono">
                            {line.item.category.replace("_", " ")}
                          </span>
                          <span className="font-bold text-[#faf3eb] block">{line.item.name}</span>
                          <span className="text-stone-400 font-mono">${line.item.price.toFixed(2)}</span>
                        </div>
                        
                        {/* Quantity change buttons */}
                        <div className="flex items-center gap-2 bg-stone-900 rounded-lg p-1 border border-stone-800">
                          <button
                            onClick={() => handleUpdateCartQuantity(line.item.id, -1)}
                            className="text-stone-400 hover:text-stone-200 p-1 text-sm cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-mono text-xs w-4 text-center font-bold text-[#faf3eb]">{line.quantity}</span>
                          <button
                            onClick={() => handleUpdateCartQuantity(line.item.id, 1)}
                            className="text-stone-400 hover:text-stone-200 p-1 text-sm cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-stone-500 select-none">
                      <Coffee className="w-10 h-10 mx-auto stroke-1 text-stone-600 mb-2 animate-pulse" />
                      <p className="text-xs">Your cart is empty. Steep dynamic recommended coffees to get started!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Checkout pricing sum and trigger elements */}
              {cart.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-[#8b5a2b]/15 select-none">
                  
                  {/* Coupon section input */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-baseline text-[10px] uppercase font-mono text-stone-400">
                      <span>Have a CRM Promo Coupon?</span>
                      {currentUser?.segment === "new" && <span className="text-amber-400 select-all italic">try WALCOME50</span>}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. WELCOME50 or BIRTHDAY40"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 rounded-xl bg-stone-900 border border-[#8b5a2b]/25 px-3 py-1.5 text-xs text-[#faf3eb] uppercase focus:outline-none focus:border-amber-500 font-mono"
                      />
                      {couponCode && (
                        <button
                          onClick={() => setCouponCode("")}
                          className="text-xs text-stone-500 underline"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Calculations */}
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between text-stone-300">
                      <span>Subtotal:</span>
                      <span>${cartSubtotal.toFixed(2)}</span>
                    </div>
                    {discountPct > 0 && (
                      <div className="flex justify-between text-rose-400 font-semibold text-xs">
                        <span>Promo Code ({discountPct}%):</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-[#faf3eb] font-bold text-sm border-t border-[#8b5a2b]/10 pt-2.5">
                      <span>Total Price:</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {currentUser ? (
                    <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-2.5 text-[10.5px] text-emerald-400 leading-normal font-medium">
                      ☕ Confirmed Loyalty Member: spend earns you <strong>{Math.floor(cartTotal)} points</strong>! points automatically stored on CRM ledger.
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-amber-500/20 bg-amber-500/5 p-2.5 text-[10.5px] text-amber-400 leading-normal italic">
                      💡 Guest mode: order will be processed, but to Bank loyalty points and use coupons, please register in our <strong>CRM Loyalty</strong> program first!
                    </div>
                  )}

                  {/* Checkout CTA */}
                  <button
                    id="cart-checkout-submit-btn"
                    onClick={handleCheckout}
                    className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 py-2.5 text-stone-950 font-semibold text-sm shadow hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingCart className="w-4.5 h-4.5 text-stone-950" />
                    Confirm Café Order
                  </button>

                  <p className="text-[10px] text-center text-stone-500">
                    By confirming, your order registers synchronously to the backend CRM analysis matrix.
                  </p>

                </div>
              )}

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Global Bottom Curious Footer */}
      <footer className="mt-16 border-t border-[#8b5a2b]/15 bg-[#1b0d09]/60 py-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 font-light select-none text-xs leading-relaxed text-stone-400">
          
          {/* Logo brand grid */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-[#8b5a2b]/30 flex items-center justify-center border border-[#8b5a2b]/20">
                <Coffee className="w-4.5 h-4.5 text-amber-200 fill-amber-200" />
              </div>
              <span className="font-bold tracking-tight text-sm text-[#faf3eb]">Café Carousal</span>
            </div>
            <p className="max-w-sm leading-relaxed text-stone-500">
              An artificial intelligence café pairing engine tailored to emotional profiles and atmospheric conditions at the premium French boutique Café Carousal.
            </p>
            <p className="text-[10px] text-[#8b5a2b] font-mono uppercase tracking-widest font-semibold">
              © 2026 Cafe Carousal SA. All rights reserved.
            </p>
          </div>

          {/* Nav Links grid */}
          <div className="md:col-span-3 space-y-3.5">
            <h4 className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#bf8f54]">
              System Modules
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveTab("sommelier")} className="hover:text-amber-400 transition-colors cursor-pointer text-left">
                  Barista Sommelier
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("crm")} className="hover:text-amber-400 transition-colors cursor-pointer text-left">
                  Enroll Loyalty Ledger
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("admin")} className="hover:text-amber-400 transition-colors cursor-pointer text-left">
                  Analytics & Telemetry
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab("about")} className="hover:text-amber-400 transition-colors cursor-pointer text-left">
                  Algorithm Description
                </button>
              </li>
            </ul>
          </div>

          {/* Offers Newsletter Grid */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#bf8f54]">
              Club Letters (Subscribe for 40% Discounts)
            </h4>
            <p className="text-stone-500 leading-normal">
              Register your email with Café Carousal CRM database to claim weekly promo coupons and birthday automated treats.
            </p>

            {newsletterSuccess ? (
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-2.5 text-[11px] text-emerald-400 font-medium flex items-center gap-1.5">
                <ThumbsUp className="w-3.5 h-3.5" />
                Successfully joined our secret recipes ledger!
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="barista@love.com"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 rounded-xl bg-stone-900 border border-[#8b5a2b]/25 px-3 py-1.5 text-xs text-[#faf3eb] focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-amber-500/15 border border-amber-500/35 hover:bg-amber-500 text-amber-300 hover:text-stone-950 px-3.5 py-1.5 text-xs font-bold font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer"
                >
                  Join
                </button>
              </form>
            )}
          </div>

        </div>
      </footer>

    </div>
  );
}
