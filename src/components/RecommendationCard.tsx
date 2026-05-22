import React from "react";
import { MenuItem } from "../types";
import { CoffeeVisual } from "./CoffeeVisual";
import { CoffeeSteam } from "./CoffeeSteam";
import { Heart, ShoppingBag, Flame, Sparkles } from "lucide-react";

interface RecommendationCardProps {
  key?: any;
  item: MenuItem & { engagingReason?: string };
  isFavorite: boolean;
  onToggleFavorite: any;
  onOrder: any;
  badge?: string;
}

export function RecommendationCard({
  item,
  isFavorite,
  onToggleFavorite,
  onOrder,
  badge
}: RecommendationCardProps) {
  return (
    <div
      id={`coffee-card-${item.id}`}
      className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#8b5a2b]/25 bg-[#25150f]/80 backdrop-blur-xl transition-all duration-300 hover:border-amber-500/50 hover:shadow-[0_10px_30px_rgba(217,119,6,0.15)] group p-6"
    >
      {/* Badge label e.g., Primary recommendation, Sommelier's combo */}
      {badge && (
        <span className="absolute top-4 left-4 z-10 flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500/95 to-amber-600/95 px-3 py-1 text-xs font-semibold tracking-wide text-stone-900 shadow-md">
          <Sparkles className="w-3 h-3 text-stone-950 fill-stone-950 animate-pulse" />
          {badge}
        </span>
      )}

      {/* Steam animated effect if element is hot */}
      {item.steamEffect && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 h-0">
          <CoffeeSteam />
        </div>
      )}

      {/* Love/Favorite action button */}
      <button
        id={`fav-btn-${item.id}`}
        onClick={() => onToggleFavorite(item.id)}
        className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-stone-900/60 border border-stone-800 backdrop-blur-md transition-all duration-200 hover:bg-red-500/20 hover:border-red-500 group"
        aria-label="Add to favorites"
      >
        <Heart
          className={`h-5.5 w-5.5 transition-transform duration-200 active:scale-95 ${
            isFavorite
              ? "fill-red-500 text-red-500 scale-110"
              : "text-stone-400 group-hover:text-red-400"
          }`}
        />
      </button>

      {/* Center visual cup */}
      <div className="flex justify-center pt-6 pb-4">
        <div className="transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-1">
          <CoffeeVisual type={item.imageType} hasSteam={item.steamEffect} />
        </div>
      </div>

      {/* Copy / Details Section */}
      <div className="flex-1 flex flex-col pt-2">
        {/* Category & Tags section */}
        <div className="flex flex-wrap items-center gap-2 mb-2 select-none">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#bf8f54]">
            {item.category.replace("_", " ")}
          </span>
          {item.moodTags && item.moodTags.slice(0, 1).map(tag => (
            <span
              key={tag}
              className="text-[10px] uppercase font-mono bg-stone-900 border border-[#8b5a2b]/20 px-2 py-0.5 rounded text-amber-300/85"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Title & Price */}
        <div className="flex justify-between items-baseline gap-2 mb-1">
          <h3 className="text-lg font-bold text-[#faf3eb] group-hover:text-amber-300 transition-colors duration-200 leading-tight">
            {item.name}
          </h3>
          <span className="font-mono text-base font-semibold text-amber-400">
            ${item.price.toFixed(2)}
          </span>
        </div>

        {/* Standard catalog details */}
        <p className="text-stone-300 text-xs leading-relaxed mb-3 flex-1 font-light">
          {item.description}
        </p>

        {/* Personalized custom matched reason from AI */}
        {item.engagingReason && (
          <div className="mb-4 rounded-xl bg-amber-500/5 border border-amber-500/10 p-3">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-amber-400 uppercase tracking-wider mb-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              Sommelier Match Note
            </div>
            <p className="text-[#ecd6c0] text-[11px] leading-relaxed italic">
              "{item.engagingReason}"
            </p>
          </div>
        )}
      </div>

      {/* Footer trigger buttons bar */}
      <div className="mt-4 flex gap-2">
        <button
          id={`order-btn-${item.id}`}
          onClick={() => onOrder(item)}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-stone-950 font-semibold text-sm shadow-md transition-all duration-200 hover:from-amber-400 hover:to-amber-500 hover:shadow-lg hover:shadow-amber-500/10 active:scale-98 cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4 text-stone-950" />
          Order Now
        </button>
      </div>
    </div>
  );
}
