import React, { useState, useEffect } from "react";
import "./styles/ShopkeeperApp.css";
import SellingSection from "./components/sellingSection";
import ShopkeeperCard from "./components/shopkeeperCard";
import { CartItem, PurchaseRecord } from "./components/shoppingCart";
import InventorySection from "./components/inventorySection";
import TitleCard from "./components/titleCard";
import { buttonStyles } from "./styles/buttonStyles";
import { useShopkeeper } from "./hooks/useShopkeeper";
import { shopItems } from "./data/shopItems.ts";
import {
  parsePriceToGold,
  formatCurrency,
  calculateBuyPrice,
  getShopkeeperBuyRate,
} from "./utils/pricing";
import {
  getShopkeeperPronouns,
  getShopRefinement,
  generateMotto,
  generateShopDescription,
  getInventoryLimits,
  generateCommonItems,
  generateRareItems,
} from "./utils/shopGeneration";

import { getShopkeeperDescriptions } from "./data/shopkeeperSellingDetails";
import { getHagglingStyle } from "./helpers/getHagglingStyle.ts";
import { getDisplayMood } from "./helpers/getDisplayMood.ts";

function ShopkeeperGenerator() {
  const {
    shopkeeper,
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

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRaceDropdownOpen, setIsRaceDropdownOpen] = useState(false);
  const [isSettlementDropdownOpen, setIsSettlementDropdownOpen] =
    useState(false);
  const [activeTab, setActiveTab] = useState("inventory"); // 'inventory' or 'selling'
  const [isShopTypeDropdownOpen, setIsShopTypeDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Buying system state

  const [buyingHaggleAttempts, setBuyingHaggleAttempts] = useState(3);
  const [buyingCurrentHaggleDC, setBuyingCurrentHaggleDC] = useState(10);
  const [buyingLastHaggleResult, setBuyingLastHaggleResult] = useState(null);
  const [buyingIsHaggling, setBuyingIsHaggling] = useState(false);
  const [recentPurchases, setRecentPurchases] = useState<PurchaseRecord[]>([]);

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
    let baseFee = 50;
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
    setCartItems((prev) => {
      const existing = prev.find((cartItem) => cartItem.name === item.name);
      if (existing) {
        return prev.map((cartItem) =>
          cartItem.name === item.name
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [
          ...prev,
          {
            name: item.name,
            quantity: 1,
            level: item.level || "Common",
            price: item.price,
            adjustedPrice: item.adjustedPrice || item.price,
            basePrice: item.basePrice || item.price,
            details: item.details,
          },
        ];
      }
    });
  };

  const updateCartQuantity = (itemName: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemName);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.name === itemName ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (itemName: string) => {
    setCartItems((prev) => prev.filter((item) => item.name !== itemName));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const completePurchase = () => {
    const total = cartItems.reduce((sum, item) => {
      const price = parsePriceToGold(item.adjustedPrice || item.price);
      return sum + price * item.quantity;
    }, 0);

    if (playerMoney >= total) {
      setPlayerMoney((prev) => prev - total);
      clearCart();
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
    const hagglingStyle = getHagglingStyle(
      settlementSize,
      shopkeeper.priceModifier
    );
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
    const reducedFee = Math.round(apologyFee / 2);

    if (success) setApologyFee(reducedFee);

    setLastHaggleResult({
      roll,
      total,
      dc: 15,
      success,
      bonusPercent: 0,
      resultText: success
        ? `Charisma check successful! ${
            shopkeeper.name.split(" ")[0]
          } reduces the fee to ${reducedFee} gold.`
        : `Charisma check failed. ${
            shopkeeper.name.split(" ")[0]
          } is unmoved by your pleas.`,
    });
  };

  const attemptBuyingHaggle = () => {
    if (buyingHaggleAttempts <= 0 || cartItems.length === 0) return;

    setBuyingIsHaggling(true);
    const roll = rollD20();
    const total = roll + playerCharisma;
    const success = total >= buyingCurrentHaggleDC;

    let bonusPercent = 0;
    let resultText = "";

    if (roll === 20) {
      // Critical success
      bonusPercent = 25;
      resultText = "Exceptional negotiation! Significant discount achieved!";
    } else if (roll === 1) {
      // Critical failure - shopkeeper increases prices
      bonusPercent = -15;
      resultText =
        "Terrible haggling! Shopkeeper is offended and raises prices!";
    } else if (success) {
      const successMargin = total - buyingCurrentHaggleDC;
      bonusPercent = Math.floor(successMargin * 2) + 5; // 5-25% discount
      resultText = "Successful haggling! You've negotiated a discount.";
    } else {
      bonusPercent = -5; // Small penalty
      resultText = "Haggling failed. Shopkeeper is slightly annoyed.";
    }

    // Apply bonus/penalty to all cart items
    setCartItems((prev) =>
      prev.map((item) => ({
        ...item,
        haggleBonus: (item.haggleBonus || 0) + bonusPercent,
      }))
    );

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
    setBuyingIsHaggling(false);
  };

  const resetHaggleState = () => {
    const hadHaggling = hasHaggled;

    if (hadHaggling && sellingItems.length > 0) {
      // You'll need to import getCartChangeReaction from shopkeeperSellingDetails

      setIsCartChangeReaction(true);
      setTimeout(() => {
        setIsCartChangeReaction(false);
        setCartChangeDescription("");
        setCartChangeQuote("");
      }, 4000);
    }

    setHaggleAttempts(3);
    const hagglingStyle = getHagglingStyle(
      settlementSize,
      shopkeeper.priceModifier
    );
    setCurrentHaggleDC(10 + hagglingStyle.dcModifier);
    setLastHaggleResult(null);
    setIsHaggleReaction(false);
    setCurrentHaggleQuote("");
    setHasHaggled(false);
    setLastHaggleWasSuccessful(null);
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

  // In ShopkeeperApp.tsx, replace your addItemToSell function with this debug version:

  const addItemToSell = (item) => {
    console.log("🔍 ShopkeeperApp addItemToSell called with:", item);
    console.log("🔍 Current sellingItems before update:", sellingItems);
    console.log("🔍 sellingItems length before:", sellingItems.length);

    setSellingItems((prev) => {
      console.log("🔍 setSellingItems called, prev:", prev);
      console.log("🔍 prev length:", prev.length);

      const existing = prev.find((selling) => selling.name === item.name);
      console.log("🔍 existing item found:", existing);

      if (existing) {
        const updated = prev.map((selling) =>
          selling.name === item.name
            ? { ...selling, quantity: selling.quantity + 1 }
            : selling
        );
        console.log("🔍 returning updated array (existing item):", updated);
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

        const itemGoldValue = parsePriceToGold(marketPrice);

        const newItem = {
          ...item,
          quantity: 1,
          level: item.level || "Common",
          marketPrice: marketPrice, // Display this in cart
          marketValue: itemGoldValue, // Use this for calculations
          shopkeeperPrice: item.adjustedPrice || item.price, // What the shopkeeper sells it for
        };

        console.log("🔍 creating new item:", newItem);

        const newArray = [...prev, newItem];
        console.log("🔍 returning new array (new item):", newArray);
        console.log("🔍 new array length:", newArray.length);

        return newArray;
      }
    });

    console.log("🔍 setSellingItems call completed");
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
        if (['neutral', 'satisfied', 'pleased'].includes(shopkeeperMood)
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
    const hagglingStyle = getHagglingStyle(
      settlementSize,
      shopkeeper.priceModifier
    );
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

  // Lock shopkeeper toggle
  const [lockedShopkeeperIdentity, setLockedShopkeeperIdentity] =
    useState(null);

  useEffect(() => {
    if (!shopkeeper) return;

    const moodRoll = Math.random();
    let baseMood = "reserved";

    if (shopkeeper.priceModifier > 0.15) {
      baseMood =
        moodRoll > 0.7 ? "reserved" : moodRoll > 0.4 ? "doubtful" : "open";
    } else if (shopkeeper.priceModifier < -0.15) {
      baseMood =
        moodRoll > 0.5 ? "open" : moodRoll > 0.2 ? "welcoming" : "reserved";
    } else {
      baseMood =
        moodRoll > 0.6 ? "open" : moodRoll > 0.2 ? "reserved" : "welcoming";
    }

    const applyCharismaMoodModifier = (baseMood, charisma) => {
      const moodScale = [
        "dismissive",
        "doubtful",
        "reserved",
        "open",
        "welcoming",
      ];
      const currentIndex = moodScale.indexOf(baseMood);
      if (currentIndex === -1) return baseMood;

      let modifier = 0;
      if (charisma >= 3) {
        modifier = Math.floor((charisma - 2) / 2);
      } else if (charisma <= -3) {
        modifier = Math.ceil((charisma + 2) / 2);
      }

      const newIndex = Math.max(
        0,
        Math.min(moodScale.length - 1, currentIndex + modifier)
      );
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
  }, [
    shopkeeper?.name,
    shopkeeper?.shopType,
    settlementSize,
    lockedShopkeeperIdentity,
  ]);

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

  useEffect(() => {
    if (cartItems.length > 0) {
      setCartItems((prev) =>
        prev.map((item) => ({
          ...item,
          charismaBonus: playerCharisma * 5, // Update charisma bonus
        }))
      );
    }
  }, [playerCharisma]);

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
                  setActiveTab("inventory");
                  // Don't trigger any reactions when switching tabs
                  setIsCartChangeReaction(false);
                  setIsHaggleReaction(false);
                }}
                className={`${buttonStyles.tab} ${
                  activeTab === "inventory"
                    ? "text-stone-700 dark:text-gray-200 border-b-2 border-stone-400 dark:border-gray-300"
                    : "text-stone-500 dark:text-gray-400 hover:text-stone-700 dark:hover:text-gray-200"
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "20px" }}
                >
                  inventory_2
                </span>
                Buy From Shop
              </button>

              <button
                onClick={() => {
                  setActiveTab("selling");
                  // Don't trigger any reactions when switching tabs
                  setIsCartChangeReaction(false);
                  setIsHaggleReaction(false);
                }}
                className={`${buttonStyles.tab} ${
                  activeTab === "selling"
                    ? "dark:text-gray-200 border-b-2 border-stone-400 dark:border-gray-300"
                    : "text-stone-500 dark:text-gray-400 hover:text-stone-700 dark:hover:text-gray-200"
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "20px" }}
                >
                  sell
                </span>
                Sell to Shop
              </button>
            </div>
          </div>

          {/* Conditional Content */}
          {activeTab === "inventory" && (
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
              lastHaggleResult={lastHaggleResult}
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
              buyingLastHaggleResult={buyingLastHaggleResult}
              recentPurchases={recentPurchases}
              onAttemptBuyingHaggle={attemptBuyingHaggle}
            />
          )}

          {activeTab === "selling" && (
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
