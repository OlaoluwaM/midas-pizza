import React from 'react';
import Home from './Home';
import Nav from './NavBar';
import Loading from './Loading';
import whyDidYouRender from '@welldone-software/why-did-you-render';

import { toast } from 'react-toastify';
import { ThemeProvider } from 'styled-components';
import { ErrorBoundary } from 'react-error-boundary';
import { useSetRecoilState } from 'recoil';
import { cartState as cartStateAtom } from './atoms';
import { themeObj, UserSessionContext } from './context/context';
import { Route, Switch, useLocation, Redirect } from 'react-router-dom';
import { NotFoundPage, ErrorPage, ServerDownPage } from './ErrorPages';
import {
  normalize,
  generateUrl,
  fetchWrapper,
  generateFetchOptions,
  formatCartFromServer,
} from './utils/helpers';
import {
  MotionConfig,
  ExitFeature,
  AnimationFeature,
  AnimateLayoutFeature,
  GesturesFeature,
} from 'framer-motion';

const Authenticate = React.lazy(() => import('./Auth'));
const CartPreview = React.lazy(() => import('./Cart'));
const Settings = React.lazy(() => import('./Settings'));
const Menu = React.lazy(() => import('./Menu'));

whyDidYouRender(React, {
  onlyLogs: true,
  titleColor: 'green',
  diffNameColor: 'red',
});

function PrivateRoute({ authenticated, children, ...rest }) {
  const validTokenExists = JSON.parse(localStorage.getItem('currentAccessToken')) || false;

  const { location } = rest;

  return (
    <Route {...rest}>
      {authenticated ? (
        children
      ) : validTokenExists ? (
        <Loading fullscreen={true} />
      ) : (
        <Redirect
          to={{
            pathname: '/authenticate',
            state: { from: location },
          }}
        />
      )}
    </Route>
  );
}

PrivateRoute.whyDidYouRender = true;
function App() {
  const currentToken = JSON.parse(localStorage.getItem('currentAccessToken')) || void 0;

  const [activeUser, setActiveUser] = React.useState({
    userData: null,
    authenticated: false,
  });

  const [serverConnectionStatus, setConnectionStatus] = React.useState(1);
  const updateCart = useSetRecoilState(cartStateAtom);

  const { userData, authenticated } = activeUser;

  const location = useLocation();
  const logUserOut = () => setActiveUser({ userData: null, authenticated: false });
  const retryServerConnection = () => setConnectionStatus(1);

  React.useEffect(() => {
    if (serverConnectionStatus === 2 || serverConnectionStatus === 0) return;
    console.log('Trying to connect to sever...');

    (async () => {
      try {
        await fetchWrapper(generateUrl('/ping'), generateFetchOptions('GET'));
        setConnectionStatus(2);
        console.log('Server is up');
      } catch (error) {
        console.error(error);
        setConnectionStatus(0);
        console.log('Server is down');
      }
    })();
  }, [serverConnectionStatus]);

  React.useEffect(() => {
    if (serverConnectionStatus !== 2 || (userData && authenticated) || !currentToken) return;
    console.log('authenticating user...');

    (async () => {
      try {
        const ownerOfCurrentToken = await fetchWrapper(
          generateUrl(`users?email=${currentToken.email}`),
          generateFetchOptions('GET', null, currentToken.Id)
        );

        if (!(authenticated || currentToken)) {
          toast(`Welcome Back ${ownerOfCurrentToken.name}`, { type: 'success' });
        }

        const { cart: storedCart = {} } = ownerOfCurrentToken;
        const persistedOrder = JSON.parse(localStorage.getItem('storedCart')) || {};
        const cartToUpdateWith = normalize(persistedOrder) ?? formatCartFromServer(storedCart);

        if (cartToUpdateWith) {
          updateCart(cartToUpdateWith);
          toast('We saved your order, no need to thank us 😊', { type: 'info' });
        }

        setActiveUser({ userData: ownerOfCurrentToken, authenticated: true });
        console.log('Authentication complete!');
      } catch (error) {
        console.error(error);

        if (error?.status === 401) {
          localStorage.removeItem('currentAccessToken');
          toast('Your session has expired. You will need to log in', { type: 'info' });
        }
      }
    })();
  }, [authenticated, serverConnectionStatus]);

  const { checkingConnectionWithServer, serverIsDown } = {
    checkingConnectionWithServer: serverConnectionStatus === 1 || serverConnectionStatus > 2,
    serverIsDown: !serverConnectionStatus,
  };

  return (
    <UserSessionContext.Provider value={activeUser}>
      <ThemeProvider theme={themeObj}>
        <MotionConfig
          features={[AnimateLayoutFeature, AnimationFeature, ExitFeature, GesturesFeature]}>
          {checkingConnectionWithServer ? (
            <Loading fullscreen={true} />
          ) : serverIsDown ? (
            <ServerDownPage
              serverStatus={serverConnectionStatus}
              retryConnection={retryServerConnection}
            />
          ) : (
            <>
              <Nav logUserOut={logUserOut} />

              <ErrorBoundary FallbackComponent={ErrorPage}>
                <React.Suspense fallback={<Loading fullscreen={true} />}>
                  <Switch location={location} key={location.pathname}>
                    <Route exact path="/">
                      <Home />
                    </Route>

                    <Route path="/authenticate">
                      <Authenticate authUser={setActiveUser} />
                    </Route>

                    <PrivateRoute path="/menu" authenticated={authenticated}>
                      <Menu />
                    </PrivateRoute>

                    <PrivateRoute path="/settings" authenticated={authenticated}>
                      <Settings />
                    </PrivateRoute>

                    <PrivateRoute path="/cart" authenticated={authenticated}>
                      <CartPreview />
                    </PrivateRoute>

                    <Route>
                      <NotFoundPage />
                    </Route>
                  </Switch>
                </React.Suspense>
              </ErrorBoundary>
            </>
          )}
        </MotionConfig>
      </ThemeProvider>
    </UserSessionContext.Provider>
  );
}

App.whyDidYouRender = true;

export default App;
