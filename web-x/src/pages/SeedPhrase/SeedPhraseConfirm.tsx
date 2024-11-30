import { Button } from '@/design-system/_components/Button/Button'
import PhraseBox from './_components/PhraseBox'
import PopUpCard from './_components/PopUpCard'
import styles from './SeedPhraseConfirm.module.scss'
import { useRouter } from '@/routing/RouterContext'
import { ROUTES } from '@/routing/constants'
import { useEffect, useState } from 'react'
import { seedPhrases } from '@/routing/seed-phrase-example'
import { shuffleArray } from '@/design-system/utils/utils'
import BackIcon from '@/design-system/_components/BackIcon/BackIcon'


const SeedPhraseConfirm = () => {

  
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

    const [trackSeeds, setTrackSeeds] = useState<{key: string, value: string}[]|null>([])
    const [cellSeedPhrase, setcellSeedPhrase]:any = useState<{key: string, value: string}>({key: '', value: ''})
    const [matchSeedPhrase, setmatchSeedPhrase]:any = useState<{key: string, value: boolean}>({key: '', value: false})
    const [reshuffledSeedPhrase, setreshuffledSeedPhrase]:any = useState<{key: string, value: string}[]>([])
    
    const updateObjectImmutably = (obj: Record<string, any>, key: string, value: any) => {
      return { ...obj, [key]: value };
    };

    useEffect(() => {
      const trackSeedsPopulate:any = {};
      const trackMatchSeedPhrase:any = {};
      const seedPhrasesActual:any = [];
     Object.entries(seedPhrases).map(([key, value]) => {
         trackSeedsPopulate[key] = ''
         trackMatchSeedPhrase[key] = false;
         seedPhrasesActual.push({key, value})
        //  updateObjectImmutably(trackSeedsPopulate, key, '')
      }) 

      
      // const trackSeedsPopulate = Object.fromEntries(seedPhrases);
      // const result = seedPhrases.reduce<Record<string, any>>((acc, pair) => {
      //   acc[pair.key] = pair.value;
      //   return acc;
      // }, {});

      // setTrackSeeds(trackSeeds)
     setcellSeedPhrase(trackSeedsPopulate)
      setreshuffledSeedPhrase(shuffleArray(seedPhrasesActual))
    }, [])

    // console.log("reshuffledSeedPhrase", reshuffledSeedPhrase)
    // console.log("matchSeedPhrase", matchSeedPhrase)
    const onChange = (e: any) => {
      const index = reshuffledSeedPhrase.findIndex((item:any) => item?.value === e.target.value)
      const found = index > -1 && e.target.name === reshuffledSeedPhrase[index]?.key;
      console.log("index", index, "e.target.name", e.target.name, )
      const a:any = updateObjectImmutably(cellSeedPhrase, e.target.name, e.target.value);
      const b = {...matchSeedPhrase, [e.target.name]: found}
      setcellSeedPhrase(a)

      setmatchSeedPhrase(b)

    }
    const cellContainer = Object.entries(cellSeedPhrase).slice()?.map(([key, value]:any) => {
      // console.log("key", key, "value", value)
      return (
        <PhraseBox value={value} isInput={true} name={key} onChange={onChange}/>
      )
    })

    const handleNavigation = (route: string) => {
      navigate(route, { id: '123' });
    };
    
  return (
    <div className={styles['seed-phrase-create-page']}>

        <div className={styles['body']}>

        <div className={styles['back-icon']}>
            <BackIcon onClick={()=>handleNavigation(ROUTES.SEED_PHRASE_CREATE)} />
          </div>

            <div className={styles['header']}>
                <span className={styles['onboarding-title']}> 
                    Seed Phrase
                </span>
                <span className={styles['onboarding-subtitle']}>
                 Select each word in the order it was presented to you.
                </span>

            </div>

            <div className={styles['body']}>

                <div className={styles['grid']} >
                  {cellContainer}
                </div>

                <div className={styles['grid']} >
                  { Array.from({ length: reshuffledSeedPhrase.length }, (_, rowIndex) => {
                        return (                 
                           <PhraseBox 
                              // match = {reshuffledSeedPhrase.some((item:any) => item?.value === cellSeedPhrase[rowIndex+1]) }
                              match = {matchSeedPhrase[reshuffledSeedPhrase[rowIndex]?.key] } 
                              // match = {reshuffledSeedPhrase[rowIndex+1]?.key === Object.keys(cellSeedPhrase[rowIndex+1])[0] }
                              value= {reshuffledSeedPhrase[rowIndex]?.value} 
                              isInput={false} key={rowIndex}/> )
                        }
                      )                    
                  }
                </div>


             
        {/* {!reveal ? <PopUpCard 
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
          />: null} */}
   
        <div className={styles['onboarding-buttons']}>
          {/* disabled = {!reveal} */}
              <Button variant="primary" style={{width: '100%'}} onClick={handleSignInNavigation} >Continue</Button>
          </div>


            </div>

            {/* {manualBackup &&<div
              className={`${styles['backdrop']}`}
            />} */}

        </div>
    </div>
  )
}

export default SeedPhraseConfirm