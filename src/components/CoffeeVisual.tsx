import React from "react";
import { Coffee, CupSoda, Flame, ShieldAlert, Sparkles, User, Utensils } from "lucide-react";

interface CoffeeVisualProps {
  type: string;
  hasSteam: boolean;
}

export function CoffeeVisual({ type, hasSteam }: CoffeeVisualProps) {
  // Return gorgeous customized layered shapes as vector café assets
  switch (type) {
    case "espresso":
      return (
        <div className="relative w-28 h-28 flex items-center justify-center bg-gradient-to-tr from-[#3e251c] to-[#603a2c] rounded-full border border-[#8b5a2b]/30 shadow-inner">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-10 bg-[#e2cfbe]/10 rounded-full blur-md"></div>
          {/* Porcelain cup */}
          <div className="relative w-14 h-10 bg-stone-100 rounded-b-xl border border-stone-300 flex items-center justify-center">
            {/* Latte art inside / Espresso crema */}
            <div className="absolute top-0.5 left-0.5 right-0.5 h-3 bg-[#422114] rounded-t-sm rounded-b-md overflow-hidden flex items-center justify-center">
              <div className="w-10 h-2.5 bg-gradient-to-r from-[#8b5a2b] via-[#bf8f54] to-[#422114] rounded-full opacity-90"></div>
            </div>
            {/* Cup Handle */}
            <div className="absolute right-[-8px] top-2 w-4 h-5 border-[2.5px] border-stone-300 rounded-r-full"></div>
          </div>
          {/* Cozy saucer */}
          <div className="absolute bottom-6 w-18 h-2 bg-stone-200 border border-stone-300 rounded-full"></div>
        </div>
      );

    case "cappuccino":
    case "rose_latte":
    case "caramel_macchiato":
      const cremaColor = type === "rose_latte" ? "from-[#e28f9d] via-[#f7cbd0] to-[#512c22]" : "from-[#bf8f54] via-[#e6cfb3] to-[#5e3829]";
      return (
        <div className="relative w-28 h-28 flex items-center justify-center bg-gradient-to-tr from-[#2d1a12] to-[#4e2f22] rounded-full border border-[#8b5a2b]/30 shadow-inner">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-10 bg-[#e2cfbe]/15 rounded-full blur-md"></div>
          {/* Glass warm mug */}
          <div className="relative w-16 h-14 bg-stone-100/10 backdrop-blur-md rounded-b-xl border border-stone-100/30 flex flex-col justify-end items-center overflow-hidden">
            {/* Layered Latte Liquid */}
            <div className="w-full h-8 bg-[#503124]"></div>
            <div className="absolute top-1.5 left-0 right-0 h-4 bg-gradient-to-b from-[#dfcaaf] to-[#503124]"></div>
            {/* Cream cloud on top */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-stone-50 to-amber-100/90 rounded-full"></div>
            {/* Cocoa dust or rose bloom inside */}
            {type === "rose_latte" && (
              <div className="absolute top-1 w-2 h-2 bg-pink-400 rounded-full blur-xs animate-pulse"></div>
            )}
            {type === "caramel_macchiato" && (
              <div className="absolute top-0 w-8 h-1 bg-amber-500 rounded-full"></div>
            )}
          </div>
          {/* Fancy gold handle */}
          <div className="absolute right-[43px] top-11 w-4 h-6 border-2 border-amber-300/40 rounded-r-full"></div>
          {/* Coaster */}
          <div className="absolute bottom-4 w-22 h-2.5 bg-gradient-to-r from-neutral-800 to-stone-900 rounded-full opacity-60"></div>
        </div>
      );

    case "cold_brew":
    case "nitro":
      return (
        <div className="relative w-28 h-28 flex items-center justify-center bg-gradient-to-tr from-[#1d1b1a] to-[#3a3532] rounded-full border border-stone-800 shadow-inner">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-[#38bdf8]/5 rounded-full blur-md"></div>
          {/* Tall highball glass */}
          <div className="relative w-12 h-18 bg-white/10 rounded-t-sm rounded-b-lg border border-white/20 flex flex-col justify-end overflow-hidden shadow-md">
            {/* Black Coffee Liquid */}
            <div className={`w-full ${type === "nitro" ? "h-14 bg-gradient-to-b from-[#5c4033] to-[#120f0e]" : "h-15 bg-[#1a0e08]"}`}></div>
            {/* Ice cubes floating */}
            <div className="absolute top-5 left-2 w-3 h-3 bg-white/40 rounded-sm rotate-12"></div>
            <div className="absolute top-8 right-2.5 w-2.5 h-2.5 bg-white/30 rounded-sm -rotate-45"></div>
            {/* Nitrogen foam cascaded */}
            {type === "nitro" ? (
              <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-stone-200 to-[#5c4033] rounded-t-sm opacity-90"></div>
            ) : (
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-200/20 to-transparent"></div>
            )}
            {/* Colorful Lavender Straw */}
            {type === "cold_brew" && (
              <div className="absolute -top-3 left-4 w-1 h-12 bg-purple-400/80 rounded-full origin-bottom rotate-12"></div>
            )}
          </div>
          {/* Condensation rings */}
          <div className="absolute bottom-3 w-16 h-2 bg-sky-400/20 rounded-full blur-xs"></div>
        </div>
      );

    case "chai":
      return (
        <div className="relative w-28 h-28 flex items-center justify-center bg-gradient-to-tr from-[#422e1b] to-[#614930] rounded-full border border-amber-800/20 shadow-inner">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-10 bg-amber-500/10 rounded-full blur-lg"></div>
          {/* Artisan Clay Pot Cup */}
          <div className="relative w-14 h-11 bg-amber-600/80 rounded-b-2xl rounded-t-sm border border-amber-700 shadow-inner flex flex-col justify-end overflow-hidden">
            {/* Golden Tea Liquid */}
            <div className="w-full h-8 bg-gradient-to-b from-[#e6c280] to-[#b17d3b]"></div>
            {/* Spices floats */}
            <div className="absolute top-3 left-3 w-1.5 h-1.5 bg-yellow-900 rounded-full"></div>
            <div className="absolute top-4 right-4 w-1.5 h-1 bg-amber-950 rounded-full rotate-45"></div>
          </div>
          {/* Spice handle */}
          <div className="absolute right-[43px] top-11 w-4 h-5 border-2 border-amber-600 rounded-r-md"></div>
          {/* Wooden saucer */}
          <div className="absolute bottom-5 w-20 h-2 bg-amber-950/75 rounded-full"></div>
        </div>
      );

    case "croissant":
      return (
        <div className="relative w-28 h-28 flex items-center justify-center bg-gradient-to-tr from-[#3a2717] to-[#5c3e24] rounded-full border border-[#8b5a2b]/20 shadow-inner">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-10 bg-amber-500/10 rounded-full blur-md"></div>
          {/* Croissant crescent */}
          <div className="relative flex flex-col items-center justify-center animate-wiggle">
            <div className="w-16 h-8 bg-amber-500 rounded-full border border-amber-600 flex items-center justify-center shadow-lg transform relative">
              {/* Crescent ribs */}
              <div className="absolute inset-y-0 left-3 w-1.5 bg-amber-700/30 rounded-full"></div>
              <div className="absolute inset-y-0 left-7 w-2 bg-amber-700/40 rounded-full"></div>
              <div className="absolute inset-y-0 right-3 w-1.5 bg-amber-700/30 rounded-full"></div>
            </div>
            {/* Almond flakes */}
            <div className="absolute top-0 left-4 w-2 h-1 bg-amber-100 rounded-full rotate-12"></div>
            <div className="absolute top-1 right-5 w-2.5 h-1 bg-amber-100 rounded-full -rotate-45"></div>
          </div>
          {/* Plate */}
          <div className="absolute bottom-6 w-20 h-1.5 bg-white/20 rounded-full"></div>
        </div>
      );

    case "muffin":
      return (
        <div className="relative w-28 h-28 flex items-center justify-center bg-gradient-to-tr from-[#221008] to-[#401f11] rounded-full border border-stone-800 shadow-inner">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-10 bg-red-500/5 rounded-full blur-md"></div>
          {/* Muffin Wrapper */}
          <div className="relative w-12 h-14 flex flex-col justify-between items-center bg-transparent">
            {/* Top muffin dome overflow */}
            <div className="w-14 h-8 bg-[#4a2618] rounded-full border border-[#2b140b] shadow-md relative overflow-hidden flex items-center justify-center">
              {/* Chocolate chips */}
              <div className="absolute top-2 left-3 w-1.5 h-1.5 bg-stone-900 rounded-full"></div>
              <div className="absolute top-1 right-4 w-2 h-2 bg-stone-900 rounded-full"></div>
              <div className="absolute top-4 left-6 w-1 h-1 bg-stone-900 rounded-full"></div>
              <div className="absolute top-5 right-2 w-1.5 h-1.5 bg-stone-900 rounded-full"></div>
            </div>
            {/* Pleated bottom cup */}
            <div className="w-10 h-8 bg-amber-900/40 border-l border-r border-[#633a25] rounded-b-md flex justify-around">
              <div className="w-px h-full bg-[#633a25]"></div>
              <div className="w-px h-full bg-[#633a25]"></div>
              <div className="w-px h-full bg-[#633a25]"></div>
              <div className="w-px h-full bg-[#633a25]"></div>
            </div>
          </div>
          {/* Plate */}
          <div className="absolute bottom-4 w-18 h-1 bg-neutral-800 rounded-full"></div>
        </div>
      );

    default:
      return (
        <div className="relative w-28 h-28 flex items-center justify-center bg-[#422e1b] rounded-full">
          <Coffee className="w-14 h-14 text-amber-200" />
        </div>
      );
  }
}
