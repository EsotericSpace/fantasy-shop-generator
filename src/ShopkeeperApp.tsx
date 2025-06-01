import React, { useState, useEffect } from 'react';
import { HorseIcon, CastleTurretIcon, FarmIcon, HouseLineIcon, FlaskIcon, BackpackIcon, LockKeyIcon, LockKeyOpenIcon } from "@phosphor-icons/react";

const PhosphorIcon = ({ icon: Icon, weight = "thin", size = 20, ...props }) => (
  <Icon weight={weight} size={size} {...props} />
);

const shopkeeperIntroductions = {
  "alchemist": {
    refined: [
      "The laboratory-precise workshop falls silent as {name} looks up from a complex distillation, {possessive} movements carrying the practiced grace of a master who has transformed the chaotic art of alchemy into an exact science.",
      "Amid gleaming brass instruments and methodically labeled reagents, {name} greets you with the measured courtesy of someone whose expertise has earned {object} a reputation that extends far beyond these pristine walls.",
      "The air shimmers with controlled magical energies as {name} sets down a perfectly calibrated scale, {possessive} scholarly demeanor suggesting years of formal study have refined both {possessive} knowledge and {possessive} manner.",
      "Behind a workspace that resembles a university laboratory more than a merchant's shop, {name} offers a professional smile that speaks to decades of turning theoretical knowledge into practical mastery.",
      "The scent of rare herbs and precisely measured compounds fills the air as {name} turns from {possessive} meticulous work, every gesture reflecting the confidence of someone who has elevated alchemy from craft to science."
    ],
    humble: [
      "The cramped workshop buzzes with chaotic energy as {name} hurriedly clears space on a table crowded with half-finished experiments, {possessive} enthusiasm evident despite the organized disorder surrounding {pronoun}.",
      "Wiping stained hands on an equally marked apron, {name} grins sheepishly while a small explosion of harmless sparks erupts from an unmanned beaker, clearly more passionate about discovery than presentation.",
      "The air carries the scent of sulfur and burnt herbs as {name} emerges from behind towering stacks of unmarked bottles, {possessive} eyes bright with the excitement of someone who treats every mistake as a learning opportunity.",
      "Amid the cheerful chaos of improvised equipment and experimental mishaps, {name} welcomes you with infectious enthusiasm, clearly someone who compensates for limited resources with boundless curiosity.",
      "The workshop echoes with the sounds of bubbling concoctions as {name} abandons a smoking experiment to greet you, {possessive} genuine excitement about {possessive} work evident despite the humble surroundings."
    ],
    standard: [
      "The functional workshop hums with productive activity as {name} looks up from a steadily brewing potion, {possessive} workspace reflecting the organized efficiency of someone who has found their rhythm.",
      "Surrounded by well-worn journals and reliable equipment, {name} greets you with the easy confidence of an alchemist who has built a solid reputation through consistent results rather than flashy displays.",
      "The comfortable blend of herbs and chemical reactions fills the air as {name} sets aside {possessive} current project, {possessive} approachable manner suggesting someone who balances expertise with genuine customer care.",
      "In a workshop where practical knowledge clearly trumps expensive equipment, {name} offers a welcoming smile that speaks to years of serving the community with dependable skill.",
      "The steady rhythm of routine brewing continues in the background as {name} turns to address you, {possessive} confident but unpretentious demeanor reflecting a craftsperson who takes pride in honest work."
    ]
  },
  "blacksmith": {
    refined: [
      "The rhythmic ring of hammer on anvil follows a measured cadence as {name} completes a perfect strike sequence, {possessive} movements carrying the precision of a master who has transformed physical craft into high art.",
      "Heat radiates from a perfectly controlled forge as {name} sets down tools with ceremonial care, {possessive} spotless leather apron and organized workspace speaking to decades of disciplined excellence.",
      "The workshop gleams with the efficiency of a military operation as {name} turns from the anvil, every tool in its designated place and every gesture reflecting the confidence of true mastery.",
      "Behind {object}, red-hot metal cools into perfect form as {name} greets you with the quiet authority of someone whose reputation for quality has been forged through years of uncompromising standards.",
      "The forge burns at precisely controlled temperatures as {name} pauses in {possessive} work, {possessive} scholarly understanding of metallurgy evident in the way {pronoun} discusses {possessive} craft with technical precision."
    ],
    humble: [
      "Sweat glistens on {name}'s soot-marked face as {pronoun} looks up from the blazing forge, the intense heat and constant hammering creating an atmosphere of relentless, honest labor.",
      "The workshop echoes with determined strikes as {name} briefly pauses {possessive} work, {possessive} rough hands and improvised tools telling the story of someone who makes up for limited resources with sheer determination.",
      "Steam and sparks fill the air as {name} wipes {possessive} brow with a blackened sleeve, {possessive} apologetic smile acknowledging the noise and heat while {possessive} eyes shine with pride in honest work.",
      "Amid the controlled chaos of salvaged materials and creative solutions, {name} greets you with the straightforward manner of someone who believes good work speaks louder than fine presentation.",
      "The forge radiates almost overwhelming heat as {name} sets down a well-worn hammer, {possessive} genuine concern for your comfort evident even as {pronoun} continues the demanding rhythm of {possessive} trade."
    ],
    standard: [
      "The steady percussion of skilled metalwork provides a dependable backdrop as {name} looks up from the anvil, {possessive} workspace reflecting the organized efficiency of a craftsperson in their element.",
      "Heat and purpose fill the workshop as {name} pauses between hammer strikes, the comfortable chaos of active production surrounding someone who has mastered the balance between tradition and innovation.",
      "The forge glows with working heat as {name} sets aside {possessive} current project, {possessive} confident movements and practical workspace speaking to years of reliable service to the community.",
      "Sparks dance in the air as {name} turns from {possessive} work, the rhythmic sounds of the forge creating an atmosphere where skill and experience have found their natural partnership.",
      "The workshop hums with productive energy as {name} greets you with the easy authority of someone who has built a solid reputation through consistent quality and honest craftsmanship."
    ]
  },
  "general store": {
    refined: [
      "Every item sits in perfect alignment as {name} glides between displays with graceful efficiency, the immaculate organization and polished presentation reflecting years of cultivating an exceptional customer experience.",
      "The pristine shop layout speaks to meticulous attention as {name} approaches with professional poise, {possessive} encyclopedic knowledge of every product evident in the way {pronoun} anticipates customer needs.",
      "Sunlight catches the spotless surfaces and carefully arranged merchandise as {name} offers a welcoming smile that transforms a simple transaction into an opportunity to exceed expectations.",
      "The shop runs like a well-orchestrated performance as {name} moves between perfectly organized sections, {possessive} refined customer service making even routine purchases feel like personalized consultations.",
      "Quality radiates from every carefully curated display as {name} greets you with the polished manner of someone who has elevated general commerce into an art form."
    ],
    humble: [
      "Items teeter in precarious stacks as {name} navigates the cramped aisles with practiced ease, {possessive} cheerful apologies for the clutter unable to hide the genuine care {pronoun} takes with every customer.",
      "The overflowing shelves create a maze of merchandise as {name} emerges from behind a tower of goods, {possessive} enthusiasm for helping customers clearly exceeding {possessive} organizational systems.",
      "Boxes crowd every available surface as {name} searches through the controlled chaos with determined optimism, {possessive} memory serving as the primary inventory system in this packed but heartfelt establishment.",
      "The cramped quarters force creative navigation as {name} squeezes between displays to greet you, {possessive} willingness to stretch every copper piece evident in the diverse collection of practical goods.",
      "Dust motes dance in the cluttered space as {name} looks up from restocking duties, {possessive} apologetic smile and helpful nature making up for what the shop lacks in polished presentation."
    ],
    standard: [
      "The well-organized shelves reflect practical efficiency as {name} looks up from inventory tasks, {possessive} systematic approach creating an atmosphere where commerce and community naturally intersect.",
      "Familiar products line accessible displays as {name} greets you with the easy recognition of someone who genuinely knows {possessive} regular customers' preferences and needs.",
      "The shop hums with comfortable activity as {name} moves between sections with practiced ease, {possessive} balance of business sense and personal service evident in every interaction.",
      "Reliable organization meets friendly service as {name} approaches with the confident manner of someone who has built a thriving business through consistent quality and fair dealing.",
      "The practical layout serves the community well as {name} offers assistance with the experienced eye of someone who understands both {possessive} inventory and {possessive} customers' circumstances."
    ]
  },
  "mystic goods": {
    refined: [
      "The air shimmers with carefully controlled mystical energies as {name} moves through the sacred space with ceremonial grace, every gesture suggesting deep communion with the ancient forces that permeate {possessive} carefully curated collection.",
      "Crystalline light refracts through perfectly arranged artifacts as {name} greets you with the measured solemnity of a scholar-priest, {possessive} knowledge spanning both mystical tradition and academic theory.",
      "The shop feels more like a temple than a marketplace as {name} approaches with reverent authority, {possessive} understanding of magical principles evident in the respectful way {pronoun} handles each precious item.",
      "Incense and ethereal energies create an atmosphere of profound mystery as {name} offers guidance with the wisdom of someone who treats magical commerce as sacred trust between practitioner and seeker.",
      "The very walls seem to pulse with arcane power as {name} pauses in {possessive} meditative work, {possessive} presence suggesting someone who has achieved true harmony between mystical knowledge and practical application."
    ],
    humble: [
      "Candle wax and chalk dust mark {name}'s robes as {pronoun} hurriedly straightens a protective circle, the chaotic but charming shop buzzing with unpredictable magical energies and genuine enthusiasm.",
      "Sparks of uncontrolled magic dance through the air as {name} apologetically steadies a wobbling crystal, {possessive} endearing mix of mystical ambition and practical limitations creating an atmosphere of hopeful experimentation.",
      "The shop thrums with barely contained magical energy as {name} emerges from behind stacks of mysterious tomes, {possessive} excitement about the mystical path evident despite occasional mishaps with temperamental artifacts.",
      "Protective symbols drawn in hasty chalk surround workspaces as {name} greets you with infectious wonder, clearly someone who treats every magical discovery as cause for celebration regardless of the modest presentation.",
      "The air tingles with amateur enchantments as {name} sets aside a smoking incense burner, {possessive} genuine passion for mystical arts compensating for what {pronoun} lacks in formal training."
    ],
    standard: [
      "The shop maintains a perfect balance between mystical wonder and practical accessibility as {name} looks up from organizing ritual components, {possessive} expertise making ancient magic feel approachable.",
      "Controlled magical energies create an atmosphere of focused purpose as {name} greets you with confident understanding, clearly someone who respects mystical power while making it accessible to seekers of all levels.",
      "Crystals and artifacts catch the light in carefully planned arrangements as {name} approaches with the assured manner of a practitioner who has found harmony between mystical knowledge and customer service.",
      "The air carries the scent of herbs and sacred oils as {name} sets aside {possessive} current enchantment, {possessive} practical approach to magic evident in the organized efficiency of the mystical workspace.",
      "Ancient symbols and modern convenience coexist peacefully as {name} offers assistance with the balanced perspective of someone who treats magic as both art and craft."
    ]
  },
  "exotic goods": {
    refined: [
      "The shop resembles a private museum as {name} moves between displays with curatorial precision, each exotic piece positioned to tell its story while {possessive} extensive knowledge transforms browsing into cultural education.",
      "Artifacts from distant lands catch the light as {name} approaches with the authority of a seasoned explorer, {possessive} deep understanding of foreign customs and trade routes evident in every carefully chosen piece.",
      "The air carries hints of spices and distant shores as {name} greets you with scholarly enthusiasm, {possessive} collection representing years of careful curation and respect for the cultures that created these treasures.",
      "Every item reflects both beauty and cultural significance as {name} offers guidance with the reverent expertise of someone who understands that exotic goods carry the stories of their makers across vast distances.",
      "The shop serves as a bridge between worlds as {name} shares knowledge with professorial grace, {possessive} refined presentation making foreign wonders accessible while honoring their authentic cultural context."
    ],
    humble: [
      "Shipping crates bearing foreign labels crowd the aisles as {name} sorts through mixed collections with infectious enthusiasm, {possessive} wonder at distant cultures evident despite incomplete knowledge of origins.",
      "The cramped space overflows with mysteries as {name} emerges from behind stacks of exotic goods, {possessive} secondhand stories and genuine curiosity creating an atmosphere of shared discovery.",
      "Items from unknown lands fill every surface as {name} searches through the organized chaos with determined optimism, {possessive} acquisition-based pricing often undervaluing treasures due to uncertain provenance.",
      "The shop buzzes with the excitement of treasure hunting as {name} greets you with eager uncertainty, clearly someone who encourages customers to experiment and discover the purposes of mysterious items together.",
      "Foreign scripts and unfamiliar artifacts create a maze of wonders as {name} navigates the cluttered space with enthusiastic confusion, {possessive} honest admission of limitations only adding to the sense of adventure."
    ],
    standard: [
      "The organized diversity of the collection reflects thoughtful curation as {name} moves between cultural sections with confident knowledge, making exotic wonders accessible through clear explanations and fair pricing.",
      "Items from distant lands find harmony in practical display as {name} greets you with the balanced expertise of someone who understands both foreign cultures and local needs.",
      "The shop successfully bridges familiar and foreign as {name} offers guidance with reliable knowledge gained through experience and networking with traders from across the known world.",
      "Cultural treasures and practical goods coexist comfortably as {name} approaches with the assured manner of someone who has built trust through honest dealing and cultural respect.",
      "The well-organized exotic collection serves community curiosity as {name} provides assistance with the experienced eye of someone who helps customers use foreign goods appropriately and effectively."
    ]
  },
  "jeweler": {
    refined: [
      "Precious stones catch the light from specialized fixtures as {name} looks up from a delicate setting, {possessive} surgeon-like precision and technical expertise evident in every careful movement around the gleaming workspace.",
      "The shop sparkles with museum-quality displays as {name} approaches with scholarly grace, {possessive} deep knowledge of gemology and craftsmanship transforming jewelry shopping into educational consultation.",
      "Each piece receives individual spotlighting as {name} greets you with the refined manner of someone who understands that fine jewelry represents both artistic achievement and lasting investment.",
      "The workspace gleams with professional precision as {name} sets aside delicate tools, {possessive} discussion of provenance and technique revealing years of formal training and artistic development.",
      "Precious metals and rare gems create an atmosphere of quiet luxury as {name} offers expertise with the cultured authority of someone who has elevated jewelry craft to high art."
    ],
    humble: [
      "Half-finished repairs clutter the modest workbench as {name} looks up from a simple setting, {possessive} passionate appreciation for beautiful stones evident despite the humble presentation and limited resources.",
      "The cramped workspace overflows with honest craftsmanship as {name} apologetically clears space, {possessive} focus on emotional significance over monetary value creating an atmosphere of heartfelt service.",
      "Simple tools serve skilled hands as {name} greets you with genuine enthusiasm, {possessive} intuitive understanding of beauty compensating for what the shop lacks in formal gemological training.",
      "Modest displays showcase careful work as {name} approaches with unpretentious warmth, clearly someone who helps customers find pieces that speak to the heart rather than impress the wallet.",
      "The workshop shows honest effort over expensive equipment as {name} sets aside current repairs, {possessive} reverent care for even simple pieces reflecting true appreciation for the craft."
    ],
    standard: [
      "Quality tools serve experienced hands as {name} looks up from precision work, the organized workspace reflecting someone who has found the perfect balance between technical skill and aesthetic sensibility.",
      "The shop showcases a range serving every occasion as {name} greets you with professional warmth, {possessive} recommendations clearly considering both budget and the significance of each purchase.",
      "Reliable craftsmanship meets fair pricing as {name} approaches with confident competence, the practical workshop atmosphere suggesting someone who takes pride in creating both beauty and value.",
      "The efficient workspace reflects years of experience as {name} offers assistance with knowledgeable ease, clearly someone who understands both the technical and emotional aspects of fine jewelry.",
      "Organized displays serve community needs as {name} provides guidance with the balanced perspective of someone who has built a thriving business through quality work and honest dealing."
    ]
  }
};

