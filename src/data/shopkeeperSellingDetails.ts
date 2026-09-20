// utils/shopkeeperSellingDetails.ts

export interface ShopkeeperPronouns {
  pronoun: string;
  possessive: string;
  object: string;
  reflexive: string;
}

export const moodDescriptions: Record<string, string[]> = {
  welcoming: [
    "grins as you approach, the soft clink of coins already audible as {pronoun} counts in anticipation",
    "hums something low and rhythmic while arranging wares, breaking off mid-tune to greet you with a nod",
    "leans forward slightly, sleeves rolled, eyes bright and already tracking what you're carrying",
    "opens {possessive} coin purse and places it on the counter before you've said a thing",
    "rubs {possessive} palms together and shifts items aside to make space for you",
  ],
  open: [
    "rests an elbow on the counter, chin in hand, eyes following your movements around the shop",
    "gives you a once-over, ending in a slow nod and a smile that settles into place",
    "lets the silence stretch as coins click in a practiced rhythm beneath {possessive} fingers",
    "adjusts a small display, one item at a time, clearing a spot in front of you",
    "tips {possessive} chin toward the scale and waits for you to approach",
  ],
  reserved: [
    "stands motionless behind the counter, gaze level, hands flat on the wood",
    "laces {possessive} fingers together on the counter, staring at you with a neutral expression",
    "watches without blinking, letting silence and stillness fill the space between you",
    "tidies a corner of the ledger with quiet focus, eyes flicking up only once you’re fully still",
    "waits in studied quiet, letting your presence fill the room before acknowledging it",
  ],
  doubtful: [
    "narrows {possessive} eyes slightly, gaze fixed somewhere between your face and your intentions",
    "tilts {possessive} head, arms folded tight across {possessive} chest, one finger tapping",
    "shakes {possessive} head slow when you make eye contact before turning to go back to {possessive} tasks",
    "flicks a glance at your bag, lips pursed, then back to your face",
    "drums a fingertip against the counter, each tap a little louder than the last",
  ],
  dismissive: [
    "sighs loud enough to break the air between you, already turning slightly away",
    "stays slouched against the back wall, eyes half-closed, chin low",
    "snaps a drawer shut harder than needed. The sound carries throughout the shop",
    "closes the ledger with a sharp snap and drops it flat on the counter",
    "scowls like someone who’s had this conversation before and expects nothing new from it",
  ],
};

