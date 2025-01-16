import React from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import styles from './Loading.module.scss';

const Loading = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.content}>
        <AiOutlineLoading3Quarters 
          size={32}
          className={styles.spinner}
        />
        <p className={styles.text}>Loading...</p>
      </div>
    </div>
  );
};

export default Loading;