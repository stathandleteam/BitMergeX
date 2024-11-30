// import React, { useState } from 'react';
// import { IoIosArrowDown, IoMdPerson } from 'react-icons/io';
// import { MdContentCopy } from 'react-icons/md';
// import { IoRefreshCircleOutline } from 'react-icons/io5';
// import styles from './TransferForm.module.scss';
// import { Input } from '@/design-system/_components/PasswordField/PasswordField';
// import ScreenWrapper from '@/pages/ScreenWrapper/ScreenWrapper';
// import { ROUTES } from '@/routing/constants';
// import { useRouter } from '@/routing/RouterContext';
// import BackIcon from '@/design-system/_components/BackIcon/BackIcon';

// interface TransferFormProps {
//   onSubmit: (data: {
//     address: string;
//     amount: string;
//     memo?: string;
//   }) => void;
// }

// const TransferForm: React.FC<TransferFormProps> = ({ onSubmit }) => {

//   const { navigate } = useRouter();

//   const [formData, setFormData] = useState({
//     address: '',
//     amount: '',
//     memo: ''
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSubmit(formData);
//   };

//   const handleNavigation = async (route: string) => {
//     navigate(route, { id: '123' });
//   }

//   const estimatedFee = '0.8STX';
//   const feeInUsd = '$1.50';

//   return (
//     <ScreenWrapper>

//         <div className={styles.transferForm}>
//         <div className={styles['back-icon']}>
//             <BackIcon onClick={()=>handleNavigation(ROUTES.STX_DETAILS)} />
//             {/* <span className={styles.accountName}>STX Transfer</span> */}
//             <div className={styles.switchAccountContainer}>
//                 <span className={styles.accountName}>STX Transfer</span>
//                 <span className={styles.accountType}>Stacks</span>
//             </div>

//             <span></span>
//         </div>

//         {/* Address Input Section */}
//         <div className={styles.section}>
//             <div className={styles.inputGroup}>
//                 <Input
//                     label="To"
//                     value={formData.address}
//                     onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
//                     placeholder="Enter recipient address"
//                 />
//                 <div className={styles.addressActions}>
//                     <button className={styles.iconButton}>
//                     <MdContentCopy size={14} />
//                     </button>
//                     <button className={styles.iconButton}>
//                     <IoMdPerson size={14} />
//                     </button>
//                 </div>
//             </div>
//             <button className={styles.addressBookButton}>
//             Add to address book
//             </button>
//         </div>

//         {/* Amount Input Section */}
//         <div className={styles.section}>
//             <div className={styles.inputGroup}>
//             <Input
//                 label="Amount"
//                 type="number"
//                 value={formData.amount}
//                 onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
//                 placeholder="0.0"
//             />
//             {formData.amount && (
//                 <div className={styles.usdValue}>
//                     ${(parseFloat(formData.amount) * 2).toFixed(2)}
//                 </div>
//             )}
//             </div>
//         </div>

//         {/* Memo Input */}
//         <div className={styles.section}>
//             <Input
//             label="Memo (Optional)"
//             value={formData.memo}
//             onChange={(e) => setFormData(prev => ({ ...prev, memo: e.target.value }))}
//             placeholder="Enter memo"
//             />
//         </div>

//         {/* Miner Fee Section */}
//         <div className={styles.section}>
//             <label className={styles.label}>Miner Fee</label>
//             <div className={styles.feeContainer}>
//             <div className={styles.feeHeader}>
//                 <span>Estimated range</span>
//                 <button className={styles.refreshButton}>
//                 <IoRefreshCircleOutline />
//                 Refresh in 5
//                 </button>
//             </div>
//             <div className={styles.feeInfo}>
//                 <div className={styles.feeAmount}>
//                 <div className={styles.feeUsd}>{feeInUsd}</div>
//                 <div className={styles.feeEth}>{estimatedFee}</div>
//                 </div>
//                 <button className={styles.fastestButton}>
//                 Fastest →
//                 </button>
//             </div>
//             <div className={styles.feeAlert}>
//                 <p>The minimum is determined by the current gas fee.</p>
//                 <p>The maximum is customizable.</p>
//             </div>
//             </div>
//         </div>

