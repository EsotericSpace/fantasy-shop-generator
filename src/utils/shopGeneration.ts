// utility/shopGeneration.ts

// Import data dependencies
import {
  femaleNames,
  races,
  firstNames,
  lastNames,
  raceNamingStyles,
} from "../data/names";
import { shopItems, commonItems, rareItems } from "../data/shopItems";
import { texturalDetails, interiors, setting } from "../data/shopDescriptions";
import {
  shopkeeperIntroductions,
  shopkeeperBehaviors,
  shopkeeperMottos,
} from "../data/shopkeeperPersonality";
import {
  shopkeeperTitles,
  settlementDescriptors,
  shopAdjectives,
  shopNouns,
  namingPatterns,
} from "../data/shopNaming";
import { shopTypes, pricingStyles, rarityRank } from "../data/constants";

// Import utility dependencies
import { adjustPrice, generateShopkeeperMoney } from "./pricing";

// Type definitions
interface ShopItem {
  name: string;
  basePrice: string | number;
  level: "Common" | "Uncommon" | "Rare" | "Very rare" | "Legendary";
  details: string;
  adjustedPrice: string;
}

interface InventoryLimits {
  numCommonItems: number;
  numRareItems: number;
  maxCommonRarity: string;
  maxRareRarity: string;
}

// Helper function to get shopkeeper pronouns
export const getShopkeeperPronouns = (shopkeeperName: string) => {
  const firstName = shopkeeperName.split(" ")[0];
  const isFemale = femaleNames.includes(firstName);
  return {
    possessive: isFemale ? "her" : "his",
    pronoun: isFemale ? "she" : "he",
    object: isFemale ? "her" : "him",
    reflexive: isFemale ? "herself" : "himself",
    genderNoun: isFemale ? "woman" : "man",
  };
};

// Helper function to determine refinement level
export const getShopRefinement = (
  priceModifier: number
): "refined" | "standard" | "humble" => {
  if (priceModifier > 0.15) return "refined";
  if (priceModifier < -0.15) return "humble";
  return "standard";
};

// Function to apply name and pronouns to a description template
export const applyNameAndPronouns = (
  template: string,
  name: string,
  race: string
) => {
  const firstName = name.split(" ")[0];
  const pronouns = getShopkeeperPronouns(name);

  return template
    .replace(/\{name\}/g, firstName)
    .replace(/\{object\}/g, pronouns.object)
    .replace(
      /\{Pronoun\}/g,
      pronouns.pronoun.charAt(0).toUpperCase() + pronouns.pronoun.slice(1)
    )
    .replace(
      /\{Possessive\}/g,
      pronouns.possessive.charAt(0).toUpperCase() + pronouns.possessive.slice(1)
    )
    .replace(/\{pronoun\}/g, pronouns.pronoun)
    .replace(/\{possessive\}/g, pronouns.possessive)
    .replace(/\{reflexive\}/g, pronouns.reflexive)
    .replace(/\{genderNoun\}/g, pronouns.genderNoun);
};

// Generate shopkeeper description with template
export const generateShopkeeperDescriptionWithTemplate = (
  shopkeeper: { name: string; race: string; shopType: string },
  priceModifier: number
) => {
  const refinement = getShopRefinement(priceModifier);
  const normalizedShopType = shopkeeper.shopType.toLowerCase();

  // Get introduction based on shop type and refinement
  const introOptions =
    shopkeeperIntroductions[normalizedShopType]?.[refinement] ||
    shopkeeperIntroductions["general store"][refinement];

  const introduction =
    introOptions[Math.floor(Math.random() * introOptions.length)];

  // Get behavior
  const behaviorOptions =
    shopkeeperBehaviors[normalizedShopType]?.[refinement] ||
    shopkeeperBehaviors["general store"][refinement];
  const behavior =
    behaviorOptions[Math.floor(Math.random() * behaviorOptions.length)];

  // Create template with placeholders intact
  const template = `${introduction} ${behavior}.`;

  // Create final description with actual values
  const finalDescription = applyNameAndPronouns(
    template,
    shopkeeper.name,
    shopkeeper.race
  );

  return {
    finalDescription,
    template,
  };
};

