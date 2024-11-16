// WalletNavigation.tsx
import React from 'react';
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
  onClick?: () => void;
}

export const NavItem: React.FC<NavItemProps> = ({ icon, label, onClick }) => (
  <button className={styles.navItem} onClick={onClick}>
    <div className={styles.iconWrapper}>
      {icon}
    </div>
    <span className={styles.label}>{label}</span>
  </button>
);

const WalletNavigation: React.FC = () => {
  return (
    <div className={styles.navigation}>
      <NavItem 
        icon={<BiTransfer />}
        label="Transfer"
      />
      <NavItem 
        icon={<RiQrCodeLine />}
        label="Receive"
      />
      <NavItem 
        icon={<BiHistory />}
        label="Activity"
      />
      <NavItem 
        icon={<FaDiamondTurnRight />}
        label="Stake"
      />
    </div>
  );
};

export default WalletNavigation;