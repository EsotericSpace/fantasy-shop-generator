// components/ShopkeeperMoodDisplay.tsx
import React from "react";
import Tooltip from './tooltip';
import { getShopkeeperPronouns } from "../utils/shopGeneration";
import { HaggleResult } from "./shoppingCart";
import {
  getShopkeeperDescriptions,
  getPostHaggleDescription,
  getProcessedPostHaggleFailureDescription,
} from "../data/shopkeeperSellingDetails";

interface shopkeeperMoodDisplayProps {
  shopkeeper: any;
  settlementSize: string;
  
  // Selling-specific props (optional)
  shopkeeperMood?: string;
  playerCharisma?: number;
  getHagglingStyle?: (settlementSize: string, priceModifier: number) => { name: string; dcModifier: number };
  
  // Reaction state props (optional)
  isCartChangeReaction?: boolean;
  cartChangeDescription?: string;
  cartChangeQuote?: string;
  isHaggleReaction?: boolean;
  lastHaggleResult: HaggleResult | null;
  currentHaggleQuote?: string;
  
  // Display mode
  mode?: 'selling' | 'buying'; // 'selling' shows all haggling info, 'buying' shows basic mood
}

// Mood scale from worst to best
const moodScale = ["dismissive", "doubtful", "reserved", "open", "welcoming"];

// Apply persistent charisma modifier to any mood
const applyCharismaMoodModifier = (baseMood: string, charisma: number): string => {
  const currentIndex = moodScale.indexOf(baseMood);
  if (currentIndex === -1) return baseMood;

  let modifier = 0;
  if (charisma >= 3) {
    modifier = Math.floor((charisma - 2) / 2);
  } else if (charisma <= -3) {
    modifier = Math.ceil((charisma + 2) / 2);
  }

  const newIndex = Math.max(0, Math.min(moodScale.length - 1, currentIndex + modifier));
  return moodScale[newIndex];
};

const getDisplayMood = (baseMood: string, charisma: number): string => {
  const currentIndex = moodScale.indexOf(baseMood);
  if (currentIndex === -1) return baseMood;

  let modifier = 0;
  if (charisma >= 3) modifier = Math.floor((charisma - 1) / 2);
  else if (charisma <= -3) modifier = Math.ceil((charisma + 1) / 2);

  const newIndex = Math.max(0, Math.min(moodScale.length - 1, currentIndex + modifier));
  return moodScale[newIndex];
};

export const setMoodWithCharisma = (
  baseMood: string,
  charisma: number,
  setShopkeeperMood: (mood: string) => void
) => {
  const adjustedMood = applyCharismaMoodModifier(baseMood, charisma);
  setShopkeeperMood(adjustedMood);
};

