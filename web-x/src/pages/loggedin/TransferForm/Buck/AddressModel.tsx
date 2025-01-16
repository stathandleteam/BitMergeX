import { MdClose } from 'react-icons/md';
import styles from './AddressesModal.module.scss';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useSTXTransaction } from '@/context/stxtransaction/STXTransactionContext';


const AddressesModal = ({totalTransferAmount, setShowAddressesModal, addresses}
    : {totalTransferAmount: number, setShowAddressesModal: Dispatch<SetStateAction<any>>, addresses: any}) => {
      
    const [dollarToOneStx, setdollarToOneStx] = useState(0);

    const {
      getStxPrice
    } = useSTXTransaction();
      
    useEffect(() => {
      (async ()=>{
        const stxPrice = await getStxPrice();
        setdollarToOneStx(stxPrice.data || 0);
      })()
    }, [])
      
      return (
    <div className={styles.modalOverlay} onClick={() => setShowAddressesModal(false)}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Recipient Addresses</h3>
          <button onClick={() => setShowAddressesModal(false)}>
            <MdClose size={20} />
          </button>
        </div>
        <div className={styles.modalContent}>
          {addresses.map((addr:any, index:any) => (
            <div key={addr.id} className={styles.modalAddress}>
              <span className={styles.addressIndex}>{index + 1}</span>
              <span className={styles.addressValue}>{addr.value}</span>
            </div>
          ))}
          <div className={styles.modalTotal}>
            <span>Total Amount:</span>
            <span>{totalTransferAmount?.toFixed(2) || '0'} STX (${(totalTransferAmount * dollarToOneStx)?.toFixed(2) || '0'})</span>
          </div>
        </div>
      </div>
    </div>
  )};


export default AddressesModal;