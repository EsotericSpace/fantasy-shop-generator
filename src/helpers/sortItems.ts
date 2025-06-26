import { parsePriceToGold } from "../utils/pricing";

// Sort items function
export const sortItems = (items: any[], sortMode: string) => {
    if (!items || items.length === 0) return items;
  
    // Add adjustedPriceValue to items if not present
    const itemsWithPriceValue = items.map((item) => ({
      ...item,
      adjustedPriceValue:
        item.adjustedPriceValue || parsePriceToGold(item.adjustedPrice),
    }));
  
    if (sortMode === "alpha") {
      return [...itemsWithPriceValue].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    } else if (sortMode === "price-asc") {
      return [...itemsWithPriceValue].sort(
        (a, b) => a.adjustedPriceValue - b.adjustedPriceValue
      );
    } else if (sortMode === "price-desc") {
      return [...itemsWithPriceValue].sort(
        (a, b) => b.adjustedPriceValue - a.adjustedPriceValue
      );
    }
    return itemsWithPriceValue;
  };