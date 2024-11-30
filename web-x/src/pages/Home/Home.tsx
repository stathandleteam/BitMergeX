import styles from './Home.module.scss'
import Logo from '@/design-system/_components/Logo/Logo'
import { Button } from '@/design-system/_components/Button/Button'
import { useRouter } from '@/routing/RouterContext'
import { ROUTES } from '@/routing/constants'
import { StxWalletService } from '@/app/services/stx-wallet-service'

interface Props {
  id?: string;
}

const Home = ({ id }: Props) => {

  const { navigate } = useRouter();

  const handleSignUpNavigation = async () => {

    const seedPhrase = await StxWalletService.getMnemonic()
    const result = seedPhrase.split(/\s/g).reduce((curr: any, phrase: any, currentIndex: number) => {
      return { ...curr, [currentIndex + 1]: phrase }
    }, {})

    await navigate(
      ROUTES.SEED_PHRASE_CREATE
      , { id: '123', seedPhrase: result });

  };

  const handleSignInNavigation = async () => {
    await navigate(ROUTES.SEED_PHRASE_RECOVER, { id: '123' });
  };

  return (
    <div className={styles['home-page']}>
      <div className={styles['body']}>

        <div className={styles['top-layer']}>

          <Logo size={64} />

          <span className={styles['onboarding-title']}>
            Welcome to BitmergeX
          </span>


          <span className={styles['onboarding-subtitle']}>
            Your secure, non-custodial wallet for reliable crypto management. Enjoy a smooth, user-friendly experience designed for the future of finance.
          </span>
        </div>

        <div className={styles['onboarding-buttons']}>
          <Button variant="primary" style={{ width: '100%' }} onClick={handleSignUpNavigation} >Create Account</Button>
          <Button variant="secondary" style={{ width: '100%' }} onClick={handleSignInNavigation}>Import Existing Wallet</Button>
        </div>
      </div>
    </div>
  )
}

export default Home