import { itemCategories } from "../data/itemCategories";

// Helper function to get category and icon for any item
export function getCategoryForItem(itemName: string) {
    const normalizedName = itemName.toLowerCase();
  
    for (const [categoryKey, categoryData] of Object.entries(itemCategories)) {
      if (
        categoryData.items.some((item) => item.toLowerCase() === normalizedName)
      ) {
        return {
          category: categoryKey,
          icon: categoryData.icon,
          name: categoryData.name,
        };
      }
    }
  
    // Default fallback
    return {
      category: "miscellaneous",
      icon: "help_outline",
      name: "Miscellaneous",
    };
  }