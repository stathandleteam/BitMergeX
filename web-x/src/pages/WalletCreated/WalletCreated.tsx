import { Button } from '@/design-system/_components/Button/Button';
import styles from './WalletCreated.module.scss'
import { CiCircleCheck } from "react-icons/ci";
import { useRouter } from '@/routing/RouterContext';
import { ROUTES } from '@/routing/constants';
import { useEffect, useState } from 'react';

const WalletCreated = () => {

  const { navigate, params } = useRouter();

  const previousScreen = params?.previous_screen;

  const handleNavigation = async (route: string) => {
    await navigate(route);
  };

  const [heading, setHeading] = useState({ heading: 'Wallet Created', description: 'Your Wallet is now successfully created!' })

  useEffect(() => {
    if (previousScreen === ROUTES.SEED_PHRASE_RECOVER) {
      setHeading({ heading: 'Wallet Restored', description: 'Your Wallet is now successfully restored!' })
    } if (previousScreen === ROUTES.SEED_PHRASE_CONFIRM) {
      setHeading({ heading: 'Wallet Created', description: 'Your Wallet is now successfully created!' })
    }
  }, [previousScreen])


  return (
    <div className={styles['home-page']}>
      <div className={styles['body']}>

        <div className={styles['top-layer']}>

          <span className={styles['onboarding-title']}>
            {/* Welcome to BitmergeX */}
            <CiCircleCheck size={100} color={"#23B281"} />
          </span>
          <span className={styles['onboarding-title']} >{heading.heading}</span>

          <span className={styles['onboarding-subtitle']}>
            {heading.description}
          </span>

        </div>

        <div className={styles['onboarding-buttons']}>
          <Button variant="primary" style={{ width: '100%' }} onClick={() => handleNavigation(ROUTES.LOGIN)}>GO TO LOGIN</Button>
        </div>

      </div>
    </div>
  )
}

export default WalletCreated;