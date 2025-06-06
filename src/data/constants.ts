// data/constants.ts
import { FlaskIcon } from "@phosphor-icons/react";

export const shopTypes = [
  "General Store",
  "Blacksmith",
  "Alchemist",
  "Mystic Goods",
  "Exotic Goods",
  "Jeweler",
];

export const pricingStyles = [
  { style: "Fair and reasonable", modifier: 0 },
  { style: 'Premium prices for "quality"', modifier: 0.2 },
  { style: "Suspiciously cheap", modifier: -0.2 },
  { style: "Haggler who starts high", modifier: 0.15 },
  { style: "Based on how much they like you", modifier: 0.1 },
  { style: 'Charges extra for "authenticity"', modifier: 0.18 },
  { style: "Surprisingly affordable", modifier: -0.15 },
];

// Shop type icons mapping
export const shopIcons = {
  "General Store": "box",
  Blacksmith: "swords",
  Alchemist: FlaskIcon,
  "Mystic Goods": "wand_stars",
  "Exotic Goods": "festival",
  Jeweler: "diamond",
};

export const rarityRank = {
  Common: 1,
  Uncommon: 2,
  Rare: 3,
  "Very rare": 4,
  Legendary: 5,
};