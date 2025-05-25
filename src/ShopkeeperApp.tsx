import React, { useState, useEffect } from 'react';


function ShopkeeperGenerator() {
  const [shopkeeper, setShopkeeper] = useState(null);
  const [shopType, setShopType] = useState('');
  const [settlementSize, setSettlementSize] = useState('');
  const [fadeCommon, setFadeCommon] = useState(false);
  const [fadeRare, setFadeRare] = useState(false);
  const [controlsExpanded, setControlsExpanded] = useState(false);
  
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
    'Blacksmith',
    'Alchemist',
    'Mystic Goods',
    'Exotic Goods',
    'Jeweler'
  ];
  
  // Shop type icons mapping
  const shopIcons = {
  'General Store': "box",
  'Blacksmith': "swords", 
  'Alchemist': "experiment",
  'Mystic Goods': "wand_stars",
  'Exotic Goods': "festival",
  'Jeweler': "diamond"
};

  const shopAdjectives = [
    'Rusty', 'Golden', 'Silver', 'Emerald', 'Crimson', 'Mystic', 'Arcane', 
    'Twisted', 'Dancing', 'Hidden', 'Lucky', 'Ancient', 'Curious', 'Wandering'
  ];
  
  const shopNouns = {
    'General Store': ['Trading Post', 'Goods', 'Market', 'Supplies', 'Wares', 'Bazaar', 'Emporium', 'Outfitter'],
    'Blacksmith': ['Forge', 'Anvil', 'Hammer', 'Blade', 'Steel', 'Iron', 'Weapon'],
    'Alchemist': ['Potion', 'Brew', 'Elixir', 'Concoction', 'Vial', 'Mixture', 'Philter'],
    'Mystic Goods': ['Curio','Wonder', 'Arcanum','Glyph', 'Rune', 'Enchantment', 'Sigil', 'Spellwork', 'Charm', 'Binding'],
    'Exotic Goods': ['Oddity', 'Curiosity', 'Wonder', 'Rarity', 'Import', 'Exotic', 'Treasure'],
    'Jeweler': ['Gem', 'Jewel', 'Ring', 'Crown', 'Gold', 'Bauble', 'Ornament']
  };
  

 // Fantasy Shop Item Database
