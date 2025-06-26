import { itemCategories } from "../data/itemCategories";

// Helper function to get all items in a category
export function getItemsInCategory(categoryKey: string) {
    return itemCategories[categoryKey]?.items || [];
  }