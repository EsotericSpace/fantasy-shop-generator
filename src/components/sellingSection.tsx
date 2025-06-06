// components/SellingSection.tsx
import React, { useState, useEffect } from "react";
import { getShopkeeperDescriptions } from "../data/shopkeeperSellingDetails";
import { getHaggleQuote, getHaggleResultType } from "../data/shopkeeperSellingDetails";
import {
  getCategoryForItem,
  getIconForItem,
  getIconComponent,
  getRarityBadgeClass,
} from "../utils/helpers";
import {
  parsePriceToGold,
  formatCurrency,
  getShopkeeperBuyRate,
} from "../utils/pricing";
import { getShopkeeperPronouns } from "../utils/shopGeneration";
import { itemCategories } from "../data/itemCategories";
import { shopItems } from "../data/shopItems";
import {
  CastleTurretIcon,
  FarmIcon,
  HouseLineIcon,
  LockKeyIcon,
  LockKeyOpenIcon,
} from "@phosphor-icons/react";

// Define PhosphorIcon locally
const PhosphorIcon = ({ icon: Icon, weight = "thin", size = 20, ...props }) => (
  <Icon weight={weight} size={size} {...props} />
);

interface SellingItem {
  name: string;
  quantity: number;
  level: string;
  marketPrice: string;
  marketValue: number;
  shopkeeperPrice: string;
  haggleBonus?: number;
  price: string;
  basePrice?: string;
}

interface SaleRecord {
  id: number;
  items: SellingItem[];
  totalValue: number;
  charismaBonus: number;
  haggleBonus: number;
  timestamp: Date;
}

interface SellingSectionProps {
  shopkeeper: any;
  settlementSize: string;
  closeAllDropdowns: () => void;
  updateShopkeeper: (updatedShopkeeper: any) => void;
  isCategoryFilterDropdownOpen: boolean;
  setIsCategoryFilterDropdownOpen: (open: boolean) => void;
  isCharismaDropdownOpen: boolean;
  setIsCharismaDropdownOpen: (open: boolean) => void;
  getHagglingStyle: (settlementSize: string, priceModifier: number) => { name: string; dcModifier: number };
}

// Mood scale from worst to best
const moodScale = ["dismissive", "doubtful", "reserved", "open", "welcoming"];

// Apply persistent charisma modifier to any mood
const applyCharismaMoodModifier = (baseMood: string, charisma: number): string => {
  const currentIndex = moodScale.indexOf(baseMood);
  if (currentIndex === -1) return baseMood; // fallback if mood not found
  
  let modifier = 0;
  if (charisma >= 3) {
    // +3,+4 = +1 mood, +5,+6 = +2 mood, etc.
    modifier = Math.floor((charisma - 2) / 2);
  } else if (charisma <= -3) {
    // -3,-4 = -1 mood, -5,-6 = -2 mood, etc.
    modifier = Math.ceil((charisma + 2) / 2);
  }
  // charisma -2 to +2 = no modifier
  
  const newIndex = Math.max(0, Math.min(moodScale.length - 1, currentIndex + modifier));
  return moodScale[newIndex];
};

const getDisplayMood = (baseMood: string, charisma: number): string => {
  const moodScale = ["dismissive", "doubtful", "reserved", "open", "welcoming"];
  const currentIndex = moodScale.indexOf(baseMood);
  if (currentIndex === -1) return baseMood;
  
  let modifier = 0;
  if (charisma >= 3) modifier = Math.floor((charisma - 1) / 2);
  else if (charisma <= -3) modifier = Math.ceil((charisma + 1) / 2);
  
  const newIndex = Math.max(0, Math.min(moodScale.length - 1, currentIndex + modifier));
  return moodScale[newIndex];
};

// Helper to set mood with automatic charisma application
const setMoodWithCharisma = (
  baseMood: string, 
  charisma: number, 
  setShopkeeperMood: (mood: string) => void
) => {
  const adjustedMood = applyCharismaMoodModifier(baseMood, charisma);
  setShopkeeperMood(adjustedMood);
};

