// components/shoppingCart.tsx

import React from "react";

import {
  formatCurrency,
  parsePriceToGold,
  getShopkeeperBuyRate,
} from "../utils/pricing";

import { buttonStyles } from "../styles/buttonStyles";
import { getIconForItem } from "../helpers/getIconForItem";
import { getIconComponent } from "../helpers/getIconComponent";
import { getRarityBadgeClass } from "../helpers/getRarityBadgeClass";

// PhosphorIcon component

const PhosphorIcon = ({ icon: Icon, weight = "thin", size = 20, ...props }) => (
  <Icon weight={weight} size={size} {...props} />
);

// ===== BUYING INTERFACES =====

export interface CartItem {
  name: string;
  quantity: number;
  level?: string;
  price: string;           // Original price
  adjustedPrice: string;   // Shopkeeper's price
  basePrice?: string;      // Market price
  details?: string;
  charismaBonus?: number;  // NEW: Charisma discount percentage
  haggleBonus?: number;    // NEW: Haggling discount percentage
}

export interface ShoppingCartProps {
  cartItems?: CartItem[]; // Make this optional
  shopkeeper: any;
  playerMoney: number;
  onUpdateQuantity: (itemName: string, newQuantity: number) => void;
  onRemoveItem: (itemName: string) => void;
  onCompletePurchase: () => void;
  onClearCart: () => void;
  isDarkMode?: boolean;
  playerCharisma?: number;
  onUpdateCharisma?: (charisma: number) => void;
  buyingHaggleAttempts?: number;
  buyingIsHaggling?: boolean;
  buyingLastHaggleResult?: BuyingHaggleResult | null;
  recentPurchases?: PurchaseRecord[];
  onAttemptHaggle?: () => void;
  onUndoPurchase?: (purchaseId: number) => void;
  calculateEnhancedCartTotal?: () => number;
}

export interface BuyingHaggleResult {
  roll: number;
  total: number;
  dc: number;
  success: boolean;
  bonusPercent: number;
  resultText: string;
}

export interface PurchaseRecord {
  id: number;
  items: CartItem[];
  originalTotal: number;
  finalTotal: number;
  charismaDiscount: number;
  haggleDiscount: number;
  timestamp: Date;
}

// ===== SELLING INTERFACES =====

