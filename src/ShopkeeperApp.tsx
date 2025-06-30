import React, { useState, useEffect } from "react";
import "./styles/ShopkeeperApp.css";
import SellingSection from "./components/sellingSection";
import ShopkeeperCard from "./components/shopkeeperCard";
import { ShoppingCart, CartItem, PurchaseRecord } from './components/shoppingCart';
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
  getShopkeeperDescriptions,
  getPostHaggleDescription,
  getProcessedPostHaggleFailureDescription,
  getCartChangeReaction,
  getHaggleQuote,
  getHaggleResultType,
} from "./data/shopkeeperSellingDetails";

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

  // Buying system state

  const [buyingHaggleAttempts, setBuyingHaggleAttempts] = useState(3);
  const [buyingCurrentHaggleDC, setBuyingCurrentHaggleDC] = useState(10);
  const [buyingLastHaggleResult, setBuyingLastHaggleResult] = useState(null);
  const [buyingIsHaggling, setBuyingIsHaggling] = useState(false);
  const [recentPurchases, setRecentPurchases] = useState<PurchaseRecord[]>([]);
  const [buyingRelationshipStatus, setBuyingRelationshipStatus] = useState("reserved");
  const [buyingCritFailCount, setBuyingCritFailCount] = useState(0);
  const [buyingIsLockedOut, setBuyingIsLockedOut] = useState(false);
  const [buyingApologyFee, setBuyingApologyFee] = useState(0);
  const [buyingLockoutReason, setBuyingLockoutReason] = useState("");
  const [buyingHasTriedCharismaCheck, setBuyingHasTriedCharismaCheck] = useState(false);
  const [buyingHasHaggled, setBuyingHasHaggled] = useState(false);
  const [buyingLastHaggleWasSuccessful, setBuyingLastHaggleWasSuccessful] = useState(null);
  const [buyingIsCharismaDropdownOpen, setBuyingIsCharismaDropdownOpen] = useState(false);
    
  // Selling system state

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [playerMoney, setPlayerMoney] = useState(1000); // Default starting gold
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
  const [isCharismaDropdownOpen, setIsCharismaDropdownOpen] = useState(false);
  const [hasTriedCharismaCheck, setHasTriedCharismaCheck] = useState(false);
  const [relationshipStatus, setRelationshipStatus] = useState("reserved"); // "trusted", "neutral", "annoyed", "offended"
  const [critFailCount, setCritFailCount] = useState(0); // Track escalating penalties
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [apologyFee, setApologyFee] = useState(0);
  const [lockoutReason, setLockoutReason] = useState("");
  const [currentHaggleQuote, setCurrentHaggleQuote] = useState("");
  const [selectedMoodDesc, setSelectedMoodDesc] = useState("");
  const [selectedPersonalityDesc, setSelectedPersonalityDesc] = useState("");
  const [isCartChangeReaction, setIsCartChangeReaction] = useState(false);
  const [cartChangeDescription, setCartChangeDescription] = useState("");
  const [cartChangeQuote, setCartChangeQuote] = useState("");
  const [hasHaggled, setHasHaggled] = useState(false);
  const [lastHaggleWasSuccessful, setLastHaggleWasSuccessful] = useState(null);


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

  // Add cart management functions
