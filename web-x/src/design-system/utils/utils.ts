type SeedPhraseObject = { key: string, value: string };

// Function to reshuffle the seed phrases
export const shuffleArray = (arr: SeedPhraseObject[]): SeedPhraseObject[] => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements at i and j
    }
    return arr;
  };

  