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
    "leans forward slightly, sleeves rolled, eyes bright with the kind of interest that doesn’t need words",
    "opens their coin purse and places it on the counter before you've said a thing. An unspoken gesture of trust",
    "rubs {possessive} palms together with restrained glee, already shifting items aside to make space",
  ],
  open: [
    "rests an elbow on the counter, relaxed but attentive, eyes following your movements with easy familiarity",
    "gives you a once-over, ending in a slow nod and a relaxed smile that welcomes words",
    "lets the silence stretch as coins click in a practiced rhythm beneath {possessive} fingers",
    "adjusts a small display without urgency, casually clearing a spot in front of you",
    "offers a subtle gesture toward the scale. Welcoming, but without ceremony",
  ],
  reserved: [
    "stands motionless behind the counter, gaze level, revealing nothing",
    "folds {possessive} hands with careful precision, posture making space without invitation",
    "watches without blinking, letting silence and stillness draw the line",
    "tidies a corner of the ledger with quiet focus, eyes flicking up only once you’re fully still",
    "waits in studied quiet, letting your presence fill the room before acknowledging it",
  ],
  doubtful: [
    "narrows {possessive} eyes slightly, like trying to see through fog. Or through you",
    "tilts {possessive} head just enough to look skeptical, arms folded tight across the chest",
    "shakes {possessive} head once, not as refusal. More as instinct",
    "flicks a glance at your bag, lips pursed. Not yet impressed with you or your wares",
    "drums a fingertip against the wood, impatient with your presence",
  ],
  dismissive: [
    "sighs loud enough to break the air between you, already turning slightly away",
    "doesn’t bother to straighten up, letting the weight of {possessive} glance say it all",
    "snaps a drawer shut harder than needed, the sharp sound enough to stall your next step",
    "closes the ledger with a sharp snap and no effort to hide the annoyance",
    "scowls like someone who’s had this conversation before and expects nothing new from it",
  ],
};

