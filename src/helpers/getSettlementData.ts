import {
    CastleTurretIcon,
    FarmIcon,
    HouseLineIcon,
  } from "@phosphor-icons/react";
  
// Get settlement data
export const getSettlementData = (size: string) => {
    switch (size) {
      case "village":
        return {
          text: "Village",
          iconType: "phosphor",
          iconComponent: FarmIcon,
        };
      case "town":
        return {
          text: "Town",
          iconType: "phosphor",
          iconComponent: HouseLineIcon,
        };
      case "city":
        return {
          text: "City",
          iconType: "phosphor",
          iconComponent: CastleTurretIcon,
        };
      default:
        return {
          text: "Merchant",
          icon: "storefront",
          iconType: "material",
        };
    }
  };