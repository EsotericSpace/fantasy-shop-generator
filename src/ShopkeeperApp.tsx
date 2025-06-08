import React, { useState, useEffect } from "react";
import "./styles/ShopkeeperApp.css";
import SellingSection from "./components/sellingSection";
import ShopkeeperCard from "./components/shopkeeperCard";
import InventorySection from "./components/inventorySection";
import TitleCard from "./components/titleCard";
import { buttonStyles } from './styles/buttonStyles'
import { useShopkeeper } from "./hooks/useShopkeeper";
import {
  femaleNames,
  races,
  firstNames,
  lastNames,
  raceNamingStyles,
} from "./data/names";
import {
  shopkeeperIntroductions,
  shopkeeperBehaviors,
  shopkeeperMottos,
} from "./data/shopkeeperPersonality";
import {
  shopkeeperTitles,
  settlementDescriptors,
  shopAdjectives,
  shopNouns,
  namingPatterns,
} from "./data/shopNaming";
import { shopItems, getCommonItems, getRareItems } from "./data/shopItems.ts";
import { itemCategories } from "./data/itemCategories";
import { texturalDetails, interiors, setting } from "./data/shopDescriptions";
import {
  shopTypes,
  pricingStyles,
  shopIcons,
  rarityRank,
} from "./data/constants";
import {
  parsePriceToGold,
  formatCurrency,
  adjustPrice,
  calculateBuyPrice,
  getShopkeeperBuyRate,
  generateShopkeeperMoney,
} from "./utils/pricing";
import {
  getShopkeeperPronouns,
  getShopRefinement,
  applyNameAndPronouns,
  generateShopkeeperDescriptionWithTemplate,
  generateMotto,
  generateShopName,
  generateShopDescription,
  getInventoryLimits,
  generateCommonItems,
  generateRareItems,
} from "./utils/shopGeneration";
import {
  sortItems,
  getCategoryForItem,
  getIconForItem,
  getIconComponent,
  getItemsInCategory,
  getCategoryStats,
  getRarityBadgeClass,
  getRarityColors,
  getSettlementData,
  highlightPricing,
} from "./utils/helpers";

import {
  CastleTurretIcon,
  FarmIcon,
  HouseLineIcon,
  LockKeyIcon,
  LockKeyOpenIcon,
} from "@phosphor-icons/react";

const PhosphorIcon = ({ icon: Icon, weight = "thin", size = 20, ...props }) => (
  <Icon weight={weight} size={size} {...props} />
);

const getHagglingStyle = (settlementSize, priceModifier) => {
  const hagglingStyles = {
    village: {
      generous: { name: "Generous Trader", dcModifier: -2 },
      standard: { name: "Friendly Negotiator", dcModifier: -1 },
      stingy: { name: "Careful Dealer", dcModifier: 0 }
    },
    town: {
      generous: { name: "Fair Dealer", dcModifier: -1 },
      standard: { name: "Reasonable Negotiator", dcModifier: 0 },
      stingy: { name: "Firm Negotiator", dcModifier: +1 }
    },
    city: {
      generous: { name: "Accommodating Merchant", dcModifier: 0 },
      standard: { name: "Shrewd Negotiator", dcModifier: +1 },
      stingy: { name: "Tough Negotiator", dcModifier: +2 }
    }
  };

  const refinement = priceModifier > 0.1 ? "stingy" : 
                    priceModifier < -0.1 ? "generous" : "standard";
                    
  return hagglingStyles[settlementSize]?.[refinement] || 
         hagglingStyles.town.standard;
};

