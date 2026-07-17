import type { FoodItem } from "@/types";
import { useMemo } from "react";
import {
  calculateTDEE,
  calculatePortionOrCookedNutrition,
} from "@/utils/calculations.ts";
import { useStore } from "@/store/useStore.ts";
import { motion } from "framer-motion";
import { Flame, Beef, Wheat, Droplets, Info, Lightbulb } from "lucide-react";

interface FoodAnalysisProps {
  food: FoodItem;
  weight: number;
  isCooked: boolean;
  hasConversion?: boolean;
}

export default function FoodAnalysis({
  food,
  weight,
  isCooked,
  hasConversion,
}: FoodAnalysisProps) {
  const profile = useStore((state) => state.profile);

  const nutrition = useMemo(() =>
    calculatePortionOrCookedNutrition(
      food,
      Number(weight)
      || 0, isCooked,
      !!hasConversion),
    [food, weight, isCooked, hasConversion]
  );

  // Target calculation
  const dailyTdee = useMemo(() => calculateTDEE(profile), [profile]);
  const dailyMacros = profile.macroTargets;

  // Percentage contribution of this portion to daily targets
  const portionPct = useMemo(() => {
    return {
      calories: Math.min(
        100,
        Math.round((nutrition.calories / dailyTdee) * 100),
      ),
      protein: Math.min(
        100,
        Math.round((nutrition.protein / dailyMacros.protein) * 100),
      ),
      carbs: Math.min(
        100,
        Math.round((nutrition.carbs / dailyMacros.carbs) * 100),
      ),
      fats: Math.min(
        100,
        Math.round((nutrition.fats / dailyMacros.fats) * 100),
      ),
    };
  }, [nutrition, dailyTdee, dailyMacros]);

  // Nutrient density & Smart badges
  const analysis = useMemo(() => {
    const cals = food.caloriesPer100g;
    const prot = food.proteinPer100g;
    const carb = food.carbsPer100g;
    const fat = food.fatsPer100g;

    const totalCalsFromMacros = prot * 4 + carb * 4 + fat * 9;
    const divisor =
      cals > 0 ? cals : totalCalsFromMacros > 0 ? totalCalsFromMacros : 1;

    // Percentages of calories from each macro
    const pPct = ((prot * 4) / divisor) * 100;
    const cPct = ((carb * 4) / divisor) * 100;
    const fPct = ((fat * 9) / divisor) * 100;

    const badges: { text: string; color: string; icon: string }[] = [];

    // 1. Low Calorie Badge

    if (prot === 0 && fat === 0 && carb > 5) {
      badges.push({
        text: "Empty calories",
        color: "bg-red-500/10 text-red-400 border border-red-500/20",
        icon: "🍬",
      });
    }

    if (cals < 60 && cals > 0) {
      badges.push({
        text: "Light product",
        color:
          "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
        icon: "🌿",
      });
    }

    // 2. High Protein Badges
    if (pPct >= 50 && prot > 0) {
      badges.push({
        text: "Pure protein",
        color: "bg-teal-500/10 text-teal-400 border border-teal-500/20",
        icon: "🌟",
      });
    } else if (pPct >= 30 && prot > 0) {
      badges.push({
        text: "Protein source",
        color:
          "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
        icon: "🥗",
      });
    } else if (pPct >= 15 && prot > 0) {
      badges.push({
        text: "Caloric protein",
        color: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
        icon: "🧀",
      });
    }

    // 3. Keto Badge (Low carb, high fat/protein)
    const isKeto = carb <= 5 && (fat >= 8 || fPct >= 60) && cals > 0;
    if (isKeto) {
      badges.push({
        text: "Keto-friendly",
        color: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
        icon: "🥑",
      });
    }

    // 4. High Carb / Energy Bomb
    if (cPct >= 60 && carb > 0) {
      badges.push({
        text: "Energy bomb",
        color: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
        icon: "⚡",
      });
    }

    // 5. Fat Source (if not already keto)
    if (fPct >= 60 && fat > 0 && !isKeto) {
      badges.push({
        text: "Fat source",
        color: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
        icon: "🥑",
      });
    }

    // Protein cost calculation: Calories needed to get 10g of protein
    let proteinCost: number | null = null;
    let proteinRatingText = "";

    if (prot >= 1) {
      proteinCost = Math.round((cals / prot) * 10);
      if (proteinCost < 80) {
        proteinRatingText =
          "Great protein source with minimal calories!";
      } else if (proteinCost < 150) {
        proteinRatingText = "Good protein source with moderate calories.";
      } else if (proteinCost < 300) {
        proteinRatingText =
          "Contains protein but comes with significant accompanying calories (fats/carbs).";
      } else {
        proteinRatingText =
          "Low protein density. Not suitable as a primary protein source.";
      }
    }

    return { badges, proteinCost, proteinRatingText };
  }, [food]);
  return (
    <div className="space-y-4">
      {/* Smart Badges */}
      {analysis.badges.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {analysis.badges.map((badge, idx) => (
            <span
              key={idx}
              className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${badge.color}`}
            >
              <span>{badge.icon}</span>
              <span>{badge.text}</span>
            </span>
          ))}
        </div>
      )}

      {/* Daily Target Impact (NFS style bars) */}
      <motion.div
        className="mt-6 bg-card rounded-xl p-5 border border-border"
        key={`${weight}-${isCooked}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <h4 className="text-sm font-bold text-foreground mb-4">
          Portion impact on daily target
        </h4>

        <div className="space-y-4">
          {/* Calories Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Flame className="w-3.5 h-3.5 text-purple-400" /> Calories
              </span>
              <span className="font-bold text-foreground">
                {Math.round(nutrition.calories)} kcal ({portionPct.calories}%)
              </span>
            </div>
            <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden relative">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${portionPct.calories}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Protein Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Beef className="w-3.5 h-3.5 text-emerald-400" /> Protein
              </span>
              <span className="font-bold text-foreground">
                {Math.round(nutrition.protein)}g ({portionPct.protein}%)
              </span>
            </div>
            <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden relative">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                initial={{ width: 0 }}
                animate={{ width: `${portionPct.protein}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Carbs Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Wheat className="w-3.5 h-3.5 text-blue-400" /> Carbs
              </span>
              <span className="font-bold text-foreground">
                {Math.round(nutrition.carbs)}g ({portionPct.carbs}%)
              </span>
            </div>
            <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden relative">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                initial={{ width: 0 }}
                animate={{ width: `${portionPct.carbs}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Fats Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Droplets className="w-3.5 h-3.5 text-amber-400" /> Fats
              </span>
              <span className="font-bold text-foreground">
                {Math.round(nutrition.fats)}g ({portionPct.fats}%)
              </span>
            </div>
            <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden relative">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400"
                initial={{ width: 0 }}
                animate={{ width: `${portionPct.fats}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Protein-to-Calorie Cost Analysis */}
      {analysis.proteinCost !== null && (
        <div className="mt-4 flex items-start gap-3 bg-primary/10 rounded-xl p-4 border border-primary/20">
          <Lightbulb className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-foreground">
              Caloric cost of protein
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              To get{" "}
              <span className="font-semibold text-foreground">10g of protein</span>{" "}
              from this product, you consume{" "}
              <span className="font-bold text-primary">
                {analysis.proteinCost} kcal
              </span>
              .
            </p>
            <p className="text-[11px] text-primary/80 font-medium">
              {analysis.proteinRatingText}
            </p>
          </div>
        </div>
      )}
      {/* Cooked Water Loss note */}
      {isCooked && hasConversion && (
        <div className="mt-4 flex items-start gap-2 bg-secondary/60 rounded-lg p-3 border border-border/30">
          <Info className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            The cooked meal is denser due to moisture loss. Values are recalculated using the reduction factor{" "}
            <span className="text-foreground font-semibold">
              {(food.rawWeight! / food.cookedWeight!).toFixed(1)}x
            </span>
            .
          </p>
        </div>
      )}
    </div>
  );
}
