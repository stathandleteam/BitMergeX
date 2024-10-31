import React from 'react'
import styles from './PasswordComponents.module.scss'
import { FaRegCheckCircle } from 'react-icons/fa';

type Props = {
  strength: number;
  strengthLabel: string;
  strengthColor: string; 
}

export const PasswordComponents = ({strengthLabel, strengthColor, strength}: Props) => {

  return (
    <div className={styles.strengthLabel}>
      <span className={styles.strengthText}>{strengthLabel}</span>
      {/* <span className={strengthColor}>
        {strengthLabel}
      </span> */}
      <div 
        className={`${styles.strengthProgress} ${strengthColor}`}
        style={{ width: `${(strength / 4) * 100}px` }}
      />
  </div>
  )
}

export const Requirements = ({password}: {password: string})=>{
  return (<p className={styles.requirements}>
      <span className={`${styles.span} ${password.length >= 8 ? styles.met : ''}`}>
        <span>At least 8 characters</span> <span className={styles.checked}><FaRegCheckCircle/></span>
      </span>
      <span className={`${styles.span} ${/[A-Z]/.test(password) ? styles.met : ''}`}>
        <span> At least one uppercase letter</span> <span className={styles.checked}><FaRegCheckCircle /></span>
      </span>
      <span className={`${styles.span} ${/[a-z]/.test(password) ? styles.met : ''}`}>
        <span> At least one lowercase letter</span> <span  className={styles.checked}><FaRegCheckCircle /></span>
      </span>
      <span className={`${styles.span} ${/[0-9]/.test(password) ? styles.met : ''}`}>
        <span> At least one number</span> <span  className={styles.checked}><FaRegCheckCircle /></span>
      </span>
      <span className={`${styles.span} ${/[^A-Za-z0-9]/.test(password) ? styles.met : ''}`}>
        <span> At least one special character</span> <span  className={styles.checked}><FaRegCheckCircle /></span>
      </span>
   </p>)
}