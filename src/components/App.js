import React from 'react';
import Home from './Home';
import Nav from './NavBar';
import Loading from './Loading';
import whyDidYouRender from '@welldone-software/why-did-you-render';

import { ThemeProvider } from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import { Route, Switch, useLocation } from 'react-router-dom';
import { themeObj, UserSessionContext } from './context/context';
import { generateFetchOptions, generateUrl, fetchWrapper } from './local-utils/helpers';
import {
  AnimatePresence,
  MotionConfig,
  AnimateLayoutFeature,
  AnimationFeature,
  ExitFeature,
} from 'framer-motion';

const Authenticate = React.lazy(() => import('./Auth'));

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

  const location = useLocation();

  React.useEffect(() => {
    if (!currentUserToken) return;
    if (activeUser.userData !== null) return;

    (async () => {
      try {
        const ownerOfCurrentToken = await fetchWrapper(
          generateUrl(`users?email=${currentUserToken.email}`),
          generateFetchOptions('GET', null, currentUserToken.Id)
        );

        if (!activeUser.authenticated) {
          toast(`Welcome Back ${ownerOfCurrentToken.name}`, { type: 'success' });
        }

        setActiveUser({ userData: ownerOfCurrentToken, authenticated: true });
      } catch (error) {
        if (error.search(/Refresh token/i) > -1) error = 'Your session has expired, please log in';
        toast(error, { type: 'error' });
      }
    })();
  }, [activeUser.authenticated]);

  return (
    <UserSessionContext.Provider value={activeUser}>
      <ThemeProvider theme={themeObj}>
        <MotionConfig features={[AnimateLayoutFeature, AnimationFeature, ExitFeature]}>
          <div>
            <Nav />
            <ToastContainer hideProgressBar />

            <AnimatePresence exitBeforeEnter>
              <React.Suspense key={location.pathname} fallback={<Loading fullscreen={true} />}>
                <Switch location={location}>
                  <Route path="/authenticate">
                    <Authenticate authUser={setActiveUser} />
                  </Route>

                  <Route exact path="/">
                    <Home />
                  </Route>
                </Switch>
              </React.Suspense>
            </AnimatePresence>
          </div>
        </MotionConfig>
      </ThemeProvider>
    </UserSessionContext.Provider>
  );
}

App.whyDidYouRender = true;

export default App;
