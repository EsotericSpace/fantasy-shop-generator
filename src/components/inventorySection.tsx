// components/InventorySection.tsx
import React, { useState } from "react";
import { buttonStyles } from "../styles/buttonStyles";
import { itemCategories } from "../data/itemCategories";
import { shopItems, normalizeShopType } from "../data/shopItems";
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
  const newCommonItems = generateCommonItems(normalizedShopType, shopkeeper.priceModifier, limits);
  
  setShopkeeper(prev => ({
    ...prev,
    commonItems: newCommonItems,
  }));
  
  setTimeout(() => setFadeCommon(false), 300);
};

const regenerateRareItems = () => {
  setFadeRare(true);
  const limits = getInventoryLimits(settlementSize);
  const normalizedShopType = normalizeShopType(shopkeeper.shopType);
  const newRareItems = generateRareItems(normalizedShopType, shopkeeper.priceModifier, limits);
  
  setShopkeeper(prev => ({
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              console.log("Button clicked!"); // Add this line
              closeAllDropdowns();
              regenerateCommonItems();
              regenerateRareItems();
            }}
            className={`${buttonStyles.dropdown} gap-2`}
            title="Regenerate all inventory"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "20px" }}
            >
              refresh
            </span>
            Re-roll Items
          </button>
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
                  : itemCategories[selectedCategory]?.name || selectedCategory}
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
                      className={`block w-full text-left px-3 py-1.5 hover:bg-stone-100 text-stone-600 dark:text-gray-300 font-medium inter uppercase tracking-wider ${
                        selectedCategory === "any" ? "bg-stone-100" : ""
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
                          className={`block w-full text-left px-3 py-1.5 hover:bg-stone-100 text-stone-600 dark:text-gray-300 font-medium inter uppercase tracking-wider ${
                            selectedCategory === category ? "bg-stone-100" : ""
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
    console.log("Sort button clicked!"); // Add this line
    console.log("Current isSortDropdownOpen:", isSortDropdownOpen); // Add this line
    console.log("isSortDropdownOpen state:", isSortDropdownOpen);
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
                        className={`block w-full text-left px-3 py-1.5 hover:bg-stone-100 text-stone-600 dark:text-gray-300 font-medium inter uppercase tracking-wider ${
                          inventorySort === option.value ? "bg-stone-100" : ""
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

      <div className="space-y-3">
        {getCombinedInventory().map((item, index) => (
          <div
            key={`${item.type}-${index}-${item.name}`}
            className={`${
              getRarityColors(item.level, isDarkMode).background
            } border rounded-lg p-4 transition-colors`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-2 flex-1">
                {/* Item Icon */}
                <div className="flex-shrink-0 mt-1">
                  {(() => {
                    const iconValue = getIconForItem(item.name);
                    const IconComponent = getIconComponent(item.name);
                    const colors = getRarityColors(item.level, isDarkMode);

                    if (iconValue === "phosphor") {
                      return (
                        <PhosphorIcon
                          icon={IconComponent}
                          size={24}
                          className={colors.textIcon}
                        />
                      );
                    } else {
                      return (
                        <span
                          className={`material-symbols-outlined ${colors.textIcon}`}
                          style={{ fontSize: "24px" }}
                        >
                          {iconValue}
                        </span>
                      );
                    }
                  })()}
                </div>

                {/* Item Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4
                      className={`font-medium ${
                        getRarityColors(item.level, isDarkMode).text
                      } m-0`}
                    >
                      {item.name}
                    </h4>
                    <span className={getRarityBadgeClass(item.level)}>
                      {item.level}
                    </span>
                  </div>

                  {item.details && (
                    <p
                      className={`text-sm ${
                        getRarityColors(item.level, isDarkMode).textLight
                      } m-0 leading-relaxed`}
                    >
                      {item.details}
                    </p>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="text-right">
                <div
                  className={`font-medium ${
                    getRarityColors(item.level, isDarkMode).text
                  }`}
                  dangerouslySetInnerHTML={{ __html: item.adjustedPrice }}
                ></div>
                {shopkeeper.priceModifier !== 0 && (
                  <div
                    className={`text-xs opacity-70 mt-1 ${
                      getRarityColors(item.level, isDarkMode).textIcon
                    }`}
                  >
                    Original: {item.basePrice}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {getCombinedInventory().length === 0 && (
          <div className="text-center py-4 text-stone-500 dark:text-gray-300">
            <span
              className="material-symbols-outlined mb-2 block"
              style={{ fontSize: "48px" }}
            >
              inventory_2
            </span>
            <p>No items match the selected category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventorySection;