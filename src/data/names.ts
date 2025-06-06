// data/names.ts
export const femaleNames = [
  "Alaia", "Amara", "Amina", "Amira", "Anika", "Anouk", "Astrid", "Ayo", "Aziza",
  "Carmen", "Dara", "Elske", "Esi", "Fatima", "Fatou", "Freja", "Hadiya", "Hei",
  "Imani", "Ines", "Ingrid", "Jasmine", "Kaja", "Layla", "Leilani", "Lian", "Liv",
  "Lucia", "Maartje", "Maren", "Marisol", "Matthijs", "Mina", "Nadia", "Naomi",
  "Nia", "Noa", "Noor", "Rina", "Roos", "Soraya", "Stellan", "Suki", "Yasmin",
  "Zahra", "Zara", "Thraina", "Sigrid", "Halga", "Durra", "Thora", "Gudrun",
  "Eluna", "Sylmae", "Ishara", "Lirael", "Zireen", "Nyrieth", "Arenya", "Tilda",
  "Merrin", "Posy", "Fenna", "Hattie", "Minta", "Reni", "Tinka", "Zinki", "Miri",
  "Frayla", "Jixi", "Zuzu", "Mira", "Saela", "Nyra", "Isryn", "Zeva", "Orielle",
  "Thoka", "Zarra", "Umma", "Ketha", "Hasska", "Mazra", "Sukka", "Ashira", "Azia",
  "Neriseth", "Kaiva", "Velkira", "Nyzora", "Miraxi", "Yureth",
];

export const races = [
  "Human", "Dwarf", "Elf", "Halfling", "Gnome", "Half-Elf", 
  "Half-Orc", "Tiefling", "Dragonborn",
];

export const firstNames: Record<string, string[]> = {
  Human: [
    "Alaia", "Alejandro", "Amara", "Amina", "Amira", "Anika", "Anouk", "Astrid",
    "Ayo", "Aziza", "Bas", "Bjorn", "Carmen", "Dara", "Diego", "Elske", "Esben",
    "Esi", "Farid", "Fatima", "Fatou", "Freja", "Habib", "Hadiya", "Hassan",
    "Hei", "Imani", "Imran", "Ines", "Ingrid", "Ismael", "Jamal", "Jasmine",
    "Jens", "Jiro", "Kaja", "Keahi", "Kwame", "Lars", "Layla", "Leilani", "Lian",
    "Liv", "Lucia", "Maartje", "Malik", "Maren", "Marisol", "Mateo", "Matthijs",
    "Mina", "Nadia", "Naomi", "Nia", "Niko", "Noa", "Noor", "Omar", "Rafael",
    "Rafi", "Ravi", "Rina", "Rohan", "Roos", "Rune", "Salim", "Sanele", "Soraya",
    "Soren", "Stellan", "Suki", "Takumi", "Tariq", "Thijs", "Yasmin", "Yusuf",
    "Zahra", "Zara", "Zayd", "Zuberi",
  ],
  Dwarf: [
    "Bruni", "Harnik", "Korga", "Ylva", "Doric", "Thraina", "Brog", "Sigrid",
    "Skarn", "Halga", "Durra", "Stigr", "Valtha", "Brynjar", "Thora", "Gudrun",
  ],
  Elf: [
    "Aeleth", "Caelion", "Eluna", "Faevyn", "Loralanthir", "Vaeril", "Myrien",
    "Serelien", "Thaleth", "Sylmae", "Ishara", "Lirael", "Zireen", "Nyrieth",
    "Kaelen", "Arenya",
  ],
  Halfling: [
    "Tilda", "Merrin", "Cobbin", "Posy", "Joss", "Fenna", "Wick", "Rilo", "Nim",
    "Lyle", "Peppin", "Hattie", "Dovo", "Minta", "Reni", "Quinn",
  ],
  Gnome: [
    "Nibblet", "Wizzle", "Quindle", "Tinka", "Snorbin", "Glim", "Pindle", "Razz",
    "Zinki", "Boondle", "Miri", "Frayla", "Dap", "Jixi", "Lom", "Zuzu",
  ],
  "Half-Elf": [
    "Neris", "Kaelen", "Mira", "Solen", "Virel", "Saela", "Ronan", "Nyra",
    "Thalen", "Isryn", "Tallis", "Zeva", "Orielle", "Elandor", "Rowan", "Kye",
  ],
  "Half-Orc": [
    "Brakka", "Jurgan", "Thoka", "Zarra", "Krall", "Umma", "Vurg", "Ketha",
    "Drog", "Hasska", "Mazra", "Ruun", "Tarn", "Sukka", "Orven", "Koz",
  ],
  Tiefling: [
    "Zareth", "Calyx", "Vireth", "Ashira", "Nyx", "Malrek", "Soraya", "Kaelix",
    "Zephan", "Riven", "Azia", "Damar", "Laziel", "Neriseth", "Tivan", "Oreth",
  ],
  Dragonborn: [
    "Sorrak", "Kaiva", "Ralnor", "Velkira", "Tharn", "Nyzora", "Ormash", "Dravik",
    "Tirash", "Zavri", "Korran", "Miraxi", "Balor", "Yureth", "Erdan", "Skavak",
  ],
};

