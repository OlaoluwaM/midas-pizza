import React from 'react';
import Home from './Home';
import Nav from './NavBar';
import Loading from './Loading';

import { themeObj } from './context/context';
import { ThemeProvider } from 'styled-components';
import { ToastContainer } from 'react-toastify';
import { Route, Switch, useLocation } from 'react-router-dom';
import {
  AnimatePresence,
  MotionConfig,
  AnimateLayoutFeature,
  AnimationFeature,
  ExitFeature,
} from 'framer-motion';

const Authenticate = React.lazy(() => import('./Auth'));

function App() {
  const location = useLocation();

  return (
    <ThemeProvider theme={themeObj}>
      <MotionConfig features={[AnimateLayoutFeature, AnimationFeature, ExitFeature]}>
        <div>
          <Nav />
          <ToastContainer hideProgressBar />

          <AnimatePresence exitBeforeEnter>
            <React.Suspense key={location.pathname} fallback={<Loading fullscreen={true} />}>
              <Switch location={location}>
                <Route path="/authenticate">
                  <Authenticate />
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
  );
}

export default App;
