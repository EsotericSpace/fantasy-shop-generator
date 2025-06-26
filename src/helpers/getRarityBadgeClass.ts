// Get rarity badge class
export const getRarityBadgeClass = (rarity: string) => {
    const normalizedRarity = rarity.toLowerCase().replace(/\s+/g, "-");
    switch (normalizedRarity) {
      case "common":
        return "rarity-badge rarity-common";
      case "uncommon":
        return "rarity-badge rarity-uncommon";
      case "rare":
        return "rarity-badge rarity-rare";
      case "very-rare":
        return "rarity-badge rarity-very-rare";
      case "legendary":
        return "rarity-badge rarity-legendary";
      default:
        return "rarity-badge rarity-common";
    }
  };