import { itemCategories } from "../data/itemCategories";

// Helper function to get category statistics
export function getCategoryStats() {
    const stats: Record<string, any> = {};
    for (const [key, data] of Object.entries(itemCategories)) {
      stats[key] = {
        name: data.name,
        icon: data.icon,
        count: data.items.length,
      };
    }
    return stats;
  }