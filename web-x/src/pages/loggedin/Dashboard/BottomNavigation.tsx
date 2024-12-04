// BottomNavigation.tsx
import React, { useEffect, useState } from 'react';
import { 
  BiWallet, 
  BiChart, 
  BiGlobe, 
  BiUser 
} from 'react-icons/bi';
import { FaEthereum } from 'react-icons/fa';
import styles from './BottomNavigation.module.scss';
import STXLogo from '@/assets/images/stx-logo.webp'
import BTCLogo from '@/assets/images/btc.png'

// Import previously created components
import WalletCard from './WalletCard';
import WalletNavigation from './WalletNavigation';
import TokenBalance from './TokenBalance';
import SwitchAccount from './SwitchAccount/SwitchAccount';
import BottomSheet from '@/design-system/_components/bottomsheet/BottomSheet';
import SendBN from '../bottomsheet/SendBN/SendBN';
import { useRouter } from '@/routing/RouterContext';
import { TransactionProvider } from '../StxDetails/context/TransactionContext';

type NavigationTab = 'wallet' | 'market' | 'browser' | 'profile';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => (
  <button 
    className={`${styles.navItem} ${isActive ? styles.active : ''}`}
    onClick={onClick}
  >
    <div className={styles.iconWrapper}>
      {icon}
    </div>
    <span className={styles.label}>{label}</span>
  </button>
);

interface WalletSectionProps {
  onClick: (label: string) => void;
}

const WalletSection: React.FC<WalletSectionProps> = ({onClick}) => { 
  
  const { navigate } = useRouter();

  const handleNavigation = async (route: string) => {
    navigate(route, { id: '123' });
  }


  return (
    <div className={styles.walletSection}>
      <SwitchAccount accountType="Testnet" accountName="Account Name" />
      <WalletCard />
      <WalletNavigation onClick = {onClick} />
      <div className={styles.tokenList}>
        <TokenBalance
          symbol="STX"
          name="Stacks"
          balance={0.00}
          fiatValue={0.00}
          icon={<img className={styles.logo} src={STXLogo} alt="" />}
          onClick={()=>handleNavigation('/stx-details-and-history')}  
        />
        <TokenBalance
          symbol="BTC"
          name="Bitcoin"
          balance={0.00}
          fiatValue={0.00}
          icon={<img className={styles.logo} src={BTCLogo} alt='btc' />}
          onClick={()=>handleNavigation('/btc-details-and-history')}
        />
      </div>
      
    </div>
)};

const BottomNavigation: React.FC = () => {

  const [keyMenu, setKeyMenu] = useState('')

  const [activeTab, setActiveTab] = useState<NavigationTab>('wallet');
  const [postDrawerToggle, setPostDrawerStateClick] = useState(false);

  const { navigate } = useRouter();

  const handleNavigation = async (route: string) => {
    navigate(route, { id: '123' });
  }

  

  const onStackClick = (label: any)=>{
    console.log('label', label)
  }


  const handleBottomSlider = (keyMenu:any)=>{
    const onTransferClick = (label: any)=>{
      console.log("label", label)
      switch (label) {
        case 'STX':
          handleNavigation('/stx-details-and-history');
          break;
        case 'BTC':
          handleNavigation('/btc-details-and-history');
          break;
        default:
          break;
      }
    }

    switch (keyMenu) {
      case 'Transfer':
        return <SendBN>
          <TokenBalance
            symbol="STX"
            name="Stacks"
            balance={1000}
            fiatValue={3000}
            icon={<FaEthereum />}
            onClick = {()=>handleNavigation('/stx-details-and-history')}
          />
          <TokenBalance
            symbol="BTC"
            name="Bitcoin"
            balance={0.001416}
            fiatValue={5.42}
            icon={<FaEthereum />}
            onClick = {()=>handleNavigation('/btc-details-and-history')}

          />
        </SendBN>
      case 'Receive':
        return null

      case 'Stake':
        return <SendBN 
        // onClick = {onStackClick} 
        >
        <TokenBalance
          symbol="STX"
          name="Stacks"
          balance={1000}
          fiatValue={3000}
          icon={<FaEthereum />}
          onClick = {()=>handleNavigation('/stx-details-and-history')}
      />
      <TokenBalance
        symbol="BTC"
        name="Bitcoin"
        balance={0.001416}
        fiatValue={5.42}
        icon={<FaEthereum />}
        onClick = {()=>handleNavigation('/btc-details-and-history')}

      />
        </SendBN>

      default:
        break;
    }
  };
  
  const bottomSheetDisplay = (<BottomSheet isOpen={postDrawerToggle} defaultHeight = {2*15} setIsOpen={setPostDrawerStateClick} style={{zIndex:2}}>
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      {handleBottomSlider(keyMenu)}
    </div>
  </BottomSheet>);

 
  const onClick = (label: any)=>{
    setKeyMenu(label);
    setPostDrawerStateClick(true)
  }

  return (
    <div className={styles.containerr}>
      <main className={styles.content}>
        {activeTab === 'wallet' && <WalletSection onClick={onClick} />}
        {activeTab === 'market' && <div>Market Content</div>}
        {activeTab === 'browser' && <div>Browser Content</div>}
        {activeTab === 'profile' && <div>Profile Content</div>}
      </main>
      
      <nav className={styles.navigation}>
      <NavItem
          icon={<BiWallet />}
          label="Wallet"
          isActive={activeTab === 'wallet'}
          onClick={() => setActiveTab('wallet')}
        />
        <NavItem
          icon={<BiChart />}
          label="Market"
          isActive={activeTab === 'market'}
          onClick={() => setActiveTab('market')}
        />
        <NavItem
          icon={<BiGlobe />}
          label="Browser"
          isActive={activeTab === 'browser'}
          onClick={() => setActiveTab('browser')}
        />
        <NavItem
          icon={<BiUser />}
          label="My Profile"
          isActive={activeTab === 'profile'}
          onClick={() => setActiveTab('profile')}
        />
      </nav>
      
      { bottomSheetDisplay }

    </div>
  );
};

export default BottomNavigation;