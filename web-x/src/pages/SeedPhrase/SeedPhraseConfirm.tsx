import { Button } from '@/design-system/_components/Button/Button'
import PhraseBox from './_components/PhraseBox'
import styles from './SeedPhraseConfirm.module.scss'
import { useRouter } from '@/routing/RouterContext'
import { ROUTES } from '@/routing/constants'
import { useEffect, useState } from 'react'
import { shuffleArray } from '@/design-system/utils/utils'
import BackIcon from '@/design-system/_components/BackIcon/BackIcon'
import { StxWalletService } from '@/app/services/stx-wallet-service'
// import StxWalletService from '@/app/services/stx-wallet-service'


interface FormErrors {
  password?: string;
}

const SeedPhraseConfirm = () => {

  
    const {previousRoute, navigate, params } = useRouter();

    const seedPhrases: any = params?.seedPhrase

    const [cellSeedPhrase, setcellSeedPhrase]:any = useState<{key: string, value: string}>({key: '', value: ''})
    const [matchSeedPhrase, setmatchSeedPhrase]:any = useState<{key: string, value: boolean}>({key: '', value: false})
    const [reshuffledSeedPhrase, setreshuffledSeedPhrase]:any = useState<{key: string, value: string}[]>([])
    const [errors, setErrors] = useState<FormErrors>({});

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
      }) 
      
     setcellSeedPhrase(trackSeedsPopulate)
      setreshuffledSeedPhrase(shuffleArray(seedPhrasesActual))
    }, [])

    const handleBackNavigation = (route: string) => {
      navigate(route);
    };

    const onChange = (e: any) => {
      const index = reshuffledSeedPhrase.findIndex((item:any) => item?.value === e.target.value)
      const found = index > -1 && e.target.name === reshuffledSeedPhrase[index]?.key;
      console.log("index", index, "e.target.name", e.target.name, )
      const a:any = updateObjectImmutably(cellSeedPhrase, e.target.name, e.target.value);
      const b = {...matchSeedPhrase, [e.target.name]: found}
      setcellSeedPhrase(a);
      setmatchSeedPhrase(b);
    }

    const cellContainer = Object.entries(cellSeedPhrase).slice()?.map(([key, value]:any, index: number) => {
      return (
        <PhraseBox key = {key+index} value={value} isInput={true} name={key} onChange={onChange} useHidePassword  />
      )
    })

    const handleNavigation = (route: string, seedPhrase?: string) => {

      seedPhrase ? navigate(route, { previous_screen: ROUTES.SEED_PHRASE_CONFIRM, seedPhrase })

      : navigate(route, { previous_screen: ROUTES.SEED_PHRASE_CONFIRM });
    };
    

    const validateForm = async (seedPhrase: string) => {
      const newErrors: FormErrors = {};
      
      if (!seedPhrase.replace(/\s/g, "")) {
        newErrors.password = 'Seedphrase is required';
      } else if (!(await StxWalletService.validateSeedPhrase(seedPhrase.trim() || ''))) {
        newErrors.password = 'Seedphrase is not valid. Please try again';
      }
  
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleValidateSeedPhrase = async ()=>{
     const seedPhrase:any = Object.values(cellSeedPhrase).reduce((curr, phrase, currentIndex) =>{
      return  `${curr} ${phrase}`
     }, '')
    //  console.log('Object.values(cellSeedPhrase)', Object.values(cellSeedPhrase))

    //  console.log('seedPhrase', seedPhrase.replace(/\s/g, " "))

    if (await validateForm(seedPhrase)){
        handleNavigation(ROUTES.PASSWORD_SECURITY, seedPhrase)
     }

    }

  return (
    <div className={styles['seed-phrase-create-page']}>

        <div className={styles['body']}>

          <div className={styles['back-icon']}>
            <BackIcon onClick={()=>handleNavigation(
              ROUTES.SEED_PHRASE_CREATE
              )} />
          </div>
          <div className={styles['top-layer']}>
          
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

                <div style={{height: 'fit-content', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
  
                  <div className={styles['grid']} >
                    {cellContainer}
                  </div>
                
                  { errors.password && <span className={styles.errorMessage}>{errors.password}</span>}

                </div>



                <div className={styles['grid']} >
                  { Array.from({ length: reshuffledSeedPhrase.length }, (_, rowIndex) => {
                        return (                 
                           <PhraseBox 
                              match = {matchSeedPhrase[reshuffledSeedPhrase[rowIndex]?.key] } 
                              value= {reshuffledSeedPhrase[rowIndex]?.value} 
                              isInput={false} key={rowIndex}/> )
                        }
                      )                    
                  }
                </div>


                <div className={styles['onboarding-buttons']}>
                    <Button variant="primary" style={{width: '100%'}} onClick={handleValidateSeedPhrase} >Continue</Button>
                </div>

            </div>

        </div>
    </div>
  )
}

export default SeedPhraseConfirm