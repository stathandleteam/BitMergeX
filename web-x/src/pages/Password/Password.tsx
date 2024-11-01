import styles  from './Password.module.scss'
import Logo from '@/design-system/_components/Logo/Logo'
import { Button } from '@/design-system/_components/Button/Button'
import { useRouter } from '@/routing/RouterContext'
import { ROUTES } from '@/routing/constants'
import { InputField } from '@/design-system/_components/InputField/InputField'
import BackIcon from '@/design-system/_components/BackIcon/BackIcon'
import { PiPasswordDuotone } from "react-icons/pi";
import { Input } from '@/design-system/_components/PasswordField/PasswordField'
import usePassword from './usePassword'
import PasswordStrengthMeter from '@/design-system/_components/PasswordStrengthMeter/usePasswordStrengthMeter'
import usePasswordStrengthMeter from '@/design-system/_components/PasswordStrengthMeter/usePasswordStrengthMeter'
import { PasswordComponents, Requirements } from './_components/PasswordComponents'
import { stxWalletDbService } from '@/app/services/stx-wallet-service'
import { useEffect, useState } from 'react'


interface Props {
  id?: string;
}

const Password = ({ id }: Props) => {


    const { navigate, params } = useRouter();

    const seedPhrases: any = params?.seedPhrase
    const previousScreen: any = params?.previous_screen


  const handleNavigation = async (route: string) => {
    let mainAddress;

    console.log("previousScreen", previousScreen)
    
    if (previousScreen === ROUTES.SEED_PHRASE_RECOVER){
      const {  address } = await stxWalletDbService.createWallet(formData.password, seedPhrases.trim() || '');

      mainAddress = address;
      console.log("mainAddress", mainAddress);

    } else {
      const seedPhrase:any = Object.values(seedPhrases).reduce((curr, phrase, currentIndex) =>{
        return `${curr} ${phrase}`
      }, '')
      if (seedPhrase && formData.password){
  
        const {  address } = await stxWalletDbService.createWallet(formData.password, seedPhrase.trim() || '');
        mainAddress = address
        console.log("mainAddress", mainAddress);

      }

    }

    if (mainAddress){
      console.log("Account Successfully created");

      navigate(route);
    } else {

      console.log("Something went wrong");

    }

  };


  const {
    formData,  
    handleInputChange,
    errors,
    showPassword, 
    setShowPassword,
    showConfirmPassword, 
    setShowConfirmPassword,
    handleSubmit,
    setFormData
  } = usePassword()

  const {strength, strengthLabel, strengthColor} = usePasswordStrengthMeter(
    {password: formData.password,  
      setPassword : (password: string)=>setFormData({...formData, password})
    });
    
  return (
    <div className={styles['home-page']}>
      
      <div className={styles['body']}>

          <div className={styles['back-icon']}>
            <BackIcon onClick={()=>handleNavigation(ROUTES.SEED_PHRASE_CONFIRM)} />
          </div>
          

          <div className={styles['top-layer']}>
          <Logo size={64} />

            
<span className={styles['onboarding-title']}> 
   {/* Welcome! */}
   <PiPasswordDuotone size={24} />

</span>
<span className={styles['onboarding-subtitle']}>
    Enter a Password to protect your wallet!
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

                <div className={styles['strength-meter']}>
                  <PasswordComponents strength={strength} strengthLabel={strengthLabel} strengthColor={strengthColor} />
                </div>

                <Input
                  label = "Password"
                  type={ showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={ formData.password}
                  onChange={ handleInputChange }
                  error={ errors.password }
                  showPasswordToggle
                  showPassword={ showPassword }
                  onTogglePassword={ () => setShowPassword(!showPassword) }
                />
            <div className={styles['strength-meter-wrapper']}>
              <Requirements password={formData.password} />
            </div>
                {/* <PasswordStrengthMeter password={formData.password} setPassword = {(password: string)=>setFormData({...formData, password})} /> */}

                {/* <InputField 
                  label="Confirm Password"
                  placeholder="Enter your Password"
                  helperText="" //This will be your display name
                  variant="secondary"
                  type='text'
                /> */}

                <Input
                  label = "Confirm Password"
                  type={ showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={ formData.confirmPassword}
                  onChange={ handleInputChange }
                  error={ errors.confirmPassword }
                  showPasswordToggle
                  showPassword={ showConfirmPassword }
                  onTogglePassword={ () => setShowConfirmPassword(!showConfirmPassword) }
                />

                <Button variant="primary" style={{width: '100%'}} onClick={()=>handleNavigation(ROUTES.WALLET_CREATED)}>{`${previousScreen === ROUTES.SEED_PHRASE_RECOVER ?'Restore':"Create" } Account`}</Button>

            </div>

          </div>
    </div>
  )
}

export default Password