const shopkeeperBehaviors = {
  "alchemist": {
    refined: [
      "{Name} measures ingredients with scientific precision, explaining the theoretical basis behind each mixture's properties",
      "{Possessive} workspace reflects years of formal study, with pristine equipment and methodically labeled components arranged like a laboratory",
      "{Pronoun} speaks in technical terms while wearing spotless gloves, treating each transaction as a consultation between professionals",
      "Every movement suggests classical training, from the way {pronoun} handles delicate glassware to {possessive} systematic approach to brewing",
      "{Possessive} knowledge runs deep, often referencing ancient texts and established formulas with the confidence of true expertise"
    ],
    humble: [
      "{Possessive} hands bear permanent stains from countless experiments, and {pronoun} wipes them absently on an equally marked apron while speaking",
      "{Pronoun} talks excitedly about failed experiments as much as successes, surrounded by the chaotic creativity of constant trial and error",
      "Half-finished projects and improvised equipment fill every corner, while the scent of sulfur and herbs clings to everything {pronoun} touches",
      "{Pronoun} apologizes for the mess while rummaging through unmarked bottles, relying more on memory and intuition than formal methods",
      "{Possessive} enthusiasm compensates for {possessive} limited resources, often saying 'it almost worked last time' with genuine optimism"
    ],
    standard: [
      "{Pronoun} maintains a functional workspace where practical knowledge trumps fancy equipment, brewing reliable potions with consistent results",
      "{Possessive} approach balances book learning with hands-on experience, comfortable explaining both the how and why of {possessive} craft", 
      "{Pronoun} keeps detailed notes in well-worn journals, treating {possessive} craft seriously while remaining approachable to customers",
      "The scent of herbs and simmering broths creates a working atmosphere where quality matters more than presentation",
      "{Pronoun} demonstrates {possessive} wares confidently, with the practiced ease of someone who knows {possessive} recipes work"
    ]
  },
  "blacksmith": {
    refined: [
      "{Pronoun} moves with economy and precision, {possessive} workspace organized like a military operation where every tool has its place",
      "The rhythmic ring of hammer on anvil follows measured patterns, each strike deliberate and calculated for maximum effect",
      "{Pronoun} discusses metallurgy and heat treatment with the vocabulary of formal training, wearing leather aprons that show care rather than just use",
      "{Possessive} forge burns at perfectly controlled temperatures while {pronoun} explains the properties of different alloys with scholarly authority",
      "Even {possessive} casual demonstrations reveal decades of mastery, transforming raw metal into art with seemingly effortless skill"
    ],
    humble: [
      "Sweat and soot mark {possessive} clothes and skin, while the forge radiates heat that makes conversation brief but heartfelt",
      "{Pronoun} works with salvaged tools and improvised techniques, making up for limited resources with determination and creative problem-solving",
      "The constant hammering echoes {possessive} relentless work ethic, often pausing mid-conversation to tend the forge before it cools",
      "{Possessive} rough hands show the cost of {possessive} trade, while {pronoun} apologizes for the noise and heat with genuine concern for customer comfort",
      "{Pronoun} takes pride in honest work, even when the results are functional rather than beautiful, focusing on durability over decoration"
    ],
    standard: [
      "The steady rhythm of {possessive} work creates a dependable atmosphere where skill meets practical experience in comfortable partnership",
      "{Pronoun} balances traditional techniques with personal innovations, confident in {possessive} methods while remaining open to new ideas",
      "Heat radiates from the working forge while {pronoun} discusses projects with the easy authority of someone who knows {possessive} craft",
      "{Possessive} workspace shows the organized chaos of active production, where everything serves a purpose in the larger workflow",
      "{Pronoun} demonstrates techniques with practiced confidence, explaining {possessive} process while working with smooth, economical movements"
    ]
  },
  "general store": {
    refined: [
      "{Pronoun} glides between displays with graceful efficiency, knowing exactly where everything is located and maintaining pristine organization",
      "{Possessive} customer service feels polished and professional, treating each transaction as an opportunity to exceed expectations",
      "The store reflects {possessive} attention to detail, from perfectly aligned merchandise to meticulously maintained inventory records",
      "{Pronoun} discusses products with encyclopedic knowledge, able to recommend exactly what customers need while suggesting complementary items",
      "Every interaction demonstrates {possessive} commitment to quality, from the careful wrapping of purchases to {possessive} follow-up questions about satisfaction"
    ],
    humble: [
      "{Pronoun} navigates between precariously stacked merchandise and overflowing shelves, apologizing for the clutter while searching for requested items",
      "{Possessive} enthusiasm for helping customers often exceeds {possessive} organizational systems, relying on memory and experience to locate inventory",
      "The cramped space forces creative storage solutions, while {pronoun} chats apologetically about items that might be 'somewhere in the back'",
      "{Pronoun} stretches every copper piece, offering alternatives when preferred items aren't available and genuinely caring about customer needs",
      "{Possessive} knowledge comes from practical necessity rather than formal training, but {possessive} advice proves surprisingly reliable"
    ],
    standard: [
      "{Pronoun} maintains a well-organized system that serves the community reliably, knowing {possessive} regular customers' preferences and needs",
      "The store reflects {possessive} experience in practical efficiency; {pronoun} knows where everything is located with ease and can easily recall pricing without looking it up",
      "{Pronoun} balances business sense with personal service, offering fair prices while building relationships with repeat customers",
      "{Possessive} recommendations come from experience and observation, understanding both {possessive} inventory and {possessive} customers' circumstances",
      "{Possessive} atmosphere suggests competent management and community focus, where commerce and conversation happen in comfortable partnership"
    ]
  },
  "mystic goods": {
    refined: [
      "{Pronoun} moves through {possessive} shop with ceremonial grace, {possessive} gestures seeming to channel the mystical energies that permeate the space",
      "{Possessive} knowledge spans ancient traditions and modern applications, discussing magical theory with academic precision and reverent respect",
      "The air around {pronoun} shimmers faintly with residual magic while {pronoun} handles artifacts with the solemnity of religious observance",
      "{Pronoun} speaks in measured cadences about the deeper meanings behind {possessive} wares, treating each sale as a sacred trust between practitioner and client",
      "{Possessive} expertise extends beyond mere commerce into genuine mystical counsel, offering wisdom alongside {possessive} carefully curated inventory"
    ],
    humble: [
      "{Pronoun} fumbles occasionally with unstable magical items, apologizing when sparks fly or unexpected effects manifest during demonstrations",
      "{Possessive} shop runs on charm, chaos, and just enough magic to make you wonder if {pronoun} actually knows what {pronoun}'s doing",
      "Candle wax and chalk dust mark {possessive} clothes while {pronoun} rearranges protective circles and mutters incantations under {possessive} breath",
      "{Pronoun} treats customers like fellow seekers on the mystical path, sharing stories of magical mishaps with self-deprecating humor",
      "{Possessive} shop buzzes with uncontrolled energy while {pronoun} explains that most items 'work better for some people than others'"
    ],
    standard: [
      "{Pronoun} demonstrates a practical understanding of magical principles, balancing mystical knowledge with down-to-earth customer service",
      "The air tingles with controlled magical energy while {pronoun} discusses applications and proper usage with confident expertise",
      "{Pronoun} treats magic as both art and craft, respecting its power while making it accessible to customers of varying experience levels",
      "{Possessive} workspace shows the organized efficiency of someone who understands both the mystical and mundane aspects of {possessive} trade",
      "{Pronoun} offers guidance alongside {possessive} goods, helping customers choose items that match their intentions and skill levels"
    ]
  },
  "exotic goods": {
    refined: [
      "{Pronoun} moves between displays like a curator in a private museum, explaining the cultural significance and proper applications of each piece",
      "{Possessive} knowledge spans continents and cultures, discussing trade routes and origin stories with the authority of a seasoned explorer",
      "{Pronoun} handles each item with reverent care, understanding both its practical value and its deeper meaning within its culture of origin",
      "The stories {pronoun} tells transport customers to distant lands, while {possessive} expertise helps navigate the complexities of foreign customs and uses",
      "{Possessive} collection reflects years of careful curation, where every piece has been selected for quality and authentic cultural significance"
    ],
    humble: [
      "{Pronoun} sorts through mixed collections with infectious enthusiasm, often discovering forgotten treasures while searching for customer requests",
      "{Possessive} stories blend secondhand accounts with genuine wonder, admitting when {pronoun}'s not entirely sure of an item's origin or purpose",
      "The cramped space overflows with mysteries from distant lands, while {pronoun} rummages through shipping crates still bearing foreign labels",
      "{Pronoun} relies on intuition and customer curiosity rather than formal expertise, encouraging buyers to experiment and discover for themselves",
      "{Possessive} prices reflect acquisition costs rather than scholarly assessment, often underselling valuable pieces due to incomplete knowledge"
    ],
    standard: [
      "{Pronoun} maintains an organized system that showcases the diversity of {possessive} collection while helping customers navigate unfamiliar territories",
      "{Possessive} knowledge comes from experience and networking with traders, offering reliable information about practical applications and cultural context",
      "{Pronoun} reflects a balance between wonder and reverence for their wares, as they handle delicate items that have traveled",
      "{Pronoun} connects customers with the wares they seek based on genuine understanding of both foreign cultures and local needs",
      "{Possessive} recommendations blend cultural respect with practical considerations, helping customers use exotic goods appropriately and effectively"
    ]
  },
  "jeweler": {
    refined: [
      "{Pronoun} handles precious stones with the delicate precision of a surgeon, explaining cut, clarity, and setting techniques with technical expertise",
      "{Possessive} workspace gleams under specialized lighting that reveals every facet and flaw, while {pronoun} discusses the metaphysical properties of different gems",
      "{Pronoun} moves with practiced grace around delicate displays, {possessive} knowledge spanning both the technical and artistic aspects of {possessive} craft",
      "Each piece receives individual attention as {pronoun} explains provenance, craftsmanship techniques, and proper care with scholarly thoroughness",
      "{Possessive} consultation style transforms shopping into education, helping customers understand the lasting value and significance of fine jewelry"
    ],
    humble: [
      "{Pronoun} works at a cluttered bench where half-finished repairs mingle with simple settings, apologizing for the modest presentation of {possessive} skills",
      "{Possessive} enthusiasm for beautiful stones outweighs {possessive} formal training, relying on intuition and natural taste rather than gemological certification",
      "{Pronoun} handles pieces with reverent care despite {possessive} simple tools, discussing beauty and personal meaning rather than investment potential",
      "The workspace shows honest craftsmanship over expensive equipment, where skill compensates for limited resources and formal training",
      "{Pronoun} focuses on emotional significance rather than monetary value, helping customers find pieces that speak to the heart rather than the purse"
    ],
    standard: [
      "{Pronoun} balances technical knowledge with aesthetic sense, discussing both the practical and beautiful aspects of {possessive} carefully selected inventory",
      "{Possessive} workspace reflects organized professionalism where quality tools serve skilled hands in creating both simple and complex pieces",
      "{Pronoun} demonstrates techniques with confident competence, explaining {possessive} process while working with economical precision and practiced ease",
      "The shop showcases a range that serves both everyday needs and special occasions, with prices that reflect fair value rather than luxury markup",
      "{Possessive} recommendations consider both budget and occasion, helping customers find pieces that offer the best combination of beauty and value"
    ]
  }
};

const getShopRefinement = (priceModifier: number): "refined" | "standard" | "humble" => {
  if (priceModifier > 0.15) return "refined";
  if (priceModifier < -0.15) return "humble";
  return "standard";
};


  // Modified generateShopkeeperDescription to return both final description and template

  const generateShopkeeperDescriptionWithTemplate = (shopkeeper, priceModifier) => {
  const refinement = getShopRefinement(priceModifier);
  const normalizedShopType = shopkeeper.shopType.toLowerCase();
  
  // Get introduction based on shop type and refinement
  const introOptions = shopkeeperIntroductions[normalizedShopType]?.[refinement] || 
                      shopkeeperIntroductions["general store"][refinement];
  
  const introduction = introOptions[Math.floor(Math.random() * introOptions.length)];
  
  // Get behavior
  const behaviorOptions = shopkeeperBehaviors[normalizedShopType]?.[refinement] || 
                         shopkeeperBehaviors["general store"][refinement];
  const behavior = behaviorOptions[Math.floor(Math.random() * behaviorOptions.length)];

  // Create template with placeholders intact
  const template = `${introduction} ${behavior}.`;
  
  // Create final description with actual values
  const finalDescription = applyNameAndPronouns(template, shopkeeper.name, shopkeeper.race);

  return {
    finalDescription,
    template
  };
};

// Pronoun detection

// New function to apply name and pronouns to a description template
const applyNameAndPronouns = (template: string, name: string, race: string) => {
  const firstName = name.split(' ')[0];
  const pronouns = getShopkeeperPronouns(name);
  
  return template
    .replace(/\{name\}/g, firstName)
    .replace(/\{object\}/g, pronouns.object)
    .replace(/\{Pronoun\}/g, pronouns.pronoun.charAt(0).toUpperCase() + pronouns.pronoun.slice(1))
    .replace(/\{Possessive\}/g, pronouns.possessive.charAt(0).toUpperCase() + pronouns.possessive.slice(1))
    .replace(/\{pronoun\}/g, pronouns.pronoun)
    .replace(/\{possessive\}/g, pronouns.possessive)
    .replace(/\{reflexive\}/g, pronouns.reflexive)
    .replace(/\{genderNoun\}/g, pronouns.genderNoun);
};

