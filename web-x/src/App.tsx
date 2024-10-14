import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { lazy, useState } from 'react'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from './design-system/_components/Button/Button'
import Logo from './design-system/_components/Logo/Logo'
import { InputField } from './design-system/_components/InputField/InputField'
import { Radio } from './design-system/_components/FormControls/Radio'
import { Checkbox } from './design-system/_components/FormControls/Checkbox';
import LayoutOutlet from './layout/LayoutOutlet';
import ErrorPage from './error/ErrorPage';
import { RouterProvider, useRouter } from './routing/RouterContext';
import { ROUTES } from './routing/constants';
import Home from './pages/Home/Home';
import SignUp from './pages/SignUp/SignUp'
import Login from './pages/Login/Login'
import SeedPhraseCreate from './pages/SeedPhrase/SeedPhraseCreate';
import SeedPhraseRecover from './pages/SeedPhrase/SeedPhraseRecover';
import SeedPhraseConfirm from './pages/SeedPhrase/SeedPhraseConfirm';
import { AppUX } from './Misc';


function Router() {
  const { currentRoute, params } = useRouter();

  const routes:any = {
    [ROUTES.HOME]: <Home />,
    [ROUTES.AppUX]: <AppUX />,
    [ROUTES.SIGNUP]: <SignUp />,
    [ROUTES.LOGIN]: <Login />,
    [ROUTES.SETTINGS]: <Home />,
    [ROUTES.SEED_PHRASE_CREATE]: <SeedPhraseCreate />,
    [ROUTES.SEED_PHRASE_RECOVER]: <SeedPhraseRecover />,
    [ROUTES.SEED_PHRASE_CONFIRM]: <SeedPhraseConfirm />,

    [ROUTES.ONBOARDING]: <Home />,
 // [ROUTES.DASHBOARD]: <Home params={params} />,

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