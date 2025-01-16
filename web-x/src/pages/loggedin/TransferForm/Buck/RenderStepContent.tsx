import React, { Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from 'react'
import { STEPS } from '../TransferForm';
import styles from  "./RenderStepContent.module.scss";
import { TextAreaField } from '@/design-system/_components/PasswordField/TextAreaField';
import { Input } from '@/design-system/_components/PasswordField/PasswordField'
import { MdAdd, MdClose, MdContentCopy } from 'react-icons/md';
import { IoMdPerson } from 'react-icons/io';
import { IoRefreshCircleOutline } from 'react-icons/io5';
import ConfirmTransaction from '../../ConfirmTransaction/ConfirmTransaction';
import useTransfer from '../hooks/useTransfer';
import { useSTXTransaction } from '@/context/stxtransaction/STXTransactionContext';
import { useAccount } from '@/context/stxfetch/AccountContext';
import { shortenAddress, shortenToken } from '@/design-system/utils/utils';

const AddressPreview: React.FC<{ address: string, }> = ({ address }) => {
    const abbreviated = `${address.slice(0, 4)}...${address.slice(-4)}`;
    return <span className={styles.abbreviatedAddress}>{abbreviated}</span>;
  };

  
const RenderStepContent = ({
    currentStep, isBulkMode, setIsBulkMode, addresses, setAddresses, setShowAddressesModal,
    formData, setFormData, totalTransferAmount,
    setAddress, address
 }
    : {currentStep: number, isBulkMode: boolean, setIsBulkMode: Dispatch<SetStateAction<any>>, addresses: any[],
        setShowAddressesModal: Dispatch<SetStateAction<any>>,
        setAddresses: Dispatch<SetStateAction<any>>,
        formData:any, setFormData: Dispatch<SetStateAction<any>>,
        totalTransferAmount: number,
        address: any,
        setAddress: Dispatch<SetStateAction<any>>
    }) => {

      const [dollarToOneStx, setdollarToOneStx] = useState(0);
      const [accountAddress, setAccountAddress] = useState('');
      const [minerFees, setMinerFees] = useState(1);

        const {
          getStxPrice
        } = useSTXTransaction();
        
        const {fetchAccountDetails, accountDetails} = useAccount()

      useEffect(() => {
        (async ()=>{
         const stxPrice = await getStxPrice();
         setdollarToOneStx(stxPrice.data || 0);
        })()
      }, [])

      useEffect(() => {
        if (accountDetails) {
          setAccountAddress(accountDetails.data.address)
        }
      }, [accountDetails.data.address])
      const addresRef = React.useRef<HTMLTextAreaElement>(null);

      // const dollarToOneStx = 2 //usd;

      const addNewAddress = () => {
        const newAddress = { id: Date.now().toString(), value: '' }
        setAddresses((prev:any) => [...prev, newAddress]);
        setAddress(newAddress)
      };
  
      const removeAddress = (id: string) => {
        if (addresses.length > 1) {
            setAddresses((prev:any) => prev.filter((addr:any) => addr.id !== id));
            setAddress( addresses[addresses.length-1])
        } else {
            setAddress(addresses[0])
        }
      };
          
      const updateAddress = async (id: string, value: string) => {
        setAddresses((prev:any) => prev.map((addr: any) => 
            addr.id === id ? { ...addr, value } : addr
        ));
        setAddress({id, value});
      };
  
      const {
          formData: formDataBackUp,  
          handleInputChange,
          errors,
          setFormData:setFormDataBackUp,
          validateForm,
          setErrMsg,
          errMsg,
          errRef,
          handleOnBlur,
          handleOnFocus
        } = useTransfer()

        useEffect(() => {
          setFormDataBackUp(formData)
        }, [formData])
        

    
    switch (currentStep) {
      case STEPS.RECIPIENTS:
        return (
          <>
            <div className={styles.transferMode}>
              <button 
                className={`${styles.modeButton} ${!isBulkMode ? styles.active : ''}`}
                onClick={() => {
                  setIsBulkMode(false);                  
                  addresRef?.current && addresRef.current?.focus()
                }}
              >
                Single
              </button>
              <button 
                className={`${styles.modeButton} ${isBulkMode ? styles.active : ''}`}
                onClick={() => {
                  setIsBulkMode(true)
                  addresRef?.current && addresRef.current?.focus()
                }}
              >
                Bulk
              </button>
            </div>

            {/* {addresses.map((address, index) => ( */}
              <div key={address.id} className={styles.section}>
                <div className={styles.inputGroup}>
                  <TextAreaField
                    name={`${address.id}`}
                    data-id = {"address"}
                    label={isBulkMode ? `Address ${
                        addresses.length
                        // address.id
                    }` : "To"}
                    value={ address.value}
                    onChange={(e) => updateAddress(address.id, e.target.value)}
                    placeholder="Enter recipient address"
                    error={errors[address.id]}
                    ref = {addresRef}
                    onFocus={handleOnFocus}
                    onBlur={handleOnBlur}
                  />
                   
                  <div className={styles.addressActions}>
                    <button className={styles.iconButton}>
                      <MdContentCopy size={14} />
                    </button>
                    <button className={styles.iconButton}>
                      <IoMdPerson size={14} />
                    </button>
                    {isBulkMode && addresses.length > 1 && (
                      <button 
                        className={styles.iconButton}
                        onClick={() => removeAddress(address.id)}
                      >
                        <MdClose size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* <div className={styles.inputGroupLabel}>
                <button className={styles.addressBookButton}>
                Add to address book
                </button>
                <button className={styles.addressBookButton}>
                   {!isBulkMode ? <> Switch to Buck Transfer</>:<> Switch to Single Transfer</>}
                </button>
            </div> */}

                {isBulkMode && addresses.length > 0 && (
                            <div className={styles.addressPreviewBar}>
                                {addresses.reverse().slice(0, 4).map((addr, index) => (
                                <button 
                                    key={addr.id}
                                    className={styles.previewChip}
                                    onClick={() => setShowAddressesModal(true)}
                                >
                                    <AddressPreview address={addr.value || `Address ${index + 1}`} />
                                </button>
                                ))}

                                
                                {addresses.length > 4 && (
                                <button 
                                    className={styles.moreAddresses}
                                    onClick={() => setShowAddressesModal(true)}
                                >
                                    +{addresses.length - 3}
                                </button>
                                )}

                                    {/* <button 
                                    className={`${styles.addAddressButton2} `}
                                    onClick={addNewAddress}
                                >
                                    <MdAdd size={16} />
                                    Add
                                </button> */}
                                

                            </div>
                        )}

              </div>
            {/* ))} */}


            
            {isBulkMode && (
              <button className={styles.addAddressButton} onClick={addNewAddress}>
                <MdAdd size={16} />
                Add Another Address
              </button>
            )}
          </>
        );
        
      case STEPS.AMOUNT:
        return (
          <>
            <div className={styles.section}>
              <div className={styles.inputGroup}>
                <Input
                  data-id = {"amount"}
                  name='amount'
                  label="Amount (per address)"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData((prev:any) => ({ ...prev, amount: e.target.value }))}
                  placeholder="0.0"
                  //   error={validateStxAddress(formData.amount)?"Invalid"}
                  error={errors?.amount}
                  onFocus={handleOnFocus}
                  onBlur={handleOnBlur}
                />

                
                {formData.amount && (
                  <div className={styles.usdValue}>
                   {`$ ${(parseFloat(formData.amount) * dollarToOneStx)?.toFixed(2) || '0'}`}
                  </div>
                )}
              </div>
             
              {isBulkMode && formData.amount && (
                <div className={styles.totalAmount}>
                  Total: {totalTransferAmount?.toFixed(2) || '0'} STX (${(totalTransferAmount * 2)?.toFixed(2) || '0'})
                </div>
              )}
            </div>

            <div className={styles.section}>
              <Input
                label="Memo (Optional)"
                value={formData.memo}
                onChange={(e) => setFormData((prev:any) => ({ ...prev, memo: e.target.value }))}
                placeholder="Enter memo"
                
              />
            </div>
          </>
        );

      case STEPS.REVIEW:
        return (
        //   <div className={styles.reviewContainer}>
        //     <div className={styles.reviewSection}>
        //       <h4>Recipients ({addresses.length})</h4>
        //       <div className={styles.addressList}>
        //         {addresses.map((addr, index) => (
        //           <div key={addr.id} className={styles.reviewAddress}>
        //             <span>{index + 1}.</span>
        //             <span>{addr.value}</span>
        //           </div>
        //         ))}
        //       </div>
        //     </div>

        //     <div className={styles.reviewSection}>
        //       <h4>Amount</h4>
        //       <div className={styles.reviewAmount}>
        //         <div>Per Address: {formData.amount} STX</div>
        //         {isBulkMode && (
        //           <div>Total: {totalTransferAmount?.toFixed(2) || '0'} STX</div>
        //         )}
        //       </div>
        //     </div>

        //     <div className={styles.reviewSection}>
        //       <h4>Network Fee</h4>
        //       <div className={styles.feeContainer}>
        //         <div className={styles.feeHeader}>
        //           <span>Estimated range</span>
        //           <button className={styles.refreshButton}>
        //             <IoRefreshCircleOutline />
        //             Refresh in 5
        //           </button>
        //         </div>
        //         <div className={styles.feeInfo}>
        //           <div className={styles.feeAmount}>
        //             <div className={styles.feeUsd}>$1.50</div>
        //             <div className={styles.feeEth}>0.8STX</div>
        //           </div>
        //           <button className={styles.fastestButton}>
        //             Fastest →
        //           </button>
        //         </div>
        //       </div>
        //     </div>
        //   </div>

            <ConfirmTransaction
                amount={formData.amount}
                // recipient={recipient}
                fee={{stx:`${minerFees}STX`, usd: `${minerFees * dollarToOneStx}` }}
                walletAddress={shortenAddress(accountAddress)}
                network={'StackNetwork'}
                onConfirm={() => {
                    // Perform the actual transfer transaction here
                    console.log('Confirming transaction...');
                }}
                onCancel={() => {
                    // Navigate back or perform any other necessary actions
                    console.log('Canceling transaction...');
                }} 
                addresses={addresses} 
                isBulkMode={isBulkMode} 
                totalTransferAmount={totalTransferAmount}   
                tokenShortName = {"STX"}
                dollarToOneStx = {dollarToOneStx}

            />
        );
    }
  };


export default RenderStepContent