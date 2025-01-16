import { store } from "@/app/store";
import { priceApi } from "@/services/priceApi";
    
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

    const shortenToken = (token:any)=>{
      return token.slice(0, 5)+ "..." +token.slice(34, )
    }


    function shortenAddress(address: string, length: number=6): string {
      if (address.length <= 10) {
        return address; // If the address is short enough, return it as is
      }
      
      const firstPart = address.slice(0, length); // Take first 6 characters
      const lastPart = address.slice(-length); // Take last 4 characters
      
      return `${firstPart}...${lastPart}`;
    }




    export {
    loadImg,
    shuffleArray,
    prepareSeedPhrase,
    shortenToken,
    shortenAddress,
  }