// Second sentence of the shopkeeper's mood box: "{Pronoun} <description>."
// Grouped by shop type, then by how the shopkeeper prices things:
//   stingy   = charges more than 10% above market
//   standard = within 10% of market
//   generous = charges more than 10% below market
// Each line should read naturally after "He"/"She". Placeholders:
// {possessive} (his/her), {pronoun} (he/she), {object} (him/her), {reflexive}.
// "default" is only used if a shop type below is missing or has an empty list.
export const personalityDescriptions: Record<string, Record<string, string[]>> = {
  default: {
    stingy: [
      "maintains an immaculate workspace, each tool in perfect alignment, {possessive} ledger entries so crisp they could pass for calligraphy",
      "stores coins in separate compartments by denomination, each stack counted twice before a single trade is made",
      "displays a hand-drawn chart with rates calculated to the half-copper, every figure double-checked in red ink",
    ],
    standard: [
      "operates from a clean, organized counter with standard merchant tools arranged in practical order",
      "keeps a regulation-sized scale calibrated weekly, weights stored in a proper wooden case",
      "keeps {possessive} ledger in neat, consistent script, each line notated with the crisp symbols of standard merchant trade",
      "displays current exchange rates on a well-used slate board, the figures refreshed each morning in {possessive} own hand",
      "keeps {possessive} coins in a well-fitted strongbox, each stack aligned and accounted for before it ever leaves {possessive} hand",
    ],
    generous: [
      "operates from a comfortably cluttered counter, where practical tools mingle with personal trinkets and small curiosities",
      "keeps a worn leather pouch organized by feel alone, coins settling with the ease of long practice and quick hands",
      "uses a simple balance scale that's seen years of honest use, weights smoothed by countless trades",
      "keeps a dog-eared notebook filled with running tallies, the margins cluttered with scribbled notes only {pronoun} can decode",
      "displays handwritten signs advertising bulk discounts and 'trader’s specials,' each one scrawled in uneven lettering and pinned wherever space allowed",
    ],
  },

  "General Store": {
    stingy: [
      "counts out goods by the piece and totals them twice on a well-worn abacus",
      "keeps a list of who owes what pinned behind the counter, several names underlined twice",
    ],
    standard: [
      "keeps the shelves stocked in a familiar order that regulars could navigate blindfolded",
      "wraps each purchase in brown paper and twine with practiced speed",
    ],
    generous: [
      "rounds prices down to the nearest copper and shrugs off the difference",
      "tucks a little extra treat into every order",
    ],
  },

  Blacksmith: {
    stingy: [
      "weighs every ingot twice on a brass scale, noting each result in a soot-smudged ledger before naming a price",
      "keeps finished blades racked by exact length, and frowns if you touch one without asking",
    ],
    standard: [
      "wipes {possessive} hands on a leather apron before taking coin, the forge still ticking as it cools",
      "keeps the day's rates chalked on a slate by the anvil, smudged by a thumb that's rewritten them often",
    ],
    generous: [
      "keeps a bin of offcuts and bent nails by the door, marked 'free for the asking'",
      "hands you a blade hilt-first and waits for you to test the balance before naming a price",
    ],
  },

  Alchemist: {
    stingy: [
      "measures reagents to the grain, recording every dose in a leather-bound formulary",
      "keeps the costliest vials behind glass, the key on a chain around {possessive} neck",
    ],
    standard: [
      "labels every bottle in a tidy hand, with the date brewed and a warning where one is needed",
      "keeps a pestle grinding in one hand while making change with the other",
    ],
    generous: [
      "offers you a sniff of whatever's simmering, delighted to explain what it does",
      "keeps a jar of slightly off-color tonics by the door, marked down for anyone brave enough to try",
    ],
  },

  "Mystic Goods": {
    stingy: [
      "handles each curio with silk-wrapped fingers, reciting its provenance before discussing price",
      "consults a small brass pendulum before agreeing to any deal",
    ],
    standard: [
      "keeps incense burning at a steady pace, trimming the wick between customers",
      "arranges charms on a chalked board according to the phases of the moon",
    ],
    generous: [
      "reads your palm while you browse, whether you asked or not",
      "presses a small charm into your hand for luck, refusing payment",
    ],
  },

  "Exotic Goods": {
    stingy: [
      "names each item's port of origin and the cost of shipping it, as if daring you to haggle",
      "keeps the rarer pieces under oilcloth, revealing them only to buyers who look serious",
    ],
    standard: [
      "keeps a map tacked behind the counter, pins marking where each shipment came from",
      "switches between three trade tongues without missing a beat",
    ],
    generous: [
      "trades stories as readily as goods, each more improbable than the last",
      "offers you a taste of dried fruit from somewhere you've never heard of",
    ],
  },

  Jeweler: {
    stingy: [
      "keeps a loupe and fine-tipped scale at the ready, built for detecting the smallest imperfections",
      "pulls on white cotton gloves before touching anything, each motion precise enough to handle a pixie's wing",
    ],
    standard: [
      "polishes a ring on a soft cloth while talking, holding it to the light between sentences",
      "keeps each piece in a velvet-lined tray, labeled with its weight and stone",
    ],
    generous: [
      "lets you try on anything in the case, happily fetching a hand mirror",
      "keeps a tray of glass and paste trinkets priced for any purse",
    ],
  },
};

/**
 * Get a random mood description for the given mood
 */
export const getMoodDescription = (mood: string): string => {
  const descriptions = moodDescriptions[mood];
  if (!descriptions || descriptions.length === 0) {
    return "is ready to do business";
  }
  return descriptions[Math.floor(Math.random() * descriptions.length)];
};

/**
 * Get a random personality description for the given personality type and shop type
 */
export const getPersonalityDescription = (
  personalityType: string,
  shopType?: string
): string => {
  const forShop = shopType ? personalityDescriptions[shopType]?.[personalityType] : undefined;
  const descriptions =
    forShop && forShop.length > 0
      ? forShop
      : personalityDescriptions.default[personalityType];
  if (!descriptions || descriptions.length === 0) {
    return "follows standard market rates";
  }
  return descriptions[Math.floor(Math.random() * descriptions.length)];
};