export const personalityDescriptions: Record<string, string[]> = {
  stingy: [
    "maintains an immaculate workspace, each tool in perfect alignment, {possessive} ledger entries so crisp they could pass for calligraphy",
    "keeps a magnifying glass and fine-tipped scale at the ready, built for detecting the smallest imperfections",
    "stores coins in separate compartments by denomination, each stack counted twice before a single trade is made",
    "pulls on white cotton gloves, each motion precise. The kind of movement that speaks of long habit and quiet respect for what’s handled",
    "displays a hand-drawn chart with rates so exact, it feels like haggling would be a waste of breath",
  ],
  generous: [
    "operates from a comfortably cluttered counter, where practical tools mingle with personal trinkets and small curiosities",
    "keeps a worn leather pouch organized by feel alone, coins settling with the ease of long practice and quick hands",
    "uses a simple balance scale that's seen years of honest use, weights smoothed by countless trades",
    "keeps a dog-eared notebook filled with running tallies, the margins cluttered with scribbled notes only {pronoun} can decode",
    "displays handwritten signs advertising bulk discounts and 'trader’s specials,' each one scrawled in uneven lettering and pinned wherever space allowed",
  ],
  standard: [
    "operates from a clean, organized counter with standard merchant tools arranged in practical order",
    "keeps a regulation-sized scale calibrated weekly, weights stored in a proper wooden case",
    "keeps his ledger in neat, consistent script, each line notated with the crisp symbols of standard merchant trade",
    "displays current exchange rates on a well-used slate board, the figures refreshed each morning to meet guild expectations",
    "keeps {possessive} coins in a well-fitted strongbox, each stack aligned and accounted for before it ever leaves {possessive} hand",
  ],
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
 * Get a random personality description for the given personality type
 */
export const getPersonalityDescription = (personalityType: string): string => {
  const descriptions = personalityDescriptions[personalityType];
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
  pronouns: ShopkeeperPronouns
): { moodDescription: string; personalityDescription: string } => {
  const personalityType = getPersonalityType(priceModifier);

  const rawMoodDesc = getMoodDescription(mood);
  const rawPersonalityDesc = getPersonalityDescription(personalityType);

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
      "I’ve outmaneuvered kings for less. You? You had me by the second sentence.",
      "That was a surgical strike. Take the deal before I come to my senses.",
      "You've dismantled my position like a master crafter strips rust from silver. The offer stands.",
      "Remarkable. I pride myself on discipline, and still—you carved through me clean.",
    ],
    generous: [
      "That was brilliant! You haggled like it was your calling.",
      "You’ve got the kind of spark this world tries to snuff out. I’m glad it didn’t.",
      "That was a joy to watch. Makes me feel lucky just to be part of it.",
      "I haven’t been talked into a deal like that since my first market stall.",
      "You make it look easy—and I know it’s not. You’ve earned this and then some.",
    ],
    standard: [
      "You made your case with clean logic and solid footing. There’s no arguing that.",
      "That was tidy, thorough, and well-structured. I respect that.",
      "Your reasoning holds at every angle. The deal improves accordingly.",
      "You came prepared and delivered. That’s all I ever ask.",
      "Can’t fault a single word of that. It’s yours.",
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
      "Good argument. The numbers shift in your favor.",
      "You’ve earned a more favorable rate by merit, not luck.",
      "Solid points. I’m revising the offer accordingly.",
      "Your reasoning holds. Let's improve the terms.",
      "That’s fair. Here’s a better deal to match it.",
    ],
  },

  moderateSuccess: {
    stingy: [
      "You’ve made just enough sense to make me uncomfortable. Fine. A small shift.",
      "You’re not wrong, but you’re not convincing either. A modest concession.",
      "Hmm. I’ll give you a sliver of ground, but don’t expect applause.",
      "There’s logic in there somewhere. I’ll adjust, but only slightly.",
      "You’ve earned the faintest nod of approval. Here’s your minor improvement.",
    ],
    generous: [
      "You’ve got the right idea. Let me nudge the offer in your favor.",
      "Good effort. I’ll meet you partway...just a little.",
      "You reason well enough. That deserves something extra.",
      "Alright, I’ll improve this a touch. You’re almost there.",
      "Decent case! Not your strongest, but strong enough to matter.",
    ],
    standard: [
      "Reasonable enough. I’ll make a minor adjustment.",
      "You’ve shown some logic. Small concession granted.",
      "That was measured. The deal gets a touch better.",
      "Fair points. Nothing groundbreaking, but worth a revision.",
      "You’ve made your case. Here’s a slight improvement.",
    ],
  },

  minorSuccess: {
    stingy: [
      "Fine. A thread of logic exists in there somewhere. A tiny adjustment, then.",
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
      "There’s some merit in that. Minor adjustment granted.",
      "Adequate case. The offer improves slightly.",
      "That holds water...barely. I’ll revise the rate by a hair.",
      "Acceptable reasoning. Here’s a small improvement.",
      "That was passable. You’ve earned a modest revision.",
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
      "You pushed too far. The numbers don’t support the claim.",
      "Almost made it stick, but there’s a flaw. The offer takes a hit.",
      "When the logic crumbles, so does the rate. Minor deduction.",
      "That stretch didn’t help your case. Offer reduced accordingly.",
    ],
  },

  majorFailure: {
    stingy: [
      "You think I’ve never seen a bluff before? The offer drops. Hard.",
      "Insult my intelligence again and I’ll stop dealing with you entirely.",
      "That was bold, and not in the good way. You’ve cost yourself dearly.",
      "Clever lies aren’t clever when they’re obvious. Enjoy your penalty.",
      "You reached too far and broke the deal. The new offer reflects that.",
    ],
    generous: [
      "That didn’t just miss, it stung. I’ve got to pull the offer back, hard.",
      "You nearly had me, then ruined it with that. I'm genuinely disappointed.",
      "That felt dishonest. I have to revise this down. More than I’d like to.",
      "You took a kind offer and twisted it. I can’t let that stand.",
      "I hoped for better from you. The offer worsens, and I mean that sincerely.",
    ],
    standard: [
      "That crosses a line. The new terms reflect the breach.",
      "Poor form. I’m cutting the offer significantly.",
      "You’re lucky I’m still negotiating at all. Consider this a warning cut.",
      "Blatant manipulation has consequences. My offer severely reduced.",
      "That was more performance than logic. The deal’s worse for it.",
    ],
  },

  criticalFailure: {
    stingy: [
      "You’ve insulted both my trade and my time. Pay the fine or take your tricks elsewhere.",
      "Unforgivable. I’ve barred better traders for less. This shop is closed to you until restitution is made.",
      "You’ve crossed the line from negotiation into offense. There’s a fee if you want that door to open again.",
      "That wasn’t a mistake. That was an insult. You’ll pay to be heard again, if ever.",
      "Leave. Now. You’ll not be welcome here again until the fine is paid and maybe not even then.",
    ],
    generous: [
      "I opened my hands to you and you spat in them. I need space.",
      "That hurt more than I expected. I can't deal with you again until you’ve made it right.",
      "I don’t deserve that kind of treatment. Pay the fine, and maybe we can talk.",
      "That was crueler than you know. It'll take more than coin to undo it, but coin’s a start.",
      "I trusted you. That was my mistake. You’ll need to earn your way back in, starting with the fee.",
    ],
    standard: [
      "That breach of conduct is unacceptable. You’re barred until a fine is paid.",
      "Negotiation has rules. You broke them. This deal—and this door—is closed.",
      "You’ve disrespected the terms and the trader. Reentry requires restitution.",
      "This isn’t how trade works. Consider this a formal lockout until the fine is settled.",
      "That was a violation, not an argument. You’re out until you pay to come back in.",
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
