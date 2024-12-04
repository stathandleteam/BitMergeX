// WalletCard.tsx
import React, { useState } from 'react';
import { FaEthereum, FaRegCopy } from 'react-icons/fa';
import { IoIosArrowForward } from 'react-icons/io';
import styles from './WalletCard.module.scss';

interface Slide {
  id: number;
  icon: string;
  text: string;
  tokenAddress: string;
}

const slides: Slide[] = [
  { id: 1, icon: "⚡", text: "Stacks", tokenAddress: '0x3eeB455d...4D22003a18' },
  { id: 2, icon: "💎", text: "Bitcoin", tokenAddress: '0x3ee3425d...4D220ew332a18' },
 ];

const WalletCard: React.FC = () => {

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNext = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentSlide((prev: any) => (prev + 1) % slides.length);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  return (

    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.totalBalanceContainer}>
          <span className={styles.totalBalance}>Total Balance</span>
          <div className={styles.balance}>$ 0.00</div>
        </div>
       
      </div>

      <div className={styles.addressContainer}>
        <span className={styles.address}>
         { slides[currentSlide].tokenAddress }
        </span>
        <span className={styles.copyIcon}>
          <FaRegCopy />
          
        </span>
      </div>
      
      
      <div className={styles.swipeAddressContainer}>
        <div className={`${styles.badge} ${isAnimating ? styles.animating : ''}`} onClick={handleNext}>
          <span className={styles.icon}> {slides[currentSlide].icon} </span>
          <span>{slides[currentSlide].text}</span>
        </div>

        <button className={styles.arrowButton} onClick={handleNext} disabled={isAnimating}>
          <IoIosArrowForward />
        </button>
      </div>


    </div>
  );
};

export default WalletCard;