/**
 * Process description text by replacing pronoun placeholders
 */
export const processDescriptionText = (
  text: string,
  pronouns: ShopkeeperPronouns
): string => {
  return text
    .replace(/\{possessive\}/g, pronouns.possessive)
    .replace(/\{pronoun\}/g, pronouns.pronoun)
    .replace(/\{object\}/g, pronouns.object)
    .replace(/\{reflexive\}/g, pronouns.reflexive);
};

/**
 * Get the personality type based on price modifier
 */
export const getPersonalityType = (priceModifier: number): string => {
  if (priceModifier > 0.1) return "stingy";
  if (priceModifier < -0.1) return "generous";
  return "standard";
};

/**
 * Get both mood and personality descriptions with pronouns processed
 */
export const getShopkeeperDescriptions = (
  mood: string,
  priceModifier: number,
  pronouns: ShopkeeperPronouns,
  shopType?: string
): { moodDescription: string; personalityDescription: string } => {
  const personalityType = getPersonalityType(priceModifier);

  const rawMoodDesc = getMoodDescription(mood);
  const rawPersonalityDesc = getPersonalityDescription(personalityType, shopType);

  return {
    moodDescription: processDescriptionText(rawMoodDesc, pronouns),
    personalityDescription: processDescriptionText(
      rawPersonalityDesc,
      pronouns
    ),
  };
};

