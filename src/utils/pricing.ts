// utils/pricing.ts

// Fixed parsePriceToGold function that handles commas and HTML
export const parsePriceToGold = (priceString: string | number): number => {
  if (!priceString) return 0;

  // Remove HTML tags and commas, then extract numeric values
  const cleanPrice = priceString.toString().replace(/<[^>]*>/g, "").replace(/,/g, "");

  let totalGold = 0;

  // Handle plain text format like "4000 gp", "3 gp 5 sp", "50 sp", "100 cp"
  // Look for gold pieces (gp)
  const gpMatch = cleanPrice.match(/(\d+(?:\.\d+)?)\s*gp/i);
  if (gpMatch) {
    totalGold += parseFloat(gpMatch[1]);
  }

  // Look for silver pieces (sp) - convert to gold
  const spMatch = cleanPrice.match(/(\d+(?:\.\d+)?)\s*sp/i);
  if (spMatch) {
    totalGold += parseFloat(spMatch[1]) / 10;
  }

  // Look for copper pieces (cp) - convert to gold
  const cpMatch = cleanPrice.match(/(\d+(?:\.\d+)?)\s*cp/i);
  if (cpMatch) {
    totalGold += parseFloat(cpMatch[1]) / 100;
  }

  // Handle HTML format with poker_chip spans (fallback)
  if (totalGold === 0) {
    // Look for gold in HTML format
    const htmlGpMatch = cleanPrice.match(/poker_chip[^>]*>(\d+)/g);
    if (htmlGpMatch && htmlGpMatch.length >= 1) {
      const goldValue = htmlGpMatch[0].match(/(\d+)/);
      if (goldValue) totalGold += parseFloat(goldValue[1]);
    }

    if (htmlGpMatch && htmlGpMatch.length >= 2) {
      const silverValue = htmlGpMatch[1].match(/(\d+)/);
      if (silverValue) totalGold += parseFloat(silverValue[1]) / 10;
    }

    if (htmlGpMatch && htmlGpMatch.length >= 3) {
      const copperValue = htmlGpMatch[2].match(/(\d+)/);
      if (copperValue) totalGold += parseFloat(copperValue[1]) / 100;
    }
  }

  // Final fallback: if no currency markers found, assume it's a number in gold
  if (totalGold === 0) {
    const numberMatch = cleanPrice.match(/(\d+(?:\.\d+)?)/);
    if (numberMatch) {
      totalGold = parseFloat(numberMatch[1]);
    }
  }

  return totalGold;
};

// Function to format currency into gp, sp, cp with icons
export const formatCurrency = (valueInGold: number): string => {
  const gp = Math.floor(valueInGold);
  const sp = Math.floor((valueInGold - gp) * 10);
  const cp = Math.round(((valueInGold - gp) * 10 - sp) * 10);

  let result = "";

  if (gp > 0) {
    result += `<span class="currency-wrapper"><span class="material-symbols-outlined currency-icon gold-icon">poker_chip</span>${gp}</span>`;
  }

  if (sp > 0) {
    result += `<span class="currency-wrapper"><span class="material-symbols-outlined currency-icon silver-icon">poker_chip</span>${sp}</span>`;
  }

  if (cp > 0) {
    result += `<span class="currency-wrapper"><span class="material-symbols-outlined currency-icon copper-icon">poker_chip</span>${cp}</span>`;
  }

  if (result === "") {
    result = `<span class="currency-wrapper"><span class="material-symbols-outlined currency-icon copper-icon">poker_chip</span>0</span>`;
  }

  return result;
};

// Function to adjust price based on shopkeeper's pricing style
export const adjustPrice = (basePrice: string | number, modifier: number): string => {
  let priceStr = basePrice.toString();

  // Parse the base price
  let value = 0;
  let currency = "";

  // Handle prices with commas
  const priceWithoutCommas = priceStr.replace(/,/g, "");

  if (priceWithoutCommas.includes("gp")) {
    value = parseFloat(priceWithoutCommas.split("gp")[0].trim());
    currency = "gp";
  } else if (priceWithoutCommas.includes("sp")) {
    value = parseFloat(priceWithoutCommas.split("sp")[0].trim());
    currency = "sp";
  } else if (priceWithoutCommas.includes("cp")) {
    value = parseFloat(priceWithoutCommas.split("cp")[0].trim());
    currency = "cp";
  } else {
    // Fallback - assume it's gold
    value = parseFloat(priceWithoutCommas) || 0;
    currency = "gp";
  }

  // Handle complex prices like "3 gp 5 sp"
  if (
    priceWithoutCommas.includes("gp") &&
    priceWithoutCommas.includes("sp")
  ) {
    const gpPart = parseFloat(priceWithoutCommas.split("gp")[0].trim());
    const spPart = parseFloat(
      priceWithoutCommas.split("gp")[1].split("sp")[0].trim()
    );
    value = gpPart + spPart / 10;
    currency = "gp";
  }

  // Apply the modifier
  const adjustedValue = value * (1 + modifier);

  // Convert everything to gold for consistent formatting
  let finalGoldValue = adjustedValue;
  if (currency === "sp") {
    finalGoldValue = adjustedValue / 10;
  } else if (currency === "cp") {
    finalGoldValue = adjustedValue / 100;
  }

  return formatCurrency(finalGoldValue);
};