const femaleNames = ['Alaia', 'Amara', 'Amina', 'Amira', 'Anika', 'Anouk', 'Astrid', 'Ayo', 'Aziza', 'Carmen', 'Dara', 'Elske', 'Esi', 'Fatima', 'Fatou', 'Freja', 'Hadiya', 'Hei', 'Imani', 'Ines', 'Ingrid', 'Jasmine', 'Kaja', 'Layla', 'Leilani', 'Lian', 'Liv', 'Lucia', 'Maartje', 'Maren', 'Marisol', 'Matthijs', 'Mina', 'Nadia', 'Naomi', 'Nia', 'Noa', 'Noor', 'Rina', 'Roos', 'Soraya', 'Stellan', 'Suki', 'Yasmin', 'Zahra', 'Zara', 'Thraina', 'Sigrid', 'Halga', 'Durra', 'Thora', 'Gudrun', 'Eluna', 'Sylmae', 'Ishara', 'Lirael', 'Zireen', 'Nyrieth', 'Arenya', 'Tilda', 'Merrin', 'Posy', 'Fenna', 'Hattie', 'Minta', 'Reni', 'Tinka', 'Zinki', 'Miri', 'Frayla', 'Jixi', 'Zuzu', 'Mira', 'Saela', 'Nyra', 'Isryn', 'Zeva', 'Orielle', 'Thoka', 'Zarra', 'Umma', 'Ketha', 'Hasska', 'Mazra', 'Sukka', 'Ashira', 'Azia', 'Neriseth', 'Kaiva', 'Velkira', 'Nyzora', 'Miraxi', 'Yureth'];

// Shared pronoun logic using the same female names list
const getShopkeeperPronouns = (shopkeeperName) => {
  const firstName = shopkeeperName.split(' ')[0];
  const isFemale = femaleNames.includes(firstName); // Now references the top-level array
  return {
    possessive: isFemale ? 'her' : 'his',
    pronoun: isFemale ? 'she' : 'he',
    object: isFemale ? 'her' : 'him',
    reflexive: isFemale ? 'herself' : 'himself',
    genderNoun: isFemale ? 'woman' : 'man'
  };
};

// Shopkeeper description


const generateShopkeeperDescription = (shopkeeper, priceModifier) => {
  const refinement = getShopRefinement(priceModifier);
  const normalizedShopType = shopkeeper.shopType.toLowerCase();
  
  // Determine gender and pronouns
  const firstName = shopkeeper.name.split(' ')[0];
  const isFemale = femaleNames.includes(firstName);
  const pronouns = {
    pronoun: isFemale ? 'she' : 'he',
    object: isFemale ? 'her' : 'him',
    possessive: isFemale ? 'her' : 'his',
    reflexive: isFemale ? 'herself' : 'himself',
    genderNoun: isFemale ? 'woman' : 'man'
  };


  // Get introduction based on shop type and refinement
  const introOptions = shopkeeperIntroductions[normalizedShopType]?.[refinement] || 
   shopkeeperIntroductions["general store"][refinement];
  
  let introduction = introOptions[Math.floor(Math.random() * introOptions.length)];
  
  // Replace placeholders with actual values
  introduction = introduction.replace(/\{name\}/g, firstName)
    .replace(/\{object\}/g, pronouns.object)
    .replace(/\{pronoun\}/g, pronouns.pronoun)
    .replace(/\{possessive\}/g, pronouns.possessive)
    .replace(/\{reflexive\}/g, pronouns.reflexive)
    .replace(/\{genderNoun\}/g, pronouns.genderNoun);

  // Get behavior (keeping your existing system)
  const behaviorOptions = shopkeeperBehaviors[normalizedShopType]?.[refinement] || 
    shopkeeperBehaviors["general store"][refinement];
  let behavior = behaviorOptions[Math.floor(Math.random() * behaviorOptions.length)];

  // Apply pronoun replacements to behavior (keeping your existing logic)
  behavior = behavior.replace(/\{name\}/g, firstName)
  .replace(/\{object\}/g, pronouns.object)
  .replace(/\{Pronoun\}/g, pronouns.pronoun.charAt(0).toUpperCase() + pronouns.pronoun.slice(1))
  .replace(/\{Possessive\}/g, pronouns.possessive.charAt(0).toUpperCase() + pronouns.possessive.slice(1))
  .replace(/\{pronoun\}/g, pronouns.pronoun)
  .replace(/\{possessive\}/g, pronouns.possessive)
  .replace(/\{reflexive\}/g, pronouns.reflexive)
  .replace(/\{genderNoun\}/g, pronouns.genderNoun);

  return `${introduction} ${behavior}.`;
};

function ShopkeeperGenerator() {
  const [shopkeeper, setShopkeeper] = useState(null);
  const [shopType, setShopType] = useState('');
  const [settlementSize, setSettlementSize] = useState('');
  const [fadeCommon, setFadeCommon] = useState(false);
  const [fadeRare, setFadeRare] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRaceDropdownOpen, setIsRaceDropdownOpen] = useState(false);
  const [isSettlementDropdownOpen, setIsSettlementDropdownOpen] = useState(false);
  const [isShopTypeDropdownOpen, setIsShopTypeDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('any');
  const [inventorySort, setInventorySort] = useState('alpha');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const getCurrentPricingText = () => {
    // Handle case where selectedPricingStyle is still 'random' or invalid
    if (selectedPricingStyle === 'random') return 'Standard';
    
    const index = parseInt(selectedPricingStyle);
    if (isNaN(index) || index < 0 || index >= pricingStyles.length) {
      return 'Standard'; // Fallback for invalid indices
    }
    
    const style = pricingStyles[index];
    if (!style) return 'Standard'; // Extra safety check
    
    return style.modifier > 0
      ? `${Math.abs(style.modifier * 100).toFixed(0)}% Above`
      : style.modifier < 0
      ? `${Math.abs(style.modifier * 100).toFixed(0)}% Below`
      : 'Standard';
  };
  
// Combine and filter inventory
const getCombinedInventory = () => {
  if (!shopkeeper) return [];
  
  const combined = [
    ...shopkeeper.commonItems.map(item => ({ ...item, type: 'common' })),
    ...shopkeeper.rareItems.map(item => ({ ...item, type: 'rare' }))
  ];
  
  // Filter by category
  const filtered = selectedCategory === 'any' 
    ? combined 
    : combined.filter(item => {
        const categoryInfo = getCategoryForItem(item.name);
        return categoryInfo.category === selectedCategory;
      });
  
  // Sort the filtered results
  return sortItems(filtered, inventorySort);
};

// Get unique categories from current inventory
const getAvailableCategories = (): string[] => {
  if (!shopkeeper) return [];
  
  const combined = [
    ...shopkeeper.commonItems,
    ...shopkeeper.rareItems
  ];
  
  const categories = new Set<string>();
  combined.forEach(item => {
    const categoryInfo = getCategoryForItem(item.name);
    categories.add(categoryInfo.category);
  });
  
  return Array.from(categories).sort();
};

const regenerateDescriptionForPricing = (newPriceModifier) => {
  const descriptionData = generateShopkeeperDescriptionWithTemplate({
    name: shopkeeper.name,
    race: shopkeeper.race,
    shopType: shopkeeper.shopType
  }, newPriceModifier);
  
  return {
    description: descriptionData.finalDescription,
    descriptionTemplate: descriptionData.template
  };
};

  // Data for random generation

    // Names
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

  
  // Shopkeeper description details
  
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
  'Alchemist': FlaskIcon,
  'Mystic Goods': "wand_stars",
  'Exotic Goods': "festival",
  'Jeweler': "diamond"
};

// Shopkeeper titles by refinement and trade
const shopkeeperTitles = {
  refined: {
    'General Store': ['Master Merchant', 'Grand Trader', 'Purveyor Royal'],
    'Blacksmith': ['Grandmaster', 'Master Smith', 'Forgemaster'],
    'Alchemist': ['Master Alchemist', 'Arcane Brewmaster', 'Grand Artificer'],
    'Mystic Goods': ['Arcane Master', 'High Mystic', 'Grand Enchanter'],
    'Exotic Goods': ['Master Trader', 'Grand Collector', 'Royal Purveyor'],
    'Jeweler': ['Master Jeweler', 'Grandmaster Cutter', 'Royal Gemsmith']
  },
  standard: {
    'General Store': ['Trader', 'Merchant', 'Shopkeep'],
    'Blacksmith': ['Smith', 'Craftsman', 'Forger'],
    'Alchemist': ['Alchemist', 'Brewmaster', 'Artificer'],
    'Mystic Goods': ['Mystic', 'Enchanter', 'Curator'],
    'Exotic Goods': ['Trader', 'Collector', 'Purveyor'],
    'Jeweler': ['Jeweler', 'Gemcutter', 'Craftsman']
  },
  humble: {
    'General Store': ['Old', 'Young', 'Honest'],
    'Blacksmith': ['Old', 'Steady', 'Reliable'],
    'Alchemist': ['Old', 'Wise', 'Humble'],
    'Mystic Goods': ['Old', 'Wandering', 'Humble'],
    'Exotic Goods': ['Old', 'Traveling', 'Wandering'],
    'Jeweler': ['Old', 'Patient', 'Careful']
  }
};

// Settlement descriptors
const settlementDescriptors = {
  village: ['Village', 'Hamlet', 'Glen', 'Crossing', 'Vale'],
  town: ['Market', 'Town', 'Borough', 'Square', 'Fair'],
  city: ['Grand', 'High', 'Royal', 'Great', 'Imperial']
};

// Race-influenced naming styles
const raceNamingStyles = {
  'Dwarf': ['Clan', 'Hall', '& Sons', 'Hold', 'Keep'],
  'Elf': ['Court', 'Grove', 'House', 'Glade', 'Sanctuary'],
  'Halfling': ['Hearth', 'Hill', 'Garden', 'Home', 'Burrow'],
  'Human': ['House', 'Hall', 'Works', '& Co.', 'Workshop'],
  'Gnome': ['Workshop', 'Tinker', 'Works', 'Lab', 'Study'],
  'Half-Elf': ['House', 'Grove', 'Workshop', 'Studio', 'Gallery'],
  'Half-Orc': ['Hold', 'Works', 'Shop', 'Hall', 'Forge'],
  'Tiefling': ['House', 'Sanctum', 'Workshop', 'Studio', 'Haven'],
  'Dragonborn': ['Hall', 'House', 'Hold', 'Sanctum', 'Workshop']
};

// Shop-specific adjectives that match each trade's personality
const shopAdjectives = {
  'General Store': ['Lucky', 'Wandering', 'Busy', 'Corner', 'Village', 'Crossroads', 'Humble', 'Friendly', 'Reliable', 'Honest'],
  'Blacksmith': ['Blazing', 'Molten', 'Forged', 'Tempered', 'Hardened', 'Iron', 'Steel', 'Crimson', 'Burning', 'Thunder'],
  'Alchemist': ['Bubbling', 'Mystic', 'Experimental', 'Precise', 'Volatile', 'Arcane', 'Brewing', 'Whispering', 'Smoking', 'Curious'],
  'Mystic Goods': ['Veiled', 'Ethereal', 'Whispered', 'Enigmatic', 'Hidden', 'Ancient', 'Celestial', 'Shadowed', 'Luminous', 'Sacred'],
  'Exotic Goods': ['Wandering', 'Distant', 'Foreign', 'Rare', 'Curious', 'Traveling', 'Global', 'Mysterious', 'Far-flung', 'Nomad'],
  'Jeweler': ['Brilliant', 'Polished', 'Faceted', 'Lustrous', 'Gleaming', 'Radiant', 'Precious', 'Sparkling', 'Golden', 'Silver']
};

// Expanded nouns with more variety per shop type
const shopNouns = {
  'General Store': ['Trading Post', 'Goods', 'Market', 'Supplies', 'Wares', 'Bazaar', 'Emporium', 'Outfitter', 'Mercantile', 'Provisions'],
  'Blacksmith': ['Forge', 'Anvil', 'Hammer', 'Blade', 'Steel', 'Iron', 'Weapon', 'Smithy', 'Ironworks', 'Foundry'],
  'Alchemist': ['Potion', 'Brew', 'Elixir', 'Concoctions', 'Vial', 'Mixture', 'Philter', 'Experiments', 'Apothecary', 'Distillery'],
  'Mystic Goods': ['Curio', 'Wonder', 'Arcanum', 'Glyph', 'Rune', 'Enchantment', 'Sigil', 'Spellwork', 'Charm', 'Binding', 'Sanctum', 'Oracle'],
  'Exotic Goods': ['Oddities', 'Curiosities', 'Wonder', 'Rarities', 'Import', 'Goods', 'Treasure', 'Magnificent', 'Bazaar', 'Gallery'],
  'Jeweler': ['Gem', 'Jewel', 'Ring', 'Crown', 'Gold', 'Bauble', 'Ornament', 'Boutique', 'Atelier', 'Collection']
};

// Multiple naming patterns for variety
const namingPatterns = {
  'General Store': [
    'The {adjective} {noun}',
    '{adjective} {noun}',
    'The {noun} & More',
    '{adjective} {noun} Co.',
    'The {adjective} Merchant',
    '{firstName}\'s {noun}',
    'The {settlement} {noun}',
    '{firstName}\'s {race_style}'
  ],
  'Blacksmith': [
    'The {adjective} {noun}',
    '{adjective} {noun}',
    '{adjective} {noun} Works',
    'The {noun} & Hammer',
    '{adjective} Smithy',
    '{firstName}\'s {noun}',
    '{title} {firstName}\'s Forge',
    '{firstName}\'s {race_style}'
  ],
  'Alchemist': [
    'The {adjective} {noun}',
    '{adjective} {noun}',
    'The {adjective} Alchemist',
    '{adjective} {noun} & Co.',
    'The {noun} Laboratory',
    '{firstName}\'s {noun}',
    '{title} {firstName}\'s Workshop',
    'The {settlement} {noun}'
  ],
  'Mystic Goods': [
    'The {adjective} {noun}',
    '{adjective} {noun}',
    'The {noun} Sanctum',
    '{adjective} Mysteries',
    'The {adjective} Circle',
    '{firstName}\'s {noun}',
    'The {settlement} {noun}',
    '{firstName}\'s {race_style}'
  ],
  'Exotic Goods': [
    'The {adjective} {noun}',
    '{adjective} {noun}',
    'The {adjective} Trader',
    '{adjective} {noun} Trading',
    'The {noun} Caravan',
    '{firstName}\'s {noun}',
    'The {settlement} {noun}',
    '{firstName}\'s {race_style}'
  ],
  'Jeweler': [
    'The {adjective} {noun}',
    '{adjective} {noun}',
    'The {adjective} Jeweler',
    '{adjective} {noun} Boutique',
    'The {noun} Gallery',
    '{firstName}\'s {noun}',
    '{title} {firstName}\'s Studio',
    'The {settlement} {noun}'
  ]
};

