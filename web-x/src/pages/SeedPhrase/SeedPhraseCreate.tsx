import { Button } from '@/design-system/_components/Button/Button'
import PhraseBox from './_components/PhraseBox'
import PopUpCard from './_components/PopUpCard'
import styles from './SeedPhraseCreate.module.scss'
import { useRouter } from '@/routing/RouterContext'
import { ROUTES } from '@/routing/constants'
import { useState } from 'react'
import { seedPhrases } from '@/routing/seed-phrase-example'


const SeedPhraseCreate = () => {

    const { navigate } = useRouter();

    const handleSignUpNavigation = () => {
      navigate(ROUTES.SIGNUP, { id: '123' });
    };
  
    const handleSignInNavigation = () => {
      navigate(ROUTES.LOGIN, { id: '123' });
    };

    const [reveal, setReveal] = useState(false)
    const [manualBackup, setManualBackup] = useState(false)

    const handleBackupManually = () => {
      setManualBackup(true)
    }

  return (
    <div className={styles['seed-phrase-create-page']}>

        <div className={styles['body']}>

            <div className={styles['header']}>
                <span className={styles['onboarding-title']}> 
                    Write down your secret recovery phrase
                </span>
                <span className={styles['onboarding-subtitle']}>
                Write down your recovery phrase and store it safely. You’ll confirm it in the next step.
                </span>

            </div>

            <div className={styles['body']}>
                <div className={styles['grid']} >
                  {Array.from({ length: 12 }, (_, rowIndex) => <PhraseBox isInput = {true} value= {seedPhrases[rowIndex+1]} /> )}
                </div>

        {!reveal ? <PopUpCard 
          heading='Tap to reveal your seed recovery phrase' 
          body=' Make sure no one is watching you'
          handleSetReveal = {setReveal}
          buttonLabel='Reveal'
          />: null}

      {manualBackup ? <PopUpCard 
          heading='Safety Alert' 
          body=' Screenshots aren"t a safe way to keep track of your Secret Recovery Phrase. Store it somewhere  that isn"t backedup online to keep your account safe'
          handleSetReveal = {setManualBackup} 
          cssStyles={{border:" 0.05px solid white"}}
          buttonLabel='Download'
          logoSize = {30}
          canTapOutside = {true}
          />: null}
   
        <div className={styles['onboarding-buttons']}>
                <Button variant="primary" style={{width: '100%'}} onClick={handleSignInNavigation} disabled = {!reveal}>Backup With Google Drive</Button>
                <Button variant="secondary" style={{width: '100%'}} onClick={handleBackupManually} disabled = {!reveal}>Backup manually</Button>
            </div>


            </div>

            {manualBackup &&<div
              className={`${styles['backdrop']}`}
            />}

        </div>
    </div>
  )
}

export default SeedPhraseCreate