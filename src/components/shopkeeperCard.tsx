// components/ShopkeeperCard.tsx
import React from "react";
import { buttonStyles } from "../styles/buttonStyles";
import { shopTypes, pricingStyles, shopIcons } from "../data/constants";
import { races } from "../data/names";
import { getShopkeeperPronouns } from "../utils/shopGeneration";
import { LockKeyIcon, LockKeyOpenIcon } from "@phosphor-icons/react";
import { 
  getInventoryLimits,
  generateCommonItems,
  generateRareItems
} from "../utils/shopGeneration";
import { normalizeShopType } from "../data/shopItems";
import { adjustPrice } from "../utils/pricing";
import { getSettlementData } from "../helpers/getSettlementData";


const PhosphorIcon = ({ icon: Icon, weight = "thin", size = 20, ...props }) => (
  <Icon weight={weight} size={size} {...props} />
);

interface ShopkeeperCardProps {
  shopkeeper: any;
  settlementSize: string;
  selectedPricingStyle: string;
  isLocked: boolean;
  isDropdownOpen: boolean;
  isRaceDropdownOpen: boolean;
  isSettlementDropdownOpen: boolean;
  isShopTypeDropdownOpen: boolean;
  closeAllDropdowns: () => void;
  setIsDropdownOpen: (open: boolean) => void;
  setIsRaceDropdownOpen: (open: boolean) => void;
  setIsSettlementDropdownOpen: (open: boolean) => void;
  setIsShopTypeDropdownOpen: (open: boolean) => void;
  setShopType: (type: string) => void;
  setSettlementSize: (size: string) => void;
  setSelectedPricingStyle: (style: string) => void;
  setShopkeeper: (shopkeeper: any) => void;
  generateShopkeeper: (
    shopType: string,
    settlementSize: string,
    pricingStyle: string
  ) => void;
  regenerateNameForRace: (race: string) => void;
  toggleLock: () => void;
  getCurrentPricingText: () => string;
  replaceRefinementTitle: (
    shopName: string,
    shopType: string,
    priceModifier: number
  ) => string;
  hasRefinementElements: (shopName: string, shopType: string) => boolean;
  regenerateDescriptionForPricing: (priceModifier: number) => any;
  generateShopDescription: any;
  generateMotto: any;
}

