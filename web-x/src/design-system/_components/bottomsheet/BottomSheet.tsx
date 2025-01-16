// BottomSheet.js
import React, { useEffect, useRef, useState } from 'react';
import styles from './BottomSheet.module.scss';

type Props = {
    children: React.ReactNode;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    defaultHeight?: string|number;
    style?: React.CSSProperties;
}

const BottomSheet = ({children, isOpen, setIsOpen, defaultHeight = 80, style}: Props) => {

  const sliderRef = useRef<HTMLDivElement>(null); // Ref for the slider pane

  useEffect(() => {
    if (isOpen) {
      // Prevent scrolling on the body element when the pane is open
      document.body.style.overflow = 'hidden';
    } else {
      // Allow scrolling on the body element when the pane is closed
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    // Store initial touch position
    const startY = e.touches[0].clientY;
  
    const handleTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      // Calculate the distance moved
      const deltaY = currentY - startY;
  
      if (deltaY > 50) {
        // If the user has dragged down by at least 50px, close the slider pane
        // Call a function to close the slider pane
        // Example: handleClose();
        isOpen && setIsOpen(false)
      }
    };
  
    const handleTouchEnd = () => {
      // Remove event listeners when touch ends
      sliderRef.current?.removeEventListener('touchmove', handleTouchMove);
      sliderRef.current?.removeEventListener('touchend', handleTouchEnd);
    };
  
    sliderRef.current?.addEventListener('touchmove', handleTouchMove);
    sliderRef.current?.addEventListener('touchend', handleTouchEnd);
  };

  const bottomSheetContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      event.preventDefault();
      if (bottomSheetContentRef.current && !bottomSheetContentRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [])

  return (
    <>
        <div className={`${styles['bottom-sheet']} ${isOpen ? `${styles['open']} ${styles['height-'+defaultHeight]}` : ''}`}
          ref={sliderRef} // Attach the ref to the slider pane
          onTouchStart={handleTouchStart} // Attach touch event handler
          style={{ ...style}}
        >
          <div ref={bottomSheetContentRef} style={{ position: 'relative', width: '100%', height: 'fit-content'}}>
          {children}
          </div>
        </div>
    
        {isOpen && <div
          className={`${styles.backdrop}`}
          // style = {{background: 'black', opacity: 0.3, zIndex: 1}}
        />}
    </>
  );
};

export default BottomSheet;