const shopItems = {
  'Alchemist': [
    { name: 'Acid Vial', price: '25 gp', level: 'Common', details: 'Deals 2d6 acid damage when thrown (range 20/60). Caustic liquid that smokes when exposed to air.' },
    { name: 'Alchemist Fire', price: '50 gp', level: 'Common', details: 'Sticky, adhesive fluid that ignites when exposed to air. 1d4 fire damage on hit and at start of target\'s turns.' },
    { name: 'Alchemist\'s Supplies', price: '50 gp', level: 'Common', details: 'Includes two glass beakers, a metal frame to hold a beaker in place over an open flame, a glass stirring rod, a small mortar and pestle, and a pouch of common alchemical ingredients, including salt, powdered iron, and purified water. Proficiency in arcana and investigation.' },
    { name: 'Antitoxin', price: '50 gp', level: 'Common', details: 'Grants advantage on saving throws against poison for 1 hour. Clear fluid with shifting silver patterns.' },
    { name: 'Basic Poison', price: '100 gp', level: 'Common', details: 'Applied to weapons. Target must make DC 10 Constitution save or take 1d4 poison damage. Lasts 1 minute.' },
    { name: 'Healer\'s Kit', price: '5 gp', level: 'Common', details: '10 uses. Stabilizes a creature that has 0 hit points without requiring a Medicine check.' },
    { name: 'Herbalism Kit', price: '5 gp', level: 'Common', details: 'Collection of clippers, mortar and pestle, pouches and vials used to create remedies and potions.' },
    { name: 'Perfume', price: '5 gp', level: 'Common', details: 'Fragrant oils in a decorative vial. Can mask odors or create a pleasant impression in social situations.' },
    { name: 'Potion of Healing', price: '50 gp', level: 'Common', details: 'Restores 2d4+2 hit points when consumed. Red liquid that bubbles and glows faintly.' },
    { name: 'Smokestick', price: '10 gp', level: 'Common', details: 'When lit, creates thick smoke in a 10-foot radius for 1 minute. Obscures vision and can deter pursuing creatures.' },
    { name: 'Soap', price: '2 cp', level: 'Common', details: 'Cleansing agent made from animal fat and lye. Removes stubborn stains and lingering odors.' },
    { name: 'Poisoner\'s Kit', price: '50 gp', level: 'Common', details: 'Glass vials, mixing equipment, and materials for creating and applying poisons safely.' },
    { name: 'Oil (flask)', price: '1 sp', level: 'Common', details: 'Clear oil that burns for 6 hours in a lantern. Can be thrown as splash weapon for 5 fire damage.' },
    { name: 'Fire Breath Potion', price: '500 gp', level: 'Rare', details: 'After drinking, use a bonus action to exhale fire at a target within 30 feet in a 15-foot cone. The target must make a DC 13 Dexterity saving throw, taking 4d6 fire damage on a failed save, or half as much damage on a successful one. The effect ends after fire is exhaled three times or when 1 hour has passed.' },
    { name: 'Potion of Superior Healing', price: '500 gp', level: 'Rare', details: 'Sparkling crimson liquid that shimmers with gold flecks when shaken. Restores 8d4 + 8 hit points when consumed.' },
    { name: 'Greater Healing Potion', price: '200 gp', level: 'Uncommon', details: 'Dark crimson liquid that gives off ruby-colored shimmering luminescence. Restores 4d4 + 4 hit points when consumed.' },
    { name: 'Oil of Slipperiness', price: '200 gp', level: 'Uncommon', details: 'Can be applied to surface or a creature of medium size or smaller. Creates grease spell effect for 8 hours. Can be used to escape restraints.' },
    { name: 'Potion of Flying', price: '1000 gp', level: 'Very rare', details: 'Cloudy white liquid with feather-like patterns. Grants flying speed of drinker\'s walking speed for 1 hour.' },
    { name: 'Potion of Invisibility', price: '1000 gp', level: 'Very rare', details: 'An empty-looking vial that feels like it holds liquid. Turns drinker invisible for 1 hour, including clothes and carried items. Effect ends if drinker attacks or casts a spell.' }
  ],
  'Blacksmith': [
    { name: 'Arrows (20)', price: '1 gp', level: 'Common', details: 'Standard arrows for shortbows and longbows.' },
    { name: 'Blowgun', price: '10 gp', level: 'Common', details: '1 Piercing, Ammunition, Loading, (Range 25/100)' },
    { name: 'Blowgun Needles (50)', price: '1 gp', level: 'Common', details: 'Thin needles for blowguns.' },
    { name: 'Breastplate', price: '400 gp', level: 'Common', details: 'AC 14 + Dex modifier (max 2), Medium Armor' },
    { name: 'Bronze Battleaxe', price: '8 gp', level: 'Common', details: '1d8 Slashing, Versatile 1d10' },
    { name: 'Bronze Breastplate', price: '300 gp', level: 'Common', details: 'AC 14 + Dex (max 2)' },
    { name: 'Bronze Chain Shirt', price: '38 gp', level: 'Common', details: 'AC 13 + Dex (max 2)' },
    { name: 'Bronze Dagger', price: '1 gp', level: 'Common', details: '1d4 Piercing, Finesse, Light, Thrown 20/60' },
    { name: 'Bronze Longsword', price: '12 gp', level: 'Common', details: '1d8 Slashing, Versatile 1d10' },
    { name: 'Bronze Mace', price: '4 gp', level: 'Common', details: '1d6 Bludgeoning' },
    { name: 'Bronze Rapier', price: '23 gp', level: 'Common', details: '1d8 Piercing, Finesse' },
    { name: 'Bronze Scale Mail', price: '38 gp', level: 'Common', details: 'AC 14 + Dex (max 2). Stealth disadvantage.' },
    { name: 'Bronze Scimitar', price: '23 gp', level: 'Common', details: '1d6 Slashing, Finesse, Light' },
    { name: 'Bronze Shield', price: '8 gp', level: 'Common', details: '+2 AC' },
    { name: 'Bronze Shortsword', price: '9 gp', level: 'Common', details: '1d6 Piercing, Finesse, Light' },
    { name: 'Bronze Studs Armor', price: '38 gp', level: 'Common', details: 'AC 12 + Dex' },
    { name: 'Club', price: '1 sp', level: 'Common', details: '1d4 Bludgeoning, Light' },
    { name: 'Copper Battleaxe', price: '5 gp', level: 'Common', details: '1d8 Slashing, Versatile 1d10. Chips easily.' },
    { name: 'Copper Breastplate', price: '200 gp', level: 'Common', details: 'AC 14 + Dex (max 2). Tarnishes and shows dents easily.' },
    { name: 'Copper Chain Shirt', price: '25 gp', level: 'Common', details: 'AC 13 + Dex (max 2). Tarnishes easily.' },
    { name: 'Copper Dagger', price: '8 sp', level: 'Common', details: '1d4 Piercing, Finesse, Light, Thrown 20/60. Dulls quickly.' },
    { name: 'Copper Longsword', price: '8 gp', level: 'Common', details: '1d8 Slashing, Versatile 1d10. Bends easily, -1 damage.' },
    { name: 'Copper Mace', price: '3 gp', level: 'Common', details: '1d6 Bludgeoning. Dents easily.' },
    { name: 'Copper Rapier', price: '20 gp', level: 'Common', details: '1d8 Piercing, Finesse. Bends under stress.' },
    { name: 'Copper Scale Mail', price: '25 gp', level: 'Common', details: 'AC 14 + Dex (max 2).Tarnishes easily. Stealth disadvantage.' },
    { name: 'Copper Scimitar', price: '20 gp', level: 'Common', details: '1d6 Slashing, Finesse, Light. Tarnishes in humidity.' },
    { name: 'Copper Shield', price: '5 gp', level: 'Common', details: '+2 AC. Dents easily.' },
    { name: 'Copper Shortsword', price: '8 gp', level: 'Common', details: '1d6 Piercing, Finesse, Light. Dulls quickly.' },
    { name: 'Copper Studs armor', price: '30 gp', level: 'Common', details: 'AC 12 + Dex. Tarnishes easily.' },
    { name: 'Crossbow Bolts (20)', price: '1 gp', level: 'Common', details: 'Standard bolts for crossbows.' },
    { name: 'Dart', price: '5 cp', level: 'Common', details: '1d4 Piercing, Finesse, Thrown (range 20/60)' },
    { name: 'Gleaming Armor', price: '500 gp', level: 'Common', details: 'Magically enchanted to never get dirty. Sheds bright light in 10-foot radius when exposed to sunlight.' },
    { name: 'Greatclub', price: '2 sp', level: 'Common', details: '1d8 Bludgeoning, Two-handed' },
    { name: 'Hand Crossbow', price: '75 gp', level: 'Common', details: '1d6 Piercing, Ammunition, Light, Loading, (Range 30/120)' },
    { name: 'Heavy Crossbow', price: '50 gp', level: 'Common', details: '1d10 Piercing, Ammunition, Heavy, Loading, (Range 100/400), Two-Handed' },
    { name: 'Helmet', price: '10 gp', level: 'Common', details: 'Protects the head from blunt impacts. No mechanical bonus but may provide situational benefits.' },
    { name: 'Iron Battleaxe', price: '9 gp', level: 'Common', details: '1d8 Slashing, Versatile 1d10' },
    { name: 'Iron Breastplate', price: '360 gp', level: 'Common', details: 'AC 14 + Dex (max 2)' },
    { name: 'Iron Chain Mail', price: '60 gp', level: 'Common', details: 'AC 16, Str 13. Stealth disadvantage.' },
    { name: 'Iron Chain Shirt', price: '45 gp', level: 'Common', details: 'AC 13 + Dex (max 2)' },
    { name: 'Iron Dagger', price: '1 gp 5 sp', level: 'Common', details: '1d4 Piercing, Finesse, Light, Thrown 20/60' },
    { name: 'Iron Flail', price: '8 gp', level: 'Common', details: '1d8 Bludgeoning' },
    { name: 'Iron Glaive', price: '15 gp', level: 'Common', details: '1d10 Slashing, Heavy, Reach, Two-handed' },
    { name: 'Iron Greataxe', price: '25 gp', level: 'Common', details: '1d12 Slashing, Heavy, Two-handed' },
    { name: 'Iron Greatsword', price: '40 gp', level: 'Common', details: '2d6 Slashing, Heavy, Two-handed' },
    { name: 'Iron Half Plate', price: '600 gp', level: 'Common', details: 'AC 15 + Dex (max 2). Stealth disadvantage.' },
    { name: 'Iron Longsword', price: '13 gp', level: 'Common', details: '1d8 Slashing, Versatile 1d10' },
    { name: 'Iron Mace', price: '4 gp 5 sp', level: 'Common', details: '1d6 Bludgeoning' },
    { name: 'Iron Rapier', price: '24 gp', level: 'Common', details: '1d8 Piercing, Finesse' },
    { name: 'Iron Scale Mail', price: '45 gp', level: 'Common', details: 'AC 14 + Dex (max 2). Stealth disadvantage.' },
    { name: 'Iron Scimitar', price: '24 gp', level: 'Common', details: '1d6 Slashing, Finesse, Light' },
    { name: 'Iron Shield', price: '9 gp', level: 'Common', details: '+2 AC' },
    { name: 'Iron Shortsword', price: '9 gp 5 sp', level: 'Common', details: '1d6 Piercing, Finesse, Light' },
    { name: 'Iron Splint', price: '150 gp', level: 'Common', details: 'AC 17, Str 15. Stealth disadvantage.' },
    { name: 'Iron Studs armor', price: '42 gp', level: 'Common', details: 'AC 12 + Dex' },
    { name: 'Iron Trident', price: '4 gp', level: 'Common', details: '1d6 Piercing, Thrown (range 20/60), Versatile (1d8)' },
    { name: 'Iron Warhammer', price: '12 gp', level: 'Common', details: '1d8 Bludgeoning, Versatile 1d10' },
    { name: 'Javelin', price: '5 sp', level: 'Common', details: '1d6 Piercing, Thrown (range 30/120)' },
    { name: 'Leather Armor', price: '10 gp', level: 'Common', details: 'AC 11 + Dex' },
    { name: 'Light Crossbow', price: '25 gp', level: 'Common', details: '1d8 Piercing, Ammunition, Loading, (Range 80/320), Two-Handed' },
    { name: 'Longbow', price: '50 gp', level: 'Common', details: '1d8 Piercing, Ammunition, Heavy, (Range 150/600), Two-Handed' },
    { name: 'Net', price: '1 gp', level: 'Common', details: 'Special, Thrown (range 5/15)' },
    { name: 'Quarterstaff', price: '2 sp', level: 'Common', details: '1d6 Bludgeoning, Versatile (1d8)' },
    { name: 'Shortbow', price: '25 gp', level: 'Common', details: '1d6 Piercing, Ammunition, (Range 80/320), Two-Handed' },
    { name: 'Sling', price: '1 sp', level: 'Common', details: '1d4 Bludgeoning, Ammunition (range 30/120)' },
    { name: 'Sling Bullets (20)', price: '4 cp', level: 'Common', details: 'Lead bullets more effective than stones.' },
    { name: 'Spear', price: '1 gp', level: 'Common', details: '1d6 Piercing, Thrown (range 20/60), Versatile (1d8)' },
    { name: 'Steel Battleaxe', price: '10 gp', level: 'Common', details: '1d8 Slashing, Versatile 1d10' },
    { name: 'Steel Breastplate', price: '400 gp', level: 'Common', details: 'AC 14 + Dex (max 2)' },
    { name: 'Steel Chain Mail', price: '75 gp', level: 'Common', details: 'AC 16, Str 13. Stealth disadvantage.' },
    { name: 'Steel Chain Shirt', price: '50 gp', level: 'Common', details: 'AC 13 + Dex (max 2)' },
    { name: 'Steel Dagger', price: '2 gp', level: 'Common', details: '1d4 Piercing, Finesse, Light, Thrown 20/60' },
    { name: 'Steel Flail', price: '10 gp', level: 'Common', details: '1d8 Bludgeoning' },
    { name: 'Steel Glaive', price: '20 gp', level: 'Common', details: '1d10 Slashing, Heavy, Reach, Two-handed' },
    { name: 'Steel Greataxe', price: '30 gp', level: 'Common', details: '1d12 Slashing, Heavy, Two-handed' },
    { name: 'Steel Greatsword', price: '50 gp', level: 'Common', details: '2d6 Slashing, Heavy, Two-handed' },
    { name: 'Steel Half Plate', price: '750 gp', level: 'Common', details: 'AC 15 + Dex (max 2). Stealth disadvantage.' },
    { name: 'Steel Longsword', price: '15 gp', level: 'Common', details: '1d8 Slashing, Versatile 1d10' },
    { name: 'Steel Mace', price: '5 gp', level: 'Common', details: '1d6 Bludgeoning' },
    { name: 'Steel Plate', price: '1,500 gp', level: 'Common', details: 'AC 18, Str 15. Stealth disadvantage.' },
    { name: 'Steel Rapier', price: '25 gp', level: 'Common', details: '1d8 Piercing, Finesse' },
    { name: 'Steel Scale Mail', price: '50 gp', level: 'Common', details: 'AC 14 + Dex (max 2). Stealth disadvantage.' },
    { name: 'Steel Scimitar', price: '25 gp', level: 'Common', details: '1d6 Slashing, Finesse, Light' },
    { name: 'Steel Shield', price: '10 gp', level: 'Common', details: '+2 AC' },
    { name: 'Steel Shortsword', price: '10 gp', level: 'Common', details: '1d6 Piercing, Finesse, Light' },
    { name: 'Steel Splint', price: '200 gp', level: 'Common', details: 'AC 17, Str 15. Stealth disadvantage.' },
    { name: 'Steel Studs Armor', price: '45 gp', level: 'Common', details: 'AC 12 + Dex' },
    { name: 'Steel Trident', price: '5 gp', level: 'Common', details: '1d6 Piercing, Thrown (range 20/60), Versatile (1d8)' },
    { name: 'Steel Warhammer', price: '15 gp', level: 'Common', details: '1d8 Bludgeoning, Versatile 1d10' },
    { name: 'Studded Leather Armor', price: '45 gp', level: 'Common', details: 'AC 11 + Dex' },
    { name: 'Whip', price: '2 gp', level: 'Common', details: '1d4 Slashing, Finesse, Reach' },
    { name: 'Chain (10 feet)', price: '5 gp', level: 'Common', details: 'Heavy iron chain with 2 links per foot. AC 19, 5 hit points, can be burst with DC 20 Strength check.' },
    { name: 'Smith\'s Tools', price: '20 gp', level: 'Common', details: 'Hammers, tongs, charcoal, rags, and bellows for working heated metal.' },
    { name: 'Starmetal Greataxe', price: '30,030 gp', level: 'Legendary', details: '1d12 Slashing, Heavy, Two-handed. +2 weapon, creates starlight on crits.' },
    { name: 'Starmetal Greatsword', price: '50,050 gp', level: 'Legendary', details: '2d6 Slashing, Heavy, Two-handed. +2 weapon, starlight trail on swings.' },
    { name: 'Starmetal Longsword', price: '15,015 gp', level: 'Legendary', details: '1d8 Slashing, Versatile 1d10. Masterwork, glows with starlight.' },
    { name: 'Starmetal Plate', price: '50,000 gp', level: 'Legendary', details: 'AC 18, Str 15. +1 AC, immunity to critical hits. Masterwork, glows with starlight. Stealth disadvantage.' },
    { name: 'Adamantine armor', price: '5,000 gp', level: 'Rare', details: 'Any heavy armor made of nearly indestructible metal. Critical hits against wearer become normal hits.' },
    { name: 'Adamantine Battleaxe', price: '1,010 gp', level: 'Rare', details: '1d8 Slashing, Versatile 1d10. Ignores object hardness, crits on 19-20.' },
    { name: 'Adamantine Breastplate', price: '900 gp', level: 'Rare', details: 'AC 14 + Dex (max 2). Critical hits become normal hits.' },
    { name: 'Adamantine Chain Mail', price: '750 gp', level: 'Rare', details: 'AC 16, Str 13. Critical hits become normal hits. Stealth disadvantage.' },
    { name: 'Adamantine Chain Shirt', price: '550 gp', level: 'Rare', details: 'AC 13 + Dex (max 2). Critical hits become normal hits.' },
    { name: 'Adamantine Dagger', price: '102 gp', level: 'Rare', details: '1d4 Piercing, Finesse, Light, Thrown 20/60. Ignores object hardness.' },
    { name: 'Adamantine Flail', price: '510 gp', level: 'Rare', details: '1d8 Bludgeoning. Chain never breaks.' },
    { name: 'Adamantine Glaive', price: '1,020 gp', level: 'Rare', details: '1d10 Slashing, Heavy, Reach, Two-handed. Ignores object hardness, crits on 19-20.' },
    { name: 'Adamantine Greataxe', price: '1,030 gp', level: 'Rare', details: '1d12 Slashing, Heavy, Two-handed. Ignores object hardness, cleaves.' },
    { name: 'Adamantine Greatsword', price: '550 gp', level: 'Rare', details: '2d6 Slashing, Heavy, Two-handed. Ignores object hardness.' },
    { name: 'Adamantine Half Plate', price: '1,500 gp', level: 'Rare', details: 'AC 15 + Dex (max 2). Critical hits become normal hits. Stealth disadvantage.' },
    { name: 'Adamantine Longsword', price: '1,015 gp', level: 'Rare', details: '1d8 Slashing, Versatile 1d10. Ignores object hardness, crits on 19-20.' },
    { name: 'Adamantine Mace', price: '105 gp', level: 'Rare', details: '1d6 Bludgeoning. Ignores object hardness, crits on 19-20.' },
    { name: 'Adamantine Plate', price: '5,000 gp', level: 'Rare', details: 'AC 18, Str 15. Critical hits become normal hits. Stealth disadvantage.' },
    { name: 'Adamantine Rapier', price: '525 gp', level: 'Rare', details: '1d8 Piercing, Finesse. Ignores object hardness, never breaks.' },
    { name: 'Adamantine Scale Mail', price: '550 gp', level: 'Rare', details: 'AC 14 + Dex (max 2). Critical hits become normal hits. Stealth disadvantage.' },
    { name: 'Adamantine Scimitar', price: '525 gp', level: 'Rare', details: '1d6 Slashing, Finesse, Light. Ignores object hardness.' },
    { name: 'Adamantine Shield', price: '510 gp', level: 'Rare', details: '+2 AC. Cannot be sundered.' },
    { name: 'Adamantine Shortsword', price: '510 gp', level: 'Rare', details: '1d6 Piercing, Finesse, Light. Ignores object hardness.' },
    { name: 'Adamantine Splint', price: '1,200 gp', level: 'Rare', details: 'AC 17, Str 15. Critical hits become normal hits. Stealth disadvantage.' },
    { name: 'Adamantine Studs armor', price: '450 gp', level: 'Rare', details: 'AC 12 + Dex. Critical hit protection on studs.' },
    { name: 'Adamantine Trident', price: '505 gp', level: 'Rare', details: '1d6 Piercing, Thrown (range 20/60), Versatile (1d8). Prongs never break.' },
    { name: 'Adamantine Warhammer', price: '1,015 gp', level: 'Rare', details: '1d8 Bludgeoning, Versatile 1d10. Ignores object hardness, shatters weapons.' },
    { name: 'Armor (+1)', price: '2,500 gp', level: 'Rare', details: 'Any armor that provides +1 bonus to AC beyond its normal AC value. Magical enchantments strengthen its protection.' },
    { name: 'Concealed Weapon', price: '150 gp', level: 'Rare', details: 'Designed to be hidden or disguised as ordinary objects. Advantage on Sleight of Hand checks to conceal.' },
    { name: 'Decorative Ceremonial Armor', price: '400 gp', level: 'Rare', details: 'Ornate armor designed for display rather than protection. Elaborate engravings and embellishments. Provides standard AC.' },
    { name: 'Dragon Leather Armor', price: '250 gp', level: 'Rare', details: 'AC 11 + Dex. Fire resistance.' },
    { name: 'Exotic Weapon', price: '250 gp', level: 'Rare', details: 'Unusual design from distant lands. May have unique properties or fighting style requirements. Often has distinctive appearance.' },
    { name: 'Mithral Battleaxe', price: '1,510 gp', level: 'Rare', details: '1d8 Slashing, Versatile 1d10. Half weight.' },
    { name: 'Mithral Breastplate', price: '1,200 gp', level: 'Rare', details: 'AC 14 + Dex (max 2)' },
    { name: 'Mithral Chain Mail', price: '1,200 gp', level: 'Rare', details: 'AC 16, Str 13. No strength requirement. No stealth disadvantage.' },
    { name: 'Mithral Chain Shirt', price: '850 gp', level: 'Rare', details: 'AC 13 + Dex (max 2)' },
    { name: 'Mithral Dagger', price: '152 gp', level: 'Rare', details: '1d4 Piercing, Finesse, Light, Thrown 20/60. Half weight, +1 to thrown attacks.' },
    { name: 'Mithral Flail', price: '760 gp', level: 'Rare', details: '1d8 Bludgeoning. Half weight, increased speed.' },
    { name: 'Mithral Glaive', price: '1,520 gp', level: 'Rare', details: '1d10 Slashing, Heavy, Reach, Two-handed. Half weight, extended reach.' },
    { name: 'Mithral Greataxe', price: '1,530 gp', level: 'Rare', details: '1d12 Slashing, Heavy, Two-handed. Half weight despite size.' },
    { name: 'Mithral Greatsword', price: '800 gp', level: 'Rare', details: '2d6 Slashing, Heavy, Two-handed. Half weight despite size.' },
    { name: 'Mithral Half Plate', price: '2,000 gp', level: 'Rare', details: 'AC 15 + Dex (max 2). No stealth disadvantage.' },
    { name: 'Mithral Hand Crossbow', price: '575 gp', level: 'Rare', details: '1d6 Piercing, Ammunition, Light, Loading, (Range 30/120). Masterwork mithral mechanism.' },
    { name: 'Mithral Heavy Crossbow', price: '550 gp', level: 'Rare', details: '1d10 Piercing, Ammunition, Loading, (Range 100/400), Two-Handed. Loses Heavy property due to mithral frame.' },
    { name: 'Mithral Light Crossbow', price: '525 gp', level: 'Rare', details: '1d8 Piercing, Ammunition, Loading, (Range 80/320), Two-Handed. Half weight, precision crafted.' },
    { name: 'Mithral Longbow', price: '550 gp', level: 'Rare', details: '1d8 Piercing, Ammunition, (Range 150/600), Two-Handed. Loses Heavy property, mithral core reinforcement.' },
    { name: 'Mithral Longsword', price: '1,515 gp', level: 'Rare', details: '1d8 Slashing, Versatile 1d10. Half weight, +1 to finesse-style attacks.' },
    { name: 'Mithral Mace', price: '155 gp', level: 'Rare', details: '1d6 Bludgeoning. Half weight.' },
    { name: 'Mithral Plate', price: '7,500 gp', level: 'Rare', details: 'AC 18, Str 15. Str 13 requirement. No stealth disadvantage.' },
    { name: 'Mithral Rapier', price: '775 gp', level: 'Rare', details: '1d8 Piercing, Finesse. Half weight, lightning-fast thrusts.' },
    { name: 'Mithral Scale Mail', price: '850 gp', level: 'Rare', details: 'AC 14 + Dex (max 2). No stealth disadvantage.' },
    { name: 'Mithral Scimitar', price: '775 gp', level: 'Rare', details: '1d6 Slashing, Finesse, Light. Half weight, perfect balance.' },
    { name: 'Mithral Shield', price: '760 gp', level: 'Rare', details: '+2 AC. Half weight, no armor check penalty.' },
    { name: 'Mithral Shortbow', price: '525 gp', level: 'Rare', details: '1d6 Piercing, Ammunition, (Range 80/320), Two-Handed. Impossibly light construction.' },
    { name: 'Mithral Shortsword', price: '760 gp', level: 'Rare', details: '1d6 Piercing, Finesse, Light. Half weight, superior balance.' },
    { name: 'Mithral Splint', price: '1,800 gp', level: 'Rare', details: 'AC 17, Str 15. Str 13 requirement. No stealth disadvantage.' },
    { name: 'Mithral Studs armor', price: '650 gp', level: 'Rare', details: 'AC 12 + Dex' },
    { name: 'Mithral Trident', price: '755 gp', level: 'Rare', details: '1d6 Piercing, Thrown (range 20/60), Versatile (1d8). Half weight, improved throwing.' },
    { name: 'Mithral Warhammer', price: '1,515 gp', level: 'Rare', details: '1d8 Bludgeoning, Versatile 1d10. Half weight, precise strikes.' },
    { name: 'Shield (+1)', price: '2,500 gp', level: 'Rare', details: 'Shield with arcane runes or divine symbols. Provides additional +1 AC beyond normal shield bonus.' },
    { name: 'Weapon (+1)', price: '2,500 gp', level: 'Rare', details: 'Grants +1 bonus to attack and damage rolls. Counts as magical for overcoming resistance.' },
    { name: 'Cold Iron Dagger', price: '15 gp', level: 'Uncommon', details: '1d4 Piercing, Finesse, Light, Thrown 20/60. Fey/fiend damage.' },
    { name: 'Cold Iron Longsword', price: '125 gp', level: 'Uncommon', details: '1d8 Slashing, Versatile 1d10. Fey/fiend damage.' },
    { name: 'Exotic Hide Armor', price: '35 gp', level: 'Uncommon', details: 'AC 11 + Dex. Resistance to one damage type.' },
    { name: 'Hardened Leather Armor', price: '15 gp', level: 'Uncommon', details: 'AC 11 + Dex +1' },
    { name: 'Silver Battleaxe', price: '110 gp', level: 'Uncommon', details: '1d8 Slashing, Versatile 1d10. Lycanthrope/undead damage.' },
    { name: 'Silver Breastplate', price: '500 gp', level: 'Uncommon', details: 'AC 14 + Dex (max 2). Lycanthrope/undead protection.' },
    { name: 'Silver Chain Mail', price: '200 gp', level: 'Uncommon', details: 'AC 16, Str 13. Lycanthrope/undead protection. Stealth disadvantage.' },
    { name: 'Silver Chain Shirt', price: '150 gp', level: 'Uncommon', details: 'AC 13 + Dex (max 2). Lycanthrope/undead protection.' },
    { name: 'Silver Dagger', price: '12 gp', level: 'Uncommon', details: '1d4 Piercing, Finesse, Light, Thrown 20/60. Lycanthrope/undead damage.' },
    { name: 'Silver Flail', price: '110 gp', level: 'Uncommon', details: '1d8 Bludgeoning. Lycanthrope/undead damage.' },
    { name: 'Silver Glaive', price: '120 gp', level: 'Uncommon', details: '1d10 Slashing, Heavy, Reach, Two-handed. Lycanthrope/undead damage.' },
    { name: 'Silver Greataxe', price: '130 gp', level: 'Uncommon', details: '1d12 Slashing, Heavy, Two-handed. Lycanthrope/undead damage.' },
    { name: 'Silver Greatsword', price: '150 gp', level: 'Uncommon', details: '2d6 Slashing, Heavy, Two-handed. Lycanthrope/undead damage.' },
    { name: 'Silver Half Plate', price: '1,000 gp', level: 'Uncommon', details: 'AC 15 + Dex (max 2). Lycanthrope/undead protection. Stealth disadvantage.' },
    { name: 'Silver Longsword', price: '115 gp', level: 'Uncommon', details: '1d8 Slashing, Versatile 1d10. Lycanthrope/undead damage.' },
    { name: 'Silver Mace', price: '25 gp', level: 'Uncommon', details: '1d6 Bludgeoning. Lycanthrope/undead damage.' },
    { name: 'Silver Plate', price: '2,000 gp', level: 'Uncommon', details: 'AC 18, Str 15. Lycanthrope/undead protection. Stealth disadvantage.' },
    { name: 'Silver Rapier', price: '125 gp', level: 'Uncommon', details: '1d8 Piercing, Finesse. Lycanthrope/undead damage.' },
    { name: 'Silver Scale Mail', price: '150 gp', level: 'Uncommon', details: 'AC 14 + Dex (max 2). Lycanthrope/undead protection. Stealth disadvantage.' },
    { name: 'Silver Scimitar', price: '125 gp', level: 'Uncommon', details: '1d6 Slashing, Finesse, Light. Lycanthrope/undead damage.' },
    { name: 'Silver Shield', price: '60 gp', level: 'Uncommon', details: '+2 AC. Lycanthrope/undead protection.' },
    { name: 'Silver Shortsword', price: '110 gp', level: 'Uncommon', details: '1d6 Piercing, Finesse, Light. Lycanthrope/undead damage.' },
    { name: 'Silver Splint', price: '350 gp', level: 'Uncommon', details: 'AC 17, Str 15. Lycanthrope/undead protection. Stealth disadvantage.' },
    { name: 'Silver Studs Armor', price: '120 gp', level: 'Uncommon', details: 'AC 12 + Dex. Lycanthrope protection.' },
    { name: 'Silver Trident', price: '105 gp', level: 'Uncommon', details: '1d6 Piercing, Thrown (range 20/60), Versatile (1d8). Lycanthrope/undead damage.' },
    { name: 'Silver Warhammer', price: '115 gp', level: 'Uncommon', details: '1d8 Bludgeoning, Versatile 1d10. Lycanthrope/undead damage.' },
    { name: 'Celestial Leather Armor', price: '500 gp', level: 'Very rare', details: 'AC 11 + Dex. Radiant resistance, faint holy glow.' },
    { name: 'Celestial Plate', price: '15,000 gp', level: 'Very rare', details: 'AC 17, Str 15. Radiant resistance, casts light. Stealth disadvantage.' },
    { name: 'Dragonscale Mail', price: '2,500 gp', level: 'Very rare', details: 'AC 14 + Dex (max 2). Resistance to dragon type. No stealth disadvantage.' },
    { name: 'Dragonscale Shield', price: '2,510 gp', level: 'Very rare', details: '+2 AC. Resistance to breath weapon.' }
  ],
  'Exotic Goods': [
    { name: 'Ceremonial Mask', price: '30 gp', level: 'Common', details: 'Ritualistic face covering from foreign culture. Adorned with symbols of spiritual significance and crafted with exotic materials.' },
    { name: 'Decorative Weapon', price: '45 gp', level: 'Common', details: 'Foreign armament designed for display rather than combat. May have cultural significance or showcase unique craftsmanship.' },
    { name: 'Exotic Pets', price: '50 gp', level: 'Common', details: 'Unusual animals from distant regions. May include colorful birds, strange reptiles, or miniature mammals.' },
    { name: 'Foreign Liquor', price: '10 gp', level: 'Common', details: 'Potent alcoholic beverage from distant lands. Unusual flavor profile and sometimes surprising effects.' },
    { name: 'Foreign Spices', price: '15 gp', level: 'Common', details: 'Rare seasonings from distant lands. Enhances cooking and may have mild medicinal properties.' },
    { name: 'Incense (exotic)', price: '5 gp', level: 'Common', details: 'Aromatic resins and herbs from far-off regions. Burns with distinctive scent that may have calming or stimulating properties.' },
    { name: 'Preserved Curiosity', price: '40 gp', level: 'Common', details: 'Specimen of unusual flora or fauna preserved in liquid or by other means. Of interest to scholars and collectors.' },
    { name: 'Strange Figurines', price: '25 gp', level: 'Common', details: 'Small carvings representing unknown deities or creatures. Some collectors believe they bring luck or protection.' },
    { name: 'Trade Goods from Afar', price: '25 gp', level: 'Common', details: 'Assorted items brought by caravan from distant lands. Unfamiliar but potentially valuable in the right markets.' },
    { name: 'Unusual Textiles', price: '20 gp', level: 'Common', details: 'Fabrics with strange properties or origin. May include silks from exotic insects or plant fibers unknown locally.' },
    { name: 'Riding Horse', price: '75 gp', level: 'Common', details: 'Medium beast, Speed 60 ft. Essential for travel and combat.' },
    { name: 'Warhorse', price: '400 gp', level: 'Common', details: 'Large beast, Speed 60 ft. Trained for combat, higher hit points.' },
    { name: 'Mule', price: '8 gp', level: 'Common', details: 'Medium beast, Speed 40 ft. Can carry 420 pounds, sure-footed.' },
    { name: 'Lute', price: '35 gp', level: 'Common', details: 'Six-stringed instrument. Provides bardic spellcasting focus.' },
    { name: 'Flute', price: '2 gp', level: 'Common', details: 'Simple wind instrument. Lightweight and portable.' },
    { name: 'Drum', price: '6 gp', level: 'Common', details: 'Percussion instrument with tight leather head.' },
    { name: 'Dragon scale', price: '500 gp', level: 'Rare', details: 'Single scale from dragon\'s hide. Color determines type. Used in crafting special items or potions. Resists appropriate damage type.' },
    { name: 'Planar Relic', price: '1,000 gp', level: 'Rare', details: 'Object from another plane of existence. Strange properties and appearance. May have residual energy from native plane.' },
    { name: 'Sending Stones', price: '2,500 gp', level: 'Rare', details: 'Pair of stones allowing telepathic communication once daily. 1 action to send 25-word message to paired stone.' },
    { name: 'Bottled Breath', price: '800 gp', level: 'Uncommon', details: 'Air from specific environment or creature contained in sealed vial. When opened, creates brief environmental effect.' },
    { name: 'Cloak of Many Fashions', price: '700 gp', level: 'Uncommon', details: 'The wearer of this cloak can use a bonus action to change its style, color, and apparent quality. It cannot be anything aside from a cloak and cannot mimic other magic cloaks\' properties.' },
    { name: 'Feywild Flower', price: '250 gp', level: 'Uncommon', details: 'Bloom from the Feywild that never wilts. Subtle glow visible in darkness. May have minor magical properties.' },
    { name: 'Vial of Exotic Beast Blood', price: '300 gp', level: 'Uncommon', details: 'Preserved blood from rare creature. Used in special rituals and high-end alchemy. Properties vary by creature type.' }
  ],
  'General Store': [
    { name: 'Backpack', price: '2 gp', level: 'Common', details: 'Sturdy leather pack with multiple compartments. Can hold up to 30 pounds of gear.' },
    { name: 'Bedroll', price: '1 gp', level: 'Common', details: 'Portable padded sleeping roll with attached blanket. Provides comfort and insulation when camping outdoors.' },
    { name: 'Chalk (10 pieces)', price: '1 cp', level: 'Common', details: 'Various colors available. Useful for marking passages in dungeons or taking rubbings.' },
    { name: 'Climber\'s Kit', price: '25 gp', level: 'Common', details: 'Specialized gear including pitons, boot tips, gloves, 50 feet of hempen rope, and harness. Provides advantage on Strength (Athletics) checks for climbing.' },
    { name: 'Crowbar', price: '2 gp', level: 'Common', details: 'Iron lever that provides advantage on Strength checks where leverage can be applied.' },
    { name: 'Dungeoneer\'s pack', price: '12 gp', level: 'Common', details: 'Backpack, crowbar, hammer, 10 pitons, 10 torches, tinderbox, 10 days of rations, and waterskin. Rope bundled on side.' },
    { name: 'Explorer\'s Pack', price: '10 gp', level: 'Common', details: 'Backpack, bedroll, mess kit, tinderbox, 10 torches, 10 days of rations, and waterskin. Rope bundled on side.' },
    { name: 'Fishing Tackle', price: '1 gp', level: 'Common', details: 'Rod, line, hooks, and lures. Allows fishing in lakes, rivers, and coastal waters.' },
    { name: 'Hunting Trap', price: '5 gp', level: 'Common', details: 'Steel teeth snap shut when triggered. DC 13 Dexterity save or 1d4 piercing damage. Creature\'s speed becomes 0.' },
    { name: 'Lantern', price: '5 gp', level: 'Common', details: 'Sheds bright light in a 30-foot radius and dim light for an additional 30 feet. Burns for 6 hours on a flask of oil.' },
    { name: 'Mess Kit', price: '2 sp', level: 'Common', details: 'Tin plate, bowl, cup, and utensils. Components nest together and can be used for cooking basic meals.' },
    { name: 'Rations (1 week)', price: '3 gp 5 sp', level: 'Common', details: 'Preserved food suitable for extended travel. Combination of dried meat, fruit, nuts and hardtack.' },
    { name: 'Rations (10 days)', price: '5 gp', level: 'Common', details: 'Preserved food sufficient for ten days. Typically dried meat, fruit, nuts, and hardtack designed for long journeys.' },
    { name: 'Rope (50 ft)', price: '1 gp', level: 'Common', details: 'Strong hemp rope that can hold up to 300 pounds. Difficult terrain to climb without a check.' },
    { name: 'Tinderbox', price: '5 sp', level: 'Common', details: 'Small container with flint, steel, and tinder. Takes an action to light a torch or similar object.' },
    { name: 'Torches (10)', price: '1 sp', level: 'Common', details: 'Wooden sticks wrapped with pitch-soaked cloth. Each burns for 1 hour, providing 20 feet of bright light and 20 feet of dim light.' },
    { name: 'Waterproof Satchel', price: '35 gp', level: 'Common', details: 'Treated leather bag with sealed seams. Holds up to 10 lbs. Contents remain completely dry even when fully submerged.' },
    { name: 'Waterskin', price: '2 sp', level: 'Common', details: 'Leather container that holds 4 pints of liquid. Sealed with waxed stopper.' },
    { name: 'Thieves\' Tools', price: '25 gp', level: 'Common', details: 'Includes a small file, lock picks, small mirror, narrow-bladed scissors, and pliers. Essential for rogues.' },
    { name: 'Navigator\'s Tools', price: '25 gp', level: 'Common', details: 'Sextant, compass, calipers, ruler, parchment, ink, and quill for navigation and map-making.' },
    { name: 'Disguise Kit', price: '25 gp', level: 'Common', details: 'Cosmetics, hair dye, small props, and clothing accessories for changing appearance.' },
    { name: 'Forgery Kit', price: '15 gp', level: 'Common', details: 'Papers, inks, seals, sealing wax, gold and silver leaf, and small tools to create convincing forgeries.' },
    { name: 'Caltrops (bag of 20)', price: '1 gp', level: 'Common', details: 'Small metal spikes scattered to slow enemies. Creatures moving through take 1 piercing damage and speed reduced.' },
    { name: 'Ball Bearings (bag of 1,000)', price: '1 gp', level: 'Common', details: 'Small metal spheres scattered to create difficult terrain in 10-foot square area.' },
    { name: 'Grappling Hook', price: '5 gp', level: 'Common', details: 'Iron hook with three or four prongs designed to catch on ledges, sills, and ropes.' },
    { name: 'Hammer', price: '1 gp', level: 'Common', details: 'Tool hammer for driving pitons, tent stakes, and other construction needs.' },
    { name: 'Pitons (10)', price: '5 sp', level: 'Common', details: 'Iron spikes designed to be driven into rock or wood to secure ropes for climbing.' },
    { name: 'Iron Spikes (10)', price: '1 gp', level: 'Common', details: 'Large iron nails for securing doors, creating barriers, or general construction.' },
    { name: 'Lock', price: '10 gp', level: 'Common', details: 'Standard iron lock with key. DC 15 to pick with thieves\' tools.' },
    { name: 'Manacles', price: '2 gp', level: 'Common', details: 'Iron restraints designed to hold Medium or Small creatures. DC 20 Strength or Dexterity check to escape.' },
    { name: 'Mirror', price: '5 gp', level: 'Common', details: 'Polished steel mirror useful for looking around corners, signaling, or checking for invisible creatures.' },
    { name: 'Pole (10-foot)', price: '5 cp', level: 'Common', details: 'Simple wooden pole useful for checking for traps, measuring depths, or general poking.' },
    { name: 'Brewer\'s Supplies', price: '20 gp', level: 'Common', details: 'Large glass jug, quantity of hops, siphon, and tubing for brewing beer and ale.' },
    { name: 'Carpenter\'s Tools', price: '8 gp', level: 'Common', details: 'Saw, hammer, nails, hatchet, square, ruler, adze, plane, and chisel for woodworking.' },
    { name: 'Cartographer\'s Tools', price: '15 gp', level: 'Common', details: 'Quill, ink, parchment, compass, calipers, and ruler for creating accurate maps.' },
    { name: 'Cook\'s Utensils', price: '1 gp', level: 'Common', details: 'Metal pot, knives, forks, stirring spoon, and ladle for preparing meals.' },
    { name: 'Leatherworker\'s Tools', price: '5 gp', level: 'Common', details: 'Knife, small mallet, edging tool, leather punch, thread, and leather scraps.' },
    { name: 'Mason\'s Tools', price: '10 gp', level: 'Common', details: 'Trowel, hammer, chisel, brushes, and square for working with stone and mortar.' },
    { name: 'Tinker\'s Tools', price: '50 gp', level: 'Common', details: 'Variety of hand tools, thread, needles, whetstone, scraps of cloth and leather for repairs.' },
    { name: 'Weaver\'s Tools', price: '1 gp', level: 'Common', details: 'Thread, needles, and scraps of cloth for creating textiles and clothing.' },
    { name: 'Cart', price: '15 gp', level: 'Common', details: 'Two-wheeled vehicle pulled by draft animal. Holds 200 pounds of cargo.' },
    { name: 'Wagon', price: '35 gp', level: 'Common', details: 'Four-wheeled vehicle. Holds 1,000 pounds of cargo.' },
    { name: 'Saddle', price: '10 gp', level: 'Common', details: 'Riding saddle with stirrups, bridle, and bit for mounted travel.' },
    { name: 'Saddlebags', price: '4 gp', level: 'Common', details: 'Leather bags that attach to saddle. Hold 30 pounds of gear.' },
    { name: 'Horn', price: '3 gp', level: 'Common', details: 'Simple brass horn for signaling or music.' },
    { name: 'Traveler\'s Clothes', price: '2 gp', level: 'Common', details: 'Sturdy garments including boots, suitable for long journeys.' },
    { name: 'Robes', price: '1 gp', level: 'Common', details: 'Loose-fitting garments favored by spellcasters and scholars.' },
    { name: 'Pouch', price: '5 sp', level: 'Common', details: 'Small leather belt pouch. Holds 6 pounds of gear.' },
    { name: 'Chest', price: '5 gp', level: 'Common', details: 'Wooden storage chest with iron fittings and lock. Holds 300 pounds.' },
    { name: 'Candle', price: '1 cp', level: 'Common', details: 'Burns for 1 hour, provides dim light in 5-foot radius.' },
    { name: 'Lamp', price: '5 sp', level: 'Common', details: 'Burns oil for 6 hours, bright light 15-foot radius, dim light additional 15 feet.' },
    { name: 'Playing Card Set', price: '5 sp', level: 'Common', details: 'Standard deck of cards for gambling and entertainment.' },
    { name: 'Dice Set', price: '1 sp', level: 'Common', details: 'Bone dice for games of chance.' },
    { name: 'Wine (Common)', price: '2 sp', level: 'Common', details: 'Bottle of ordinary table wine.' },
    { name: 'Wine (Fine)', price: '10 gp', level: 'Common', details: 'Bottle of exceptional vintage wine.' },
    { name: 'Ale (Mug)', price: '4 cp', level: 'Common', details: 'Single serving of common ale or beer.' },
    { name: 'Folding Boat', price: '5,000 gp', level: 'Rare', details: 'Takes the form of a wooden box that unfolds into a boat. Command word transforms it between box, rowboat, and ship sizes.' },
    { name: 'Handy Haversack', price: '2,000 gp', level: 'Rare', details: 'Backpack with two side pouches, each containing an extradimensional space that can hold up to 20 lbs. The center can hold up to 80 lbs. The backpack weight never exceeds 5 pounds, regardless of its contents.' },
    { name: 'Portable Ram', price: '250 gp', level: 'Rare', details: 'Magically enhanced battering implement. +4 bonus to Strength checks to break down doors. Collapsible for easy carry.' },
    { name: 'Bag of Holding (minor)', price: '500 gp', level: 'Uncommon', details: 'Interior space larger than exterior dimensions (2 ft. in diameter, 250 pounds capacity). Items inside weigh nothing.' },
    { name: 'Boots of Elvenkind', price: '2,500 gp', level: 'Uncommon', details: 'Wearer\'s steps make no sound. Advantage on Dexterity (Stealth) checks that rely on moving silently.' },
    { name: 'Boots of Striding and Springing', price: '5,000 gp', level: 'Uncommon', details: 'Wearer\'s walking speed becomes 30 feet, unless their walking speed is higher. In addition, the wearer can jump three times the normal distance. Requires attunement.' },
    { name: 'Breathing Tube', price: '25 gp', level: 'Uncommon', details: 'Specially crafted reed that allows breathing underwater while remaining submerged. Extends up to 10 feet in length.' },
    { name: 'Driftglobe', price: '750 gp', level: 'Uncommon', details: 'Floating sphere that provides light (Light or Daylight spell). Follows owner within 60 feet.' },
    { name: 'Masterwork Backpack', price: '100 gp', level: 'Uncommon', details: 'Reinforced seams and water-resistant material. Can hold 50% more than a standard backpack with better weight distribution.' },
    { name: 'Rope of Climbing', price: '2,000 gp', level: 'Uncommon', details: '60 feet of silk rope that animates on command. Can knot, fasten, climb, and untie itself. Supports up to 3,000 pounds.' }
  ],
  'Jeweler': [
    { name: 'Copper Bracelet', price: '3 gp', level: 'Common', details: 'Decorative band worn on wrist. Some believe copper bracelets reduce aches and pains.' },
    { name: 'Earrings', price: '4 gp', level: 'Common', details: 'Decorative pieces worn on pierced ears. Available in various styles and materials.' },
    { name: 'Gemstone (cut)', price: '50 gp', level: 'Common', details: 'Faceted precious or semi-precious stone. Cut to maximize brilliance and showcase color.' },
    { name: 'Gemstone (uncut)', price: '10 gp', level: 'Common', details: 'Raw precious or semi-precious stone. Value may increase significantly when properly cut.' },
    { name: 'Gold Chain', price: '15 gp', level: 'Common', details: 'Necklace of interlinking gold pieces. Variable length and link patterns available.' },
    { name: 'Gold Ring', price: '25 gp', level: 'Common', details: 'Band crafted from precious gold. Symbol of wealth, commitment, or achievement depending on design.' },
    { name: 'Silver Bracelet', price: '10 gp', level: 'Common', details: 'Wrist adornment of fine silver. May feature chain links, solid band, or decorative patterns.' },
    { name: 'Silver Pendant', price: '12 gp', level: 'Common', details: 'Decorative ornament worn on necklace. May feature symbolic imagery or personal significance.' },
    { name: 'Silver Ring', price: '5 gp', level: 'Common', details: 'Simple band of polished silver. May be engraved with basic patterns or left plain for customization.' },
    { name: 'Simple Necklace', price: '5 gp', level: 'Common', details: 'Chain or cord with minor ornamentation. Common materials include silver, copper, or polished stone.' },
    { name: 'Jeweler\'s Tools', price: '25 gp', level: 'Common', details: 'Small saw, hammer, files, pliers, and magnifying glass for working with precious metals and gems.' },
    { name: 'Eyes of Charming', price: '4,500 gp', level: 'Uncommon', details: 'Crystal lenses that allow casting Charm Person (DC 13) on humanoids. Requires eye contact. Recharges daily.' },
    { name: 'Gem of Brightness', price: '2,500 gp', level: 'Uncommon', details: 'Prism-like gem with 50 charges. Creates light or blinding rays. Daylight effect or 1d6 blinding attacks.' },
    { name: 'Necklace of Adaptation', price: '2,500 gp', level: 'Uncommon', details: 'Creates envelope of fresh air around wearer. Breathe normally in any environment. Immunity to gas attacks.' },
    { name: 'Ring of Jumping', price: '2,500 gp', level: 'Uncommon', details: 'Cast Jump spell on self at will. Triples jump distance. Silver band with hare engraving.' },
    { name: 'Stone of Good Luck (Luckstone)', price: '3,000 gp', level: 'Uncommon', details: 'Grants +1 bonus to ability checks and saving throws. Small polished agate.' }
  ],
  'Mystic Goods': [
    { name: 'Arcane Focus', price: '20 gp', level: 'Common', details: 'Specially object designed to channels arcane magic. Replaces material components without cost.' },
    { name: 'Bestiary Volume', price: '75 gp', level: 'Common', details: 'Compilation of monster information with detailed illustrations. Provides insight into creature weaknesses and habits.' },
    { name: 'Blank Book', price: '10 gp', level: 'Common', details: 'Leather-bound volume with 100 blank vellum pages. Suitable for recording spells, research, or journals.' },
    { name: 'Blank Scroll', price: '5 sp', level: 'Common', details: 'Sheet of high-quality parchment treated to accept magical inscriptions. Required for creating spell scrolls.' },
    { name: 'Book of Lore', price: '50 gp', level: 'Common', details: 'Contains information on specific topic (determined randomly or by GM). Grants advantage on related Intelligence checks.' },
    { name: 'Candle of the Deep', price: '100 gp', level: 'Common', details: 'Burns underwater, creating light in a 5-foot radius. Unaffected by wind. Burns for 8 hours.' },
    { name: 'Component Pouch', price: '25 gp', level: 'Common', details: 'Small watertight leather belt pouch containing all components needed for spellcasting (except those with specific costs).' },
    { name: 'Detect Magic Scroll', price: '90 gp', level: 'Common', details: '1st-level divination spell. Sense magic within 30 feet. Identify school of magic with an action. Duration: Concentration, up to 10 minutes.' },
    { name: 'Enchanted Chalk', price: '15 gp', level: 'Common', details: 'Marks visible only to specific individuals or under certain conditions. Ideal for sending secret messages.' },
    { name: 'Enchanted Quill', price: '30 gp', level: 'Common', details: 'Never needs ink and writes in a color of user\'s choice. Enhances penmanship and reduces writing fatigue.' },
    { name: 'Enchanter\'s Primer', price: '75 gp', level: 'Common', details: 'Introductory text on enchantment principles. Provides advantage on Arcana checks related to identifying magical items.' },
    { name: 'Glowing Ink', price: '25 gp', level: 'Common', details: 'Luminescent writing fluid that glows in darkness. Writing remains visible in dim conditions without light source.' },
    { name: 'Identify Scroll', price: '120 gp', level: 'Common', details: '1st-level divination spell. Learn properties of one magic item, including how to use it and charges remaining.' },
    { name: 'Ink Pot', price: '10 gp', level: 'Common', details: 'Superior quality ink suited for magical writings. Dark blue-black color that dries permanently.' },
    { name: 'Minor Enchanted Trinket', price: '50 gp', level: 'Common', details: 'Small object with minor magical effect. Often decorative but with practical applications. Common rarity.' },
    { name: 'Orb of Direction', price: '150 gp', level: 'Common', details: 'Small crystalline sphere that always points north when activated. Glows with blue light in 5-foot radius.' },
    { name: 'Parchment Sheets (10)', price: '1 gp', level: 'Common', details: 'Thin material made from animal hide. More durable than paper and resistant to moisture damage.' },
    { name: 'Potion of Animal Friendship', price: '100 gp', level: 'Common', details: 'Muddy liquid with floating leaves. Allows casting of Animal Friendship spell (DC 13).' },
    { name: 'Potion of Climbing', price: '75 gp', level: 'Common', details: 'Grants climbing speed equal to walking speed for 1 hour. Syrupy liquid with embedded spider hairs.' },
    { name: 'Quill', price: '2 sp', level: 'Common', details: 'Writing implement crafted from a large bird feather. Common varieties come from geese, owls, or hawks.' },
    { name: 'Religious Text', price: '25 gp', level: 'Common', details: 'Holy book of a particular faith. Contains prayers, rituals, and theological discussions. Essential for clerics and paladins.' },
    { name: 'Rune Etching Tools', price: '15 gp', level: 'Common', details: 'Precision instruments for inscribing arcane symbols. Includes chisels, burins, and specialized implements.' },
    { name: 'Scroll Case', price: '1 gp', level: 'Common', details: 'Leather or metal tube with cap for safely storing scrolls. Water-resistant and sturdy.' },
    { name: 'Scroll of Comprehend Languages', price: '100 gp', level: 'Common', details: '1st-level divination spell. Understand any spoken or written language. Duration: 1 hour.' },
    { name: 'Scroll of Detect Magic', price: '100 gp', level: 'Common', details: '1st-level divination spell. Sense magic within 30 feet. Identify school of magic with an action. Duration: Concentration, up to 10 minutes.' },
    { name: 'Scroll of Identify', price: '150 gp', level: 'Common', details: '1st-level divination spell. Learn properties of one magic item, including how to use it and charges remaining.' },
    { name: 'Scroll of Mage Armor', price: '150 gp', level: 'Common', details: '1st-level abjuration spell. Target\'s base AC becomes 13 + Dex modifier. Duration: 8 hours.' },
    { name: 'Spell components', price: '25 gp', level: 'Common', details: 'Assorted materials needed for spellcasting. Includes rare herbs, minerals, and other substances for material components.' },
    { name: 'Spellbook (blank)', price: '50 gp', level: 'Common', details: 'Special book with 100 pages of parchment specially treated to receive magical inscriptions. Required by wizards.' },
    { name: 'Holy Water (Flask)', price: '25 gp', level: 'Common', details: 'Water blessed by a cleric. Deals 2d6 radiant damage to fiends and undead when thrown.' },
    { name: 'Holy Symbol', price: '5 gp', level: 'Common', details: 'Sacred emblem of a deity worn as an amulet or emblazoned on a shield. Required for clerics and paladins.' },
    { name: 'Druidcraft Focus', price: '10 gp', level: 'Common', details: 'Sprig of mistletoe, wand/staff of yew or another special wood, totem, or crystal. Required focus for druids.' },
    { name: 'Amulet of Health', price: '4,000 gp', level: 'Rare', details: 'Wearer\'s Constitution score becomes 19 if it was lower. Polished red gem on golden chain.' },
    { name: 'Brooch of Shielding', price: '3,000 gp', level: 'Rare', details: 'Grants immunity to damage from Magic Missile spell. Also protects from similar force effects.' },
    { name: 'Circlet of Blasting', price: '1,500 gp', level: 'Rare', details: 'Cast Scorching Ray once per day. Automatically hits for 2d6 fire damage. Golden circlet with ruby.' },
    { name: 'Headband of Intellect', price: '8,000 gp', level: 'Rare', details: 'Wearer\'s Intelligence score becomes 19 if it was lower. Silver filament with blue gemstones.' },
    { name: 'Ring of Protection', price: '3,500 gp', level: 'Rare', details: 'Grants +1 bonus to AC and all saving throws. Simple platinum band with protective runes.' },
    { name: 'Scroll of Protection', price: '450 gp', level: 'Rare', details: 'Reading creates 5-foot-radius barrier that blocks a specific type of creature. Lasts 5 minutes or until breached.' },
    { name: 'Spell Scroll (4th level)', price: '1,000 gp', level: 'Rare', details: 'Contains one 4th-level spell. DC 16 check required if spell not on your class list. Consumed when spell is cast.' },
    { name: 'Broom of Flying', price: '8,000 gp', level: 'Uncommon', details: 'Flies up to 50 feet per round. Can carry up to 400 pounds. Hovers when not being ridden.' },
    { name: 'Cloak of Protection', price: '3,500 gp', level: 'Uncommon', details: 'Grants +1 bonus to AC and all saving throws. Shimmers when examined closely.' },
    { name: 'Immovable Rod', price: '5,000 gp', level: 'Uncommon', details: 'Iron rod with a button on one end. When pressed, the rod becomes magically fixed in place and will not move unless the button is pushed again. Supports up to 8,000 pounds. DC 30 Strength check to move.' },
    { name: 'Pearl of Power', price: '6,000 gp', level: 'Uncommon', details: 'Once per day, recover one expended spell slot of 3rd level or lower. Iridescent white sphere.' },
    { name: 'Scroll of Fireball', price: '300 gp', level: 'Uncommon', details: '3rd-level evocation spell. Creates 20-foot-radius sphere of flame dealing 8d6 fire damage (DC 15 Dexterity save for half).' },
    { name: 'Spell Scroll (3rd level)', price: '250 gp', level: 'Uncommon', details: 'Contains one 3rd-level spell. DC 15 check required if spell not on your class list. Consumed when spell is cast.' },
    { name: 'Wand of Magic Detection', price: '1,500 gp', level: 'Uncommon', details: 'Casts Detect Magic without using a spell slot. 3 charges, regains 1d3 charges daily at dawn.' },
    { name: 'Wand of Magic Missiles', price: '2,000 gp', level: 'Uncommon', details: 'Casts Magic Missile with variable power (1-7 darts). 7 charges, regains 1d6+1 charges daily.' },
    { name: 'Wand of Web', price: '4,000 gp', level: 'Uncommon', details: 'Casts Web spell (DC 15). 7 charges, expend 1 charge per cast. Regains 1d6+1 charges daily.' },
    { name: 'Manual of Health', price: '5,000 gp', level: 'Very rare', details: 'Reading takes 48 hours over 6 days. Constitution score increases by 2, as does maximum. Disappears after use.' },
    { name: 'Tome of Clear Thought', price: '8,000 gp', level: 'Very rare', details: 'Reading takes 48 hours over 6 days. Intelligence score increases by 2, as does maximum. Disappears after use.' }
  ]
};

  // Split shopItems into common and rare based on rarity
