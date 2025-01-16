// src/pages/NetworkSettingsPage.tsx
import React, { useState } from 'react';
import { LuNetwork, LuCheck, LuServer, LuGlobe, LuShield } from 'react-icons/lu';
import styles from './NetworkSettingsPage.module.scss';
import ScreenWrapper from '@/pages/ScreenWrapper/ScreenWrapper';
import BackIcon from '@/design-system/_components/BackIcon/BackIcon';
import { useRouter } from '@/context/routing/RouterContext';
import { ROUTES } from '@/context/routing/constants';
import { networkStore, setNetworkType } from '@/services/networkStore';
import NetworkManager from '@/services/NetworkManager';
// import { networkStore } from './networkStore';

// Define network types
export type NetworkType = 'mainnet' | 'testnet' | 'devnet';

// Network configuration interface
interface NetworkConfig {
  id: NetworkType;
  name: string;
  description: string;
  icon: React.ElementType;
  rpcUrl: string;
  fullRpcUrl: string;
}

const NetworkSettingsPage: React.FC = () => {
  // Predefined network configurations for Stacks blockchain
  const networks: NetworkConfig[] = [
    {
      id: 'mainnet',
      name: 'Mainnet',
      description: 'Live network with real transactions and value',
      icon: LuGlobe,
      rpcUrl: 'https://api.stacks.co',
      fullRpcUrl: 'https://api.stacks.co/extended/v1',
    },
    {
      id: 'testnet',
      name: 'Testnet',
      description: 'Safe environment for testing applications',
      icon: LuServer,
      rpcUrl: 'https://api.testnet.stacks.co',
        fullRpcUrl: 'https://api.testnet.stacks.co/extended/v1',
    },
    {
      id: 'devnet',
      name: 'Devnet',
      description: 'Local development network',
      icon: LuShield,
      rpcUrl: 'http://localhost:3999',
      fullRpcUrl: 'http://localhost:3999/extended/v1'
    }
  ];

  const { navigate } = useRouter();

  // State to manage current selected network
  // const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>('mainnet');

  // Handler for network selection
  const handleNetworkSelect = async (networkId: NetworkType) => {

    // setSelectedNetwork(networkId);
    setNetworkType(networkId);

    // Additional logic for network switching can be added here
    console.log(`Selected network: ${networkId}`);

    await NetworkManager.storeNetworkType(networkId);

  };


  const handleNavigation = async (route: string) => {
    navigate(route, { id: '123' });
  }

  return (
    <ScreenWrapper>

    <div className={styles.networkSettingsContainer}>
      <header className={styles.header}>
        {/* <LuNetwork className={styles.headerIcon} />
        <span className={styles.h1}>Network Settings</span> */}
            <div className={styles['back-icon']}>
                <BackIcon onClick={()=>handleNavigation(ROUTES.DASHBOARD)} />
            </div>

            <span className={styles.h1}>Network Settings</span> 


      </header>

      <section className={styles.networkSection}>
        <span role = {styles.h2}>Select Network</span >
        <p>Choose the blockchain network for your wallet</p>

        <div className={styles.networkList}>
          {networks.map((network) => (
            <div 
              key={network.id} 
              className={`
                ${styles.networkItem} 
                ${networkStore.networkType === network.id ? styles.networkItemActive : ''}
              `}
              onClick={() => handleNetworkSelect(network.id)}
            >
              <div className={styles.networkItemContent}>
                <network.icon className={styles.networkItemIcon} />
                <div className={styles.networkItemText}>
                  <span className={styles['h3']}>{network.name}</span>
                  {/* <p>{network.description}</p> */}
                  <small className={styles.rpcUrl}>{network.rpcUrl}</small>
                </div>
                {networkStore.networkType === network.id && (
                  <LuCheck className={styles.activeNetworkIcon} />
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* <section className={styles.networkDetailsSection}>
        <span role = "heading" className={styles.h2}>Network Details</span>
        <div className={styles.networkDetails}>
          <div className={styles.networkDetailItem}>
            <span>Current Network:</span>
            <strong>{selectedNetwork.charAt(0).toUpperCase() + selectedNetwork.slice(1)}</strong>
          </div>
          <div className={styles.networkDetailItem}>
            <span>RPC Endpoint:</span>
            <strong>
              {networks.find(n => n.id === selectedNetwork)?.rpcUrl || 'N/A'}
            </strong>
          </div>
        </div>
      </section> */}

      <section className={styles.networkWarning}>
        <span  role = "heading" className={styles.h2}>Important Notice</span>
        <p>
          Switching networks may affect your wallet's functionality. 
          Ensure you understand the implications before changing networks.
        </p>
      </section>
    </div>
    </ScreenWrapper>
  );
};

export default NetworkSettingsPage;