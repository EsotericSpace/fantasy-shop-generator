export const getHagglingStyle = (settlementSize, priceModifier) => {
    const hagglingStyles = {
      village: {
        generous: { name: "Generous Trader", dcModifier: -2 },
        standard: { name: "Friendly Negotiator", dcModifier: -1 },
        stingy: { name: "Careful Dealer", dcModifier: 0 },
      },
      town: {
        generous: { name: "Fair Dealer", dcModifier: -1 },
        standard: { name: "Reasonable Negotiator", dcModifier: 0 },
        stingy: { name: "Firm Negotiator", dcModifier: +1 },
      },
      city: {
        generous: { name: "Accommodating Merchant", dcModifier: 0 },
        standard: { name: "Shrewd Negotiator", dcModifier: +1 },
        stingy: { name: "Tough Negotiator", dcModifier: +2 },
      },
    };
  
    const refinement =
      priceModifier > 0.1
        ? "stingy"
        : priceModifier < -0.1
        ? "generous"
        : "standard";
  
    return (
      hagglingStyles[settlementSize]?.[refinement] || hagglingStyles.town.standard
    );
  };