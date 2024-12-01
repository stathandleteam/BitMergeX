type SeedPhraseObject = { key: string, value: string };

// Function to reshuffle the seed phrases
const shuffleArray = (arr: SeedPhraseObject[]): SeedPhraseObject[] => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements at i and j
    }
    return arr;
  };

  
  const loadImg = (src: string): Promise<string> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(src);
      // img.onerror = () => reject(new Error("could not load image"));
      img.onerror = () => {
        // Image failed to load, resolve with "error" string
        resolve("error");
      };
    });

    const prepareSeedPhrase = (cellSeedPhrase: any) => {
      const seedPhrase: any = Object.values(cellSeedPhrase).reduce((curr, phrase, currentIndex) => {
        return `${curr} ${phrase}`
      }, '')
    }
    
  export {
    loadImg,
    shuffleArray,
    prepareSeedPhrase
  }


