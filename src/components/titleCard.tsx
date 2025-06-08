// components/TitleCard.tsx
import React from "react";
import { buttonStyles } from "../styles/buttonStyles";

interface TitleCardProps {
  isDarkMode: boolean;
  setIsDarkMode: (darkMode: boolean) => void;
  setShopType: (type: string) => void;
  setSettlementSize: (size: string) => void;
  generateShopkeeper: (shopType: string, settlementSize: string, pricingStyle: string) => void;
  setIsHaggleReaction: (reaction: boolean) => void;
  setCurrentHaggleQuote: (quote: string) => void;
}

const TitleCard: React.FC<TitleCardProps> = ({
  isDarkMode,
  setIsDarkMode,
  setShopType,
  setSettlementSize,
  generateShopkeeper,
  setIsHaggleReaction,
  setCurrentHaggleQuote
}) => {
  const handleRandomize = () => {
    const sizes = ["village", "town", "city"];
    const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
    setShopType("");
    setSettlementSize(randomSize);
    generateShopkeeper("random", randomSize, "random");
    setIsHaggleReaction(false);
    setCurrentHaggleQuote("");
  };

  return (
    <div className="shopkeeper-card rounded-md shadow-md p-6 mb-6 bg-stone-100 dark:bg-gray-700">
      {/* Header with title and randomize button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4">
        <h1 className="text-4xl font-bold text-stone-600 dark:text-gray-300 cinzel shopkeeper-name m-0 leading-none">
          Fantasy Shop Builder
        </h1>

        {/* Controls container */}
        <div className="flex items-center gap-2">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`${buttonStyles.dropdown} gap-2`}
            title={
              isDarkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "20px" }}
            >
              {isDarkMode ? "light_mode" : "dark_mode"}
            </span>
            {isDarkMode ? "Light" : "Dark"}
          </button>

          {/* Randomize Button */}
          <button
            onClick={handleRandomize}
            className={`${buttonStyles.dropdown} gap-2`}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "20px" }}
            >
              casino
            </span>
            Randomize
          </button>
        </div>
      </div>

      {/* Descriptive text in separate container */}
      <div>
        <p className="text-stone-500 dark:text-gray-300 inter text-sm">
          Drop a ready-to-go shop into your game in seconds. Use the dropdowns
          to change the shop type or location. The inventory updates to match.
          <br />
          <br />
          <span className="font-semibold">Coming soon:</span> Shop purchase
          mechanics! Add your items, set quantities, and we'll do the math for
          you.
        </p>
      </div>
    </div>
  );
};

export default TitleCard;