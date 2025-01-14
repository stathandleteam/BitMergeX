import React from 'react'
import styles from './SwitchAccount.module.scss'
import { IoIosArrowDown } from 'react-icons/io'
import { useRouter } from '@/context/routing/RouterContext';
import { ROUTES } from '@/context/routing/constants';
import CustomDropdown from '@/design-system/_components/CustomDropdown/CustomDropdown';
import { BsThreeDotsVertical } from 'react-icons/bs';

const viewOptions = [
  { word: "Lock", id: "1" },
]

const SwitchAccount = ({accountType, accountName}: {accountType: string, accountName: string}) => {
 
  const { navigate } = useRouter();

  const handleNavigation = async (route: string) => {
    navigate(route, { id: '123' });
  }

    
 
  return (
    <div className={styles.switchAccountContainer}>
        <span className={styles.accountType}>{accountType}</span>
        <div className={styles.accountNameContainer} onClick={() => handleNavigation(ROUTES.ACCOUNT_LIST)}>
            <span className={styles.arrow}><IoIosArrowDown /></span>
            <span className={styles.accountName}>{accountName}</span>
        </div>

        <div className={styles.rightSection}>
          <CustomDropdown
              items={viewOptions}
              fieldName={"locker"}
              onChangeForm={
                ({ name, value, item }: { name: string; value: string, item: any }) =>{ 
                  // setStartEditting(true)
                  handleNavigation(ROUTES.LOGIN)        

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
            <BsThreeDotsVertical size={20} color='white' />
          </CustomDropdown>
       
      </div>
    </div>
  )
}

export default SwitchAccount;