// Generate shopkeeper motto
export const generateMotto = (shopTypeValue: string, priceModifier: number) => {
  const choose = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  const refinement = getShopRefinement(priceModifier);
  const normalizedShopType = shopTypeValue.toLowerCase();

  // Get mottos based on shop type and refinement
  const mottoOptions =
    shopkeeperMottos[normalizedShopType]?.[refinement] ||
    shopkeeperMottos["general store"][refinement];

  return choose(mottoOptions);
};

// Generate shop name
export const generateShopName = (
  shopType: string,
  shopkeeperName: string,
  shopkeeperRace: string,
  settlementSize: string,
  priceModifier: number
) => {
  const normalizedShopType = shopType;
  const refinement = getShopRefinement(priceModifier);
  const firstName = shopkeeperName ? shopkeeperName.split(" ")[0] : "";

  // Get shop-specific adjectives and nouns
  const adjectives =
    shopAdjectives[normalizedShopType] || shopAdjectives["General Store"];
  const nouns = shopNouns[normalizedShopType] || shopNouns["General Store"];
  const patterns =
    namingPatterns[normalizedShopType] || namingPatterns["General Store"];

  // Get new elements
  const titles =
    shopkeeperTitles[refinement][normalizedShopType] ||
    shopkeeperTitles[refinement]["General Store"];
  const settlements =
    settlementDescriptors[settlementSize] || settlementDescriptors["town"];
  const raceStyles =
    raceNamingStyles[shopkeeperRace] || raceNamingStyles["Human"];

  // Randomly select components
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const title = titles[Math.floor(Math.random() * titles.length)];
  const settlement =
    settlements[Math.floor(Math.random() * settlements.length)];
  const raceStyle = raceStyles[Math.floor(Math.random() * raceStyles.length)];
  const pattern = patterns[Math.floor(Math.random() * patterns.length)];

  // Replace placeholders in the selected pattern
  const shopName = pattern
    .replace("{adjective}", adjective)
    .replace("{noun}", noun)
    .replace("{firstName}", firstName)
    .replace("{title}", title)
    .replace("{settlement}", settlement)
    .replace("{race_style}", raceStyle);

  return shopName;
};

// Generate shop description
export const generateShopDescription = (
  shopType: string,
  settlementSize: string,
  rateModifier: number,
  existingParts?: { location?: string; interior?: string; texture?: string }
) => {
  const refinement = getShopRefinement(rateModifier);
  const normalizedType = shopType.toLowerCase();

  // Generate or reuse location
  const locationSettingArray = setting[settlementSize.toLowerCase()];
  const chosenSetting =
    existingParts?.location ||
    locationSettingArray[
      Math.floor(Math.random() * locationSettingArray.length)
    ];

  // Generate or reuse interior
  const shopInteriorOptions = interiors[normalizedType]?.[refinement] || [];
  const chosenInterior =
    existingParts?.interior ||
    shopInteriorOptions[
      Math.floor(Math.random() * shopInteriorOptions.length)
    ] ||
    "an ordinary interior";

  // Generate or reuse texture
  const shopTextureOptions =
    texturalDetails[normalizedType]?.[refinement] || [];
  const chosenTexture =
    existingParts?.texture ||
    shopTextureOptions[Math.floor(Math.random() * shopTextureOptions.length)] ||
    "";

  const fullDescription = `This shop is ${chosenSetting}. Inside, you'll find ${chosenInterior}.${
    chosenTexture ? ` ${chosenTexture}.` : ""
  }`;

  return {
    fullDescription,
    location: chosenSetting,
    interior: chosenInterior,
    texture: chosenTexture,
  };
};

