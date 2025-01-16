// src/pages/SettingsPage.tsx
import React from 'react';
import styles from './SettingsPage.module.scss';
import { 
  FaCog, 
  FaLock, 
  FaKey, 
  FaShieldAlt, 
  FaWallet, 
  FaExchangeAlt, 
  FaNetworkWired, 
  FaQuestionCircle 
} from 'react-icons/fa';

import { LuNetwork } from "react-icons/lu";
import { useRouter } from '@/context/routing/RouterContext';

// Define the structure for a settings item
interface SettingsItem {
  id: string;
  route: string;
  title: string;
  icon: React.ElementType;
  description: string;
}

const SettingsPage: React.FC = () => {

    const { navigate } = useRouter();

    // Predefined settings items for a non-custodial wallet
  const settingsItems: SettingsItem[] = [
    // {
    //   id: 'security',
    //   title: 'Security Settings',
    //   icon: FaLock,
    //   description: 'Manage wallet security, set up additional protection'
    // },
    {
      id: 'network',
      route: "/network-settings",
      title: 'Network Settings',
      icon: LuNetwork,
      description: 'Manage wallet network for Devnet, Testnet and Mainnet'
    },

    {
      id: 'private-keys',
      route: "/private-key-settings",
      title: 'Private Key Management',
      icon: FaKey,
      description: 'View, backup, and manage your private keys'
    },
    // {
    //   id: 'wallet-connect',
    //   title: 'Wallet Connect',
    //   icon: FaNetworkWired,
    //   description: 'Manage connected dApps and networks'
    // },
    // {
    //   id: 'transaction-settings',
    //   title: 'Transaction Preferences',
    //   icon: FaExchangeAlt,
    //   description: 'Configure transaction speeds and gas preferences'
    // },
    // {
    //   id: 'advanced-protection',
    //   title: 'Advanced Security',
    //   icon: FaShieldAlt,
    //   description: 'Additional security layers and advanced protections'
    // },
    // {
    //   id: 'wallet-recovery',
    //   title: 'Recovery Options',
    //   icon: FaWallet,
    //   description: 'Backup and recovery method settings'
    // },
    {
      id: 'help-support',
      route: "/help-support",
      title: 'Help & Support',
      icon: FaQuestionCircle,
      description: 'Get assistance and access support resources'
    }
  ];

  // Handler for selecting a settings item
  const handleSettingSelect = (route: string) => {
    console.log(`Selected setting: ${route}`);
    // Implement navigation or modal logic here
    navigate(route);

  };

  return (
    <div className={styles.settingsContainer}>
      <header className={styles.header}>
        <FaCog className={styles.headerIcon} />
        <span role = "heading" className = {styles["h1"]}>Wallet Settings</span>
      </header>
      
      <div className={styles.settingsList}>
        {settingsItems.map((setting) => (
          <div 
            key={setting.id} 
            className={styles.settingsItem}
            onClick={() => handleSettingSelect(setting.route)}
          >
            <div className={styles.settingsItemContent}>
              <setting.icon className={styles.settingsItemIcon} />
              <div className={styles.settingsItemText}>
                <span className = {styles['h3']}>{setting.title}</span>
                <p>{setting.description}</p>
              </div>
            </div>
            <div className={styles.settingsItemChevron}>›</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;