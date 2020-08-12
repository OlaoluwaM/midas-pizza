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

// async function renewToken(currentUserToken) {
//   const { Id, expirationDate } = currentUserToken;

//   if (expirationDate < Date.now()) {
//     localStorage.removeItem('currentAccessToken');
//     return;
//   }

//   try {
//     await fetch(generateUrl('tokens'), generateFetchOptions('PUT', {}, Id));
//   } catch (error) {
//     console.error(error);
//     throw new Error('An error occurred renewing token on the server');
//   }

//   currentUserToken.expirationDate += 1000 * 3600;
//   console.log('updated token');
//   localStorage.setItem('currentAccessToken', JSON.stringify(currentUserToken));

//   toast('Welcome Back', { type: 'success' });
// }

// async function getCurrentUser({ Id, email }) {
//   try {
//     const req = await fetch(
//       generateUrl(`users?email=${email}`),
//       generateFetchOptions('GET', null, Id)
//     );

//     if (!req.ok) {
//       throw new Error(`Request failed with status of ${req.status} and ${req.statusText}`);
//     }
//     return await req.json();
//   } catch (error) {
//     console.error(error);
//     throw new Error('An error occurred retrieving current user');
//   }
// }

function App() {
  const currentUserToken = JSON.parse(localStorage.getItem('currentAccessToken')) || void 0;
  console.log(currentUserToken);

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

        setActiveUser({ userData: ownerOfCurrentToken, authenticated: true });
      } catch (error) {
        toast(error.message, { type: 'error' });
      }
    })();
  }, [activeUser.authenticated]);

  console.log(activeUser);

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
