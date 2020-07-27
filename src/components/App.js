import React from 'react';

import { themeObj } from './context/context';
import { Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

function App() {
  return (
    <ThemeProvider theme={themeObj}>
      <div>
        <Switch>
          <Route exact path="/">
            <Index />
          </Route>
        </Switch>
      </div>
    </ThemeProvider>
  );
}

export default App;
