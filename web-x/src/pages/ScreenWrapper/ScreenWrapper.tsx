import React, { ReactNode } from 'react'
import styles  from './ScreenWrapper.module.scss'

const ScreenWrapper = ({children}: {children: ReactNode}) => {
  return (
    <div className={styles['home-page']}>
      <div className={styles['body']}>
        {children}
      </div>
    </div>
  )
}

export default ScreenWrapper