// Function to generate shop name based on shop type
const generateShopName = (shopType, shopkeeperName, shopkeeperRace, settlementSize, priceModifier) => {
  const normalizedShopType = shopType;
  const refinement = getShopRefinement(priceModifier);
  const firstName = shopkeeperName ? shopkeeperName.split(' ')[0] : '';
  
  // Get shop-specific adjectives and nouns
  const adjectives = shopAdjectives[normalizedShopType] || shopAdjectives['General Store'];
  const nouns = shopNouns[normalizedShopType] || shopNouns['General Store'];
  const patterns = namingPatterns[normalizedShopType] || namingPatterns['General Store'];
  
  // Get new elements
  const titles = shopkeeperTitles[refinement][normalizedShopType] || shopkeeperTitles[refinement]['General Store'];
  const settlements = settlementDescriptors[settlementSize] || settlementDescriptors['town'];
  const raceStyles = raceNamingStyles[shopkeeperRace] || raceNamingStyles['Human'];
  
  // Randomly select components
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const title = titles[Math.floor(Math.random() * titles.length)];
  const settlement = settlements[Math.floor(Math.random() * settlements.length)];
  const raceStyle = raceStyles[Math.floor(Math.random() * raceStyles.length)];
  const pattern = patterns[Math.floor(Math.random() * patterns.length)];
  
  // Replace placeholders in the selected pattern
  const shopName = pattern
    .replace('{adjective}', adjective)
    .replace('{noun}', noun)
    .replace('{firstName}', firstName)
    .replace('{title}', title)
    .replace('{settlement}', settlement)
    .replace('{race_style}', raceStyle);
  
  return shopName;
};
  

 // Shop Item Database

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
    { name: 'Arcane Focus', price: '20 gp', level: 'Common', details: 'Special object designed to channel arcane magic. Replaces material components without cost.' },
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
    { name: 'Spellbook (blank)', price: '50 gp', level: 'Common', details: 'Special book with 100 pages of parchment treated to receive magical inscriptions. Required by wizards.' },
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

// Enhanced Motto logic with personality and refinement system integration
const shopkeeperMottos = {
  "alchemist": {
    refined: [
      "My family's formulas have graced royal courts for three generations. Precision demands proper compensation.",
      "The Academy taught me that true mastery requires the finest ingredients, and excellence has its price.",
      "Each potion carries fifty years of accumulated knowledge. Quality like this isn't found in back-alley brewshops.",
      "I've turned alchemy into an exact science. My results speak for themselves, as do my prices."
    ],
    humble: [
      "My grandmother's recipes, my innovations, your problems solved through three generations of brewing wisdom.",
      "Every potion tells a story. Most end happily. Some... well, that's why I keep antidotes handy.",
      "Started mixing remedies during the last featherlung plague in Faerun. Haven't lost a customer to poor brewing since.",
      "They say I'm half-mad, but my potions work. Besides, who trusts a completely sane alchemist?"
    ],
    standard: [
      "Thirty years of happy accidents and careful measurements. Sometimes I surprise even myself.",
      "Survived drinking my own experiments for fifteen years. That should tell you something about the quality.",
      "Good alchemy takes time and care. I charge fairly for products that actually works.",
      "Been brewing since before the war. My customers trust me because my potions do what they promise."
    ]
  },

  "blacksmith": {
    refined: [
      "Been forging since before you were born. Good metal's worth every copper, and mine's the finest.",
      "My father's hammer, my grandfather's anvil, my reputation. Excellence costs what it costs.",
      "Saved three kings with my blades. You think quality like this comes cheap?",
      "This isn't some run of the mill smithy. You're paying for mastery that took decades to perfect."
    ],
    humble: [
      "Good work shouldn't break the bank. Learned that from my mentor, rest his soul.",
      "My old da always said: 'Fair prices forge loyal customers.'",
      "Been blessed with steady hands and a generous heart. Both show in my work.",
      "Started with nothing but a dream and a rusty hammer. Never forgot where I came from."
    ],
    standard: [
      "Honest steel, honest prices, honest work. Been serving this community for twenty years.",
      "My forge runs hot and my prices stay fair. That's how you build a reputation.",
      "Every piece tells a story. Most end with satisfied customers and repeat business.",
      "The metal speaks to those who listen. I just help it find its proper shape."
    ]
  },

  "general store": {
    refined: [
      "Four generations of curated excellence. We don't just stock items, we guarantee quality.",
      "My establishment serves only the finest adventurers with the finest goods. Standards matter.",
      "Started small, but success has its privileges. Premium service commands premium prices.",
      "Every item personally selected for quality and utility. You're paying for expertise, not just goods."
    ],
    humble: [
      "Started with three copper and a wheelbarrow. Never forgot what it's like to count every coin.",
      "My late partner always said 'happy customers return, angry ones spread rumors.' I price accordingly.",
      "Been the backbone of this community through feast and famine. We all look out for each other.",
      "If you need it, I probably have it. If I don't, I'll find it at a price that won't break you."
    ],
    standard: [
      "Four generations serving adventurers. If we don't stock it, you won't need it underground.",
      "Watched the youngins become heroes in my shop. Proper gear makes all the difference, trust me.",
      "Survived two wars and three economic crashes by knowing what people actually need.",
      "Honest prices, honest goods, honest dealing. It's kept us in business all these years."
    ]
  },

  "mystic goods": {
    refined: [
      "True magic demands true sacrifice. Usually in the form of appropriate compensation.",
      "The arcane arts chose me young. Decades of mastery deserve proper recognition.",
      "You're not just buying trinkets, you're buying knowledge that took a lifetime to accumulate.",
      "Cheap magic is dangerous magic. I prefer my customers successful and whole."
    ],
    humble: [
      "Magic should serve everyone, not just the wealthy. Knowledge brings prosperity to all.",
      "The spirits whisper that knowledge shared is knowledge doubled.",
      "My coven taught me generosity brings more power than greed ever could.",
      "Been cursed with good fortune and a soft heart. Both tend to show in my prices."
    ],
    standard: [
      "The mystical path requires balance. In power, in wisdom, and in fair exchange.",
      "Magic items choose their owners. I just make sure the price matches the destiny.",
      "Thirty years walking between worlds has taught me the value of honest dealing.",
      "Each enchantment carries part of my essence. I price them to honor that sacrifice."
    ]
  },

  "jeweler": {
    refined: [
      "Each piece represents generations of mastery. True artistry commands its proper worth.",
      "I create heirlooms, not trinkets. The finest gems deserve the finest settings and prices.",
      "Apprenticed under the royal jeweler. Excellence learned in palaces doesn't come cheaply.",
      "My reputation precedes me, as do my standards. Quality gems, quality work, quality prices."
    ],
    humble: [
      "Cut my first gem at twelve, lost my first fortune at twenty, learned humility by thirty.",
      "Every stone has a soul. I just help them find their perfect setting and owner.",
      "Been making engagement rings since before your parents met. Love shouldn't bankrupt anyone.",
      "Started with nothing but steady hands and a good eye. Haven't forgotten my roots."
    ],
    standard: [
      "Each piece carries a blessing from my homeland. Old traditions in new settings.",
      "My great-uncle was a dragon's hoardmaster. Learned to spot quality from the best teacher.",
      "Fair prices for beautiful work. Simple as that, complicated as everything else.",
      "Gems are patient. They wait centuries for the right moment, the right person, the right price."
    ]
  },

  "exotic goods": {
    refined: [
      "My collection represents the finest treasures from the most exclusive sources across all the lands.",
      "Each item comes with provenance and guarantee. Authenticity and rarity command premium prices.",
      "Decades of cultivating relationships with nobles, scholars, and merchant princes. Access costs.",
      "These aren't mere curiosities. They're pieces of history, priced for the discerning collector."
    ],
    humble: [
      "Lost my ship but kept my collection. Sometimes the best treasures wash up on unexpected shores.",
      "Been places that don't exist on maps and brought back proof. Stories included at no extra charge.",
      "Every item has a story. Some beautiful, some terrible, all true. Which calls to you?",
      "Traded with pirates, thieves, and everyone in between. Good stuff doesn't always come from good places."
    ],
    standard: [
      "Sailed seven seas, walked five continents, collected wonders you've only heard in tavern tales.",
      "My caravan days ended when I found this place. Sometimes the greatest journey is staying still.",
      "Each piece earned through adventure, negotiation, or lucky accident. The price reflects the journey.",
      "Foreign lands, foreign customs, fair prices. That's been my motto for thirty trading years."
    ]
  }
};

