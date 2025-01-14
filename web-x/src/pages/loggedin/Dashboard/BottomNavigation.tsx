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
import { useRouter } from '@/context/routing/RouterContext';
import { TransactionProvider } from '../StxDetails/context/TransactionContext';
import SettingsPage from '../settings/SettingsPage';
import { ROUTES } from '@/context/routing/constants';
import ComingSoonPage from '../ComingSoonPage/ComingSoonContent';
import { useAccount } from '@/context/stxfetch/AccountContext';

type NavigationTab = 'wallet' | 'assets' | 'explore' | 'settings';

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


  const {
    accountDetails,
    accountBalance,
    transactionHistory,
    fetchAccountDetails,
    fetchAccountBalance,
    fetchTransactionHistory,
  } = useAccount();

  useEffect(() => {
    (async ()=>{
      await fetchAccountDetails();
      await fetchAccountBalance();
      await fetchTransactionHistory();  
    })()
  }, []);
  
  return (
    <div className={styles.walletSection}>
      <SwitchAccount accountType="Testnet" accountName="Account Name" />
      <WalletCard accountBalance = {accountBalance} />
      <WalletNavigation onClick = {onClick} />
      <div className={styles.tokenList}>
        <TokenBalance
          symbol="STX"
          name="Stacks"
          balance={parseInt(accountBalance.stxBalance.toFixed(0))}
          fiatValue={parseInt(accountBalance.usdBalance.toFixed(2))}
          icon={<img className={styles.logo} src={STXLogo} alt="" />}
          onClick={()=>handleNavigation(ROUTES.STX_DETAILS)}  
        />
        <TokenBalance
          symbol="BTC"
          name="Bitcoin"
          balance={0.00}
          fiatValue={0.00}
          icon={<img className={styles.logo} src={BTCLogo} alt='btc' />}
          onClick={()=>handleNavigation(ROUTES.BTC_DETAILS)}
        />
      </div>
      
    </div>
)};

const BottomNavigation: React.FC = () => {

  const [keyMenu, setKeyMenu] = useState('')

  const [activeTab, setActiveTab] = useState<NavigationTab>('wallet');

  const [postDrawerToggle, setPostDrawerStateClick] = useState(false);

  const { navigate, previousRoute } = useRouter();

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
          handleNavigation(ROUTES.STX_DETAILS);
          break;
        case 'BTC':
          handleNavigation(ROUTES.BTC_DETAILS);
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
            onClick = {()=>handleNavigation(ROUTES.STX_DETAILS)}
          />
          <TokenBalance
            symbol="BTC"
            name="Bitcoin"
            balance={0.001416}
            fiatValue={5.42}
            icon={<FaEthereum />}
            onClick = {()=>handleNavigation(ROUTES.BTC_DETAILS)}

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
          onClick = {()=>handleNavigation(ROUTES.STX_DETAILS)}
      />
      <TokenBalance
        symbol="BTC"
        name="Bitcoin"
        balance={0.001416}
        fiatValue={5.42}
        icon={<FaEthereum />}
        onClick = {()=>handleNavigation(ROUTES.BTC_DETAILS)}

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

  useEffect(() => {
    switch (previousRoute) {
      case ROUTES.NETWORK_SETTINGS_SCREEN:
      case ROUTES.PRIVATE_KEY_SCREEN:
      case ROUTES.HELP_SUPPORT_SETTINGS_SCREEN:
        setActiveTab("settings");
        break;
    
      default:
        break;
    }
  }, [])
  

  return (
    <div className={styles.containerr}>
      <main className={styles.content}>
        {activeTab === 'wallet' && <WalletSection onClick={onClick} />}
        {activeTab === 'assets' && <ComingSoonPage pageHeading={'Assets'}  />}
        {activeTab === 'explore' && <ComingSoonPage pageHeading={'Explore'}  />}
        {activeTab === 'settings' && <SettingsPage/>}
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
          label="Assets"
          isActive={activeTab === 'assets'}
          onClick={() => setActiveTab('assets')}
        />
        <NavItem
          icon={<BiGlobe />}
          label="Explore"
          isActive={activeTab === 'explore'}
          onClick={() => setActiveTab('explore')}
        />
        <NavItem
          icon={<BiUser />}
          label="Settings"
          isActive={activeTab === 'settings'}
          onClick={() => setActiveTab('settings')}
        />
      </nav>
      
      { bottomSheetDisplay }

    </div>
  );
};

export default BottomNavigation;