import { getCategoryForItem } from "./getCategoryForItem";

// Helper function to get icon for item (shortcut)
export function getIconForItem(itemName: string) {
    const categoryInfo = getCategoryForItem(itemName);
    const icon = categoryInfo.icon;
  
    // If it's a string, it's a Material Symbol
    if (typeof icon === "string") {
      return icon;
    }
  
    // If it's a component, return 'phosphor' as a flag
    return "phosphor";
  }