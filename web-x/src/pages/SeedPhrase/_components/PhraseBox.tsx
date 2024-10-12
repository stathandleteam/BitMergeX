import React from 'react'
import styles from './PhraseBox.module.scss';
type Props = {
  value: string; 
  name?:string; 
  onChange?: any; 
  match?: boolean; 
  isInput?: boolean;
}

const PhraseBox = ({match, isInput, value, name, onChange}: Props) => {
  return (
    
      !isInput
      ?<span className={`${styles['box-is-not-input']} ${match ? styles['selected'] : ''}`}>
        {value}
    </span>: <input className={styles['box']} name={name} value={value} onChange={onChange} />
  )
}

export default PhraseBox