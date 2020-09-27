import React from 'react';
import Home from './Home';
import Nav from './NavBar';
import Loading from './Loading';
import whyDidYouRender from '@welldone-software/why-did-you-render';

import { ThemeProvider } from 'styled-components';
import { useSetRecoilState } from 'recoil';
import { ToastContainer, toast } from 'react-toastify';
import { cartState as cartStateAtom } from './atoms';
import { Route, Switch, useLocation } from 'react-router-dom';
import { themeObj, UserSessionContext } from './context/context';
import { NotFoundPage, NotAuthorizedPage } from './ErrorPages';
import {
  generateFetchOptions,
  generateUrl,
  fetchWrapper,
  formatCartFromServer,
  normalize,
} from './local-utils/helpers';
import {
  AnimatePresence,
  MotionConfig,
  AnimateLayoutFeature,
  AnimationFeature,
  ExitFeature,
} from 'framer-motion';

const Authenticate = React.lazy(() => import('./Auth'));
const Menu = React.lazy(() => import('./Menu'));
const CartPreview = React.lazy(() => import('./Cart'));

whyDidYouRender(React, {
  onlyLogs: true,
  titleColor: 'green',
  diffNameColor: 'red',
});

function App() {
  const userToken = React.useRef(!!localStorage.getItem('currentAccessToken'));
  const { current: currentUserToken } = userToken;

  const [activeUser, setActiveUser] = React.useState({
    userData: null,
    authenticated: false,
  });
  const updateCart = useSetRecoilState(cartStateAtom);

  const { userData, authenticated } = activeUser;
  const protectedRoutes = [
    ['/menu', Menu, { exact: true }],
    ['/menu/cart', CartPreview],
  ];

  const location = useLocation();

  React.useEffect(() => {
    const currentToken = JSON.parse(localStorage.getItem('currentAccessToken')) || void 0;

    if ((userData && authenticated) || !currentToken) return;
    userToken.current = !!currentToken;

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

          Object.keys(cartToUpdateWith).length > 0 &&
            toast('We saved your order, no need to thank us 😊', { type: 'info' });
        }

        setActiveUser({ userData: ownerOfCurrentToken, authenticated: true });
      } catch (error) {
        console.error(error);
        const { name = null } = error;

        if (name === 'ServerConnectionError' || name === null) {
          console.error('Redirect required');
          // <Redirect to="/error-page" />
        } else {
          const { status } = error;
          let errorText = 'An error occurred. Please refresh and try again';
          if (status === 401) {
            errorText = 'Your session has expired. Please log back in';
            localStorage.removeItem('currentAccessToken');
          }

          toast(errorText, { type: 'error' });
        }
      }
    })();
  }, [authenticated]);

  return (
    <UserSessionContext.Provider value={activeUser}>
      {/* <ErrorBoundaryContext.Provider value={}></ErrorBoundaryContext.Provider> */}
      <ThemeProvider theme={themeObj}>
        <MotionConfig features={[AnimateLayoutFeature, AnimationFeature, ExitFeature]}>
          <div>
            <Nav />

            <ToastContainer hideProgressBar position="bottom-right" pauseOnFocusLoss={true} />

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
                      ) : currentUserToken ? (
                        <Loading fullscreen={true} />
                      ) : (
                        <NotAuthorizedPage />
                      )}
                    </Route>
                  ))}

                  <Route>
                    <NotFoundPage />
                  </Route>
                </Switch>
              </AnimatePresence>
            </React.Suspense>
          </div>
        </MotionConfig>
      </ThemeProvider>
    </UserSessionContext.Provider>
  );
}

App.whyDidYouRender = true;

export default App;
