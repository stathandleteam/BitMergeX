import styles  from './SignUp.module.scss'
import Logo from '@/design-system/_components/Logo/Logo'
import { Button } from '@/design-system/_components/Button/Button'
import { useRouter } from '@/routing/RouterContext'
import { ROUTES } from '@/routing/constants'

interface Props {
  id?: string;
}

const SignUp = ({ id }: Props) => {

  const { navigate } = useRouter();


  const handleNavigation = () => {
    navigate(ROUTES.DASHBOARD, { id: '123' });
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
                <Button variant="primary" style={{width: '100%'}} onClick={handleNavigation}>Login</Button>
                <Button variant="secondary" style={{width: '100%'}} onClick={handleNavigation}>Create Account</Button>
            </div>

          </div>
    </div>
  )
}

export default SignUp