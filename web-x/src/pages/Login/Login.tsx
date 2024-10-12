import styles  from './Login.module.scss'
import Logo from '@/design-system/_components/Logo/Logo'
import { Button } from '@/design-system/_components/Button/Button'
import { useRouter } from '@/routing/RouterContext'
import { ROUTES } from '@/routing/constants'
import { InputField } from '@/design-system/_components/InputField/InputField'

interface Props {
  id?: string;
}

const Login = ({ id }: Props) => {

  const { navigate } = useRouter();


  const handleNavigation = () => {
    navigate(ROUTES.DASHBOARD, { id: '123' });
  };

  return (
    <div className={styles['home-page']}>
      <div className={styles['body']}>
          <Logo size={64} />

            
            <span className={styles['onboarding-title']}> 
               Welcome!
            </span>
            <span className={styles['onboarding-subtitle']}>
                Login to Continue!
            </span>

            <div className={styles['onboarding-buttons']}>
                {/* <Button variant="primary" style={{width: '100%'}} onClick={handleNavigation}>Login</Button> */}
                <InputField 
                  label="Password"
                  placeholder="Enter your Password"
                  helperText="" //This will be your display name
                  variant="secondary"
                  type='password'
                />


                <Button variant="primary" style={{width: '100%'}} onClick={handleNavigation}>Unlock</Button>
            </div>

          </div>
    </div>
  )
}

export default Login