export const haggleQuotes: Record<string, Record<string, string[]>> = {
  criticalSuccess: {
    stingy: [
      "By the time I caught the flaw in your logic, I’d already agreed. Well played.",
      "I've outmaneuvered kings for less. But you? Second sentence in and I'd already agreed.",
      "That was a surgical strike. Take the deal before I come to my senses.",
      "You've dismantled my position like a master crafter strips rust from silver. The offer stands.",
      "Remarkable. I pride myself on discipline, and still—you carved through me clean.",
    ],
    generous: [
      "That was brilliant! You haggled like it was your calling.",
      "You’ve got the kind of spark this world tries to snuff out. I’m glad it didn’t.",
      "That was the most beautiful speech I've ever heard. Well-deserved discount.",
      "I haven’t been talked into a deal like that since my first market stall.",
      "I must say I'm impressed how easy you made that look. You’ve earned this and then some.",
    ],
    standard: [
      "You made your case with impeccable logic. I'm inclined to agree with you on the pricing.",
      "Every point landed where it needed to. I can't say no to good logic.",
      "That's a rock-solid argument. I can definitely bend the pricing your way.",
      "I'm impressed. You came prepared and delivered hard. Here's a little bonus.",
      "Wow, I can’t fault a single word of that. It’s yours.",
    ],
  },

  goodSuccess: {
    stingy: [
      "Tch. You've poked a hole in my logic. I’ll allow a minor adjustment...for now.",
      "Hmph. You made your point. The offer improves, slightly.",
      "A clever jab. I’m not thrilled about it, but I’ll honor the move.",
      "Sharp tongue, steady aim. You’ve earned a better rate.",
      "You’ve pressed just hard enough. I’ll bend. Just a little.",
    ],
    generous: [
      "That’s the spirit! I can sweeten the pot a touch.",
      "You’ve got good instincts. Let me meet you halfway.",
      "Nice reasoning! I like where your head’s at. Here, take a better deal.",
      "You’ve got some charm about you. Let’s improve this while the mood’s good.",
      "Well argued! Not perfect, but worth a friendlier price.",
    ],
    standard: [
      "Good argument. I'll move the price your way.",
      "You’ve earned a more favorable rate by merit, not luck.",
      "Those are some solid points. I’m convinced to give you a better number.",
      "I can't think of any flaws in your reasoning. Let me improve the price.",
      "That’s fair. Here’s a better deal to match it.",
    ],
  },

  moderateSuccess: {
    stingy: [
      "You’ve made just enough sense to make me uncomfortable. Fine. A small shift.",
      "You’re not wrong, but you’re not convincing either. I can afford a modest concession.",
      "Hmm. I’ll give you a sliver of ground, but don’t expect applause.",
      "There’s logic in there somewhere. I’ll adjust, but only slightly.",
      "You've earned the faintest nod. Here's your minor improvement.",
    ],
    generous: [
      "You’ve got the right idea. Let me nudge the offer in your favor.",
      "Good effort. I’ll meet you partway...just a little.",
      "You reason well enough. That deserves something extra.",
      "Alright, I’ll improve this a touch. You’re almost there.",
      "Decent case! Not your strongest, but strong enough to matter.",
    ],
    standard: [
      "Reasonable enough. I’ll trim the price a little bit.",
      "You’ve got some logic there. I'm considering a small concession now.",
      "That was a measured approach. I can make the deal a touch better.",
      "Fair enough to make a small revision.",
      "You’ve made a decent case. I can make a slight improvement to the pricing.",
    ],
  },

  minorSuccess: {
    stingy: [
      "A thread of logic exists in there somewhere. I suppose I can accommodate a tiny price adjustment.",
      "You’re not completely off base. I’ll shave a sliver off the price.",
      "You scraped by with that one. Don’t expect generosity.",
      "I’ll allow the faintest discount, if only to end the conversation.",
      "You’ve made a passable case. I’ll move the needle...but barely.",
    ],
    generous: [
      "Not bad! I’ll nudge the offer upward just for trying.",
      "You gave it a shot. That counts for something in my book.",
      "I like the energy. Here's a small bump to show I noticed.",
      "You didn’t quite hit the mark, but you showed up. That matters.",
      "Effort counts. Let me sweeten this just a bit.",
    ],
    standard: [
      "There’s some logic somewhere in there. Enough to change my mind a bit.",
      "Yeah, sure. You make enough of a case to move me.",
      "That holds water...barely. I’ll revise the rate a hair.",
      "You have acceptable reasoning. I can work with that.",
      "Mhm, okay. I can kind of see your point enough to give you a minor revision.",
    ],
  },

  minorFailure: {
    stingy: [
      "I see what you were *trying* to do. The offer drops. Don’t press your luck.",
      "A cheap angle for a cheap result. You've just lost a better deal.",
      "Trying to skirt value with clever phrasing? That’ll cost you.",
      "Flattery doesn't hide weak numbers. I'm adjusting the offer downward.",
      "Next time, come with substance. I’ve trimmed the rate accordingly.",
    ],
    generous: [
      "Oof. That one felt a little forced. I have to reduce the offer, just a touch.",
      "I was with you until that last bit. It tipped the whole thing off-balance.",
      "Ah, you had me...almost. But that misstep shaved some goodwill off the top.",
      "I don’t mind a bold ask, but don’t stretch the truth. The offer dips a little.",
      "That didn’t sit right with me. I’m adjusting the deal just slightly.",
    ],
    standard: [
      "That sounded rehearsed. I’m lowering the offer. Come with cleaner logic next time.",
      "Yeah, you pushed it a bit too far. Your numbers aren't adding up.",
      "That...almost made sense. I think you lost the plot, so I'm not buying it.",
      "Your logic fell apart halfway through your argument. I'm marking the price up.",
      "That's quite the stretch. My offer is now worse as a result of your bad logic.",
    ],
  },

  majorFailure: {
    stingy: [
      "You think I’ve never seen a bluff before? I'm dropping the offer. Hard.",
      "Insult my intelligence again and I’ll stop dealing with you entirely.",
      "That was bold, and not in the good way. You’ve cost yourself dearly.",
      "Clever lies aren’t clever when they’re obvious. Enjoy your penalty.",
      "You reached too far and broke my trust. This new offer reflects that.",
    ],
    generous: [
      "That didn’t just miss, it stung. I’ve got to pull the offer back, hard.",
      "You nearly had me, then ruined it with that. I'm genuinely disappointed.",
      "That felt dishonest. I have to revise this down more than I'd like.",
      "You took a kind offer and twisted it. I can’t let that stand.",
      "I hoped for better from you. I'm afraid I'll have to drop the offer.",
    ],
    standard: [
      "You know what, that crosses a line. I'm redoing the offer in my favor.",
      "Yeah, no. I’m cutting the offer significantly.",
      "You’re lucky I’m still negotiating at all. Consider this a warning cut.",
      "I can spot a bluff from across the room. You'll have to pay for that.",
      "That was more performance than logic. The deal’s worse for it.",
    ],
  },

  criticalFailure: {
    stingy: [
      "You’ve insulted both my trade and my time. Pay the fine or take your tricks elsewhere.",
      "Unforgivable. I’ve barred better traders for less. This shop is closed to you until restitution is made.",
      "You’ve crossed the line from negotiation into offense. There’s a fee if you want that door to open again.",
      "Don't mistake this for negotiation. You insulted me. There's a fee for that.",
      "Leave. Now. You’ll not be welcome here again until the fine is paid and maybe not even then.",
    ],
    generous: [
      "I opened my hands to you and you spat in them. I need space.",
      "That hurt more than I expected. I can't deal with you again until you’ve made it right.",
      "I don’t deserve that kind of treatment. Pay the fine, and maybe we can talk.",
      "That was crueler than you know. It'll take more than coin to undo it, but coin’s a start.",
      "I trusted you. That was my mistake. You’ll need to buy my trust back with a hefty fine.",
    ],
    standard: [
      "You know what? We're done here. Pay the fine if you want this door open again.",
      "I'm offended you thought that would work. Pay my fine, or get out of my shop.",
      "I do not deal with people who trade like that. Come back when the fine's paid, and we'll see.",
      "You clearly don't know how trade works. Pay my fine or don't come back.",
      "What? That is not how haggling works. At all. Door's shut until you settle up.",
    ],
  },
};

