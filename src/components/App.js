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
import { NotFoundPage, NotAuthorizedPage, ErrorPage, ServerDownPage } from './ErrorPages';
import {
  normalize,
  generateUrl,
  fetchWrapper,
  generateFetchOptions,
  formatCartFromServer,
} from './local-utils/helpers';
import {
  MotionConfig,
  ExitFeature,
  AnimatePresence,
  AnimationFeature,
  AnimateLayoutFeature,
} from 'framer-motion';

const Authenticate = React.lazy(() => import('./Auth'));
const Menu = React.lazy(() => import('./Menu'));
const CartPreview = React.lazy(() => import('./Cart'));
const Settings = React.lazy(() => import('./Settings'));

whyDidYouRender(React, {
  onlyLogs: true,
  titleColor: 'green',
  diffNameColor: 'red',
});

function App() {
  const connectionStates = ['not connected', 'connecting', 'connected'];
  const currentToken = JSON.parse(localStorage.getItem('currentAccessToken')) || void 0;

  const [activeUser, setActiveUser] = React.useState({
    userData: null,
    authenticated: false,
  });

  const [serverConnectionStatus, setConnectionStatus] = React.useState(1);
  const updateCart = useSetRecoilState(cartStateAtom);

  const { userData, authenticated } = activeUser;
  const protectedRoutes = [
    ['/menu/cart', CartPreview],
    ['/menu', Menu, { exact: true }],
    ['/settings', Settings],
  ];

  const location = useLocation();
  const logUserOut = () => setActiveUser({ userData: null, authenticated: false });
  const retryServerConnection = () => setConnectionStatus(1);

  React.useEffect(() => {
    if (serverConnectionStatus === 2) return;

    (async () => {
      console.log('retrying');
      try {
        await fetchWrapper(generateUrl('/ping'), generateFetchOptions('GET'));
        setConnectionStatus(2);
        console.log('Server is up');
        return;
      } catch (error) {
        console.error(error);
        setConnectionStatus(0);
        console.log('Server is down');
      }
    })();
  }, [serverConnectionStatus]);

  React.useEffect(() => {
    if ((userData && authenticated) || !currentToken) return;

    (async () => {
      try {
        const ownerOfCurrentToken = await fetchWrapper(
          generateUrl(`users?email=${currentToken.email}`),
          generateFetchOptions('GET', null, currentToken.Id)
        );

        !authenticated && toast(`Welcome Back ${ownerOfCurrentToken.name}`, { type: 'success' });

        const { cart: storedCart = {} } = ownerOfCurrentToken;

        const persistedOrder = JSON.parse(localStorage.getItem('storedCart')) || {};
        const cartToUpdateWith = normalize(persistedOrder) ?? formatCartFromServer(storedCart);

        if (cartToUpdateWith) {
          updateCart(cartToUpdateWith);
          toast('We saved your order, no need to thank us 😊', { type: 'info' });
        }

        setActiveUser({ userData: ownerOfCurrentToken, authenticated: true });
      } catch (error) {
        console.error(error);

        if (error?.status === 401) {
          localStorage.removeItem('currentAccessToken');
          toast('Your session has expired. You will need to log in', { type: 'info' });
        }
      }
    })();
  }, [authenticated]);

  return (
    <UserSessionContext.Provider value={activeUser}>
      <ThemeProvider theme={themeObj}>
        <MotionConfig features={[AnimateLayoutFeature, AnimationFeature, ExitFeature]}>
          {serverConnectionStatus === 0 && <Redirect to="/server-down" />}

          {serverConnectionStatus === 1 ? (
            <Loading fullscreen={true} />
          ) : (
            <div>
              <Nav logUserOut={logUserOut} />

              <ErrorBoundary FallbackComponent={ErrorPage}>
                <React.Suspense fallback={<Loading fullscreen={true} />}>
                  <AnimatePresence exitBeforeEnter initial={false}>
                    <Switch location={location} key={location.pathname}>
                      <Route exact path="/">
                        <Home />
                      </Route>

                      <Route path="/authenticate">
                        <Authenticate authUser={setActiveUser} />
                      </Route>

                      {protectedRoutes.map(([path, Component, props]) => (
                        <Route {...props} path={path} key={path}>
                          {authenticated ? (
                            <Component />
                          ) : currentToken ? (
                            <Loading fullscreen={true} />
                          ) : (
                            <NotAuthorizedPage />
                          )}
                        </Route>
                      ))}

                      <Route path="/server-down">
                        <ServerDownPage
                          serverStatus={serverConnectionStatus}
                          retryConnection={retryServerConnection}
                        />
                      </Route>

                      <Route>
                        <NotFoundPage />
                      </Route>
                    </Switch>
                  </AnimatePresence>
                </React.Suspense>
              </ErrorBoundary>
            </div>
          )}
        </MotionConfig>
      </ThemeProvider>
    </UserSessionContext.Provider>
  );
}

App.whyDidYouRender = true;

export default App;
