export const getDisplayMood = (baseMood: string, charisma: number): string => {
    const moodScale = [
      "dismissive",
      "doubtful",
      "reserved",
      "open",
      "welcoming",
    ];
    const currentIndex = moodScale.indexOf(baseMood);
    if (currentIndex === -1) return baseMood;

    let modifier = 0;
    if (charisma >= 3) modifier = Math.floor((charisma - 1) / 2);
    else if (charisma <= -3) modifier = Math.ceil((charisma + 1) / 2);

    const newIndex = Math.max(
      0,
      Math.min(moodScale.length - 1, currentIndex + modifier)
    );
    return moodScale[newIndex];
  };