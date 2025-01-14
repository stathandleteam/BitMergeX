// src/pages/ComingSoonContent.tsx
import React, { ReactNode, useState } from 'react';
import { LuNetwork, LuCheck, LuServer, LuGlobe, LuShield } from 'react-icons/lu';
import styles from './ComingSoonContent.module.scss';
import ScreenWrapper from '@/pages/ScreenWrapper/ScreenWrapper';
import BackIcon from '@/design-system/_components/BackIcon/BackIcon';
import { useRouter } from '@/context/routing/RouterContext';
import { ROUTES } from '@/context/routing/constants';
import Logo from '@/design-system/_components/Logo/Logo';

interface Props {
  pageHeading: string;
  showBackIcon?: boolean;
}

const ComingSoonContent = ({pageHeading, showBackIcon =  false}: Props) => {
  const { previousRoute, navigate } = useRouter();

  const handleNavigation = async () => {
    navigate(previousRoute || ROUTES.DASHBOARD, { id: '123' });
  }

  return (

    <div className={styles.networkSettingsContainer}>
      <header className={styles.header}>
       
            {showBackIcon && <div className={styles['back-icon']}>
                <BackIcon onClick={()=>handleNavigation()} />
            </div>
}
            <span className={styles.h1} style={{paddingLeft: showBackIcon?'2rem': ''}}>{pageHeading}</span> 


      </header>

      <div className={styles['top-layer']}>
            <Logo size={40} />


          <span className={styles['onboarding-title']}>
            Coming Soon
          </span>
          <span className={styles['onboarding-subtitle']}>
            We are working very hard to complete it as soon as possible, but you can always use out other cool features.
          </span>

        </div>
    </div>
    // </ScreenWrapper>
  );
};

export default ComingSoonContent;