const commonItems = {};
const rareItems = {};

Object.keys(shopItems).forEach(category => {
  commonItems[category] = shopItems[category].filter(item => 
    ['Common', 'Uncommon'].includes(item.level)
  );
  rareItems[category] = shopItems[category].filter(item => 
    ['Rare', 'Very rare', 'Legendary'].includes(item.level)
  );
});
   
  const rarityRank = {
    'Common': 1,
    'Uncommon': 2,
    'Rare': 3,
    'Very rare': 4,
    'Legendary': 5
  };

// Add this after shopItems definition
const allShopTypes = Object.keys(shopItems);

// Parse price to gold value for sorting
const parsePriceToGold = (priceString) => {
  if (!priceString) return 0;
  
  // Remove HTML tags and extract numeric values
  const cleanPrice = priceString.replace(/<[^>]*>/g, '');
  
  let totalGold = 0;
  
  // Look for gold pieces
  const gpMatch = cleanPrice.match(/(\d+)\s*(?=.*poker_chip.*poker_chip.*poker_chip|$)/);
  if (gpMatch) totalGold += parseFloat(gpMatch[1]);
  
  // Look for silver pieces (convert to gold)
  const spMatch = cleanPrice.match(/(\d+)\s*(?=.*poker_chip.*poker_chip(?!.*poker_chip))/);
  if (spMatch) totalGold += parseFloat(spMatch[1]) / 10;
  
  // Look for copper pieces (convert to gold)  
  const cpMatch = cleanPrice.match(/(\d+)\s*(?=.*poker_chip(?!.*poker_chip))/);
  if (cpMatch) totalGold += parseFloat(cpMatch[1]) / 100;
  
  return totalGold;
};

