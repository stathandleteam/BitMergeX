import React, { Dispatch, SetStateAction, useRef } from 'react'
import styles from './PopUpCard.module.scss'
import Logo from '@/design-system/_components/Logo/Logo'
import { Button } from '@/design-system/_components/Button/Button'
import useOutsideAlerter from '@/design-system/hooks/useOutsideAlerter'

const PopUpCard = ({heading, body, handleSetReveal, cssStyles, buttonLabel, logoSize = 50, canTapOutside}: {heading: string, body: string, handleSetReveal: Dispatch<SetStateAction<boolean>>, cssStyles?: React.CSSProperties, buttonLabel?: string, logoSize?: number, canTapOutside?: boolean}) => {

  const wrapperRef: any = useRef(null);

  useOutsideAlerter({ ref: wrapperRef, setToggleMenu: canTapOutside ? handleSetReveal : () => {}, });

  return (
    <div className={`${styles['pop-up-card']} `} style={cssStyles} ref={wrapperRef}>
            <Logo size={logoSize}/>

            <span className={styles['pop-up-card-title']}> 
               {heading}
            </span>
            <span className={styles['pop-up-card-details']}>
               {body}
            </span>


            <Button style={{width: '100%'}} variant='primary'
            onClick={() => handleSetReveal((reveal: boolean) => !reveal)}
            >{buttonLabel}</Button>
    </div>
  )
}

export default PopUpCard