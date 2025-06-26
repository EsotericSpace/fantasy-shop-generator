// hooks/useShopkeeper.ts
import { useState } from 'react';
import { shopTypes, pricingStyles } from '../data/constants';
import { races, firstNames, lastNames, raceNamingStyles } from '../data/names';
import { shopkeeperTitles } from '../data/shopNaming';
import { 
  generateShopName,
  generateShopDescription,
  generateMotto,
  generateShopkeeperMoney,
  getShopRefinement,
  applyNameAndPronouns,
  generateShopkeeperDescriptionWithTemplate,
  getInventoryLimits,
  generateCommonItems,
  generateRareItems
} from '../utils/shopGeneration';

export const useShopkeeper = () => {
  const [shopkeeper, setShopkeeper] = useState(null);
  const [shopType, setShopType] = useState("");
  const [settlementSize, setSettlementSize] = useState("");
  const [selectedPricingStyle, setSelectedPricingStyle] = useState("random");
  const [isLocked, setIsLocked] = useState(false);
  const [lockedShopkeeperIdentity, setLockedShopkeeperIdentity] = useState(null);

  const getCurrentPricingText = () => {
    if (selectedPricingStyle === "random") return "Standard";

    const index = parseInt(selectedPricingStyle);
    if (isNaN(index) || index < 0 || index >= pricingStyles.length) {
      return "Standard";
    }

    const style = pricingStyles[index];
    if (!style) return "Standard";

    return style.modifier > 0
      ? `${Math.abs(style.modifier * 100).toFixed(0)}% Above`
      : style.modifier < 0
      ? `${Math.abs(style.modifier * 100).toFixed(0)}% Below`
      : "Standard";
  };

  const regenerateDescriptionForPricing = (newPriceModifier: number) => {
    if (!shopkeeper) return { description: "", descriptionTemplate: "" };
    
    const descriptionData = generateShopkeeperDescriptionWithTemplate(
      {
        name: shopkeeper.name,
        race: shopkeeper.race,
        shopType: shopkeeper.shopType,
      },
      newPriceModifier
    );

    return {
      description: descriptionData.finalDescription,
      descriptionTemplate: descriptionData.template,
    };
  };

  const hasRefinementElements = (shopName: string, shopType: string) => {
    const allTitles = [
      ...(shopkeeperTitles.refined[shopType] || []),
      ...(shopkeeperTitles.standard[shopType] || []),
      ...(shopkeeperTitles.humble[shopType] || []),
    ];

    return allTitles.some((title) => shopName.includes(title));
  };

  const replaceRefinementTitle = (shopName: string, shopType: string, newPriceModifier: number) => {
    const newRefinement = getShopRefinement(newPriceModifier);
    const newTitles =
      shopkeeperTitles[newRefinement][shopType] ||
      shopkeeperTitles[newRefinement]["General Store"];

    // Collect ALL possible titles from all refinement levels
    const allTitles: string[] = [];
    ["refined", "standard", "humble"].forEach((refinementLevel) => {
      const titles =
        shopkeeperTitles[refinementLevel]?.[shopType] ||
        shopkeeperTitles[refinementLevel]?.["General Store"];
      if (titles && Array.isArray(titles)) {
        allTitles.push(...titles);
      }
    });

    // Sort titles by length (longest first) to handle overlapping titles
    allTitles.sort((a, b) => b.length - a.length);

    let updatedName = shopName;
    let titleReplaced = false;

    // Remove the first title found (longest match first)
    for (const oldTitle of allTitles) {
      if (updatedName.includes(oldTitle)) {
        updatedName = updatedName.replace(oldTitle, "").trim();
        updatedName = updatedName.replace(/\s+/g, " ");
        titleReplaced = true;
        break;
      }
    }

    // If we replaced a title, add the new one in the same position
    if (titleReplaced) {
      const newTitle = newTitles[Math.floor(Math.random() * newTitles.length)];

      if (updatedName.startsWith("The ")) {
        updatedName = `The ${newTitle} ${updatedName.substring(4)}`;
      } else {
        updatedName = `${newTitle} ${updatedName}`;
      }

      updatedName = updatedName.replace(/\s+/g, " ").trim();
    }

    return updatedName;
  };

  const regenerateNameForRace = (selectedRace: string) => {
    if (!shopkeeper || isLocked) return;

    const firstName =
      firstNames[selectedRace][
        Math.floor(Math.random() * firstNames[selectedRace].length)
      ];
    const lastName =
      lastNames[selectedRace][
        Math.floor(Math.random() * lastNames[selectedRace].length)
      ];
    const newName = `${firstName} ${lastName}`;
    const newFirstName = firstName;
    const oldFirstName = shopkeeper.name.split(" ")[0];

    const newDescription = applyNameAndPronouns(
      shopkeeper.descriptionTemplate,
      newName,
      selectedRace
    );

    let updatedShopName = shopkeeper.shopName;

    if (updatedShopName.includes(oldFirstName)) {
      updatedShopName = updatedShopName.replace(oldFirstName, newFirstName);
    }

    const oldRaceStyles = raceNamingStyles[shopkeeper.race] || [];
    const newRaceStyles = raceNamingStyles[selectedRace] || [];

    oldRaceStyles.forEach((oldStyle) => {
      if (updatedShopName.includes(oldStyle)) {
        const newStyle =
          newRaceStyles[Math.floor(Math.random() * newRaceStyles.length)];
        updatedShopName = updatedShopName.replace(oldStyle, newStyle);
      }
    });

    setShopkeeper({
      ...shopkeeper,
      name: newName,
      race: selectedRace,
      shopName: updatedShopName,
      description: newDescription,
    });
  };

  const toggleLock = () => {
    if (isLocked) {
      setLockedShopkeeperIdentity(null);
      setIsLocked(false);
    } else if (shopkeeper) {
      const { name, race } = shopkeeper;
      setLockedShopkeeperIdentity({ name, race });
      setIsLocked(true);
    }
  };

  const generateShopkeeper = (
    customShopType: string = shopType,
    customSettlementSize: string = settlementSize,
    pricingStylePreference: string = selectedPricingStyle
  ) => {
    const fallbackShopType =
      !customShopType || customShopType === "random"
        ? shopTypes[Math.floor(Math.random() * shopTypes.length)]
        : customShopType;

    if (isLocked && shopkeeper) {
      if (!shopkeeper.priceModifier || !shopkeeper.name) {
        console.warn("Corrupt locked shopkeeper. Resetting.");
        setIsLocked(false);
        generateShopkeeper("random", customSettlementSize, pricingStylePreference);
        return;
      }

      // Handle pricing for locked shopkeeper
      let pricingStyleObj;
      let actualStyleIndex;
      if (pricingStylePreference === "random") {
        actualStyleIndex = Math.floor(Math.random() * pricingStyles.length);
        pricingStyleObj = pricingStyles[actualStyleIndex];
      } else {
        actualStyleIndex = parseInt(pricingStylePreference);
        pricingStyleObj = pricingStyles[actualStyleIndex];
      }
      const priceModifier = pricingStyleObj.modifier;

      const limits = getInventoryLimits(customSettlementSize);
      const selectedCommonItems = generateCommonItems(
        fallbackShopType,
        priceModifier,
        limits
      );
      const selectedRareItems = generateRareItems(
        fallbackShopType,
        priceModifier,
        limits
      );

      const newMotto = generateMotto(fallbackShopType, priceModifier);

      const shopDescriptionData = generateShopDescription(
        fallbackShopType,
        customSettlementSize,
        priceModifier,
        {
          location: shopkeeper.shopDescriptionParts?.location,
          interior: shopkeeper.shopDescriptionParts?.interior,
          texture: shopkeeper.shopDescriptionParts?.texture,
        }
      );

      const descriptionData = generateShopkeeperDescriptionWithTemplate(
        {
          name: shopkeeper.name,
          race: shopkeeper.race,
          shopType: fallbackShopType,
        },
        priceModifier
      );

      const shopName = generateShopName(
        fallbackShopType,
        shopkeeper.name,
        shopkeeper.race,
        customSettlementSize,
        priceModifier
      );

      const updatedShopkeeper = {
        ...shopkeeper,
        shopType: fallbackShopType,
        shopName: shopName,
        pricingStyle: pricingStyleObj.style,
        priceModifier: priceModifier,
        commonItems: selectedCommonItems,
        rareItems: selectedRareItems,
        motto: newMotto,
        shopDescription: shopDescriptionData.fullDescription,
        shopDescriptionParts: {
          location: shopDescriptionData.location,
          interior: shopDescriptionData.interior,
          texture: shopDescriptionData.texture,
        },
        availableMoney: generateShopkeeperMoney(customSettlementSize),
        description: descriptionData.finalDescription,
        descriptionTemplate: descriptionData.template,
      };

      setShopkeeper(updatedShopkeeper);
      setShopType(fallbackShopType);
      setSelectedPricingStyle(actualStyleIndex.toString());
      return;
    }

    let name, race;

    if (isLocked && lockedShopkeeperIdentity) {
      ({ name, race } = lockedShopkeeperIdentity);
    } else {
      race = races[Math.floor(Math.random() * races.length)];
      const firstName =
        firstNames[race][Math.floor(Math.random() * firstNames[race].length)];
      const lastName =
        lastNames[race][Math.floor(Math.random() * lastNames[race].length)];
      name = `${firstName} ${lastName}`;
    }

    let shopTypeValue = customShopType;
    if (customShopType === "random" || customShopType === "") {
      shopTypeValue = shopTypes[Math.floor(Math.random() * shopTypes.length)];
    }

    setShopType(shopTypeValue);

    let pricingStyleObj;
    let actualStyleIndex;
    if (pricingStylePreference === "random") {
      actualStyleIndex = Math.floor(Math.random() * pricingStyles.length);
      pricingStyleObj = pricingStyles[actualStyleIndex];
    } else {
      actualStyleIndex = parseInt(pricingStylePreference);
      pricingStyleObj = pricingStyles[actualStyleIndex];
    }
    const pricingStyle = pricingStyleObj.style;
    const priceModifier = pricingStyleObj.modifier;

    const shopName = generateShopName(
      shopTypeValue,
      name,
      race,
      customSettlementSize,
      priceModifier
    );

    const limits = getInventoryLimits(customSettlementSize);
    const selectedCommonItems = generateCommonItems(
      shopTypeValue,
      priceModifier,
      limits
    );
    const selectedRareItems = generateRareItems(
      shopTypeValue,
      priceModifier,
      limits
    );

    const motto = generateMotto(shopTypeValue, priceModifier);
    const shopDescriptionData = generateShopDescription(
      shopTypeValue,
      customSettlementSize,
      priceModifier
    );

    const descriptionData = generateShopkeeperDescriptionWithTemplate(
      {
        name,
        race,
        shopType: shopTypeValue,
      },
      priceModifier
    );

    const newShopkeeper = {
      name,
      race,
      shopName,
      shopType: shopTypeValue,
      pricingStyle,
      priceModifier,
      commonItems: selectedCommonItems,
      rareItems: selectedRareItems,
      motto,
      shopDescription: shopDescriptionData.fullDescription,
      shopDescriptionParts: {
        location: shopDescriptionData.location,
        interior: shopDescriptionData.interior,
        texture: shopDescriptionData.texture,
      },
      availableMoney: generateShopkeeperMoney(customSettlementSize),
      shopLocation: "", // You might want to generate this if needed
      description: descriptionData.finalDescription,
      descriptionTemplate: descriptionData.template,
    };

    setShopkeeper(newShopkeeper);
    setSelectedPricingStyle(actualStyleIndex.toString());
  };

  return {
    // State
    shopkeeper,
    shopType,
    settlementSize,
    selectedPricingStyle,
    isLocked,
    
    // Setters
    setShopkeeper,
    setShopType,
    setSettlementSize,
    setSelectedPricingStyle,
    
    // Functions
    generateShopkeeper,
    regenerateNameForRace,
    toggleLock,
    getCurrentPricingText,
    regenerateDescriptionForPricing,
    hasRefinementElements,
    replaceRefinementTitle,
  };
};