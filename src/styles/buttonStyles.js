// styles/buttonStyles.js

export const buttonStyles = {
  primary: `
    flex items-center justify-center gap-2 px-4 py-3 
    bg-stone-100 dark:bg-gray-700 border border-stone-400 dark:border-gray-600 
    text-stone-600 dark:text-gray-300 text-xs font-medium inter uppercase tracking-wider 
    rounded-md cursor-pointer hover:bg-stone-200 dark:hover:bg-gray-600 
    focus:outline-none focus:border-stone-600 dark:focus:border-stone-400 focus:ring-2 focus:ring-stone-600/10 dark:focus:ring-stone-400/10 
    disabled:bg-stone-300 dark:disabled:bg-gray-600 disabled:border-stone-400 dark:disabled:border-gray-500
    disabled:text-stone-500 dark:disabled:text-gray-400 disabled:cursor-not-allowed
    transition-all duration-200 shadow-sm hover:shadow-md disabled:shadow-none
  `
    .trim()
    .replace(/\s+/g, " "),

  sale: `
    flex items-center justify-center gap-2 px-4 py-3 
    bg-green-200 dark:bg-green-800 border border-green-400 dark:border-green-600 
    text-green-800 dark:text-green-200 text-xs font-medium inter uppercase tracking-wider 
    rounded-md cursor-pointer hover:bg-green-300 dark:hover:bg-green-700 hover:border-green-500 dark:hover:border-green-500
    disabled:bg-stone-300 dark:disabled:bg-gray-600 disabled:border-stone-400 dark:disabled:border-gray-500
    disabled:text-stone-500 dark:disabled:text-gray-400 disabled:cursor-not-allowed
    transition-all duration-200 shadow-sm hover:shadow-md disabled:shadow-none
  `
    .replace(/\s+/g, " ")
    .trim(),

  dropdown: `
    bg-stone-100 dark:bg-gray-700 
    border border-stone-400 dark:border-gray-600 
    hover:bg-stone-200 dark:hover:bg-gray-600 
    text-stone-600 dark:text-gray-300 text-xs 
    font-medium inter uppercase tracking-wider rounded-md px-3 py-1 cursor-pointer 
    
    inline-flex items-center justify-between min-w-fit align-middle
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-stone-100 dark:disabled:hover:bg-gray-700
`
    .replace(/\s+/g, " ")
    .trim(),

  tab: `
    flex-1 flex items-center justify-center gap-2 px-2 pb-2
    text-stone-600 dark:text-gray-300 text-xs
    font-medium inter uppercase tracking-wider 
    transition-all duration-200 shadow-none
    hover:shadow-none active:shadow-none focus:shadow-none
    transform-none hover:transform-none active:transform-none
    `
    .trim()
    .replace(/\s+/g, " "),

  success: `
    flex items-center justify-center gap-2 px-4 py-3 
    bg-green-200 dark:bg-green-800 border border-green-400 dark:border-green-600 
    text-green-800 dark:text-green-200 text-xs font-medium inter uppercase tracking-wider 
    rounded-md cursor-pointer hover:bg-green-300 dark:hover:bg-green-700 hover:border-green-500 dark:hover:border-green-500
    disabled:bg-stone-300 dark:disabled:bg-gray-600 disabled:border-stone-400 dark:disabled:border-gray-500
    disabled:text-stone-500 dark:disabled:text-gray-400 disabled:cursor-not-allowed
    transition-all duration-200 shadow-sm hover:shadow-md disabled:shadow-none
  `
    .trim()
    .replace(/\s+/g, " "),

  icon: `
    text-stone-500 dark:text-gray-300 hover:text-stone-700 dark:hover:text-gray-100 
    transition-colors flex items-center justify-center p-1
    disabled:text-stone-300 dark:disabled:text-gray-500 disabled:cursor-not-allowed
    shadow-none
  `
    .trim()
    .replace(/\s+/g, " "),

  danger: `
    text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300
    text-xs px-2 py-1 rounded transition-all duration-200 font-medium
    disabled:text-red-300 dark:disabled:text-red-500 disabled:cursor-not-allowed
    shadow-none
  `
    .trim()
    .replace(/\s+/g, " "),
};
