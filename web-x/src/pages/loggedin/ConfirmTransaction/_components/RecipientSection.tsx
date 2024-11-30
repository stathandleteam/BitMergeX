import { IoRefreshCircleOutline } from "react-icons/io5";
import styles  from './RecipientSection.module.scss'

export const RecipientSection: React.FC<{ recipients: string[] }> = ({ recipients }) => (
    <div className={styles["review-section"]}>
      <h4>Recipients ({recipients.length})</h4>
      <div className={styles["address-list"]}>
        {recipients.map((address, index) => (
          <div key={`${address}-${index}`} className={styles["review-address"]}>
            <span>{index + 1}.</span>
            <span>{address}</span>
          </div>
        ))}
      </div>
    </div>
  );

 
  export const AmountSection: React.FC<{ amount: string; isBulkMode: boolean; total: number }> = ({ amount, isBulkMode, total }) => (
    <div className={styles["review-section"]}>
      <h4>Amount</h4>
      <div className={styles["review-amount"]}>
        <div>Per Address: {amount} STX</div>
        {isBulkMode && <div>Total: {total.toFixed(2)} STX</div>}
      </div>
    </div>
  );

  export const FeeSection: React.FC<{ fee: { usd: string; eth: string } }> = ({ fee }) => (
    <div className={styles["review-section"]}>
      <h4>Network Fee</h4>
      <div className={styles["fee-container"]}>
        <div className={styles["fee-header"]}>
          <span>Estimated range</span>
          <button className={styles["refresh-button"]}>
            <IoRefreshCircleOutline />
            Refresh in 5
          </button>
        </div>
        <div className={styles["fee-info"]}>
          <div className={styles["fee-values"]}>
            <div className={styles["fee-primary"]}>{fee.usd}</div>
            <div className={styles["fee-secondary"]}>{fee.eth}</div>
          </div>
          <button className={styles["fastest-button"]}>Fastest →</button>
        </div>
      </div>
    </div>
  );