//         <button
//             onClick={handleSubmit}
//             className={styles.submitButton}
//         >
//             Next
//         </button>
//         </div>
//     </ScreenWrapper>
//   );
// };

// export default TransferForm;


import React, { useState } from 'react';
import { IoIosArrowDown, IoMdPerson, IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { MdContentCopy, MdAdd, MdClose, MdCheck } from 'react-icons/md';
import { IoRefreshCircleOutline } from 'react-icons/io5';
import styles from './TransferForm.module.scss';
import { Input } from '@/design-system/_components/PasswordField/PasswordField';
import ScreenWrapper from '@/pages/ScreenWrapper/ScreenWrapper';
import { ROUTES } from '@/routing/constants';
import { useRouter } from '@/routing/RouterContext';
import BackIcon from '@/design-system/_components/BackIcon/BackIcon';
import AddressesModal from './Buck/AddressModel';
import RenderStepContent from './Buck/RenderStepContent';

interface Address {
  id: string;
  value: string;
}

interface TransferFormProps {
  onSubmit: (data: {
    addresses: string[];
    amount: string;
    memo?: string;
  }) => void;
}

export const STEPS = {
  RECIPIENTS: 0,
  AMOUNT: 1,
  REVIEW: 2
};


const TransferForm: React.FC<TransferFormProps> = ({ onSubmit }) => {
  const { navigate } = useRouter();
  const [currentStep, setCurrentStep] = useState(STEPS.RECIPIENTS);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([{ id: '1', value: '' }]);
  const [address, setAddress] = useState<Address>({ id: '1', value: '' })
  const [formData, setFormData] = useState({
    amount: '',
    memo: ''
  });

  const [showAddressesModal, setShowAddressesModal] = useState(false);

  const handleNavigation = async (route: string) => {
    navigate(route, { id: '123' });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      addresses: addresses.map(addr => addr.value),
      ...formData
    });
  };

  const totalTransferAmount = addresses.length * parseFloat(formData.amount || '0');

  return (
    <ScreenWrapper>
      <div className={styles.transferForm}>
        <div className={styles['back-icon']}>
          <BackIcon onClick={() => 
            currentStep === STEPS.RECIPIENTS 
              ? handleNavigation(ROUTES.STX_DETAILS)
              : setCurrentStep(prev => prev - 1)
          } />
          <div className={styles.switchAccountContainer}>
            <span className={styles.accountName}>STX Transfer</span>
            <div className={styles.stepIndicator}>
              {Object.values(STEPS).map((step) => (
                <div 
                  key={step}
                  className={`${styles.stepDot} ${currentStep === step ? styles.active : ''} ${currentStep > step ? styles.completed : ''}`}
                />
              ))}
            </div>
          </div>
          <span></span>
        </div>

        {/* <div className={styles.formContent}> */}
          {<RenderStepContent 
                currentStep={currentStep} 
                isBulkMode={isBulkMode} 
                setIsBulkMode={setIsBulkMode} addresses={addresses} 
                setShowAddressesModal={setShowAddressesModal} 
                setAddresses={setAddresses} 
                formData={formData} setFormData={setFormData} 
                totalTransferAmount={totalTransferAmount}  
                setAddress = {setAddress}
                address= {address}
            />}
        {/* </div> */}

        <button
          onClick={() => {
            if (currentStep === STEPS.REVIEW) {
              handleSubmit
            } else {
              setCurrentStep(prev => prev + 1)
            }
          }}
          className={styles.submitButton}
          disabled={
            (currentStep === STEPS.RECIPIENTS && addresses.some(addr => !addr.value)) ||
            (currentStep === STEPS.AMOUNT && !formData.amount)
          }
        >
          {currentStep === STEPS.REVIEW ? 'Confirm Transfer' : 'Continue'}
        </button>

        {showAddressesModal && <AddressesModal totalTransferAmount = {totalTransferAmount} setShowAddressesModal = {setShowAddressesModal} addresses = {addresses} />}
      </div>
    </ScreenWrapper>
  );
};

export default TransferForm;