// Helper function to get the appropriate quote
export const getHaggleQuote = (
  result: string,
  priceModifier: number
): string => {
  const personality = getPersonalityType(priceModifier);
  const quotes =
    haggleQuotes[result]?.[personality] ||
    haggleQuotes[result]?.["standard"] ||
    [];

  if (quotes.length === 0) return "...";

  return quotes[Math.floor(Math.random() * quotes.length)];
};

// Integration example for your attemptHaggle function
export const getHaggleResultType = (
  roll: number,
  total: number,
  dc: number,
  success: boolean
): string => {
  if (roll === 1) return "criticalFailure";
  if (roll === 20) return "criticalSuccess";

  if (success) {
    const successMargin = total - dc;
    if (successMargin >= 10) return "goodSuccess";
    if (successMargin >= 5) return "moderateSuccess";
    return "minorSuccess";
  } else {
    const failureMargin = dc - total;
    if (failureMargin >= 10) return "majorFailure";
    return "minorFailure";
  }
};

// Add these additions to your shopkeeperSellingDetails.ts file:

// Post-haggle reaction descriptions (for successful negotiations)
export const postHaggleMoodDescriptions: Record<string, string[]> = {
  welcoming: [
    "beams with genuine appreciation, clearly enjoying the mental sparring you just provided",
    "nods with visible respect, the kind earned through skillful negotiation rather than given freely",
    "clasps {possessive} hands together with satisfaction, delighted by the quality of your argument",
    "leans back with an impressed whistle, already looking forward to your next visit",
    "grins wide and shakes {possessive} head in admiration—you've made this transaction memorable",
  ],
  open: [
    "nods approvingly, the tension of negotiation melting into mutual respect",
    "settles back with a satisfied expression, pleased by the fair exchange of words",
    "chuckles softly and adjusts {possessive} posture, clearly enjoying the back-and-forth",
    "inclines {possessive} head in acknowledgment—you've earned {possessive} attention and respect",
    "relaxes visibly, the successful negotiation having warmed the professional atmosphere",
  ],
  reserved: [
  "maintains {possessive} composure, offering the faintest nod of acknowledgment",
  "shows no emotion, though a slight pause suggests your words left a mark",
  "keeps {possessive} expression neutral, but there's a flicker in {possessive} eyes—grudging respect, perhaps",
  "remains perfectly still, but the way {pronoun} handles the coin now feels different",
  "gives nothing away, though the focused attention on your words suggests you were heard",
],

  doubtful: [
  "furrows {possessive} brow, turning your argument over with visible doubt",
  "shakes {possessive} head slowly—surprised you kept pushing, even without strong ground",
  "looks unconvinced, but something about your approach gives {pronoun} pause",
  "maintains a skeptical look, though {pronoun} begrudgingly concedes the point",
  "wavers between dismissal and intrigue, your persistence earning a sliver of credit",
],

  dismissive: [
  "scowls, but completes the transaction with stiff efficiency",
  "clearly irritated, though {pronoun} follows through out of obligation",
  "holds a cold gaze—any goodwill has long since burned off",
  "moves with clipped, sharp gestures that signal quiet offense",
  "finishes the deal in silence, pride clearly bruised",
],

};

