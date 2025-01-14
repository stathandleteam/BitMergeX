import styles from './Login.module.scss'
import Logo from '@/design-system/_components/Logo/Logo'
import { Button } from '@/design-system/_components/Button/Button'
import { useRouter } from '@/context/routing/RouterContext'
import { ROUTES } from '@/context/routing/constants'
import { InputField } from '@/design-system/_components/InputField/InputField'
import BackIcon from '@/design-system/_components/BackIcon/BackIcon'
import { Input } from '@/design-system/_components/PasswordField/PasswordField'
import usePassword from '../Password/usePassword'
import { StxWalletService } from '@/app/services/stx-wallet-service'
import { useAuth } from '@/context/auth/AuthContext'
import { useState } from 'react'

interface Props {
  id?: string;
}


const Login = ({ id }: Props) => {

  const { navigate } = useRouter();
  
  const handleNavigation = async (route: string) => {

    if (route === ROUTES.SEED_PHRASE_RECOVER) {
      const walletReset = await StxWalletService.resetWallet()

      walletReset &&
        await navigate(route, { id: '123' });

    } else {
      await navigate(route, { id: '123' });

    }
  };

  const {
    formData,
    handleInputChange,
    errors,
    showPassword,
    setShowPassword,
    validateForm
  } = usePassword()

  const { isLoggedIn, login, logout } = useAuth();
  const [errMsg, setErrMsg] = useState('');

  const handleLogin = async () => {

    if (validateForm({shouldConfirmPassword: false})) { 
      const {success, error}:any = await login(formData.password);
      // setErrMsg(success)
      
      typeof success === 'string' && setErrMsg(success)

      if (!success) {
        // alert('Login failed');
        setErrMsg(`${error}`)

      } else {

        setErrMsg(`${error}`)

        setTimeout(() => {
          handleNavigation(ROUTES.DASHBOARD)        
        }, 1000); 
      }
    } else {

        setErrMsg("Form invalid")

    }
    // setErrMsg("Form Test")

  };

  return (
    <div className={styles['home-page']}>

      <div className={styles['body']}>

          <div className={styles['back-icon']}>
            {/* <BackIcon onClick={()=>handleNavigation(ROUTES.HOME)} /> */}
          </div>
          
          <div className={styles['top-layer']}>
            <Logo size={64} />


          <span className={styles['onboarding-title']}>
            Welcome!
          </span>
          <span className={styles['onboarding-subtitle']}>
            Login to Continue!
          </span>

        </div>

        <div className={styles['onboarding-buttons']}>
          {/* <Button variant="primary" style={{width: '100%'}} onClick={handleNavigation}>Login</Button> */}
          {/* <InputField 
                  label="Password"
                  placeholder="Enter your Password"
                  helperText="" //This will be your display name
                  variant="secondary"
                  type='password'
                /> */}
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password }
            showPasswordToggle
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />  
          <span style={{color: 'red', fontSize: 12}}>{errMsg}</span>

                <Button 
                  variant="primary" 
                  style={{width: '100%'}} 
                  onClick={handleLogin}
                >
                    Unlock
                </Button>
                <Button 
                  style={{width: '100%', fontSize:12}} 
                  variant="tertiary" 
                  onClick={()=>handleNavigation(
                    ROUTES.SEED_PHRASE_RECOVER
                    // ROUTES.LOGIN
                  ) }
                >
                  Forgot your password?
                </Button>

        </div>

      </div>
    </div>
  )
}

export default Login