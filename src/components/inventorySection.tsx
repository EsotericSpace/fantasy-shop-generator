// components/InventorySection.tsx

import React, { useState } from "react";

import ShopItemsList from "../components/shopItemsList";

import ShoppingCart, { CartItem } from "./shoppingCart";

import { buttonStyles } from "../styles/buttonStyles";

import { itemCategories } from "../data/itemCategories";

import { shopItems, normalizeShopType } from "../data/shopItems";
import { PurchaseRecord } from "./shoppingCart";
import ShopkeeperMoodDisplay from "./shopkeeperMoodDisplay";

import { formatCurrency, parsePriceToGold } from "../utils/pricing";

import {
  sortItems,
  getCategoryForItem,
  getIconForItem,
  getIconComponent,
  getRarityBadgeClass,
  getRarityColors,
} from "../utils/helpers";

import {
  getInventoryLimits,
  generateCommonItems,
  generateRareItems,
} from "../utils/shopGeneration";

const PhosphorIcon = ({ icon: Icon, weight = "thin", size = 20, ...props }) => (
  <Icon weight={weight} size={size} {...props} />
);

interface InventorySectionProps {
  shopkeeper: any;
  settlementSize: string;
  isDarkMode: boolean;
  closeAllDropdowns: () => void;
  setShopkeeper: (shopkeeper: any) => void;
  isCategoryDropdownOpen: boolean;
  setIsCategoryDropdownOpen: (open: boolean) => void;
  isSortDropdownOpen: boolean;
  setIsSortDropdownOpen: (open: boolean) => void;
  shopkeeperMood: string;
  playerCharisma: number;
  onUpdatePlayerCharisma: (charisma: number) => void;
  getHagglingStyle: (
    settlementSize: string,
    priceModifier: number
  ) => { name: string; dcModifier: number };

  // EXISTING haggling props (keep these)
  isCartChangeReaction: boolean;
  cartChangeDescription: string;
  cartChangeQuote: string;
  isHaggleReaction: boolean;
  lastHaggleResult: any;
  setLastHaggleResult: (result: any) => void;
  currentHaggleQuote: string;
  selectedMoodDesc: string;
  selectedPersonalityDesc: string;

  // ADD MISSING haggling props (these match what SellingSection has)
  buyingHaggleAttempts: number;
  setBuyingHaggleAttempts: (attempts: number) => void;
  buyingCurrentHaggleDC: number;
  setBuyingCurrentHaggleDC: (dc: number) => void;
  buyingIsHaggling: boolean;
  setBuyingIsHaggling: (haggling: boolean) => void;
  buyingHasHaggled: boolean;
  setBuyingHasHaggled: (haggled: boolean) => void;
  buyingLastHaggleWasSuccessful: boolean | null;
  setBuyingLastHaggleWasSuccessful: (successful: boolean | null) => void;
  buyingHasTriedCharismaCheck: boolean;
  setBuyingHasTriedCharismaCheck: (tried: boolean) => void;
  buyingRelationshipStatus: string;
  setBuyingRelationshipStatus: (status: string) => void;
  buyingCritFailCount: number;
  setBuyingCritFailCount: (count: number) => void;
  buyingIsLockedOut: boolean;
  setBuyingIsLockedOut: (locked: boolean) => void;
  buyingApologyFee: number;
  setBuyingApologyFee: (fee: number) => void;
  buyingLockoutReason: string;
  setBuyingLockoutReason: (reason: string) => void;
  resetBuyingHaggleState: () => void;

  // EXISTING cart props (keep these)
  cartItems: CartItem[];
  playerMoney: number;
  recentPurchases?: PurchaseRecord[];
  onAddToCart: (item: any) => void;
  onUpdateCartQuantity: (itemName: string, quantity: number) => void;
  onUpdateCartItemHaggleBonus: (itemName: string, bonusPercent: number) => void;
  onRemoveFromCart: (itemName: string) => void;
  onClearCart: () => void;
  onCompletePurchase: () => void;
  onUndoPurchase?: (purchaseId: number) => void;
  onUpdatePlayerMoney: (amount: number) => void;

  // Buying props
  buyingIsCharismaDropdownOpen: boolean;
  setBuyingIsCharismaDropdownOpen: (open: boolean) => void;
  onBuyingApologyPayment: () => void;
  onBuyingCharismaCheck: () => void;
}

