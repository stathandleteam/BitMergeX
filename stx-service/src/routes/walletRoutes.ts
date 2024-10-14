import { Router } from "express";
import { authVerifier } from "../middleware/authVerifier";
import { addAccountToWallet, getOnChainAccountBalance, getWallet, getWalletAccountBalance, getWalletBalance, sendStx } from "../controllers";

const router = Router();

router.get('/wallet', authVerifier.verifyAccessToken, getWallet);
router.post("/wallet/account/new", authVerifier.verifyAccessToken,  addAccountToWallet);
router.get('/wallet/offchain/balance', authVerifier.verifyAccessToken, getWalletBalance);
router.get('/wallet/offchain/balance/:accountIdx', authVerifier.verifyAccessToken, getWalletAccountBalance);
router.get('/wallet/onchain/balance/:address', authVerifier.verifyAccessToken, getOnChainAccountBalance);
router.post('/wallet/transfer', authVerifier.verifyAccessToken, sendStx);

export default router;


