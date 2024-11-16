// AccountCard.tsx
import React, { useState } from 'react';
import styles from './AccountCard.module.scss';
import { BsThreeDotsVertical } from "react-icons/bs";
import AvatarGroup from '@/design-system/_components/AvatarGroup/AvatarGroup';
import CustomDropdown from '@/design-system/_components/CustomDropdown/CustomDropdown';
import EditableName from './_components/EditableName';
// import AvatarGroup from '@/design-system/_components/AvatarGroup/AvatarGroup';

interface AccountCardProps {
  symbol: string;
  name: string;
  balance: number;
  fiatValue: number;
  icon?: React.ReactNode;
}

const avatars = [
  { src: '', alt: '' },
  { src: '', alt: '' },
  // { src: '', alt: '' },
  // { src: '', alt: '' },
  // { src: '', alt: '' },
  // { src: '', alt: '' },
];

const viewOptions = [
  { word: "Rename", id: "1" },
]
const AccountCard: React.FC<AccountCardProps> = ({
  symbol,
  name,
  balance,
  fiatValue,
  icon
}) => {
  const [startEditting, setStartEditting] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        <div className={styles.iconWrapper}>
          {icon}
        </div>
        <div className={styles.tokenInfo}>
          {/* <span className={styles.symbol}>{symbol}</span> */}
            <EditableName 
              startEditting = {startEditting} 
              setStartEditting = {setStartEditting}
              onUpdateName={(newName) => console.log('Updated name:', newName)}
              name= {symbol} className = {styles.symbol} />
            <AvatarGroup avatars={avatars} maxCount={2} />
        </div>
      </div>
      <div className={styles.rightSection}>
        <span className={styles.balance} >
          <CustomDropdown
              items={viewOptions}
              fieldName={"Hour"}
              onChangeForm={
                ({ name, value, item }: { name: string; value: string, item: any }) =>{ 
                  setStartEditting(true)
                  }
              }
              defaultValue={viewOptions[0].word}
              // width='85px'
              maxWidth='100px'
              height={40}
              disableOnchanged={true}
              maxHeight={"40vh"}
              alignDropdownTo = 'right' 
              dropdownWidth = {150}
          >
            <BsThreeDotsVertical />
          </CustomDropdown>
        </span>
        <span className={styles.fiatValue}>
          {/* ${fiatValue.toFixed(2)} */}
        </span>
      </div>
    </div>
  );
};

export default AccountCard;