// Sort items function
const sortItems = (items, sortMode) => {
  if (!items || items.length === 0) return items;
  
  // Add adjustedPriceValue to items if not present
  const itemsWithPriceValue = items.map(item => ({
    ...item,
    adjustedPriceValue: item.adjustedPriceValue || parsePriceToGold(item.adjustedPrice)
  }));
  
  if (sortMode === 'alpha') {
    return [...itemsWithPriceValue].sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortMode === 'price-asc') {
    return [...itemsWithPriceValue].sort((a, b) => a.adjustedPriceValue - b.adjustedPriceValue);
  } else if (sortMode === 'price-desc') {
    return [...itemsWithPriceValue].sort((a, b) => b.adjustedPriceValue - a.adjustedPriceValue);
  }
  return itemsWithPriceValue;
};

// Get sorted items
const [commonSort, setCommonSort] = useState<'alpha' | 'price-asc' | 'price-desc'>('alpha');
const [rareSort, setRareSort] = useState<'alpha' | 'price-asc' | 'price-desc'>('alpha');
const sortedCommon = shopkeeper ? sortItems(shopkeeper.commonItems, commonSort) : [];
const sortedRare = shopkeeper ? sortItems(shopkeeper.rareItems, rareSort) : [];

// Motto logic
const generateMotto = (shopTypeValue: string, priceModifier: number) => {
  const choose = (arr: string | any[]) => arr[Math.floor(Math.random() * arr.length)];

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
const adjustPrice = (basePrice, modifier) => {
  let priceStr = basePrice.toString();
  
  // Parse the base price
  let value = 0;
  let currency = '';
  
  // Handle prices with commas
  const priceWithoutCommas = priceStr.replace(/,/g, '');
  
  if (priceWithoutCommas.includes('gp')) {
    value = parseFloat(priceWithoutCommas.split('gp')[0].trim());
    currency = 'gp';
  } else if (priceWithoutCommas.includes('sp')) {
    value = parseFloat(priceWithoutCommas.split('sp')[0].trim());
    currency = 'sp';
  } else if (priceWithoutCommas.includes('cp')) {
    value = parseFloat(priceWithoutCommas.split('cp')[0].trim());
    currency = 'cp';
  } else {
    // Fallback - assume it's gold
    value = parseFloat(priceWithoutCommas) || 0;
    currency = 'gp';
  }
  
  // Handle complex prices like "3 gp 5 sp"
  if (priceWithoutCommas.includes('gp') && priceWithoutCommas.includes('sp')) {
    const gpPart = parseFloat(priceWithoutCommas.split('gp')[0].trim());
    const spPart = parseFloat(priceWithoutCommas.split('gp')[1].split('sp')[0].trim());
    value = gpPart + (spPart / 10);
    currency = 'gp';
  }
  
  // Apply the modifier
  const adjustedValue = value * (1 + modifier);
  
  // Convert everything to gold for consistent formatting
  let finalGoldValue = adjustedValue;
  if (currency === 'sp') {
    finalGoldValue = adjustedValue / 10;
  } else if (currency === 'cp') {
    finalGoldValue = adjustedValue / 100;
  }
  
  return formatCurrency(finalGoldValue);
};
  
  // Function to format currency into gp, sp, cp with icons
const formatCurrency = (valueInGold: number) => {
  const gp = Math.floor(valueInGold);
  const sp = Math.floor((valueInGold - gp) * 10);
  const cp = Math.round(((valueInGold - gp) * 10 - sp) * 10);
  
  let result = '';
  
  if (gp > 0) {
    result += `<span class="currency-wrapper"><span class="material-symbols-outlined currency-icon gold-icon">poker_chip</span>${gp}</span>`;
  }
  
  if (sp > 0) {
    result += `<span class="currency-wrapper"><span class="material-symbols-outlined currency-icon silver-icon">poker_chip</span>${sp}</span>`;
  }
  
  if (cp > 0) {
    result += `<span class="currency-wrapper"><span class="material-symbols-outlined currency-icon copper-icon">poker_chip</span>${cp}</span>`;
  }
  
  if (result === '') {
    result = `<span class="currency-wrapper"><span class="material-symbols-outlined currency-icon copper-icon">poker_chip</span>0</span>`;
  }
  
  // Debug logging
  console.log('formatCurrency input:', valueInGold, 'gp:', gp, 'result:', result);
  
  return result;
};

// Generate shopkeeper's available money with guaranteed mixed denominations
const generateShopkeeperMoney = (settlementSize) => {
  let gold = 0;
  let silver = 0;
  let copper = 0;
  
  switch (settlementSize) {
    case 'village':
      // Villages: modest amounts, rounded to 10s
      const villageRolls = Math.floor(Math.random() * 4) + 1 + Math.floor(Math.random() * 4) + 1;
      gold = villageRolls * 10; // 20-80 gp
      silver = (Math.floor(Math.random() * 6) + 2) * 10; // 20-70 sp
      copper = (Math.floor(Math.random() * 8) + 3) * 10; // 30-100 cp
      break;
      
    case 'town':
      // Towns: moderate amounts, rounded to 10s
      let townRolls = 0;
      for (let i = 0; i < 4; i++) {
        townRolls += Math.floor(Math.random() * 4) + 1;
      }
      gold = townRolls * 10; // 40-160 gp
      silver = (Math.floor(Math.random() * 8) + 3) * 10; // 30-100 sp  
      copper = (Math.floor(Math.random() * 12) + 4) * 10; // 40-150 cp
      break;
      
    case 'city':
    default:
      // Cities: large amounts, rounded to 10s
      const cityBase = (Math.floor(Math.random() * 4) + 1) * 100;
      const cityExtra = (Math.floor(Math.random() * 4) + 1 + Math.floor(Math.random() * 4) + 1) * 10;
      gold = cityBase + cityExtra; // 120-200 gp
      silver = (Math.floor(Math.random() * 10) + 5) * 10; // 50-140 sp
      copper = (Math.floor(Math.random() * 15) + 8) * 10; // 80-220 cp
      break;
  }
  
  // Generate HTML directly with exact amounts
  let result = '';
  
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

  const getRarityBadgeClass = (rarity: string) => {
  const normalizedRarity = rarity.toLowerCase().replace(/\s+/g, '-');
  switch (normalizedRarity) {
    case 'common':
      return 'rarity-badge rarity-common';
    case 'uncommon':
      return 'rarity-badge rarity-uncommon';
    case 'rare':
      return 'rarity-badge rarity-rare';
    case 'very-rare':
      return 'rarity-badge rarity-very-rare';
    case 'legendary':
      return 'rarity-badge rarity-legendary';
    default:
      return 'rarity-badge rarity-common';
  }
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
  level: 'Common' | 'Uncommon' | 'Rare' | 'Very rare' | 'Legendary';
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
const getInventoryLimits = (sizeValue) => {
  switch (sizeValue) {
    case 'village':
      return {
        numCommonItems: Math.floor(Math.random() * 3) + 3, // 3–5 items
        numRareItems: 0, // No rare items in villages
        maxCommonRarity: 'Common',
        maxRareRarity: 'Common'
      };
    case 'town':
      return {
        numCommonItems: Math.floor(Math.random() * 4) + 5, // 5–8 items
        numRareItems: Math.floor(Math.random() * 2) + 1, // 1–2 rare items
        maxCommonRarity: 'Uncommon',
        maxRareRarity: 'Rare'
      };
    case 'city':
    default:
      return {
        numCommonItems: Math.floor(Math.random() * 6) + 5, // 5–10 items
        numRareItems: Math.floor(Math.random() * 3) + 1, // 1–3 rare items
        maxCommonRarity: 'Rare',
        maxRareRarity: 'Legendary'
      };
  }
};

// Generate common inventory
const generateCommonItems = (
  shopTypeValue: string | number,
  priceModifier: number,
  limits: { numCommonItems: number; maxCommonRarity: string; }
): ShopItem[] => {
  const commonInventory = commonItems[shopTypeValue];
  const selectedCommonItems: ShopItem[] = [];
  const usedCommonIndices = new Set();

const weightedCommonSelection = () => {
  let availableItems = commonInventory.filter((item, index) =>
    rarityRank[item.level] <= rarityRank[limits.maxCommonRarity] &&
    !usedCommonIndices.has(index)
  );

    if (availableItems.length === 0) return null;

    availableItems.sort((a, b) => rarityRank[a.level] - rarityRank[b.level]);
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
  limits: { numRareItems: number; maxRareRarity: string; }
): ShopItem[] => {
  const rareInventory = rareItems[shopTypeValue];
  const selectedRareItems: ShopItem[] = [];
  const usedRareIndices = new Set();

  const weightedRareSelection = () => {
    let availableItems = rareInventory.filter((item, index) =>
      rarityRank[item.level] <= rarityRank[limits.maxRareRarity]
    );

    if (availableItems.length === 0) return null;

    availableItems.sort((a, b) => rarityRank[a.level] - rarityRank[b.level]);
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
  
// Item categorization system with Material Icons
const itemCategories = {
  'melee_weapons': {
    icon: 'swords',
    name: 'Melee Weapons',
    items: [
      // Daggers & Small Weapons
      'copper dagger', 'bronze dagger', 'iron dagger', 'steel dagger', 'silver dagger', 'cold iron dagger', 'adamantine dagger', 'mithral dagger',
      'dart', 'club', 'sickle',
      
      // One-Handed Weapons
      'copper mace', 'bronze mace', 'iron mace', 'steel mace', 'silver mace', 'adamantine mace', 'mithral mace',
      'copper longsword', 'bronze longsword', 'iron longsword', 'steel longsword', 'silver longsword', 'cold iron longsword', 'adamantine longsword', 'mithral longsword', 'starmetal longsword',
      'copper battleaxe', 'bronze battleaxe', 'iron battleaxe', 'steel battleaxe', 'silver battleaxe', 'adamantine battleaxe', 'mithral battleaxe',
      'copper rapier', 'bronze rapier', 'iron rapier', 'steel rapier', 'silver rapier', 'adamantine rapier', 'mithral rapier',
      'copper scimitar', 'bronze scimitar', 'iron scimitar', 'steel scimitar', 'silver scimitar', 'adamantine scimitar', 'mithral scimitar',
      'copper shortsword', 'bronze shortsword', 'iron shortsword', 'steel shortsword', 'silver shortsword', 'adamantine shortsword', 'mithral shortsword',
      'iron warhammer', 'steel warhammer', 'silver warhammer', 'adamantine warhammer', 'mithral warhammer',
      'iron flail', 'steel flail', 'silver flail', 'adamantine flail', 'mithral flail',
      'iron trident', 'steel trident', 'silver trident', 'adamantine trident', 'mithral trident',
      'whip', 'quarterstaff', 'spear', 'concealed weapon', 'exotic weapon', 'decorative weapon',
      
      // Two-Handed Weapons
      'greatclub', 'iron glaive', 'steel glaive', 'silver glaive', 'adamantine glaive', 'mithral glaive',
      'iron greataxe', 'steel greataxe', 'silver greataxe', 'adamantine greataxe', 'mithral greataxe', 'starmetal greataxe',
      'iron greatsword', 'steel greatsword', 'silver greatsword', 'adamantine greatsword', 'mithral greatsword', 'starmetal greatsword',
      
      // Enhanced Weapons
      'weapon (+1)'
    ]
  },
  
  'ranged_weapons': {
    icon: 'my_location',
    name: 'Ranged Weapons',
    items: [
      'shortbow', 'longbow', 'mithral shortbow', 'mithral longbow',
      'light crossbow', 'heavy crossbow', 'hand crossbow', 'mithral light crossbow', 'mithral heavy crossbow', 'mithral hand crossbow',
      'sling', 'blowgun', 'net', 'javelin'
    ]
  },
  
  'ammunition': {
    icon: 'trail_length',
    name: 'Ammunition',
    items: [
      'arrows (20)', 'silver arrows (20)', 'adamantine arrows (20)', 'mithral arrows (20)',
      'crossbow bolts (20)', 'silver crossbow bolts (20)', 'adamantine crossbow bolts (20)', 'mithral crossbow bolts (20)',
      'sling bullets (20)', 'blowgun needles (50)'
    ]
  },
  
  'armor': {
    icon: 'security',
    name: 'Armor',
    items: [
      // Light Armor
      'leather armor', 'hardened leather armor', 'dragon leather armor', 'exotic hide armor', 'celestial leather armor',
      'studded leather armor', 'copper studs armor', 'bronze studs armor', 'iron studs armor', 'steel studs armor', 'silver studs armor', 'adamantine studs armor', 'mithral studs armor',
      
      // Medium Armor
      'copper chain shirt', 'bronze chain shirt', 'iron chain shirt', 'steel chain shirt', 'silver chain shirt', 'adamantine chain shirt', 'mithral chain shirt',
      'copper scale mail', 'bronze scale mail', 'iron scale mail', 'steel scale mail', 'silver scale mail', 'adamantine scale mail', 'mithral scale mail', 'dragonscale mail',
      'copper breastplate', 'bronze breastplate', 'iron breastplate', 'steel breastplate', 'silver breastplate', 'adamantine breastplate', 'mithral breastplate', 'breastplate',
      'iron half plate', 'steel half plate', 'silver half plate', 'adamantine half plate', 'mithral half plate',
      
      // Heavy Armor
      'iron chain mail', 'steel chain mail', 'silver chain mail', 'adamantine chain mail', 'mithral chain mail', 'chain mail',
      'iron splint', 'steel splint', 'silver splint', 'adamantine splint', 'mithral splint',
      'steel plate', 'silver plate', 'adamantine plate', 'mithral plate', 'celestial plate', 'starmetal plate',
      
      // Special Armor
      'gleaming armor', 'decorative ceremonial armor', 'adamantine armor', 'armor (+1)'
    ]
  },
  
  'shields': {
    icon: 'shield',
    name: 'Shields',
    items: [
      'copper shield', 'bronze shield', 'iron shield', 'steel shield', 'silver shield', 'adamantine shield', 'mithral shield', 'dragonscale shield',
      'shield (+1)', 'helmet'
    ]
  },
  
  'adventuring_gear': {
    icon: 'hiking',
    name: 'Adventuring Gear',
    items: [
      'backpack', 'masterwork backpack', 'bedroll', 'rope (50 ft)', 'rope of climbing', 'grappling hook',
      'climber\'s kit', 'dungeoneer\'s pack', 'explorer\'s pack', 'mess kit', 'waterskin', 'waterproof satchel',
      'hunting trap', 'caltrops (bag of 20)', 'ball bearings (bag of 1,000)', 'pitons (10)', 'iron spikes (10)',
      'hammer', 'crowbar', 'portable ram', 'immovable rod', 'pole (10-foot)', 'chain (10 feet)',
      'manacles', 'lock', 'mirror', 'folding boat', 'handy haversack', 'bag of holding (minor)', 'driftglobe',
      'breathing tube'
    ]
  },
  
  'professional_tools': {
    icon: 'handyman',
    name: 'Professional Tools',
    items: [
      'thieves\' tools', 'navigator\'s tools', 'disguise kit', 'forgery kit', 'poisoner\'s kit',
      'alchemist\'s supplies', 'herbalism kit', 'healer\'s kit', 'smith\'s tools', 'jeweler\'s tools',
      'brewer\'s supplies', 'carpenter\'s tools', 'cartographer\'s tools', 'cook\'s utensils',
      'leatherworker\'s tools', 'mason\'s tools', 'tinker\'s tools', 'weaver\'s tools'
    ]
  },
  
  'containers': {
    icon: 'cases',
    name: 'Containers',
    items: [
      'pouch', 'chest', 'scroll case', 'saddlebags'
    ]
  },
  
  'potions_alchemy': {
    icon: 'experiment',
    name: 'Potions & Alchemy',
    items: [
      'potion of healing', 'greater healing potion', 'potion of superior healing',
      'potion of climbing', 'potion of animal friendship', 'fire breath potion', 'potion of flying', 'potion of invisibility',
      'acid vial', 'alchemist fire', 'antitoxin', 'basic poison', 'oil (flask)', 'oil of slipperiness',
      'smokestick', 'perfume', 'soap'
    ]
  },
  
  'food_drink': {
    icon: 'tapas',
    name: 'Food & Drink',
    items: [
      'rations (1 week)', 'rations (10 days)', 'wine (common)', 'wine (fine)', 'ale (mug)', 'foreign liquor', 'foreign spices'
    ]
  },
  
  'light_sources': {
    icon: 'candle',
    name: 'Light Sources',
    items: [
      'torches (10)', 'lantern', 'lamp', 'candle', 'tinderbox', 'candle of the deep'
    ]
  },
  
  'books_scrolls': {
    icon: 'menu_book',
    name: 'Books & Scrolls',
    items: [
      'blank book', 'spellbook (blank)', 'book of lore', 'bestiary volume', 'religious text', 'enchanter\'s primer',
      'manual of health', 'tome of clear thought', 'blank scroll',
      'scroll of detect magic', 'detect magic scroll', 'scroll of mage armor', 'scroll of identify', 'identify scroll',
      'scroll of comprehend languages', 'scroll of fireball', 'scroll of protection',
      'spell scroll (3rd level)', 'spell scroll (4th level)'
    ]
  },
  
  'writing_supplies': {
    icon: 'history_edu',
    name: 'Writing Supplies',
    items: [
      'quill', 'enchanted quill', 'ink pot', 'glowing ink', 'parchment sheets (10)', 'chalk (10 pieces)',
      'enchanted chalk', 'rune etching tools'
    ]
  },
  
  'magical_items': {
    icon: 'auto_fix_high',
    name: 'Magical Items',
    items: [
      'wand of magic detection', 'wand of magic missiles', 'wand of web', 'broom of flying',
      'ring of protection', 'ring of jumping', 'amulet of health', 'headband of intellect',
      'circlet of blasting', 'brooch of shielding', 'cloak of protection', 'cloak of many fashions',
      'boots of elvenkind', 'boots of striding and springing', 'necklace of adaptation',
      'pearl of power', 'minor enchanted trinket', 'orb of direction'
    ]
  },
  
  'spell_components': {
    icon: 'checklist',
    name: 'Spell Components',
    items: [
      'arcane focus', 'component pouch', 'spell components', 'holy symbol', 'druidcraft focus',
      'holy water (flask)'
    ]
  },
  
  'jewelry': {
    icon: 'diamond_shine',
    name: 'Jewelry',
    items: [
      'silver ring', 'gold ring', 'copper bracelet', 'silver bracelet', 'gold chain', 'simple necklace',
      'silver pendant', 'earrings', 'gemstone (uncut)', 'gemstone (cut)', 'gem of brightness',
      'eyes of charming', 'stone of good luck (luckstone)'
    ]
  },
  
  'exotic_goods': {
    icon: 'public',
    name: 'Exotic Goods',
    items: [
      'foreign spices', 'unusual textiles', 'strange figurines', 'preserved curiosity',
      'trade goods from afar', 'incense (exotic)', 'dragon scale', 'feywild flower',
      'vial of exotic beast blood', 'bottled breath', 'planar relic', 'sending stones'
    ]
  },
  
  'art_decoration': {
    icon: 'domino_mask',
    name: 'Art & Decoration',
    items: [
      'ceremonial mask'
    ]
  },
  
  'clothing_accessories': {
    icon: 'apparel',
    name: 'Clothing & Accessories',
    items: [
      'traveler\'s clothes', 'robes'
    ]
  },
  
  'mounts_animals': {
    icon: 'pets',
    name: 'Mounts & Animals',
    items: [
      'riding horse', 'warhorse', 'mule', 'exotic pets'
    ]
  },
  
  'vehicles': {
    icon: 'speed',
    name: 'Vehicles',
    items: [
      'cart', 'wagon', 'saddle'
    ]
  },
  
  'musical_instruments': {
    icon: 'music_note',
    name: 'Musical Instruments',
    items: [
      'lute', 'flute', 'drum', 'horn'
    ]
  },
  
  'entertainment': {
    icon: 'casino',
    name: 'Entertainment',
    items: [
      'playing card set', 'dice set'
    ]
  },
  
  'fishing_tackle': {
    icon: 'set_meal',
    name: 'Fishing & Hunting',
    items: [
      'fishing tackle'
    ]
  }
};

// Helper function to get category and icon for any item
function getCategoryForItem(itemName) {
  const normalizedName = itemName.toLowerCase();
  
  for (const [categoryKey, categoryData] of Object.entries(itemCategories)) {
    if (categoryData.items.some(item => item.toLowerCase() === normalizedName)) {
      return {
        category: categoryKey,
        icon: categoryData.icon,
        name: categoryData.name
      };
    }
  }
  
  // Default fallback
  return {
    category: 'miscellaneous',
    icon: 'help_outline',
    name: 'Miscellaneous'
  };
}

// Helper function to get icon for item (shortcut)
function getIconForItem(itemName) {
  return getCategoryForItem(itemName).icon;
}

// Helper function to get all items in a category
function getItemsInCategory(categoryKey) {
  return itemCategories[categoryKey]?.items || [];
}

// Helper function to get category statistics
function getCategoryStats() {
  const stats = {};
  for (const [key, data] of Object.entries(itemCategories)) {
    stats[key] = {
      name: data.name,
      icon: data.icon,
      count: data.items.length
    };
  }
  return stats;
}

// Usage examples:
// getCategoryForItem('Steel Longsword') // returns { category: 'melee_weapons', icon: 'sword', name: 'Melee Weapons' }
// getIconForItem('Potion of Healing') // returns 'science'
// getItemsInCategory('jewelry') // returns array of all jewelry items

// Export for use in your app

// Function to generate random shopkeeper
const generateShopkeeper = (
  customShopType: string = shopType,
  customSettlementSize: string = settlementSize
) => {
  const fallbackShopType =
    !customShopType || customShopType === 'random'
      ? shopTypes[Math.floor(Math.random() * shopTypes.length)]
      : customShopType;

  if (isLocked && shopkeeper) {
    if (!shopkeeper.priceModifier || !shopkeeper.name) {
      console.warn("Corrupt locked shopkeeper. Resetting.");
      setIsLocked(false);
      generateShopkeeper('random', customSettlementSize);
      return;
    }

    const limits = getInventoryLimits(customSettlementSize);
    const selectedCommonItems = generateCommonItems(
      fallbackShopType,
      shopkeeper.priceModifier,
      limits
    );
    const selectedRareItems = generateRareItems(
      fallbackShopType,
      shopkeeper.priceModifier,
      limits
    );

    const newMotto = generateMotto(fallbackShopType, shopkeeper.priceModifier);

    const updatedShopkeeper = {
      ...shopkeeper,
      shopType: fallbackShopType, // allow type change
      commonItems: selectedCommonItems,
      rareItems: selectedRareItems,
      motto: newMotto
    };

    setShopkeeper(updatedShopkeeper);
    setShopType(fallbackShopType); // sync UI
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
    availableMoney: generateShopkeeperMoney(customSettlementSize),
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

const getSettlementData = (size: string) => {
  switch (size) {
    case "village":
      return {
        text: "Village Shop",
        icon: "storefront"  // or "home_work", "cabin", "nature_people"
      };
    case "town":
      return {
        text: "Town Merchant", 
        icon: "store"  // or "business", "storefront", "community"
      };
    case "city":
      return {
        text: "City Emporium",
        icon: "apartment"  // or "business_center", "domain", "corporate_fare"
      };
    default:
      return {
        text: "Merchant",
        icon: "storefront"
      };
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
          @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,200,0,0&display=swap');


          .cinzel {
            font-family: 'Cinzel', serif;
          }
          
          .inter {
            font-family: 'Inter', sans-serif;
          }
          
.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-style: normal;
  font-weight: 100;
  font-size: 20px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  white-space: nowrap;
  direction: ltr;
  font-variation-settings: 'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 24;
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
            padding: 1.5rem !important;
          }
          
          .shop-icon {
            font-size: 20px !important;
            vertical-align: middle;
            font-variation-settings: 
              'FILL' 0,
              'wght' 400,
              'GRAD' 0,
              'opsz' 14 !important;
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
           
          .item-icon {
            min-width: 18px;
            text-align: center;
          }

          .material-symbols-outlined {
            font-variation-settings: 
              'FILL' 0,
              'wght' 200,
              'GRAD' 0,
              'opsz' 20;
          }

          .rare-item-name {
            display: flex;
            align-items: center;
          }
          
          .item-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: 10px 0;
            border-bottom: 1px solid rgba(198, 181, 155, 0.5);
            gap: 1rem;
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
            gap: 1rem;
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
          
          .till-card {
            background-color: #f8f7f5;
            border: 1px solid #d6d3d1;
            box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }

          .till-display {
            display: flex;
            flex-direction: column;
          }

          .till-amount {
            font-weight: 500;
            font-size: 1rem;
          }

          .price-display {
            display: flex;
            align-items: center;
            min-width: 100px;
            justify-content: flex-end;
          }
          .rarity-badge {
            font-size: 0.65rem;
            padding: 0.15rem 0.4rem;
            border-radius: 3px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.025em;
            border: 1px solid;
            white-space: nowrap;
          }

          .rarity-common {
            background-color: #f5f5f4;
            color: #78716c;
            border-color: #a8a29e;
          }

          .rarity-uncommon {
            background-color: #ccfbf1;
            color: #0d9488;
            border-color: #2dd4bf;
          }

          .rarity-rare {
            background-color: #e0e7ff;
            color: #4f46e5;
            border-color: #6366f1;
          }

          .rarity-very-rare {
            background-color: #fce7f3;
            color: #db2777;
            border-color: #ec4899;
          }

          .rarity-legendary {
            background-color: #fffbeb;
            color: #d97706;
            border-color: #f59e0b;
          }
          
          .currency-icon {
          font-size: 16px !important;
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
          color: #eab308 !important;
        }

        .silver-icon {
          color: #9ca3af !important;
        }

        .copper-icon {
          color: #92400e !important;
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
            border-radius: 4px;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 0.25rem;
          }
          
        
          .common-regen {
            color: rgb(120, 113, 108);
            background-color: #f5f5f4;
          }
          
          .common-regen .material-symbols-outlined {
            transition: transform 0.2s ease;
          }
         
          .common-regen:hover {
            background-color: #f5f5f4;
          }
          
          .common-regen:hover .material-symbols-outlined {
            transform: rotate(45deg);
          }
         
          .rare-regen {
            color: #7c3aed;
            background-color: #f5f3ff;
          }
          
          .rare-regen .material-symbols-outlined {
            transition: transform 0.2s ease;
          }
         
          .rare-regen:hover {
            background-color: #f5f3ff;
          }
          
          .rare-regen:hover .material-symbols-outlined {
            transform: rotate(45deg);
          }
          
select.rare-dropdown {
  background-color: #f5f3ff !important;
  border: 1px solid #c084fc !important;
  color: #7c3aed !important;
  transition: all 0.2s ease !important;
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  appearance: none !important;
}

select.rare-dropdown:hover {
  background-color: #ede9fe !important;
  border-color: #a855f7 !important;
}

select.rare-dropdown:focus {
  outline: none !important;
  border-color: #7c3aed !important;
  box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.1) !important;
  background-color: #f5f3ff !important;
}

select.common-dropdown {
  background-color: #f5f5f4 !important;
  border: 1px solid #a8a29e !important;
  color: #78716c !important;
  transition: all 0.2s ease !important;
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  appearance: none !important;
}

select.common-dropdown:hover {
  background-color: #e7e5e4 !important;
  border-color: #78716c !important;
}

select.common-dropdown:focus {
  outline: none !important;
  border-color: #78716c !important;
  box-shadow: 0 0 0 2px rgba(120, 113, 108, 0.1) !important;
  background-color: #f5f5f4 !important;
}

.dropdown-wrapper {
  position: relative;
  display: inline-block;
}

.dropdown-arrow {
  position: absolute;
  top: 50%;
  right: 8px;
  transform: translateY(-50%);
  pointer-events: none;
  font-size: 16px !important;
}

.dropdown-arrow.common-arrow {
  color: #78716c;
}

.dropdown-arrow.rare-arrow {
  color: #7c3aed;
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
          
          .large-icon {
            font-size: 24px !important;
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

        /* Mobile responsive styles */
          @media (max-width: 640px) {
            .header-mobile {
              flex-direction: column !important;
              align-items: flex-start !important;
              gap: 1rem !important;
            }
            
            .header-controls-mobile {
              width: 100% !important;
              justify-content: space-between !important;
            }
            
            .item-row-mobile {
              flex-direction: column !important;
              align-items: flex-start !important;
              gap: 0.5rem !important;
            }
            
            .item-content-mobile {
              width: 100% !important;
            }
            
            .item-description-mobile {
              margin-left: 0 !important;
              padding-right: 0 !important;
            }
            
            .price-block-mobile {
              margin-left: 0 !important;
              align-items: flex-start !important;
              width: 100% !important;
            }
          }
        `}
      </style>

          
{/* Store Selector Card */}
<div className="shopkeeper-card rounded-md shadow-sm p-6 mb-6">
{/* Single header line with title, randomize button, and chevron */}
<div className="flex items-center justify-between mb-4 header-mobile">
  <h1 className="text-4xl font-bold text-stone-600 cinzel shopkeeper-name m-0 leading-none">Fantasy Shop Builder</h1>
  
  <div className="flex items-center gap-4 header-controls-mobile">
    {/* Randomize Button */}
    <button
      onClick={() => {
        const sizes = ['village', 'town', 'city'];
        const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
        setShopType('');
        setSettlementSize(randomSize);
        generateShopkeeper('random', randomSize);
      }}
      className="flex items-center gap-2 text-xs font-regular inter rounded-md border px-2 py-1 bg-stone-100 text-stone-500 border-stone-400 hover:bg-stone-200 transition"
    >
      <span className="material-symbols-outlined" style={{fontSize: '18px'}}>casino</span>
      Randomize Shop
    </button>
    
    {/* Chevron Toggle */}
    <button
      onClick={() => setControlsExpanded(!controlsExpanded)}
      className="text-stone-500 hover:text-stone-700 p-2 rounded transition flex items-center justify-center"
      title={controlsExpanded ? "Hide settings" : "Show settings"}
    >
      <span className="material-symbols-outlined" style={{fontSize: '28px'}}>
        {controlsExpanded ? 'expand_less' : 'expand_more'}
      </span>
    </button>
  </div>
</div>

  {/* Expandable Controls */}
  {controlsExpanded && (
    <div className="space-y-4 border-t border-stone-200 pt-4">
      {/* Settlement Size */}
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

      {/* Shop Type */}
      <div>
        <span className="text-sm font-medium text-stone-600 mr-2">What kind of shop are your players visiting?</span>
        <div className="flex flex-wrap gap-2 mt-1">
          {shopTypes.map((type) => (
            <button
              key={type}
              onClick={() => {
                setShopType(type);
                if (!settlementSize) {
                  setSettlementSize('town');
                  generateShopkeeper(type, 'town');
                } else {
                  generateShopkeeper(type, settlementSize);
                }
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
  )}
</div>
   
      {shopkeeper && (
        
<div className="shopkeeper-card rounded-md shadow-sm p-6">
  <div className="header-content mb-6">
    
{/* Shop Name */}
<div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-1">
  {/* Shop Name */}
  <h2 className="text-2xl font-bold text-stone-600 cinzel shopkeeper-name m-0 leading-none">
    {shopkeeper.shopName}
  </h2>
      
      
{/* Badges - wrap on mobile */}
  <div className="flex flex-wrap items-center gap-2">
    {/* Shop Type Label */}
    <div
      className={`text-xs uppercase font-medium inter tracking-wider rounded-md border px-2 py-1 flex items-center ${shopTypeClasses[shopkeeper.shopType] || shopTypeClasses["default"]}`}
    >
      <span className="material-symbols-outlined shop-icon mr-1">{shopIcons[shopkeeper.shopType] || "storefront"}</span>
      {shopkeeper.shopType}
    </div>
    
    {/* Settlement Badge */}
{(() => { 
  const settlementData = getSettlementData(settlementSize); 
  return ( 
    <div className={`text-xs uppercase font-medium inter tracking-wider rounded-md border px-2 py-1 flex items-center ${settlementBadgeClasses[settlementSize] || settlementBadgeClasses["default"]}`}> 
      <span className="material-symbols-outlined shop-icon mr-1">{settlementData.icon}</span> 
      {settlementData.text} 
    </div> 
  ); 
})()}
      </div>
    </div>

{/* Shopkeeper Name & Race */}
<div className="flex items-center justify-between mb-2">
  <h3 className="shopkeeper-name text-lg text-stone-600 font-semibold cinzel m-0">
    {shopkeeper.name} <span className="text-stone-400 font-normal">• {shopkeeper.race}</span>
  </h3>
    <button
      onClick={() => setIsLocked(!isLocked)}
      aria-label="Toggle shopkeeper lock"
      className="text-stone-500 hover:text-stone-700 transition-colors text-xs ml-2"
    >
      {isLocked ? (
        <span className="material-symbols-outlined" title="Locked">lock</span>
      ) : (
        <span className="material-symbols-outlined" title="Unlocked">lock_open</span>
      )}
    </button>
</div>

              <div className="space-y-2">
                {/* Shopkeeper Description */}
                <div
                  className="mt-2 text-sm text-gray-700"
                  dangerouslySetInnerHTML={{ __html: shopkeeper?.description }}
                ></div>

                {/* Shop Motto */}
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
          

          {/* Shop Till Card */}
          <div className="till-card rounded-md p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="till-display">
                <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-stone-600">point_of_sale</span>
                 <span className="text-xs uppercase font-medium inter tracking-wider text-stone-500">Shop Till</span>
                </div>
                <div>
                  <div className="till-amount font-medium text-stone-600" dangerouslySetInnerHTML={{ __html: shopkeeper.availableMoney }}></div>
                </div>
              </div>
              
              {/* Placeholder for future buy/sell controls */}
              <div className="flex gap-2">
                <div className="text-xs text-stone-400 italic">
                  Buy/Sell controls coming soon
                </div>
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="mb-6">            
            <div className="grid grid-cols-1 gap-6"></div>
       
            <div className="grid grid-cols-1 gap-6">
              <div className="common-items-block p-5 rounded-md">
                <div className="section-header">
  {/* Group header + regen button together */}
  <div className="flex items-center gap-2">
    <h4 className="text-xs tracking-widest uppercase font-semibold inter" style={{ color: "#78716c" }}>
      Common Items
    </h4>
    <button
      onClick={regenerateCommonItems}
      className="regen-button common-regen"
      title="Regenerate common items"
    >
      <span className="material-symbols-outlined shop-icon">cycle</span>
    </button>
  </div>
  
  {/* Dropdown stays on the right */}
  <div className="flex items-center gap-2">
  <span className="text-xs text-stone-500">Sort:</span>
  <div className="dropdown-wrapper">
    <select
      className="text-xs font-normal inter border rounded px-2 py-1 text-stone-600 common-dropdown"
      value={commonSort}
      onChange={(e) => setCommonSort(e.target.value)}
    >
      <option value="alpha">Alphabetical</option>
      <option value="price-asc">Price: low to high</option>
      <option value="price-desc">Price: high to low</option>
    </select>
    <span className="material-symbols-outlined dropdown-arrow common-arrow">expand_more</span>
  </div>
</div>
</div>
                <div className={commonItemsClass}>
                  {sortedCommon.length > 0 ? (
  sortedCommon.map((item, index) => (
    <div key={`common-${index}-${item.name}`} className="item-row item-row-mobile">
  <div className="flex flex-col flex-1 item-content-mobile">
    <div className="flex items-center gap-2 mb-1 flex-wrap">
      <span className="material-symbols-outlined text-stone-500">
        {getIconForItem(item.name)}
      </span>
      <span className="text-stone-600">
        {item.name}
      </span>
      <span className={getRarityBadgeClass(item.level)}>
        {item.level}
      </span>
    </div>
    
    {/* Price on mobile - left aligned, underneath name */}
    <div className="block sm:hidden mb-2">
      <div className="font-medium text-stone-600" 
           dangerouslySetInnerHTML={{ __html: item.adjustedPrice }}>
      </div>
      {shopkeeper.priceModifier !== 0 && (
        <div className="base-price">
          Original: {item.basePrice}
        </div>
      )}
    </div>
    
    {/* Description - full width on mobile */}
    {item.details && (
      <span className="text-stone-500 text-sm mt-1 mb-1 ml-0 sm:ml-7">
        {item.details}
      </span>
    )}
  </div>
  
  {/* Price on desktop ONLY - conditional rendering */}
  <div className="hidden sm:block ml-4">
    <div className="price-block">
      <div className="price-display font-medium text-stone-600" 
           dangerouslySetInnerHTML={{ __html: item.adjustedPrice }}>
      </div>
      {shopkeeper.priceModifier !== 0 && (
        <div className="base-price">
          Original: {item.basePrice}
        </div>
      )}
    </div>
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
  {/* Group header + regen button together */}
  <div className="flex items-center gap-2">
    <h4 className="text-xs tracking-widest uppercase font-semibold inter" style={{ color: "#7c3aed" }}>
      Rare Items
    </h4>
    <button
      onClick={regenerateRareItems}
      className="regen-button rare-regen"
      title="Regenerate rare items"
      disabled={settlementSize === 'village'}
    >
      <span className="material-symbols-outlined shop-icon">cycle</span>
    </button>
  </div>
  
  {/* Dropdown stays on the right */}
<div className="flex items-center gap-2">
  <span className="text-xs text-violet-500">Sort:</span>
  <div className="dropdown-wrapper">
    <select
      className="text-xs font-normal inter border rounded px-2 py-1 text-violet-600 rare-dropdown"
      value={rareSort}
      onChange={(e) => setRareSort(e.target.value)}
    >
      <option value="alpha">Alphabetical</option>
      <option value="price-asc">Price: low to high</option>
      <option value="price-desc">Price: high to low</option>
    </select>
    <span className="material-symbols-outlined dropdown-arrow rare-arrow">expand_more</span>
  </div>
</div>
</div>
                <div className={rareItemsClass}>
                  {sortedRare.length > 0 ? (
  sortedRare.map((item, index) => (
    <div key={`rare-${index}-${item.name}`} className="rare-item-row item-row-mobile">
  <div className="flex flex-col flex-1 item-content-mobile">
    <div className="flex items-center gap-2 mb-1 flex-wrap">
      <span className="material-symbols-outlined text-violet-500">
        {getIconForItem(item.name)}
      </span>
      <span className="text-violet-700">
        {item.name}
      </span>
      <span className={getRarityBadgeClass(item.level)}>
        {item.level}
      </span>
    </div>
    
    {/* Price on mobile - left aligned, underneath name */}
    <div className="block sm:hidden mb-2">
      <div className="font-medium text-violet-700" 
           dangerouslySetInnerHTML={{ __html: item.adjustedPrice }}>
      </div>
      {shopkeeper.priceModifier !== 0 && (
        <div className="base-price !text-violet-500">
          Original: {item.basePrice}
        </div>
      )}
    </div>
    
    {/* Description - full width on mobile */}
    {item.details && (
      <span className="text-violet-500 text-sm mt-1 mb-1 ml-0 sm:ml-7">
        {item.details}
      </span>
    )}
  </div>
  
  {/* Price on desktop ONLY - conditional rendering */}
  <div className="hidden sm:block ml-4">
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