// Get inventory limits based on settlement size
export const getInventoryLimits = (sizeValue: string): InventoryLimits => {
  switch (sizeValue) {
    case "village":
      return {
        numCommonItems: Math.floor(Math.random() * 3) + 3, // 3–5 items
        numRareItems: 0, // No rare items in villages
        maxCommonRarity: "Common",
        maxRareRarity: "Common",
      };
    case "town":
      return {
        numCommonItems: Math.floor(Math.random() * 4) + 5, // 5–8 items
        numRareItems: Math.floor(Math.random() * 2) + 1, // 1–2 rare items
        maxCommonRarity: "Uncommon",
        maxRareRarity: "Rare",
      };
    case "city":
    default:
      return {
        numCommonItems: Math.floor(Math.random() * 6) + 5, // 5–10 items
        numRareItems: Math.floor(Math.random() * 3) + 1, // 1–3 rare items
        maxCommonRarity: "Rare",
        maxRareRarity: "Legendary",
      };
  }
};

// Generate common inventory
export const generateCommonItems = (
  shopTypeValue: string | number,
  priceModifier: number,
  limits: { numCommonItems: number; maxCommonRarity: string }
): ShopItem[] => {
  const commonInventory = commonItems[shopTypeValue];
  const selectedCommonItems: ShopItem[] = [];
  const usedCommonIndices = new Set();

  const weightedCommonSelection = () => {
    let availableItems = commonInventory.filter(
      (item, index) =>
        rarityRank[item.level] <= rarityRank[limits.maxCommonRarity] &&
        !usedCommonIndices.has(index)
    );

    if (availableItems.length === 0) return null;

    availableItems.sort((a, b) => rarityRank[a.level] - rarityRank[b.level]);
    const weightedIndex = Math.floor(
      Math.pow(Math.random(), 1.5) * availableItems.length
    );

    return {
      item: availableItems[weightedIndex],
      index: commonInventory.indexOf(availableItems[weightedIndex]),
    };
  };

  for (let i = 0; i < limits.numCommonItems; i++) {
    const selection = weightedCommonSelection();
    if (!selection) break;

    usedCommonIndices.add(selection.index);
    selectedCommonItems.push({
      name: selection.item.name,
      basePrice: selection.item.price,
      level: selection.item.level,
      details: selection.item.details,
      adjustedPrice: adjustPrice(selection.item.price, priceModifier),
    });
  }

  return selectedCommonItems;
};

// Generate rare inventory
export const generateRareItems = (
  shopTypeValue: string | number,
  priceModifier: number,
  limits: { numRareItems: number; maxRareRarity: string }
): ShopItem[] => {
  const rareInventory = rareItems[shopTypeValue];
  const selectedRareItems: ShopItem[] = [];
  const usedRareIndices = new Set();

  const weightedRareSelection = () => {
    let availableItems = rareInventory.filter(
      (item, index) =>
        rarityRank[item.level] <= rarityRank[limits.maxRareRarity]
    );

    if (availableItems.length === 0) return null;

    availableItems.sort((a, b) => rarityRank[a.level] - rarityRank[b.level]);
    const weightedIndex = Math.floor(
      Math.pow(Math.random(), 2) * availableItems.length
    );

    return {
      item: availableItems[weightedIndex],
      index: rareInventory.indexOf(availableItems[weightedIndex]),
    };
  };

  for (let i = 0; i < limits.numRareItems; i++) {
    const selection = weightedRareSelection();
    if (!selection) break;

    usedRareIndices.add(selection.index);
    selectedRareItems.push({
      name: selection.item.name,
      basePrice: selection.item.price,
      level: selection.item.level,
      details: selection.item.details,
      adjustedPrice: adjustPrice(selection.item.price, priceModifier),
    });
  }

  return selectedRareItems;
};
export { generateShopkeeperMoney };