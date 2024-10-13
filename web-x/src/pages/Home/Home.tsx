import styles  from './Home.module.scss'
import Logo from '@/design-system/_components/Logo/Logo'
import { Button } from '@/design-system/_components/Button/Button'
import { useRouter } from '@/routing/RouterContext'
import { ROUTES } from '@/routing/constants'

interface Props {
  id?: string;
}

const Home = ({ id }: Props) => {

  const { navigate } = useRouter();

  const handleSignUpNavigation = () => {
    navigate(ROUTES.SEED_PHRASE_CREATE, { id: '123' });
  };

  const handleSignInNavigation = () => {
    navigate(ROUTES.LOGIN, { id: '123' });
  };
  return (
    <div className={styles['home-page']}>
      <div className={styles['body']}>
          <Logo size={64} />

            
            <span className={styles['onboarding-title']}> 
               Welcome to BitmergeX
            </span>
            <span className={styles['onboarding-subtitle']}>
            Experience the best of technology with BitmergeX. Our app offers seamless integration, under-friendly interfaces, and top-notch experience.
            </span>

            <div className={styles['onboarding-buttons']}>
                <Button variant="primary" style={{width: '100%'}} onClick={handleSignInNavigation} >Login</Button>
                <Button variant="secondary" style={{width: '100%'}} onClick={handleSignUpNavigation}>Create Account</Button>
            </div>

          </div>
    </div>
  )
}

export default Home