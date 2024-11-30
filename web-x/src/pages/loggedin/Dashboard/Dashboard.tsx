import React from 'react'
import styles  from './Dashboard.module.scss'
import BottomNavigation from './BottomNavigation'
import { TransactionProvider } from '../StxDetails/context/TransactionContext'

const Dashboard = () => {
  return (
    <div className={styles['home-page']}>
      <div className={styles['body']}>
         <BottomNavigation />

        
      </div>
    </div>
  )
}

export default Dashboard