export const calculateBuyPrice = (goldValue: number, shopRate: number, charismaBonusPercent: number): number => {
  // goldValue is already in gold (from parsePriceToGold)
  // shopRate is a decimal (like 0.45 for 45%)
  // charismaBonusPercent is already a percentage (like 15 for 15%)

  const effectiveRate = Math.min(0.8, shopRate + charismaBonusPercent / 100);
  return goldValue * effectiveRate;
};

export const getShopkeeperBuyRate = (priceModifier: number, settlementSize: string): number => {
  // Base shop rate depends on settlement size
  let baseRate: number;

  switch (settlementSize) {
    case "village":
      baseRate = 0.4; // 40% base rate
      break;
    case "town":
      baseRate = 0.45; // 45% base rate
      break;
    case "city":
      baseRate = 0.5; // 50% base rate
      break;
    default:
      baseRate = 0.45;
  }

  // Shopkeeper's personality affects how much they pay
  // If they charge more (positive modifier), they pay less
  // If they charge less (negative modifier), they pay more
  const personalityAdjustment = -priceModifier * 0.5; // Inverse relationship, but smaller impact

  const finalRate = Math.max(
    0.2,
    Math.min(0.7, baseRate + personalityAdjustment)
  );

  return finalRate;
};

// Generate shopkeeper's available money with guaranteed mixed denominations
export const generateShopkeeperMoney = (settlementSize: string): string => {
  let gold = 0;
  let silver = 0;
  let copper = 0;

  switch (settlementSize) {
    case "village":
      // Villages: modest amounts, rounded to 10s
      const villageRolls =
        Math.floor(Math.random() * 4) + 1 + Math.floor(Math.random() * 4) + 1;
      gold = villageRolls * 10; // 20-80 gp
      silver = (Math.floor(Math.random() * 6) + 2) * 10; // 20-70 sp
      copper = (Math.floor(Math.random() * 8) + 3) * 10; // 30-100 cp
      break;

    case "town":
      // Towns: moderate amounts, rounded to 10s
      let townRolls = 0;
      for (let i = 0; i < 4; i++) {
        townRolls += Math.floor(Math.random() * 4) + 1;
      }
      gold = townRolls * 10; // 40-160 gp
      silver = (Math.floor(Math.random() * 8) + 3) * 10; // 30-100 sp
      copper = (Math.floor(Math.random() * 12) + 4) * 10; // 40-150 cp
      break;

    case "city":
    default:
      // Cities: large amounts, rounded to 10s
      const cityBase = (Math.floor(Math.random() * 4) + 1) * 100;
      const cityExtra =
        (Math.floor(Math.random() * 4) +
          1 +
          Math.floor(Math.random() * 4) +
          1) *
        10;
      gold = cityBase + cityExtra; // 120-200 gp
      silver = (Math.floor(Math.random() * 10) + 5) * 10; // 50-140 sp
      copper = (Math.floor(Math.random() * 15) + 8) * 10; // 80-220 cp
      break;
  }

  // Generate HTML directly with exact amounts
  let result = "";

  if (gold > 0) {
    result += `<span class="currency-wrapper"><span class="material-symbols-outlined currency-icon gold-icon" data-tooltip="Gold Piece">poker_chip</span>${gold}</span>`;
  }

  if (silver > 0) {
    result += `<span class="currency-wrapper"><span class="material-symbols-outlined currency-icon silver-icon" data-tooltip="Silver Piece">poker_chip</span>${silver}</span>`;
  }

  if (copper > 0) {
    result += `<span class="currency-wrapper"><span class="material-symbols-outlined currency-icon copper-icon" data-tooltip="Copper Piece">poker_chip</span>${copper}</span>`;
  }

  return result;
};