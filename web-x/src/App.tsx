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


export const ExampleComponent: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Primary Buttons */}
      <Button variant="primary" >Sign Up</Button>
      <Button variant="primary" disabled>
        Sign Up
      </Button>

      {/* Secondary Buttons */}
      <Button variant="secondary">Sign Up</Button>
      <Button variant="secondary" disabled>
        Sign Up
      </Button>

      {/* Tertiary Buttons */}
      <Button variant="tertiary">Forgot your password?</Button>
      <Button variant="tertiary" disabled>
        Forgot your password?
      </Button>
    </div>
  );
};

export const ExampleComponent2: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Tertiary Buttons */}
            <InputField 
        label="Username"
        placeholder="Enter your username"
        helperText="This will be your display name"
      />

      {/* // With error state */}
      <InputField 
        label="Email"
        placeholder="Enter your email"
        error="Please enter a valid email address"
      />

      {/* // With success state */}
      <InputField 
        label="Password"
        type="password"
        placeholder="Enter your password"
        success="Password meets requirements"
      />

      {/* // Disabled state */}
      <InputField 
        label="Account ID"
        placeholder="Account ID"
        disabled
      />

      {/* // Secondary variant */}
      <InputField 
        label="Profile URL"
        placeholder="Enter profile URL"
        variant="secondary"
      />
    </div>
  );
};

export const ExampleComponent3: React.FC = () => {

        // Example with form state management
        const [agreed, setAgreed] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Tertiary Buttons */}
      <InputField 
        label="Username"
        placeholder="Enter your username"
        helperText="This will be your display name"
        variant="secondary"
      />

        {/* // Example usage with links in the label */}
        <Checkbox>
          I agree to the <a href="/agreement">User Agreement</a> and{' '}
          <a href="/privacy">Privacy Policy</a>
        </Checkbox>

        <Radio>
          I agree to the <a href="/agreement">User Agreement</a> and{' '}
          <a href="/privacy">Privacy Policy</a>
        </Radio>

        {/* // With error state */}
        <Checkbox error>
          I agree to the <a href="/agreement">User Agreement</a> and{' '}
          <a href="/privacy">Privacy Policy</a>
        </Checkbox>

        {/* // Disabled state */}
        <Checkbox disabled>
          I agree to the <a href="/agreement">User Agreement</a> and{' '}
          <a href="/privacy">Privacy Policy</a>
        </Checkbox>

        <Checkbox
          checked={agreed}
          onChange={setAgreed}
        >
          I agree to the <a href="/agreement">User Agreement</a> and{' '}
          <a href="/privacy">Privacy Policy</a>
        </Checkbox>
    </div>
  );
}

export const AppUX = ()=>{
  
  const { navigate } = useRouter();

  const [count, setCount] = useState(0)

  const handleSignInNavigation = (route: string) => {
    navigate(route, { id: '123' });
  };

  return (
    <>
      <div>
        <Button variant='tertiary' onClick={()=>handleSignInNavigation(ROUTES.HOME)} >
          Home
        </Button>
        <Button variant='tertiary' onClick={()=>handleSignInNavigation(ROUTES.LOGIN)} >
          Unlock
        </Button>
        <Button variant='tertiary' onClick={()=>handleSignInNavigation(ROUTES.SEED_PHRASE_CREATE)} >
          Create A New Wallet
        </Button>
        <Button variant='tertiary' onClick={()=>handleSignInNavigation(ROUTES.SEED_PHRASE_CONFIRM)} >
          Confirm Seed Phrase
        </Button>
        <Button variant='tertiary' onClick={()=>handleSignInNavigation(ROUTES.SEED_PHRASE_RECOVER)} >
          Restore Existing Wallet
        </Button>

        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          {/* <img src={reactLogo} className="logo react" alt="React logo" /> */}

        </a>
      </div>
      <h1>Vite + React</h1>
      <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quas, distinctio, architecto aliquam adipisci error provident molestiae praesentium quidem quia voluptatem, consequuntur esse natus cumque nam. Molestiae ipsum quos nulla ad.</p>
      <Logo size={64} />

      <div className="card">
        <Button variant='secondary' onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </Button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <ExampleComponent />
      <ExampleComponent2 />
      <ExampleComponent3 />
    </>
  )
}


// const App = () => {

// import { RouterProvider, useRouter } from './context/RouterContext';
// import { ROUTES } from './constants';

// Import your components
// import Onboarding from './pages/Onboarding';
// import Signup from './pages/Signup';
// import Login from './pages/Login';
// import Dashboard from './pages/Dashboard';
// import Settings from './pages/Settings';

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