/**
 * Get a random post-haggle mood description for the given mood
 */
export const getPostHaggleMoodDescription = (mood: string): string => {
  const descriptions = postHaggleMoodDescriptions[mood];
  if (!descriptions || descriptions.length === 0) {
    return "processes the negotiation result";
  }
  return descriptions[Math.floor(Math.random() * descriptions.length)];
};

/**
 * Get post-haggle description with pronouns processed
 */
export const getPostHaggleDescription = (
  mood: string,
  pronouns: ShopkeeperPronouns
): string => {
  const rawDesc = getPostHaggleMoodDescription(mood);
  return processDescriptionText(rawDesc, pronouns);
};

// ADD TO shopkeeperSellingDetails.ts AFTER THE SUCCESS DESCRIPTIONS:

// Post-haggle failure descriptions (for failed negotiations)
export const postHaggleFailureDescriptions: Record<string, string[]> = {
  welcoming: [
  "winces, disappointed by the attempt but still wearing a warm smile",
  "shakes {possessive} head with a rueful grin—{pronoun} clearly expected more from you",
  "sighs, {possessive} bright demeanor dimmed but not extinguished",
  "raises an eyebrow, surprised and a little hurt by the weak reasoning you offered",
  "keeps a patient look, though your argument was clearly a letdown",
],

  open: [
  "frowns, visibly disappointed by your failed attempt",
  "leans back, {possessive} warmth fading beneath a skeptical gaze",
  "crosses {possessive} arms, the failure drawing a line between you",
  "shakes {possessive} head, unimpressed by your tactic to say the least",
  "holds a professional tone, but the edge in {possessive} voice betrays frustration",
],

  reserved: [
  "shows no reaction, but {possessive} posture says enough",
  "remains still, though the silence now feels tense and final",
  "gives you a long, unreadable look. It doesn’t feel like approval",
  "keeps {possessive} expression neutral, but there's been a shift in the air",
  "says nothing, though the way {pronoun} completes the deal feels colder",
],

  doubtful: [
  "narrows {possessive} eyes. Your failure confirms {possessive} doubts",
  "shakes {possessive} head in disapproval, clearly unimpressed",
  "scoffs at your attempt, which is doing nothing to ease {possessive} suspicion",
  "levels you with a stare, your words only deepening {possessive} mistrust",
  "keeps a wary expression.Your failure just made things worse",
],

  dismissive: [
  "scowls, your failed pitch sealing {possessive} disdain",
  "rolls {possessive} eyes without restraint and crossed {possessive} arms",
  "snorts, clearly offended at your your attempt to haggle",
  "turns away mid-sentence, done entertaining nonsense",
  "glares, your failure confirming what {pronoun} suspected all along",
],

};

/**
 * Get a random post-haggle failure description for the given mood
 */
export const getPostHaggleFailureDescription = (mood: string): string => {
  const descriptions = postHaggleFailureDescriptions[mood];
  if (!descriptions || descriptions.length === 0) {
    return "reacts poorly to the failed negotiation";
  }
  return descriptions[Math.floor(Math.random() * descriptions.length)];
};

/**
 * Get post-haggle failure description with pronouns processed
 */
export const getProcessedPostHaggleFailureDescription = (
  mood: string,
  pronouns: ShopkeeperPronouns
): string => {
  const rawDesc = getPostHaggleFailureDescription(mood);
  return processDescriptionText(rawDesc, pronouns);
};

