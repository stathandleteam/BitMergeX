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

    const {
      formData,  
      handleInputChange,
      errors,
      showPassword, 
      setShowPassword,
      showConfirmPassword, 
      setShowConfirmPassword,
      // handleSubmit,
      setFormData,
      validateForm,
      setErrMsg,
      errMsg,
      errRef
    } = usePassword()
  

  const handleNavigation = async (route: string) => {

    try {
      if (!validateForm()) return;
    
      console.log('seedPhrases', seedPhrases)
      
      let mainAddress;
      
      if (previousScreen === ROUTES.SEED_PHRASE_RECOVER){
        const {  address } = await stxWalletDbService.createWallet(formData.password, seedPhrases.trim() || '');
        mainAddress = address;
      } else {
        if (seedPhrases && formData.password){
          const {  address } = await stxWalletDbService.createWallet(formData.password, seedPhrases.trim() || '');
          mainAddress = address
        }
      }
  
      if (mainAddress) navigate(route);
      if (!mainAddress) console.log("Something went wrong");
        
    } catch (error:any) {
      console.log("error", error)      
      setErrMsg(error.message)
    }
  
  };


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

        <span ref = {errRef} className={styles[errMsg?'error-label': '']}>
          {errMsg}
        </span>

          </div>
         

            <div className={styles['onboarding-buttons']}>
                
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