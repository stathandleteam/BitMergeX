// WalletNavigation.tsx
import React, { ReactNode } from 'react';
import { 
  BiTransfer, 
  BiHistory 
} from 'react-icons/bi';
import { 
  RiQrCodeLine 
} from 'react-icons/ri';
import { 
  FaDiamondTurnRight 
} from 'react-icons/fa6';
import styles from './WalletNavigation.module.scss';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: (label: string) => void;
}

export const NavItem: React.FC<NavItemProps> = ({ icon, label, onClick }) => (
  <button className={styles.navItem} onClick={()=>onClick(label)}>
    <div className={styles.iconWrapper}>
      {icon}
    </div>
    <span className={styles.label}>{label}</span>
  </button>
);

interface WalletNavigationProps {
  onClick: (label: string) => void;
}

const WalletNavigation: React.FC<WalletNavigationProps> = ({onClick}) => {
  return (
    <div className={styles.navigation}>
      <NavItem 
        icon={<BiTransfer />}
        label="Transfer"
        onClick = {onClick}
      />
      <NavItem 
        icon={<RiQrCodeLine />}
        label="Receive"
        onClick = {onClick}
      />
      <NavItem 
        icon={<BiHistory />}
        label="Activity"
        onClick = {onClick}
      />
      <NavItem 
        icon={<FaDiamondTurnRight />}
        label="Stake"
        onClick = {onClick}
      />
    </div>
  );
};

export default WalletNavigation;