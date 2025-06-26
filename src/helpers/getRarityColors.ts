// Get color classes based on rarity level (modified to accept isDarkMode parameter)
export const getRarityColors = (level: string, isDarkMode: boolean) => {
    const baseColors = {
      common: {
        light: {
          text: "text-stone-500",
          textLight: "text-stone-500",
          textIcon: "text-stone-500",
          background: "bg-stone-50 border-stone-400 hover:bg-stone-100",
        },
        dark: {
          text: "text-gray-300",
          textLight: "text-gray-400",
          textIcon: "text-gray-400",
          background: "bg-gray-700 border-gray-600 hover:bg-gray-600",
        },
      },
      uncommon: {
        light: {
          text: "text-cyan-700",
          textLight: "text-cyan-700",
          textIcon: "text-cyan-700",
          background: "bg-teal-50 border-cyan-700 hover:bg-teal-100",
        },
        dark: {
          text: "text-teal-300",
          textLight: "text-teal-400",
          textIcon: "text-teal-400",
          background: "bg-teal-900 border-teal-600 hover:bg-teal-800",
        },
      },
      rare: {
        light: {
          text: "text-indigo-600",
          textLight: "text-indigo-600",
          textIcon: "text-indigo-600",
          background: "bg-violet-50 border-indigo-600 hover:bg-violet-100",
        },
        dark: {
          text: "text-indigo-300",
          textLight: "text-indigo-400",
          textIcon: "text-indigo-400",
          background: "bg-indigo-900 border-indigo-600 hover:bg-indigo-800",
        },
      },
      "very rare": {
        light: {
          text: "text-rose-500",
          textLight: "text-rose-500",
          textIcon: "text-rose-500",
          background: "bg-pink-50 border-rose-500 hover:bg-pink-100",
        },
        dark: {
          text: "text-rose-300",
          textLight: "text-rose-400",
          textIcon: "text-rose-400",
          background: "bg-rose-900 border-rose-600 hover:bg-rose-800",
        },
      },
      legendary: {
        light: {
          text: "text-yellow-600",
          textLight: "text-yellow-600",
          textIcon: "text-yellow-600",
          background: "bg-amber-50 border-yellow-600 hover:bg-amber-100",
        },
        dark: {
          text: "text-yellow-300",
          textLight: "text-yellow-400",
          textIcon: "text-yellow-400",
          background: "bg-yellow-900 border-yellow-600 hover:bg-yellow-800",
        },
      },
    };
  
    const normalizedLevel = level.toLowerCase();
    const colorSet = baseColors[normalizedLevel] || baseColors.common;
  
    return isDarkMode ? colorSet.dark : colorSet.light;
  };