export interface SellingItem {
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

export interface HaggleResult {
  roll: number;
  total: number;
  dc: number;
  success: boolean;
  bonusPercent: number;
  resultText: string;
}

export interface SaleRecord {
  id: number;
  items: SellingItem[];
  totalValue: number;
  charismaBonus: number;
  haggleBonus: number;
  timestamp: Date;
}

export interface SellingCartProps {
  sellingItems: SellingItem[];
  shopkeeper: any;
  settlementSize: string;
  playerCharisma: number;
  setPlayerCharisma: (charisma: number) => void;
  haggleAttempts: number;
  isHaggling: boolean;
  isLockedOut: boolean;
  lockoutReason: string;
  apologyFee: number;
  hasTriedCharismaCheck: boolean;
  lastHaggleResult: HaggleResult | null;
  recentSales: SaleRecord[];
  onUpdateQuantity: (itemName: string, newQuantity: number) => void;
  onRemoveItem: (itemName: string) => void;
  onExecuteSale: () => void;
  onAttemptHaggle: () => void;
  onApologyPayment: () => void;
  onCharismaCheck: () => void;
  onUndoSale: (saleId: number) => void;
  calculateShopTotalMoney: () => number;
  calculateSaleTotal: () => number;
  getTotalMarketValue: () => number;
  isDarkMode?: boolean;
}

// Utility function for safe property access
const safeGet = (obj: any, path: string, defaultValue: any = "") => {
  try {
    const keys = path.split('.');
    let result = obj;
    for (const key of keys) {
      if (result == null || typeof result !== 'object') return defaultValue;
      result = result[key];
    }
    return result != null ? result : defaultValue;
  } catch {
    return defaultValue;
  }
};

// Utility function for safe array access
const safeArray = (arr: any): any[] => {
  return Array.isArray(arr) ? arr : [];
};

// Utility function for safe object access
const safeObject = (obj: any): any => {
  return obj != null && typeof obj === 'object' ? obj : {};
};

// ===== BUYING COMPONENT (PLAYER PURCHASES FROM SHOP) =====

export const ShoppingCart: React.FC<ShoppingCartProps> = ({
  cartItems,
  shopkeeper,
  playerMoney = 0,
  onUpdateQuantity,
  onRemoveItem,
  onCompletePurchase,
  onClearCart,
  isDarkMode = false,
  playerCharisma = 0,
  onUpdateCharisma,
  buyingHaggleAttempts = 3,
  buyingIsHaggling = false,
  buyingLastHaggleResult = null,
  recentPurchases,
  onAttemptHaggle,
  onUndoPurchase,
  calculateEnhancedCartTotal,
}) => {
  // Ultra-safe checks for all potentially null objects
  const safeCartItems = safeArray(cartItems);
  const safeShopkeeper = safeObject(shopkeeper);
  const safeRecentPurchases = safeArray(recentPurchases);
  const safeBuyingLastHaggleResult = safeObject(buyingLastHaggleResult);

  // Calculate total cart value
  const calculateCartTotal = () => {
    return safeCartItems.reduce((total, item) => {
      if (!item || typeof item !== 'object') return total;
      const itemPrice = parsePriceToGold(safeGet(item, 'adjustedPrice') || safeGet(item, 'price', '0'));
      const quantity = safeGet(item, 'quantity', 0);
      return total + itemPrice * quantity;
    }, 0);
  };

  const calculateOriginalTotal = () => {
    return safeCartItems.reduce((total, item) => {
      if (!item || typeof item !== 'object') return total;
      const basePrice = parsePriceToGold(safeGet(item, 'basePrice') || safeGet(item, 'price', '0'));
      const quantity = safeGet(item, 'quantity', 0);
      return total + basePrice * quantity;
    }, 0);
  };

  const cartTotal = calculateEnhancedCartTotal ? 
    calculateEnhancedCartTotal() : 
    calculateCartTotal();

  const originalTotal = calculateOriginalTotal();
  const canAfford = playerMoney >= cartTotal;

  if (safeCartItems.length === 0) {
    return null; // Don't show empty cart
  }

  return (
    <div className="overflow-visible">
      {/* Cart Items */}
      <div className="pt-4 pb-2">
        <div className="px-4 py-3 bg-stone-50 dark:bg-gray-700 border-t border-x rounded-t-lg border-stone-300 dark:border-gray-500">
          <div className="flex-1 overflow-y-auto pt-2 space-y-1">
            {safeCartItems.map((item, index) => {
              if (!item || typeof item !== 'object') return null;
              
              const itemName = safeGet(item, 'name', 'Unknown Item');
              const itemLevel = safeGet(item, 'level');
              const itemQuantity = safeGet(item, 'quantity', 0);
              const itemPrice = safeGet(item, 'adjustedPrice') || safeGet(item, 'price', '0');
              
              const iconValue = getIconForItem(itemName);
              const IconComponent = getIconComponent(itemName);
              
              return (
                <div
                  key={`cart-${index}-${itemName}`}
                  className="flex items-center justify-between bg-stone-50 dark:bg-gray-600 hover:bg-stone-100 dark:hover:bg-gray-500 rounded-lg p-2"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {/* Item Icon */}
                    <div className="flex-shrink-0">
                      {iconValue === "phosphor" ? (
                        <PhosphorIcon
                          icon={IconComponent}
                          size={20}
                          className="text-stone-500 dark:text-gray-400"
                        />
                      ) : (
                        <span
                          className="material-symbols-outlined text-stone-500 dark:text-gray-400"
                          style={{ fontSize: "20px" }}
                        >
                          {iconValue}
                        </span>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-stone-700 dark:text-gray-200 truncate">
                          {itemName}
                        </span>

                        {itemLevel && (
                          <span className={getRarityBadgeClass(itemLevel)}>
                            {itemLevel}
                          </span>
                        )}

                        <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-gray-400">
                          <span
                            dangerouslySetInnerHTML={{
                              __html: formatCurrency(parsePriceToGold(itemPrice)),
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1 bg-stone-50 dark:bg-gray-700 rounded-md border border-stone-300 p-1">
                      <button
                        onClick={() => onUpdateQuantity?.(itemName, Math.max(0, itemQuantity - 1))}
                        className="w-4 h-4 rounded text-sm flex items-center justify-center transition-colors text-stone-600 dark:text-gray-300 font-medium"
                      >
                        −
                      </button>

                      <span className="w-4 text-center text-sm font-semibold text-stone-600 dark:text-gray-200">
                        {itemQuantity}
                      </span>

                      <button
                        onClick={() => onUpdateQuantity?.(itemName, itemQuantity + 1)}
                        className="w-4 h-4 rounded text-sm flex items-center justify-center transition-colors text-stone-600 dark:text-gray-300 font-medium"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => onRemoveItem?.(itemName)}
                      className={buttonStyles.danger}
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
              );
            })}
          </div>
        </div>

        {/* Haggle Result Display */}
        {buyingLastHaggleResult && typeof buyingLastHaggleResult === 'object' && (
          <div className={`mb-4 p-3 rounded-lg border ${
            safeGet(safeBuyingLastHaggleResult, 'success', false)
              ? "bg-green-50 border-green-300 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-300"
              : "bg-red-50 border-red-300 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-300"
          }`}>
            <div className="flex items-start">
              <span className="material-symbols-outlined mr-2 mt-0.5">
                {safeGet(safeBuyingLastHaggleResult, 'success', false) ? "thumb_up" : "thumb_down"}
              </span>
              <div>
                <p className="font-medium mb-1">{safeGet(safeBuyingLastHaggleResult, 'resultText', '')}</p>
                <p className="text-sm">
                  Roll: {safeGet(safeBuyingLastHaggleResult, 'roll', 0)} + {playerCharisma} = {safeGet(safeBuyingLastHaggleResult, 'total', 0)} vs DC {safeGet(safeBuyingLastHaggleResult, 'dc', 0)}
                  {safeGet(safeBuyingLastHaggleResult, 'success', false) && safeGet(safeBuyingLastHaggleResult, 'bonusPercent', 0) > 0 && (
                    <span className="ml-2 font-medium text-green-600 dark:text-green-400">
                      -{safeGet(safeBuyingLastHaggleResult, 'bonusPercent', 0)}% discount!
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Cart Total and Controls */}
        <div className="rounded-b-lg border border-stone-300 dark:border-gray-500 pt-4">
          <div className="rounded-lg px-4">
            <div className="space-y-2 mb-4">
              {/* Price breakdown */}
              <div className="flex items-center justify-between pl-2 pr-2 text-sm font-medium text-stone-500 dark:text-gray-300">
                <span className="text-stone-600 dark:text-gray-300">
                  Base Price
                </span>
                <span
                  className="font-medium text-stone-700 dark:text-gray-200"
                  dangerouslySetInnerHTML={{
                    __html: formatCurrency(originalTotal),
                  }}
                />
              </div>

              {/* Show shopkeeper's rate */}
              {safeGet(safeShopkeeper, 'priceModifier', 0) !== 0 && (
                <div className="flex items-center justify-between pl-2 pr-2 text-sm text-stone-500 dark:text-gray-300">
                  <span className="text-stone-600 dark:text-gray-300">
                    {safeGet(safeShopkeeper, 'name', 'Shopkeeper').split(" ")[0]}'s{" "}
                    {safeGet(safeShopkeeper, 'priceModifier', 0) > 0 ? "Markup" : "Discount"}
                  </span>
                  <span
                    className={
                      safeGet(safeShopkeeper, 'priceModifier', 0) > 0
                        ? "text-orange-600 dark:text-orange-400"
                        : "text-green-600 dark:text-green-400"
                    }
                  >
                    {safeGet(safeShopkeeper, 'priceModifier', 0) > 0 ? "+" : ""}
                    {Math.round(safeGet(safeShopkeeper, 'priceModifier', 0) * 100)}%
                  </span>
                </div>
              )}

              {/* Charisma Modifier */}
              {onUpdateCharisma && (
                <div className="flex items-center justify-between pl-2 pr-2 text-sm text-stone-500 dark:text-gray-300">
                  <div className="flex items-center gap-4">
                    <span className="text-stone-600 dark:text-gray-300">Charisma Modifier</span>
                    <div className="flex items-center border border-stone-400 dark:border-gray-600 rounded-md">
                      <button
                        onClick={() => onUpdateCharisma(Math.max(-5, playerCharisma - 1))}
                        disabled={playerCharisma <= -5}
                        className="px-1 flex items-center text-stone-600 dark:text-gray-300 hover:bg-stone-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-l-md"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>remove</span>
                      </button>
                      <div className="px-2 text-md font-medium text-stone-600 dark:text-gray-300 text-center">
                        {playerCharisma >= 0 ? `+${playerCharisma}` : playerCharisma}
                      </div>
                      <button
                        onClick={() => onUpdateCharisma(Math.min(5, playerCharisma + 1))}
                        disabled={playerCharisma >= 5}
                        className="px-1 flex items-center text-stone-600 dark:text-gray-300 hover:bg-stone-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-r-md"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>add</span>
                      </button>
                    </div>
                  </div>
                  <span className="text-green-600 dark:text-green-400">-{playerCharisma * 5}%</span>
                </div>
              )}

              {/* Display haggle bonus if any */}
              {safeCartItems.some(item => item && safeGet(item, 'haggleBonus', 0) !== 0) && (
                <div className="flex items-center justify-between pl-2 pr-2 text-sm text-stone-500 dark:text-gray-300">
                  <span className="text-stone-600 dark:text-gray-300">Haggle Discount:</span>
                  <span className="text-green-600 dark:text-green-400">
                    -{Math.abs(safeCartItems.reduce((sum, item) => sum + safeGet(item, 'haggleBonus', 0), 0) / Math.max(safeCartItems.length, 1)).toFixed(1)}%
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
                      __html: formatCurrency(cartTotal),
                    }}
                  />
                </div>

                <div className="till-display">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-stone-500 dark:text-gray-300">
                      Your Gold After Purchase
                    </span>
                    <div
                      className={`till-amount font-medium ${
                        canAfford
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      <span
                        dangerouslySetInnerHTML={{
                          __html: formatCurrency(Math.max(0, playerMoney - cartTotal)),
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={onCompletePurchase}
          disabled={!canAfford || safeCartItems.length === 0}
          className={`${buttonStyles.sale} flex-1`}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "18px" }}
          >
            {canAfford ? "shopping_cart_checkout" : "money_off"}
          </span>
          {canAfford ? "Complete Purchase" : "Insufficient Funds"}
        </button>

        {/* Haggle Button */}
        {onAttemptHaggle && (
          <button
            onClick={onAttemptHaggle}
            disabled={safeCartItems.length === 0 || buyingHaggleAttempts <= 0 || buyingIsHaggling}
            className={`${buttonStyles.primary} flex-none ${buyingIsHaggling ? "animate-pulse" : ""}`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>handshake</span>
            {safeCartItems.length === 0 ? "No Items" : `Haggle (${buyingHaggleAttempts} left)`}
          </button>
        )}

        <button
          onClick={onClearCart}
          className={`${buttonStyles.secondary} flex-none`}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "18px" }}
          >
            clear_all
          </span>
          Clear Cart
        </button>
      </div>

      {/* Recent Purchases - MOVED OUTSIDE action buttons */}
      {safeRecentPurchases.length > 0 && (
        <div className="rounded-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-stone-600 dark:text-gray-300 inter shopkeeper-name mb-4">
            Recent Purchases
          </h3>
          <div className="space-y-3">
            {safeRecentPurchases.map((purchase, index) => {
              if (!purchase || typeof purchase !== 'object') return null;
              
              const purchaseId = safeGet(purchase, 'id', index);
              const purchaseItems = safeArray(safeGet(purchase, 'items', []));
              const purchaseTimestamp = safeGet(purchase, 'timestamp');
              const purchaseFinalTotal = safeGet(purchase, 'finalTotal', 0);
              const purchaseCharismaDiscount = safeGet(purchase, 'charismaDiscount', 0);
              const purchaseHaggleDiscount = safeGet(purchase, 'haggleDiscount', 0);
              
              return (
                <div key={purchaseId} className="flex items-center justify-between bg-stone-200 dark:bg-gray-600 rounded-lg p-2">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-stone-600 dark:text-gray-200 mb-1">
                      {purchaseItems.map((item, itemIndex) => {
                        if (!item || typeof item !== 'object') return '';
                        const itemName = safeGet(item, 'name', 'Unknown');
                        const itemQuantity = safeGet(item, 'quantity', 0);
                        return `${itemName} ×${itemQuantity}`;
                      }).filter(Boolean).join(", ") || "No items"}
                    </div>
                    <div className="text-xs text-stone-500 dark:text-gray-400">
                      {purchaseTimestamp && typeof purchaseTimestamp.toLocaleTimeString === 'function' 
                        ? purchaseTimestamp.toLocaleTimeString() 
                        : "Unknown time"}
                      {purchaseCharismaDiscount > 0 && <span> • -{purchaseCharismaDiscount}% charisma</span>}
                      {purchaseHaggleDiscount > 0 && <span> • -{purchaseHaggleDiscount.toFixed(1)}% haggled</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-sm font-medium text-stone-600 dark:text-gray-200" 
                      dangerouslySetInnerHTML={{__html: formatCurrency(purchaseFinalTotal)}} 
                    />
                    {onUndoPurchase && (
                      <button 
                        onClick={() => onUndoPurchase(purchaseId)} 
                        className="text-red-500 hover:text-red-700 text-xs px-2 py-1 border border-red-300 hover:border-red-500 rounded transition-colors"
                      >
                        Undo
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ===== SELLING COMPONENT (PLAYER SELLS TO SHOP) =====

export const SellingCart: React.FC<SellingCartProps> = ({
  sellingItems,
  shopkeeper,
  settlementSize,
  playerCharisma,
  setPlayerCharisma,
  haggleAttempts,
  isHaggling,
  isLockedOut,
  lockoutReason,
  apologyFee,
  hasTriedCharismaCheck,
  lastHaggleResult,
  recentSales,
  onUpdateQuantity,
  onRemoveItem,
  onExecuteSale,
  onAttemptHaggle,
  onApologyPayment,
  onCharismaCheck,
  onUndoSale,
  calculateShopTotalMoney,
  calculateSaleTotal,
  getTotalMarketValue,
  isDarkMode = false,
}) => {
  // Ultra-safe checks for potentially null objects
  const safeSellingItems = safeArray(sellingItems);
  const safeShopkeeper = safeObject(shopkeeper);
  const safeRecentSales = safeArray(recentSales);
  const safeLastHaggleResult = safeObject(lastHaggleResult);

  // 🔍 DEBUG: Log what SellingCart receives
  console.log("🔍 SellingCart Debug:", {
    sellingItemsReceived: safeSellingItems,
    sellingItemsLength: safeSellingItems.length,
    sellingItemsType: typeof safeSellingItems,
    recentSalesLength: safeRecentSales.length,
    shouldReturn: safeSellingItems.length === 0 && safeRecentSales.length === 0,
  });

  const saleTotal = calculateSaleTotal ? calculateSaleTotal() : 0;
  const shopMoney = calculateShopTotalMoney ? calculateShopTotalMoney() : 0;
  const totalMarketValue = getTotalMarketValue ? getTotalMarketValue() : 0;

  return (
    <div className="overflow-visible">
      {/* Current Cart */}
      {safeSellingItems.length > 0 && (
        <div className="overflow-visible">
          {/* Cart Items */}
          <div className="pt-4 pb-2">
            <div className="px-4 py-3 bg-stone-50 dark:bg-gray-700 border-t border-x rounded-t-lg border-stone-300 dark:border-gray-500">
              <div className="flex-1 overflow-y-auto pt-2 space-y-1">
                {safeSellingItems.map((item, index) => {
                  if (!item || typeof item !== 'object') return null;
                  
                  const itemName = safeGet(item, 'name', 'Unknown Item');
                  const itemLevel = safeGet(item, 'level', '');
                  const itemQuantity = safeGet(item, 'quantity', 0);
                  const itemPrice = safeGet(item, 'price', '0');
                  
                  const iconValue = getIconForItem(itemName);
                  const IconComponent = getIconComponent(itemName);
                  
                  return (
                    <div
                      key={`${itemName}-${index}`}
                      className="flex items-center justify-between bg-stone-50 dark:bg-gray-600 hover:bg-stone-100 dark:hover:bg-gray-500 rounded-lg p-2"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {/* Item Icon */}
                        <div className="flex-shrink-0">
                          {iconValue === "phosphor" ? (
                            <PhosphorIcon
                              icon={IconComponent}
                              size={20}
                              className="text-stone-500 dark:text-gray-400"
                            />
                          ) : (
                            <span
                              className="material-symbols-outlined text-stone-500 dark:text-gray-400"
                              style={{ fontSize: "20px" }}
                            >
                              {iconValue}
                            </span>
                          )}
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-stone-700 dark:text-gray-200 truncate">
                              {itemName}
                            </span>

                            <span className={getRarityBadgeClass(itemLevel)}>
                              {itemLevel}
                            </span>

                            <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-gray-400">
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: formatCurrency(parsePriceToGold(itemPrice)),
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
                            onClick={() => onUpdateQuantity?.(itemName, Math.max(0, itemQuantity - 1))}
                            className="w-4 h-4 rounded text-sm flex items-center justify-center transition-colors text-stone-600 dark:text-gray-300 font-medium"
                          >
                            −
                          </button>

                          <span className="w-4 text-center text-sm font-semibold text-stone-600 dark:text-gray-200">
                            {itemQuantity}
                          </span>

                          <button
                            onClick={() => onUpdateQuantity?.(itemName, itemQuantity + 1)}
                            className="w-4 h-4 rounded text-sm flex items-center justify-center transition-colors text-stone-600 dark:text-gray-300 font-medium"
                          >
                            +
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => onRemoveItem?.(itemName)}
                          className={buttonStyles.danger}
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
                  );
                })}
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
                          {safeGet(safeShopkeeper, 'name', 'Shopkeeper').split(" ")[0]} refuses to negotiate
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
                              onClick={onApologyPayment}
                              disabled={shopMoney < apologyFee}
                              className="px-3 py-2 bg-green-100 border border-green-400 hover:bg-green-200 disabled:bg-stone-200 dark:disabled:bg-gray-600 text-green-700 disabled:text-stone-500 dark:disabled:text-gray-400 text-sm rounded transition-colors disabled:cursor-not-allowed"
                            >
                              Pay Apology Fee
                            </button>

                            <button
                              onClick={onCharismaCheck}
                              disabled={hasTriedCharismaCheck}
                              className="px-3 py-2 bg-blue-100 border border-blue-400 hover:bg-blue-200 disabled:bg-stone-200 dark:disabled:bg-gray-600 text-blue-700 disabled:text-stone-500 dark:disabled:text-gray-400 text-sm rounded transition-colors disabled:cursor-not-allowed"
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
                {lastHaggleResult && typeof lastHaggleResult === 'object' && (
                  <div
                    className={`mb-4 p-3 rounded-lg border ${
                      safeGet(safeLastHaggleResult, 'success', false)
                        ? "bg-green-50 border-green-300 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-300"
                        : safeGet(safeLastHaggleResult, 'bonusPercent', 0) < 0
                        ? "bg-orange-50 border-orange-300 text-orange-700 dark:bg-orange-900 dark:border-orange-700 dark:text-orange-300"
                        : "bg-red-50 border-red-300 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-300"
                    }`}
                  >
                    <div className="flex items-start">
                      <span className="material-symbols-outlined mr-2 mt-0.5">
                        {safeGet(safeLastHaggleResult, 'success', false)
                          ? "thumb_up"
                          : safeGet(safeLastHaggleResult, 'bonusPercent', 0) < 0
                          ? "trending_down"
                          : "thumb_down"}
                      </span>

                      <div>
                        <p className="font-medium mb-1">
                          {safeGet(safeLastHaggleResult, 'resultText', '')}
                        </p>

                        <p className="text-sm">
                          Roll: {safeGet(safeLastHaggleResult, 'roll', 0)} + {playerCharisma} ={" "}
                          {safeGet(safeLastHaggleResult, 'total', 0)} vs DC {safeGet(safeLastHaggleResult, 'dc', 0)}
                          {safeGet(safeLastHaggleResult, 'success', false) &&
                            safeGet(safeLastHaggleResult, 'bonusPercent', 0) > 0 && (
                              <span className="ml-2 font-medium text-green-600 dark:text-green-400">
                                +{safeGet(safeLastHaggleResult, 'bonusPercent', 0)}% bonus!
                              </span>
                            )}
                          {!safeGet(safeLastHaggleResult, 'success', false) &&
                            safeGet(safeLastHaggleResult, 'bonusPercent', 0) < 0 && (
                              <span className="ml-2 font-medium text-orange-600 dark:text-orange-400">
                                {safeGet(safeLastHaggleResult, 'bonusPercent', 0)}% penalty!
                              </span>
                            )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between pl-2 pr-2 text-sm font-medium text-stone-500 dark:text-gray-300">
                    <span className="text-stone-600 dark:text-gray-300">
                      Base Price
                    </span>

                    <span
                      className="font-medium text-stone-700 dark:text-gray-200"
                      dangerouslySetInnerHTML={{
                        __html: formatCurrency(totalMarketValue),
                      }}
                    ></span>
                  </div>

                  <div className="flex items-center justify-between pl-2 pr-2 text-sm text-stone-500 dark:text-gray-300">
                    <span className="text-stone-600 dark:text-gray-300">
                      {safeGet(safeShopkeeper, 'name', 'Shopkeeper').split(" ")[0]}'s Rate
                    </span>

                    <span className="text-stone-600 dark:text-gray-300">
                      {Math.round(
                        getShopkeeperBuyRate(
                          safeGet(safeShopkeeper, 'priceModifier', 0),
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
                          onClick={() => setPlayerCharisma?.(Math.max(-5, playerCharisma - 1))}
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
                          onClick={() => setPlayerCharisma?.(Math.min(5, playerCharisma + 1))}
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
                  {safeSellingItems.some(item => item && safeGet(item, 'haggleBonus', 0) !== 0) && (
                    <div className="flex items-center justify-between pl-2 pr-2 text-sm text-stone-500 dark:text-gray-300">
                      <span className="text-stone-600 dark:text-gray-300">
                        {(() => {
                          const maxBonus = Math.max(...safeSellingItems.map(item => safeGet(item, 'haggleBonus', 0)));
                          const minBonus = Math.min(...safeSellingItems.map(item => safeGet(item, 'haggleBonus', 0)));

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
                          const netBonus = safeSellingItems.reduce((sum, item) => sum + safeGet(item, 'haggleBonus', 0), 0) / Math.max(safeSellingItems.length, 1);
                          return netBonus >= 0
                            ? "text-green-600 dark:text-green-400"
                            : "text-orange-600 dark:text-orange-400";
                        })()}`}
                      >
                        {(() => {
                          const totalBonus = safeSellingItems.reduce((sum, item) => sum + safeGet(item, 'haggleBonus', 0), 0);
                          const avgBonus = totalBonus / Math.max(safeSellingItems.length, 1);
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
                          __html: formatCurrency(saleTotal),
                        }}
                      ></span>
                    </div>

                    <div className="till-display">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-stone-500 dark:text-gray-300">
                          Shop Treasury After Sale
                        </span>

                        <span className="flex items-center text-sm text-stone-500 dark:text-gray-300"></span>

                        <div
                          className={`till-amount font-medium ${(() => {
                            if (safeSellingItems.length === 0 || isLockedOut) {
                              return "text-stone-600 dark:text-gray-300";
                            }

                            const remainingAfterSale = shopMoney - saleTotal;

                            return remainingAfterSale < 0
                              ? "text-red-600 dark:text-red-400"
                              : "text-green-600 dark:text-green-400";
                          })()}`}
                        >
                          {(() => {
                            if (safeSellingItems.length === 0 || isLockedOut) {
                              return (
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: safeGet(safeShopkeeper, 'availableMoney', ''),
                                  }}
                                />
                              );
                            }

                            const remainingAfterSale = shopMoney - saleTotal;

                            if (remainingAfterSale < 0) {
                              const absoluteValue = Math.abs(remainingAfterSale);
                              const formattedPositive = formatCurrency(absoluteValue);
                              // Insert the minus sign after the icons but before the numbers
                              // Format should be: [icons]-123 instead of -[icons]123
                              const withMinusSign = formattedPositive.replace(
                                /(\d+)/, // Find the first number
                                "-$1" // Replace it with -number
                              );

                              return (
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: withMinusSign,
                                  }}
                                />
                              );
                            } else {
                              return (
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: formatCurrency(remainingAfterSale),
                                  }}
                                />
                              );
                            }
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-4">
            {/* Complete Sale Button */}
            <button
              onClick={onExecuteSale}
              disabled={(() => {
                if (safeSellingItems.length === 0 || isLockedOut) return true;
                return saleTotal > shopMoney;
              })()}
              className={`${buttonStyles.sale} flex-1`}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "18px" }}
              >
                {(() => {
                  if (isLockedOut) return "block";
                  if (safeSellingItems.length === 0) return "block";
                  if (saleTotal > shopMoney) return "money_off";
                  return "sell";
                })()}
              </span>

              {(() => {
                if (isLockedOut) return "Selling Locked";
                if (safeSellingItems.length === 0) return "Complete Sale";
                if (saleTotal > shopMoney) return "Insufficient Funds";
                return "Complete Sale";
              })()}
            </button>

            {/* Haggle Button */}
            <button
              onClick={onAttemptHaggle}
              disabled={
                safeSellingItems.length === 0 ||
                haggleAttempts <= 0 ||
                isHaggling ||
                isLockedOut ||
                saleTotal > shopMoney
              }
              className={`${buttonStyles.primary} flex-none ${
                isHaggling ? "animate-pulse" : ""
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "18px" }}
              >
                {(() => {
                  if (isLockedOut) return "block";
                  if (saleTotal > shopMoney) return "cancel";
                  return "handshake";
                })()}
              </span>

              {(() => {
                if (isLockedOut) return "Relations Damaged";
                if (safeSellingItems.length === 0) return "No Items to Haggle";
                if (saleTotal > shopMoney) return "Cannot Haggle";
                return `Haggle (${haggleAttempts} left)`;
              })()}
            </button>
          </div>
        </div>
      )}

      {/* Recent Sales */}
      {safeRecentSales.length > 0 && (
        <div className="rounded-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-stone-600 dark:text-gray-300 inter shopkeeper-name mb-4">
            Recent Sales
          </h3>

          <div className="space-y-3">
            {safeRecentSales.map((sale, index) => {
              if (!sale || typeof sale !== 'object') return null;
              
              const saleId = safeGet(sale, 'id', index);
              const saleItems = safeArray(safeGet(sale, 'items', []));
              const saleTimestamp = safeGet(sale, 'timestamp');
              const saleTotalValue = safeGet(sale, 'totalValue', 0);
              const saleCharismaBonus = safeGet(sale, 'charismaBonus', 0);
              const saleHaggleBonus = safeGet(sale, 'haggleBonus', 0);
              
              return (
                <div
                  key={saleId}
                  className="flex items-center justify-between bg-stone-200 dark:bg-gray-600 rounded-lg p-2"
                >
                  <div className="flex-1">
                    <div className="text-sm font-medium text-stone-600 dark:text-gray-200 mb-1">
                      {saleItems.map((item, itemIndex) => {
                        if (!item || typeof item !== 'object') return '';
                        const itemName = safeGet(item, 'name', 'Unknown');
                        const itemQuantity = safeGet(item, 'quantity', 0);
                        return `${itemName} ×${itemQuantity}`;
                      }).filter(Boolean).join(", ") || "No items"}
                    </div>

                    <div className="text-xs text-stone-500 dark:text-gray-400">
                      {saleTimestamp && typeof saleTimestamp.toLocaleTimeString === 'function'
                        ? saleTimestamp.toLocaleTimeString()
                        : "Unknown time"}
                      {saleCharismaBonus > 0 && (
                        <span> • +{saleCharismaBonus}% charisma</span>
                      )}
                      {saleHaggleBonus > 0 && (
                        <span> • +{saleHaggleBonus}% haggled</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className="text-sm font-medium text-stone-600 dark:text-gray-200"
                      dangerouslySetInnerHTML={{
                        __html: formatCurrency(saleTotalValue),
                      }}
                    ></span>

                    <button
                      onClick={() => onUndoSale?.(saleId)}
                      className="text-red-500 hover:text-red-700 text-xs px-2 py-1 border border-red-300 hover:border-red-500 rounded transition-colors"
                    >
                      Undo
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Default export remains ShoppingCart for backward compatibility

export default ShoppingCart;