const ShopkeeperMoodDisplay: React.FC<shopkeeperMoodDisplayProps> = ({
  shopkeeper,
  settlementSize,
  shopkeeperMood = "reserved",
  playerCharisma = 0,
  getHagglingStyle,
  isCartChangeReaction = false,
  cartChangeDescription = "",
  cartChangeQuote = "",
  isHaggleReaction = false,
  lastHaggleResult = null,
  currentHaggleQuote = "",
  mode = 'buying'
}) => {
  if (!shopkeeper) return null;

  console.log('ShopkeeperMoodDisplay props:', {
    mode,
    shopkeeperMood,
    playerCharisma,
    displayMood: getDisplayMood(shopkeeperMood, playerCharisma)
  });

  const pronouns = getShopkeeperPronouns(shopkeeper.name);
  const displayMood = getDisplayMood(shopkeeperMood, playerCharisma);
  
  console.log('ShopkeeperMoodDisplay rendering:', {
    mode,
    shopkeeperMood,
    displayMood,
    shouldShowMoodBadge: true, // Mood badge should always show
    shouldShowHagglingBadge: mode === 'selling'
  });

  const {
    moodDescription: processedMoodDesc,
    personalityDescription: processedPersonalityDesc,
  } = getShopkeeperDescriptions(displayMood, shopkeeper.priceModifier, pronouns);

  return (
    <div className="text-sm text-stone-600 dark:text-gray-300 border rounded-lg border-stone-300 p-4 mb-4">
      <div className="space-y-2">
        {/* Top line: Icon + Name + Badges */}
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
            person_raised_hand
          </span>

          {/* Haggling Style Badge - Only show in selling mode */}
          {getHagglingStyle && (
            <Tooltip content={`Haggle DC: ${10 + getHagglingStyle(settlementSize, shopkeeper.priceModifier).dcModifier} (Base 10 ${getHagglingStyle(settlementSize, shopkeeper.priceModifier).dcModifier >= 0 ? '+' : ''}${getHagglingStyle(settlementSize, shopkeeper.priceModifier).dcModifier})`}>
              <span className={`inline-flex items-center gap-1 px-2 text-[0.65rem] px-[0.4rem] py-[0.15rem] rounded-[3px] font-medium uppercase tracking-wide border border-blue-300 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300`}>
                <span className="material-symbols-outlined text-blue-500 dark:text-blue-400" style={{ fontSize: "16px" }}>
                  handshake
                </span>
                <span className="font-medium">
                  {getHagglingStyle(settlementSize, shopkeeper.priceModifier).name}
                </span>
              </span>
            </Tooltip>
          )}

          {/* Mood Badge */}
          <Tooltip content={`${(() => {
            switch(displayMood) {
              case "welcoming": return mode === 'selling' ? "Very positive to haggling. Improved success chances and better reactions." : "Very friendly and helpful. Great for browsing and asking questions.";
              case "open": return mode === 'selling' ? "Positive to haggling. Slightly better success chances." : "Friendly and approachable. Happy to help with purchases.";
              case "reserved": return mode === 'selling' ? "Neutral to haggling. Standard success chances." : "Professional but distant. Will conduct business efficiently.";
              case "doubtful": return mode === 'selling' ? "Skeptical of haggling. Reduced success chances and harsher reactions." : "Somewhat suspicious or cautious. May be less helpful.";
              case "dismissive": return mode === 'selling' ? "Hostile to haggling. Much lower success chances and severe penalties." : "Unfriendly and impatient. May rush transactions.";
              default: return mode === 'selling' ? "Affects haggling success and shopkeeper reactions." : "Affects how helpful the shopkeeper will be.";
            }
          })()}`}>
            <span className={`inline-flex items-center gap-1 px-2 text-[0.65rem] px-[0.4rem] py-[0.15rem] rounded-[3px] font-medium uppercase tracking-wide border ${
              displayMood === "welcoming" ? "border-green-300 bg-green-100 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-300"
              : displayMood === "open" ? "border-emerald-300 bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:border-emerald-700 dark:text-emerald-300"
              : displayMood === "reserved" ? "border-stone-300 bg-stone-100 text-stone-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              : displayMood === "doubtful" ? "border-amber-300 bg-amber-100 text-amber-700 dark:bg-amber-900 dark:border-amber-700 dark:text-amber-300"
              : "border-red-300 bg-red-100 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-300"
            }`}>
              <span className={`material-symbols-outlined ${
                displayMood === "welcoming" ? "text-green-600 dark:text-green-400"
                : displayMood === "open" ? "text-emerald-600 dark:text-emerald-400"
                : displayMood === "reserved" ? "text-stone-600 dark:text-gray-400"
                : displayMood === "doubtful" ? "text-amber-600 dark:text-amber-400"
                : "text-red-600 dark:text-red-400"
              }`} style={{ fontSize: "16px" }}>
                {displayMood === "welcoming" ? "sentiment_very_satisfied"
                : displayMood === "open" ? "sentiment_satisfied"
                : displayMood === "reserved" ? "sentiment_neutral"
                : displayMood === "doubtful" ? "sentiment_dissatisfied"
                : "sentiment_very_dissatisfied"}
              </span>
              <span className={`font-medium ${
                displayMood === "welcoming" || displayMood === "open" ? "text-green-600 dark:text-green-400"
                : displayMood === "reserved" ? "text-stone-600 dark:text-gray-300"
                : displayMood === "doubtful" ? "text-amber-600 dark:text-amber-400"
                : "text-red-600 dark:text-red-400"
              }`}>
                {displayMood === "welcoming" ? "Welcoming"
                : displayMood === "open" ? "Open"
                : displayMood === "reserved" ? "Reserved"
                : displayMood === "doubtful" ? "Doubtful"
                : "Dismissive"}
              </span>
            </span>
          </Tooltip>
        </div>

         {/* Bottom line: Description */}
<div>
  <span className="text-stone-600 dark:text-gray-300 inter text-sm">
    {(() => {
      // Handle reactions (show on BOTH tabs for consistency)
      if (isCartChangeReaction) {
        return (
          <>
            {shopkeeper.name.split(" ")[0]} {cartChangeDescription}.
            <span className="italic"> "{cartChangeQuote}"</span>
          </>
        );
      }
      
      if (isHaggleReaction && lastHaggleResult) {
  const result = lastHaggleResult as HaggleResult; // Type assertion
  if (result.success) {
    return (
      <>
        {shopkeeper.name.split(" ")[0]} {getPostHaggleDescription(displayMood, pronouns)}.
        <span className="italic"> "{currentHaggleQuote}"</span>
      </>
    );
  } else {
    return (
      <>
        {shopkeeper.name.split(" ")[0]} {getProcessedPostHaggleFailureDescription(displayMood, pronouns)}.
        <span className="italic"> "{currentHaggleQuote}"</span>
      </>
    );
        }
      }
      
      // Default: Normal interaction description
      return (
        <>
          {shopkeeper.name.split(" ")[0]} {processedMoodDesc}. <span className="capitalize">{pronouns.pronoun}</span> {processedPersonalityDesc}.
        </>
      );
    })()}
  </span>
</div>
      </div>
    </div>
  );
};

export { moodScale, applyCharismaMoodModifier, getDisplayMood };
export default ShopkeeperMoodDisplay;