// Function to highlight pricing in the description
export const highlightPricing = (text: string) => {
    if (!text) return "";
  
    const pricingPatterns = [
      /charges a premium for .+ above market value/g,
      /asks \d+% more than most merchants/g,
      /offers surprisingly good deals at \d+% below the usual rates/g,
      /keeps prices slightly lower than competitors—about \d+% below average/g,
      /maintains fair, standard market prices/g,
    ];
  
    let highlightedText = text;
  
    pricingPatterns.forEach((pattern) => {
      highlightedText = highlightedText.replace(
        pattern,
        (match) => `<span class="text-stone-900 font-medium">${match}</span>`
      );
    });
  
    return highlightedText;
  };