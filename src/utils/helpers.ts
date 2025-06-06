// utils/helpers.ts

// Import dependencies
import { itemCategories } from "../data/itemCategories";
import { parsePriceToGold } from "./pricing";
import {
  HorseIcon,
  CastleTurretIcon,
  FarmIcon,
  HouseLineIcon,
} from "@phosphor-icons/react";

// Sort items function
export const sortItems = (items: any[], sortMode: string) => {
  if (!items || items.length === 0) return items;

  // Add adjustedPriceValue to items if not present
  const itemsWithPriceValue = items.map((item) => ({
    ...item,
    adjustedPriceValue:
      item.adjustedPriceValue || parsePriceToGold(item.adjustedPrice),
  }));

  if (sortMode === "alpha") {
    return [...itemsWithPriceValue].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  } else if (sortMode === "price-asc") {
    return [...itemsWithPriceValue].sort(
      (a, b) => a.adjustedPriceValue - b.adjustedPriceValue
    );
  } else if (sortMode === "price-desc") {
    return [...itemsWithPriceValue].sort(
      (a, b) => b.adjustedPriceValue - a.adjustedPriceValue
    );
  }
  return itemsWithPriceValue;
};

// Helper function to get category and icon for any item
export function getCategoryForItem(itemName: string) {
  const normalizedName = itemName.toLowerCase();

  for (const [categoryKey, categoryData] of Object.entries(itemCategories)) {
    if (
      categoryData.items.some((item) => item.toLowerCase() === normalizedName)
    ) {
      return {
        category: categoryKey,
        icon: categoryData.icon,
        name: categoryData.name,
      };
    }
  }

  // Default fallback
  return {
    category: "miscellaneous",
    icon: "help_outline",
    name: "Miscellaneous",
  };
}

// Helper function to get icon for item (shortcut)
export function getIconForItem(itemName: string) {
  const categoryInfo = getCategoryForItem(itemName);
  const icon = categoryInfo.icon;

  // If it's a string, it's a Material Symbol
  if (typeof icon === "string") {
    return icon;
  }

  // If it's a component, return 'phosphor' as a flag
  return "phosphor";
}

// Helper function to get the actual icon component
export function getIconComponent(itemName: string) {
  const categoryInfo = getCategoryForItem(itemName);
  return categoryInfo.icon;
}

// Helper function to get all items in a category
export function getItemsInCategory(categoryKey: string) {
  return itemCategories[categoryKey]?.items || [];
}

// Helper function to get category statistics
export function getCategoryStats() {
  const stats: Record<string, any> = {};
  for (const [key, data] of Object.entries(itemCategories)) {
    stats[key] = {
      name: data.name,
      icon: data.icon,
      count: data.items.length,
    };
  }
  return stats;
}

// Get rarity badge class
export const getRarityBadgeClass = (rarity: string) => {
  const normalizedRarity = rarity.toLowerCase().replace(/\s+/g, "-");
  switch (normalizedRarity) {
    case "common":
      return "rarity-badge rarity-common";
    case "uncommon":
      return "rarity-badge rarity-uncommon";
    case "rare":
      return "rarity-badge rarity-rare";
    case "very-rare":
      return "rarity-badge rarity-very-rare";
    case "legendary":
      return "rarity-badge rarity-legendary";
    default:
      return "rarity-badge rarity-common";
  }
};

// Get color classes based on rarity level (modified to accept isDarkMode parameter)
export const getRarityColors = (level: string, isDarkMode: boolean) => {
  const baseColors = {
    common: {
      light: {
        text: "text-stone-500",
        textLight: "text-stone-500",
        textIcon: "text-stone-500",
        background: "bg-stone-50 border-stone-400 hover:bg-stone-100",
      },
      dark: {
        text: "text-gray-300",
        textLight: "text-gray-400",
        textIcon: "text-gray-400",
        background: "bg-gray-700 border-gray-600 hover:bg-gray-600",
      },
    },
    uncommon: {
      light: {
        text: "text-cyan-700",
        textLight: "text-cyan-700",
        textIcon: "text-cyan-700",
        background: "bg-teal-50 border-cyan-700 hover:bg-teal-100",
      },
      dark: {
        text: "text-teal-300",
        textLight: "text-teal-400",
        textIcon: "text-teal-400",
        background: "bg-teal-900 border-teal-600 hover:bg-teal-800",
      },
    },
    rare: {
      light: {
        text: "text-indigo-600",
        textLight: "text-indigo-600",
        textIcon: "text-indigo-600",
        background: "bg-violet-50 border-indigo-600 hover:bg-violet-100",
      },
      dark: {
        text: "text-indigo-300",
        textLight: "text-indigo-400",
        textIcon: "text-indigo-400",
        background: "bg-indigo-900 border-indigo-600 hover:bg-indigo-800",
      },
    },
    "very rare": {
      light: {
        text: "text-rose-500",
        textLight: "text-rose-500",
        textIcon: "text-rose-500",
        background: "bg-pink-50 border-rose-500 hover:bg-pink-100",
      },
      dark: {
        text: "text-rose-300",
        textLight: "text-rose-400",
        textIcon: "text-rose-400",
        background: "bg-rose-900 border-rose-600 hover:bg-rose-800",
      },
    },
    legendary: {
      light: {
        text: "text-yellow-600",
        textLight: "text-yellow-600",
        textIcon: "text-yellow-600",
        background: "bg-amber-50 border-yellow-600 hover:bg-amber-100",
      },
      dark: {
        text: "text-yellow-300",
        textLight: "text-yellow-400",
        textIcon: "text-yellow-400",
        background: "bg-yellow-900 border-yellow-600 hover:bg-yellow-800",
      },
    },
  };

  const normalizedLevel = level.toLowerCase();
  const colorSet = baseColors[normalizedLevel] || baseColors.common;

  return isDarkMode ? colorSet.dark : colorSet.light;
};

// Get settlement data
export const getSettlementData = (size: string) => {
  switch (size) {
    case "village":
      return {
        text: "Village",
        iconType: "phosphor",
        iconComponent: FarmIcon,
      };
    case "town":
      return {
        text: "Town",
        iconType: "phosphor",
        iconComponent: HouseLineIcon,
      };
    case "city":
      return {
        text: "City",
        iconType: "phosphor",
        iconComponent: CastleTurretIcon,
      };
    default:
      return {
        text: "Merchant",
        icon: "storefront",
        iconType: "material",
      };
  }
};

// Function to highlight pricing in the description
export const highlightPricing = (text: string) => {
  if (!text) return "";

  const pricingPatterns = [
    /charges a premium for .+ above market value/g,
    /asks \d+% more than most merchants/g,
    /offers surprisingly good deals at \d+% below the usual rates/g,
    /keeps prices slightly lower than competitors—about \d+% below average/g,
    /maintains fair, standard market prices/g,
  ];

  let highlightedText = text;

  pricingPatterns.forEach((pattern) => {
    highlightedText = highlightedText.replace(
      pattern,
      (match) => `<span class="text-stone-900 font-medium">${match}</span>`
    );
  });

  return highlightedText;
};
