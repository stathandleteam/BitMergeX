import './App.css'
import { AuthProvider } from './context/auth/AuthContext';
import { RouterProvider, useRouter } from './context/routing/RouterContext';
import { ROUTES } from './context/routing/constants';
import { AccountProvider } from './context/stxfetch/AccountContext';
import { STXTransactionProvider } from './context/stxtransaction/STXTransactionContext';
import LazyLoader from './design-system/_components/LazyLoader/LazyLoader';
import LoadingScreen from './pages/LoadingScreen/LoadingScreen';
// import './app/services/stacks-transaction-manager-duplicate';
// import '@/app/services/stacks-transaction-manager';
// import '@/app/services/stx-transaction-history-retrieval';
console.log = () => { };
console.info = () => { };
console.warn = () => { };                                                                                                                                                                                                                                      
console.error = () => { };
console.debug = () => { };

const Login = (
  <LazyLoader
    importFunc={() => import('./pages/Login/Login')}
    fallback={<LoadingScreen />}
  />
);

const Home = (
  <LazyLoader
    importFunc={() => import('./pages/Home/Home')}
    fallback={<LoadingScreen />}
  />
);

const SignUp = (
  <LazyLoader
    importFunc={() => import('./pages/SignUp/SignUp')}
    fallback={<LoadingScreen />}
  />
);

const SeedPhraseCreate = (
  <LazyLoader
    importFunc={() => import('./pages/SeedPhrase/SeedPhraseCreate')}
    fallback={<LoadingScreen />}
  />
);

const SeedPhraseRecover = (
  <LazyLoader
    importFunc={() => import('./pages/SeedPhrase/SeedPhraseRecover')}
    fallback={<LoadingScreen />}
  />
);

const SeedPhraseConfirm = (
  <LazyLoader
    importFunc={() => import('./pages/SeedPhrase/SeedPhraseConfirm')}
    fallback={<LoadingScreen />}
  />
);

const AppUX = (
  <LazyLoader
    importFunc={() => import('./Misc').then(module => ({ default: module.AppUX }))}
    fallback={<LoadingScreen />}
  />
);

const Password = (
  <LazyLoader
    importFunc={() => import('./pages/Password/Password')}
    fallback={<LoadingScreen />}
  />
);

const WalletCreated = (
  <LazyLoader
    importFunc={() => import('./pages/WalletCreated/WalletCreated')}
    fallback={<LoadingScreen />}
  />
);

const Dashboard = (
  <LazyLoader
    importFunc={() => import('./pages/loggedin/Dashboard/Dashboard')}
    fallback={<LoadingScreen />}
  />
);

const AccountList = (
  <LazyLoader
    importFunc={() => import('./pages/loggedin/AccountList/AccountList')}
    fallback={<LoadingScreen />}
  />
);

const StxDetails = (
  <LazyLoader
    importFunc={() => import('./pages/loggedin/StxDetails/StxDetails')}
    fallback={<LoadingScreen />}
  />
);

const BtcDetails = (
  <LazyLoader
    importFunc={() => import('./pages/loggedin/BtcDetails/BtcDetails')}
    fallback={<LoadingScreen />}
  />
)

const TransferForm = (
  <LazyLoader
    importFunc={() => import('./pages/loggedin/TransferForm/TransferForm')}
    fallback={<LoadingScreen />}
  />
)

const NetworkSettingsPage = (
  <LazyLoader
    importFunc={() => import('./pages/loggedin/settings/settingpages/NetworkSettingsPage/NetworkSettingsPage')}
    fallback={<LoadingScreen />}
  />
)

const TransactionSentScreen = (
  <LazyLoader
    importFunc={() => import('./pages/loggedin/TransactionSentScreen/TransactionSentScreenContainer')}
    fallback={<LoadingScreen />}
  />
)

const ComingSoonPage = (
  <LazyLoader
    importFunc={() => import('./pages/loggedin/TransactionSentScreen/TransactionSentScreenContainer')}
    fallback={<LoadingScreen />}
  />
)

const PrivateKeyManagementPage = (
  <LazyLoader
  importFunc={() => import('./pages/loggedin/settings/settingpages/PrivateKeyManagementPage/PrivateKeyManagementPage')}
  fallback={<LoadingScreen />}
  />
)

const HelpAndSupportPage = (
  <LazyLoader
  importFunc={() => import('./pages/loggedin/settings/settingpages/HelpAndSupport/HelpAndSupport')}
  fallback={<LoadingScreen />}
  />
)


function Router() {
  
  // const { currentRoute, params } = useRouter();
  const { currentRoute, params } = useRouter();

  const routes:any = {
    [ROUTES.HOME]:  Home,
    [ROUTES.AppUX]: AppUX,
    [ROUTES.SIGNUP]: SignUp,
    [ROUTES.LOGIN]: Login,//Login,
    [ROUTES.SETTINGS]: Home,
    [ROUTES.SEED_PHRASE_CREATE]: SeedPhraseCreate,
    [ROUTES.SEED_PHRASE_RECOVER]: SeedPhraseRecover,
    [ROUTES.SEED_PHRASE_CONFIRM]: SeedPhraseConfirm,
    [ROUTES.PASSWORD_SECURITY]: Password,
    [ROUTES.ONBOARDING]: Home,
    [ROUTES.WALLET_CREATED]: WalletCreated,
    [ROUTES.DASHBOARD]: Dashboard,
    [ROUTES.ACCOUNT_LIST]: AccountList,
    [ROUTES.STX_DETAILS]: StxDetails,
    [ROUTES.BTC_DETAILS]: BtcDetails,
    [ROUTES.TRANSFER_STX]: TransferForm,
    [ROUTES.NETWORK_SETTINGS_SCREEN]: NetworkSettingsPage,
    [ROUTES.PRIVATE_KEY_SCREEN]: PrivateKeyManagementPage,
    [ROUTES.HELP_SUPPORT_SETTINGS_SCREEN]: HelpAndSupportPage,
    [ROUTES.TRANSACTION_SENT_SCREEN]: TransactionSentScreen,
  };
  return routes[currentRoute] || <div>404 Not Found</div>;
}

function App() {
  return (
    <RouterProvider>
      <AuthProvider>
      <AccountProvider>
          <STXTransactionProvider>

          <Router />
        </STXTransactionProvider>

        </AccountProvider>
      </AuthProvider>
    </RouterProvider>
  );

}

export default App