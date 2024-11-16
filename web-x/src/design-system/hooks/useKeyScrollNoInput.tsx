import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'

interface SuggestionItem {
  word: string;
  // other properties
}

function useKeyScrollNoInput({onClickItem2, setSelectedWord, suggestionListing, dropdownRef, setShowDropdown, showDropdown}:
  {onClickItem2: Function, setSelectedWord: Dispatch<string>, suggestionListing: SuggestionItem[], dropdownRef: any, setShowDropdown: Dispatch<SetStateAction<boolean>>, showDropdown?: boolean}) {

  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [lastCount, setLastCount] = useState(0);
  const [mouseEventDisabled, setMouseEventDisabled] = useState(false);
  
  const handleSelection = useCallback((selectIndex: number) => {
    const selectedItem = suggestionListing[selectIndex];
    if (focusedIndex && (focusedIndex < lastCount) || !selectedItem) return resetSearchComplete();
    // if (focusedIndex <= -1) return;
    setFocusedIndex(-1);
    onClickItem2(selectedItem.word, selectedItem);
    resetSearchComplete();
    setMouseEventDisabled(true);
  }, [focusedIndex, lastCount, onClickItem2, suggestionListing]);

  const resetSearchComplete = useCallback(() => {
    setFocusedIndex(-1);
  }, []);

  const handleKeyDown = useCallback((e: any) => {
    let nextIndexCount = 0;

    switch (e.key) {
      case "Enter":
        e.preventDefault();
        handleSelection(focusedIndex);
        setShowDropdown(false);

        break;

      case "ArrowUp":
        e.preventDefault();

        nextIndexCount = (focusedIndex + suggestionListing.length - 1) % suggestionListing.length;
        setLastCount(nextIndexCount);

        if (nextIndexCount > -1 && suggestionListing) {
          // const selectedItem = suggestionListing[nextIndexCount];
          // selectedItem && setSelectedWord(selectedItem.word);
        }
        break;

      case "ArrowDown":
        e.preventDefault();
        nextIndexCount = (focusedIndex + 1) % suggestionListing.length;
        setLastCount(nextIndexCount);

        if (nextIndexCount > -1 && suggestionListing) {
          // const selectedItem = suggestionListing[nextIndexCount];
          // selectedItem && setSelectedWord(selectedItem.word);
        }

        break;
        
    }

    setFocusedIndex(nextIndexCount);
  }, [focusedIndex, handleSelection, setSelectedWord, suggestionListing]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      event.preventDefault();
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setFocusedIndex(-1);
      }
    };
    
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [handleKeyDown]);

  return {handleKeyDown, handleSelection, focusedIndex, mouseEventDisabled, setMouseEventDisabled };
}

export default useKeyScrollNoInput;