export const cartChangeQuotes: Record<string, Record<string, string[]>> = {
  // After successful haggling, then cart changes
  afterSuccessfulHaggle: {
    stingy: [
      "Changing your mind already? I suppose that clever tongue of yours works both ways.",
      "Ah, having second thoughts? Well, that negotiation skill won't carry over to new items.",
      "Switching tactics, are we? Don't expect the same favorable terms on different goods.",
      "Already reconsidering? Smart. Though you'll need to earn any discounts all over again.",
      "A strategic retreat? Fine. But we start fresh with whatever you're selling now.",
    ],
    generous: [
      "Oh, switching things up? No worries! Fresh items, fresh conversation.",
      "New items? Excellent! I always enjoy seeing what traders bring to the table.",
      "A change of heart? That's perfectly fine. Let's see what you've got now.",
      "Different goods, different story! I'm curious to hear your pitch on these.",
      "Starting over? I appreciate a trader who knows their own mind.",
    ],
    standard: [
      "Different items, different negotiation. We'll start fresh.",
      "Changing your selection? That's fair. Let's discuss these new items.",
      "New goods require new terms. What are you looking to sell now?",
      "A different approach, I see. Let's evaluate these items properly.",
      "Fresh inventory means we reset our discussion. What's the proposal?",
    ],
  },

  // After failed haggling, then cart changes
  afterFailedHaggle: {
    stingy: [
      "Smart move. Those items weren't doing you any favors in our negotiation.",
      "Wise choice. Perhaps these new items will inspire better arguments.",
      "Finally showing some sense. Let's hope your reasoning improves with the new selection.",
      "A tactical withdrawal? Good. Maybe reconsider your approach this time.",
      "Better items might lead to better negotiating. We shall see.",
    ],
    generous: [
      "Hey, no problem! Sometimes different items just speak to you differently.",
      "Fresh start, fresh energy! Maybe these will be more inspiring to discuss.",
      "That's totally fine! Let's see if these new items spark better conversation.",
      "No worries at all! Different goods, different possibilities.",
      "A clean slate! I'm optimistic about whatever you're bringing now.",
    ],
    standard: [
      "Perhaps different items will lead to better outcomes.",
      "A fresh selection calls for a fresh evaluation.",
      "New items, new opportunity to make your case.",
      "Different goods might warrant different considerations.",
      "Starting over with new inventory. Let's see how this goes.",
    ],
  },

  // After really bad haggling (dismissive/doubtful mood), then cart changes
  afterPoorHaggle: {
    stingy: [
      "Finally admitting those weren't worth defending? How refreshing.",
      "About time. Perhaps you'll waste less of my time with these new items.",
      "Good. Maybe you'll think twice before insulting my intelligence again.",
      "A moment of clarity at last. Let's hope it extends to your negotiation skills.",
      "Cutting your losses? Smart. Don't repeat whatever that was.",
    ],
    generous: [
      "Oh! Well, that's... okay! Let's try this again with better energy.",
      "Sure, let's put that behind us. Fresh items, fresh start!",
      "No problem! Everyone has off days. Maybe these will go better.",
      "That's fine! Sometimes you just need the right items to feel confident.",
      "Of course! Let's see if these inspire better conversation.",
    ],
    standard: [
      "A wise decision. Let's approach these new items with better judgment.",
      "Probably for the best. New items deserve proper consideration.",
      "Fair enough. Perhaps a different selection will fare better.",
      "New goods, new opportunity. Try to make it count this time.",
      "Starting fresh. Let's hope for more productive discussion.",
    ],
  },

  // No haggling occurred yet, neutral cart change
  neutralChange: {
    stingy: [
      "Reconsidering your options? Prudent.",
      "Different items entirely. Very well.",
      "A change of strategy, I see.",
      "New selections require new calculations.",
      "Fresh inventory. Let's assess the value.",
    ],
    generous: [
      "Ooh, different items! I love variety.",
      "New things to look at! How exciting.",
      "Switching it up? I'm all for it!",
      "Fresh selections! Let's see what we have.",
      "Different goods? Always interesting!",
    ],
    standard: [
      "Different items, then. Let's evaluate these.",
      "New selection. We'll assess accordingly.",
      "A change in inventory. Fair enough.",
      "Fresh items to consider.",
      "Different goods require different evaluation.",
    ],
  },
};

