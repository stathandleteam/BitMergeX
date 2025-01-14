import TransactionSentScreen from "./Single/TransactionSentScreen";
import BulkTransactionSentScreen from "./Bulk/TransactionSentScreen";
import { useRouter } from "@/context/routing/RouterContext";
import { ROUTES } from "@/context/routing/constants";

const TransactionSentScreenContainer = ()=> {

    const {navigate} = useRouter()

    const mockTransactionDetails = {
      txId: '0x1234567890abcdef...',
      amount: 100,
      recipient: 'SP3X6WGHH68BTHY39A5P39EKH1BWPZPZH0ZDPR1P5',
      timestamp: Date.now()
    };
  
    return (
      <TransactionSentScreen 
        transactionDetails={mockTransactionDetails}
        onClose={() => {
            navigate(ROUTES.DASHBOARD)
        }}
      />
    );
  }

  export default TransactionSentScreenContainer