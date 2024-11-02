import { Button } from '@/design-system/_components/Button/Button'
import PhraseBox from './_components/PhraseBox'
import PopUpCard from './_components/PopUpCard'
import styles from './SeedPhraseCreate.module.scss'
import { useRouter } from '@/routing/RouterContext'
import { ROUTES } from '@/routing/constants'
import { useEffect, useState } from 'react'
// import { seedPhrases } from '@/routing/seed-phrase-example'
import BackIcon from '@/design-system/_components/BackIcon/BackIcon'
import { SeedPhraseMap } from '@/routing/seed-phrase-example'
import { StxWalletService } from '@/app/services/stx-wallet-service'


const SeedPhraseCreate = () => {

    const { navigate, params } = useRouter();
  
    const handleBackNavigation = (route: string) => {
      navigate(route);
    };

    const [reveal, setReveal] = useState(false)
    const [manualBackup, setManualBackup] = useState(false)
    const [seedPhrases, setSeedPhrase] = useState<SeedPhraseMap>({})

    useEffect(() => {
     (async ()=>{
      const seedPhrase: any = params?.seedPhrase

        setSeedPhrase(seedPhrase)
      })();
    }, [params?.seedPhrase])
    
    const handleBackupManually = () => {
      setManualBackup(true)
    }

    const handleNavigation = ({route}: {route: string}) => {
      navigate(route);
    };

  return (
    <div className={styles['seed-phrase-create-page']}>

        <div className={styles['body']}>

        <div className={styles['back-icon']}>
            <BackIcon onClick={()=>handleBackNavigation(ROUTES.HOME)} />
        </div>

        <div className={styles['top-layer']}>
          
        </div>
            <div className={styles['header']}>
                <span className={styles['onboarding-title']}> 
                    Write down your secret recovery phrase
                </span>
                <span className={styles['onboarding-subtitle']}>
                Write down your recovery phrase and store it safely. You’ll confirm it in the next step.
                </span>
            </div>

            <div className={styles['body']}>
                <div className={styles['grid']}>
                  {Array.from({ length: 12 }, (_, rowIndex) => <PhraseBox isInput = {true} value= {seedPhrases[rowIndex+1]} key={rowIndex} /> )}
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
          onClick = {()=>{
            const seedPhraseText = (Object.values(seedPhrases).join(',')).replace(/,/g, " ")
            StxWalletService.downloadTxtFile(seedPhraseText)
            setTimeout(()=>{
              handleNavigation({route: ROUTES.SEED_PHRASE_CONFIRM})
            }, 1000)
          }}
          />: null}
   
        </div>
            <div className={styles['onboarding-buttons']}>
                <Button variant="primary" style={{width: '100%'}} disabled = {!reveal}>Backup With Google Drive</Button>
                <Button variant="secondary" style={{width: '100%'}} onClick={handleBackupManually} disabled = {!reveal}>Backup manually</Button>
            </div>

            {manualBackup &&<div
              className={`${styles['backdrop']}`}
            />}

        </div>
    </div>
  )
}

export default SeedPhraseCreate