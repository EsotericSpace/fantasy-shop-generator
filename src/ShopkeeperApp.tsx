import React, { useState, useEffect } from 'react';

function ShopkeeperGenerator() {
  const [shopkeeper, setShopkeeper] = useState(null);
  const [shopType, setShopType] = useState('');
  const [settlementSize, setSettlementSize] = useState('town'); // Default to town
  const [fadeCommon, setFadeCommon] = useState(false);
  const [fadeRare, setFadeRare] = useState(false);
  
  // Data for random generation
  const races = ['Human', 'Dwarf', 'Elf', 'Halfling', 'Gnome', 'Half-Elf', 'Half-Orc', 'Tiefling', 'Dragonborn'];
  
   const firstNames = {
  "Human": ["Alaia", "Alejandro", "Amara", "Amina", "Amira", "Anika", "Anouk", "Astrid", "Ayo", "Aziza", "Bas", "Bjorn", "Carmen", "Dara", "Diego", "Elske", "Esben", "Esi", "Farid", "Fatima", "Fatou", "Freja", "Habib", "Hadiya", "Hassan", "Hei", "Imani", "Imran", "Ines", "Ingrid", "Ismael", "Jamal", "Jasmine", "Jens", "Jiro", "Kaja", "Keahi", "Kwame", "Lars", "Layla", "Leilani", "Lian", "Liv", "Lucia", "Maartje", "Malik", "Maren", "Marisol", "Mateo", "Matthijs", "Mina", "Nadia", "Naomi", "Nia", "Niko", "Noa", "Noor", "Omar", "Rafael", "Rafi", "Ravi", "Rina", "Rohan", "Roos", "Rune", "Salim", "Sanele", "Soraya", "Soren", "Stellan", "Suki", "Takumi", "Tariq", "Thijs", "Yasmin", "Yusuf", "Zahra", "Zara", "Zayd", "Zuberi"],
  "Dwarf": ["Bruni", "Harnik", "Korga", "Ylva", "Doric", "Thraina", "Brog", "Sigrid", "Skarn", "Halga", "Durra", "Stigr", "Valtha", "Brynjar", "Thora", "Gudrun"],
  "Elf": ["Aeleth", "Caelion", "Eluna", "Faevyn", "Loralanthir", "Vaeril", "Myrien", "Serelien", "Thaleth", "Sylmae", "Ishara", "Lirael", "Zireen", "Nyrieth", "Kaelen", "Arenya"],
  "Halfling": ["Tilda", "Merrin", "Cobbin", "Posy", "Joss", "Fenna", "Wick", "Rilo", "Nim", "Lyle", "Peppin", "Hattie", "Dovo", "Minta", "Reni", "Quinn"],
  "Gnome": ["Nibblet", "Wizzle", "Quindle", "Tinka", "Snorbin", "Glim", "Pindle", "Razz", "Zinki", "Boondle", "Miri", "Frayla", "Dap", "Jixi", "Lom", "Zuzu"],
  "Half-Elf": ["Neris", "Kaelen", "Mira", "Solen", "Virel", "Saela", "Ronan", "Nyra", "Thalen", "Isryn", "Tallis", "Zeva", "Orielle", "Elandor", "Rowan", "Kye"],
  "Half-Orc": ["Brakka", "Jurgan", "Thoka", "Zarra", "Krall", "Umma", "Vurg", "Ketha", "Drog", "Hasska", "Mazra", "Ruun", "Tarn", "Sukka", "Orven", "Koz"],
  "Tiefling": ["Zareth", "Calyx", "Vireth", "Ashira", "Nyx", "Malrek", "Soraya", "Kaelix", "Zephan", "Riven", "Azia", "Damar", "Laziel", "Neriseth", "Tivan", "Oreth"],
  "Dragonborn": ["Sorrak", "Kaiva", "Ralnor", "Velkira", "Tharn", "Nyzora", "Ormash", "Dravik", "Tirash", "Zavri", "Korran", "Miraxi", "Balor", "Yureth", "Erdan", "Skavak"]
};


  const lastNames = {
  "Human": ["Attar", "Baker", "Balogun", "Barbero", "Bonde", "Butler", "Carretero", "Carter", "Chandler", "Chen", "Chowdhury", "Faulkner", "Firewalker", "Fletcher", "Guerrero", "Haddad", "Harper", "Herrero", "Hyrde", "Joshi", "Kato", "Khabbaz", "Makena", "Manoa", "Mason", "Mercer", "Miller", "Molinero", "Najjar", "Navarro", "Nguyen", "Onyango", "Park", "Parker", "Pastor", "Patel", "Potter", "Qasab", "Rai", "Rainmaker", "Reddy", "Runningbear", "Rybak", "Saavedra", "Skov", "Slater", "Smed", "Smith", "Snickare", "Stonepath", "Sukma", "Takahashi", "Taylor", "Thatcher", "Torres", "Tupou", "Wainwright", "Walker", "Ward", "Weaver", "Wheeler", "Whitetail", "Wright", "Wu", "Zapatero", "Zhang"],
  "Dwarf": ["Stonemantle", "Ironstitch", "Goldthane", "Forgebluff", "Axebringer", "Cragborn", "Rockmaw", "Deepforge", "Steelhewer", "Hammerfell", "Boulderhelm", "Anvilborn"],
  "Elf": ["Duskwhisper", "Silversea", "Windglade", "Moonsong", "Elarshade", "Dawnspire", "Frostwhisper", "Starbloom", "Nightpetal", "Glimmerleaf", "Brightshade", "Mistglen"],
  "Halfling": ["Quickberry", "Underhill", "Bramblefoot", "Thistlewhip", "Barleyglen", "Goodroot", "Honeytoe", "Puddlewick", "Fernwhistle", "Softstep", "Cloverkin", "Willowpatch"],
  "Gnome": ["Bronzebolt", "Flickerspark", "Wobblepin", "Janglethim", "Sprockettwist", "Fizzflame", "Copperzip", "Gadgetwhirl", "Nimbleblink", "Whizzlecraft", "Tinklepuff", "Ratchenspark"],
  "Half-Elf": ["Windmere", "Shadefern", "Glenholt", "Everstride", "Dawnroot", "Silvayne", "Brightvale", "Duskridge", "Riverlain", "Thornwild", "Whispervale", "Sunhollow"],
  "Half-Orc": ["Ironsnout", "Ragetooth", "Skullmaw", "Bonechain", "Blackhide", "Ashcleaver", "Gravetusk", "Snarlbane", "Stonejaw", "Dreadhollow", "Rustfang", "Blightmark"],
  "Tiefling": ["Hellcrest", "Nightflame", "Duskscourge", "Emberwhisper", "Voidthorn", "Ashenvow", "Shadowreign", "Grimmire", "Flarebind", "Sinmark", "Blazethorn", "Cindershard"],
  "Dragonborn": ["Irontongue", "Ashwind", "Cindertail", "Scalebreaker", "Stormvein", "Embercrest", "Moltenhide", "Thundermaw", "Glacierborn", "Venombreath", "Shatterfang", "Brightscale"]
};

  
 
  const personalities = [
    'Cheerful and talkative',
    'Grumpy but fair',
    'Shrewd and calculating',
    'Mysterious and cryptic',
    'Enthusiastic about their wares',
    'Extremely suspicious of outsiders',
    'Absent-minded professor type',
    'Boisterous and loud',
    'Soft-spoken and shy',
    'Flirtatious with all customers'
  ];
  
  const quirks = [
    'Constantly reorganizing shelves',
    'Has a pet that helps around the shop',
    'Speaks in third person',
    'Collects odd trinkets from customers',
    'Uses unusual metaphors',
    'Hums or sings while working',
    'Claims items have more history than they do',
    'Has an imaginary assistant',
    'Refuses to handle certain materials',
    'Extremely superstitious'
  ];
  
  const appearances = [
    'Immaculately dressed in fine clothes',
    'Covered in soot and burn marks',
    'Adorned with trinkets from their own shop',
    'Missing a few fingers',
    'Has unusual colored eyes',
    'Always wearing multiple layers regardless of weather',
    'Covered in tattoos of arcane symbols',
    'Unusually tall for their race',
    'Unusually short for their race',
    'Has magnificent hair',
    'Has a magnificent beard',
    'Always wearing a distinctive hat'
  ];

  const pricingStyles = [
    { style: 'Fair and reasonable', modifier: 0 },
    { style: 'Premium prices for "quality"', modifier: 0.2 },
    { style: 'Suspiciously cheap', modifier: -0.2 },
    { style: 'Haggler who starts high', modifier: 0.15 },
    { style: 'Based on how much they like you', modifier: 0.1 },
    { style: 'Charges extra for "authenticity"', modifier: 0.18 },
    { style: 'Surprisingly affordable', modifier: -0.15 }
  ];
  
  const shopTypes = [
    'General Store',
    'Blacksmith/Weaponsmith',
    'Armorer',
    'Alchemist/Potion Shop',
    'Magic Item Emporium',
    'Bookstore & Scroll Shop',
    'Enchanter',
    'Adventuring Supplies',
    'Exotic Goods',
    'Jeweler'
  ];
  
  // Shop type icons mapping
  const shopIcons = {
    'General Store': "📦",
    'Blacksmith/Weaponsmith': "⚔️",
    'Armorer': "🛡️",
    'Alchemist/Potion Shop': "⚗️",
    'Magic Item Emporium': "✨",
    'Bookstore & Scroll Shop': "📜",
    'Enchanter': "🔮",
    'Adventuring Supplies': "🧭",
    'Exotic Goods': "🐲",
    'Jeweler': "💎"
  };

  const shopAdjectives = [
    'Rusty', 'Golden', 'Silver', 'Emerald', 'Crimson', 'Mystic', 'Arcane', 
    'Twisted', 'Dancing', 'Hidden', 'Lucky', 'Ancient', 'Curious', 'Wandering'
  ];
  
  const shopNouns = {
    'General Store': ['Trading Post', 'Goods', 'Market', 'Supply', 'Wares', 'Bazaar', 'Emporium'],
    'Blacksmith/Weaponsmith': ['Forge', 'Anvil', 'Hammer', 'Blade', 'Steel', 'Iron', 'Weapon'],
    'Armorer': ['Shield', 'Plate', 'Armor', 'Helm', 'Bulwark', 'Guard', 'Defense'],
    'Alchemist/Potion Shop': ['Potion', 'Brew', 'Elixir', 'Concoction', 'Vial', 'Mixture', 'Philter'],
    'Magic Item Emporium': ['Wand', 'Relic', 'Arcanum', 'Curio', 'Artifact', 'Enchantment', 'Wonder'],
    'Bookstore & Scroll Shop': ['Tome', 'Scroll', 'Book', 'Quill', 'Parchment', 'Page', 'Script'],
    'Enchanter': ['Glyph', 'Rune', 'Enchantment', 'Sigil', 'Spellwork', 'Charm', 'Binding'],
    'Adventuring Supplies': ['Pack', 'Gear', 'Lantern', 'Rope', 'Supplies', 'Kit', 'Outfitter'],
    'Exotic Goods': ['Oddity', 'Curiosity', 'Wonder', 'Rarity', 'Import', 'Exotic', 'Treasure'],
    'Jeweler': ['Gem', 'Jewel', 'Ring', 'Crown', 'Gold', 'Bauble', 'Ornament']
  };
  
   
  // Common items with 5e prices, level indicators, and details
  const commonItems = {
    'General Store': [
      { name: 'Rope (50 ft)', price: '1 gp', level: 1, details: 'Strong hemp rope that can hold up to 300 pounds. Difficult terrain to climb without a check.' },
      { name: 'Lantern', price: '5 gp', level: 1, details: 'Sheds bright light in a 30-foot radius and dim light for an additional 30 feet. Burns for 6 hours on a flask of oil.' },
      { name: 'Backpack', price: '2 gp', level: 1, details: 'Sturdy leather pack with multiple compartments. Can hold up to 30 pounds of gear.' },
      { name: 'Rations (1 week)', price: '3 gp 5 sp', level: 1, details: 'Preserved food suitable for extended travel. Combination of dried meat, fruit, nuts and hardtack.' },
      { name: 'Waterskin', price: '2 sp', level: 1, details: 'Leather container that holds 4 pints of liquid. Sealed with waxed stopper.' },
      { name: 'Torches (10)', price: '1 sp', level: 1, details: 'Each burns for 1 hour, providing bright light in a 20-foot radius and dim light for an additional 20 feet.' },
      { name: 'Bedroll', price: '1 gp', level: 1, details: 'Padded sleeping mat with attached blanket. Provides comfort when resting outdoors.' },
      { name: 'Chalk (10 pieces)', price: '1 cp', level: 1, details: 'Various colors available. Useful for marking passages in dungeons or taking rubbings.' },
      { name: 'Crowbar', price: '2 gp', level: 1, details: 'Iron lever that provides advantage on Strength checks where leverage can be applied.' },
      { name: 'Fishing tackle', price: '1 gp', level: 1, details: 'Rod, line, hooks, and lures. Allows fishing in lakes, rivers, and coastal waters.' }
    ],
    'Blacksmith/Weaponsmith': [
      { name: 'Dagger', price: '2 gp', level: 1, details: '1d4 Piercing, Finesse, Light, Thrown (20/60)' },
      { name: 'Shortsword', price: '10 gp', level: 1, details: '1d6 Piercing, Finesse, Light' },
      { name: 'Longsword', price: '15 gp', level: 1, details: '1d8 Slashing, Versatile (1d10)' },
      { name: 'Handaxe', price: '5 gp', level: 1, details: '1d6 Slashing, Light, Thrown (20/60)' },
      { name: 'Warhammer', price: '15 gp', level: 1, details: '1d8 Bludgeoning, Versatile (1d10)' },
      { name: 'Mace', price: '5 gp', level: 1, details: '1d6 Bludgeoning' },
      { name: 'Battleaxe', price: '10 gp', level: 2, details: '1d8 Slashing, Versatile (1d10)' },
      { name: 'Flail', price: '10 gp', level: 2, details: '1d8 Bludgeoning' },
      { name: 'Glaive', price: '20 gp', level: 2, details: '1d10 Slashing, Heavy, Reach, Two-handed' },
      { name: 'Greataxe', price: '30 gp', level: 2, details: '1d12 Slashing, Heavy, Two-handed' }
    ],
    'Armorer': [
      { name: 'Leather armor', price: '10 gp', level: 1, details: 'AC 11 + Dex modifier, Light Armor' },
      { name: 'Studded leather', price: '45 gp', level: 2, details: 'AC 12 + Dex modifier, Light Armor' },
      { name: 'Chain shirt', price: '50 gp', level: 2, details: 'AC 13 + Dex modifier (max 2), Medium Armor' },
      { name: 'Scale mail', price: '50 gp', level: 3, details: 'AC 14 + Dex modifier (max 2), Medium Armor, Disadvantage on Stealth' },
      { name: 'Shield', price: '10 gp', level: 1, details: '+2 AC, Must have one hand free' },
      { name: 'Helmet', price: '10 gp', level: 1, details: 'Protects the head from blunt impacts. No mechanical bonus but may provide situational benefits.' },
      { name: 'Breastplate', price: '400 gp', level: 3, details: 'AC 14 + Dex modifier (max 2), Medium Armor' },
      { name: 'Half plate', price: '750 gp', level: 4, details: 'AC 15 + Dex modifier (max 2), Medium Armor, Disadvantage on Stealth' },
      { name: 'Splint armor', price: '200 gp', level: 3, details: 'AC 17, Heavy Armor, Str 15 required, Disadvantage on Stealth' },
      { name: 'Chain mail', price: '75 gp', level: 3, details: 'AC 16, Heavy Armor, Str 13 required, Disadvantage on Stealth' }
    ],
    'Alchemist/Potion Shop': [
      { name: 'Potion of healing', price: '50 gp', level: 1, details: 'Restores 2d4+2 hit points when consumed. Red liquid that bubbles and glows faintly. Common rarity.' },
      { name: 'Antitoxin', price: '50 gp', level: 1, details: 'Grants advantage on saving throws against poison for 1 hour. Clear fluid with shifting silver patterns.' },
      { name: 'Acid vial', price: '25 gp', level: 1, details: 'Deals 2d6 acid damage when thrown (range 20/60). Caustic liquid that smokes when exposed to air.' },
      { name: 'Alchemist fire', price: '50 gp', level: 1, details: 'Sticky, adhesive fluid that ignites when exposed to air. 1d4 fire damage on hit and at start of target\'s turns.' },
      { name: 'Basic poison', price: '100 gp', level: 1, details: 'Applied to weapons. Target must make DC 10 Constitution save or take 1d4 poison damage. Lasts 1 minute.' },
      { name: 'Healer\'s kit', price: '5 gp', level: 1, details: '10 uses. Stabilizes a creature that has 0 hit points without requiring a Medicine check.' },
      { name: 'Herbalism kit', price: '5 gp', level: 1, details: 'Collection of clippers, mortar and pestle, pouches and vials used to create remedies and potions.' },
      { name: 'Perfume', price: '5 gp', level: 1, details: 'Fragrant oils in a decorative vial. Can mask odors or create a pleasant impression in social situations.' },
      { name: 'Soap', price: '2 cp', level: 1, details: 'Cleansing agent made from animal fat and lye. Removes stubborn stains and lingering odors.' },
      { name: 'Smokestick', price: '10 gp', level: 2, details: 'When lit, creates thick smoke in a 10-foot radius for 1 minute. Obscures vision and can deter pursuing creatures.' }
    ],
    'Magic Item Emporium': [
      { name: 'Scroll of detect magic', price: '100 gp', level: 1, details: '1st-level divination spell. Sense magic within 30 feet. Identify school of magic with an action. Duration: Concentration, up to 10 minutes.' },
      { name: 'Scroll of mage armor', price: '150 gp', level: 1, details: '1st-level abjuration spell. Target\'s base AC becomes 13 + Dex modifier. Duration: 8 hours.' },
      { name: 'Potion of climbing', price: '75 gp', level: 1, details: 'Grants climbing speed equal to walking speed for 1 hour. Syrupy liquid with embedded spider hairs. Common rarity.' },
      { name: 'Spell components', price: '25 gp', level: 1, details: 'Assorted materials needed for spellcasting. Includes rare herbs, minerals, and other substances for material components.' },
      { name: 'Arcane focus', price: '10 gp', level: 1, details: 'Crystal, orb, rod, staff, or wand that channels arcane energy. Replaces material components without cost.' },
      { name: 'Candle of the deep', price: '100 gp', level: 2, details: 'Burns underwater, creating light in a 5-foot radius. Unaffected by wind. Burns for 8 hours. Common rarity.' },
      { name: 'Orb of direction', price: '150 gp', level: 2, details: 'Small crystalline sphere that always points north when activated. Glows with blue light in 5-foot radius. Common rarity.' },
      { name: 'Potion of animal friendship', price: '100 gp', level: 1, details: 'Muddy liquid with floating leaves. Allows casting of Animal Friendship spell (DC 13). Common rarity.' },
      { name: 'Scroll of comprehend languages', price: '100 gp', level: 1, details: '1st-level divination spell. Understand any spoken or written language. Duration: 1 hour.' },
      { name: 'Scroll of identify', price: '150 gp', level: 1, details: '1st-level divination spell. Learn properties of one magic item, including how to use it and charges remaining.' }
    ],
    'Bookstore & Scroll Shop': [
      { name: 'Blank book', price: '10 gp', level: 1, details: 'Leather-bound volume with 100 blank vellum pages. Suitable for recording spells, research, or journals.' },
      { name: 'Blank scroll', price: '5 sp', level: 1, details: 'Sheet of high-quality parchment treated to accept magical inscriptions. Required for creating spell scrolls.' },
      { name: 'Quill', price: '2 sp', level: 1, details: 'Writing implement crafted from a large bird feather. Common varieties come from geese, owls, or hawks.' },
      { name: 'Ink pot', price: '10 gp', level: 1, details: 'Superior quality ink suited for magical writings. Dark blue-black color that dries permanently.' },
      { name: 'Parchment sheets (10)', price: '1 gp', level: 1, details: 'Thin material made from animal hide. More durable than paper and resistant to moisture damage.' },
      { name: 'Book of lore', price: '50 gp', level: 2, details: 'Contains information on specific topic (determined randomly or by GM). Grants advantage on related Intelligence checks.' },
      { name: 'Bestiary volume', price: '75 gp', level: 2, details: 'Compilation of monster information with detailed illustrations. Provides insight into creature weaknesses and habits.' },
      { name: 'Religious text', price: '25 gp', level: 1, details: 'Holy book of a particular faith. Contains prayers, rituals, and theological discussions. Essential for clerics and paladins.' },
      { name: 'Spellbook (blank)', price: '50 gp', level: 2, details: 'Special book with 100 pages of parchment specially treated to receive magical inscriptions. Required by wizards.' },
      { name: 'Scroll case', price: '1 gp', level: 1, details: 'Leather or metal tube with cap for safely storing scrolls. Water-resistant and sturdy.' }
    ],
    'Enchanter': [
      { name: 'Arcane focus', price: '20 gp', level: 1, details: 'Specially prepared object that channels magic. Can be used in place of material components with no listed cost.' },
      { name: 'Component pouch', price: '25 gp', level: 1, details: 'Small watertight leather belt pouch containing all components needed for spellcasting (except those with specific costs).' },
      { name: 'Identify scroll', price: '120 gp', level: 1, details: '1st-level divination spell. Learn properties of one magic item, including how to use it and charges remaining.' },
      { name: 'Detect magic scroll', price: '90 gp', level: 1, details: '1st-level divination spell. Sense magic within 30 feet. Identify school of magic with an action. Duration: Concentration, up to 10 minutes.' },
      { name: 'Minor enchanted trinket', price: '50 gp', level: 1, details: 'Small object with minor magical effect. Often decorative but with practical applications. Common rarity.' },
      { name: 'Enchanted chalk', price: '15 gp', level: 1, details: 'Marks visible only to specific individuals or under certain conditions. Ideal for sending secret messages.' },
      { name: 'Glowing ink', price: '25 gp', level: 1, details: 'Luminescent writing fluid that glows in darkness. Writing remains visible in dim conditions without light source.' },
      { name: 'Enchanter\'s primer', price: '75 gp', level: 2, details: 'Introductory text on enchantment principles. Provides advantage on Arcana checks related to identifying magical items.' },
      { name: 'Rune etching tools', price: '15 gp', level: 1, details: 'Precision instruments for inscribing arcane symbols. Includes chisels, burins, and specialized implements.' },
      { name: 'Enchanted quill', price: '30 gp', level: 1, details: 'Never needs ink and writes in a color of user\'s choice. Enhances penmanship and reduces writing fatigue.' }
    ],
    'Adventuring Supplies': [
      { name: 'Backpack', price: '2 gp', level: 1, details: 'Leather pack with shoulder straps, holds up to 30 pounds of gear. Multiple compartments for organization.' },
      { name: 'Bedroll', price: '1 gp', level: 1, details: 'Portable padded sleeping roll with attached blanket. Provides comfort and insulation when camping outdoors.' },
      { name: 'Mess kit', price: '2 sp', level: 1, details: 'Tin plate, bowl, cup, and utensils. Components nest together and can be used for cooking basic meals.' },
      { name: 'Tinderbox', price: '5 sp', level: 1, details: 'Small container with flint, steel, and tinder. Takes an action to light a torch or similar object.' },
      { name: 'Torches (10)', price: '1 sp', level: 1, details: 'Wooden sticks wrapped with pitch-soaked cloth. Each burns for 1 hour, providing 20 feet of bright light and 20 feet of dim light.' },
      { name: 'Rations (10 days)', price: '5 gp', level: 1, details: 'Preserved food sufficient for ten days. Typically dried meat, fruit, nuts, and hardtack designed for long journeys.' },
      { name: 'Climber\'s kit', price: '25 gp', level: 2, details: 'Specialized gear including pitons, boot tips, gloves, and harness. Provides advantage on Strength (Athletics) checks for climbing.' },
      { name: 'Dungeoneer\'s pack', price: '12 gp', level: 1, details: 'Backpack, crowbar, hammer, 10 pitons, 10 torches, tinderbox, 10 days of rations, and waterskin. Rope bundled on side.' },
      { name: 'Explorer\'s pack', price: '10 gp', level: 1, details: 'Backpack, bedroll, mess kit, tinderbox, 10 torches, 10 days of rations, and waterskin. Rope bundled on side.' },
      { name: 'Hunting trap', price: '5 gp', level: 1, details: 'Steel teeth snap shut when triggered. DC 13 Dexterity save or 1d4 piercing damage. Creature\'s speed becomes 0.' }
    ],
    'Exotic Goods': [
      { name: 'Foreign spices', price: '15 gp', level: 1, details: 'Rare seasonings from distant lands. Enhances cooking and may have mild medicinal properties.' },
      { name: 'Unusual textiles', price: '20 gp', level: 1, details: 'Fabrics with strange properties or origin. May include silks from exotic insects or plant fibers unknown locally.' },
      { name: 'Strange figurines', price: '25 gp', level: 1, details: 'Small carvings representing unknown deities or creatures. Some collectors believe they bring luck or protection.' },
      { name: 'Exotic pets', price: '50 gp', level: 2, details: 'Unusual animals from distant regions. May include colorful birds, strange reptiles, or miniature mammals.' },
      { name: 'Ceremonial mask', price: '30 gp', level: 1, details: 'Ritualistic face covering from foreign culture. Adorned with symbols of spiritual significance and crafted with exotic materials.' },
      { name: 'Decorative weapon', price: '45 gp', level: 1, details: 'Foreign armament designed for display rather than combat. May have cultural significance or showcase unique craftsmanship.' },
      { name: 'Foreign liquor', price: '10 gp', level: 1, details: 'Potent alcoholic beverage from distant lands. Unusual flavor profile and sometimes surprising effects.' },
      { name: 'Incense (exotic)', price: '5 gp', level: 1, details: 'Aromatic resins and herbs from far-off regions. Burns with distinctive scent that may have calming or stimulating properties.' },
      { name: 'Trade goods from afar', price: '25 gp', level: 1, details: 'Assorted items brought by caravan from distant lands. Unfamiliar but potentially valuable in the right markets.' },
      { name: 'Preserved curiosity', price: '40 gp', level: 2, details: 'Specimen of unusual flora or fauna preserved in liquid or by other means. Of interest to scholars and collectors.' }
    ],
    'Jeweler': [
      { name: 'Silver ring', price: '5 gp', level: 1, details: 'Simple band of polished silver. May be engraved with basic patterns or left plain for customization.' },
      { name: 'Copper bracelet', price: '3 gp', level: 1, details: 'Decorative band worn on wrist. Some believe copper bracelets reduce aches and pains.' },
      { name: 'Gemstone (uncut)', price: '10 gp', level: 1, details: 'Raw precious or semi-precious stone. Value may increase significantly when properly cut.' },
      { name: 'Simple necklace', price: '5 gp', level: 1, details: 'Chain or cord with minor ornamentation. Common materials include silver, copper, or polished stone.' },
      { name: 'Earrings', price: '4 gp', level: 1, details: 'Decorative pieces worn on pierced ears. Available in various styles and materials.' },
      { name: 'Gold ring', price: '25 gp', level: 2, details: 'Band crafted from precious gold. Symbol of wealth, commitment, or achievement depending on design.' },
      { name: 'Silver bracelet', price: '10 gp', level: 1, details: 'Wrist adornment of fine silver. May feature chain links, solid band, or decorative patterns.' },
      { name: 'Gold chain', price: '15 gp', level: 1, details: 'Necklace of interlinking gold pieces. Variable length and link patterns available.' },
      { name: 'Gemstone (cut)', price: '50 gp', level: 2, details: 'Faceted precious or semi-precious stone. Cut to maximize brilliance and showcase color.' },
      { name: 'Silver pendant', price: '12 gp', level: 1, details: 'Decorative ornament worn on necklace. May feature symbolic imagery or personal significance.' }
    ]
  };
  
  // Rare items with 5e prices, level indicators, and details
  const rareItems = {
    'General Store': [
      { name: 'Masterwork backpack', price: '50 gp', level: 3, details: 'Reinforced seams and water-resistant material. Can hold 50% more than a standard backpack with better weight distribution.' },
      { name: 'Folding boat', price: '5,000 gp', level: 10, details: 'Takes the form of a wooden box that unfolds into a boat. Command word transforms it between box, rowboat, and ship sizes. Rare rarity.' },
      { name: 'Breathing tube', price: '25 gp', level: 3, details: 'Specially crafted reed that allows breathing underwater while remaining submerged. Extends up to 10 feet in length.' },
      { name: 'Waterproof satchel', price: '35 gp', level: 3, details: 'Treated leather bag with sealed seams. Contents remain completely dry even when fully submerged.' },
      { name: 'Bag of holding (minor)', price: '500 gp', level: 5, details: 'Interior space larger than exterior dimensions (2 ft. in diameter, 250 pounds capacity). Items inside weigh nothing. Uncommon rarity.' },
      { name: 'Boots of elvenkind', price: '2,500 gp', level: 8, details: 'Wearer\'s steps make no sound. Advantage on Dexterity (Stealth) checks that rely on moving silently. Uncommon rarity.' }
    ],
    'Blacksmith/Weaponsmith': [
      { name: 'Silvered weapon', price: '100 gp', level: 3, details: 'Coated with silver. Overcomes damage resistance of certain monsters (lycanthropes, devils). No additional damage bonus.' },
      { name: 'Masterwork blade', price: '200 gp', level: 4, details: 'Superior craftsmanship. +1 to attack rolls but not damage. Cannot overcome damage resistance like magical weapons.' },
      { name: 'Exotic weapon', price: '250 gp', level: 4, details: 'Unusual design from distant lands. May have unique properties or fighting style requirements. Often has distinctive appearance.' },
      { name: 'Concealed weapon', price: '150 gp', level: 3, details: 'Designed to be hidden or disguised as ordinary objects. Advantage on Sleight of Hand checks to conceal.' },
      { name: '+1 Weapon', price: '1,000 gp', level: 5, details: 'Grants +1 bonus to attack and damage rolls. Counts as magical for overcoming resistance. Uncommon rarity.' },
      { name: 'Trident of fish command', price: '8,000 gp', level: 11, details: 'Weapon (trident), +1 to attack and damage rolls. Grants control over fish and other aquatic creatures. 3 charges for Command spell. Uncommon rarity.' }
    ],
    'Armorer': [
      { name: 'Mithral armor', price: '2,500 gp', level: 8, details: 'Medium or heavy armor made from silvery metal. Counts as one category lighter. No Strength requirement, no Stealth disadvantage. Uncommon rarity.' },
      { name: 'Adamantine armor', price: '5,000 gp', level: 10, details: 'Any heavy armor made of nearly indestructible metal. Critical hits against wearer become normal hits. Uncommon rarity.' },
      { name: 'Decorative ceremonial armor', price: '400 gp', level: 5, details: 'Ornate armor designed for display rather than protection. Elaborate engravings and embellishments. Provides standard AC.' },
      { name: 'Gleaming armor', price: '500 gp', level: 5, details: 'Magically enchanted to never get dirty. Sheds bright light in 10-foot radius when exposed to sunlight. Common rarity.' },
      { name: '+1 Shield', price: '1,500 gp', level: 6, details: 'Shield with arcane runes or divine symbols. Provides additional +1 AC beyond normal shield bonus. Uncommon rarity.' },
      { name: '+1 Armor', price: '1,500 gp', level: 6, details: 'Any armor that provides +1 bonus to AC beyond its normal AC value. Magical enchantments strengthen its protection. Uncommon rarity.' }
    ],
    'Alchemist/Potion Shop': [
      { name: 'Greater healing potion', price: '250 gp', level: 4, details: 'Restores 4d4+4 hit points when consumed. Dark crimson liquid that gives off ruby-colored luminescence. Uncommon rarity.' },
      { name: 'Fire breath potion', price: '150 gp', level: 3, details: 'One hour after drinking, can use action to exhale fire in 15-foot cone. 4d6 fire damage (DC 13 Dexterity save for half). Uncommon rarity.' },
      { name: 'Oil of slipperiness', price: '500 gp', level: 5, details: 'Applied to surface or creature. Creates Grease spell effect for 8 hours. Can be used to escape restraints. Uncommon rarity.' },
      { name: 'Potion of superior healing', price: '500 gp', level: 5, details: 'Restores 8d4+8 hit points when consumed. Sparkling crimson liquid with gold flecks. Rare rarity.' },
      { name: 'Potion of invisibility', price: '1,800 gp', level: 7, details: 'Turns drinker invisible for 1 hour. Effect ends if drinker attacks or casts a spell. Clear liquid that appears to be empty vial. Very rare rarity.' },
      { name: 'Potion of flying', price: '2,500 gp', level: 8, details: 'Grants flying speed of 60 feet for 1 hour. Cloudy white liquid with feather-like patterns. Very rare rarity.' }
    ],
    'Magic Item Emporium': [
      { name: 'Wand of magic detection', price: '1,500 gp', level: 6, details: 'Casts Detect Magic without using a spell slot. 3 charges, regains 1d3 charges daily at dawn. Uncommon rarity.' },
      { name: 'Wand of web', price: '4,000 gp', level: 9, details: 'Casts Web spell (DC 15). 7 charges, expend 1 charge per cast. Regains 1d6+1 charges daily. Uncommon rarity.' },
      { name: 'Pearl of power', price: '6,000 gp', level: 11, details: 'Once per day, recover one expended spell slot of 3rd level or lower. Iridescent white sphere. Uncommon rarity.' },
      { name: 'Cloak of protection', price: '3,500 gp', level: 9, details: 'Grants +1 bonus to AC and all saving throws. Shimmers when examined closely. Uncommon rarity.' },
      { name: 'Broom of flying', price: '8,000 gp', level: 12, details: 'Flies up to 50 feet per round. Can carry up to 400 pounds. Hovers when not being ridden. Uncommon rarity.' },
      { name: 'Ring of protection', price: '3,500 gp', level: 9, details: 'Grants +1 bonus to AC and saving throws. Delicate band with protective runes. Rare rarity.' }
    ],
    'Bookstore & Scroll Shop': [
      { name: 'Scroll of fireball', price: '300 gp', level: 4, details: '3rd-level evocation spell. Creates 20-foot-radius sphere of flame dealing 8d6 fire damage (DC 15 Dexterity save for half).' },
      { name: 'Manual of health', price: '5,000 gp', level: 10, details: 'Reading takes 48 hours over 6 days. Constitution score increases by 2, as does maximum. Disappears after use. Very rare rarity.' },
      { name: 'Tome of clear thought', price: '8,000 gp', level: 12, details: 'Reading takes 48 hours over 6 days. Intelligence score increases by 2, as does maximum. Disappears after use. Very rare rarity.' },
      { name: 'Scroll of protection', price: '200 gp', level: 4, details: 'Reading creates 5-foot-radius barrier that blocks a specific type of creature. Lasts 5 minutes or until breached. Rare rarity.' },
      { name: 'Spell scroll (3rd level)', price: '500 gp', level: 5, details: 'Contains one 3rd-level spell. DC 15 check required if spell not on your class list. Consumed when spell is cast. Uncommon rarity.' },
      { name: 'Spell scroll (4th level)', price: '1,000 gp', level: 6, details: 'Contains one 4th-level spell. DC 16 check required if spell not on your class list. Consumed when spell is cast. Rare rarity.' }
    ],
    'Enchanter': [
      { name: 'Wand of magic missiles', price: '2,000 gp', level: 7, details: 'Casts Magic Missile with variable power (1-7 darts). 7 charges, regains 1d6+1 charges daily. Uncommon rarity.' },
      { name: 'Ring of protection', price: '3,500 gp', level: 9, details: 'Grants +1 bonus to AC and all saving throws. Simple platinum band with protective runes. Rare rarity.' },
      { name: 'Amulet of health', price: '4,000 gp', level: 9, details: 'Wearer\'s Constitution score becomes 19 if it was lower. Polished red gem on golden chain. Rare rarity.' },
      { name: 'Circlet of blasting', price: '1,500 gp', level: 6, details: 'Cast Scorching Ray once per day. Automatically hits for 2d6 fire damage. Golden circlet with ruby. Uncommon rarity.' },
      { name: 'Headband of intellect', price: '8,000 gp', level: 12, details: 'Wearer\'s Intelligence score becomes 19 if it was lower. Silver filament with blue gemstones. Uncommon rarity.' },
      { name: 'Brooch of shielding', price: '3,000 gp', level: 8, details: 'Grants immunity to damage from Magic Missile spell. Also protects from similar force effects. Uncommon rarity.' }
    ],
    'Adventuring Supplies': [
      { name: 'Immovable rod', price: '5,000 gp', level: 10, details: 'Iron rod with button. When pressed, rod becomes magically fixed in place. Supports 8,000 pounds. DC 30 Strength check to move. Uncommon rarity.' },
      { name: 'Portable ram', price: '250 gp', level: 4, details: 'Magically enhanced battering implement. +4 bonus to Strength checks to break down doors. Collapsible for easy carry.' },
      { name: 'Handy haversack', price: '2,000 gp', level: 7, details: 'Backpack with two side pouches, each containing an extradimensional space. Total weight never exceeds 5 pounds. Rare rarity.' },
      { name: 'Driftglobe', price: '750 gp', level: 5, details: 'Floating sphere that provides light (Light or Daylight spell). Follows owner within 60 feet. Uncommon rarity.' },
      { name: 'Boots of striding and springing', price: '5,000 gp', level: 10, details: 'Wearer\'s walking speed increases by 10 feet. Jump three times normal distance. Uncommon rarity.' },
      { name: 'Rope of climbing', price: '2,000 gp', level: 7, details: '60 feet of silk rope that animates on command. Can knot, fasten, climb, and untie itself. Supports 3,000 pounds. Uncommon rarity.' }
    ],
    'Exotic Goods': [
      { name: 'Vial of exotic beast blood', price: '300 gp', level: 4, details: 'Preserved blood from rare creature. Used in special rituals and high-end alchemy. Properties vary by creature type.' },
      { name: 'Feywild flower', price: '250 gp', level: 4, details: 'Bloom from the Feywild that never wilts. Subtle glow visible in darkness. May have minor magical properties.' },
      { name: 'Dragon scale (shed)', price: '500 gp', level: 5, details: 'Single scale from dragon\'s hide. Color determines type. Used in crafting special items or potions. Resists appropriate damage type.' },
      { name: 'Planar relic', price: '1,000 gp', level: 6, details: 'Object from another plane of existence. Strange properties and appearance. May have residual energy from native plane.' },
      { name: 'Bottled breath', price: '800 gp', level: 5, details: 'Air from specific environment or creature contained in sealed vial. When opened, creates brief environmental effect. Uncommon rarity.' },
      { name: 'Sending stones', price: '2,500 gp', level: 8, details: 'Pair of stones allowing telepathic communication once daily. 1 action to send 25-word message to paired stone. Uncommon rarity.' }
    ],
    'Jeweler': [
      { name: 'Gem of brightness', price: '2,500 gp', level: 8, details: 'Prism-like gem with 50 charges. Creates light or blinding rays. Daylight effect or 1d6 blinding attacks. Uncommon rarity.' },
      { name: 'Stone of good luck', price: '3,000 gp', level: 8, details: 'Grants +1 bonus to ability checks and saving throws. Small polished agate. Uncommon rarity.' },
      { name: 'Eyes of charming', price: '4,500 gp', level: 9, details: 'Crystal lenses that allow casting Charm Person (DC 13) on humanoids. Requires eye contact. Recharges daily. Uncommon rarity.' },
      { name: 'Brooch of shielding', price: '3,000 gp', level: 8, details: 'Silver and gold brooch that grants immunity to Magic Missile spell damage. Also resists force damage. Uncommon rarity.' },
      { name: 'Necklace of adaptation', price: '2,500 gp', level: 8, details: 'Creates envelope of fresh air around wearer. Breathe normally in any environment. Immunity to gas attacks. Uncommon rarity.' },
      { name: 'Ring of jumping', price: '2,500 gp', level: 8, details: 'Cast Jump spell on self at will. Triples jump distance. Silver band with hare engraving. Uncommon rarity.' }
    ]
  };
  
const generateMotto = (shopTypeValue, priceModifier) => {
  const choose = (arr) => arr[Math.floor(Math.random() * arr.length)];

  if (shopTypeValue === 'Blacksmith/Weaponsmith' || shopTypeValue === 'Armorer') {
    return choose(
      priceModifier > 0
        ? [
            "Quality steel costs good coin. Cheap steel costs your life.",
            "You want something that'll outlive you? Pay up.",
            "I don’t sell scrap. I sell survival."
          ]
        : [
            "The only thing sharper than my blades are my prices.",
            "Steel for the people and the people's purse.",
            "Crafted with care, priced to share."
          ]
    );
  }

  if (shopTypeValue === 'Magic Item Emporium' || shopTypeValue === 'Enchanter') {
    return choose(
      priceModifier > 0
        ? [
            "Arcane power has its price. Pay it wisely.",
            "Wonders don't come cheap and neither do I.",
            "Every enchantment has a cost. This one’s yours."
          ]
        : [
            "Prices so low, you'll think it's illusion magic.",
            "Wards, charms, and discounts await.",
            "Mystic deals for mundane coin."
          ]
    );
  }

  if (shopTypeValue === 'Alchemist/Potion Shop') {
    return choose([
      "Bottled solutions for all your problems.",
      "Take a sip, take a risk.",
      "This is my family's potion shop.",
      "I sell hope by the vial."
    ]);
  }

  if (shopTypeValue === 'Adventuring Supplies') {
    return choose([
      "Equipping heroes. Burying fools who came unprepared.",
      "You pack it, you live. You forget it, you die.",
      "Gear up. The dungeon won’t wait.",
      "Check your list twice — or buy a shovel."
    ]);
  }

  if (shopTypeValue === 'General Store') {
    return choose([
      "If we don't have it, you probably don't need it.",
      "A little bit of everything, a whole lot of value.",
      "The shop that stocks what the others forgot.",
      "Come for the basics, stay for the deals."
    ]);
  }

  if (shopTypeValue === 'Jeweler') {
    return choose([
      "Treasures that outshine dragons' hoards.",
      "Put a little gleam in your gamble.",
      "When only gold speaks, I speak fluently.",
      "Subtle flexes. Loud sparkle."
    ]);
  }

  if (shopTypeValue === 'Exotic Goods') {
    return choose([
      "Curiosities from realms beyond your imagination.",
      "One man’s trinket is another’s key to destiny.",
      "You won't know you need it until it calls to you.",
      "Everything here has a story. Most are cursed."
    ]);
  }

  if (shopTypeValue === 'Bookstore & Scroll Shop') {
    return choose([
      "Knowledge is power. Power has a price.",
      "Spells, stories, secrets — all for sale.",
      "Ink-stained fingers, arcane minds.",
      "Whispered wisdom, bound in vellum."
    ]);
  }

  // Default catch-all
  return choose([
    "No refunds. No questions. Just gold.",
    "Enter with coin, leave with treasure.",
    "Quality goods for discerning adventurers.",
    "The wise spend here before their quests.",
    "Everything has a price. Even you."
  ]);
};


  // Function to adjust price based on shopkeeper's pricing style
  const adjustPrice = (basePrice: string, modifier: number) => {
    // Parse the base price
    let value = 0;
    let currency = '';
    
    // Handle prices with commas
    const priceWithoutCommas = basePrice.replace(/,/g, '');
    
    if (priceWithoutCommas.includes('gp')) {
      value = parseFloat(priceWithoutCommas.split('gp')[0].trim());
      currency = 'gp';
    } else if (priceWithoutCommas.includes('sp')) {
      value = parseFloat(priceWithoutCommas.split('sp')[0].trim());
      currency = 'sp';
    } else if (priceWithoutCommas.includes('cp')) {
      value = parseFloat(priceWithoutCommas.split('cp')[0].trim());
      currency = 'cp';
    }
    
    // Handle complex prices like "3 gp 5 sp"
    if (priceWithoutCommas.includes('gp') && priceWithoutCommas.includes('sp')) {
      const gpPart = parseFloat(priceWithoutCommas.split('gp')[0].trim());
      const spPart = parseFloat(priceWithoutCommas.split('gp')[1].split('sp')[0].trim());
      value = gpPart + (spPart / 10); // Convert to gold
      currency = 'gp';
    }
    
    // Apply the modifier
    const adjustedValue = value * (1 + modifier);
    
    // Format the adjusted price into gp, sp, cp
    if (currency === 'gp') {
      return formatCurrency(adjustedValue);
    } else if (currency === 'sp') {
      return formatCurrency(adjustedValue / 10);
    } else if (currency === 'cp') {
      return formatCurrency(adjustedValue / 100);
    } else {
      return adjustedValue.toFixed(0) + ' ' + currency;
    }
  };
  
  // Function to format currency into gp, sp, cp with icons
  const formatCurrency = (valueInGold: number) => {
    const gp = Math.floor(valueInGold);
    const sp = Math.floor((valueInGold - gp) * 10);
    const cp = Math.round(((valueInGold - gp) * 10 - sp) * 10);
    
    let result = '';
    
    if (gp > 0) {
      result += `<span class="currency-wrapper"><span class="currency-icon gold-icon" data-tooltip="Gold Piece"></span>${gp}</span>`;
    }
    
    if (sp > 0) {
      result += `<span class="currency-wrapper"><span class="currency-icon silver-icon" data-tooltip="Silver Piece"></span>${sp}</span>`;
    }
    
    if (cp > 0) {
      result += `<span class="currency-wrapper"><span class="currency-icon copper-icon" data-tooltip="Copper Piece"></span>${cp}</span>`;
    }
    
    if (result === '') {
      return `<span class="currency-wrapper"><span class="currency-icon copper-icon" data-tooltip="Copper Piece"></span>0</span>`;
    }
    
    return result;
  };
  
  // Better handle the personality descriptions
  const replacePronouns = (
  text: string,
  pronoun: string,
  possessive: string,
  reflexive: string
) => {
  return text
    .replace(/\bthey\b/gi, pronoun)
    .replace(/\bthem\b/gi, pronoun === 'he' ? 'him' : 'her')
    .replace(/\btheir\b/gi, possessive)
    .replace(/\btheirs\b/gi, possessive + "'s")
    .replace(/\bthemselves\b/gi, reflexive);
};

  const getPersonalityDesc = (
  personality: string,
  isFemale: boolean,
  pronoun: string,
  possessivePronoun: string,
  reflexivePronoun: string
) => {

    switch (personality.toLowerCase()) {
      case 'cheerful and talkative':
        return isFemale ? 
          `bright and chatty, always ready with a story` : 
          `cheerful and talkative, never letting a customer shop in silence`;
      case 'grumpy but fair':
        return isFemale ? 
          `perpetually grumpy but known for fair dealings` : 
          `curmudgeonly but honest to a fault`;
      case 'shrewd and calculating':
        return `shrewd in business with an uncanny knack for calculation`;
      case 'mysterious and cryptic':
        return isFemale ? 
          `shrouded in mystery, speaking in cryptic riddles` : 
          `mysterious and tight-lipped about ${possessivePronoun} past`;
      case 'enthusiastic about their wares':
        return `passionate about ${possessivePronoun} merchandise, often demonstrating items with dramatic flair`;
      case 'extremely suspicious of outsiders':
        return `wary of strangers, eyeing new customers with visible suspicion`;
      case 'absent-minded professor type':
        return `brilliant but scattered, often forgetting what ${pronoun}'s saying mid-sentence`;
      case 'boisterous and loud':
        return `boisterous and loud enough to be heard from streets away`;
      case 'soft-spoken and shy':
        return `soft-spoken and reserved, barely audible when negotiating prices`;
      case 'flirtatious with all customers':
        return `flirtatious with every customer regardless of species or status`;
      default:
  return replacePronouns(personality.toLowerCase(), pronoun, possessivePronoun, reflexivePronoun);

    }
  };

  // Better handle the appearance descriptions - fixing the "being" issue
  const getAppearanceDesc = (
    appearance: string,
    pronoun: string,
    possessivePronoun: string,
    reflexivePronoun: string,
    race: string
  ) => {
  if (appearance.startsWith('Has ')) {
    return replacePronouns(
      `someone with ${appearance.replace('Has ', '').toLowerCase()}`,
      pronoun,
      possessivePronoun,
      reflexivePronoun
    );
  } else if (appearance.startsWith('Covered in ')) {
    return replacePronouns(
      appearance.toLowerCase(),
      pronoun,
      possessivePronoun,
      reflexivePronoun
    );
  } else if (appearance.startsWith('Adorned with ')) {
    return replacePronouns(
      `decorated with ${appearance.replace('Adorned with ', '').toLowerCase()}`,
      pronoun,
      possessivePronoun,
      reflexivePronoun
    );
  } else if (appearance.startsWith('Missing ')) {
    return replacePronouns(
      appearance.toLowerCase(),
      pronoun,
      possessivePronoun,
      reflexivePronoun
    );
  } else if (appearance.includes('beard') || appearance.includes('hair')) {
    return replacePronouns(
      `sporting ${appearance.toLowerCase()}`,
      pronoun,
      possessivePronoun,
      reflexivePronoun
    );
  } else if (appearance.startsWith('Always wearing ')) {
    return replacePronouns(
      `someone who always wears ${appearance.replace('Always wearing ', '').toLowerCase()}`,
      pronoun,
      possessivePronoun,
      reflexivePronoun
    );
  } else if (appearance.startsWith('Unusually ')) {
    return replacePronouns(
      `${appearance.toLowerCase()} even by ${race.toLowerCase()} standards`,
      pronoun,
      possessivePronoun,
      reflexivePronoun
    );
  } else if (appearance.startsWith('Immaculately ')) {
    return replacePronouns(
      appearance.toLowerCase(),
      pronoun,
      possessivePronoun,
      reflexivePronoun
    );
  } else {
    return replacePronouns(
      appearance.toLowerCase(),
      pronoun,
      possessivePronoun,
      reflexivePronoun
    );
  }
};


  // Better handle the quirk descriptions
  const getQuirkDesc = (quirk: string, pronoun: string, possessivePronoun: string, reflexivePronoun: string) => {
    if (quirk.includes('pet')) {
      return `keeps a loyal pet that helps around the shop`;
    } else if (quirk.includes('third person')) {
      return `refers to ${reflexivePronoun} in the third person`;
    } else if (quirk.includes('trinkets')) {
      return `collects odd trinkets from customers`;
    } else if (quirk.includes('metaphors')) {
      return `uses unusual metaphors in conversation`;
    } else if (quirk.includes('sings') || quirk.includes('hums')) {
      return `constantly hums or sings while working`;
    } else if (quirk.includes('history')) {
      return `invents elaborate backstories for even the most mundane items`;
    } else if (quirk.includes('imaginary')) {
      return `converses with an imaginary assistant`;
    } else if (quirk.includes('materials')) {
      return `refuses to handle certain materials`;
    } else if (quirk.includes('superstitious')) {
      return `follows a complex set of superstitions`;
    } else if (quirk.includes('shelves')) {
      return `constantly reorganizes shelves`;
    } else {
      return quirk.toLowerCase();
    }
  };

// Shared type for inventory items
type ShopItem = {
  name: string;
  basePrice: number;
  level: number;
  details: string;
  adjustedPrice: string;
};

// Function to highlight pricing in the description
const highlightPricing = (text: string) => {
  if (!text) return "";

  const pricingPatterns = [
    /charges a premium for .+ above market value/g,
    /asks \d+% more than most merchants/g,
    /offers surprisingly good deals at \d+% below the usual rates/g,
    /keeps prices slightly lower than competitors—about \d+% below average/g,
    /maintains fair, standard market prices/g
  ];

  let highlightedText = text;

  pricingPatterns.forEach(pattern => {
    highlightedText = highlightedText.replace(pattern, (match) =>
      `<span class="text-stone-900 font-medium">${match}</span>`
    );
  });

  return highlightedText;
};

const getPricingDesc = (priceModifier: number, pronoun: string, possessivePronoun: string) => {
  if (priceModifier > 0.15) {
    return `charges a premium for ${possessivePronoun} wares—a whopping ${Math.abs(priceModifier * 100).toFixed(0)}% above market value`;
  } else if (priceModifier > 0) {
    return `asks ${Math.abs(priceModifier * 100).toFixed(0)}% more than most merchants`;
  } else if (priceModifier < -0.15) {
    return `offers surprisingly good deals at ${Math.abs(priceModifier * 100).toFixed(0)}% below the usual rates`;
  } else if (priceModifier < 0) {
    return `keeps prices slightly lower than competitors—about ${Math.abs(priceModifier * 100).toFixed(0)}% below average`;
  } else {
    return `maintains fair, standard market prices`;
  }
};

// Get limits based on settlement size
const getInventoryLimits = (sizeValue: string) => {
  switch (sizeValue) {
    case 'village':
      return {
        numCommonItems: Math.floor(Math.random() * 3) + 3, // 3–5 items
        numRareItems: 0, // No rare items in villages
        maxCommonLevel: 2,
        maxRareLevel: 0
      };
    case 'town':
      return {
        numCommonItems: Math.floor(Math.random() * 4) + 5, // 5–8 items
        numRareItems: Math.floor(Math.random() * 2) + 1, // 1–2 rare items
        maxCommonLevel: 3,
        maxRareLevel: 8
      };
    case 'city':
    default:
      return {
        numCommonItems: Math.floor(Math.random() * 6) + 5, // 5–10 items
        numRareItems: Math.floor(Math.random() * 3) + 1, // 1–3 rare items
        maxCommonLevel: 4,
        maxRareLevel: 15
      };
  }
};

// Generate common inventory
const generateCommonItems = (
  shopTypeValue: string | number,
  priceModifier: number,
  limits: { numCommonItems: number; maxCommonLevel: number; }
): ShopItem[] => {
  const commonInventory = commonItems[shopTypeValue];
  const selectedCommonItems: ShopItem[] = [];
  const usedCommonIndices = new Set();

  const weightedCommonSelection = () => {
    let availableItems = commonInventory.filter((item, index) =>
      !usedCommonIndices.has(index) && item.level <= limits.maxCommonLevel
    );

    if (availableItems.length === 0) return null;

    availableItems.sort((a, b) => a.level - b.level);
    const weightedIndex = Math.floor(Math.pow(Math.random(), 1.5) * availableItems.length);

    return {
      item: availableItems[weightedIndex],
      index: commonInventory.indexOf(availableItems[weightedIndex])
    };
  };

  for (let i = 0; i < limits.numCommonItems; i++) {
    const selection = weightedCommonSelection();
    if (!selection) break;

    usedCommonIndices.add(selection.index);
    selectedCommonItems.push({
      name: selection.item.name,
      basePrice: selection.item.price,
      level: selection.item.level,
      details: selection.item.details,
      adjustedPrice: adjustPrice(selection.item.price, priceModifier)
    });
  }

  return selectedCommonItems;
};

// Generate rare inventory
const generateRareItems = (
  shopTypeValue: string | number,
  priceModifier: number,
  limits: { numRareItems: number; maxRareLevel: number; }
): ShopItem[] => {
  const rareInventory = rareItems[shopTypeValue];
  const selectedRareItems: ShopItem[] = [];
  const usedRareIndices = new Set();

  const weightedRareSelection = () => {
    let availableItems = rareInventory.filter((item, index) =>
      !usedRareIndices.has(index) && item.level <= limits.maxRareLevel
    );

    if (availableItems.length === 0) return null;

    availableItems.sort((a: { level: number; }, b: { level: number; }) => b.level - a.level);
    const weightedIndex = Math.floor(Math.pow(Math.random(), 2) * availableItems.length);

    return {
      item: availableItems[weightedIndex],
      index: rareInventory.indexOf(availableItems[weightedIndex])
    };
  };

  for (let i = 0; i < limits.numRareItems; i++) {
    const selection = weightedRareSelection();
    if (!selection) break;

    usedRareIndices.add(selection.index);
    selectedRareItems.push({
      name: selection.item.name,
      basePrice: selection.item.price,
      level: selection.item.level,
      details: selection.item.details,
      adjustedPrice: adjustPrice(selection.item.price, priceModifier)
    });
  }

  return selectedRareItems;
};

  
  // Function to regenerate common items
  const regenerateCommonItems = () => {
    if (!shopkeeper) return;
    
    setFadeCommon(true);
    
    // Get inventory limits based on settlement size
    const limits = getInventoryLimits(settlementSize);
    
    // Generate new common items
    const newCommonItems = generateCommonItems(shopkeeper.shopType, shopkeeper.priceModifier, limits);
    
    // Update shopkeeper state
    setTimeout(() => {
      setShopkeeper({
        ...shopkeeper,
        commonItems: newCommonItems
      });
      setFadeCommon(false);
    }, 300);
  };
  
  // Function to regenerate rare items
  const regenerateRareItems = () => {
    if (!shopkeeper) return;
    
    setFadeRare(true);
    
    // Get inventory limits based on settlement size
    const limits = getInventoryLimits(settlementSize);
    
    // Generate new rare items
    const newRareItems = generateRareItems(shopkeeper.shopType, shopkeeper.priceModifier, limits);
    
    // Update shopkeeper state
    setTimeout(() => {
      setShopkeeper({
        ...shopkeeper,
        rareItems: newRareItems
      });
      setFadeRare(false);
    }, 300);
  };
  
// Function to generate random shopkeeper
const generateShopkeeper = (
  customShopType: string = shopType,
  customSettlementSize: string = settlementSize
) => {
  if (isLocked && shopkeeper) {
  const limits = getInventoryLimits(customSettlementSize);
  const selectedCommonItems = generateCommonItems(shopkeeper.shopType, shopkeeper.priceModifier, limits);
  const selectedRareItems = generateRareItems(shopkeeper.shopType, shopkeeper.priceModifier, limits);

  const newMotto = generateMotto(customShopType, shopkeeper.priceModifier);

  const updatedShopkeeper = {
    ...shopkeeper,
    shopType: customShopType,
    commonItems: selectedCommonItems,
    rareItems: selectedRareItems,
    motto: newMotto
  };

  setShopkeeper(updatedShopkeeper);
  return;
}


  let name, race, personality, quirk, appearance;

if (isLocked && lockedShopkeeperIdentity) {
  ({ name, race, personality, quirk, appearance } = lockedShopkeeperIdentity);
} else {
  race = races[Math.floor(Math.random() * races.length)];
  const firstName = firstNames[race][Math.floor(Math.random() * firstNames[race].length)];
  const lastName = lastNames[race][Math.floor(Math.random() * lastNames[race].length)];
  name = `${firstName} ${lastName}`;
  personality = personalities[Math.floor(Math.random() * personalities.length)];
  quirk = quirks[Math.floor(Math.random() * quirks.length)];
  appearance = appearances[Math.floor(Math.random() * appearances.length)];
}


  let shopTypeValue = customShopType;
  if (customShopType === 'random' || customShopType === '') {
  shopTypeValue = shopTypes[Math.floor(Math.random() * shopTypes.length)];
}



setShopType(shopTypeValue);

  const pricingStyleObj = pricingStyles[Math.floor(Math.random() * pricingStyles.length)];
  const pricingStyle = pricingStyleObj.style;
  const priceModifier = pricingStyleObj.modifier;

  const shopAdjective = shopAdjectives[Math.floor(Math.random() * shopAdjectives.length)];
  const shopTypeNouns = shopNouns[shopTypeValue];
  const shopNoun = shopTypeNouns[Math.floor(Math.random() * shopTypeNouns.length)];
  const shopName = `The ${shopAdjective} ${shopNoun}`;

  const limits = getInventoryLimits(customSettlementSize);
  const selectedCommonItems = generateCommonItems(shopTypeValue, priceModifier, limits);
  const selectedRareItems = generateRareItems(shopTypeValue, priceModifier, limits);

  const generateShopkeeperDescription = (shopkeeper: { name: any; race: any; shopName?: string; shopType?: any; personality: any; quirk: any; appearance: any; pricingStyle?: string; priceModifier: any; commonItems?: never[]; rareItems?: never[]; motto?: string; }) => {
    const femaleNames = ['Eleanor', 'Sophia', 'Olivia', 'Elizabeth', 'Dagna', 'Helga', 'Brunhilda', 'Thyra', 'Arwen', 'Galadriel', 'Tauriel', 'Lúthien', 'Rosie', 'Daisy', 'Elanor', 'Poppy', 'Tilly', 'Nixie', 'Quilla', 'Shara', 'Kyra', 'Irena', 'Lyndis', 'Baggi', 'Usga', 'Yevelda', 'Orianna', 'Lilith', 'Naamah', 'Akta', 'Morvena', 'Shevarra', 'Surina', 'Farideh', 'Sora'];
    const isFemale = femaleNames.includes(shopkeeper.name.split(' ')[0]);
    const pronoun = isFemale ? 'she' : 'he';
    const possessivePronoun = isFemale ? 'her' : 'his';
    const reflexivePronoun = isFemale ? 'herself' : 'himself';
    const raceArticle = shopkeeper.race.toLowerCase().match(/^[aeiou]/) ? 'an' : 'a';

    const personalityDesc = getPersonalityDesc(shopkeeper.personality, isFemale, pronoun, possessivePronoun, reflexivePronoun);
    const appearanceDesc = getAppearanceDesc(shopkeeper.appearance, pronoun, possessivePronoun, reflexivePronoun, shopkeeper.race);
    const quirkDesc = getQuirkDesc(shopkeeper.quirk, pronoun, possessivePronoun, reflexivePronoun);
    const pricingDesc = getPricingDesc(shopkeeper.priceModifier, pronoun, possessivePronoun);

    const descriptionFormats = [
      `${shopkeeper.name.split(' ')[0]} is ${raceArticle} ${shopkeeper.race.toLowerCase()} merchant who is ${personalityDesc}. ${pronoun.charAt(0).toUpperCase() + pronoun.slice(1)} is ${appearanceDesc}. ${pronoun.charAt(0).toUpperCase() + pronoun.slice(1)} ${quirkDesc} and ${pricingDesc}.`,
      `${shopkeeper.name.split(' ')[0]} is ${raceArticle} ${shopkeeper.race.toLowerCase()} shopkeeper ${appearanceDesc}. ${pronoun.charAt(0).toUpperCase() + pronoun.slice(1)} is ${personalityDesc}. ${pronoun.charAt(0).toUpperCase() + pronoun.slice(1)} ${quirkDesc}. When it comes to business, ${pronoun} ${pricingDesc}.`,
      `${shopkeeper.name} runs ${possessivePronoun} shop with a peculiar habit—${pronoun} ${quirkDesc}. This ${shopkeeper.race.toLowerCase()} merchant is ${personalityDesc}. Customers can't help but notice that ${pronoun} is ${appearanceDesc}, and ${pronoun} ${pricingDesc}.`,
      `Known for ${pricingDesc}, ${shopkeeper.name.split(' ')[0]} is ${raceArticle} ${shopkeeper.race.toLowerCase()} who is ${personalityDesc}. ${pronoun.charAt(0).toUpperCase() + pronoun.slice(1)} ${quirkDesc}, adding to ${possessivePronoun} distinctive character. Regulars recognize ${shopkeeper.name.split(' ')[0]} as ${appearanceDesc}.`,
      `${shopkeeper.name} is ${raceArticle} ${shopkeeper.race.toLowerCase()} who is ${personalityDesc}. ${pronoun.charAt(0).toUpperCase() + pronoun.slice(1)}'s ${appearanceDesc} and ${pronoun} ${quirkDesc}. In terms of pricing, ${pronoun} ${pricingDesc}.`
    ];

    return descriptionFormats[Math.floor(Math.random() * descriptionFormats.length)];
  };

  const motto = generateMotto(shopTypeValue, priceModifier);

  const newShopkeeper = {
    name,
    race,
    shopName,
    shopType: shopTypeValue,
    personality,
    quirk,
    appearance,
    pricingStyle,
    priceModifier,
    commonItems: selectedCommonItems,
    rareItems: selectedRareItems,
    motto,
    description: generateShopkeeperDescription({
      name,
      race,
      personality,
      quirk,
      appearance,
      priceModifier
    })
  };

  setShopkeeper(newShopkeeper);
};

  
  // Lock shopkeeper toggle
  const [lockedShopkeeperIdentity, setLockedShopkeeperIdentity] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const toggleLock = () => {
  if (isLocked) {
    // Unlock: clear stored identity
    setLockedShopkeeperIdentity(null);
  } else if (shopkeeper) {
    // Lock: store current identity
    const { name, race, personality, quirk, appearance } = shopkeeper;
    setLockedShopkeeperIdentity({ name, race, personality, quirk, appearance });
  }
  setIsLocked(!isLocked);
};

<label className="flex items-center gap-2 text-sm text-stone-700">
  <input
    type="checkbox"
    checked={isLocked}
    onChange={() => setIsLocked(!isLocked)}
    className="accent-stone-500"
  />
  Lock shopkeeper
</label>


  // Effect to generate new inventory on settlement selection
useEffect(() => {
  if (shopkeeper) {
    const limits = getInventoryLimits(settlementSize);
    const updatedCommon = generateCommonItems(shopkeeper.shopType, shopkeeper.priceModifier, limits);
    const updatedRare = generateRareItems(shopkeeper.shopType, shopkeeper.priceModifier, limits);

    setShopkeeper({
      ...shopkeeper,
      commonItems: updatedCommon,
      rareItems: updatedRare
    });
  }
}, [settlementSize]);


  // Animation classes for regeneration
  const commonItemsClass = fadeCommon ? "opacity-0 transition-opacity duration-300" : "opacity-100 transition-opacity duration-300";
  const rareItemsClass = fadeRare ? "opacity-0 transition-opacity duration-300" : "opacity-100 transition-opacity duration-300";

  // Badge text and styling
const settlementBadgeClasses: { [key: string]: string } = {
  village: "bg-green-100 text-green-800 border-green-300",
  town: "bg-blue-100 text-blue-800 border-blue-300",
  city: "bg-purple-100 text-purple-800 border-purple-300",
  default: "bg-gray-100 text-gray-800 border-gray-300"
};

const getSettlementText = (size: string) => {
  switch (size) {
    case "village":
      return "Village Shop";
    case "town":
      return "Town Merchant";
    case "city":
      return "City Emporium";
    default:
      return "Merchant";
  }
};


  const shopTypeClasses: { [key: string]: string } = {
  "Blacksmith/Weaponsmith": "bg-slate-100 text-slate-800 border-slate-300",
  "Armorer": "bg-slate-100 text-slate-800 border-slate-300",
  "Magic Item Emporium": "bg-indigo-100 text-indigo-800 border-indigo-300",
  "Enchanter": "bg-indigo-100 text-indigo-800 border-indigo-300",
  "Alchemist/Potion Shop": "bg-indigo-100 text-indigo-800 border-indigo-300",
  "Adventuring Supplies": "bg-slate-100 text-slate-800 border-slate-300",
  "General Store": "bg-slate-100 text-slate-800 border-slate-300",
  "Jeweler": "bg-slate-100 text-slate-800 border-slate-300",
  "Exotic Goods": "bg-slate-100 text-slate-800 border-slate-300",
  "Bookstore & Scroll Shop": "bg-slate-100 text-slate-800 border-slate-300",
  "default": "bg-slate-100 text-slate-800 border-slate-300"
};
  
  return (
    <div className="min-h-screen pt-12 max-w-4xl mx-auto bg-stone-200 p-4 font-sans">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap');
          
          .cinzel {
            font-family: 'Cinzel', serif;
          }
          
          .inter {
            font-family: 'Inter', sans-serif;
          }
          
          .custom-purple {
            color: #5b5086;
          }
          
          .custom-purple-bg {
            background-color: #f5f0ff;
          }
          
          .custom-purple-border {
            border-color: #5b5086;
          }
          
          .custom-purple-button {
            background-color: #5b5086;
          }
          
          .custom-purple-button:hover {
            background-color: #4a4170;
          }
          
          .shopkeeper-card {
            background-color: #f8f7f5;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          
          .shop-icon {
            margin-right: 0.5rem;
            font-size: 1rem;
          }
          
          .shopkeeper-name {
            font-variant: small-caps;
            letter-spacing: 0.05em;
          }
          
          .header-content {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
          }
          
          .common-items-block {
            background-color: #f5f5f4;
            border: 1px solid #a8a29e;
          }
          
          .rare-items-block {
            background-color: #f5f3ff;
            border: 1px solid #c084fc;
          }
                    
          .rare-item-name {
            position: relative;
            padding-left: 1.5rem;
            display: flex;
            align-items: center;
          }
          
          .rare-item-name::before {
            content: "⭐";
            position: absolute;
            left: 0;
            font-size: 0.9rem;
          }
          
          .item-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: 10px 0;
            border-bottom: 1px solid rgba(198, 181, 155, 0.5);
          }
          
          .item-row:last-child {
            border-bottom: none;
          }
          
          .rare-item-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: 10px 0;
            border-bottom: 1px solid #c4b5fd;
          }
          
          .rare-item-row:last-child {
            border-bottom: none;
          }
          
          .price-block {
            text-align: right;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
          }
          
          .price-display {
            display: flex;
            align-items: center;
            min-width: 100px;
            justify-content: flex-end;
          }

          .currency-icon {
            display: inline-block;
            width: 1rem;
            height: 1rem;
            border-radius: 50%;
            margin-right: 4px;
            vertical-align: middle;
            position: relative;
          }
          
          .currency-wrapper {
            display: inline-flex;
            align-items: center;
            margin-right: 12px;
          }
          
          .currency-wrapper:last-child {
            margin-right: 0;
          }
          
          .currency-icon:hover::after {
            content: attr(data-tooltip);
            position: absolute;
            bottom: 120%;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 0.3rem 0.5rem;
            border-radius: 0.25rem;
            font-size: 0.75rem;
            white-space: nowrap;
            z-index: 10;
          }
          
          .gold-icon {
            background-color: #f9d71c;
            border: 1px solid #e6c619;
          }
          
          .silver-icon {
            background-color: #c6c6c6;
            border: 1px solid #a0a0a0;
          }
          
          .copper-icon {
            background-color: #b87333;
            border: 1px solid #8c572a;
          }
          
          .base-price {
            font-size: 0.7rem;
            opacity: 0.7;
            color: rgb(68, 64, 60);
            margin-top: 2px;
          }
          
          .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
          }
          
          .regen-button {
            font-size: 0.8rem;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 0.25rem;
          }
          
          .regen-button svg {
            width: 0.8rem;
            height: 0.8rem;
          }
          
          .common-regen {
            color:rgb(120, 113, 108);
            background-color: #f5f5f4;
            border: 1px solid #a8a29e;
          }
          
          .common-regen:hover {
            background-color: #e7e5e4;
          }
          
          .rare-regen {
            color: #7c3aed;
            background-color: #f5f3ff;
            border: 1px solid #c084fc;
          }
          
          .rare-regen:hover {
            background-color: #ede9fe;
          }
          
          
          .settlement-selector {
            display: flex;
            gap: 1px;
          }
          
          .settlement-option {
            padding: 0.4rem 0.8rem;
            font-size: 0.8rem;
            background-color: #e2e2e2;
            border: 1px solid #d2d2d2;
            transition: all 0.2s;
            position: relative;
          }
          
          .settlement-option:first-child {
            border-radius: 4px 0 0 4px;
          }
          
          .settlement-option:last-child {
            border-radius: 0 4px 4px 0;
          }
          
          .settlement-option.active {
            background-color: #f5f0ff;
            border-color: #5b5086;
            color: #5b5086;
            font-weight: 500;
            z-index: 2;
          }
          
          .settlement-option:hover:not(.active) {
            background-color: #eaeaea;
          }
          
          .empty-inventory {
            padding: 1rem;
            text-align: center;
            font-size: 0.9rem;
            color: #8b5cf6;
            font-style: italic;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          .fade-in {
            animation: fadeIn 0.3s ease-in;
          }
        `}
      </style>

          
{/* 🧭 New Top Control Panel */}
<div className="shopkeeper-card rounded-md shadow-sm p-6 mb-6">
  {/* Header */}
  <h1 className="text-4xl font-bold text-stone-600 cinzel shopkeeper-name m-0 leading-none">Fantasy Shop Builder</h1>

  {/* Header Row: Title + Badges + Randomize */}
  <div className="flex flex-wrap justify-between items-end mb-4 gap-2">
  {/* Settlement Size Toggles */}
  <div>
    <span className="text-sm font-medium text-stone-600 mr-2">Where is the shop located?</span>
    <div className="flex gap-2 mt-1">
      {["village", "town", "city"].map((size) => (
        <button
          key={size}
          onClick={() => setSettlementSize(size)}
          className={`text-xs uppercase font-medium inter tracking-wider rounded-md border px-2 py-1 whitespace-nowrap ${
            settlementSize === size
              ? "bg-stone-200 text-stone-500 border-stone-400"
              : "bg-stone-100 text-stone-500 border-stone-400 hover:bg-stone-200"
          }`}
        >
          {size}
        </button>
      ))}
    </div>
  </div>
{/* Randomize Button */}
<button
  onClick={() => {
    const sizes = ['village', 'town', 'city'];
    const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
    setShopType('');
    setSettlementSize(randomSize);
    generateShopkeeper('random', randomSize);
  }}
  className="flex items-center gap-2 text-xl uppercase font-medium noto emoji tracking-wider rounded-md py-1 whitespace-nowrap transition"
>
  <span role="img" aria-label="dice">🎲</span>
</button>
  </div>

{/* Shop Type Buttons */}
<div className="mb-3">
  <span className="text-sm font-medium text-stone-600 mr-2">What kind of shop are your players visiting?</span>
  <div className="flex flex-wrap gap-2 mt-1">
    {shopTypes.map((type) => (
      <button
        key={type}
        onClick={() => {
          setShopType(type);
          generateShopkeeper(type, settlementSize);
        }}
        className={`text-xs uppercase font-medium inter tracking-wider rounded-md border px-2 py-1 whitespace-nowrap ${
          shopType === type
            ? "bg-stone-200 text-stone-500 border-stone-400"
            : "bg-stone-100 text-stone-500 border-stone-400 hover:bg-stone-200"
        }`}
      >
        {type}
      </button>
    ))}
  </div>
</div>
</div>


      
      {shopkeeper && (
        
        <div className="shopkeeper-card rounded-md shadow-sm p-6">
          <div className="header-content mb-6">
            
            
            {/* Shop Name */}
            <div className="flex items-center gap-3 mb-1">
              {/* Shop Name */}
              <h2 className="text-2xl font-bold text-stone-600 cinzel shopkeeper-name m-0 leading-none">
                {shopkeeper.shopName}
              </h2>

              {/* Shop Type Label */}
              <div
                className={`text-xs uppercase font-medium inter tracking-wider rounded-md border px-2 py-1 whitespace-nowrap ${shopTypeClasses[shopkeeper.shopType] || shopTypeClasses["default"]}`}
              >
                <span className="shop-icon mr-1">{shopIcons[shopkeeper.shopType] || "🏪"}</span>
                {shopkeeper.shopType}
              </div>

              {/* Settlement Badge */}
              <div
                className={`text-xs uppercase font-medium inter tracking-wider rounded-md border px-2 py-1 whitespace-nowrap ${settlementBadgeClasses[settlementSize] || settlementBadgeClasses["default"]}`}
              >
                {getSettlementText(settlementSize)}
              </div>
            </div>


            {/* Shopkeeper Name & Race */}
            <div className="flex items-center gap-2 mb-2">
              <h3 className="shopkeeper-name text-lg text-stone-600 font-semibold cinzel m-0">
                {shopkeeper.name} <span className="text-stone-400 font-normal">• {shopkeeper.race}</span>
              </h3>
              <button
                onClick={() => setIsLocked(!isLocked)}
                aria-label="Toggle shopkeeper lock"
                className="text-stone-500 hover:text-stone-700 transition-colors text-xs"
              >
                {isLocked ? (
                  <span title="Locked">🔒 Locked</span>
                ) : (
                  <span title="Unlocked">🔓 Lock Shopkeeper</span>
                )}
              </button>
            </div>

            <div className="space-y-2">
           {/* Shopkeeper Description */}
           <div
              className="mt-2 text-sm text-gray-700"
              dangerouslySetInnerHTML={{ __html: shopkeeper?.description }}
            ></div>

            {/* Shop Motto directly under shopkeeper name */}
            <p className="text-sm italic text-stone-600">
              — "{shopkeeper.motto}"
            </p>
          </div>
          </div>
          <div className="mb-6">
            <p className="text-stone-700 inter mb-4 leading-relaxed border-t border-stone-200 pt-5 mt-2" 
               dangerouslySetInnerHTML={{ __html: highlightPricing(shopkeeper.roleplayNote) }}>
            </p>
          </div>
          
          {/* Inventory */}
          <div className="mb-6">            
            <div className="grid grid-cols-1 gap-6">
              <div className="common-items-block p-5 rounded-md">
                <div className="section-header">
                  <h4 className="text-xs tracking-widest uppercase font-semibold inter" style={{ color: "#78716c" }}>Common Items</h4>
                  <button 
                    onClick={regenerateCommonItems}
                    className="regen-button common-regen"
                    title="Regenerate common items"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
                    </svg>
                    Restock Items
                  </button>
                </div>
                <div className={commonItemsClass}>
                  {shopkeeper.commonItems.length > 0 ? (
                    shopkeeper.commonItems.map((item: { name: any; level: any; details: any; adjustedPrice: any; basePrice: any; }, index: any) => (
                      <div key={index} className="item-row">
                        <div className="flex flex-col">
                          <span className="text-stone-600">
                            {item.name}
                          </span>
                          {item.details && (
                            <span className="text-stone-500 text-sm mt-1 mb-1 pr-4">
                              {item.details}
                            </span>
                          )}
                        </div>
                        <div className="price-block">
                          <div className="price-display font-medium text-stone-600" 
                               dangerouslySetInnerHTML={{ __html: item.adjustedPrice }}>
                          </div>
                          {shopkeeper.priceModifier !== 0 && (
                            <div className="base-price">
                              Orignal: {item.basePrice}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-inventory">
                      This small establishment has no common items in stock.
                    </div>
                  )}
                </div>
              </div>
              
              <div className="rare-items-block p-5 rounded-md">
                <div className="section-header">
                  <h4 className="text-xs tracking-widest uppercase font-semibold inter" style={{ color: "#7c3aed" }}>Rare Items</h4>
                  <button 
                    onClick={regenerateRareItems}
                    className="regen-button rare-regen"
                    title="Regenerate rare items"
                    disabled={settlementSize === 'village'}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
                    </svg>
                    Restock Items
                  </button>
                </div>
                <div className={rareItemsClass}>
                  {shopkeeper.rareItems.length > 0 ? (
                    shopkeeper.rareItems.map((item: { name: any; level: any; details: any; adjustedPrice: any; basePrice: any; }, index: any) => (
                      <div key={index} className="rare-item-row">
                        <div className="flex flex-col">
                          <span className="rare-item-name text-violet-700">
                            {item.name}
                          </span>
                          {item.details && (
                            <span className="text-violet-500 text-sm mt-1 mb-1 pr-4 ml-6">
                              {item.details}
                            </span>
                          )}
                        </div>
                        <div className="price-block">
                          <div className="price-display font-medium text-violet-700" 
                               dangerouslySetInnerHTML={{ __html: item.adjustedPrice }}>
                          </div>
                          {shopkeeper.priceModifier !== 0 && (
                            <div className="base-price !text-violet-500">
                              Original: {item.basePrice}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-inventory">
                      {settlementSize === 'village' 
                        ? "This small village shop doesn't stock any rare or magical items." 
                        : "No rare items are currently in stock."}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {!shopkeeper && (
        <div className="shopkeeper-card rounded-md shadow-sm p-6 text-left">
          <h2 className="text-2xl font-bold text-stone-600 cinzel m-0leading-none">Welcome, Game Master.</h2>
<p className="text-stone-600 text-sm font inter leading-relaxed mb-4">
  Whether you're prepping five minutes before the session or improvising after your bard seduced the town treasurer, this 
    <span className="font-semibold"> Fantasy Shop Generator</span> has your back. Built with <span className="italic">Dungeons & Dragons 5e</span> in mind, it conjures a ready-to-use shopkeeper, inventory, and store concept in seconds.
</p>
<ul className="list-disc list-inside text-sm font inter text-stone-600 space-y-1 mb-6">
  <li><span className="font-semibold">🎲 Randomize:</span> Click the dice to summon an entirely new shop with randomized details.</li>
  <li><span className="font-semibold">🏷️ Shop Type:</span> Lock in the kind of store you want: alchemist, jeweler, scroll shop, and more.</li>
  <li><span className="font-semibold">🏘️ Settlement Size:</span> Choose between village, town, or city which affects inventory depth and rarity.</li>
  <li><span className="font-semibold">🔒 Lock Shopkeeper:</span> Found someone you like? Lock their identity and change the shop around them.</li>
</ul>
        </div>
      )}
    </div>
  );
}

export default ShopkeeperGenerator;