const SellingSection: React.FC<SellingSectionProps> = ({
  shopkeeper,
  settlementSize,
  closeAllDropdowns,
  isCategoryFilterDropdownOpen,
  setIsCategoryFilterDropdownOpen,
  isCharismaDropdownOpen,
  setIsCharismaDropdownOpen,
  getHagglingStyle,
  updateShopkeeper,
}) => {
  // Selling system state
  const [itemSearchQuery, setItemSearchQuery] = useState("");
  const [selectedItemCategory, setSelectedItemCategory] = useState("all");
  const [sellingItems, setSellingItems] = useState<SellingItem[]>([]);
  const [playerCharisma, setPlayerCharisma] = useState(0);
  const [haggleAttempts, setHaggleAttempts] = useState(3);
  const [currentHaggleDC, setCurrentHaggleDC] = useState(10);
  const [shopkeeperMood, setShopkeeperMood] = useState("reserved");
  const [lastHaggleResult, setLastHaggleResult] = useState<any>(null);
  const [recentSales, setRecentSales] = useState<SaleRecord[]>([]);
  const [isHaggling, setIsHaggling] = useState(false);
  const [isHaggleReaction, setIsHaggleReaction] = useState(false);
  const [currentHaggleQuote, setCurrentHaggleQuote] = useState<string>("");
  const [hasTriedCharismaCheck, setHasTriedCharismaCheck] = useState(false);
  const [relationshipStatus, setRelationshipStatus] = useState("reserved");
  const [critFailCount, setCritFailCount] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [apologyFee, setApologyFee] = useState(0);
  const [lockoutReason, setLockoutReason] = useState("");
  const [selectedMoodDesc, setSelectedMoodDesc] = useState("");
  const [selectedPersonalityDesc, setSelectedPersonalityDesc] = useState("");

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
  const getMarketPrice = (itemName: string) => {
    const allItems = Object.values(shopItems).flat();
    const originalItem = allItems.find(
      (item) => item.name.toLowerCase() === itemName.toLowerCase()
    );
    return originalItem ? originalItem.price : null;
  };

  // Get unique categories from all shop items
  const getUniqueCategories = () => {
    const categories = new Set();
    getAllShopItems().forEach((item) => {
      const categoryInfo = getCategoryForItem(item.name);
      categories.add(categoryInfo.category);
    });
    return Array.from(categories).sort();
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

  const addItemToSell = (item: any) => {
    setSellingItems((prev) => {
      const existing = prev.find((selling) => selling.name === item.name);
      if (existing) {
        return prev.map((selling) =>
          selling.name === item.name
            ? { ...selling, quantity: selling.quantity + 1 }
            : selling
        );
      } else {

        let marketPrice = item.price; // Start with item.price as default

        // First: try the basePrice from the item (should be the original market price)
        if (item.basePrice && item.basePrice !== item.adjustedPrice) {
          marketPrice = item.basePrice;
        }

        // Second: look up in the original database
        if (!marketPrice) {
          marketPrice = getMarketPrice(item.name) || item.price;
        }

        const itemGoldValue = parsePriceToGold(marketPrice);

        return [
          ...prev,
          {
            ...item,
            quantity: 1,
            level: item.level || "Common",
            marketPrice: marketPrice,
            marketValue: itemGoldValue,
            shopkeeperPrice: item.adjustedPrice || item.price,
          },
        ];
      }
    });
  };

  const removeItemFromSell = (itemName: string) => {
    setSellingItems((prev) => prev.filter((item) => item.name !== itemName));
  };

  const updateSellQuantity = (itemName: string, newQuantity: number) => {
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

  const calculateSaleTotal = () => {
    const totalMarketValue = sellingItems.reduce((sum, item) => {
      return sum + item.marketValue * item.quantity;
    }, 0);

    const shopRate = getShopkeeperBuyRate(
      shopkeeper.priceModifier,
      settlementSize
    );

    const charismaBonus = playerCharisma * 5;
    const effectiveRate = Math.min(0.8, shopRate + charismaBonus / 100);

    const totalHaggleBonus = sellingItems.reduce((sum, item) => {
      return sum + (item.haggleBonus || 0);
    }, 0);
    const avgHaggleBonus =
      sellingItems.length > 0 ? totalHaggleBonus / sellingItems.length : 0;

    const finalRate = Math.max(
      0.05,
      Math.min(0.95, effectiveRate + avgHaggleBonus / 100)
    );

    return totalMarketValue * finalRate;
  };

  const getTotalMarketValue = () => {
    return sellingItems.reduce((sum, item) => {
      return sum + item.marketValue * item.quantity;
    }, 0);
  };

  const calculateShopTotalMoney = () => {
    if (!shopkeeper?.availableMoney) return 0;

    const moneyStr = shopkeeper.availableMoney;
    let total = 0;

    const goldMatch = moneyStr.match(/gold-icon[^>]*>poker_chip<\/span>(\d+)/);
    if (goldMatch) total += parseInt(goldMatch[1]);

    const silverMatch = moneyStr.match(
      /silver-icon[^>]*>poker_chip<\/span>(\d+)/
    );
    if (silverMatch) total += parseInt(silverMatch[1]) / 10;

    const copperMatch = moneyStr.match(
      /copper-icon[^>]*>poker_chip<\/span>(\d+)/
    );
    if (copperMatch) total += parseInt(copperMatch[1]) / 100;

    return total;
  };

  const updateShopMoney = (goldChange: number) => {
    const currentTotal = calculateShopTotalMoney();
    const newTotal = Math.max(0, currentTotal + goldChange);

    updateShopkeeper({
      ...shopkeeper,
      availableMoney: formatCurrency(newTotal),
    });
  };

  const calculateApologyFee = () => {
    if (!shopkeeper || sellingItems.length === 0) return 0;

    let baseFee;
    switch (settlementSize) {
      case "village":
        baseFee = Math.floor(Math.random() * 26) + 25;
        break;
      case "town":
        baseFee = Math.floor(Math.random() * 26) + 50;
        break;
      case "city":
        baseFee = Math.floor(Math.random() * 26) + 75;
        break;
      default:
        baseFee = 50;
    }

    const refinement =
      shopkeeper.priceModifier > 0.15
        ? "refined"
        : shopkeeper.priceModifier < -0.15
        ? "humble"
        : "standard";
    if (refinement === "refined") {
      baseFee *= 2;
    } else if (refinement === "humble") {
      baseFee *= 0.5;
    }

    const cartValue = getTotalMarketValue();
    const cartPercentage = cartValue * (0.15 + Math.random() * 0.05);

    let finalFee = Math.max(baseFee, cartPercentage);

    if (critFailCount === 1) {
      finalFee *= 1.5;
    } else if (critFailCount >= 2) {
      finalFee *= 2;
    }

    return Math.round(finalFee);
  };

  const attemptHaggle = () => {
    if (haggleAttempts <= 0 || isLockedOut) return;

    setIsHaggling(true);
    const roll = rollD20();
    const total = roll + playerCharisma;
    const success = total >= currentHaggleDC;

    if (roll === 1) {
      const fee = calculateApologyFee();
      setApologyFee(fee);
      setIsLockedOut(true);
      setCritFailCount((prev) => prev + 1);
      setRelationshipStatus("offended");
      setShopkeeperMood("dismissive");

      const quote = getHaggleQuote('criticalFailure', shopkeeper.priceModifier);
      setCurrentHaggleQuote(quote);
      setIsHaggleReaction(true);

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

    let bonusPercent = 0;
    let resultText = "";
    let newMood = shopkeeperMood;
    let newRelationship = relationshipStatus;

    if (success) {
      const successMargin = total - currentHaggleDC;

      if (roll === 20) {
        bonusPercent = 20;
        resultText = `Critical success! ${
          shopkeeper.name.split(" ")[0]
        } is thoroughly impressed by your negotiation skills.`;
        newMood = "welcoming";
        newRelationship =
          relationshipStatus === "reserved" ? "trusted" : relationshipStatus;
      } else if (successMargin >= 10) {
        bonusPercent = 15;
        resultText = `Excellent haggling! ${
          shopkeeper.name.split(" ")[0]
        } is impressed.`;
        if (roll >= 18 || successMargin >= 15) {
          newMood =
            shopkeeperMood === "reserved"
              ? "open"
              : shopkeeperMood === "open"
              ? "welcoming"
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
          shopkeeperMood === "reserved" ||
          shopkeeperMood === "open" ||
          shopkeeperMood === "welcoming"
        ) {
          newMood = shopkeeperMood;
        } else {
          newMood =
            shopkeeperMood === "dismissive" ? "doubtful" : shopkeeperMood;
        }
      }
    } else {
      const failureMargin = currentHaggleDC - total;
      if (failureMargin >= 10) {
        bonusPercent = -10;
        resultText = `Poor attempt. ${
          shopkeeper.name.split(" ")[0]
        } is annoyed and lowers their offer.`;
        newMood = "dismissive";
        newRelationship =
          relationshipStatus === "trusted"
            ? "reserved"
            : relationshipStatus === "reserved"
            ? "annoyed"
            : relationshipStatus;
      } else {
        bonusPercent = -5;
        resultText = `Nice try, but ${
          shopkeeper.name.split(" ")[0]
        } isn't convinced and reduces their offer slightly.`;
        newMood =
          shopkeeperMood === "welcoming"
            ? "open"
            : shopkeeperMood === "open"
            ? "reserved"
            : shopkeeperMood === "reserved"
            ? "doubtful"
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

    const resultType = getHaggleResultType(roll, total, currentHaggleDC, success);
    const quote = getHaggleQuote(resultType, shopkeeper.priceModifier);
    setCurrentHaggleQuote(quote);
    setIsHaggleReaction(true);

    setHaggleAttempts((prev) => prev - 1);
    setCurrentHaggleDC((prev) => prev + 2);
    setShopkeeperMood(newMood);
    setRelationshipStatus(newRelationship);
    setIsHaggleReaction(true);

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

    if (totalValue >= 100) {
      setShopkeeperMood("welcoming");
    } else if (totalValue >= 50 || shopkeeperMood === "doubtful") {
      setShopkeeperMood("open");
    } else if (shopkeeperMood === "dismissive") {
      setShopkeeperMood("reserved");
    }

    setSellingItems([]);
    setHaggleAttempts(3);
    const hagglingStyle = getHagglingStyle(settlementSize, shopkeeper.priceModifier);
setCurrentHaggleDC(10 + hagglingStyle.dcModifier);
    setLastHaggleResult(null);
    setIsHaggleReaction(false);
  };

  const undoSale = (saleId: number) => {
    const sale = recentSales.find((s) => s.id === saleId);
    if (!sale) return;

    updateShopMoney(sale.totalValue);
    setRecentSales((prev) => prev.filter((s) => s.id !== saleId));
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
    setRelationshipStatus("reserved");
    setShopkeeperMood("reserved");
    setLockoutReason("");
    setHaggleAttempts(3);
    const hagglingStyle = getHagglingStyle(settlementSize, shopkeeper.priceModifier);
setCurrentHaggleDC(10 + hagglingStyle.dcModifier);
    setLastHaggleResult(null);
    setIsHaggleReaction(false);
    setHasTriedCharismaCheck(false);
  };

  const handleCharismaCheck = () => {
    if (hasTriedCharismaCheck) return;

    setHasTriedCharismaCheck(true);
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

// Initialize mood based on shopkeeper personality and charisma
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
  
  // Apply charisma modifier to base mood
  const finalMood = applyCharismaMoodModifier(baseMood, playerCharisma);
  setShopkeeperMood(finalMood);
  setIsHaggleReaction(false);
}, [shopkeeper]);

// Reset all haggling state when shopkeeper changes
useEffect(() => {
  if (!shopkeeper) return;
  
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
  
  // Reset haggle DC to base value
  const hagglingStyle = getHagglingStyle(settlementSize, shopkeeper.priceModifier);
  setCurrentHaggleDC(10 + hagglingStyle.dcModifier);
  
}, [shopkeeper?.name, shopkeeper?.shopType, settlementSize]);

useEffect(() => {
  if (!shopkeeper) return;
  
  const pronouns = getShopkeeperPronouns(shopkeeper.name);
  
  const { moodDescription, personalityDescription } = getShopkeeperDescriptions(
    shopkeeperMood,
    shopkeeper.priceModifier,
    pronouns
  );
  
  setSelectedMoodDesc(moodDescription);
  setSelectedPersonalityDesc(personalityDescription);
}, [shopkeeperMood, shopkeeper]); // Only update when mood or shopkeeper changes

  if (!shopkeeper) return null;

  return (
    <div className="shopkeeper-card rounded-md shadow-md p-6 mb-6 bg-stone-100 dark:bg-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-stone-600 dark:text-gray-300 cinzel shopkeeper-name m-0 leading-none">
            Sell to Shop
          </h3>
        </div>
      </div>

      {/* Shopkeeper Buying Info with Integrated Mood */}
      <div className="text-sm text-stone-600 dark:text-gray-300 border rounded-lg border-stone-300  p-4 mb-4">
        {(() => {
          const pronouns = getShopkeeperPronouns(shopkeeper.name);

           const displayMood = getDisplayMood(shopkeeperMood, playerCharisma);
          const {
            moodDescription: processedMoodDesc,
            personalityDescription: processedPersonalityDesc,
          } = getShopkeeperDescriptions(
            displayMood,
            shopkeeper.priceModifier,
            pronouns
          );

          return (
            <div className="space-y-2">
              {/* Top line: Icon + Name + Mood Badge */}
              <div className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "20px" }}
                >
                  person_raised_hand
                </span>
{/* Haggling Style Badge */}
<span
  className={`inline-flex items-center gap-1 px-2 text-[0.65rem] px-[0.4rem] py-[0.15rem] rounded-[3px] font-medium uppercase tracking-wide border border-blue-300 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300`}
>
  <span
    className="material-symbols-outlined text-blue-500 dark:text-blue-400"
    style={{ fontSize: "16px" }}
  >
    handshake
  </span>

  <span className="font-medium">
  {getHagglingStyle(settlementSize, shopkeeper.priceModifier).name}
</span>
</span>
                <span
                  className={`inline-flex items-center gap-1 px-2 text-[0.65rem] px-[0.4rem] py-[0.15rem] rounded-[3px] font-medium uppercase tracking-wide border ${
                    displayMood === "welcoming"
                      ? "border-green-300 bg-green-100 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-300"
                      : displayMood === "open"
                      ? "border-emerald-300 bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:border-emerald-700 dark:text-emerald-300"
                      : displayMood === "reserved"
                      ? "border-stone-300 bg-stone-100 text-stone-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                      : displayMood === "doubtful"
                      ? "border-amber-300 bg-amber-100 text-amber-700 dark:bg-amber-900 dark:border-amber-700 dark:text-amber-300"
                      : "border-red-300 bg-red-100 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-300"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined ${
                      displayMood === "welcoming"
                        ? "text-green-600 dark:text-green-400"
                        : displayMood === "open"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : displayMood === "reserved"
                        ? "text-stone-600 dark:text-gray-400"
                        : displayMood === "doubtful"
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                    style={{ fontSize: "16px" }}
                  >
                    {displayMood === "welcoming"
                      ? "sentiment_very_satisfied"
                      : displayMood === "open"
                      ? "sentiment_satisfied"
                      : displayMood === "reserved"
                      ? "sentiment_neutral"
                      : displayMood === "doubtful"
                      ? "sentiment_dissatisfied"
                      : "sentiment_very_dissatisfied"}
                  </span>

                  <span
                    className={`font-medium ${
                      displayMood === "welcoming" ||
                      displayMood === "open"
                        ? "text-green-600 dark:text-green-400"
                        : displayMood === "reserved"
                        ? "text-stone-600 dark:text-gray-00"
                        : displayMood === "doubtful"
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {displayMood === "welcoming"
                      ? "Welcoming"
                      : displayMood === "open"
                      ? "Open"
                      : displayMood === "reserved"
                      ? "Reserved"
                      : displayMood === "doubtful"
                      ? "Doubtful"
                      : "Dismissive"}
                  </span>
                </span>
              </div>

              {/* Bottom line: Description */}
              <div>
                <span className="text-stone-600 dark:text-gray-300 inter text-sm">
  {isHaggleReaction ? (
    // Show different content based on haggle result
    displayMood === "doubtful" || displayMood === "dismissive" ? (
      // Failed haggle: Show mood description + quote
      <>
        {shopkeeper.name.split(" ")[0]} {selectedMoodDesc}. 
        <span className="italic"> "{currentHaggleQuote}"</span>
      </>
    ) : (
      // Successful haggle: Show just the quote
      <span className="italic">"{currentHaggleQuote}"</span>
    )
  ) : (
    // Normal interaction: Show full description
    <>
      {shopkeeper.name.split(" ")[0]} {selectedMoodDesc}.
      {" "}
      <span className="capitalize">{pronouns.pronoun}</span>{" "}
      {selectedPersonalityDesc}.
    </>
  )}
</span>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Sale Details Section */}
      <div>
        {/* Search and Filter Controls */}
        <div className="px-4 py-3 bg-stone-100 dark:bg-gray-700 border-t border-x rounded-t-lg border-stone-300 dark:border-gray-500">
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search items"
                value={itemSearchQuery}
                onChange={(e) => setItemSearchQuery(e.target.value)}
                className="bg-stone-50 dark:bg-gray-700 border border-stone-200 dark:border-gray-600
                    text-stone-700 dark:text-gray-200 rounded-md px-3 py-1 text-sm
                    focus:outline-none focus:border-stone-500 dark:focus:border-gray-400 transition-colors"
              />
              {itemSearchQuery && (
                <button
                  onClick={() => setItemSearchQuery("")}
                  className="text-stone-400 hover:text-stone-600 dark:hover:text-gray-200"
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "16px" }}
                  >
                    close
                  </span>
                </button>
              )}

              <span className="whitespace-nowrap text-sm text-stone-600 dark:text-gray-300">
                sorted by
              </span>

              {/* Category Filter Dropdown */}
              <div className="relative inline-block">
                <button
                  onClick={() => {
                    closeAllDropdowns();
                    setIsCategoryFilterDropdownOpen(
                      !isCategoryFilterDropdownOpen
                    );
                  }}
                  className="bg-stone-100 dark:bg-gray-700 border border-stone-400 dark:border-gray-600 text-stone-600 dark:text-gray-300 text-xs 
                      font-medium inter uppercase tracking-wider rounded-md px-3 py-1 cursor-pointer 
                      hover:bg-stone-200 dark:hover:bg-gray-600 focus:outline-none focus:border-stone-600 dark:focus:border-stone-400 focus:ring-2 focus:ring-stone-600/10 dark:focus:ring-stone-400/10 
                      inline-flex items-center justify-between min-w-fit align-middle"
                >
                  <span className="flex items-center">
                    <span className="material-symbols-outlined mr-1 leading-none">
                      filter_list
                    </span>
                    {selectedItemCategory === "all"
                      ? "Any Category"
                      : itemCategories[selectedItemCategory as string]?.name ||
                        selectedItemCategory}
                  </span>
                  <span
                    className="material-symbols-outlined ml-2 leading-none"
                    style={{ fontSize: "16px" }}
                  >
                    {isCategoryFilterDropdownOpen
                      ? "expand_less"
                      : "expand_more"}
                  </span>
                </button>

                {isCategoryFilterDropdownOpen && (
                  <div className="dropdown-menu absolute z-10 mt-1 bg-stone-50 dark:bg-gray-700 border border-stone-300 dark:border-gray-600 rounded-lg shadow-lg">
                    <ul className="py-0.5 text-xs text-stone-700 dark:text-gray-300">
                      <li>
                        <button
                          onClick={() => {
                            closeAllDropdowns();
                            setSelectedItemCategory("all");
                            setIsCategoryFilterDropdownOpen(false);
                          }}
                          className={`block w-full text-left px-3 py-1.5 hover:bg-stone-100 dark:hover:bg-gray-600 text-stone-600 dark:text-gray-300 font-medium inter uppercase tracking-wider ${
                            selectedItemCategory === "all"
                              ? "bg-stone-100 dark:bg-gray-600"
                              : ""
                          }`}
                        >
                          <span className="flex items-center">
                            <span className="material-symbols-outlined shop-icon text-stone-400 mr-1">
                              all_inclusive
                            </span>
                            Any Category
                          </span>
                        </button>
                      </li>
                      {getUniqueCategories().map((category) => {
                        const categoryData = itemCategories[category as string];
                        return (
                          <li key={category}>
                            <button
                              onClick={() => {
                                closeAllDropdowns();
                                setSelectedItemCategory(category);
                                setIsCategoryFilterDropdownOpen(false);
                              }}
                              className={`block w-full text-left px-3 py-1.5 hover:bg-stone-100 dark:hover:bg-gray-600 text-stone-600 dark:text-gray-300 font-medium inter uppercase tracking-wider ${
                                selectedItemCategory === category
                                  ? "bg-stone-100 dark:bg-gray-600"
                                  : ""
                              }`}
                            >
                              <span className="flex items-center">
                                {(() => {
                                  const icon = categoryData?.icon;
                                  if (typeof icon === "string") {
                                    return (
                                      <span className="material-symbols-outlined shop-icon text-stone-400 mr-1">
                                        {icon}
                                      </span>
                                    );
                                  } else if (icon) {
                                    return (
                                      <PhosphorIcon
                                        icon={icon}
                                        weight="regular"
                                        className="shop-icon text-stone-400 mr-1"
                                      />
                                    );
                                  } else {
                                    return (
                                      <span className="material-symbols-outlined shop-icon text-stone-400 mr-1">
                                        help_outline
                                      </span>
                                    );
                                  }
                                })()}
                                {categoryData?.name || category}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Add Item Search & Selection */}
        <div className="bg-stone-50 dark:bg-gray-600 rounded-b-lg border border-stone-300 dark:border-gray-500 overflow-hidden flex flex-col h-80">
          {/* Filtered Items List */}
          <div className="flex-1 overflow-y-auto pt-2 pl-2 pr-2 space-y-1">
            {getFilteredItems().length > 0 ? (
              getFilteredItems().map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between pr-4 pl-4 pt-2 pb-2 rounded hover:bg-stone-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-2 flex-1">
                    {/* Item Icon */}
                    <div className="flex-shrink-0">
                      {(() => {
                        const iconValue = getIconForItem(item.name);
                        const IconComponent = getIconComponent(item.name);

                        if (iconValue === "phosphor") {
                          return (
                            <PhosphorIcon
                              icon={IconComponent}
                              size={20}
                              className="text-stone-600 dark:text-gray-400"
                            />
                          );
                        } else {
                          return (
                            <span
                              className="material-symbols-outlined text-stone-600 dark:text-gray-400"
                              style={{ fontSize: "20px" }}
                            >
                              {iconValue}
                            </span>
                          );
                        }
                      })()}
                    </div>

                    {/* Item Name and Price */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-stone-600 dark:text-gray-200 leading-relaxed">
                          {item.name}
                        </span>
                        <span
                          className={getRarityBadgeClass(
                            item.level || "Common"
                          )}
                        >
                          {item.level || "Common"}
                        </span>
                        <span
                          className="text-xs text-stone-500 dark:text-gray-400"
                          dangerouslySetInnerHTML={{
                            __html: formatCurrency(
                              parsePriceToGold(item.price)
                            ),
                          }}
                        ></span>
                      </div>
                    </div>

                    {/* Add Button */}
                    <button
                      onClick={() => addItemToSell(item)}
                      disabled={sellingItems.find(
                        (selling) => selling.name === item.name
                      )}
                      className="text-stone-500 disabled:text-stone-300 dark:disabled:text-gray-400 text-xs
                   transition-colors disabled:cursor-not-allowed"
                    >
                      {sellingItems.find(
                        (selling) => selling.name === item.name
                      ) ? (
                        "Added"
                      ) : (
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: "24px" }}
                        >
                          add_circle
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-stone-500 dark:text-gray-400 text-sm">
                {itemSearchQuery
                  ? "No items match your search"
                  : "No items available"}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Current Cart */}

      <div className="overflow-visible">
        {/* Cart Items */}
        {sellingItems.length > 0 && (
          <div className="pt-4 pb-2">
            <div className="px-4 py-3 bg-stone-50 dark:bg-gray-700 border-t border-x rounded-t-lg border-stone-300 dark:border-gray-500">
              <div className="flex-1 overflow-y-auto pt-2 space-y-1">
                {sellingItems.length > 0 &&
                  sellingItems.map((item, index) => (
                    <div
                      key={`${item.name}-${index}`}
                      className="flex items-center justify-between bg-stone-50 dark:bg-gray-600
                    hover:bg-stone-100 dark:hover:bg-gray-500 rounded-lg p-2"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {/* Item Icon */}
                        <div className="flex-shrink-0">
                          {(() => {
                            const iconValue = getIconForItem(item.name);
                            const IconComponent = getIconComponent(item.name);

                            if (iconValue === "phosphor") {
                              return (
                                <PhosphorIcon
                                  icon={IconComponent}
                                  size={20}
                                  className="text-stone-500 dark:text-gray-400"
                                />
                              );
                            } else {
                              return (
                                <span
                                  className="material-symbols-outlined text-stone-500 dark:text-gray-400"
                                  style={{ fontSize: "20px" }}
                                >
                                  {iconValue}
                                </span>
                              );
                            }
                          })()}
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-stone-700 dark:text-gray-200 truncate">
                              {item.name}
                            </span>
                            <span className={getRarityBadgeClass(item.level)}>
                              {item.level}
                            </span>
                            <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-gray-400">
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: formatCurrency(
                                    parsePriceToGold(item.price)
                                  ),
                                }}
                              ></span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1 bg-stone-50 dark:bg-gray-700 rounded-md border border-stone-300 p-1">
                          <button
                            onClick={() =>
                              updateSellQuantity(item.name, item.quantity - 1)
                            }
                            className="w-4 h-4 rounded text-sm flex items-center justify-center transition-colors
                       text-stone-600 dark:text-gray-300 font-medium"
                          >
                            −
                          </button>
                          <span className="w-4 text-center text-sm font-semibold text-stone-600 dark:text-gray-200">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateSellQuantity(item.name, item.quantity + 1)
                            }
                            className="w-4 h-4 rounded text-sm flex items-center justify-center transition-colors
                       text-stone-600 dark:text-gray-300 font-medium"
                          >
                            +
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItemFromSell(item.name)}
                          className="flex items-center gap-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300
                     text-xs px-1 py-1 rounded transition-all duration-200 font-medium"
                        >
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: "24px" }}
                          >
                            delete
                          </span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Sale Total and Controls */}
            <div className="rounded-b-lg border border-stone-300 dark:border-gray-500 pt-4">
              <div className="rounded-lg px-4">
                {/* Lockout Display */}
                {isLockedOut && (
                  <div className="mb-4 p-4 rounded-lg border bg-red-50 border-red-300 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-300">
                    <div className="flex items-start">
                      <span className="material-symbols-outlined mr-2 mt-0.5">
                        block
                      </span>
                      <div className="flex-1">
                        <p className="font-medium mb-2">{lockoutReason}</p>
                        <p className="text-sm mb-3">
                          {shopkeeper.name.split(" ")[0]} refuses to negotiate
                          further and demands an apology fee of{" "}
                          <span
                            className="font-bold"
                            dangerouslySetInnerHTML={{
                              __html: formatCurrency(apologyFee),
                            }}
                          ></span>{" "}
                          to restore relations.
                        </p>

                        <div className="space-y-2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <button
                              onClick={handleApologyPayment}
                              disabled={calculateShopTotalMoney() < apologyFee}
                              className="px-3 py-2 bg-green-100 border border-green-400 hover:bg-green-200 
                                     disabled:bg-stone-200 dark:disabled:bg-gray-600
                                     text-green-700 disabled:text-stone-500 dark:disabled:text-gray-400 
                                     text-sm rounded transition-colors disabled:cursor-not-allowed"
                            >
                              Pay Apology Fee
                            </button>

                            <button
                              onClick={handleCharismaCheck}
                              disabled={hasTriedCharismaCheck}
                              className="px-3 py-2 bg-blue-100 border border-blue-400 hover:bg-blue-200 
                                    disabled:bg-stone-200 dark:disabled:bg-gray-600
                                    text-blue-700 disabled:text-stone-500 dark:disabled:text-gray-400 
                                    text-sm rounded transition-colors disabled:cursor-not-allowed"
                            >
                              {hasTriedCharismaCheck
                                ? "Already Attempted"
                                : "Charisma Check (DC 15)"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Haggle Result Display */}
                {lastHaggleResult && (
                  <div
                    className={`mb-4 p-3 rounded-lg border ${
                      lastHaggleResult.success
                        ? "bg-green-50 border-green-300 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-300"
                        : lastHaggleResult.bonusPercent < 0
                        ? "bg-orange-50 border-orange-300 text-orange-700 dark:bg-orange-900 dark:border-orange-700 dark:text-orange-300"
                        : "bg-red-50 border-red-300 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-300"
                    }`}
                  >
                    <div className="flex items-start">
                      <span className="material-symbols-outlined mr-2 mt-0.5">
                        {lastHaggleResult.success
                          ? "thumb_up"
                          : lastHaggleResult.bonusPercent < 0
                          ? "trending_down"
                          : "thumb_down"}
                      </span>
                      <div>
                        <p className="font-medium mb-1">
                          {lastHaggleResult.resultText}
                        </p>
                        <p className="text-sm">
                          Roll: {lastHaggleResult.roll} + {playerCharisma} ={" "}
                          {lastHaggleResult.total} vs DC {lastHaggleResult.dc}
                          {lastHaggleResult.success &&
                            lastHaggleResult.bonusPercent > 0 && (
                              <span className="ml-2 font-medium text-green-600 dark:text-green-400">
                                +{lastHaggleResult.bonusPercent}% bonus!
                              </span>
                            )}
                          {!lastHaggleResult.success &&
                            lastHaggleResult.bonusPercent < 0 && (
                              <span className="ml-2 font-medium text-orange-600 dark:text-orange-400">
                                {lastHaggleResult.bonusPercent}% penalty!
                              </span>
                            )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {sellingItems.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between pl-2 pr-2 text-sm font-medium text-stone-500 dark:text-gray-300">
                      <span className="text-stone-600 dark:text-gray-300">
                        Base Price
                      </span>
                      <span
                        className="font-medium text-stone-700 dark:text-gray-200"
                        dangerouslySetInnerHTML={{
                          __html: formatCurrency(getTotalMarketValue()),
                        }}
                      ></span>
                    </div>
                    <div className="flex items-center justify-between pl-2 pr-2 text-sm text-stone-500 dark:text-gray-300">
                      <span className="text-stone-600 dark:text-gray-300">
                        {shopkeeper?.name?.split(" ")[0] || "Shopkeeper"}'s Rate
                      </span>
                      <span className="text-stone-600 dark:text-gray-300">
                        {Math.round(
                          getShopkeeperBuyRate(
                            shopkeeper?.priceModifier || 0,
                            settlementSize
                          ) * 100
                        )}
                        %
                      </span>
                    </div>
                    <div className="flex items-center justify-between pl-2 pr-2 text-sm text-stone-500 dark:text-gray-300">
                      <div className="flex items-center gap-4">
                        <span className="text-stone-600 dark:text-gray-300">
                          Charisma Modifier
                        </span>
                        <div className="flex items-center border border-stone-400 dark:border-gray-600 rounded-md">
                          <button
                            onClick={() =>
                              setPlayerCharisma(
                                Math.max(-5, playerCharisma - 1)
                              )
                            }
                            disabled={playerCharisma <= -5}
                            className="px-1 flex items-center text-stone-600 dark:text-gray-300 hover:bg-stone-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-l-md"
                          >
                            <span
                              className="material-symbols-outlined"
                              style={{ fontSize: "16px" }}
                            >
                              remove
                            </span>
                          </button>

                          <div className="px-2 text-md font-medium text-stone-600 dark:text-gray-300 text-center">
                            {playerCharisma >= 0
                              ? `${playerCharisma}`
                              : playerCharisma}
                          </div>

                          <button
                            onClick={() =>
                              setPlayerCharisma(Math.min(5, playerCharisma + 1))
                            }
                            disabled={playerCharisma >= 5}
                            className="px-1 flex items-center text-stone-600 dark:text-gray-300 hover:bg-stone-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-r-md"
                          >
                            <span
                              className="material-symbols-outlined"
                              style={{ fontSize: "16px" }}
                            >
                              add
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-stone-600 dark:text-gray-300">
                          {playerCharisma > 0 ? "+" : ""}
                          {playerCharisma * 5}%
                        </span>
                      </div>
                    </div>
                    {/* Display haggle bonus/penalty if any item has one */}
                    {sellingItems.some(
                      (item) => (item.haggleBonus || 0) !== 0
                    ) && (
                      <div className="flex items-center justify-between pl-2 pr-2 text-sm text-stone-500 dark:text-gray-300">
                        <span className="text-stone-600 dark:text-gray-300">
                          {(() => {
                            const maxBonus = Math.max(
                              ...sellingItems.map(
                                (item) => item.haggleBonus || 0
                              )
                            );
                            const minBonus = Math.min(
                              ...sellingItems.map(
                                (item) => item.haggleBonus || 0
                              )
                            );

                            if (maxBonus > 0 && minBonus >= 0) {
                              return "Haggle Bonus:";
                            } else if (maxBonus <= 0 && minBonus < 0) {
                              return "Haggle Penalty:";
                            } else {
                              return "Haggle Net:";
                            }
                          })()}
                        </span>
                        <span
                          className={`${(() => {
                            const netBonus =
                              sellingItems.reduce(
                                (sum, item) => sum + (item.haggleBonus || 0),
                                0
                              ) / sellingItems.length;
                            return netBonus >= 0
                              ? "text-green-600 dark:text-green-400"
                              : "text-orange-600 dark:text-orange-400";
                          })()}`}
                        >
                          {(() => {
                            const totalBonus = sellingItems.reduce(
                              (sum, item) => sum + (item.haggleBonus || 0),
                              0
                            );
                            const avgBonus = totalBonus / sellingItems.length;
                            return avgBonus >= 0
                              ? `+${avgBonus.toFixed(1)}%`
                              : `${avgBonus.toFixed(1)}%`;
                          })()}
                        </span>
                      </div>
                    )}
                    <div className="border-t pl-2 pr-2 border-stone-300 dark:border-gray-500 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-stone-700 dark:text-gray-300">
                          Total
                        </span>
                        <span
                          className="font-semibold text-lg text-stone-700 dark:text-stone-400"
                          dangerouslySetInnerHTML={{
                            __html: formatCurrency(calculateSaleTotal()),
                          }}
                        ></span>
                      </div>
                      <div className="till-display">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-stone-500 dark:text-gray-300">
                            Shop Treasury After Sale
                          </span>
                          <span className="text-sm text-stone-500 dark:text-gray-300"></span>
                          <div
                            className={`till-amount font-medium ${(() => {
                              if (sellingItems.length === 0 || isLockedOut) {
                                return "text-stone-600 dark:text-gray-300";
                              }
                              const saleTotal = calculateSaleTotal();
                              const shopMoney = calculateShopTotalMoney();
                              return saleTotal > shopMoney
                                ? "text-red-600 dark:text-red-400"
                                : "text-green-600 dark:text-green-400";
                            })()}`}
                            dangerouslySetInnerHTML={{
                              __html: shopkeeper?.availableMoney || "",
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {sellingItems.length > 0 && (
          <div className="flex gap-4 mt-4">
            {/* Complete Sale Button */}
            <button
              onClick={executeSale}
              disabled={(() => {
                if (sellingItems.length === 0 || isLockedOut) return true;
                const saleTotal = calculateSaleTotal();
                const shopMoney = calculateShopTotalMoney();
                return saleTotal > shopMoney;
              })()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 
                      bg-green-200 dark:bg-green-800 border border-green-400 dark:border-green-600 
                      hover:bg-green-300 dark:hover:bg-green-700 hover:border-green-500 dark:hover:border-green-500
                      disabled:bg-stone-300 dark:disabled:bg-gray-600 disabled:border-stone-400 dark:disabled:border-gray-500
                      text-green-800 dark:text-green-200 disabled:text-stone-500 dark:disabled:text-gray-400 
                     text-xs font-medium inter uppercase tracking-wider rounded-md px-3 py-1 cursor-pointer transition-all duration-200 disabled:cursor-not-allowed
                      shadow-sm hover:shadow-md disabled:shadow-none"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "18px" }}
              >
                {(() => {
                  if (isLockedOut) return "block";
                  if (sellingItems.length === 0) return "block";
                  const saleTotal = calculateSaleTotal();
                  const shopMoney = calculateShopTotalMoney();
                  if (saleTotal > shopMoney) return "money_off";
                  return "sell";
                })()}
              </span>
              {(() => {
                if (isLockedOut) return "Selling Locked";
                if (sellingItems.length === 0) return "Complete Sale";
                const saleTotal = calculateSaleTotal();
                const shopMoney = calculateShopTotalMoney();
                if (saleTotal > shopMoney) return "Insufficient Funds";
                return "Complete Sale";
              })()}
            </button>

            {/* Haggle Button */}
            <button
              onClick={attemptHaggle}
              disabled={
                sellingItems.length === 0 ||
                haggleAttempts <= 0 ||
                isHaggling ||
                isLockedOut
              }
              className={`flex-none flex items-center justify-center gap-2 px-4 py-3 
                    ${
                      isLockedOut
                        ? "bg-red-100 dark:bg-red-700 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400"
                        : "bg-stone-100 dark:bg-gray-700 border border-stone-400 dark:border-gray-600 text-stone-400 dark:text-gray-200"
                    }
                    bg-stone-100 dark:bg-gray-700 border border-stone-400 dark:border-gray-600 text-stone-600 dark:text-gray-300 text-xs 
                      font-medium inter uppercase tracking-wider rounded-md px-3 py-1 cursor-pointer 
                      hover:bg-stone-200 dark:hover:bg-gray-600 focus:outline-none focus:border-stone-600 dark:focus:border-stone-400 focus:ring-2 focus:ring-stone-600/10 dark:focus:ring-stone-400/10 transition-all duration-200 disabled:cursor-not-allowed
                    shadow-sm hover:shadow-md disabled:shadow-none ${
                      isHaggling ? "animate-pulse" : ""
                    }`}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "18px" }}
              >
                {isLockedOut ? "block" : "handshake"}
              </span>
              {isLockedOut
                ? "Relations Damaged"
                : `Haggle (${haggleAttempts} left)`}
            </button>
          </div>
        )}
      </div>

      {/* Recent Sales */}
      {recentSales.length > 0 && (
        <div className="rounded-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-stone-600 dark:text-gray-300 inter shopkeeper-name mb-4">
            Recent Sales
          </h3>

          <div className="space-y-3">
            {recentSales.map((sale) => (
              <div
                key={sale.id}
                className="flex items-center justify-between bg-stone-200 dark:bg-gray-600 rounded-lg p-2"
              >
                <div className="flex-1">
                  <div className="text-sm font-medium text-stone-600 dark:text-gray-200 mb-1">
                    {sale.items
                      .map((item) => `${item.name} ×${item.quantity}`)
                      .join(", ")}
                  </div>
                  <div className="text-xs text-stone-500 dark:text-gray-400">
                    {sale.timestamp.toLocaleTimeString()}
                    {sale.charismaBonus > 0 && (
                      <span> • +{sale.charismaBonus}% charisma</span>
                    )}
                    {sale.haggleBonus > 0 && (
                      <span> • +{sale.haggleBonus}% haggled</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className="text-sm font-medium text-stone-600 dark:text-gray-200"
                    dangerouslySetInnerHTML={{
                      __html: formatCurrency(sale.totalValue),
                    }}
                  ></span>
                  <button
                    onClick={() => undoSale(sale.id)}
                    className="text-red-500 hover:text-red-700 text-xs px-2 py-1 border border-red-300 
                   hover:border-red-500 rounded transition-colors"
                  >
                    Undo
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SellingSection;
