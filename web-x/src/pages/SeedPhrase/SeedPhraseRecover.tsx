import { Button } from '@/design-system/_components/Button/Button'
import PhraseBox from './_components/PhraseBox'
import styles from './SeedPhraseRecover.module.scss'
import { useRouter } from '@/routing/RouterContext'
import { ROUTES } from '@/routing/constants'
import { useEffect, useRef, useState } from 'react'
import { shuffleArray } from '@/design-system/utils/utils'
import BackIcon from '@/design-system/_components/BackIcon/BackIcon'
import { StxWalletService } from '@/app/services/stx-wallet-service'
// import StxWalletService from '@/app/services/stx-wallet-service'

interface FormErrors {
  password?: string;
}

const SeedPhraseRecover = () => {

  const { navigate, params } = useRouter();

  const [cellSeedPhrase, setcellSeedPhrase]: any = useState<{ key: string, value: string }>({ key: '', value: '' })
  const [matchSeedPhrase, setmatchSeedPhrase]: any = useState<{ key: string, value: boolean }>({ key: '', value: false })
  const [reshuffledSeedPhrase, setreshuffledSeedPhrase]: any = useState<{ key: string, value: string }[]>([])
  const [errors, setErrors] = useState<FormErrors>({});

  const errRef: any = useRef<HTMLInputElement>(null);
  const [errMsg, setErrMsg] = useState('');

  const updateObjectImmutably = (obj: Record<string, any>, key: string, value: any) => {
    return { ...obj, [key]: value };
  };

  useEffect(() => {
    const trackSeedsPopulate: any = {};
    // const trackMatchSeedPhrase:any = {};
    // const seedPhrasesActual:any = [];

    // Object.entries(seedPhrases).map(([key, value]) => 
    Array.from({ length: 12 }, (_, rowIndex) => {
      const key = rowIndex + 1;
      trackSeedsPopulate[key] = ''
      //  trackMatchSeedPhrase[key] = false;
      //  seedPhrasesActual.push({key, value})
    })

    setcellSeedPhrase(trackSeedsPopulate)

    // setreshuffledSeedPhrase(shuffleArray(seedPhrasesActual))

  }, [])

  const handleBackNavigation = async (route: string) => {
    await navigate(route);
  };

  const onChange = (e: any) => {
    const index = reshuffledSeedPhrase.findIndex((item: any) => item?.value === e.target.value)
    const found = index > -1 && e.target.name === reshuffledSeedPhrase[index]?.key;
    const a: any = updateObjectImmutably(cellSeedPhrase, e.target.name, e.target.value);
    const b = { ...matchSeedPhrase, [e.target.name]: found }
    setcellSeedPhrase(a);
    setmatchSeedPhrase(b);
  }

  const cellContainer = Object.entries(cellSeedPhrase).slice()?.map(([key, value]: any, index: number) => {
    return (
      <PhraseBox key={key + index} value={value} isInput={true} name={key} onChange={onChange} useHidePassword />
    )
  })

  const handleNavigation = async (route: string, seedPhrase: string) => {
    await navigate(route, { previous_screen: ROUTES.SEED_PHRASE_RECOVER, seedPhraseString: seedPhrase })
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


  const handleValidateSeedPhrase = async () => {
    try {
      const seedPhrase: any = Object.values(cellSeedPhrase).reduce((curr, phrase, currentIndex) => {
        return `${curr} ${phrase}`
      }, '')

      if (await validateForm(seedPhrase.trim() || '')) {
        handleNavigation(ROUTES.PASSWORD_SECURITY, seedPhrase)
      }

    } catch (error: any) {
      setErrMsg(error.message)
    }
  }

  return (
    <div className={styles['seed-phrase-create-page']}>

      <div className={styles['body']}>

        <div className={styles['back-icon']}>
          <BackIcon onClick={() => handleBackNavigation(ROUTES.LOGIN)} />
        </div>

        <div className={styles['header']}>
          <span className={styles['onboarding-title']}>
            Step 2 of 3
          </span>
          <span className={styles['onboarding-subtitle']}>
            Enter your seedphrase to restore your wallet
          </span>
          <span ref={errRef} className={styles[errMsg ? 'error-label' : '']}>
            {errMsg}
          </span>

        </div>

        <div className={styles['body']}>

          <div style={{ height: 'fit-content', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10%' }}>

            <div className={styles['grid']} >
              {cellContainer}
            </div>

            {errors.password && <span className={styles.errorMessage}>{errors.password}</span>}

          </div>


          <div className={styles['onboarding-buttons']}>
            <Button variant="primary" style={{ width: '100%' }} onClick={handleValidateSeedPhrase} >Continue</Button>
          </div>

        </div>

      </div>
    </div>
  )
}

export default SeedPhraseRecover