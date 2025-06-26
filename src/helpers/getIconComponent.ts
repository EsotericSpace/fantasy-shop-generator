import { getCategoryForItem } from "./getCategoryForItem";

// Helper function to get the actual icon component
export function getIconComponent(itemName: string) {
    const categoryInfo = getCategoryForItem(itemName);
    return categoryInfo.icon;
  }