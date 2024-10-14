import React from 'react'
import styles from './Logo.module.scss'
import { LuBitcoin } from 'react-icons/lu'

const Logo = ({size = 20, ...props}: {size: number}) => {
  return (
    <div className={styles.logo} {...props} style={{width: size*2, height: size*2}} >
        <LuBitcoin size={size} />
    </div>
  )
}

export default Logo