const ShopkeeperCard: React.FC<ShopkeeperCardProps> = ({
  shopkeeper,
  settlementSize,
  selectedPricingStyle,
  isLocked,
  isDropdownOpen,
  isRaceDropdownOpen,
  isSettlementDropdownOpen,
  isShopTypeDropdownOpen,
  closeAllDropdowns,
  setIsDropdownOpen,
  setIsRaceDropdownOpen,
  setIsSettlementDropdownOpen,
  setIsShopTypeDropdownOpen,
  setShopType,
  setSettlementSize,
  setSelectedPricingStyle,
  setShopkeeper,
  generateShopkeeper,
  regenerateNameForRace,
  toggleLock,
  getCurrentPricingText,
  replaceRefinementTitle,
  hasRefinementElements,
  regenerateDescriptionForPricing,
  generateShopDescription,
  generateMotto,
}) => {
  if (!shopkeeper) return null;

if (!shopkeeper) return null;


 // Function to regenerate inventory with new price modifier
  const regenerateInventoryWithNewPricing = (newPriceModifier: number) => {
    const limits = getInventoryLimits(settlementSize);
    const normalizedShopType = normalizeShopType(shopkeeper.shopType);
    
    const newCommonItems = generateCommonItems(
      normalizedShopType,
      newPriceModifier,
      limits
    );

    const newRareItems = generateRareItems(
      normalizedShopType,
      newPriceModifier,
      limits
    );

    return { newCommonItems, newRareItems };
  };

  return (
    <div className="shopkeeper-card rounded-md shadow-md p-6 mb-6 bg-stone-100 dark:bg-gray-700">
      <div className="header-content mb-3">
        {/* Shop Name */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
          {/* Shop Name */}
          <h2 className="text-2xl font-bold text-stone-600 dark:text-gray-300 cinzel shopkeeper-name m-0 leading-none">
            {shopkeeper.shopName}
          </h2>

          {/* Dropdowns - wrap on mobile */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Shop Type Dropdown */}
            <div className="relative inline-block">
              <button
                onClick={() => {
                  closeAllDropdowns();
                  setIsShopTypeDropdownOpen(!isShopTypeDropdownOpen);
                }}
                className={buttonStyles.dropdown}
              >
                <span className="flex items-center">
                  {(() => {
                    const icon = shopIcons[shopkeeper.shopType] || "storefront";

                    if (typeof icon === "string") {
                      return (
                        <span className="material-symbols-outlined shop-icon mr-1">
                          {icon}
                        </span>
                      );
                    } else {
                      return (
                        <PhosphorIcon
                          icon={icon}
                          size={20}
                          className="shop-icon mr-1"
                        />
                      );
                    }
                  })()}
                  {shopkeeper.shopType}
                </span>
                <span
                  className="material-symbols-outlined ml-1 leading-none"
                  style={{ fontSize: "14px" }}
                >
                  {isShopTypeDropdownOpen ? "expand_less" : "expand_more"}
                </span>
              </button>

              {isShopTypeDropdownOpen && (
                <div className="dropdown-menu absolute z-10 mt-1 bg-stone-50 dark:bg-gray-700 border border-stone-300 dark:border-gray-600 rounded-lg shadow-lg">
                  <ul className="py-0.5 text-xs text-stone-700 dark:text-gray-300">
                    {shopTypes.map((type) => (
                      <li key={type}>
                        <button
                          onClick={() => {
                            closeAllDropdowns();
                            setShopType(type);
                            generateShopkeeper(
                              type,
                              settlementSize,
                              selectedPricingStyle
                            );
                            setIsShopTypeDropdownOpen(false);
                          }}
                          className={`block w-full text-left px-3 py-1.5 hover:bg-stone-100 text-stone-600 dark:text-gray-300 font-medium inter uppercase tracking-wider ${
                            shopkeeper.shopType === type ? "bg-stone-100" : ""
                          }`}
                        >
                          <span className="flex items-center">
                            {(() => {
                              const icon = shopIcons[type] || "storefront";

                              if (typeof icon === "string") {
                                return (
                                  <span className="material-symbols-outlined shop-icon text-stone-400 mr-1">
                                    {icon}
                                  </span>
                                );
                              } else {
                                return (
                                  <PhosphorIcon
                                    icon={icon}
                                    weight="regular"
                                    className="shop-icon text-stone-400 mr-1"
                                  />
                                );
                              }
                            })()}
                            {type}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <span className="text-stone-600 dark:text-gray-300 text-sm inter">
              in a
            </span>

            {/* Settlement Dropdown */}
            <div className="relative inline-block">
              <button
                onClick={() => {
                  closeAllDropdowns();
                  setIsSettlementDropdownOpen(!isSettlementDropdownOpen);
                }}
                className={buttonStyles.dropdown}
              >
                <span className="flex items-center">
                  {(() => {
                    const settlementData = getSettlementData(settlementSize);
                    if (settlementData.iconType === "phosphor") {
                      return (
                        <PhosphorIcon
                          icon={settlementData.iconComponent}
                          size={20}
                          className="shop-icon mr-1"
                        />
                      );
                    } else {
                      return (
                        <span className="material-symbols-outlined shop-icon mr-1">
                          {settlementData.icon}
                        </span>
                      );
                    }
                  })()}
                  {getSettlementData(settlementSize).text}
                </span>
                <span
                  className="material-symbols-outlined ml-1 leading-none"
                  style={{ fontSize: "14px" }}
                >
                  {isSettlementDropdownOpen ? "expand_less" : "expand_more"}
                </span>
              </button>

              {isSettlementDropdownOpen && (
                <div className="dropdown-menu absolute z-10 mt-1 bg-stone-50 dark:bg-gray-700 border border-stone-300 dark:border-gray-600 rounded-lg shadow-lg">
                  <ul className="py-0.5 text-xs text-stone-700 dark:text-gray-300">
                    {["village", "town", "city"].map((size) => (
                      <li key={size}>
                        <button
                          onClick={() => {
                            closeAllDropdowns();
                            setSettlementSize(size);
                            setIsSettlementDropdownOpen(false);
                          }}
                          className={`block w-full text-left px-3 py-1.5 hover:bg-stone-100 text-stone-600 dark:text-gray-300 font-medium inter uppercase tracking-wider ${
                            settlementSize === size ? "bg-stone-100" : ""
                          }`}
                        >
                          <span className="flex items-center">
                            {(() => {
                              const settlementData = getSettlementData(size);
                              if (settlementData.iconType === "phosphor") {
                                return (
                                  <PhosphorIcon
                                    icon={settlementData.iconComponent}
                                    weight="regular"
                                    className="shop-icon text-stone-400 mr-1"
                                  />
                                );
                              } else {
                                return (
                                  <span className="material-symbols-outlined shop-icon text-stone-400 mr-1">
                                    {settlementData.icon}
                                  </span>
                                );
                              }
                            })()}
                            {size}
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

        {shopkeeper?.shopDescription && (
          <p className="text-stone-600 dark:text-gray-300 inter text-sm mt-1 mb-6">
            {shopkeeper.shopDescription}
          </p>
        )}

        {/* Shopkeeper Name & Race */}
        <div className="flex items-center gap-2 flex-wrap min-w-0 mb-1">
          <h3 className="shopkeeper-name text-lg text-stone-600 dark:text-gray-300 font-semibold cinzel m-0 flex-shrink-0">
            {shopkeeper.name}
          </h3>
          <span className="text-stone-400 font-normal flex-shrink-0">•</span>
          <div className="relative inline-block flex-shrink-0">
            <button
  onClick={() => {
    closeAllDropdowns();
    setIsRaceDropdownOpen(!isRaceDropdownOpen);
  }}
  disabled={isLocked}
  className={buttonStyles.dropdown}
>
              <span className="flex items-center">
                <span className="material-symbols-outlined mr-1 leading-none">
                  person_raised_hand
                </span>
                {shopkeeper.race}
              </span>
              <span
                className="material-symbols-outlined ml-2 leading-none"
                style={{ fontSize: "16px" }}
              >
                {isRaceDropdownOpen ? "expand_less" : "expand_more"}
              </span>
            </button>

            {isRaceDropdownOpen && (
              <div className="dropdown-menu absolute z-10 mt-1 bg-stone-50 dark:bg-gray-700 border border-stone-300 dark:border-gray-600 rounded-lg shadow-lg">
                <ul className="py-0.5 text-xs text-stone-700 dark:text-gray-300">
                  {races.map((race) => (
                    <li key={race}>
                      <button
                        onClick={() => {
                          closeAllDropdowns();
                          regenerateNameForRace(race);
                          setIsRaceDropdownOpen(false);
                        }}
                        className={`block w-full text-left px-3 py-1 hover:bg-stone-100 dark:hover:bg-gray-600 text-stone-600 dark:text-gray-300 font-medium inter uppercase tracking-wider ${
                          shopkeeper.race === race
                            ? "bg-stone-100 dark:bg-stone-600"
                            : ""
                        }`}
                      >
                        <span className="flex items-center">
                          <span className="material-symbols-outlined shop-icon text-stone-400 mr-1">
                            person_raised_hand
                          </span>
                          {race}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <button
            onClick={toggleLock}
            aria-label="Toggle shopkeeper lock"
            className={buttonStyles.icon}
          >
            {isLocked ? (
              <PhosphorIcon
                icon={LockKeyIcon}
                size={20}
                weight="thin"
                title="Locked"
              />
            ) : (
              <PhosphorIcon
                icon={LockKeyOpenIcon}
                size={20}
                weight="thin"
                title="Unlocked"
              />
            )}
          </button>
        </div>

        <div className="space-y-2">
          {/* Shop Motto */}
          <p className="text-sm inter italic text-stone-500 dark:text-gray-400">
            — "{shopkeeper.motto}"
          </p>
        </div>
      </div>

      {/* Shopkeeper Description */}
      <div className="text-stone-600 dark:text-gray-300 inter text-sm mt-1">
        <div className="mb-6">{shopkeeper.description}</div>

        {/* Interactive pricing line */}
        <div className="text-stone-600 dark:text-gray-300 inter text-sm leading-relaxed">
          <span>{shopkeeper.name.split(" ")[0]} maintains </span>
          <span className="relative inline-block">
            <button
              onClick={() => {
                closeAllDropdowns();
                setIsDropdownOpen(!isDropdownOpen);
              }}
              className={buttonStyles.dropdown}
            >
              <span className="flex items-center">
                <span className="material-symbols-outlined mr-1 leading-none">
                  money_bag
                </span>
                {getCurrentPricingText()}
              </span>
              <span
                className="material-symbols-outlined ml-2 leading-none"
                style={{ fontSize: "16px" }}
              >
                {isDropdownOpen ? "expand_less" : "expand_more"}
              </span>
            </button>

            {isDropdownOpen && (
  <div className="dropdown-menu absolute z-10 mt-1 bg-stone-50 dark:bg-gray-700 border border-stone-300 dark:border-gray-600 rounded-lg shadow-lg">
    <ul className="py-0.5 text-xs text-stone-700 dark:text-gray-300">
      
      {/* Combined list - all pricing options sorted high to low */}
      {pricingStyles
  .map((style, index) => {
          const originalIndex = pricingStyles.findIndex(s => s === style);
          
          // Handle Standard (0%) option
          if (style.modifier === 0) {
            return (
              <li key="standard">
                <button
                  onClick={() => {
  console.log("=== STANDARD PRICING DEBUG ===");
  console.log("Before setting - current selectedPricingStyle:", selectedPricingStyle);
  
  closeAllDropdowns();
  const standardIndex = pricingStyles.findIndex(s => s.modifier === 0);
  setSelectedPricingStyle(standardIndex.toString());
  console.log("After setting - should be random");
  console.log("===============================");
  setIsDropdownOpen(false);

                    const standardPricingStyle = pricingStyles.find((style) => style.modifier === 0) || pricingStyles[0];
                    const newPriceModifier = standardPricingStyle.modifier;

                    const descriptionData = regenerateDescriptionForPricing(newPriceModifier);
                    const shopDescriptionData = generateShopDescription(
                      shopkeeper.shopType,
                      settlementSize,
                      newPriceModifier,
                      {
                        location: shopkeeper.shopDescriptionParts.location,
                      }
                    );

                    const newMotto = generateMotto(shopkeeper.shopType, newPriceModifier);

                    let newShopName = shopkeeper.shopName;
                    if (hasRefinementElements(shopkeeper.shopName, shopkeeper.shopType)) {
                      newShopName = replaceRefinementTitle(
                        shopkeeper.shopName,
                        shopkeeper.shopType,
                        newPriceModifier
                      );
                    }
                    // Just adjust prices, don't regenerate inventory
const adjustedCommonItems = shopkeeper.commonItems.map(item => ({
  ...item,
  adjustedPrice: adjustPrice(item.basePrice, newPriceModifier)
}));

const adjustedRareItems = shopkeeper.rareItems.map(item => ({
  ...item,
  adjustedPrice: adjustPrice(item.basePrice, newPriceModifier)
}));

setShopkeeper({
  ...shopkeeper,
  shopName: newShopName,
  priceModifier: newPriceModifier,
  pricingStyle: standardPricingStyle.style,
  motto: newMotto,
  shopDescription: shopDescriptionData.fullDescription,
  shopDescriptionParts: {
    location: shopDescriptionData.location,
    interior: shopDescriptionData.interior,
    texture: shopDescriptionData.texture,
  },
  description: descriptionData.description,
  descriptionTemplate: descriptionData.descriptionTemplate,
  commonItems: adjustedCommonItems,
  rareItems: adjustedRareItems,
});
                  }}
                  className="block w-full text-left px-3 py-1 hover:bg-stone-100 text-stone-600 dark:text-gray-300 font-medium inter uppercase tracking-wider"
                >
                  <span className="flex items-center">
                    <span className="material-symbols-outlined shop-icon text-stone-400 mr-1">
                      money_bag
                    </span>
                    Standard
                  </span>
                </button>
              </li>
            );
          }
          
          // Handle all other pricing options
          const description = style.modifier > 0
            ? `${Math.abs(style.modifier * 100).toFixed(0)}% Above`
            : `${Math.abs(style.modifier * 100).toFixed(0)}% Below`;

          return (
            <li key={style.modifier}>
              <button
                onClick={() => {
  closeAllDropdowns();
  
  const newPriceModifier = style.modifier;
  
  // Store the index instead of the modifier
  const styleIndex = pricingStyles.findIndex(s => s.modifier === style.modifier);
  setSelectedPricingStyle(styleIndex.toString());
console.log("After setting - new selectedPricingStyle should be:", style.modifier.toString());
console.log("==============================");
setIsDropdownOpen(false);

const descriptionData = regenerateDescriptionForPricing(newPriceModifier);
const shopDescriptionData = generateShopDescription(
  shopkeeper.shopType,
  settlementSize,
  newPriceModifier,
  {
    location: shopkeeper.shopDescriptionParts.location,
  }
);
const newMotto = generateMotto(shopkeeper.shopType, newPriceModifier);

let newShopName = shopkeeper.shopName;
if (hasRefinementElements(shopkeeper.shopName, shopkeeper.shopType)) {
  newShopName = replaceRefinementTitle(
    shopkeeper.shopName,
    shopkeeper.shopType,
    newPriceModifier
  );
}

// Update prices on existing items instead of regenerating
const adjustedCommonItems = shopkeeper.commonItems.map(item => ({
  ...item,
  adjustedPrice: adjustPrice(item.basePrice, newPriceModifier)
}));

const adjustedRareItems = shopkeeper.rareItems.map(item => ({
  ...item,
  adjustedPrice: adjustPrice(item.basePrice, newPriceModifier)
}));
                  setShopkeeper({
                    ...shopkeeper,
                    shopName: newShopName,
                    priceModifier: newPriceModifier,
                    pricingStyle: style.style,
                    motto: newMotto,
                    shopDescription: shopDescriptionData.fullDescription,
                    shopDescriptionParts: {
                      location: shopDescriptionData.location,
                      interior: shopDescriptionData.interior,
                      texture: shopDescriptionData.texture,
                    },
                    description: descriptionData.description,
                    descriptionTemplate: descriptionData.descriptionTemplate,
commonItems: adjustedCommonItems,
rareItems: adjustedRareItems,
                  });
                }}
                className="block w-full text-left px-3 py-1.5 hover:bg-stone-100 dark:hover:bg-gray-600 text-stone-600 dark:text-gray-300 font-medium inter uppercase tracking-wider"
              >
                <span className="flex items-center">
                  <span className="material-symbols-outlined shop-icon text-stone-400 mr-1">
                    money_bag
                  </span>
                  {description}
                </span>
              </button>
            </li>
          );
        })}
        
    </ul>
  </div>
)}
          </span>
          <span>
            {" "}
            market rate for {
              getShopkeeperPronouns(shopkeeper.name).possessive
            }{" "}
            wares.
          </span>
        </div>
      </div>
    </div>
  );
};

export default ShopkeeperCard;