export const lastNames: Record<string, string[]> = {
  Human: [
    "Attar", "Baker", "Balogun", "Barbero", "Bonde", "Butler", "Carretero",
    "Carter", "Chandler", "Chen", "Chowdhury", "Faulkner", "Firewalker",
    "Fletcher", "Guerrero", "Haddad", "Harper", "Herrero", "Hyrde", "Joshi",
    "Kato", "Khabbaz", "Makena", "Manoa", "Mason", "Mercer", "Miller", "Molinero",
    "Najjar", "Navarro", "Nguyen", "Onyango", "Park", "Parker", "Pastor", "Patel",
    "Potter", "Qasab", "Rai", "Rainmaker", "Reddy", "Runningbear", "Rybak",
    "Saavedra", "Skov", "Slater", "Smed", "Smith", "Snickare", "Stonepath",
    "Sukma", "Takahashi", "Taylor", "Thatcher", "Torres", "Tupou", "Wainwright",
    "Walker", "Ward", "Weaver", "Wheeler", "Whitetail", "Wright", "Wu", "Zapatero", "Zhang",
  ],
  Dwarf: [
    "Stonemantle", "Ironstitch", "Goldthane", "Forgebluff", "Axebringer",
    "Cragborn", "Rockmaw", "Deepforge", "Steelhewer", "Hammerfell",
    "Boulderhelm", "Anvilborn",
  ],
  Elf: [
    "Duskwhisper", "Silversea", "Windglade", "Moonsong", "Elarshade", "Dawnspire",
    "Frostwhisper", "Starbloom", "Nightpetal", "Glimmerleaf", "Brightshade", "Mistglen",
  ],
  Halfling: [
    "Quickberry", "Underhill", "Bramblefoot", "Thistlewhip", "Barleyglen",
    "Goodroot", "Honeytoe", "Puddlewick", "Fernwhistle", "Softstep",
    "Cloverkin", "Willowpatch",
  ],
  Gnome: [
    "Bronzebolt", "Flickerspark", "Wobblepin", "Janglethim", "Sprockettwist",
    "Fizzflame", "Copperzip", "Gadgetwhirl", "Nimbleblink", "Whizzlecraft",
    "Tinklepuff", "Ratchenspark",
  ],
  "Half-Elf": [
    "Windmere", "Shadefern", "Glenholt", "Everstride", "Dawnroot", "Silvayne",
    "Brightvale", "Duskridge", "Riverlain", "Thornwild", "Whispervale", "Sunhollow",
  ],
  "Half-Orc": [
    "Ironsnout", "Ragetooth", "Skullmaw", "Bonechain", "Blackhide", "Ashcleaver",
    "Gravetusk", "Snarlbane", "Stonejaw", "Dreadhollow", "Rustfang", "Blightmark",
  ],
  Tiefling: [
    "Hellcrest", "Nightflame", "Duskscourge", "Emberwhisper", "Voidthorn",
    "Ashenvow", "Shadowreign", "Grimmire", "Flarebind", "Sinmark",
    "Blazethorn", "Cindershard",
  ],
  Dragonborn: [
    "Irontongue", "Ashwind", "Cindertail", "Scalebreaker", "Stormvein",
    "Embercrest", "Moltenhide", "Thundermaw", "Glacierborn", "Venombreath",
    "Shatterfang", "Brightscale",
  ],
};

// Race-influenced naming styles for shop names
export const raceNamingStyles: Record<string, string[]> = {
  Dwarf: ["Clan", "Hall", "& Sons", "Hold", "Keep"],
  Elf: ["Court", "Grove", "House", "Glade", "Sanctuary"],
  Halfling: ["Hearth", "Hill", "Garden", "Home", "Burrow"],
  Human: ["House", "Hall", "Works", "& Co.", "Workshop"],
  Gnome: ["Workshop", "Tinker", "Works", "Lab", "Study"],
  "Half-Elf": ["House", "Grove", "Workshop", "Studio", "Gallery"],
  "Half-Orc": ["Hold", "Works", "Shop", "Hall", "Forge"],
  Tiefling: ["House", "Sanctum", "Workshop", "Studio", "Haven"],
  Dragonborn: ["Hall", "House", "Hold", "Sanctum", "Workshop"],
};