const addToCart = (item: any) => {
  setCartItems(prev => {
    const existing = prev.find(cartItem => cartItem.name === item.name);
    if (existing) {
      return prev.map(cartItem =>
        cartItem.name === item.name
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
    } else {
// Enhanced function to parse complex currency HTML
const parseComplexCurrencyToGold = (currencyStr) => {
  if (!currencyStr) return 0;
  
  let total = 0;
  
  // Extract gold
  const goldMatch = currencyStr.match(/gold-icon[^>]*>poker_chip<\/span>(\d+)/);
  if (goldMatch) total += parseInt(goldMatch[1]);
  
  // Extract silver (convert to gold)
  const silverMatch = currencyStr.match(/silver-icon[^>]*>poker_chip<\/span>(\d+)/);
  if (silverMatch) total += parseInt(silverMatch[1]) / 10;
  
  // Extract copper (convert to gold)
  const copperMatch = currencyStr.match(/copper-icon[^>]*>poker_chip<\/span>(\d+)/);
  if (copperMatch) total += parseInt(copperMatch[1]) / 100;
  
  // If no HTML matches found, fall back to the original parsePriceToGold
  if (total === 0) {
    total = parsePriceToGold(currencyStr);
  }
  
  return total;
};

// Store calculation values using the enhanced parser
const itemGoldValue = parseComplexCurrencyToGold(item.adjustedPrice || item.price);
const baseGoldValue = parseComplexCurrencyToGold(item.basePrice || item.price);
return [...prev, {
  name: item.name,
  quantity: 1,
  level: item.level || "Common",
  price: item.price,
  adjustedPrice: item.adjustedPrice || item.price,
  basePrice: item.basePrice || item.price,
  priceValue: itemGoldValue,        // This should be 28.75 for your acid vial
  basePriceValue: baseGoldValue,    // This should also be properly calculated
  details: item.details
}];
    }
  });
};

const updateCartQuantity = (itemName: string, newQuantity: number) => {
  if (newQuantity <= 0) {
    removeFromCart(itemName);
    return;
  }
  setCartItems(prev =>
    prev.map(item =>
      item.name === itemName ? { ...item, quantity: newQuantity } : item
    )
  );
};

const removeFromCart = (itemName: string) => {
  setCartItems(prev => prev.filter(item => item.name !== itemName));
};

const clearCart = () => {
  setCartItems([]);
};

const completePurchase = () => {
  const total = cartItems.reduce((sum, item) => {
    const price = parsePriceToGold(item.adjustedPrice || item.price);
    return sum + (price * item.quantity);
  }, 0);
  
  if (playerMoney >= total) {
    setPlayerMoney(prev => prev - total);
    clearCart();
  }
};

const enhancedCompletePurchase = () => {
  const originalTotal = cartItems.reduce((sum, item) => {
    const price = parsePriceToGold(item.adjustedPrice || item.price);
    return sum + (price * item.quantity);
  }, 0);

  const finalTotal = cartItems.reduce((total, item) => {
  const basePrice = parsePriceToGold(item.adjustedPrice || item.price);
  const charismaMultiplier = Math.max(0.1, 1 - (playerCharisma * 0.05));
  const haggleMultiplier = Math.max(0.1, 1 - ((item.haggleBonus || 0) / 100));
  const finalPrice = Math.max(basePrice * 0.1, basePrice * charismaMultiplier * haggleMultiplier);
  return total + (finalPrice * item.quantity);
}, 0);
  
  if (playerMoney >= finalTotal) {
    // ✅ Create properly typed purchase record:
    const purchaseRecord: PurchaseRecord = {
      id: Date.now(),
      items: [...cartItems],
      originalTotal,
      finalTotal,
      charismaDiscount: playerCharisma * 5,
      haggleDiscount: cartItems.reduce((sum, item) => 
        sum + (item.haggleBonus || 0), 0
      ) / (cartItems.length || 1),
      timestamp: new Date()
    };

    setPlayerMoney(prev => prev - finalTotal);
    setRecentPurchases(prev => [purchaseRecord, ...prev.slice(0, 4)]);
    clearCart();
    
    // Reset haggling
    setBuyingHaggleAttempts(3);
    const hagglingStyle = getHagglingStyle(settlementSize, shopkeeper.priceModifier);
    setBuyingCurrentHaggleDC(10 + hagglingStyle.dcModifier);
    setBuyingLastHaggleResult(null);
  }
};

const getDisplayMood = (baseMood: string, charisma: number): string => {
  const moodScale = ["dismissive", "doubtful", "reserved", "open", "welcoming"];
  const currentIndex = moodScale.indexOf(baseMood);
  if (currentIndex === -1) return baseMood;

  let modifier = 0;
  if (charisma >= 3) modifier = Math.floor((charisma - 1) / 2);
  else if (charisma <= -3) modifier = Math.ceil((charisma + 1) / 2);

  const newIndex = Math.max(
    0,
    Math.min(moodScale.length - 1, currentIndex + modifier)
  );
  return moodScale[newIndex];
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

  const attemptBuyingHaggle = () => {
  if (buyingHaggleAttempts <= 0 || cartItems.length === 0 || buyingIsLockedOut) return;

  setBuyingIsHaggling(true);
  setBuyingHasHaggled(true);  // Track haggling occurred
  
  const roll = rollD20();
  const total = roll + playerCharisma;
  const success = total >= buyingCurrentHaggleDC;

  // Check for critical failure (natural 1) - MATCH SELLING EXACTLY
  if (roll === 1) {
    const fee = Math.floor(cartItems.reduce((total, item) => {
      const itemPrice = parsePriceToGold(item.adjustedPrice || item.price);
      return total + itemPrice * item.quantity;
    }, 0) * 0.15); // 15% of cart total (similar to selling's calculateApologyFee logic)
    
    setBuyingApologyFee(fee);
    setBuyingIsLockedOut(true);
    setBuyingCritFailCount((prev) => prev + 1);
    setBuyingRelationshipStatus("offended");
    setBuyingLockoutReason(`You've gravely insulted ${shopkeeper.name.split(" ")[0]}!`);

    setBuyingLastHaggleResult({
      roll,
      total,
      dc: buyingCurrentHaggleDC,
      success: false,
      bonusPercent: 0,
      resultText: `Critical failure! ${shopkeeper.name.split(" ")[0]} is deeply offended by your negotiation attempt.`,
    });
    setBuyingHaggleAttempts(buyingHaggleAttempts - 1);
    setTimeout(() => setBuyingIsHaggling(false), 1000);
    return;
  }

  let bonusPercent = 0;
  let resultText = "";
  let newRelationship = buyingRelationshipStatus;

  if (success) {
    const successMargin = total - buyingCurrentHaggleDC;

    // Check for critical success (natural 20) - MATCH SELLING
    if (roll === 20) {
      bonusPercent = 25;  // Higher discount for buying (vs 20% bonus for selling)
      resultText = `Critical success! ${shopkeeper.name.split(" ")[0]} is thoroughly impressed by your negotiation skills.`;
      newRelationship = buyingRelationshipStatus === "reserved" ? "neutral" : 
                       buyingRelationshipStatus === "neutral" ? "trusted" : buyingRelationshipStatus;
      setBuyingLastHaggleWasSuccessful(true);
    } else if (successMargin >= 10) {
      bonusPercent = 15;
      resultText = `Excellent haggling! ${shopkeeper.name.split(" ")[0]} is impressed.`;
      setBuyingLastHaggleWasSuccessful(true);
    } else if (successMargin >= 5) {
      bonusPercent = 10;
      resultText = `Good negotiation. ${shopkeeper.name.split(" ")[0]} nods approvingly.`;
      setBuyingLastHaggleWasSuccessful(true);
    } else {
      bonusPercent = 5;
      resultText = `Decent argument. ${shopkeeper.name.split(" ")[0]} considers your point.`;
      setBuyingLastHaggleWasSuccessful(true);
    }
  } else {
    // Failed haggle - MATCH SELLING'S PENALTY SYSTEM
    const failureMargin = buyingCurrentHaggleDC - total;
    if (failureMargin >= 10) {
      bonusPercent = -10; // Heavy penalty for bad failure
      resultText = `Poor attempt. ${shopkeeper.name.split(" ")[0]} is annoyed and raises prices.`;
      newRelationship = buyingRelationshipStatus === "trusted" ? "neutral" :
                       buyingRelationshipStatus === "neutral" ? "annoyed" : buyingRelationshipStatus;
    } else {
      bonusPercent = -5; // Light penalty for close failure
      resultText = `Nice try, but ${shopkeeper.name.split(" ")[0]} isn't convinced and raises prices slightly.`;
    }
    setBuyingLastHaggleWasSuccessful(false);
  }

  setBuyingLastHaggleResult({
    roll,
    total,
    dc: buyingCurrentHaggleDC,
    success,
    bonusPercent,
    resultText,
  });

  setBuyingHaggleAttempts((prev) => prev - 1);
  setBuyingCurrentHaggleDC((prev) => prev + 2);
  setBuyingRelationshipStatus(newRelationship);

  // Apply bonus/penalty to all cart items
  setCartItems((prev) =>
    prev.map((item) => ({
      ...item,
      haggleBonus: (item.haggleBonus || 0) + bonusPercent,
    }))
  );

  setTimeout(() => setBuyingIsHaggling(false), 1000);
};

  const resetHaggleState = () => {
  const hadHaggling = hasHaggled;
  const wasSuccessful = lastHaggleWasSuccessful;

  if (hadHaggling && sellingItems.length > 0) {
    const pronouns = getShopkeeperPronouns(shopkeeper.name);
    // You'll need to import getCartChangeReaction from shopkeeperSellingDetails
    
    setIsCartChangeReaction(true);
    setTimeout(() => {
      setIsCartChangeReaction(false);
      setCartChangeDescription("");
      setCartChangeQuote("");
    }, 4000);
  }

  setHaggleAttempts(3);
  const hagglingStyle = getHagglingStyle(settlementSize, shopkeeper.priceModifier);
  setCurrentHaggleDC(10 + hagglingStyle.dcModifier);
  setLastHaggleResult(null);
  setIsHaggleReaction(false);
  setCurrentHaggleQuote("");
  setHasHaggled(false);
  setLastHaggleWasSuccessful(null);
};

useEffect(() => {
  if (cartItems.length > 0) {
    setCartItems(prev => 
      prev.map(item => ({
        ...item,
        charismaBonus: playerCharisma * 5 // Update charisma bonus
      }))
    );
  }
}, [playerCharisma]);

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
  console.log('🔍 ShopkeeperApp addItemToSell called with:', item);
  console.log('🔍 Current sellingItems before update:', sellingItems);
  console.log('🔍 sellingItems length before:', sellingItems.length);

  setSellingItems((prev) => {
    console.log('🔍 setSellingItems called, prev:', prev);
    console.log('🔍 prev length:', prev.length);
    
    const existing = prev.find((selling) => selling.name === item.name);
    console.log('🔍 existing item found:', existing);
    
    if (existing) {
      const updated = prev.map((selling) =>
        selling.name === item.name
          ? { ...selling, quantity: selling.quantity + 1 }
          : selling
      );
      console.log('🔍 returning updated array (existing item):', updated);
      return updated;
    } else {
      // New item! Possibly improve mood
      if (shopkeeperMood === "irritated" && Math.random() > 0.5) {
        setShopkeeperMood("skeptical");
      } else if (shopkeeperMood === "skeptical" && Math.random() > 0.7) {
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

      const itemGoldValue = parsePriceToGold(item.adjustedPrice || item.price);

      const newItem = {
        ...item,
        quantity: 1,
        level: item.level || "Common",
        marketPrice: marketPrice, // Display this in cart
        marketValue: itemGoldValue, // Use this for calculations
        shopkeeperPrice: item.adjustedPrice || item.price, // What the shopkeeper sells it for
      };

      console.log('🔍 creating new item:', newItem);
      
      const newArray = [...prev, newItem];
      console.log('🔍 returning new array (new item):', newArray);
      console.log('🔍 new array length:', newArray.length);
      
      return newArray;
    }
  });
  
  console.log('🔍 setSellingItems call completed');
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

  useEffect(() => {
  if (!shopkeeper) return;

  const moodRoll = Math.random();
  let baseMood = "reserved";

  if (shopkeeper.priceModifier > 0.15) {
    baseMood = moodRoll > 0.7 ? "reserved" : moodRoll > 0.4 ? "doubtful" : "open";
  } else if (shopkeeper.priceModifier < -0.15) {
    baseMood = moodRoll > 0.5 ? "open" : moodRoll > 0.2 ? "welcoming" : "reserved";
  } else {
    baseMood = moodRoll > 0.6 ? "open" : moodRoll > 0.2 ? "reserved" : "welcoming";
  }

  const applyCharismaMoodModifier = (baseMood, charisma) => {
    const moodScale = ["dismissive", "doubtful", "reserved", "open", "welcoming"];
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

  const finalMood = applyCharismaMoodModifier(baseMood, playerCharisma);
  setShopkeeperMood(finalMood);
  setIsHaggleReaction(false);
}, [shopkeeper, playerCharisma]);

useEffect(() => {
  if (!shopkeeper) return;

  const pronouns = getShopkeeperPronouns(shopkeeper.name);
  
  // Use displayMood which includes charisma modifier
  const displayMood = getDisplayMood(shopkeeperMood, playerCharisma);

  const { moodDescription, personalityDescription } =
    getShopkeeperDescriptions(
      displayMood,
      shopkeeper.priceModifier,
      pronouns
    );

  setSelectedMoodDesc(moodDescription);
  setSelectedPersonalityDesc(personalityDescription);
}, [shopkeeperMood, shopkeeper, playerCharisma]);

useEffect(() => {
  if (!shopkeeper) return;

  // Only reset if shopkeeper identity actually changed
  const shopkeeperIdentity = `${shopkeeper.name}-${shopkeeper.shopType}`;
  if (shopkeeperIdentity === lockedShopkeeperIdentity) return;
  
  setLockedShopkeeperIdentity(shopkeeperIdentity);

  // Reset all haggling-related state to initial values
  setLastHaggleResult(null);
  setIsHaggleReaction(false);
  setCurrentHaggleQuote("");
  setHaggleAttempts(3);
  setHasTriedCharismaCheck(false);
  setRelationshipStatus("reserved");
  setCritFailCount(0);
  setIsLockedOut(false);
  setApologyFee(0);
  setLockoutReason("");
  setHasHaggled(false);
  setLastHaggleWasSuccessful(null);
  setIsCartChangeReaction(false);
  setCartChangeDescription("");
  setCartChangeQuote("");

  // Reset haggle DC to base value
  const hagglingStyle = getHagglingStyle(
    settlementSize,
    shopkeeper.priceModifier
  );
  setCurrentHaggleDC(10 + hagglingStyle.dcModifier);
}, [shopkeeper?.name, shopkeeper?.shopType, settlementSize, lockedShopkeeperIdentity]);

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

  // Haggling mechanics
  const handleBuyingApologyPayment = () => {
  if (playerMoney >= buyingApologyFee) {
    setPlayerMoney(prev => prev - buyingApologyFee);
    setBuyingIsLockedOut(false);
    setBuyingCritFailCount(0);
    setBuyingHaggleAttempts(3);
    resetBuyingHaggleState();
  }
};

const handleBuyingCharismaCheck = () => {
  if (buyingHasTriedCharismaCheck) return;
  setBuyingHasTriedCharismaCheck(true);
  const roll = Math.floor(Math.random() * 20) + 1;
  const total = roll + playerCharisma;
  if (total >= 15) {
    setBuyingIsLockedOut(false);
    setBuyingCritFailCount(0);
    setBuyingHaggleAttempts(2);
  }
};

const resetBuyingHaggleState = () => {
  setBuyingHaggleAttempts(3);
  const hagglingStyle = getHagglingStyle(settlementSize, shopkeeper.priceModifier);
  setBuyingCurrentHaggleDC(10 + hagglingStyle.dcModifier);
  setBuyingLastHaggleResult(null);
  setBuyingHasHaggled(false);
  setBuyingLastHaggleWasSuccessful(null);
};

const undoPurchase = (purchaseId) => {
  const purchase = recentPurchases.find(p => p.id === purchaseId);
  if (!purchase) return;
  setPlayerMoney(prev => prev + purchase.finalTotal);
  setRecentPurchases(prev => prev.filter(p => p.id !== purchaseId));
};


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
<div className="shopkeeper-card rounded-t-md border-b border-stone-300 shadow-md pt-6 px-6 !pb-0 mb-0 bg-stone-100 dark:bg-gray-700 overflow-hidden">
  <div className="flex gap-4">
    <button
      onClick={() => {
        setActiveTab('inventory');
        // Don't trigger any reactions when switching tabs
        setIsCartChangeReaction(false);
        setIsHaggleReaction(false);
      }}
      className={`${buttonStyles.tab} ${
        activeTab === 'inventory'
          ? 'text-stone-700 dark:text-gray-200 border-b-2 border-stone-400 dark:border-gray-300'
          : 'text-stone-500 dark:text-gray-400 hover:text-stone-700 dark:hover:text-gray-200'
      }`}
    >
      <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
        inventory_2
      </span>
      Buy From Shop
    </button>
    
    <button
      onClick={() => {
        setActiveTab('selling');
        // Don't trigger any reactions when switching tabs
        setIsCartChangeReaction(false);
        setIsHaggleReaction(false);
      }}
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
    shopkeeperMood={shopkeeperMood}
    playerCharisma={playerCharisma}
    getHagglingStyle={getHagglingStyle}
    isCartChangeReaction={isCartChangeReaction}
    cartChangeDescription={cartChangeDescription}
    cartChangeQuote={cartChangeQuote}
    isHaggleReaction={isHaggleReaction}
    buyingLastHaggleResult={buyingLastHaggleResult}
    currentHaggleQuote={currentHaggleQuote}
    selectedMoodDesc={selectedMoodDesc}
    selectedPersonalityDesc={selectedPersonalityDesc}
    cartItems={cartItems}
    playerMoney={playerMoney}
    onAddToCart={addToCart}
    onUpdateCartQuantity={updateCartQuantity}
    onRemoveFromCart={removeFromCart}
    onClearCart={clearCart}
    onCompletePurchase={completePurchase}
    onUpdatePlayerMoney={setPlayerMoney}
    buyingHaggleAttempts={buyingHaggleAttempts}
    buyingIsHaggling={buyingIsHaggling}
    recentPurchases={recentPurchases}
    onAttemptBuyingHaggle={attemptBuyingHaggle}
    buyingRelationshipStatus={buyingRelationshipStatus}
    setBuyingRelationshipStatus={setBuyingRelationshipStatus}
    buyingCritFailCount={buyingCritFailCount}
     setBuyingHaggleAttempts={setBuyingHaggleAttempts}
    setBuyingCurrentHaggleDC={setBuyingCurrentHaggleDC}
    setBuyingLastHaggleResult={setBuyingLastHaggleResult}
    setBuyingIsHaggling={setBuyingIsHaggling}
    buyingCurrentHaggleDC={buyingCurrentHaggleDC}
    setBuyingCritFailCount={setBuyingCritFailCount}
    buyingIsLockedOut={buyingIsLockedOut}
    setBuyingIsLockedOut={setBuyingIsLockedOut}
    buyingApologyFee={buyingApologyFee}
    setBuyingApologyFee={setBuyingApologyFee}
    buyingLockoutReason={buyingLockoutReason}
    setBuyingLockoutReason={setBuyingLockoutReason}
    buyingHasTriedCharismaCheck={buyingHasTriedCharismaCheck}
    setBuyingHasTriedCharismaCheck={setBuyingHasTriedCharismaCheck}
    buyingHasHaggled={buyingHasHaggled}
    setBuyingHasHaggled={setBuyingHasHaggled}
    buyingLastHaggleWasSuccessful={buyingLastHaggleWasSuccessful}
    setBuyingLastHaggleWasSuccessful={setBuyingLastHaggleWasSuccessful}
    buyingIsCharismaDropdownOpen={buyingIsCharismaDropdownOpen}
    setBuyingIsCharismaDropdownOpen={setBuyingIsCharismaDropdownOpen}
    onBuyingApologyPayment={handleBuyingApologyPayment}
    onBuyingCharismaCheck={handleBuyingCharismaCheck}
    resetBuyingHaggleState={resetBuyingHaggleState}
    onUndoPurchase={undoPurchase}

    calculateCartTotal={() => {
  console.log("=== CALCULATE BUYING CART TOTAL DEBUG ===");
  console.log("Cart items:", cartItems);

  // Use pre-calculated priceValue instead of re-parsing
  const baseTotalFromAdjustedPrices = cartItems.reduce((total, item) => {
    // Use priceValue if available, otherwise fall back to parsing
    const itemPriceGold = item.priceValue || parsePriceToGold(item.adjustedPrice || item.price || "0");
    const subtotal = itemPriceGold * item.quantity;
    console.log(`Item ${item.name}:`, {
      priceValue: item.priceValue,
      adjustedPrice: item.adjustedPrice,
      priceGold: itemPriceGold,
      quantity: item.quantity,
      subtotal: subtotal,
    });
    return total + subtotal;
  }, 0);

  console.log("Base total from adjusted prices:", baseTotalFromAdjustedPrices);

  // Apply charisma discount
  const charismaDiscountPercent = playerCharisma * 5;
  const charismaMultiplier = Math.max(0.1, 1 - (charismaDiscountPercent / 100));

  // Apply average haggle bonus/penalty
  const totalHaggleBonus = cartItems.reduce((sum, item) => {
    return sum + (item.haggleBonus || 0);
  }, 0);
  const avgHaggleBonus = cartItems.length > 0 ? totalHaggleBonus / cartItems.length : 0;
  const haggleMultiplier = Math.max(0.1, 1 - (avgHaggleBonus / 100));

  const finalMultiplier = charismaMultiplier * haggleMultiplier;
  const finalTotal = Math.max(
    baseTotalFromAdjustedPrices * 0.1,
    baseTotalFromAdjustedPrices * finalMultiplier
  );

  console.log("Final buying total:", finalTotal);
  return finalTotal;
}}
  
  calculateOriginalCartTotal={() => {
  return cartItems.reduce((total, item) => {
    // Use basePriceValue if available, otherwise fall back to parsing
    const originalPriceGold = item.basePriceValue || parsePriceToGold(item.basePrice || item.price || "0");
    return total + (originalPriceGold * item.quantity);
  }, 0);
}}
  />
)}

{activeTab === 'selling' && (
  <SellingSection
    shopkeeper={shopkeeper}
    settlementSize={settlementSize}
    closeAllDropdowns={closeAllDropdowns}
    updateShopkeeper={setShopkeeper}
    isCategoryFilterDropdownOpen={isCategoryFilterDropdownOpen}
    setIsCategoryFilterDropdownOpen={setIsCategoryFilterDropdownOpen}
    isCharismaDropdownOpen={isCharismaDropdownOpen}
    setIsCharismaDropdownOpen={setIsCharismaDropdownOpen}
    getHagglingStyle={getHagglingStyle}
    shopkeeperMood={shopkeeperMood}
    setShopkeeperMood={setShopkeeperMood}
    playerCharisma={playerCharisma}
    setPlayerCharisma={setPlayerCharisma}
    haggleAttempts={haggleAttempts}
    setHaggleAttempts={setHaggleAttempts}
    currentHaggleDC={currentHaggleDC}
    setCurrentHaggleDC={setCurrentHaggleDC}
    lastHaggleResult={lastHaggleResult}
    setLastHaggleResult={setLastHaggleResult}
    isHaggling={isHaggling}
    setIsHaggling={setIsHaggling}
    isHaggleReaction={isHaggleReaction}
    setIsHaggleReaction={setIsHaggleReaction}
    currentHaggleQuote={currentHaggleQuote}
    setCurrentHaggleQuote={setCurrentHaggleQuote}
    hasHaggled={hasHaggled}
    setHasHaggled={setHasHaggled}
    lastHaggleWasSuccessful={lastHaggleWasSuccessful}
    setLastHaggleWasSuccessful={setLastHaggleWasSuccessful}
    isCartChangeReaction={isCartChangeReaction}
    setIsCartChangeReaction={setIsCartChangeReaction}
    cartChangeDescription={cartChangeDescription}
    setCartChangeDescription={setCartChangeDescription}
    cartChangeQuote={cartChangeQuote}
    setCartChangeQuote={setCartChangeQuote}
    hasTriedCharismaCheck={hasTriedCharismaCheck}
    setHasTriedCharismaCheck={setHasTriedCharismaCheck}
    relationshipStatus={relationshipStatus}
    setRelationshipStatus={setRelationshipStatus}
    critFailCount={critFailCount}
    setCritFailCount={setCritFailCount}
    isLockedOut={isLockedOut}
    setIsLockedOut={setIsLockedOut}
    apologyFee={apologyFee}
    setApologyFee={setApologyFee}
    lockoutReason={lockoutReason}
    setLockoutReason={setLockoutReason}
    resetHaggleState={resetHaggleState}
    selectedMoodDesc={selectedMoodDesc}
    setSelectedMoodDesc={setSelectedMoodDesc}
    selectedPersonalityDesc={selectedPersonalityDesc}
    setSelectedPersonalityDesc={setSelectedPersonalityDesc}
    sellingItems={sellingItems}
    setSellingItems={setSellingItems}
    recentSales={recentSales}
    setRecentSales={setRecentSales}
    itemSearchQuery={itemSearchQuery}
    setItemSearchQuery={setItemSearchQuery}
    selectedItemCategory={selectedItemCategory}
    setSelectedItemCategory={setSelectedItemCategory}
    addItemToSell={addItemToSell}
    removeItemFromSell={removeItemFromSell}
    updateSellQuantity={updateSellQuantity}
    attemptHaggle={attemptHaggle}
    executeSale={executeSale}
    undoSale={undoSale}
    calculateSaleTotal={calculateSaleTotal}
    getTotalMarketValue={getTotalMarketValue}
    calculateShopTotalMoney={calculateShopTotalMoney}
    handleApologyPayment={handleApologyPayment}
    handleCharismaCheck={handleCharismaCheck}
    isSortDropdownOpen={isSortDropdownOpen}
    setIsSortDropdownOpen={setIsSortDropdownOpen}
    isDarkMode={isDarkMode}
    
    // ✅ ADD THESE CALLBACK PROPS (these map to the above functions):
    onUpdateQuantity={updateSellQuantity}
    onRemoveItem={removeItemFromSell}
    onExecuteSale={executeSale}
    onAttemptHaggle={attemptHaggle}
    onApologyPayment={handleApologyPayment}
    onCharismaCheck={handleCharismaCheck}
    onUndoSale={undoSale}
    
  />
)}
        </>
      )}
    </div>
  );
}

export default ShopkeeperGenerator;