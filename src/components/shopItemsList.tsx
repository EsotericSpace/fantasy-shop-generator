// components/ShopItemsList.tsx
import React from "react";
import { getIconForItem, getIconComponent, getRarityBadgeClass } from "../utils/helpers";
import { formatCurrency, parsePriceToGold } from "../utils/pricing";

// PhosphorIcon component
const PhosphorIcon = ({ icon: Icon, weight = "thin", size = 20, ...props }) => (
  <Icon weight={weight} size={size} {...props} />
);

interface ShopItem {
  name: string;
  level?: string;
  details?: string;
  price?: string;
  basePrice?: string;
  adjustedPrice?: string;
  marketPrice?: string;
  type?: string;
  [key: string]: any; // Allow additional properties
}

interface ShopItemsListProps {
  items: ShopItem[];
  mode: 'buying' | 'selling';
  shopkeeper: any;
  onAddItem: (item: ShopItem) => void;
  disabledItems?: string[]; // For items already in cart
  emptyMessage?: string;
  isDarkMode?: boolean;
}

const ShopItemsList: React.FC<ShopItemsListProps> = ({
  items = [],
  mode,
  shopkeeper,
  onAddItem,
  disabledItems = [] as string[],
  emptyMessage = "No items available",
  isDarkMode = false
}) => {
  // Ensure items is always an array
  const safeItems = Array.isArray(items) ? items : [];
  const safeDisabledItems: string[] = Array.isArray(disabledItems) ? disabledItems : [];
  const getDisplayPrice = (item: ShopItem) => {
    if (mode === 'buying') {
      // For buying: show the adjusted price (with shopkeeper's markup/discount)
      const priceStr = item.adjustedPrice || item.price || "0 gp";
      // If it's already formatted with HTML (contains spans), return as is
      if (priceStr.includes('<span')) {
        return priceStr;
      }
      // Otherwise, format it
      const goldValue = parsePriceToGold(priceStr);
      return formatCurrency(goldValue);
    } else {
      // For selling: show the market price
      const priceStr = item.marketPrice || item.basePrice || item.price || "0 gp";
      if (priceStr.includes('<span')) {
        return priceStr;
      }
      const goldValue = parsePriceToGold(priceStr);
      return formatCurrency(goldValue);
    }
  };

  const getOriginalPrice = (item: ShopItem) => {
    const priceStr = item.basePrice || item.price || "0 gp";
    if (priceStr.includes('<span')) {
      return priceStr;
    }
    const goldValue = parsePriceToGold(priceStr);
    return formatCurrency(goldValue);
  };

  const getPriceLabel = (item: ShopItem) => {
    const displayPrice = getDisplayPrice(item);
    
    if (mode === 'buying' && shopkeeper.priceModifier !== 0) {
      // Show original price when there's a modifier
      const originalPrice = getOriginalPrice(item);
      return (
        <span className="inline-flex items-center gap-1">
          <span className="font-medium text-sm"
               dangerouslySetInnerHTML={{ __html: displayPrice }} />
          <span className="text-xs opacity-70 ">
            
          </span>
        </span>
      );
    }
    
    return (
      <span className="font-medium text-sm"
           dangerouslySetInnerHTML={{ __html: displayPrice }} />
    );
  };

  const getItemCardClasses = (level: string | undefined) => {
    const baseClasses = "flex items-center justify-between rounded-lg p-3 transition-colors";
    
    if (!level || level.toLowerCase() === "common") {
      return `${baseClasses} text-stone-600 dark:text-stone-200 bg-stone-50 dark:bg-gray-600 hover:bg-stone-100 dark:hover:bg-gray-700`;
    }
    
    switch (level.toLowerCase()) {
      case "uncommon":
        return `${baseClasses} text-cyan-700 dark:text-cyan-200 hover:bg-teal-50 dark:hover:bg-teal-800`;
      case "rare":
        return `${baseClasses} text-indigo-700 dark:text-indigo-200 hover:bg-violet-50 dark:hover:bg-indigo-900`;
      case "very rare":
        return `${baseClasses} text-rose-600 dark:text-rose-200 hover:bg-pink-50 dark:hover:bg-pink-900`;
      case "legendary":
        return `${baseClasses} text-amber-700 dark:text-amber-200 hover:bg-yellow-50 dark:hover:bg-yellow-800`;
          }
  };

  if (safeItems.length === 0) {
    return (
      <div className="text-center py-4 text-sm">
        <span className="material-symbols-outlined mb-2 block" style={{ fontSize: "48px" }}>
          {mode === 'buying' ? 'inventory_2' : 'search_off'}
        </span>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 p-2">{/* Added padding for consistent spacing */}
      {(safeItems as ShopItem[]).map((item: ShopItem, index: number) => {
        const itemName = item.name || '';
        const isDisabled = safeDisabledItems.includes(itemName);
        const iconValue = getIconForItem(itemName);
        const IconComponent = getIconComponent(itemName);
        
        return (
          <div
            key={`${item.type || mode}-${index}-${itemName}`}
            className={getItemCardClasses(item.level)}
          >
            <div className="flex items-center gap-2 flex-1">
              {/* Item Icon */}
              <div className="flex items-center">
                {iconValue === "phosphor" ? (
                  <PhosphorIcon
                    icon={IconComponent}
                    size={20}
                    weight="light"
                    className="text-sm"
                  />
                ) : (
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "20px" }}
                  >
                    {iconValue}
                  </span>
                )}
              </div>

              {/* Item Name and Details */}
              <div className="flex-1 items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {itemName}
                  </span>
                  {item.level && (
                    <span className={getRarityBadgeClass(item.level)}>
                      {item.level}
                    </span>
                  )}
                  {getPriceLabel(item)}
                </div>
                
                {item.details && (
                  <p className="text-xs mt-0.5 line-clamp-2">
                    {item.details}
                  </p>
                )}
              </div>
            </div>

            {/* Add Button Container */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Add Button */}
              <button
                onClick={() => onAddItem(item)}
                disabled={isDisabled}
                className={`flex items-center justify-center rounded-full transition-all ${
                  isDisabled 
                    ? 'bg-stone-200 dark:bg-gray-700 text-stone-400 dark:text-gray-500 cursor-not-allowed' 
                    : 'text-sm'
                }`}
                title={isDisabled ? "Already added" : `Add ${itemName} to ${mode === 'buying' ? 'cart' : 'sell list'}`}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "20px" }}
                >
                  {isDisabled ? 'check' : 'add_circle'}
                </span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ShopItemsList;