// components/SellingSection.tsx
import React, { useState, useEffect } from "react";
import ShopItemsList from "../components/shopItemsList";
import { buttonStyles } from "../styles/buttonStyles";
import Tooltip from "../components/tooltip";
import { SellingCart, SellingItem, HaggleResult } from "./shoppingCart";
import ShopkeeperMoodDisplay, { 
  moodScale, 
  applyCharismaMoodModifier, 
  setMoodWithCharisma 
} from "./ShopkeeperMoodDisplay";



import {
  sortItems,
  getCategoryForItem,
} from "../utils/helpers";

import {
  parsePriceToGold,
  formatCurrency,
  getShopkeeperBuyRate,
} from "../utils/pricing";

import { getShopkeeperPronouns } from "../utils/shopGeneration";

import { itemCategories } from "../data/itemCategories";

import { shopItems } from "../data/shopItems";

const PhosphorIcon = ({ icon: Icon, weight = "thin", size = 20, ...props }) => (
  <Icon weight={weight} size={size} {...props} />
);

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

  isDarkMode?: boolean;

  closeAllDropdowns: () => void;

  updateShopkeeper: (updatedShopkeeper: any) => void;

  isCategoryFilterDropdownOpen: boolean;

  setIsCategoryFilterDropdownOpen: (open: boolean) => void;

  isCharismaDropdownOpen: boolean;

  setIsCharismaDropdownOpen: (open: boolean) => void;

  getHagglingStyle: (
    settlementSize: string,

    priceModifier: number
  ) => { name: string; dcModifier: number };

  isSortDropdownOpen: boolean;

  setIsSortDropdownOpen: (open: boolean) => void;

  shopkeeperMood: string;

  setShopkeeperMood: (mood: string) => void;

  playerCharisma: number;

  items: SellingItem[];

  setPlayerCharisma: (charisma: number) => void;

  haggleAttempts: number;

  setHaggleAttempts: (attempts: number) => void;

  currentHaggleDC: number;

  setCurrentHaggleDC: (dc: number) => void;

  lastHaggleResult: any;

  setLastHaggleResult: (result: any) => void;

  isHaggling: boolean;

  setIsHaggling: (haggling: boolean) => void;

  isHaggleReaction: boolean;

  setIsHaggleReaction: (reaction: boolean) => void;

  currentHaggleQuote: string;

  setCurrentHaggleQuote: (quote: string) => void;

  hasHaggled: boolean;

  setHasHaggled: (haggled: boolean) => void;

  lastHaggleWasSuccessful: boolean | null;

  setLastHaggleWasSuccessful: (successful: boolean | null) => void;

  isCartChangeReaction: boolean;

  setIsCartChangeReaction: (reaction: boolean) => void;

  cartChangeDescription: string;

  setCartChangeDescription: (description: string) => void;

  cartChangeQuote: string;

  setCartChangeQuote: (quote: string) => void;

  hasTriedCharismaCheck: boolean;

  setHasTriedCharismaCheck: (tried: boolean) => void;

  relationshipStatus: string;

  setRelationshipStatus: (status: string) => void;

  critFailCount: number;

  setCritFailCount: (count: number) => void;

  isLockedOut: boolean;

  setIsLockedOut: (locked: boolean) => void;

  apologyFee: number;

  setApologyFee: (fee: number) => void;

  lockoutReason: string;

  setLockoutReason: (reason: string) => void;

  resetHaggleState: () => void;

  selectedMoodDesc: string;

  setSelectedMoodDesc: (desc: string) => void;

  selectedPersonalityDesc: string;

  setSelectedPersonalityDesc: (desc: string) => void;

  sellingItems: any[];

  setSellingItems: (items: any[]) => void;

  recentSales: any[];

  setRecentSales: (sales: any[]) => void;

  itemSearchQuery: string;

  setItemSearchQuery: (query: string) => void;

  selectedItemCategory: string;

  setSelectedItemCategory: (category: string) => void;

  addItemToSell: (item: any) => void;

  removeItemFromSell: (itemName: string) => void;

  updateSellQuantity: (itemName: string, quantity: number) => void;

  attemptHaggle: () => void;

  executeSale: () => void;

  undoSale: (saleId: number) => void;

  calculateSaleTotal: () => number;

  getTotalMarketValue: () => number;

  calculateShopTotalMoney: () => number;
  

  handleApologyPayment: () => void;

  handleCharismaCheck: () => void;

  onUpdateQuantity: (itemName: string, newQuantity: number) => void;
  onRemoveItem: (itemName: string) => void;
  onExecuteSale: () => void;
  onAttemptHaggle: () => void;
  onApologyPayment: () => void;
  onCharismaCheck: () => void;
  onUndoSale: (saleId: number) => void;

}



const SellingSection: React.FC<SellingSectionProps> = (props) => {
  // 🔍 DEBUG: Log everything at the start
  console.log('🔍 SellingSection Debug:', {
    sellingItemsLength: props.sellingItems?.length || 0,
    sellingItems: props.sellingItems,
    recentSalesLength: props.recentSales?.length || 0,
    hasAddItemToSell: typeof props.addItemToSell === 'function',
    addItemToSellFunction: props.addItemToSell,
  });

  // Destructure props (REMOVE the SellingItem line!)
  const {
    shopkeeper,
    settlementSize,
    isDarkMode,
    closeAllDropdowns,
    isCategoryFilterDropdownOpen,
    setIsCategoryFilterDropdownOpen,
    getHagglingStyle,
    shopkeeperMood,
    playerCharisma,
    setPlayerCharisma,
    haggleAttempts,
    lastHaggleResult,
    isHaggling,
    isHaggleReaction,
    currentHaggleQuote,
    isCartChangeReaction,
    cartChangeDescription,
    cartChangeQuote,
    hasTriedCharismaCheck,
    isLockedOut,
    apologyFee,
    lockoutReason,
    sellingItems = [],
    recentSales = [],
    itemSearchQuery = "",
    setItemSearchQuery,
    selectedItemCategory = "all",
    setSelectedItemCategory,
    addItemToSell,
    undoSale,
    calculateSaleTotal,
    getTotalMarketValue,
    calculateShopTotalMoney,
    onUpdateQuantity,
    onRemoveItem,
    onExecuteSale,
    onAttemptHaggle,
    onApologyPayment,
    onCharismaCheck,
    onUndoSale,
  } = props;

  // Local state
  const [itemSort, setItemSort] = useState("alpha");
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // 🔍 DEBUG: Create a wrapper function to log when items are added
  const debugAddItemToSell = (item: any) => {
    console.log('🔍 DEBUG: addItemToSell called with:', item);
    console.log('🔍 DEBUG: Current sellingItems before:', sellingItems);
    
    if (typeof addItemToSell === 'function') {
      addItemToSell(item);
      console.log('🔍 DEBUG: addItemToSell function called successfully');
    } else {
      console.error('❌ addItemToSell is not a function:', typeof addItemToSell);
    }
  };

  // 🔍 DEBUG: Watch sellingItems changes
  useEffect(() => {
    console.log('🔍 DEBUG: sellingItems changed:', {
      length: sellingItems?.length || 0,
      items: sellingItems,
    });
  }, [sellingItems]);

  // 🔍 DEBUG: Log cart rendering decision
  console.log('🔍 DEBUG: Cart rendering decision:', {
    sellingItemsLength: sellingItems?.length || 0,
    recentSalesLength: recentSales?.length || 0,
    shouldShowCart: (sellingItems?.length || 0) > 0 || (recentSales?.length || 0) > 0,
  });
  

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

    // Sort the items
    return sortItems(items, itemSort);
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
        mode="selling" // This shows haggling-specific UI elements
      />

      {/* Sale Details Section */}

      <div>
        {/* Search and Filter Controls */}

        <div className="px-4 py-3 bg-stone-100 dark:bg-gray-700 border-t border-x rounded-t-lg border-stone-300 dark:border-gray-500">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2 flex-1">
              <input
                type="text"
                placeholder="Search Items"
                value={itemSearchQuery}
                onChange={(e) => setItemSearchQuery(e.target.value)}
                className="w-full bg-stone-50 dark:bg-gray-700 border border-stone-200 dark:border-gray-600

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
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm text-stone-600 dark:text-gray-300">
              <span className="whitespace-nowrap">Show</span>

              {/* Category Dropdown */}

              <div className="relative inline-block">
                <button
                  onClick={() => {
                    closeAllDropdowns();

                    setIsCategoryFilterDropdownOpen(
                      !isCategoryFilterDropdownOpen
                    );
                  }}
                  className={buttonStyles.dropdown}
                >
                  <span className="flex items-center">
                    <span className="material-symbols-outlined mr-1 leading-none">
                      all_inclusive
                    </span>

                    {selectedItemCategory === "all"
                      ? "Any Category"
                      : itemCategories[selectedItemCategory]?.name ||
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

              <span className="whitespace-nowrap">sorted by</span>

              {/* Sort Dropdown */}

              <div className="relative inline-block">
                <button
                  onClick={() => {
                    closeAllDropdowns();

                    setIsSortDropdownOpen(!isSortDropdownOpen);
                  }}
                  className={buttonStyles.dropdown}
                >
                  <span className="flex items-center">
                    <span className="material-symbols-outlined mr-1 leading-none">
                      sort
                    </span>

                    {itemSort === "alpha"
                      ? "Alphabetical"
                      : itemSort === "price-asc"
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

                              setItemSort(option.value);

                              setIsSortDropdownOpen(false);
                            }}
                            className={`block w-full text-left px-3 py-1.5 hover:bg-stone-100 dark:hover:bg-gray-600 text-stone-600 dark:text-gray-300 font-medium inter uppercase tracking-wider ${
                              itemSort === option.value
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

        {/* Add Item Search & Selection */}

        <div className="bg-stone-50 dark:bg-gray-600 rounded-b-lg border border-stone-300 dark:border-gray-500 overflow-hidden flex flex-col h-80">
          {/* Filtered Items List */}

          <div className="flex-1 overflow-y-auto">
            <ShopItemsList
    items={getFilteredItems()}
    mode="selling"
    shopkeeper={shopkeeper}
    onAddItem={debugAddItemToSell}  // 🔍 Use debug wrapper
    disabledItems={sellingItems.map((item) => item.name)}
    emptyMessage={
      itemSearchQuery
        ? "No items match your search"
        : "No items available"
    }
    isDarkMode={isDarkMode}
  />
          </div>
        </div>
      </div>

      {/* Current Cart */}

      <SellingCart
    sellingItems={sellingItems}
    shopkeeper={shopkeeper}
    settlementSize={settlementSize}
    playerCharisma={playerCharisma}
    setPlayerCharisma={setPlayerCharisma}
    haggleAttempts={haggleAttempts}
    isHaggling={isHaggling}
    isLockedOut={isLockedOut}
    lockoutReason={lockoutReason}
    apologyFee={apologyFee}
    hasTriedCharismaCheck={hasTriedCharismaCheck}
    lastHaggleResult={lastHaggleResult}
    recentSales={recentSales}
    
    // ✅ USE CALLBACK PROPS:
    onUpdateQuantity={onUpdateQuantity}
    onRemoveItem={onRemoveItem}
    onExecuteSale={onExecuteSale}
    onAttemptHaggle={onAttemptHaggle}
    onApologyPayment={onApologyPayment}
    onCharismaCheck={onCharismaCheck}
    onUndoSale={onUndoSale}
    
    calculateShopTotalMoney={calculateShopTotalMoney}
    calculateSaleTotal={calculateSaleTotal}
    getTotalMarketValue={getTotalMarketValue}
    isDarkMode={isDarkMode}
  />

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
