import './App.css'
import { RouterProvider, useRouter } from './routing/RouterContext';
import { ROUTES } from './routing/constants';
import Home from './pages/Home/Home';
import SignUp from './pages/SignUp/SignUp'
// import Login from './pages/Login/Login'
import SeedPhraseCreate from './pages/SeedPhrase/SeedPhraseCreate';
import SeedPhraseRecover from './pages/SeedPhrase/SeedPhraseRecover';
import SeedPhraseConfirm from './pages/SeedPhrase/SeedPhraseConfirm';
import { AppUX } from './Misc';
import Password from './pages/Password/Password';
import WalletCreated from './pages/WalletCreated/WalletCreated';
import BottomNavigation from './pages/loggedin/Dashboard/BottomNavigation';
import Dashboard from './pages/loggedin/Dashboard/Dashboard';
import AccountList from './pages/loggedin/AccountList/AccountList';
import LazyLoader from './design-system/_components/LazyLoader/LazyLoader';


console.log = () => { };
console.info = () => { };
console.warn = () => { };                                                                                                                                                                                                                                      
console.error = () => { };
console.debug = () => { };


function Router() {
  const { currentRoute, params } = useRouter();
  const routes:any = {
    [ROUTES.HOME]:  <Home />,
    [ROUTES.AppUX]: <AppUX />,
    [ROUTES.SIGNUP]: <SignUp />,
    [ROUTES.LOGIN]: <LazyLoader 
              importFunc={() => import('./pages/Login/Login')}
              fallback={<div>Loading...</div>}
            />,//<Login />,
    [ROUTES.SETTINGS]: <Home />,
    [ROUTES.SEED_PHRASE_CREATE]: <SeedPhraseCreate />,
    [ROUTES.SEED_PHRASE_RECOVER]: <SeedPhraseRecover />,
    [ROUTES.SEED_PHRASE_CONFIRM]: <SeedPhraseConfirm />,
    [ROUTES.PASSWORD_SECURITY]: <Password />,
    [ROUTES.ONBOARDING]: <Home />,
    [ROUTES.WALLET_CREATED]: <WalletCreated />,
    [ROUTES.DASHBOARD]: <Dashboard />,
    [ROUTES.ACCOUNT_LIST]: <AccountList />
  };
  return routes[currentRoute] || <div>404 Not Found</div>;
}

function App() {
  return (
    <RouterProvider>
      <Router />
    </RouterProvider>
  );

} 

export default App