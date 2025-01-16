// WalletCard.tsx
import React, { useEffect, useState } from 'react';
import { FaEthereum, FaRegCopy } from 'react-icons/fa';
import { IoIosArrowForward } from 'react-icons/io';
import styles from './WalletCard.module.scss';
import { AccountBalanceProps, useAccount } from '@/context/stxfetch/AccountContext';

 interface Props {
  accountBalance: AccountBalanceProps;
 }
const WalletCard = ({accountBalance}: Props) => {


  const {fetchAccountDetails, accountDetails, slides} = useAccount()
  
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
         { <div className={styles.balance}>{`$ ${accountBalance?.usdBalance?.toFixed(2) || '0' || 0}`}</div>}
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
          {/* <span className={styles.icon}> {slides[currentSlide].icon} </span> */}
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