const generateMotto = (shopTypeValue: string, priceModifier: number) => {
  const choose = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  const refinement = getShopRefinement(priceModifier);
  const normalizedShopType = shopTypeValue.toLowerCase();
  
  // Get mottos based on shop type and refinement
  const mottoOptions = shopkeeperMottos[normalizedShopType]?.[refinement] || 
                      shopkeeperMottos["general store"][refinement];
  
  return choose(mottoOptions);
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

// Helper function to replace refinement titles in shop names
const replaceRefinementTitle = (shopName, shopType, newPriceModifier) => {
  const newRefinement = getShopRefinement(newPriceModifier);
  const newTitles = shopkeeperTitles[newRefinement][shopType] || shopkeeperTitles[newRefinement]['General Store'];
  
// Collect ALL possible titles from all refinement levels
const allTitles: string[] = [];
['refined', 'standard', 'humble'].forEach(refinementLevel => {
  const titles = shopkeeperTitles[refinementLevel]?.[shopType] || shopkeeperTitles[refinementLevel]?.['General Store'];
  if (titles && Array.isArray(titles)) {
    allTitles.push(...titles);
  }
});
  
  // Sort titles by length (longest first) to handle overlapping titles like "Grand Master" vs "Master"
  allTitles.sort((a, b) => b.length - a.length);
  
  let updatedName = shopName;
  let titleReplaced = false;
  
  // Remove the first title found (longest match first)
  for (const oldTitle of allTitles) {
    if (updatedName.includes(oldTitle)) {
      // Remove the old title
      updatedName = updatedName.replace(oldTitle, '').trim();
      
      // Clean up any double spaces
      updatedName = updatedName.replace(/\s+/g, ' ');
      
      titleReplaced = true;
      break; // Only replace ONE title to avoid cascading
    }
  }
  
  // If we replaced a title, add the new one in the same position
  if (titleReplaced) {
    const newTitle = newTitles[Math.floor(Math.random() * newTitles.length)];
    
    // Try to determine where to place the new title
    // If the name starts with "The", place title after "The"
    if (updatedName.startsWith('The ')) {
      updatedName = `The ${newTitle} ${updatedName.substring(4)}`;
    } else {
      // Otherwise, place title at the beginning
      updatedName = `${newTitle} ${updatedName}`;
    }
    
    // Clean up any double spaces again
    updatedName = updatedName.replace(/\s+/g, ' ').trim();
  }
  
  return updatedName;
};

// Helper function to check if shop name contains refinement-specific elements
const hasRefinementElements = (shopName, shopType) => {
  const allTitles = [
    ...(shopkeeperTitles.refined[shopType] || []),
    ...(shopkeeperTitles.standard[shopType] || []),
    ...(shopkeeperTitles.humble[shopType] || [])
  ];
  
  return allTitles.some(title => shopName.includes(title));
};

// Pricing modifier dropdown logic
const [selectedPricingStyle, setSelectedPricingStyle] = useState('random');

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
      'copper shield', 'bronze shield', 'iron shield', 'steel shield', 'silver shield', 'adamantine shield', 'mithral shield', 
      'dragonscale shield', 'shield (+1)', 'helmet'
    ]
  },
  
  'adventuring_gear': {
    icon: 'camping',
    name: 'Adventuring Gear',
    items: [
      'bedroll', 'rope (50 ft)', 'rope of climbing', 'grappling hook',
      'climber\'s kit', 'dungeoneer\'s pack', 'explorer\'s pack', 'mess kit', 'waterskin', 
      'hunting trap', 'caltrops (bag of 20)', 'ball bearings (bag of 1,000)', 'pitons (10)', 'iron spikes (10)',
      'pole (10-foot)', 'chain (10 feet)', 'manacles', 'mirror', 'folding boat', 'handy haversack', 'herbalism kit',
      'breathing tube', 'saddle'
    ]
  },
  
  'tools': {
    icon: 'handyman',
    name: 'Tools',
    items: [
      'thieves\' tools', 'poisoner\'s kit', 'healer\'s kit', 'smith\'s tools', 'jeweler\'s tools',
      'carpenter\'s tools', 'leatherworker\'s tools', 'mason\'s tools', 'tinker\'s tools', 'weaver\'s tools', 
      'rune etching tools', 'hammer', 'crowbar', 'portable ram','lock'
    ]
  },
  
  'bags': {
    icon: BackpackIcon,
    name: 'Bags',
    items: [
      'backpack', 'masterwork backpack', 'waterproof satchel', 'bag of holding (minor)', 'saddlebags', 'component pouch', 'pouch'
    ]
  },

  'containers': {
    icon: 'home_repair_service',
    name: 'Containers',
    items: [
      'chest', 'scroll case', 
    ]
  },
  
  'potions_alchemy': {
    icon: FlaskIcon,
    name: 'Potions & Alchemy',
    items: [
      'potion of healing', 'greater healing potion', 'potion of superior healing',
      'potion of climbing', 'potion of animal friendship', 'fire breath potion', 'potion of flying', 'potion of invisibility',
      'acid vial', 'alchemist fire', 'antitoxin', 'basic poison', 'oil (flask)', 'oil of slipperiness',
      'smokestick', 'perfume', 'soap', 'holy water (flask)', 'alchemist\'s supplies', 'brewer\'s supplies',
    ]
  },
  
  'food_drink': {
    icon: 'restaurant',
    name: 'Food & Drink',
    items: [
      'rations (1 week)', 'rations (10 days)', 'wine (common)', 'wine (fine)', 'cook\'s utensils', 'ale (mug)', 
      'foreign liquor', 'foreign spices'
    ]
  },
  
  'light_sources': {
    icon: 'candle',
    name: 'Light Sources',
    items: [
      'torches (10)', 'lantern', 'lamp', 'candle', 'tinderbox', 'candle of the deep', 'driftglobe'
    ]
  },
  
  'books_scrolls': {
    icon: 'menu_book',
    name: 'Books & Scrolls',
    items: [
      'blank book', 'spellbook (blank)', 'book of lore', 'bestiary volume', 'religious text', 'enchanter\'s primer',
      'manual of health', 'tome of clear thought'
    ]
  },
  
  'writing_supplies': {
    icon: 'history_edu',
    name: 'Writing Supplies',
    items: [
      'quill', 'enchanted quill', 'ink pot', 'glowing ink', 'parchment sheets (10)', 'chalk (10 pieces)',
      'enchanted chalk', 'blank scroll', 'scroll of detect magic', 'detect magic scroll', 'scroll of mage armor', 
      'scroll of identify', 'identify scroll', 'scroll of comprehend languages', 'scroll of fireball', 'scroll of protection',
      'spell scroll (3rd level)', 'spell scroll (4th level)', 'forgery kit', 'navigator\'s tools', 'cartographer\'s tools',
    ]
  },
  
  'magical_items': {
    icon: 'auto_fix_high',
    name: 'Magical Items',
    items: [
      'wand of magic detection', 'wand of magic missiles', 'wand of web', 'broom of flying',
      'ring of protection', 'ring of jumping', 'amulet of health', 'headband of intellect',
      'circlet of blasting', 'brooch of shielding', 'necklace of adaptation',
      'pearl of power', 'minor enchanted trinket', 'orb of direction', 'immovable rod',
    ]
  },
  
  'spell_components': {
    icon: 'receipt_long',
    name: 'Spell Components',
    items: [
      'arcane focus', 'spell components', 'holy symbol', 'druidcraft focus'
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
    icon: 'spa',
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
    icon: 'styler',
    name: 'Clothing & Accessories',
    items: [
      'traveler\'s clothes', 'robes', 'cloak of protection', 'cloak of many fashions',
      'boots of elvenkind', 'boots of striding and springing', 'disguise kit',
    ]
  },
  
  'mounts_animals': {
    icon: HorseIcon,
    name: 'Mounts & Animals',
    items: [
      'riding horse', 'warhorse', 'mule', 'exotic pets'
    ]
  },
  
  'vehicles': {
    icon: 'garden_cart',
    name: 'Vehicles',
    items: [
      'cart', 'wagon'
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
    icon: 'playing_cards',
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
  const categoryInfo = getCategoryForItem(itemName);
  const icon = categoryInfo.icon;
  
  // If it's a string, it's a Material Symbol
  if (typeof icon === 'string') {
    return icon;
  }
  
  // If it's a component, return 'phosphor' as a flag
  return 'phosphor';
}

// Helper function to get the actual icon component
function getIconComponent(itemName) {
  const categoryInfo = getCategoryForItem(itemName);
  return categoryInfo.icon;
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

// Helper function to close all dropdowns
const closeAllDropdowns = () => {
  setIsDropdownOpen(false);
  setIsRaceDropdownOpen(false);
  setIsSettlementDropdownOpen(false);
  setIsShopTypeDropdownOpen(false);
  setIsCategoryDropdownOpen(false);
  setIsSortDropdownOpen(false);
};

// Get color classes based on rarity level
const getRarityColors = (level) => {
  switch (level.toLowerCase()) {
    case 'common':
      return {
        text: 'text-stone-500',
        textLight: 'text-stone-500', 
        textIcon: 'text-stone-500',
        background: 'bg-stone-50 border-stone-500 hover:bg-stone-100'
      };
    case 'uncommon':
      return {
        text: 'text-cyan-700',
        textLight: 'text-cyan-700',
        textIcon: 'text-cyan-700',
        background: 'bg-teal-50 border-cyan-700 hover:bg-teal-100'
      };
    case 'rare':
      return {
        text: 'text-indigo-600',
        textLight: 'text-indigo-600',
        textIcon: 'text-indigo-600',
        background: 'bg-violet-50 border-indigo-600 hover:bg-violet-100'
      };
    case 'very rare':
      return {
        text: 'text-rose-500',
        textLight: 'text-rose-500',
        textIcon: 'text-rose-500',
        background: 'bg-pink-50 border-rose-500 hover:bg-pink-100'
      };
    case 'legendary':
      return {
        text: 'text-yellow-600',
        textLight: 'text-yellow-600',
        textIcon: 'text-yellow-600',
        background: 'bg-amber-50 border-yellow-600 hover:bg-amber-100'
      };
    default:
      return {
        text: 'text-stone-500',
        textLight: 'text-stone-500',
        textIcon: 'text-stone-500',
        background: 'bg-stone-50 border-stone-500 hover:bg-stone-100'
      };
  }
};

const setting = {
  city: [
    "tucked between looming stone buildings and bustling trade stalls",
    "wedged into a narrow alley where echoing footsteps mix with distant cart wheels",
    "occupying the ground floor of a towering guildhall that has voices drifting from upper windows",
    "carved into the base of an ancient wall where morning shadows linger longest",
    "squeezed between competing merchant houses, their colorful banners fluttering overhead",
    "built into a busy courtyard where fountain spray mingles with the scent of fresh bread"
  ],
  
  town: [
    "nestled along a cobbled street near a quiet square",
    "positioned at the corner where two well-traveled roads converge under old oak trees",
    "settled beside the town well where locals gather to share the day's gossip",
    "housed in a converted manor's ground floor, with ivy creeping up weathered stone walls",
    "standing proudly on the main thoroughfare, flanked by matching timber-framed buildings",
    "tucked behind the town hall where a small garden blooms despite the foot traffic"
  ],
  
  village: [
    "sitting alone at the edge of a dirt path, beside a cluster of homes",
    "built where the forest meets the clearing, with wildflowers growing against its walls",
    "standing near the village crossroads, marked by a weathered wooden signpost",
    "nestled against the old mill where the sound of turning wheels provides constant rhythm",
    "positioned beside the communal well with a rope swing hanging from the nearby elm",
    "located at the village's heart, where chickens peck freely in the dusty yard"
  ]
};

const generateShopDescription = (shopType: string, settlementSize: string, rateModifier: number, existingParts?: {location?: string, interior?: string, texture?: string}) => {
  const refinement = getShopRefinement(rateModifier);
  console.log('🔍 FUNCTION CALLED AT:', new Date().toISOString());
  console.log('🔍 ORIGINAL PARAMETERS:', { shopType, settlementSize, rateModifier });

  const originalShopType = shopType;
  setTimeout(() => {
    console.log('🔍 PARAMETERS AFTER TIMEOUT:', { 
      original: originalShopType, 
      current: shopType,
      stillEqual: originalShopType === shopType 
    });
  }, 0);




const texturalDetails = {
  "alchemist": {
    refined: [
      "The counters are cool to the touch, with a faint lavender scent lingering in the air",
      "A light haze clings to the ceiling, carrying notes of mint and dried sage",
      "Glass beakers clink softly in the stillness, and your fingers leave no trace on the polished stone",
      "The air is crisp and still, tinged with herbal oils and just a hint of something metallic",
      "You feel a subtle static in the air, like the room is holding its breath"
],
    humble: [
      "The wooden counter is sticky in places, and the whole place smells like vinegar and thyme",
      "Ash has settled into the corners, and your hands come away faintly gritty after touching anything",
      "A murky tang lingers in the back of your throat; equal parts mold, pepper, and smoke",
      "The air is warm and damp, with hanging herbs brushing your shoulders as you move",
      "The floor creaks underfoot, and something herbal simmers somewhere from the back of the shop"
    ],
    standard: [
      "Jars clink as you pass, and the air smells faintly of mint and tree sap",
      "The workspace feels lived-in. Worn wood, warm stone, and a dusting of dried petals",
      "You brush against a rack of vials, warm to the touch from nearby burners",
      "There’s a calm bustle to the place, full of clove, chalk, and quiet confidence",
      "It smells like someone’s been working. Clean enough, but not sterile"
    ]
  },

  "blacksmith": {
    refined: [
      "The air smells faintly of clean steel and oiled leather, warm but not stifling",
      "Stone floors stay cool underfoot, even as the forge glows with steady heat",
      "You hear the precise strike of hammer to metal; measured, not rushed",
      "Everything feels in its place, from polished tongs to neatly racked blades",
      "A faint hum of heat fills the space, edged with charcoal and discipline"
    ],
    humble: [
      "The forge hits you like a wall: hot, smoky, and thick with soot",
      "Ash clings to every surface, and the smell of burned coal sticks to your clothes",
      "The air is loud with hammering, and your throat dries out fast from the heat",
      "Tools are piled wherever there’s space, and the floor crunches underfoot",
      "You catch the sour tang of old sweat and iron, sharp and familiar"
    ],
    standard: [
      "It’s hot, but not unbearable. Just enough to remind you work’s being done",
      "The scent of metal, smoke, and oil settles deep in your lungs",
      "You hear the rhythm of labor: hammer, hiss, hammer again",
      "The air feels dense with effort, warmed by open flame and honest work",
      "Surfaces are warm and worn, with tools laid out in rough but usable order"
    ]
  },

  "general store": {
    refined: [
      "Polished counters feel smooth and cool, and the air smells faintly of lemon and wax",
      "Every shelf is dust-free and organized. Quiet, careful attention lives here",
      "Brass handles warm quickly in your grip, set against wood that’s seen care, not just use",
      "The air is clean, touched with soap and something faintly floral from the open windows",
      "Even the creaks in the floor feel intentional; part of a well-kept place that runs like clockwork"
    ],
    humble: [
      "The counter’s edge is sticky in places, and the air smells like old burlap and dried beans",
      "You dodge leaning stacks and sagging crates, surrounded by dust and the whiff of kerosene",
      "Boards creak loud enough to announce every step, and the air clings with the scent of mothballs",
      "Surfaces are rough, stained, and softened by years of hands and wear",
      "The whole place feels held together by memory and habit, more than nails"
    ],
    standard: [
      "Shelves are full but not cluttered. Everything smells like dried goods and floor cleaner",
      "The floor gives a little with each step, and the air carries the scent of paper, grain, and soap",
      "Your hands brush worn handles and smooth edges, shaped by regulars who know where everything is",
      "It’s not spotless, but it’s solid; scuffed surfaces, handwritten signs, and no wasted space",
      "The air moves just enough to carry warmth and the faint scent of something baking nearby"
    ]
  },

  "mystic goods": {
    refined: [
      "The air hums faintly around you, scented with incense and something sharper, like charged quartz",
      "Glass jars glow gently from within, while the scent of lavender and old paper clings to the walls",
      "Every surface is warm to the touch, despite the cool air inside. Your hands tingle when they leave surfaces",
      "The space is quiet but alert, filled with scents that feel both ancient and clean",
      "You smell dried flowers, polished wood, and the faint sting of something arcane on the air"
    ],
    humble: [
      "The room pops and crackles with stray magic, and something vaguely smoky clings to the back of your throat",
      "You catch a whiff of old candle wax, burnt herbs, and something sharp that makes your eyes sting",
      "The shelves are unevenly stocked, and the air smells like wet stone and misfired spells",
      "Your skin itches from static, and there’s a weird buzzing in your ears you can’t shake",
      "Scents shift from sweet to sour without warning, leaving you mildly disoriented"
    ],
    standard: [
      "A subtle buzz hangs in the air, like a tuning fork left humming in your bones",
      "Dried herbs and old ink mingle with ozone and melted wax. It smells like spell prep",
      "The air tingles faintly when you walk through it, like passing through a curtain of energy",
      "Books whisper faintly when you’re not looking, and something warm nudges your thoughts",
      "Your fingertips feel just a little off, like magic left fingerprints everywhere you touched"
    ]
  },

  "exotic goods": {
    refined: [
      "Soft fabrics brush your arms as you pass—woven with patterns you’ve never seen before",
      "The air smells of old cedar, sharp spices, and something that might be dried citrus or sun-warmed leather",
      "Each surface feels deliberate; cool stone, polished shell, lacquered wood. None of it local",
      "A faint rustle follows your movement, like the room remembers being packed and unpacked too many times",
      "The scent clings to your clothes: salt, incense, and something unfamiliar but expensive"
    ],
    humble: [
      "Crates creak when leaned on, still dusted in whatever soil they arrived with",
      "The air hits you with clashing smells—dried meat, damp rope, unfamiliar resin",
      "Rough fabrics catch on your sleeves, and some items still bear shipping tags written in a language you don’t know",
      "Everything smells faintly of mildew and far-off places, like a port city after the rain",
      "You get the sense the walls were built around the goods, not the other way around"
    ],
    standard: [
      "The scent shifts as you walk—cinnamon one step, sandalwood the next",
      "Items are grouped by feel more than logic, but each tells a story through worn labels and faded paint",
      "Surfaces range wildly: cool stone, soft fur, brittle reeds. Most beg to be touched",
      "The air hums with travel, trade, and a dozen languages all saying ‘look closer’",
      "You smell dried fruit, aged paper, and something smoky you can’t quite name"
    ]
  },

  "jeweler": {
    refined: [
      "The air holds a faint chill, scented with fine metal polish and the trace sweetness of pearl dust",
      "Cool glass counters feel pristine beneath your palms, while the room smells faintly of clean metal and old velvet",
      "Every surface is smooth and deliberate, warmed by soft lighting that flatters without revealing flaws",
      "You feel the hush of wealth in the acoustics—soft footsteps, no echoes—and the subtle scent of aged cedar drawers",
      "Breathing here feels like holding your breath in a museum; clean, quiet, and a little tense with value"
    ],
    humble: [
      "The counters are chipped in places, but solid; the smell of solder and sweat hangs in the air",
      "Rough workbenches catch at your sleeves, saturated with decades of metalworking oils and determination",
      "Your hands encounter the texture of hard-earned craftsmanship, while acrid chemical scents sting your nostrils",
      "Working surfaces feel scarred but solid, permeated with the raw smell of applied skill over fancy presentation",
      "Everything feels handmade—sometimes clumsy, often clever, always touched by someone who cares"
    ],
    standard: [
      "The cases feel sturdy and well-maintained, their glass slightly warm from the soft lighting overhead",
      "You catch a faint scent of metal and leather—tools still used, not just displayed",
      "The atmosphere hums with contained beauty, while surfaces feel worn smooth by appreciative customers",
      "The room is quiet but not tense, with the comforting clink of rings being rearranged in their trays",
      "Displays show signs of frequent use—finger smudges wiped clean, edges softened by time"
    ]
  }
};

const interiors = {
  "alchemist": {
    refined: [
      "shelves lined with elegant glass bottles and a faint scent of lavender",
      "marble countertops displaying precisely measured ingredients in crystal containers",
      "pristine workbenches with silver instruments and the gentle bubble of distillation apparatus",
      "floor-to-ceiling cabinets with brass nameplate labels and the soft glow of preservation runes",
      "an organized laboratory with white tile floors and the crisp scent of purified air",
      "gleaming copper pipes and polished glassware arranged with scientific precision"
    ],
    humble: [
      "cluttered shelves of herbs, with a lingering earthy musk",
      "rickety wooden tables stained with decades of spilled concoctions and experimentation",
      "bundles of dried plants hanging from every available hook and nail",
      "cracked pottery jars with faded labels and the overwhelming smell of medicinal roots",
      "a cramped workspace where ingredients spill from overstuffed sacks and worn baskets",
      "makeshift shelving built from old crates, filled with mysterious powders in reused bottles"
    ],
    standard: [
      "rows of labeled jars and a heavy herbal aroma",
      "a functional workspace with bubbling cauldrons and the sharp scent of chemical reactions",
      "orderly chaos where ingredients are sorted by color rather than alphabetically",
      "working tables scattered with mortars, pestles, and the constant hiss of gentle flames",
      "practical shelving lined with uniform bottles and the comforting smell of brewing potions",
      "a busy laboratory where the air shimmers with alchemical vapors and possibility"
    ]
  },

  "blacksmith": {
    refined: [
      "a clean forge with polished tools and orderly racks of blades",
      "pristine anvils arranged beside temperature-controlled forges with brass fittings",
      "immaculate workbenches displaying masterwork weapons like precious art pieces",
      "spotless stone floors with drainage channels and the gentle ring of quality steel",
      "organized tool walls where each hammer and tong has its designated place",
      "a showroom forge where even the coal dust seems to settle in perfect patterns"
    ],
    humble: [
      "a smoke-filled room cluttered with scrap metal and soot",
      "a worn forge built from salvaged bricks with bellows that wheeze and complain",
      "cramped quarters where half-finished projects lean against every available wall",
      "a patched roof that leaks during storms, creating rust stains on forgotten ironwork",
      "makeshift workbenches cobbled together from old wagon wheels and weathered planks",
      "a cluttered space where the smell of honest sweat mixes with coal smoke"
    ],
    standard: [
      "an open forge where sparks fly and metal sings",
      "a working smithy with the rhythmic ring of hammer on anvil echoing constantly",
      "glowing coals casting dancing shadows on walls hung with works in progress",
      "a practical workspace where the heat radiates from multiple forges simultaneously",
      "sturdy workbenches bearing the scars of countless projects and endless dedication",
      "an active forge where the air pulses with heat waves and creative energy"
    ]
  },

  "general store": {
    refined: [
      "neatly organized shelves and a faint citrus polish scent",
      "mahogany display cases with brass corners and items arranged by color and size",
      "polished hardwood floors that creak pleasantly underfoot with organized precision",
      "elegant signage written in flowing script above carefully curated merchandise",
      "glass-fronted cabinets displaying goods like museum pieces under soft lighting",
      "pristine aisles with goods arranged in perfect geometric patterns"
    ],
    humble: [
      "dusty crates and an old cat napping on the counter",
      "sagging shelves held up by ingenuity and whatever wood could be found",
      "a narrow space where customers must navigate around barrels and forgotten inventory",
      "mismatched furniture serving as display surfaces for an eclectic mix of necessities",
      "creaky floorboards with gaps where small items occasionally disappear forever",
      "a cozy jumble where finding anything requires asking the proprietor's advice"
    ],
    standard: [
      "a tidy chaos of wares from floor to ceiling",
      "functional shelving packed with everyday necessities and seasonal specialties",
      "a practical layout where customers can find basics without too much searching",
      "well-worn paths between displays that show the most popular walking routes",
      "organized sections for tools, food, and sundries with handwritten price tags",
      "a reliable space where locals know exactly where to find their usual purchases"
    ]
  },

  "mystic goods": {
    refined: [
      "walls lined with floating shelves and softly glowing crystal orbs that hum when approached",
      "marble pedestals displaying enchanted artifacts under protective glass domes",
      "silk tapestries depicting celestial maps while incense burns in silver censers",
      "levitating books that turn their own pages and whisper secrets to worthy customers",
      "pristine crystal cases where magical items pulse with contained elemental energy",
      "an elegant salon where even the shadows seem to dance with purpose and intelligence"
    ],
    humble: [
      "a crooked bookshelf stuffed with scrolls, the air thick with dust and burnt parchment",
      "cramped corners where mysterious items hide beneath moth-eaten cloth coverings",
      "a cluttered space where candle wax has dripped into strange runic patterns",
      "rickety shelving that groans under the weight of forgotten magical experiments",
      "a dimly lit room where the air shimmers with unstable magical residue",
      "makeshift altars constructed from stacked books and decorated with found trinkets"
    ],
    standard: [
      "an eclectic space with dangling charms, strange tomes, and a faint thrumming underfoot",
      "mysterious alcoves where shadows seem deeper and the air tastes of possibility",
      "working magical circles etched into well-worn wooden floors",
      "practical shelving for spell components alongside more exotic mystical curiosities",
      "a functional workshop where the boundary between mundane and magical blurs naturally",
      "organized chaos where every item has its place in some greater mystical pattern"
    ]
  },

  "exotic goods": {
    refined: [
      "glass cases displaying relics from distant lands, each lit from beneath with enchanted candles",
      "silk-draped alcoves showcasing treasures from across the known world and beyond",
      "climate-controlled displays preserving delicate artifacts from forgotten civilizations",
      "marble floors inlaid with maps showing the origins of each carefully catalogued piece",
      "pristine viewing chambers where rare items rest on velvet cushions under crystal covers",
      "an elegant gallery where each display tells the story of distant adventures"
    ],
    humble: [
      "curtained corners, mismatched rugs, and crates stamped in foreign scripts",
      "a cramped space where travelers' cast-offs mingle with genuine treasures",
      "makeshift displays built from repurposed ship parts and weathered travel trunks",
      "dusty corners where items from a dozen different cultures wait to be rediscovered",
      "a cluttered haven where every surface tells stories of distant ports and markets",
      "improvised shelving made from exotic wood planks and held together with foreign rope"
    ],
    standard: [
      "a kaleidoscope of colors, textures, and trinkets that defy categorization",
      "organized chaos where items from different continents share display space harmoniously",
      "functional displays that showcase the diversity of distant lands and cultures",
      "a practical arrangement where customers can browse foreign wonders methodically",
      "working displays that rotate inventory based on the latest trade route arrivals",
      "an adventure in browsing where each corner reveals treasures from different worlds"
    ]
  },

  "jeweler": {
    refined: [
      "velvet-lined displays glinting under chandeliers, each gem labeled in calligraphy",
      "mahogany cases with brass fittings where diamonds catch light from crystal prisms",
      "mirror-backed shelving that multiplies the sparkle of precious metals and stones",
      "individual spotlights illuminating each piece like stars in a luxurious constellation",
      "climate-controlled cases preserving delicate settings alongside flawless gemstones",
      "an elegant showroom where even the air seems to shimmer with reflected light"
    ],
    humble: [
      "unpolished glass cases and loose gemstones in small, unlabeled bowls",
      "a cramped workspace where half-finished settings wait beside well-used tools",
      "simple wooden displays where the beauty of the stones speaks louder than presentation",
      "a cluttered bench where the jeweler works while customers browse casually nearby",
      "makeshift lighting that still manages to coax fire from even modest gemstones",
      "a practical shop where craftsmanship matters more than fancy displays"
    ],
    standard: [
      "a narrow shop with glittering wares and the faint metallic scent of polish and coin",
      "working displays where finished pieces mingle with stones awaiting their settings",
      "functional cases that protect valuable inventory while allowing easy browsing",
      "organized workbenches where the craft of jewelry-making happens in full view",
      "practical lighting that brings out the best in both precious and semi-precious stones",
      "a reliable establishment where quality workmanship creates lasting beauty"
    ]
  }
};

  const normalizeShopType = (type: string) => {
    return type.toLowerCase(); 
  };

  const normalizedType = normalizeShopType(shopType);

  // Generate or reuse location
  const locationSettingArray = setting[settlementSize.toLowerCase()];
  const chosenSetting = existingParts?.location || locationSettingArray[Math.floor(Math.random() * locationSettingArray.length)];

  // Generate or reuse interior
  const shopInteriorOptions = interiors[normalizedType]?.[refinement] || [];
  const chosenInterior = existingParts?.interior || shopInteriorOptions[Math.floor(Math.random() * shopInteriorOptions.length)] || "an ordinary interior";

  // Generate or reuse texture
  const shopTextureOptions = texturalDetails[normalizedType]?.[refinement] || [];
  const chosenTexture = existingParts?.texture || shopTextureOptions[Math.floor(Math.random() * shopTextureOptions.length)] || "";

  const fullDescription = `This shop is ${chosenSetting}. Inside, you'll find ${chosenInterior}.${chosenTexture ? ` ${chosenTexture}.` : ''}`;

  return {
    fullDescription,
    location: chosenSetting,
    interior: chosenInterior,
    texture: chosenTexture
  };
};



// Function to generate random shopkeeper
const generateShopkeeper = (
  
  customShopType: string = shopType,
  customSettlementSize: string = settlementSize,
  pricingStylePreference: string = selectedPricingStyle
 
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
    
    // Generate new shop description
    const shopDescriptionData = generateShopDescription(
      fallbackShopType, 
      customSettlementSize, 
      shopkeeper.priceModifier,
      {
        location: shopkeeper.shopDescriptionParts?.location,
        interior: shopkeeper.shopDescriptionParts?.interior,
        texture: shopkeeper.shopDescriptionParts?.texture
      }
    );

    // FIX: Generate new description template for the new shop type, but use locked name/race
    const descriptionData = generateShopkeeperDescriptionWithTemplate({
      name: shopkeeper.name, // Use locked name
      race: shopkeeper.race, // Use locked race
      shopType: fallbackShopType // Use new shop type
    }, shopkeeper.priceModifier);

    const updatedShopkeeper = {
      ...shopkeeper,
      shopType: fallbackShopType,
      commonItems: selectedCommonItems,
      rareItems: selectedRareItems,
      motto: newMotto,
      shopDescription: shopDescriptionData.fullDescription,
      shopDescriptionParts: {
        location: shopDescriptionData.location,
        interior: shopDescriptionData.interior,
        texture: shopDescriptionData.texture
      },
      // FIX: Use the new description and template for the new shop type
      description: descriptionData.finalDescription,
      descriptionTemplate: descriptionData.template
    };

    setShopkeeper(updatedShopkeeper);
    setShopType(fallbackShopType);
    return;
}


let name, race;

  if (isLocked && lockedShopkeeperIdentity) {
    // Use locked identity
    ({ name, race } = lockedShopkeeperIdentity);
  } else {
    // Generate new identity
    race = races[Math.floor(Math.random() * races.length)];
    const firstName = firstNames[race][Math.floor(Math.random() * firstNames[race].length)];
    const lastName = lastNames[race][Math.floor(Math.random() * lastNames[race].length)];
    name = `${firstName} ${lastName}`;
  }


  let shopTypeValue = customShopType;
  if (customShopType === 'random' || customShopType === '') {
    shopTypeValue = shopTypes[Math.floor(Math.random() * shopTypes.length)];
  }

  setShopType(shopTypeValue);

  let pricingStyleObj;
  let actualStyleIndex;
  if (pricingStylePreference === 'random') {
    actualStyleIndex = Math.floor(Math.random() * pricingStyles.length);
    pricingStyleObj = pricingStyles[actualStyleIndex];
  } else {
    actualStyleIndex = parseInt(pricingStylePreference);
    pricingStyleObj = pricingStyles[actualStyleIndex];
  }
  const pricingStyle = pricingStyleObj.style;
  const priceModifier = pricingStyleObj.modifier;

const shopName = generateShopName(shopTypeValue, name, race, customSettlementSize, priceModifier);

  const limits = getInventoryLimits(customSettlementSize);
  const selectedCommonItems = generateCommonItems(shopTypeValue, priceModifier, limits);
  const selectedRareItems = generateRareItems(shopTypeValue, priceModifier, limits);



// Shopkeeper motto
  const motto = generateMotto(shopTypeValue, priceModifier);
  const shopDescriptionData = generateShopDescription(shopTypeValue, customSettlementSize, priceModifier);
  
  const descriptionData = generateShopkeeperDescriptionWithTemplate({
  name,
  race,
  shopType: shopTypeValue
}, priceModifier);

  const newShopkeeper = {
    name,
    race,
    shopName,
    shopType: shopTypeValue,
    pricingStyle,
    priceModifier,
    commonItems: selectedCommonItems,
    rareItems: selectedRareItems,
    motto,
    shopDescription: shopDescriptionData.fullDescription,
      shopDescriptionParts: {
        location: shopDescriptionData.location,
        interior: shopDescriptionData.interior,
        texture: shopDescriptionData.texture
      },
    availableMoney: generateShopkeeperMoney(customSettlementSize),
    shopLocation: setting[customSettlementSize.toLowerCase()][Math.floor(Math.random() * setting[customSettlementSize.toLowerCase()].length)],
    description: descriptionData.finalDescription,
    descriptionTemplate: descriptionData.template
  };

  setShopkeeper(newShopkeeper);
  setSelectedPricingStyle(actualStyleIndex.toString());
};

  
  // Lock shopkeeper toggle
  const [lockedShopkeeperIdentity, setLockedShopkeeperIdentity] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const toggleLock = () => {
    if (isLocked) {
      // Unlock: clear stored identity
      setLockedShopkeeperIdentity(null);
      setIsLocked(false);
    } else if (shopkeeper) {
      // Lock: store current identity (name and race)
      const { name, race } = shopkeeper;
      setLockedShopkeeperIdentity({ name, race });
      setIsLocked(true);
    }
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

// Function to regenerate name based on selected race
const regenerateNameForRace = (selectedRace) => {
  if (!shopkeeper || isLocked) return; // <-- Add lock check
  
  const firstName = firstNames[selectedRace][Math.floor(Math.random() * firstNames[selectedRace].length)];
  const lastName = lastNames[selectedRace][Math.floor(Math.random() * lastNames[selectedRace].length)];
  const newName = `${firstName} ${lastName}`;
  const newFirstName = firstName;
  const oldFirstName = shopkeeper.name.split(' ')[0];
  
  // Use existing template with new name and pronouns
  const newDescription = applyNameAndPronouns(shopkeeper.descriptionTemplate, newName, selectedRace);
  
  // Update shop name by replacing the old name parts with new ones
  let updatedShopName = shopkeeper.shopName;
  
  // Replace the old first name with the new first name
  if (updatedShopName.includes(oldFirstName)) {
    updatedShopName = updatedShopName.replace(oldFirstName, newFirstName);
  }
  
  // Replace race-specific elements if they exist
  const oldRaceStyles = raceNamingStyles[shopkeeper.race] || [];
  const newRaceStyles = raceNamingStyles[selectedRace] || [];
  
  oldRaceStyles.forEach(oldStyle => {
    if (updatedShopName.includes(oldStyle)) {
      const newStyle = newRaceStyles[Math.floor(Math.random() * newRaceStyles.length)];
      updatedShopName = updatedShopName.replace(oldStyle, newStyle);
    }
  });
  
  setShopkeeper({
    ...shopkeeper,
    name: newName,
    race: selectedRace,
    shopName: updatedShopName,
    description: newDescription
  });
};

// Effect to generate random shop on initial load
useEffect(() => {
  const sizes = ['village', 'town', 'city'];
  const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
  setSettlementSize(randomSize);
  setSelectedPricingStyle('random')
  generateShopkeeper('random', randomSize, 'random');
}, []); // Empty dependency array means this runs once on mount

// Effect to generate new inventory on settlement selection
useEffect(() => {
  if (shopkeeper && shopkeeper.shopDescriptionParts) {
    const limits = getInventoryLimits(settlementSize);
    const updatedCommon = generateCommonItems(shopkeeper.shopType, shopkeeper.priceModifier, limits);
    const updatedRare = generateRareItems(shopkeeper.shopType, shopkeeper.priceModifier, limits);

    // Only update the location part, preserve interior and texture
    const shopDescriptionData = generateShopDescription(
      shopkeeper.shopType, 
      settlementSize, 
      shopkeeper.priceModifier,
      {
        interior: shopkeeper.shopDescriptionParts.interior,
        texture: shopkeeper.shopDescriptionParts.texture
        // Don't pass location, let it generate a new one for the new settlement
      }
    );

    setShopkeeper({
      ...shopkeeper,
      commonItems: updatedCommon,
      rareItems: updatedRare,
      shopDescription: shopDescriptionData.fullDescription,
      shopDescriptionParts: {
        location: shopDescriptionData.location,
        interior: shopkeeper.shopDescriptionParts.interior,
        texture: shopkeeper.shopDescriptionParts.texture
      }
    });
  }
}, [settlementSize]);

// Effect to close dropdowns when clicking outside
useEffect(() => {
  const handleClickOutside = (event) => {
    if (!event.target.closest('.dropdown-wrapper') && !event.target.closest('.relative')) {
      setIsDropdownOpen(false);
      setIsRaceDropdownOpen(false);
      setIsSettlementDropdownOpen(false);
      setIsShopTypeDropdownOpen(false);
      setIsCategoryDropdownOpen(false);
      setIsSortDropdownOpen(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);

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
        text: "Village",
        iconType: "phosphor",
        iconComponent: FarmIcon
      };
    case "town":
      return {
        text: "Town", 
        iconType: "phosphor",
        iconComponent: HouseLineIcon
      };
    case "city":
      return {
        text: "City",
        iconType: "phosphor",
        iconComponent: CastleTurretIcon
      };
    default:
      return {
        text: "Merchant",
        icon: "storefront",
        iconType: "material"
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
          @plugin "flowbite/plugin";
          @source "../node_modules/flowbite";



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

/* Uniform Dropdown Styling - Reusable */
.uniform-dropdown {
  background-color: #f5f5f4 !important;
  border: 1px solid #a8a29e !important;
  color: #78716c !important;
  font-size: 0.75rem !important;
  font-weight: 500 !important;
  font-family: 'Inter', sans-serif !important;
  text-transform: uppercase !important;
  letter-spacing: 0.05em !important;
  padding: 0.4rem 28px 0.4rem 0.8rem !important;
  border-radius: 0.375rem !important;
  transition: all 0.2s ease !important;
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  appearance: none !important;
  cursor: pointer !important;
  position: relative !important;
  width: auto !important;
  min-width: fit-content !important;
  white-space: nowrap !important; /* Prevent text wrapping */
}

.uniform-dropdown:hover {
  background-color: #e7e5e4 !important;
  border-color: #78716c !important;
}

.uniform-dropdown:focus {
  outline: none !important;
  border-color: #78716c !important;
  box-shadow: 0 0 0 2px rgba(120, 113, 108, 0.1) !important;
  background-color: #f5f5f4 !important;
}

.dropdown-wrapper {
  position: relative;
  display: inline-block;
  width: auto; /* Allow wrapper to size to content */
}

.dropdown-wrapper::after {
  content: 'expand_more';
  font-family: 'Material Symbols Outlined';
  position: absolute;
  top: 50%;
  right: 6px; /* Reduced from 8px since we have less padding */
  transform: translateY(-50%);
  pointer-events: none;
  font-size: 16px !important;
  color: #78716c;
  font-variation-settings: 
    'FILL' 0,
    'wght' 200,
    'GRAD' 0,
    'opsz' 20;
}

.dropdown-wrapper:hover::after {
  color: #57534e;
}

/* Variant for rare items (purple theme) */
.uniform-dropdown.rare-variant {
  background-color: #f5f3ff !important;
  border: 1px solid #c084fc !important;
  color: #7c3aed !important;
}

.uniform-dropdown.rare-variant:hover {
  background-color: #ede9fe !important;
  border-color: #a855f7 !important;
}

.uniform-dropdown.rare-variant:focus {
  border-color: #7c3aed !important;
  box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.1) !important;
  background-color: #f5f3ff !important;
}

.dropdown-wrapper.rare-variant::after {
  color: #7c3aed;
}

.dropdown-wrapper.rare-variant:hover::after {
  color: #6d28d9;
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
              'wght' 200,
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
            background-color: #F4F4F5;
            color: #78716C;
            border-color: #78716C;
          }

          .rarity-uncommon {
            background-color: #CCFBF1;
            color: #0E7490;
            border-color: #0E7490;
          }

          .rarity-rare {
            background-color: #E0E7FF;
            color: #4F46E5;
            border-color: #4F46E5;
          }

          .rarity-very-rare {
            background-color: #FCE7F3;
            color: #F43F5E;
            border-color: #F43F5E;
          }

          .rarity-legendary {
            background-color: #FEF3C7;
            color: #D08700;
            border-color: #D08700;
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

.dropdown-menu {
  white-space: nowrap !important;
  min-width: max-content !important;
  width: auto !important;
}

.dropdown-menu li button {
  white-space: nowrap !important;
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

          
{/*Title Card */}
<div className="shopkeeper-card rounded-md shadow-sm p-6 mb-6">
  {/* Header with title and randomize button */}
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
  <h1 className="text-4xl font-bold text-stone-600 cinzel shopkeeper-name m-0 leading-none">
    Fantasy Shop Builder
  </h1>
  
  {/* Randomize Button */}
  <button
    onClick={() => {
      const sizes = ['village', 'town', 'city'];
      const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
      setShopType('');
      setSettlementSize(randomSize);
      generateShopkeeper('random', randomSize, 'random'); // Pass 'random' directly
    }}
    className="flex items-center justify-center sm:justify-start gap-2 text-xs font-medium inter uppercase tracking-wider rounded-md border px-2 py-1 bg-stone-100 text-stone-500 border-stone-400 hover:bg-stone-200 transition self-start sm:self-auto"
  >
    <span className="material-symbols-outlined" style={{fontSize: '18px'}}>casino</span>
    Randomize
  </button>
</div>
  
  {/* Descriptive text in separate container */}
 <div>
  <p className="text-stone-500 inter text-sm">
    Drop a ready-to-go shop into your game in seconds. Use the dropdowns to change the shop type or location. The inventory updates to match.
    <br />
    <br />
    <span className="font-semibold">Coming soon:</span> Shop selling mechanics! Add your items, set quantities, and we'll do the math for you.
  </p>
</div>
</div>
   
{shopkeeper && (
        <>
          {/* Shopkeeper Information Card */}
          <div className="shopkeeper-card rounded-md shadow-sm p-6 mb-6">
            <div className="header-content mb-3">
              
{/* Shop Name */}
<div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-1">
  {/* Shop Name */}
  <h2 className="text-2xl font-bold text-stone-600 cinzel shopkeeper-name m-0 leading-none">
    {shopkeeper.shopName}
  </h2>
      
      
{/* Dropdowns - wrap on mobile */}
<div className="flex flex-wrap items-center gap-2">

  {/* Shop Type Dropdown */}
  <div className="relative inline-block">
    <button
      onClick={() => {
        closeAllDropdowns();
        setIsShopTypeDropdownOpen(!isShopTypeDropdownOpen);
      }}
      className="bg-stone-100 border border-stone-400 text-stone-600 text-xs 
      font-medium inter uppercase tracking-wider rounded-md px-2 py-1 cursor-pointer 
      hover:bg-stone-200 focus:outline-none focus:border-stone-600 focus:ring-2 focus:ring-stone-600/10 
      flex items-center justify-between min-w-fit"
    >
      <span className="flex items-center">
        {(() => {
          const icon = shopIcons[shopkeeper.shopType] || "storefront";
          
          if (typeof icon === 'string') {
            return <span className="material-symbols-outlined shop-icon mr-1">{icon}</span>;
          } else {
            return <PhosphorIcon icon={icon} size={20} className="shop-icon mr-1" />;
          }
        })()}
        {shopkeeper.shopType}
      </span>
      <span className="material-symbols-outlined ml-1 leading-none" style={{fontSize: '14px'}}>
        {isShopTypeDropdownOpen ? 'expand_less' : 'expand_more'}
      </span>
    </button>
   
    {isShopTypeDropdownOpen && (
      <div className="dropdown-menu absolute z-10 mt-1 bg-stone-50 border border-stone-300 rounded-lg shadow-lg">
        <ul className="py-0.5 text-xs text-stone-700">
          {shopTypes.map((type) => (
            <li key={type}>
              <button
                onClick={() => {
                  closeAllDropdowns();
                  setShopType(type);
                  generateShopkeeper(type, settlementSize, selectedPricingStyle);
                  setIsShopTypeDropdownOpen(false);
                }}
                className={`block w-full text-left px-3 py-1.5 hover:bg-stone-100 text-stone-600 font-medium inter uppercase tracking-wider ${
                  shopkeeper.shopType === type ? 'bg-stone-100' : ''
                }`}
              >
                <span className="flex items-center">
                  {(() => {
                    const icon = shopIcons[type] || "storefront";
                    
                    if (typeof icon === 'string') {
                      return <span className="material-symbols-outlined shop-icon text-stone-400 mr-1">{icon}</span>;
                    } else {
                      return <PhosphorIcon icon={icon} weight="regular" className="shop-icon text-stone-400 mr-1" />;
                    }
                  })()}
                  {type}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>

    <span className="text-stone-600 text-sm inter">
    in a
  </span>

  {/* Settlement Dropdown */}
  <div className="relative inline-block">
    <button
      onClick={() => {
        closeAllDropdowns();
        setIsSettlementDropdownOpen(!isSettlementDropdownOpen)}
      }
      className="bg-stone-100 border border-stone-400 text-stone-600 text-xs 
      font-medium inter uppercase tracking-wider rounded-md px-2 py-1 cursor-pointer 
      hover:bg-stone-200 focus:outline-none focus:border-stone-600 focus:ring-2 focus:ring-stone-600/10 
      flex items-center justify-between min-w-fit"
    >
      <span className="flex items-center">
        {(() => { 
          const settlementData = getSettlementData(settlementSize);
          if (settlementData.iconType === "phosphor") {
            return <PhosphorIcon icon={settlementData.iconComponent} size={20} className="shop-icon mr-1" />;
          } else {
            return <span className="material-symbols-outlined shop-icon mr-1">{settlementData.icon}</span>;
          }
        })()}
        {getSettlementData(settlementSize).text}
      </span>
      <span className="material-symbols-outlined ml-1 leading-none" style={{fontSize: '14px'}}>
        {isSettlementDropdownOpen ? 'expand_less' : 'expand_more'}
      </span>
    </button>
   
    {isSettlementDropdownOpen && (
      <div className="dropdown-menu absolute z-10 mt-1 bg-stone-50 border border-stone-300 rounded-lg shadow-lg">
        <ul className="py-0.5 text-xs text-stone-700">
          {["village", "town", "city"].map((size) => (
            <li key={size}>
              <button
                onClick={() => {
                  closeAllDropdowns();
                  setSettlementSize(size);
                  setIsSettlementDropdownOpen(false);
                }}
                className={`block w-full text-left px-3 py-1.5 hover:bg-stone-100 text-stone-600 font-medium inter uppercase tracking-wider ${
                  settlementSize === size ? 'bg-stone-100' : ''
                }`}
              >
                <span className="flex items-center">
                  {(() => { 
                    const settlementData = getSettlementData(size);
                    if (settlementData.iconType === "phosphor") {
                      return <PhosphorIcon icon={settlementData.iconComponent} weight="regular" className="shop-icon text-stone-400 mr-1" />;
                    } else {
                      return <span className="material-symbols-outlined shop-icon text-stone-400 mr-1">{settlementData.icon}</span>;
                    }
                  })()}
                  {size}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
</div>
    </div>

    {shopkeeper?.shopDescription && (
  <p className="text-stone-600 inter text-sm mt-1 mb-6">{shopkeeper.shopDescription}</p>
)}


{/* Shopkeeper Name & Race */}
<div className="flex items-start justify-between mb-1 gap-2">
  <div className="flex items-center gap-2 flex-wrap min-w-0">
    <h3 className="shopkeeper-name text-lg text-stone-600 font-semibold cinzel m-0 flex-shrink-0">
      {shopkeeper.name}
    </h3>
    <span className="text-stone-400 font-normal flex-shrink-0">•</span>
    <div className="relative inline-block flex-shrink-0">
      <button
  onClick={() => {
    closeAllDropdowns();
    setIsRaceDropdownOpen(!isRaceDropdownOpen)
  }}
  disabled={isLocked}
  className={`bg-stone-100 border border-stone-400 text-stone-600 text-xs 
  font-medium inter uppercase tracking-wider rounded-md px-3 py-1 cursor-pointer 
  hover:bg-stone-200 focus:outline-none focus:border-stone-600 focus:ring-2 focus:ring-stone-600/10 
  flex items-center justify-between min-w-fit ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
>
      <span className="flex items-center">
  <span className="material-symbols-outlined mr-1 leading-none">person_raised_hand</span>
  {shopkeeper.race}
</span>
<span className="material-symbols-outlined ml-2 leading-none" style={{fontSize: '16px'}}>
        {isRaceDropdownOpen ? 'expand_less' : 'expand_more'}
      </span>
    </button>
    
      {isRaceDropdownOpen && (
        <div className="dropdown-menu absolute z-10 mt-1 bg-stone-50 border border-stone-300 rounded-lg shadow-lg">
          <ul className="py-0.5 text-xs text-stone-700">
            {races.map((race) => (
              <li key={race}>
                <button
                  onClick={() => {
                    closeAllDropdowns();
                    regenerateNameForRace(race);
                    setIsRaceDropdownOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-1 hover:bg-stone-100 text-stone-600 font-medium inter uppercase tracking-wider ${
                    shopkeeper.race === race ? 'bg-stone-100' : ''
                  }`}
                >
                  <span className="flex items-center"><span className="material-symbols-outlined shop-icon text-stone-400 mr-1">person_raised_hand</span>{race}
                  </span>
                  
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </div>
<button
  onClick={toggleLock}
  aria-label="Toggle shopkeeper lock"
  className="text-stone-500 hover:text-stone-700 transition-colors text-xs flex-shrink-0 self-center"
>
      {isLocked ? (
  <PhosphorIcon icon={LockKeyIcon} size={20} weight="thin" title="Locked" />
) : (
  <PhosphorIcon icon={LockKeyOpenIcon} size={20} weight="thin" title="Unlocked" />
)}
    </button>
</div>

<div className="space-y-2">

 {/* Shop Motto */}
  <p className="text-sm inter italic text-stone-400">
   — "{shopkeeper.motto}"
  </p>
 </div>
</div>


{/* Shopkeeper Description */}
 <div className="text-stone-600 inter text-sm mt-1">
  <div className="mb-6">
  {shopkeeper.description}
</div>
                  
{/* Interactive pricing line */}

  <div className="text-stone-600 inter text-sm leading-relaxed">
  <span>{shopkeeper.name.split(' ')[0]} maintains </span>
  <span className="relative inline-block">
    <button
  onClick={() => {
    closeAllDropdowns();
    setIsDropdownOpen(!isDropdownOpen)
  }}
  className="bg-stone-100 border border-stone-400 text-stone-600 text-xs 
  font-medium inter uppercase tracking-wider rounded-md px-3 py-1 cursor-pointer 
  hover:bg-stone-200 focus:outline-none focus:border-stone-600 focus:ring-2 focus:ring-stone-600/10 
  inline-flex items-center justify-between min-w-fit align-middle"
>
      <span className="flex items-center">
  <span className="material-symbols-outlined mr-1 leading-none">money_bag</span>
  {getCurrentPricingText()}
</span>
<span className="material-symbols-outlined ml-2 leading-none" style={{fontSize: '16px'}}>
        {isDropdownOpen ? 'expand_less' : 'expand_more'}
      </span>
    </button>
   
    {isDropdownOpen && (
  <div className="dropdown-menu absolute z-10 mt-1 bg-stone-50 border border-stone-300 rounded-lg shadow-lg">
    <ul className="py-0.5 text-xs text-stone-700">
      {/* Market Rate button */}
      <li>
        <button
          onClick={() => {
            closeAllDropdowns();
            setSelectedPricingStyle('random');
            setIsDropdownOpen(false);
  
  const standardPricingStyle = pricingStyles.find(style => style.modifier === 0) || pricingStyles[0];
  const newPriceModifier = standardPricingStyle.modifier; // This will be 0
  
  const limits = getInventoryLimits(settlementSize);
  const updatedCommon = generateCommonItems(shopkeeper.shopType, newPriceModifier, limits);
  const updatedRare = generateRareItems(shopkeeper.shopType, newPriceModifier, limits);
  const descriptionData = regenerateDescriptionForPricing(newPriceModifier);
  const shopDescriptionData = generateShopDescription(
  shopkeeper.shopType, 
  settlementSize, 
  newPriceModifier,
  {
    location: shopkeeper.shopDescriptionParts.location
    // Don't pass interior/texture - let them regenerate based on new price modifier
  }
);

const newMotto = generateMotto(shopkeeper.shopType, newPriceModifier);

let newShopName = shopkeeper.shopName;
if (hasRefinementElements(shopkeeper.shopName, shopkeeper.shopType)) {
  newShopName = replaceRefinementTitle(shopkeeper.shopName, shopkeeper.shopType, newPriceModifier);
}
  setShopkeeper({
    ...shopkeeper,
    shopName: newShopName,
    priceModifier: newPriceModifier,
    pricingStyle: standardPricingStyle.style,
    commonItems: updatedCommon,
    motto: newMotto,
    rareItems: updatedRare,
    shopDescription: shopDescriptionData.fullDescription,
    shopDescriptionParts: {
      location: shopDescriptionData.location,
      interior: shopDescriptionData.interior,
      texture: shopDescriptionData.texture
    },
    description: descriptionData.description,
    descriptionTemplate: descriptionData.descriptionTemplate
  });
}}
          className="block w-full text-left px-3 py-1 hover:bg-stone-100 text-stone-600 font-medium inter uppercase tracking-wider"
        >
       <span className="flex items-center">
  <span className="material-symbols-outlined shop-icon text-stone-400 mr-1">money_bag</span>
  Standard
</span>
        </button>
      </li>
      
      {/* Each pricing option button (15% Above, 20% Below, etc.) */}
      {pricingStyles
        .filter(style => style.modifier !== 0)
        .sort((a, b) => b.modifier - a.modifier)
        .map((style, index) => {
          const originalIndex = pricingStyles.findIndex(s => s === style);
          const description = style.modifier > 0
            ? `${Math.abs(style.modifier * 100).toFixed(0)}% Above`
            : `${Math.abs(style.modifier * 100).toFixed(0)}% Below`;
         
          return (
            <li key={originalIndex}>
              <button
                onClick={() => {
                  closeAllDropdowns();
                  setSelectedPricingStyle(originalIndex.toString());
                  setIsDropdownOpen(false);
  
  const pricingStyleObj = pricingStyles[originalIndex];
  const newPriceModifier = pricingStyleObj.modifier;
  
  const limits = getInventoryLimits(settlementSize);
  const updatedCommon = generateCommonItems(shopkeeper.shopType, newPriceModifier, limits);
  const updatedRare = generateRareItems(shopkeeper.shopType, newPriceModifier, limits);
  const descriptionData = regenerateDescriptionForPricing(newPriceModifier);
  
  const shopDescriptionData = generateShopDescription(
  shopkeeper.shopType, 
  settlementSize, 
  newPriceModifier,
  {
    location: shopkeeper.shopDescriptionParts.location
    // Don't pass interior/texture - let them regenerate based on new price modifier
  }
);
const newMotto = generateMotto(shopkeeper.shopType, newPriceModifier);

let newShopName = shopkeeper.shopName;
if (hasRefinementElements(shopkeeper.shopName, shopkeeper.shopType)) {
  newShopName = replaceRefinementTitle(shopkeeper.shopName, shopkeeper.shopType, newPriceModifier);
}

  setShopkeeper({
    ...shopkeeper,
    shopName: newShopName,
    priceModifier: newPriceModifier,
    pricingStyle: pricingStyleObj.style,
    commonItems: updatedCommon,
    rareItems: updatedRare,
    motto: newMotto,
    shopDescription: shopDescriptionData.fullDescription,
    shopDescriptionParts: {
      location: shopDescriptionData.location,
      interior: shopDescriptionData.interior,
      texture: shopDescriptionData.texture
    },
    description: descriptionData.description,
    descriptionTemplate: descriptionData.descriptionTemplate
  });
}}
                className="block w-full text-left px-3 py-1.5 hover:bg-stone-100 text-stone-600 font-medium inter uppercase tracking-wider"
              >
                <span className="flex items-center">
  <span className="material-symbols-outlined shop-icon text-stone-400 mr-1">money_bag</span>
  {description}
</span>
              </button>
            </li>
          );
        })}
    </ul>
  </div>
)}
  </span>
   <span> market rate for {getShopkeeperPronouns(shopkeeper.name).possessive} wares.</span>
  </div>
</div>
          </div>

          {/* New Combined Inventory Section */}
<div className="shopkeeper-card rounded-md shadow-sm p-6 mb-6">
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-3">
      <h3 className="text-lg font-semibold text-stone-600 cinzel shopkeeper-name m-0">
        Shop Inventory
      </h3>
      <button
        onClick={() => {
          closeAllDropdowns();
          regenerateCommonItems();
          regenerateRareItems();
        }}
        className="text-stone-500 hover:text-stone-700 transition-colors"
        title="Regenerate all inventory"
      >
        <span className="material-symbols-outlined" style={{fontSize: '20px'}}>refresh</span>
      </button>
    </div>
    
<div className="flex items-center gap-3">
  <div className="flex items-center gap-2 text-sm text-stone-600">
    <span>Show</span>
    
    {/* Category Dropdown */}
    <div className="relative inline-block">
      <button
        onClick={() => {
          closeAllDropdowns();
          setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
        }}
        className="bg-stone-100 border border-stone-400 text-stone-600 text-xs 
        font-medium inter uppercase tracking-wider rounded-md px-3 py-1 cursor-pointer 
        hover:bg-stone-200 focus:outline-none focus:border-stone-600 focus:ring-2 focus:ring-stone-600/10 
        flex items-center justify-between min-w-fit"
      >
        <span className="flex items-center">
          <span className="material-symbols-outlined mr-1 leading-none">all_inclusive</span>
          {selectedCategory === 'any' ? 'Any Category' : (itemCategories[selectedCategory]?.name || selectedCategory)}
        </span>
        <span className="material-symbols-outlined ml-2 leading-none" style={{fontSize: '16px'}}>
          {isCategoryDropdownOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>
     
      {isCategoryDropdownOpen && (
        <div className="dropdown-menu absolute z-10 mt-1 bg-stone-50 border border-stone-300 rounded-lg shadow-lg">
          <ul className="py-0.5 text-xs text-stone-700">
            <li>
              <button
                onClick={() => {
                  closeAllDropdowns();
                  setSelectedCategory('any');
                  setIsCategoryDropdownOpen(false);
                }}
                className={`block w-full text-left px-3 py-1.5 hover:bg-stone-100 text-stone-600 font-medium inter uppercase tracking-wider ${
                  selectedCategory === 'any' ? 'bg-stone-100' : ''
                }`}
              >
                <span className="flex items-center">
                  <span className="material-symbols-outlined shop-icon text-stone-400 mr-1">all_inclusive</span>
                  Any Category
                </span>
              </button>
            </li>
            {getAvailableCategories().map(category => {
              const categoryData = itemCategories[category];
              return (
                <li key={category}>
                  <button
                    onClick={() => {
                      closeAllDropdowns();
                      setSelectedCategory(category);
                      setIsCategoryDropdownOpen(false);
                    }}
                    className={`block w-full text-left px-3 py-1.5 hover:bg-stone-100 text-stone-600 font-medium inter uppercase tracking-wider ${
                      selectedCategory === category ? 'bg-stone-100' : ''
                    }`}
                  >
                    <span className="flex items-center">
                      {(() => {
                        const icon = categoryData?.icon;
                        if (typeof icon === 'string') {
                          return <span className="material-symbols-outlined shop-icon text-stone-400 mr-1">{icon}</span>;
                        } else if (icon) {
                          return <PhosphorIcon icon={icon} weight="regular" className="shop-icon text-stone-400 mr-1" />;
                        } else {
                          return <span className="material-symbols-outlined shop-icon text-stone-400 mr-1">help_outline</span>;
                        }
                      })()}
                      {categoryData?.name || category}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
    
    <span>sorted by</span>
    
    {/* Sort Dropdown */}
    <div className="relative inline-block">
      <button
        onClick={() => {
          closeAllDropdowns();
          setIsSortDropdownOpen(!isSortDropdownOpen)
        }}
        className="bg-stone-100 border border-stone-400 text-stone-600 text-xs 
        font-medium inter uppercase tracking-wider rounded-md px-3 py-1 cursor-pointer 
        hover:bg-stone-200 focus:outline-none focus:border-stone-600 focus:ring-2 focus:ring-stone-600/10 
        flex items-center justify-between min-w-fit"
      >
        <span className="flex items-center">
          <span className="material-symbols-outlined mr-1 leading-none">sort</span>
          {inventorySort === 'alpha' ? 'Alphabetical' : 
           inventorySort === 'price-asc' ? 'Price: Low to High' : 
           'Price: High to Low'}
        </span>
        <span className="material-symbols-outlined ml-2 leading-none" style={{fontSize: '16px'}}>
          {isSortDropdownOpen ? 'expand_less' : 'expand_more'}
        </span>
      </button>
     
      {isSortDropdownOpen && (
        <div className="dropdown-menu absolute z-10 mt-1 bg-stone-50 border border-stone-300 rounded-lg shadow-lg">
          <ul className="py-0.5 text-xs text-stone-700">
            {[
              { value: 'alpha', label: 'Alphabetical', icon: 'sort_by_alpha' },
              { value: 'price-asc', label: 'Price: Low to High', icon: 'trending_up' },
              { value: 'price-desc', label: 'Price: High to Low', icon: 'trending_down' }
            ].map((option) => (
              <li key={option.value}>
                <button
                  onClick={() => {
                    closeAllDropdowns();
                    setInventorySort(option.value);
                    setIsSortDropdownOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-1.5 hover:bg-stone-100 text-stone-600 font-medium inter uppercase tracking-wider ${
                    inventorySort === option.value ? 'bg-stone-100' : ''
                  }`}
                >
                  <span className="flex items-center">
                    <span className="material-symbols-outlined shop-icon text-stone-400 mr-1">{option.icon}</span>
                    {option.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </div>
</div>
  </div>
  
  <div className="space-y-3">
    {getCombinedInventory().map((item, index) => (
      <div 
        key={`${item.type}-${index}-${item.name}`} 
        className={`${getRarityColors(item.level).background} border rounded-lg p-4 transition-colors`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            {/* Item Icon */}
            <div className="flex-shrink-0 mt-1">
              {(() => {
                const iconValue = getIconForItem(item.name);
                const IconComponent = getIconComponent(item.name);
                const colors = getRarityColors(item.level);
                
                if (iconValue === 'phosphor') {
                  return <PhosphorIcon icon={IconComponent} size={24} className={colors.textIcon} />;
                } else {
                  return (
                    <span className={`material-symbols-outlined ${colors.textIcon}`} style={{fontSize: '24px'}}>
                      {iconValue}
                    </span>
                  );
                }
              })()}
            </div>
            
            {/* Item Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h4 className={`font-medium ${getRarityColors(item.level).text} m-0`}>
                  {item.name}
                </h4>
                <span className={getRarityBadgeClass(item.level)}>
                  {item.level}
                </span>
              </div>
              
              {item.details && (
                <p className={`text-sm ${getRarityColors(item.level).textLight} m-0 leading-relaxed`}>
                  {item.details}
                </p>
              )}
            </div>
          </div>
          
          {/* Price */}
          <div className="text-right">
            <div className={`font-medium ${getRarityColors(item.level).text}`}
                dangerouslySetInnerHTML={{ __html: item.adjustedPrice }}>
            </div>
            {shopkeeper.priceModifier !== 0 && (
              <div className={`text-xs opacity-70 mt-1 ${getRarityColors(item.level).textIcon}`}>
                Original: {item.basePrice}
              </div>
            )}
          </div>
          </div>
        </div>
    ))}
    
    {getCombinedInventory().length === 0 && (
      <div className="text-center py-8 text-stone-500">
        <span className="material-symbols-outlined mb-2 block" style={{fontSize: '48px'}}>inventory_2</span>
        <p>No items match the selected category.</p>
      </div>
    )}
  </div>
</div>

          {/* Shop Till Card */}
          <div className="shopkeeper-card rounded-md shadow-sm p-6 mb-6">
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
        </>
      )}
                </div>

      )}
      
export default ShopkeeperGenerator;