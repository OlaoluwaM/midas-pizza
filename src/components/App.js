import React from 'react';
import Home from './Home';
import Nav from './NavBar';

import { themeObj } from './context/context';
import { ThemeProvider } from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import { Route, Switch, useLocation } from 'react-router-dom';

const Authenticate = React.lazy(() => import('./Auth'));

function App() {
  const location = useLocation();

  return (
    <ThemeProvider theme={themeObj}>
      <div>
        <Nav />

        <AnimatePresence exitBeforeEnter>
          <React.Suspense
            key={location.pathname}
            fallback={<p style={{ position: 'absolute', top: 0 }}>Loading...</p>}
          >
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
    </ThemeProvider>
  );
}

export default App;