function ShopkeeperGenerator() {
  const {
    shopkeeper,
    shopType,
    settlementSize,
    selectedPricingStyle,
    isLocked,
    setShopkeeper,
    setShopType,
    setSettlementSize,
    setSelectedPricingStyle,
    generateShopkeeper,
    regenerateNameForRace,
    toggleLock,
    getCurrentPricingText,
    regenerateDescriptionForPricing,
    hasRefinementElements,
    replaceRefinementTitle,
  } = useShopkeeper();

  const [fadeCommon, setFadeCommon] = useState(false);
  const [fadeRare, setFadeRare] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRaceDropdownOpen, setIsRaceDropdownOpen] = useState(false);
  const [isSettlementDropdownOpen, setIsSettlementDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' or 'selling'
  const [isShopTypeDropdownOpen, setIsShopTypeDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("any");
  const [inventorySort, setInventorySort] = useState("alpha");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Selling system state

  const [itemSearchQuery, setItemSearchQuery] = useState("");
  const [selectedItemCategory, setSelectedItemCategory] = useState("all");
  const [sellingItems, setSellingItems] = useState([]);
  const [playerCharisma, setPlayerCharisma] = useState(0);
  const [haggleAttempts, setHaggleAttempts] = useState(3);
  const [currentHaggleDC, setCurrentHaggleDC] = useState(10);
  const [shopkeeperMood, setShopkeeperMood] = useState("reserved");
  const [lastHaggleResult, setLastHaggleResult] = useState(null);
  const [recentSales, setRecentSales] = useState([]);
  const [isHaggling, setIsHaggling] = useState(false);
  const [isHaggleReaction, setIsHaggleReaction] = useState(false);
  const [isCurrentHaggleQuote, setCurrentHaggleQuote] = useState(false);
  const [isCharismaDropdownOpen, setIsCharismaDropdownOpen] = useState(false);
  const [hasTriedCharismaCheck, setHasTriedCharismaCheck] = useState(false);
  const [relationshipStatus, setRelationshipStatus] = useState("reserved"); // "trusted", "neutral", "annoyed", "offended"
  const [critFailCount, setCritFailCount] = useState(0); // Track escalating penalties
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [apologyFee, setApologyFee] = useState(0);
  const [lockoutReason, setLockoutReason] = useState("");

  const [isCategoryFilterDropdownOpen, setIsCategoryFilterDropdownOpen] =
    useState(false);

  // Selling system functions

  const calculateApologyFee = () => {
    if (!shopkeeper || sellingItems.length === 0) return 0;

    // Base fee by settlement size
    let baseFee;
    switch (settlementSize) {
      case "village":
        baseFee = Math.floor(Math.random() * 26) + 25; // 25-50 gold
        break;
      case "town":
        baseFee = Math.floor(Math.random() * 26) + 50; // 50-75 gold
        break;
      case "city":
        baseFee = Math.floor(Math.random() * 26) + 75; // 75-100 gold
        break;
      default:
        baseFee = 50;
    }

    // Personality modifiers
    const refinement = getShopRefinement(shopkeeper.priceModifier);
    if (refinement === "refined") {
      baseFee *= 2; // +100%
    } else if (refinement === "humble") {
      baseFee *= 0.5; // -50%
    }

    // Cart value factor (15-20% of current cart)
    const cartValue = getTotalMarketValue();
    const cartPercentage = cartValue * (0.15 + Math.random() * 0.05); // 15-20%

    // Use whichever is higher
    let finalFee = Math.max(baseFee, cartPercentage);

    // Escalating penalties
    if (critFailCount === 1) {
      finalFee *= 1.5; // +50% for second offense
    } else if (critFailCount >= 2) {
      finalFee *= 2; // +100% for third+ offense
    }

    return Math.round(finalFee);
  };

  const getRelationshipIcon = () => {
    switch (relationshipStatus) {
      case "trusted":
        return "favorite";
      case "neutral":
        return "sentiment_neutral";
      case "annoyed":
        return "sentiment_dissatisfied";
      case "offended":
        return "sentiment_very_dissatisfied";
      default:
        return "sentiment_neutral";
    }
  };

  const getRelationshipColor = () => {
    switch (relationshipStatus) {
      case "trusted":
        return "text-green-500 dark:text-green-400";
      case "neutral":
        return "text-stone-500 dark:text-gray-400";
      case "annoyed":
        return "text-amber-500 dark:text-amber-400";
      case "offended":
        return "text-red-500 dark:text-red-400";
      default:
        return "text-stone-500 dark:text-gray-400";
    }
  };

  const handleApologyPayment = () => {
    const shopMoney = calculateShopTotalMoney();
    if (apologyFee > shopMoney) {
      alert(
        `${
          shopkeeper.name.split(" ")[0]
        } doesn't have enough money to make change for this fee!`
      );
      return;
    }

    updateShopMoney(-apologyFee);
    setIsLockedOut(false);
    setApologyFee(0);
    setRelationshipStatus("neutral");
    setShopkeeperMood("neutral");
    setLockoutReason("");
    setHaggleAttempts(3);
    const hagglingStyle = getHagglingStyle(settlementSize, shopkeeper.priceModifier);
setCurrentHaggleDC(10 + hagglingStyle.dcModifier);
    setLastHaggleResult(null);
    setHasTriedCharismaCheck(false); // Reset charisma check
  };

  const handleCharismaCheck = () => {
    if (hasTriedCharismaCheck) return; // Prevent multiple attempts

    setHasTriedCharismaCheck(true); // Mark as used
    const roll = rollD20();
    const total = roll + playerCharisma;
    const success = total >= 15;

    if (success) {
      const reducedFee = Math.round(apologyFee / 2);
      setApologyFee(reducedFee);
      setLastHaggleResult({
        roll,
        total,
        dc: 15,
        success: true,
        bonusPercent: 0,
        resultText: `Charisma check successful! ${
          shopkeeper.name.split(" ")[0]
        } reduces the fee to ${reducedFee} gold.`,
      });
    } else {
      setLastHaggleResult({
        roll,
        total,
        dc: 15,
        success: false,
        bonusPercent: 0,
        resultText: `Charisma check failed. ${
          shopkeeper.name.split(" ")[0]
        } is unmoved by your pleas.`,
      });
    }
  };

  // Helper function to get all possible items for current shop type
  const getAllShopItems = () => {
    if (!shopkeeper) return [];

    const shopTypeItems = shopItems[shopkeeper.shopType] || [];
    return shopTypeItems.map((item) => ({
      ...item,
      basePrice: item.price,
    }));
  };

  // Helper function to get the original market price for any item
  const getMarketPrice = (itemName) => {
    // Find the item in the original shop data (not adjusted prices)
    const allItems = Object.values(shopItems).flat();
    const originalItem = allItems.find(
      (item) => item.name.toLowerCase() === itemName.toLowerCase()
    );
    return originalItem ? originalItem.price : null;
  };

  const addItemToSell = (item) => {
    setSellingItems((prev) => {
      const existing = prev.find((selling) => selling.name === item.name);
      if (existing) {
        return prev.map((selling) =>
          selling.name === item.name
            ? { ...selling, quantity: selling.quantity + 1 }
            : selling
        );
      } else {
        // New item! Possibly improve mood
        if (shopkeeperMood === "irritated" && Math.random() > 0.5) {
          // 50% chance to improve from irritated to skeptical when adding new items
          setShopkeeperMood("skeptical");
        } else if (shopkeeperMood === "skeptical" && Math.random() > 0.7) {
          // 30% chance to improve from skeptical to neutral
          setShopkeeperMood("neutral");
        }

        // Always use true market price for display and calculations
        let marketPrice = item.price; // Start with item.price as default

        // First: try the basePrice from the item (should be the original market price)
        if (item.basePrice && item.basePrice !== item.adjustedPrice) {
          marketPrice = item.basePrice;
        }

        // Second: look up in the original database
        if (!marketPrice) {
          marketPrice = getMarketPrice(item.name) || item.price;
        }

        // Last resort: use item.price but this might be wrong
        if (!marketPrice) {
          marketPrice = item.price;
        }

        const itemGoldValue = parsePriceToGold(marketPrice);

        // Store the market price for display in cart
        return [
          ...prev,
          {
            ...item,
            quantity: 1,
            level: item.level || "Common",
            marketPrice: marketPrice, // Display this in cart
            marketValue: itemGoldValue, // Use this for calculations
            shopkeeperPrice: item.adjustedPrice || item.price, // What the shopkeeper sells it for
          },
        ];
      }
    });
  };

  const removeItemFromSell = (itemName) => {
    setSellingItems((prev) => prev.filter((item) => item.name !== itemName));
  };

  const updateSellQuantity = (itemName, newQuantity) => {
    if (newQuantity <= 0) {
      removeItemFromSell(itemName);
      return;
    }

    setSellingItems((prev) =>
      prev.map((item) =>
        item.name === itemName ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const rollD20 = () => Math.floor(Math.random() * 20) + 1;

  const attemptHaggle = () => {
    if (haggleAttempts <= 0 || isLockedOut) return;

    setIsHaggling(true);
    const roll = rollD20();
    const total = roll + playerCharisma;
    const success = total >= currentHaggleDC;

    // Check for critical failure (natural 1)
    if (roll === 1) {
      const fee = calculateApologyFee();
      setApologyFee(fee);
      setIsLockedOut(true);
      setCritFailCount((prev) => prev + 1);
      setRelationshipStatus("offended");
      setShopkeeperMood("irritated");
      setLockoutReason(
        `You've gravely insulted ${shopkeeper.name.split(" ")[0]}!`
      );

      setLastHaggleResult({
        roll,
        total,
        dc: currentHaggleDC,
        success: false,
        bonusPercent: 0,
        resultText: `Critical failure! ${
          shopkeeper.name.split(" ")[0]
        } is deeply offended by your negotiation attempt.`,
      });

      setTimeout(() => setIsHaggling(false), 1000);
      return;
    }

    const personality = getShopkeeperPersonality(
      shopkeeper.shopType,
      shopkeeper.priceModifier
    );

    let bonusPercent = 0;
    let resultText = "";
    let newMood = shopkeeperMood;
    let newRelationship = relationshipStatus;

    if (success) {
      const successMargin = total - currentHaggleDC;

      // Check for critical success (natural 20)
      if (roll === 20) {
        bonusPercent = 20;
        resultText = `Critical success! ${
          shopkeeper.name.split(" ")[0]
        } is thoroughly impressed by your negotiation skills.`;
        newMood = "pleased";
        newRelationship =
          relationshipStatus === "neutral" ? "trusted" : relationshipStatus;
      } else if (successMargin >= 10) {
        bonusPercent = 15;
        resultText = `Excellent haggling! ${
          shopkeeper.name.split(" ")[0]
        } is impressed.`;
        if (roll >= 18 || successMargin >= 15) {
          newMood =
            shopkeeperMood === "neutral"
              ? "satisfied"
              : shopkeeperMood === "satisfied"
              ? "pleased"
              : shopkeeperMood;
        } else {
          newMood = shopkeeperMood;
        }
      } else if (successMargin >= 5) {
        bonusPercent = 10;
        resultText = `Good negotiation. ${
          shopkeeper.name.split(" ")[0]
        } nods approvingly.`;
        newMood = shopkeeperMood;
      } else {
        bonusPercent = 5;
        resultText = `Decent argument. ${
          shopkeeper.name.split(" ")[0]
        } considers your point.`;
        if (
          shopkeeperMood === "neutral" ||
          shopkeeperMood === "satisfied" ||
          shopkeeperMood === "pleased"
        ) {
          newMood = shopkeeperMood;
        } else {
          newMood =
            shopkeeperMood === "irritated" ? "skeptical" : shopkeeperMood;
        }
      }
    } else {
      // Failed haggle - apply negative penalties
      const failureMargin = currentHaggleDC - total;
      if (failureMargin >= 10) {
        bonusPercent = -10; // Heavy penalty for bad failure
        resultText = `Poor attempt. ${
          shopkeeper.name.split(" ")[0]
        } is annoyed and lowers their offer.`;
        newMood = "irritated";
        newRelationship =
          relationshipStatus === "trusted"
            ? "neutral"
            : relationshipStatus === "neutral"
            ? "annoyed"
            : relationshipStatus;
      } else {
        bonusPercent = -5; // Light penalty for close failure
        resultText = `Nice try, but ${
          shopkeeper.name.split(" ")[0]
        } isn't convinced and reduces their offer slightly.`;
        newMood =
          shopkeeperMood === "pleased"
            ? "satisfied"
            : shopkeeperMood === "satisfied"
            ? "neutral"
            : shopkeeperMood === "neutral"
            ? "skeptical"
            : shopkeeperMood;
      }
    }

    setLastHaggleResult({
      roll,
      total,
      dc: currentHaggleDC,
      success,
      bonusPercent,
      resultText,
    });

    setHaggleAttempts((prev) => prev - 1);
    setCurrentHaggleDC((prev) => prev + 2);
    setShopkeeperMood(newMood);
    setRelationshipStatus(newRelationship);
    setIsHaggleReaction(true);

    // Apply bonus/penalty to all items
    setSellingItems((prev) =>
      prev.map((item) => ({
        ...item,
        haggleBonus: (item.haggleBonus || 0) + bonusPercent,
      }))
    );

    setTimeout(() => setIsHaggling(false), 1000);
  };

  const executeSale = () => {
    if (sellingItems.length === 0) return;

    const totalValue = calculateSaleTotal();

    const shopTotalValue = calculateShopTotalMoney();
    console.log("=== SALE DEBUG ===");
    console.log("Sale total value:", totalValue);
    console.log("Shop total value:", shopTotalValue);
    console.log("Can afford?", totalValue <= shopTotalValue);
    console.log("==================");

    const saleRecord = {
      id: Date.now(),
      items: [...sellingItems],
      totalValue,
      charismaBonus: playerCharisma * 5,
      haggleBonus: sellingItems.reduce(
        (sum, item) => sum + (item.haggleBonus || 0),
        0
      ),
      timestamp: new Date(),
    };

    setRecentSales((prev) => [saleRecord, ...prev.slice(0, 4)]);
    updateShopMoney(-totalValue);

    // Improve shopkeeper mood based on sale value
    if (totalValue >= 100) {
      // Large sale - big mood improvement
      setShopkeeperMood("pleased");
    } else if (totalValue >= 50 || shopkeeperMood === "skeptical") {
      // Medium sale or recover from skeptical
      setShopkeeperMood("satisfied");
    } else if (shopkeeperMood === "irritated") {
      // Small sale but recover from irritated
      setShopkeeperMood("neutral");
    }

    setSellingItems([]);
    setHaggleAttempts(3);
    const hagglingStyle = getHagglingStyle(settlementSize, shopkeeper.priceModifier);
setCurrentHaggleDC(10 + hagglingStyle.dcModifier);
    setLastHaggleResult(null);
  };

  const undoSale = (saleId) => {
    const sale = recentSales.find((s) => s.id === saleId);
    if (!sale) return;

    updateShopMoney(sale.totalValue);
    setRecentSales((prev) => prev.filter((s) => s.id !== saleId));
  };

  const calculateSaleTotal = () => {
    console.log("=== CALCULATE SALE TOTAL DEBUG ===");
    console.log("Selling items:", sellingItems);

    // Calculate total market value of all items
    const totalMarketValue = sellingItems.reduce((sum, item) => {
      console.log(`Item ${item.name}:`, {
        marketValue: item.marketValue,
        quantity: item.quantity,
        subtotal: item.marketValue * item.quantity,
      });
      return sum + item.marketValue * item.quantity;
    }, 0);

    console.log("Total market value:", totalMarketValue);

    // Get shopkeeper's buying rate (affected by their personality)
    const shopRate = getShopkeeperBuyRate(
      shopkeeper.priceModifier,
      settlementSize
    );
    console.log("Shop rate:", shopRate);

    // Apply charisma bonus
    const charismaBonus = playerCharisma * 5; // Convert to percentage
    console.log("Charisma bonus:", charismaBonus);

    const effectiveRate = Math.min(0.8, shopRate + charismaBonus / 100);
    console.log("Effective rate:", effectiveRate);

    // Apply haggle bonuses/penalties (calculate average to avoid exploiting individual item bonuses)
    const totalHaggleBonus = sellingItems.reduce((sum, item) => {
      return sum + (item.haggleBonus || 0);
    }, 0);
    const avgHaggleBonus =
      sellingItems.length > 0 ? totalHaggleBonus / sellingItems.length : 0;
    console.log("Average haggle bonus:", avgHaggleBonus);

    // Final rate can go negative if penalties are severe enough, but floor at 0.05 (5%)
    const finalRate = Math.max(
      0.05,
      Math.min(0.95, effectiveRate + avgHaggleBonus / 100)
    );
    console.log("Final rate:", finalRate);

    const result = totalMarketValue * finalRate;
    console.log("Final result:", result);
    console.log("==================================");

    return totalMarketValue * finalRate;
  };

  const getTotalMarketValue = () => {
    return sellingItems.reduce((sum, item) => {
      return sum + item.marketValue * item.quantity;
    }, 0);
  };

  // Total shop till
  const calculateShopTotalMoney = () => {
    if (!shopkeeper?.availableMoney) return 0;

    const moneyStr = shopkeeper.availableMoney;
    console.log("=== MONEY PARSING DEBUG ===");
    console.log("Raw money string:", moneyStr);

    let total = 0;

    // Extract gold
    const goldMatch = moneyStr.match(/gold-icon[^>]*>poker_chip<\/span>(\d+)/);
    console.log("Gold match:", goldMatch);
    if (goldMatch) total += parseInt(goldMatch[1]);

    // Extract silver (convert to gold)
    const silverMatch = moneyStr.match(
      /silver-icon[^>]*>poker_chip<\/span>(\d+)/
    );
    console.log("Silver match:", silverMatch);
    if (silverMatch) total += parseInt(silverMatch[1]) / 10;

    // Extract copper (convert to gold)
    const copperMatch = moneyStr.match(
      /copper-icon[^>]*>poker_chip<\/span>(\d+)/
    );
    console.log("Copper match:", copperMatch);
    if (copperMatch) total += parseInt(copperMatch[1]) / 100;

    console.log("Final total:", total);
    console.log("===========================");

    return total;
  };

  const updateShopMoney = (goldChange) => {
    const currentTotal = calculateShopTotalMoney();
    const newTotal = Math.max(0, currentTotal + goldChange);

    setShopkeeper((prev) => ({
      ...prev,
      availableMoney: formatCurrency(newTotal),
    }));
  };

  const getShopkeeperPersonality = (shopType, priceModifier) => {
    const refinement = getShopRefinement(priceModifier);

    const personalities = {
      alchemist: {
        refined: {
          mood: "analytical",
          hagglingStyle: "methodical",
          suspicion: "low",
        },
        humble: {
          mood: "enthusiastic",
          hagglingStyle: "eager",
          suspicion: "medium",
        },
        standard: {
          mood: "practical",
          hagglingStyle: "reasonable",
          suspicion: "low",
        },
      },
      blacksmith: {
        refined: {
          mood: "professional",
          hagglingStyle: "firm",
          suspicion: "low",
        },
        humble: {
          mood: "friendly",
          hagglingStyle: "flexible",
          suspicion: "medium",
        },
        standard: {
          mood: "straightforward",
          hagglingStyle: "honest",
          suspicion: "low",
        },
      },
      "general store": {
        refined: {
          mood: "courteous",
          hagglingStyle: "polished",
          suspicion: "medium",
        },
        humble: {
          mood: "welcoming",
          hagglingStyle: "generous",
          suspicion: "low",
        },
        standard: { mood: "helpful", hagglingStyle: "fair", suspicion: "low" },
      },
      "mystic goods": {
        refined: {
          mood: "mysterious",
          hagglingStyle: "cryptic",
          suspicion: "high",
        },
        humble: {
          mood: "curious",
          hagglingStyle: "intuitive",
          suspicion: "medium",
        },
        standard: {
          mood: "wise",
          hagglingStyle: "balanced",
          suspicion: "medium",
        },
      },
      "exotic goods": {
        refined: {
          mood: "sophisticated",
          hagglingStyle: "worldly",
          suspicion: "high",
        },
        humble: {
          mood: "adventurous",
          hagglingStyle: "spontaneous",
          suspicion: "low",
        },
        standard: {
          mood: "experienced",
          hagglingStyle: "shrewd",
          suspicion: "medium",
        },
      },
      jeweler: {
        refined: {
          mood: "discerning",
          hagglingStyle: "exacting",
          suspicion: "high",
        },
        humble: {
          mood: "passionate",
          hagglingStyle: "emotional",
          suspicion: "low",
        },
        standard: {
          mood: "careful",
          hagglingStyle: "precise",
          suspicion: "medium",
        },
      },
    };

    const shopTypeNorm = shopType.toLowerCase();
    return (
      personalities[shopTypeNorm]?.[refinement] ||
      personalities["general store"][refinement]
    );
  };

  // Filter items based on search query and category
  const getFilteredItems = () => {
    let items = getAllShopItems();

    // Filter by search query
    if (itemSearchQuery) {
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(itemSearchQuery.toLowerCase()) ||
          item.details?.toLowerCase().includes(itemSearchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedItemCategory !== "all") {
      items = items.filter((item) => {
        const categoryInfo = getCategoryForItem(item.name);
        return categoryInfo.category === selectedItemCategory;
      });
    }

    // Remove already added items
    items = items.filter(
      (item) => !sellingItems.find((selling) => selling.name === item.name)
    );

    return items.sort((a, b) => a.name.localeCompare(b.name));
  };

  // Combine and filter inventory
  const getCombinedInventory = () => {
    if (!shopkeeper) return [];

    const combined = [
      ...shopkeeper.commonItems.map((item) => ({ ...item, type: "common" })),
      ...shopkeeper.rareItems.map((item) => ({ ...item, type: "rare" })),
    ];

    // Filter by category
    const filtered =
      selectedCategory === "any"
        ? combined
        : combined.filter((item) => {
            const categoryInfo = getCategoryForItem(item.name);
            return categoryInfo.category === selectedCategory;
          });

    // Sort the filtered results
    return sortItems(filtered, inventorySort);
  };

  // Get sorted items
  // Get sorted items
  const [commonSort, setCommonSort] = useState("alpha");
  const [rareSort, setRareSort] = useState("alpha");
  const sortedCommon = shopkeeper
    ? sortItems(shopkeeper.commonItems, commonSort)
    : [];
  const sortedRare = shopkeeper
    ? sortItems(shopkeeper.rareItems, rareSort)
    : [];

  // Function to regenerate common items
  const regenerateCommonItems = () => {
    if (!shopkeeper) return;

    setFadeCommon(true);

    // Get inventory limits based on settlement size
    const limits = getInventoryLimits(settlementSize);

    // Generate new common items
    const newCommonItems = generateCommonItems(
      shopkeeper.shopType,
      shopkeeper.priceModifier,
      limits
    );

    // Update shopkeeper state
    setTimeout(() => {
      setShopkeeper({
        ...shopkeeper,
        commonItems: newCommonItems,
      });
      setFadeCommon(false);
    }, 300);
  };

  // Function to regenerate rare items
  const regenerateRareItems = () => {
    if (!shopkeeper) return;

    setFadeRare(true);

    // Get inventory limits based on settlement size
    const limits = getInventoryLimits(settlementSize);

    // Generate new rare items
    const newRareItems = generateRareItems(
      shopkeeper.shopType,
      shopkeeper.priceModifier,
      limits
    );

    // Update shopkeeper state
    setTimeout(() => {
      setShopkeeper({
        ...shopkeeper,
        rareItems: newRareItems,
      });
      setFadeRare(false);
    }, 300);
  };

  const handleWalkAwayLocked = () => {
    setSellingItems([]);
    // Keep lockout active - this is the key difference
    // setIsLockedOut(false); // DON'T reset this
    setApologyFee(apologyFee); // Keep the fee
    setRelationshipStatus("offended"); // Relationship stays damaged
    setShopkeeperMood("irritated");
    setIsHaggleReaction(true);
    setLockoutReason(
      `${
        shopkeeper.name.split(" ")[0]
      } refuses to do business until you pay the apology fee.`
    );
    setHaggleAttempts(3);
    const hagglingStyle = getHagglingStyle(settlementSize, shopkeeper.priceModifier);
setCurrentHaggleDC(10 + hagglingStyle.dcModifier);
    setHasTriedCharismaCheck(false); // Reset for next time
    setLastHaggleResult({
      roll: 0,
      total: 0,
      dc: 0,
      success: false,
      bonusPercent: 0,
      resultText: `You left without resolving the situation. ${
        shopkeeper.name.split(" ")[0]
      } will not do business with you until you pay the apology fee.`,
    });
  };

  // Helper function to close all dropdowns
  const closeAllDropdowns = () => {
    setIsDropdownOpen(false);
    setIsRaceDropdownOpen(false);
    setIsSettlementDropdownOpen(false);
    setIsShopTypeDropdownOpen(false);
    setIsCategoryDropdownOpen(false);
    setIsSortDropdownOpen(false);
    setIsCategoryFilterDropdownOpen(false);
    setIsCharismaDropdownOpen(false);
  };

  // Add these back to your main file:
  const getUniqueCategories = () => {
    const categories = new Set();
    getAllShopItems().forEach((item) => {
      const categoryInfo = getCategoryForItem(item.name);
      categories.add(categoryInfo.category);
    });
    return Array.from(categories).sort();
  };

  const getAvailableCategories = () => {
    if (!shopkeeper) return [];

    const combined = [...shopkeeper.commonItems, ...shopkeeper.rareItems];

    const categories = new Set<string>();
    combined.forEach((item) => {
      const categoryInfo = getCategoryForItem(item.name);
      categories.add(categoryInfo.category);
    });

    return Array.from(categories).sort();
  };

  // Lock shopkeeper toggle
  const [lockedShopkeeperIdentity, setLockedShopkeeperIdentity] =
    useState(null);

  const SellItemDisplay = ({ item, shopkeeper }) => {
    const marketValue = item.marketValue || parsePriceToGold(item.basePrice);
    const shopkeeperPrice = parsePriceToGold(
      item.shopkeeperPrice || item.adjustedPrice
    );
    const sellPrice = item.sellPrice * item.quantity;
    const sellRate = (item.sellPrice / marketValue) * 100;

    return (
      <div className="selling-item bg-stone-50 dark:bg-gray-600 rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium">
            {item.name} ×{item.quantity}
          </span>
          <span
            className="font-medium"
            dangerouslySetInnerHTML={{ __html: formatCurrency(sellPrice) }}
          ></span>
        </div>

        <div className="text-xs text-stone-600 dark:text-gray-300 space-y-1">
          <div className="flex justify-between">
            <span>Market value:</span>
            <span
              dangerouslySetInnerHTML={{ __html: formatCurrency(marketValue) }}
            ></span>
          </div>
          <div className="flex justify-between">
            <span>{shopkeeper.name.split(" ")[0]} sells for:</span>
            <span
              dangerouslySetInnerHTML={{
                __html: formatCurrency(shopkeeperPrice),
              }}
            ></span>
          </div>
          <div className="flex justify-between">
            <span>{shopkeeper.name.split(" ")[0]} buys for:</span>
            <span className="font-medium">
              {sellRate.toFixed(0)}% of market ({formatCurrency(item.sellPrice)}
              )
            </span>
          </div>
        </div>
      </div>
    );
  };

  const debugPricing = (item, shopkeeper) => {
    console.log("=== SELLING PRICE DEBUG ===");
    console.log("Item name:", item.name);
    console.log("Item.price:", item.price);
    console.log("Item.basePrice:", item.basePrice);
    console.log("Item.adjustedPrice:", item.adjustedPrice);
    console.log("Shopkeeper priceModifier:", shopkeeper.priceModifier);

    const parsedPrice = parsePriceToGold(item.price);
    const parsedBasePrice = parsePriceToGold(item.basePrice || item.price);

    console.log("Parsed item.price as gold:", parsedPrice);
    console.log("Parsed base price as gold:", parsedBasePrice);

    const buyRate = getShopkeeperBuyRate(
      shopkeeper.priceModifier,
      settlementSize
    );
    console.log("Shopkeeper buy rate:", buyRate);

    const sellPrice = calculateBuyPrice(parsedPrice, buyRate, 0);
    const sellPriceFromBase = calculateBuyPrice(parsedBasePrice, buyRate, 0);

    console.log("Sell price from item.price:", sellPrice);
    console.log("Sell price from base price:", sellPriceFromBase);
    console.log("========================");
  };

  // Effect to generate random shop on initial load
  useEffect(() => {
    const sizes = ["village", "town", "city"];
    const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
    setSettlementSize(randomSize);
    setSelectedPricingStyle("random");
    generateShopkeeper("random", randomSize, "random");
  }, []);

  // Add this useEffect to handle the dark class on the document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
      // Force a repaint
      document.documentElement.style.colorScheme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
    }

    // Debug logging
    console.log("Dark mode applied:", isDarkMode);
    console.log("HTML classes:", document.documentElement.className);
  }, [isDarkMode]);

  // Effect to generate new inventory on settlement selection
  useEffect(() => {
    if (shopkeeper && shopkeeper.shopDescriptionParts) {
      const limits = getInventoryLimits(settlementSize);
      const updatedCommon = generateCommonItems(
        shopkeeper.shopType,
        shopkeeper.priceModifier,
        limits
      );
      const updatedRare = generateRareItems(
        shopkeeper.shopType,
        shopkeeper.priceModifier,
        limits
      );

      // Only update the location part, preserve interior and texture
      const shopDescriptionData = generateShopDescription(
        shopkeeper.shopType,
        settlementSize,
        shopkeeper.priceModifier,
        {
          interior: shopkeeper.shopDescriptionParts.interior,
          texture: shopkeeper.shopDescriptionParts.texture,
          
        }
      );

      setShopkeeper({
        ...shopkeeper,
        commonItems: updatedCommon,
        rareItems: updatedRare,
        shopDescription: shopDescriptionData.fullDescription,
        shopDescriptionParts: {
          location: shopDescriptionData.location,
          interior: shopkeeper.shopDescriptionParts.interior,
          texture: shopkeeper.shopDescriptionParts.texture,
        },
      });
    }
  }, [settlementSize, shopkeeper?.shopType]);

  // Effect to close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".dropdown-wrapper") &&
        !event.target.closest(".relative")
      ) {
        setIsDropdownOpen(false);
        setIsRaceDropdownOpen(false);
        setIsSettlementDropdownOpen(false);
        setIsShopTypeDropdownOpen(false);
        setIsCategoryDropdownOpen(false);
        setIsSortDropdownOpen(false);
        setIsCategoryFilterDropdownOpen(false);
        setIsCharismaDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Add this useEffect to recalculate cart prices when charisma changes
  useEffect(() => {
    if (sellingItems.length > 0) {
      const updatedItems = sellingItems.map((item) => {
        const itemGoldValue = parsePriceToGold(item.basePrice || item.price);
        const newSellPrice = calculateBuyPrice(
          itemGoldValue,
          getShopkeeperBuyRate(shopkeeper.priceModifier, settlementSize),
          playerCharisma * 5
        );

        return {
          ...item,
          sellPrice: newSellPrice,
        };
      });

      setSellingItems(updatedItems);
    }
  }, [playerCharisma, shopkeeper?.priceModifier, settlementSize]); // Recalculate when any of these change

  return (
    <div className="min-h-screen pt-12 max-w-4xl mx-auto p-4 font-sans transition-colors bg-stone-200 dark:bg-gray-900">
      <TitleCard
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        setShopType={setShopType}
        setSettlementSize={setSettlementSize}
        generateShopkeeper={generateShopkeeper}
        setIsHaggleReaction={setIsHaggleReaction}
        setCurrentHaggleQuote={setCurrentHaggleQuote}
      />

      {shopkeeper && (
        <>
          <ShopkeeperCard
            shopkeeper={shopkeeper}
            settlementSize={settlementSize}
            selectedPricingStyle={selectedPricingStyle}
            isLocked={isLocked}
            isDropdownOpen={isDropdownOpen}
            isRaceDropdownOpen={isRaceDropdownOpen}
            isSettlementDropdownOpen={isSettlementDropdownOpen}
            isShopTypeDropdownOpen={isShopTypeDropdownOpen}
            closeAllDropdowns={closeAllDropdowns}
            setIsDropdownOpen={setIsDropdownOpen}
            setIsRaceDropdownOpen={setIsRaceDropdownOpen}
            setIsSettlementDropdownOpen={setIsSettlementDropdownOpen}
            setIsShopTypeDropdownOpen={setIsShopTypeDropdownOpen}
            setShopType={setShopType}
            setSettlementSize={setSettlementSize}
            setSelectedPricingStyle={setSelectedPricingStyle}
            setShopkeeper={setShopkeeper}
            generateShopkeeper={generateShopkeeper}
            regenerateNameForRace={regenerateNameForRace}
            toggleLock={toggleLock}
            getCurrentPricingText={getCurrentPricingText}
            replaceRefinementTitle={replaceRefinementTitle}
            hasRefinementElements={hasRefinementElements}
            regenerateDescriptionForPricing={regenerateDescriptionForPricing}
            generateShopDescription={generateShopDescription}
            generateMotto={generateMotto}
          />

{/* Tab Navigation */}
<div className="shopkeeper-card rounded-t-md border-b border-stone-300 shadow-md pt-6 px-6 !pb-0 mb-6 mb-0 bg-stone-100 dark:bg-gray-700 overflow-hidden">
  <div className="flex gap-4">
    <button
  onClick={() => setActiveTab('inventory')}
  className={`${buttonStyles.tab} ${
    activeTab === 'inventory'
      ? 'text-stone-700 dark:text-gray-200 border-b-2 border-stone-400 dark:border-gray-300'
      : 'text-stone-500 dark:text-gray-400 hover:text-stone-700 dark:hover:text-gray-200'
  }`}
>
      <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
        inventory_2
      </span>
      Shop Inventory
    </button>
    
    <button
      onClick={() => setActiveTab('selling')}
      className={`${buttonStyles.tab} ${
    activeTab === 'selling'
      ? 'dark:text-gray-200 border-b-2 border-stone-400 dark:border-gray-300'
      : 'text-stone-500 dark:text-gray-400 hover:text-stone-700 dark:hover:text-gray-200'
  }`}
>
      <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
        sell
      </span>
      Sell to Shop
    </button>
  </div>
</div>

          {/* Conditional Content */}
{activeTab === 'inventory' && (
  <InventorySection
    shopkeeper={shopkeeper}
    settlementSize={settlementSize}
    isDarkMode={isDarkMode}
    closeAllDropdowns={closeAllDropdowns}
    setShopkeeper={setShopkeeper}
    isCategoryDropdownOpen={isCategoryDropdownOpen}
    setIsCategoryDropdownOpen={setIsCategoryDropdownOpen}
    isSortDropdownOpen={isSortDropdownOpen}
    setIsSortDropdownOpen={setIsSortDropdownOpen}
  />
)}

{activeTab === 'selling' && (
  <SellingSection
    shopkeeper={shopkeeper}
    settlementSize={settlementSize}
    closeAllDropdowns={closeAllDropdowns}
    updateShopkeeper={setShopkeeper}  // ← Changed to setShopkeeper
    isCategoryFilterDropdownOpen={isCategoryFilterDropdownOpen}
    setIsCategoryFilterDropdownOpen={setIsCategoryFilterDropdownOpen}
    isCharismaDropdownOpen={isCharismaDropdownOpen}
    setIsCharismaDropdownOpen={setIsCharismaDropdownOpen}
    getHagglingStyle={getHagglingStyle}
  />
)}
        </>
      )}
    </div>
  );
}

export default ShopkeeperGenerator;
