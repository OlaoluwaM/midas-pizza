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
import { generateFetchOptions, generateUrl, fetchWrapper } from './local-utils/helpers';
import {
  AnimatePresence,
  MotionConfig,
  AnimateLayoutFeature,
  AnimationFeature,
  ExitFeature,
  m as motion,
} from 'framer-motion';

const Authenticate = React.lazy(() => import('./Auth'));
const Menu = React.lazy(() => import('./Menu'));

whyDidYouRender(React, {
  onlyLogs: true,
  titleColor: 'green',
  diffNameColor: 'red',
});

function App() {
  const currentUserToken = JSON.parse(localStorage.getItem('currentAccessToken')) || void 0;

  const [activeUser, setActiveUser] = React.useState({
    userData: null,
    authenticated: false,
  });
  const updateCart = useSetRecoilState(cartStateAtom);

  const { userData, authenticated } = activeUser;
  const protectedRoutes = [['/menu', Menu]];

  const location = useLocation();

  React.useEffect(() => {
    if (!currentUserToken) return;
    if (userData !== null) return;

    (async () => {
      try {
        const ownerOfCurrentToken = await fetchWrapper(
          generateUrl(`users?email=${currentUserToken.email}`),
          generateFetchOptions('GET', null, currentUserToken.Id)
        );

        if (!authenticated) {
          toast(`Welcome Back ${ownerOfCurrentToken.name}`, { type: 'success' });
          const persistedOrder = localStorage.getItem('orderList');

          if (persistedOrder) {
            toast('We saved your order, no need to thank us 😊', { type: 'info' });

            updateCart(JSON.parse(persistedOrder));
          }
        }

        setActiveUser({ userData: ownerOfCurrentToken, authenticated: true });
      } catch (error) {
        console.error(error);
        const { name } = error;

        if (name === 'ServerConnectionError') {
          console.error('Redirect required');
          // TODO Redirect to Error page
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
      <ThemeProvider theme={themeObj}>
        <MotionConfig features={[AnimateLayoutFeature, AnimationFeature, ExitFeature]}>
          <div>
            <Nav />

            <ToastContainer hideProgressBar position="bottom-right" />

            <React.Suspense fallback={<Loading fullscreen={true} />}>
              <AnimatePresence exitBeforeEnter initial={false}>
                <Switch location={location} key={location.pathname}>
                  <Route exact path="/">
                    <Home />
                  </Route>

                  <Route path="/authenticate">
                    <Authenticate authUser={setActiveUser} />
                  </Route>

                  {authenticated &&
                    protectedRoutes.map(([path, Component]) => (
                      <Route path={path} key={path}>
                        <Component />
                      </Route>
                    ))}

                  <Route>
                    <motion.div
                      exit={{ opacity: 0 }}
                      style={{ position: 'fixed', bottom: '50%', left: '50%' }}>
                      404
                    </motion.div>
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
