import { BiHide } from "react-icons/bi";
import { LuEye } from "react-icons/lu";
import { ChangeEvent, useState } from "react";
import styles from './PhraseBox.module.scss';

type Props = {
  value?: string;
  name?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  match?: boolean;
  isInput?: boolean;
  useHidePassword?: boolean;
  readOnly?: boolean;
}

const ControlledInput = ({
  name,
  value = '', 
  onChange,
  useHidePassword,
  readOnly = false
}: {
  name?: string,
  value?: string,
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void,
  useHidePassword?: boolean,
  readOnly?: boolean
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [valueIsNotEmpty, setValueIsNotEmpty] = useState(!!value);
  const stars = "****";

  const onBlur = () => {
    setValueIsNotEmpty(!!value);
  };

  const inputProps = {
    className: styles['box'],
    name,
    value,
    type: "text",
    ...(readOnly ? { readOnly: true } : { onChange }),
  };

  return (
    <div className={styles['input-container']}>
      {valueIsNotEmpty && useHidePassword ? (
        isVisible ? (
          <>
            <input {...inputProps} />
            {value && (
              <span className={styles['icon']} onClick={() => setIsVisible(false)}>
                <BiHide color="white" />
              </span>
            )}
          </>
        ) : (
          <>
            <input
              className={styles['box']}
              value={stars}
              type="text"
              readOnly
            />
            <span className={styles['icon']} onClick={() => setIsVisible(true)}>
              <LuEye color="white" />
            </span>
          </>
        )
      ) : (
        <input
          {...inputProps}
          onBlur={onBlur}
        />
      )}
    </div>
  );
};

const PhraseBox = ({
  match = false,
  isInput = false,
  value = '',
  name,
  onChange,
  useHidePassword,
  readOnly
}: Props) => {
  return !isInput ? (
    <span className={`${styles['box-is-not-input']} ${match ? styles['selected'] : ''}`}>
      {value}
    </span>
  ) : (
    <ControlledInput
      name={name}
      value={value}
      onChange={onChange}
      useHidePassword={useHidePassword}
      readOnly={readOnly}
    />
  );
};

export default PhraseBox;