const InventorySection: React.FC<InventorySectionProps> = ({
  shopkeeper,
  settlementSize,
  isDarkMode,
  closeAllDropdowns,
  isCategoryDropdownOpen,
  setIsCategoryDropdownOpen,
  isSortDropdownOpen,
  setIsSortDropdownOpen,
  setShopkeeper,
  shopkeeperMood,
  playerCharisma,
  onUpdatePlayerCharisma,
  getHagglingStyle,

  // EXISTING haggling props
  isCartChangeReaction,
  cartChangeDescription,
  cartChangeQuote,
  isHaggleReaction,
  lastHaggleResult,
  currentHaggleQuote,
  selectedMoodDesc,
  selectedPersonalityDesc,

  // EXISTING buying props
  buyingHaggleAttempts,
  buyingCurrentHaggleDC,
  buyingIsHaggling,
  buyingLastHaggleResult,

  // ADD ALL THESE MISSING BUYING PROPS:
  setBuyingHaggleAttempts,
  setBuyingCurrentHaggleDC,
  setBuyingIsHaggling,
  setBuyingLastHaggleResult,
  buyingRelationshipStatus,
  setBuyingRelationshipStatus,
  buyingCritFailCount,
  setBuyingCritFailCount,
  buyingIsLockedOut,
  setBuyingIsLockedOut,
  buyingApologyFee,
  setBuyingApologyFee,
  buyingLockoutReason,
  setBuyingLockoutReason,
  buyingHasTriedCharismaCheck,
  setBuyingHasTriedCharismaCheck,
  buyingHasHaggled,
  setBuyingHasHaggled,
  buyingLastHaggleWasSuccessful,
  setBuyingLastHaggleWasSuccessful,
  buyingIsCharismaDropdownOpen,
  setBuyingIsCharismaDropdownOpen,
  onBuyingApologyPayment,
  onBuyingCharismaCheck,
  resetBuyingHaggleState,
  onUpdateCartItemHaggleBonus,

  // EXISTING cart props
  cartItems,
  playerMoney,
  recentPurchases = [],
  onAddToCart,
  onUpdateCartQuantity,
  onRemoveFromCart,
  onClearCart,
  onCompletePurchase,
  onUndoPurchase,
  onUpdatePlayerMoney,
  onAttemptBuyingHaggle,
  calculateCartTotal,
  calculateOriginalCartTotal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("any");

  const [inventorySort, setInventorySort] = useState("alpha");

  const [fadeCommon, setFadeCommon] = useState(false);

  const [fadeRare, setFadeRare] = useState(false);

  if (!shopkeeper) return null;

  // Function to regenerate BOTH common and rare items at once

  const regenerateAllItems = () => {
    console.log("=== regenerateAllItems Debug ===");

    console.log("regenerateAllItems called");

    console.log("shopkeeper.shopType:", shopkeeper.shopType);

    console.log("settlementSize:", settlementSize);

    setFadeCommon(true);

    setFadeRare(true);

    const limits = getInventoryLimits(settlementSize);

    console.log("Inventory limits:", limits);

    // Normalize the shop type to ensure it matches our data

    const normalizedShopType = normalizeShopType(shopkeeper.shopType);

    console.log("Normalized shop type:", normalizedShopType);

    const newCommonItems = generateCommonItems(
      normalizedShopType,

      shopkeeper.priceModifier,

      limits
    );

    const newRareItems = generateRareItems(
      normalizedShopType,

      shopkeeper.priceModifier,

      limits
    );

    console.log("New common items:", newCommonItems.length);

    console.log("New rare items:", newRareItems.length);

    console.log("=== End regenerateAllItems Debug ===");

    // Update both at the same time - NO RACE CONDITION

    setShopkeeper({
      ...shopkeeper,

      commonItems: newCommonItems,

      rareItems: newRareItems,
    });

    // Reset fade states

    setTimeout(() => {
      setFadeCommon(false);

      setFadeRare(false);
    }, 300);
  };

  // Separate functions for individual regeneration (if needed elsewhere)

  const regenerateCommonItems = () => {
    setFadeCommon(true);

    const limits = getInventoryLimits(settlementSize);

    const normalizedShopType = normalizeShopType(shopkeeper.shopType);

    const newCommonItems = generateCommonItems(
      normalizedShopType,
      shopkeeper.priceModifier,
      limits
    );

    setShopkeeper((prev) => ({
      ...prev,

      commonItems: newCommonItems,
    }));

    setTimeout(() => setFadeCommon(false), 300);
  };

  const regenerateRareItems = () => {
    setFadeRare(true);

    const limits = getInventoryLimits(settlementSize);

    const normalizedShopType = normalizeShopType(shopkeeper.shopType);

    const newRareItems = generateRareItems(
      normalizedShopType,
      shopkeeper.priceModifier,
      limits
    );

    setShopkeeper((prev) => ({
      ...prev,

      rareItems: newRareItems,
    }));

    setTimeout(() => setFadeRare(false), 300);
  };

  const getAvailableCategories = (): string[] => {
    const combined = [...shopkeeper.commonItems, ...shopkeeper.rareItems];

    const categories = new Set<string>();

    combined.forEach((item) => {
      const categoryInfo = getCategoryForItem(item.name);

      categories.add(categoryInfo.category);
    });

    return Array.from(categories).sort();
  };

  const [goldInput, setGoldInput] = useState(Math.floor(playerMoney));
  const [silverInput, setSilverInput] = useState(0);
  const [copperInput, setCopperInput] = useState(0);

  const handleBuyingApologyPayment = () => {
    if (playerMoney >= buyingApologyFee) {
      onUpdatePlayerMoney(playerMoney - buyingApologyFee);
      setBuyingIsLockedOut(false);
      setBuyingCritFailCount(0);
      setBuyingHaggleAttempts(3);
      setBuyingCurrentHaggleDC(15);
      resetBuyingHaggleState();
    }
  };

  const handleBuyingCharismaCheck = () => {
    if (buyingHasTriedCharismaCheck) return;

    setBuyingHasTriedCharismaCheck(true);
    const roll = Math.floor(Math.random() * 20) + 1;
    const total = roll + playerCharisma;

    if (total >= 15) {
      // Success - restore relations
      setBuyingIsLockedOut(false);
      setBuyingCritFailCount(0);
      setBuyingHaggleAttempts(2); // Reduced attempts but not locked out
      setBuyingCurrentHaggleDC(15);
    }
    // If failed, stay locked out
  };

  // Combine and filter inventory

  const getCombinedInventory = () => {
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

  return (
    <div className="shopkeeper-card rounded-b-md shadow-md !pt-8 mb-6 bg-stone-100 dark:bg-gray-700">
      <ShopkeeperMoodDisplay
        shopkeeper={shopkeeper}
        settlementSize={settlementSize}
        shopkeeperMood={shopkeeperMood}
        playerCharisma={playerCharisma}
        getHagglingStyle={getHagglingStyle}
        isCartChangeReaction={isCartChangeReaction}
        cartChangeDescription={cartChangeDescription}
        cartChangeQuote={cartChangeQuote}
        isHaggleReaction={isHaggleReaction}
        lastHaggleResult={lastHaggleResult}
        currentHaggleQuote={currentHaggleQuote}
        mode="buying"
      />

      {/* Controls Header */}

      <div className="px-4 py-3 bg-stone-100 dark:bg-gray-700 border-t border-x rounded-t-lg border-stone-300 dark:border-gray-500">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                console.log("Re-roll button clicked!");

                closeAllDropdowns();

                regenerateAllItems();
              }}
              className={`${buttonStyles.dropdown}`}
              title="Regenerate all inventory"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "20px" }}
              >
                refresh
              </span>
            </button>

            {/* Player Money Input - Updated for Gold/Silver/Copper */}
            <div className="flex items-center gap-2">
  <span className="text-sm text-stone-600 dark:text-gray-300">
    $
  </span>
  
  <div className="inline-flex items-center gap-1">
    {/* Gold Input */}
    <div className="inline-flex items-center bg-stone-50 dark:bg-gray-600 border border-stone-300 dark:border-gray-500 rounded-md px-2 py-1">
      <span
        className="material-symbols-outlined text-amber-500"
        style={{ fontSize: "14px" }}
      >
        poker_chip
      </span>
      <input
    type="number"
    value={goldInput}
    onChange={(e) => {
      const newGold = Math.max(0, parseInt(e.target.value) || 0);
      setGoldInput(newGold);
      onUpdatePlayerMoney(newGold + silverInput/10 + copperInput/100);
    }}
    onFocus={(e) => e.target.select()}  // ✅ Select all on focus
    className="w-8 bg-transparent text-xs font-medium text-stone-700 dark:text-gray-200 text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
    min="0"
  />
      <span className="text-xs text-stone-500 dark:text-gray-400"></span>
    </div>

    {/* Silver Input */}
    <div className="inline-flex items-center bg-stone-50 dark:bg-gray-600 border border-stone-300 dark:border-gray-500 rounded-md px-2 py-1">
      <span
        className="material-symbols-outlined text-gray-400"
        style={{ fontSize: "14px" }}
      >
        poker_chip
      </span>
       <input
    type="number"
    value={silverInput}
    onChange={(e) => {
      const newSilver = Math.max(0, parseInt(e.target.value) || 0);
      setSilverInput(newSilver);
      onUpdatePlayerMoney(goldInput + newSilver/10 + copperInput/100);
    }}
    onFocus={(e) => e.target.select()}  // ✅ Select all on focus
    className="w-8 bg-transparent text-xs font-medium text-stone-700 dark:text-gray-200 text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
    min="0"
  />
      <span className="text-xs text-stone-500 dark:text-gray-400"></span>
    </div>

    {/* Copper Input */}
    <div className="inline-flex items-center bg-stone-50 dark:bg-gray-600 border border-stone-300 dark:border-gray-500 rounded-md px-2 py-1">
      <span
        className="material-symbols-outlined text-yellow-700"
        style={{ fontSize: "14px" }}
      >
        poker_chip
      </span>
      <input
    type="number"
    value={copperInput}
    onChange={(e) => {
      const newCopper = Math.max(0, parseInt(e.target.value) || 0);
      setCopperInput(newCopper);
      onUpdatePlayerMoney(goldInput + silverInput/10 + newCopper/100);
    }}
    onFocus={(e) => e.target.select()}  // ✅ Select all on focus
    className="w-8 bg-transparent text-xs font-medium text-stone-700 dark:text-gray-200 text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
    min="0"
  />
      <span className="text-xs text-stone-500 dark:text-gray-400"></span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm text-stone-600 dark:text-gray-300">
            <span className="whitespace-nowrap">Show</span>

            {/* Category Dropdown */}

            <div className="relative inline-block">
              <button
                onClick={() => {
                  closeAllDropdowns();

                  setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
                }}
                className={buttonStyles.dropdown}
              >
                <span className="flex items-center">
                  <span className="material-symbols-outlined mr-1 leading-none">
                    all_inclusive
                  </span>

                  {selectedCategory === "any"
                    ? "Any Category"
                    : itemCategories[selectedCategory]?.name ||
                      selectedCategory}
                </span>

                <span
                  className="material-symbols-outlined ml-2 leading-none"
                  style={{ fontSize: "16px" }}
                >
                  {isCategoryDropdownOpen ? "expand_less" : "expand_more"}
                </span>
              </button>

              {isCategoryDropdownOpen && (
                <div className="dropdown-menu absolute z-10 mt-1 bg-stone-50 dark:bg-gray-700 border border-stone-300 dark:border-gray-600 rounded-lg shadow-lg">
                  <ul className="py-0.5 text-xs text-stone-700 dark:text-gray-300">
                    <li>
                      <button
                        onClick={() => {
                          closeAllDropdowns();

                          setSelectedCategory("any");

                          setIsCategoryDropdownOpen(false);
                        }}
                        className={`block w-full text-left px-3 py-1.5 hover:bg-stone-100 dark:hover:bg-gray-600 text-stone-600 dark:text-gray-300 font-medium inter uppercase tracking-wider ${
                          selectedCategory === "any"
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

                    {getAvailableCategories().map((category) => {
                      const categoryData = itemCategories[category as string];

                      return (
                        <li key={category}>
                          <button
                            onClick={() => {
                              closeAllDropdowns();

                              setSelectedCategory(category);

                              setIsCategoryDropdownOpen(false);
                            }}
                            className={`block w-full text-left px-3 py-1.5 hover:bg-stone-100 dark:hover:bg-gray-600 text-stone-600 dark:text-gray-300 font-medium inter uppercase tracking-wider ${
                              selectedCategory === category
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

            <span className="whitespace-nowrap">sorted by</span>

            {/* Sort Dropdown */}
            <div className="relative inline-block">
              <button
                onClick={() => {
                  console.log("Sort button clicked!");
                  console.log(
                    "Current isSortDropdownOpen:",
                    isSortDropdownOpen
                  );
                  closeAllDropdowns();
                  setIsSortDropdownOpen(!isSortDropdownOpen);
                }}
                className={buttonStyles.dropdown}
              >
                <span className="flex items-center">
                  <span className="material-symbols-outlined mr-1 leading-none">
                    sort
                  </span>

                  {inventorySort === "alpha"
                    ? "Alphabetical"
                    : inventorySort === "price-asc"
                    ? "Price: Low to High"
                    : "Price: High to Low"}
                </span>

                <span
                  className="material-symbols-outlined ml-2 leading-none"
                  style={{ fontSize: "16px" }}
                >
                  {isSortDropdownOpen ? "expand_less" : "expand_more"}
                </span>
              </button>

              {isSortDropdownOpen && (
                <div className="dropdown-menu absolute z-10 mt-1 bg-stone-50 dark:bg-gray-700 border border-stone-300 dark:border-gray-600 rounded-lg shadow-lg">
                  <ul className="py-0.5 text-xs text-stone-700 dark:text-gray-300">
                    {[
                      {
                        value: "alpha",
                        label: "Alphabetical",
                        icon: "sort_by_alpha",
                      },

                      {
                        value: "price-asc",
                        label: "Price: Low to High",
                        icon: "trending_up",
                      },

                      {
                        value: "price-desc",
                        label: "Price: High to Low",
                        icon: "trending_down",
                      },
                    ].map((option) => (
                      <li key={option.value}>
                        <button
                          onClick={() => {
                            closeAllDropdowns();
                            setInventorySort(option.value);
                            setIsSortDropdownOpen(false);
                          }}
                          className={`block w-full text-left px-3 py-1.5 hover:bg-stone-100 dark:hover:bg-gray-600 text-stone-600 dark:text-gray-300 font-medium inter uppercase tracking-wider ${
                            inventorySort === option.value
                              ? "bg-stone-100 dark:bg-gray-600"
                              : ""
                          }`}
                        >
                          <span className="flex items-center">
                            <span className="material-symbols-outlined shop-icon text-stone-400 mr-1">
                              {option.icon}
                            </span>

                            {option.label}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Items Container */}

      <div className="bg-stone-50 dark:bg-gray-600 rounded-b-lg border border-stone-300 dark:border-gray-500 overflow-hidden flex flex-col h-80">
        {/* Items List */}

        <div className="flex-1 overflow-y-auto">
          <ShopItemsList
            items={getCombinedInventory()}
            mode="buying"
            shopkeeper={shopkeeper}
            onAddItem={onAddToCart}
            disabledItems={cartItems.map((item) => item.name)}
            emptyMessage={
              selectedCategory === "any"
                ? "No items in inventory."
                : "No items match the selected category."
            }
            isDarkMode={isDarkMode}
          />
        </div>
      </div>

      {/* Shopping Cart */}
      <ShoppingCart
        cartItems={cartItems}
        shopkeeper={shopkeeper}
        playerMoney={playerMoney}
        onUpdateQuantity={onUpdateCartQuantity}
        onRemoveItem={onRemoveFromCart}
        onCompletePurchase={onCompletePurchase}
        onClearCart={onClearCart}
        isDarkMode={isDarkMode}
        // CORRECT haggling props
        playerCharisma={playerCharisma}
        onUpdateCharisma={onUpdatePlayerCharisma}
        buyingHaggleAttempts={buyingHaggleAttempts}
        buyingIsHaggling={buyingIsHaggling}
        buyingLastHaggleResult={buyingLastHaggleResult} // ✅ CORRECT PROP
        recentPurchases={recentPurchases}
        onAttemptHaggle={onAttemptBuyingHaggle} // ✅ Use prop from ShopkeeperApp
        onUndoPurchase={onUndoPurchase}
        calculateCartTotal={calculateCartTotal}
        calculateOriginalCartTotal={calculateOriginalCartTotal}
        // ADD lockout and apology props
        buyingIsLockedOut={buyingIsLockedOut}
        buyingLockoutReason={buyingLockoutReason}
        buyingApologyFee={buyingApologyFee}
        buyingHasTriedCharismaCheck={buyingHasTriedCharismaCheck}
        onApologyPayment={onBuyingApologyPayment}
        onCharismaCheck={onBuyingCharismaCheck}
      />

      {/* Recent Purchases - Similar to Recent Sales */}

      {recentPurchases && recentPurchases.length > 0 && (
        <div className="rounded-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-stone-600 dark:text-gray-300 inter shopkeeper-name mb-4">
            Recent Purchases
          </h3>

          <div className="space-y-3">
            {recentPurchases.map((purchase: PurchaseRecord) => (
              <div
                key={purchase.id}
                className="flex items-center justify-between bg-stone-200 dark:bg-gray-600 rounded-lg p-2"
              >
                <div className="flex-1">
                  <div className="text-sm font-medium text-stone-600 dark:text-gray-200 mb-1">
                    {purchase.items

                      .map((item) => `${item.name} ×${item.quantity}`)

                      .join(", ")}
                  </div>

                  <div className="text-xs text-stone-500 dark:text-gray-400">
                    {purchase.timestamp.toLocaleTimeString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className="text-sm font-medium text-stone-600 dark:text-gray-200"
                    dangerouslySetInnerHTML={{
                      __html: formatCurrency(purchase.finalTotal),
                    }}
                  ></span>

                  {onUndoPurchase && (
                    <button
                      onClick={() => onUndoPurchase(purchase.id)}
                      className="text-red-500 hover:text-red-700 text-xs px-2 py-1 border border-red-300 

                       hover:border-red-500 rounded transition-colors"
                    >
                      Undo
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InventorySection;
