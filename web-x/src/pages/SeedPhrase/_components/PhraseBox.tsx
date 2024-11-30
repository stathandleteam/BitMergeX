import { BiHide } from "react-icons/bi";
import styles from './PhraseBox.module.scss';
import { ChangeEvent, useState } from "react";
import { LuEye } from "react-icons/lu";
type Props = {
  value: string; 
  name?:string; 
  onChange?: any; 
  match?: boolean; 
  isInput?: boolean;
  useHidePassword?: boolean;
}

const ControlledInput = ({name, value, onChange, useHidePassword}: {name?: string, value: string, onChange: (event: ChangeEvent<HTMLInputElement>)=>void, useHidePassword?: boolean})=>{
 
  const [isVisible, setIsVisible] = useState(false);
  const [valueIsNotEmpty, setValueIsNotEmpty] = useState(false)
  const stars = "****";

  const onBlur = (e:any) => {
    setValueIsNotEmpty(!!value)
  }

  return (<div className={styles['input-container']}>
    {valueIsNotEmpty && useHidePassword ? <>
      {isVisible? <>
        <input className={styles['box']} name={name} value={value} onChange={onChange} />

         {value &&  <span className={styles['icon']} onClick={()=>setIsVisible(!isVisible)}>
          <BiHide color="white" />
          </span>  }  

        </> :
          <> 
                <input className={styles['box']} value={stars} />

            <span className={styles['icon']} onClick={()=>setIsVisible(!isVisible)}>
            <LuEye color="white" />
            </span>    

          </>
        }
    </>: 
      <input 
        className={styles['box']} 
        name={name} 
        value={value} 
        onChange={onChange} 
        onBlur={onBlur}
      />
    }
  </div>)
}

const PhraseBox = ({match, isInput, value, name, onChange, useHidePassword}: Props) => {
  return (
    
      !isInput
      ?<span className={`${styles['box-is-not-input']} ${match ? styles['selected'] : ''}`}>
        {value}
    </span>: 
    <ControlledInput name= {name} value= {value} onChange={onChange} useHidePassword = {useHidePassword} />
  )
}

export default PhraseBox