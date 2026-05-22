import React, { useState } from "react";
import { User, Order, Coupon } from "../types";
import { UserPlus, LogIn, Award, Gift, Clock, Sparkles, Sliders, Check, Mail, Coffee, Calendar } from "lucide-react";

interface CRMAccountProps {
  currentUser: User | null;
  onLogin: (email: string) => Promise<boolean>;
  onRegister: (name: string, email: string, birthDate?: string) => Promise<boolean>;
  onUpdateSettings: (updates: Partial<User>) => Promise<void>;
  onLogout: () => void;
  orderHistory: Order[];
}

export function CRMAccount({
  currentUser,
  onLogin,
  onRegister,
  onUpdateSettings,
  onLogout,
  orderHistory
}: CRMAccountProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);

  // Local settings fields
  const [prefStrength, setPrefStrength] = useState<'light' | 'medium' | 'strong'>("medium");
  const [prefMilk, setPrefMilk] = useState<'whole' | 'oat' | 'almond' | 'coconut' | 'none'>("whole");

  // Handle local states hydration
  React.useEffect(() => {
    if (currentUser?.preferences) {
      setPrefStrength(currentUser.preferences.coffeeStrength);
      setPrefMilk(currentUser.preferences.milkPreference);
    }
  }, [currentUser]);

  // Auth operations
  async function handleSubmitAuth(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (isRegistering) {
      if (!name || !email) {
        setErrorMsg("Name and email are required to register.");
        return;
      }
      try {
        const success = await onRegister(name, email, birthDate || undefined);
        if (success) {
          setSuccessMsg("Registration successful! Welcome bonus 50 points rewarded.");
          // Clear forms
          setName("");
          setEmail("");
          setBirthDate("");
        }
      } catch (err: any) {
        setErrorMsg(err.message || "Email address is already in use.");
      }
    } else {
      if (!email) {
        setErrorMsg("Please enter your email to log in.");
        return;
      }
      try {
        const found = await onLogin(email);
        if (found) {
          setSuccessMsg("Welcome back to Cafe Carousal!");
        }
      } catch (err: any) {
        setErrorMsg(err.message || "Could not find profile. Enroll now below!");
      }
    }
  }

  // Update profile variables
  async function handleSavePreferences() {
    if (!currentUser) return;
    try {
      setSavingSettings(true);
      setErrorMsg(null);
      await onUpdateSettings({
        preferences: {
          favoriteMoods: currentUser.preferences?.favoriteMoods || [],
          coffeeStrength: prefStrength,
          milkPreference: prefMilk
        }
      });
      setSuccessMsg("Preferences successfully saved and synchronized!");
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err: any) {
      setErrorMsg("Failed to synchronize preferences.");
    } finally {
      setSavingSettings(false);
    }
  }

  // Segment labels and custom discount codes decoration
  function getSegmentBadge(segment: string) {
    switch (segment) {
      case "coffee_lover":
        return { label: "Elite Coffee Lover", style: "bg-rose-500/10 text-rose-300 border-rose-500/30", bonus: "Collects 2x Loyalty Points" };
      case "student":
        return { label: "Academic Student", style: "bg-blue-500/10 text-blue-300 border-blue-500/30", bonus: "Flat 20% Off Code: STUDIO20" };
      case "regular":
        return { label: "Carousal Regular", style: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30", bonus: "Free Refills on Batch Brew" };
      default:
        return { label: "New Guest Journey", style: "bg-amber-500/10 text-amber-300 border-amber-500/30", bonus: "Sign Up 50% Off Code: WELCOME50" };
    }
  }

  // Check if birthday coupon is applicable (i.e., if birthday month is close or birthDate set)
  const isBirthdayBonus = currentUser?.birthDate;

  return (
    <div id="crm-profile-section" className="rounded-2xl border border-[#8b5a2b]/20 bg-[#25150f]/60 backdrop-blur-xl p-6">
      
      {/* Messages banner */}
      {successMsg && (
        <div className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-400 font-medium">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          {errorMsg}
        </div>
      )}

      {!currentUser ? (
        /* Login / Signup Selector Screen */
        <div className="max-w-md mx-auto py-4">
          <div className="text-center mb-6">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-2">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-[#faf3eb]">Cafe Carousal Loyalty & CRM</h2>
            <p className="text-xs text-stone-400 mt-1">Unlock personalized AI recommendations and reward coupons on every coffee purchase.</p>
          </div>

          <form onSubmit={handleSubmitAuth} className="space-y-4">
            {isRegistering && (
              <div>
                <label className="block text-xs text-stone-300 px-1 font-mono uppercase tracking-wider mb-1.5">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Jean Constant"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl bg-stone-900/60 border border-[#8b5a2b]/25 px-4 py-2 text-stone-100 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs text-stone-300 px-1 font-mono uppercase tracking-wider mb-1.5">Email Address</label>
              <input
                type="email"
                placeholder="jean@constant.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-stone-900/60 border border-[#8b5a2b]/25 px-4 py-2 text-stone-100 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            {isRegistering && (
              <div>
                <div className="flex justify-between">
                  <label className="text-xs text-stone-300 px-1 font-mono uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Birth Date
                  </label>
                  <span className="text-[10px] text-[#bf8f54] italic">Unlock 40% Birthday reward coupon!</span>
                </div>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full rounded-xl bg-stone-900/60 border border-[#8b5a2b]/25 px-4 py-2 text-stone-100 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            <button
              id="auth-submit-btn"
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-2.5 text-stone-950 font-semibold text-sm hover:from-amber-400 hover:to-amber-500 hover:shadow-lg transition-all duration-200 active:scale-98 cursor-pointer"
            >
              {isRegistering ? "Enroll & Get Birthday Rewards" : "Access CRM Portal"}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#8b5a2b]/15 text-center select-none">
            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className="text-xs text-amber-400/90 hover:text-amber-300 transition-colors inline-flex items-center gap-1"
            >
              {isRegistering ? (
                <>
                  <LogIn className="w-3.5 h-3.5" />
                  Have an account? Log in Here
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  New to Carousal? Join Loyalty Rewards
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Logged In Active Dashboard Screen */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 select-none">
          
          {/* User CRM info summary */}
          <div className="md:col-span-5 space-y-6">
            <div className="rounded-xl border border-[#8b5a2b]/15 bg-stone-950/40 p-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-[#3b2314] to-[#c69a68] border border-amber-300/20 flex items-center justify-center text-[#faf3eb] font-bold text-lg uppercase shadow">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-100">{currentUser.name}</h3>
                  <p className="text-xs text-stone-400 leading-none">{currentUser.email}</p>
                </div>
              </div>

              {/* Segment Tag and Rewards bonus badge */}
              <div className="mt-4 pt-3 border-t border-[#8b5a2b]/10">
                {(() => {
                  const badge = getSegmentBadge(currentUser.segment);
                  return (
                    <div className="space-y-1">
                      <div className="flex items-baseline justify-between">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${badge.style}`}>
                          {badge.label}
                        </span>
                        <span className="text-[10px] text-stone-400">Segment Status</span>
                      </div>
                      <p className="text-[11px] text-[#bf8f54] italic pt-1">{badge.bonus}</p>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Loyalty Points Bar */}
            <div className="rounded-xl border border-[#8b5a2b]/15 bg-stone-950/40 p-4 space-y-3.5">
              <div className="flex justify-between items-baseline font-mono">
                <span className="text-xs text-stone-300 uppercase tracking-wider flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  Loyalty Ledger
                </span>
                <span className="text-sm font-bold text-amber-400">{currentUser.loyaltyPoints} points</span>
              </div>
              
              {/* Progress bar towards next free drink (500 points) */}
              {(() => {
                const target = 500;
                const progressPct = Math.min((currentUser.loyaltyPoints / target) * 100, 100);
                const remaining = Math.max(target - currentUser.loyaltyPoints, 0);

                return (
                  <div className="space-y-1.5">
                    <div className="w-full h-2.5 bg-stone-900 rounded-full overflow-hidden border border-[#8b5a2b]/10">
                      <div
                        className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"
                        style={{ width: `${progressPct}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-stone-400">
                      <span>Bronze Starter</span>
                      <span>Next Free Drink Reward at {target} pts</span>
                    </div>
                    {remaining > 0 ? (
                      <p className="text-[10px] text-[#bf8f54] italic">Earn only {remaining} more points to claim a free pastry combination!</p>
                    ) : (
                      <div className="rounded bg-emerald-500/10 border border-emerald-500/20 p-1.5 flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold animate-pulse mt-2.5">
                        <Gift className="w-3.5 h-3.5 shrink-0" />
                        Qualified for FREE Coffee Reward! Ask barista.
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Claimable Active personalized Coupon discounts */}
            <div className="rounded-xl border border-[#8b5a2b]/15 bg-stone-950/40 p-4 space-y-3">
              <h4 className="text-xs font-bold text-[#faf3eb] uppercase tracking-wider flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-purple-400" />
                Personalized Coupons & Offerings
              </h4>

              <div className="space-y-2.5">
                {/* Coupon 1 */}
                {currentUser.segment === "new" && (
                  <div className="rounded-lg border border-dashed border-amber-500/30 bg-amber-500/5 p-2.5 flex justify-between items-center group">
                    <div>
                      <span className="font-mono text-xs font-bold text-amber-400 select-all">WELCOME50</span>
                      <p className="text-[10px] text-stone-400">Flat 50% discount on your first order.</p>
                    </div>
                    <span className="text-[9px] bg-amber-500/10 px-1.5 py-0.5 rounded text-amber-300">Active</span>
                  </div>
                )}
                
                {/* Coupon 2 */}
                {isBirthdayBonus && (
                  <div className="rounded-lg border border-dashed border-rose-500/30 bg-rose-500/5 p-2.5 flex justify-between items-center group">
                    <div>
                      <span className="font-mono text-xs font-bold text-rose-400 select-all">BIRTHDAY40</span>
                      <p className="text-[10px] text-stone-400">40% birthday treat (Valid Month of Birth).</p>
                    </div>
                    <span className="text-[9px] bg-rose-500/10 px-1.5 py-0.5 rounded text-rose-300 flex items-center gap-0.5 animate-pulse">
                      <Gift className="w-2.5 h-2.5" />
                      Gift
                    </span>
                  </div>
                )}

                {/* Coupon 3 */}
                <div className="rounded-lg border border-dashed border-purple-500/30 bg-purple-500/5 p-2.5 flex justify-between items-center group">
                  <div>
                    <span className="font-mono text-xs font-bold text-purple-400 select-all">CAROUSALOFF20</span>
                    <p className="text-[10px] text-stone-400">Regulars standard 20% discount coupon.</p>
                  </div>
                  <span className="text-[9px] bg-purple-500/10 px-1.5 py-0.5 rounded text-purple-300">Default</span>
                </div>
              </div>
            </div>

            <button
              id="logout-btn"
              onClick={onLogout}
              className="w-full rounded-xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-300 py-1.5 text-xs font-medium cursor-pointer"
            >
              Log Out account
            </button>
          </div>

          {/* CRM Preferences / dairy customization & history */}
          <div className="md:col-span-7 space-y-6">
            
            {/* Preferences sliders customization */}
            <div className="rounded-xl border border-[#8b5a2b]/15 bg-stone-950/40 p-5 space-y-4">
              <h4 className="text-xs font-bold text-[#faf3eb] uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-amber-400" />
                Customize Coffee Preferences (Saved to CRM Profile)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strength Preference */}
                <div className="space-y-1.5 select-none">
                  <label className="text-[11px] font-mono text-stone-400 uppercase">Espresso Strength preference</label>
                  <div className="grid grid-cols-3 gap-1.5 bg-stone-900/60 p-1 rounded-xl border border-[#8b5a2b]/15">
                    {(['light', 'medium', 'strong'] as const).map(str => (
                      <button
                        key={str}
                        onClick={() => setPrefStrength(str)}
                        className={`text-xs py-1 rounded-lg font-medium transition-all ${
                          prefStrength === str
                            ? "bg-amber-500 text-stone-950 shadow-md font-bold"
                            : "text-stone-400 hover:text-stone-200"
                        }`}
                      >
                        {str}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Milk preference and optional soy oat */}
                <div className="space-y-1.5 select-none">
                  <label className="text-[11px] font-mono text-stone-400 uppercase">Milk / Non-Dairy base</label>
                  <div className="grid grid-cols-5 gap-1 bg-stone-900/60 p-1 rounded-xl border border-[#8b5a2b]/15">
                    {(['whole', 'oat', 'almond', 'coconut', 'none'] as const).map(mlk => (
                      <button
                        key={mlk}
                        onClick={() => setPrefMilk(mlk)}
                        className={`text-[10px] py-1 rounded-lg font-medium transition-all capitalize ${
                          prefMilk === mlk
                            ? "bg-amber-500 text-stone-950 shadow-sm font-bold"
                            : "text-stone-400 hover:text-stone-200"
                        }`}
                      >
                        {mlk}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  id="save-pref-btn"
                  onClick={handleSavePreferences}
                  disabled={savingSettings}
                  className="rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500 text-amber-300 hover:text-stone-900 px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-200 uppercase flex items-center gap-1 cursor-pointer"
                >
                  {savingSettings ? (
                    "Saving..."
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Sync CRM Preferences
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Past orders list tracking */}
            <div className="rounded-xl border border-[#8b5a2b]/15 bg-stone-950/40 p-5">
              <h4 className="text-xs font-bold text-[#faf3eb] uppercase tracking-wider flex items-center gap-1.5 mb-3.5">
                <Clock className="w-4 h-4 text-purple-400 animate-pulse" />
                Loyalty Transaction Logs ({orderHistory.length} orders)
              </h4>

              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {orderHistory.length > 0 ? (
                  orderHistory.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-lg border border-[#8b5a2b]/10 bg-stone-950/60 p-3 flex justify-between items-center text-xs"
                    >
                      <div>
                        <div className="flex gap-2 items-center">
                          <span className="font-mono text-stone-300 font-semibold">{order.id.replace("ord_", "#")}</span>
                          <span className="text-[10px] text-stone-500">
                            {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <ul className="mt-1 space-y-0.5 text-stone-400">
                          {order.items.map((line, lIdx) => (
                            <li key={lIdx}>
                              {line.quantity}x {line.item.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-[#faf3eb] font-semibold block">${order.totalPrice.toFixed(2)}</span>
                        <span className="text-[10px] text-emerald-400 font-medium">+{order.pointsEarned} pts rewarded</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-stone-500 select-none">
                    <Coffee className="w-8 h-8 mx-auto stroke-1 mb-2 text-stone-600" />
                    <p className="text-xs font-light">No order sessions registered yet.</p>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
