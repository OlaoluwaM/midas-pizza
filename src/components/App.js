import React from 'react';
import Home from './Home';
import Nav from './NavBar';

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

// TODO get or create a loading component
// TODO change notification animations

function App() {
  const location = useLocation();

  return (
    <ThemeProvider theme={themeObj}>
      <MotionConfig features={[AnimateLayoutFeature, AnimationFeature, ExitFeature]}>
        <div>
          <Nav />
          <ToastContainer hideProgressBar />

          <AnimatePresence exitBeforeEnter>
            <React.Suspense
              key={location.pathname}
              fallback={<p style={{ position: 'absolute', top: 0 }}>Loading...</p>}>
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