export const cartChangeDescriptions: Record<string, Record<string, string[]>> = {
  // After successful haggling
  afterSuccessfulHaggle: {
    welcoming: [
      "chuckles good-naturedly at your change of heart, clearly amused by the shift in strategy",
      "nods with understanding, maintaining the warm rapport despite the tactical change",
      "grins at the sudden pivot, appreciating the business acumen even if it resets negotiations",
      "raises an eyebrow with interest, curious about the new direction you're taking",
      "settles back with a knowing smile, ready to engage with whatever you're offering now",
    ],
    open: [
      "adjusts to the new situation with professional grace, ready to start fresh",
      "nods thoughtfully, processing the change while maintaining a fair demeanor", 
      "resets {possessive} stance with mild curiosity about your new approach",
      "shows polite interest in the new items, though the previous rapport has cooled slightly",
      "maintains a businesslike expression, prepared to evaluate the new situation objectively",
    ],
    reserved: [
      "observes the change with neutral composure, giving nothing away about {possessive} thoughts",
      "makes note of the shift without visible reaction, simply waiting for your next move",
      "maintains {possessive} careful distance, treating this as an entirely new transaction",
      "shows no surprise at the change, having seen such tactics before",
      "resets to professional baseline, any previous warmth now carefully contained",
    ],
  },

  // After failed haggling
  afterFailedHaggle: {
    doubtful: [
      "watches the change with obvious skepticism, wondering what new trick you're attempting",
      "narrows {possessive} eyes at the sudden shift, clearly suspicious of your motives",
      "observes your new selection with the wariness of someone who's been burned before",
      "maintains a guarded expression, uncertain whether this change improves your position",
      "studies the new items with visible doubt about your continued negotiating prospects",
    ],
    dismissive: [
      "rolls {possessive} eyes at the sudden change, making no effort to hide {possessive} disdain",
      "snorts derisively at your tactical retreat, clearly unimpressed by the maneuver",
      "shows open irritation at having to restart after your previous poor performance",
      "glares at the new selection with undisguised annoyance at your continued presence",
      "makes no effort to hide {possessive} displeasure at this obvious attempt to salvage the situation",
    ],
  },

  // Neutral cart changes (no prior haggling)
  neutralChange: {
    welcoming: [
      "shifts attention to the new items with genuine interest and enthusiasm",
      "brightens at the fresh selection, eager to explore new possibilities",
      "welcomes the change with characteristic warmth and curiosity",
    ],
    open: [
      "adjusts focus to the new items with professional attention",
      "transitions smoothly to evaluating the fresh selection",
      "shows measured interest in the different approach you're taking",
    ],
    reserved: [
      "notes the change without visible reaction, simply waiting for clarification",
      "observes the new selection with characteristic neutrality",
      "maintains composed silence while assessing the altered situation",
    ],
    doubtful: [
      "eyes the new selection with the same skepticism as before",
      "maintains a wary expression while examining the different items",
      "shows continued wariness despite the change in your approach",
    ],
    dismissive: [
      "glances at the new items with minimal interest",
      "shows little enthusiasm for the changed selection",
      "maintains a disinterested demeanor despite your tactical shift",
    ],
  },
};

// Helper function to get cart change reaction
export const getCartChangeReaction = (
  hadHaggling: boolean,
  lastHaggleWasSuccessful: boolean | null,
  currentMood: string,
  priceModifier: number,
  pronouns: ShopkeeperPronouns
): { description: string; quote: string } => {
  const personality = getPersonalityType(priceModifier);
  
  let reactionType: string;
  let moodForDescription: string;

  if (!hadHaggling) {
    reactionType = 'neutralChange';
    moodForDescription = currentMood;
  } else if (lastHaggleWasSuccessful) {
    reactionType = 'afterSuccessfulHaggle';
    moodForDescription = currentMood;
  } else {
    // Failed haggle - check if mood is particularly sour
    if (currentMood === 'dismissive' || currentMood === 'doubtful') {
      reactionType = 'afterPoorHaggle';
      moodForDescription = currentMood;
    } else {
      reactionType = 'afterFailedHaggle';
      moodForDescription = currentMood;
    }
  }

  // Get quote
  const quotes = cartChangeQuotes[reactionType]?.[personality] || cartChangeQuotes['neutralChange']?.[personality] || [];
  const quote = quotes.length > 0 ? quotes[Math.floor(Math.random() * quotes.length)] : "Let's start over.";

  // Get description
  const descriptions = cartChangeDescriptions[reactionType]?.[moodForDescription] || cartChangeDescriptions['neutralChange']?.[moodForDescription] || [];
  const rawDescription = descriptions.length > 0 ? descriptions[Math.floor(Math.random() * descriptions.length)] : "reacts to the change";
  const description = processDescriptionText(rawDescription, pronouns);

  return { description, quote };
};