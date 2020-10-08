// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
require('jest-fetch-mock').enableMocks();

import React from 'react';
import CustomError from './components/local-utils/custom-error';

import { render } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { themeObj, UserSessionContext } from './components/context/context';
import { MotionConfig, AnimateLayoutFeature, AnimationFeature, ExitFeature } from 'framer-motion';

const fs = require('fs');
const path = require('path');

global.testAccessToken = {
  email: 'britt@gmail.com',
  Id: '44d73b9751f68200e5942c9d',
  expirationDate: 1597355780727,
};

const menuArrayJSON = fs.readFileSync(
  path.join(__dirname, '../server/.data/menu/menu.json'),
  'utf-8'
);

global.initialCart = {
  'Pepperoni Pizza Small': { type: 'Pizza', quantity: 1, initialPrice: 4.99 },
  Water: { type: 'Drink', quantity: 1, initialPrice: 0.5 },
  Sprite: { type: 'Drink', quantity: 1, initialPrice: 1.59 },
};

global.initialUserCart = {
  'Pepperoni Pizza Small': { type: 'Pizza', quantity: 1, total: 4.99 },
  Water: { type: 'Drink', quantity: 1, total: 0.5 },
  Sprite: { type: 'Drink', quantity: 1, total: 1.59 },
  totalPrice: 7.08,
  orderCount: 3,
};

global.menu = Object.fromEntries(
  JSON.parse(menuArrayJSON).map(arr => [arr[0], { type: arr[2], initialPrice: arr[1] }])
);

global.formatFetchResponse = res => ({ response: res });

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(() => null),
    setItem: jest.fn(() => null),
    removeItem: jest.fn(() => null),
  },
  writable: true,
});
global.CustomError = CustomError;

global.menuContext = {
  userData: {
    email: 'britt@gmail.com',
    name: 'Brittany D Kenney',
    streetAddress: '545 W. Ann St. Matthews, NC 28104',
  },
  authenticated: true,
};

global.renderWithProviders = function (
  ui,
  { contextValue = { authenticated: false }, routeProps = {} } = {}
) {
  const Wrapper = ({ children }) => (
    <MemoryRouter {...routeProps}>
      <RecoilRoot>
        <MotionConfig features={[AnimateLayoutFeature, AnimationFeature, ExitFeature]}>
          <ThemeProvider theme={themeObj}>
            <UserSessionContext.Provider value={contextValue}>
              {children}
            </UserSessionContext.Provider>
          </ThemeProvider>
        </MotionConfig>
      </RecoilRoot>
    </MemoryRouter>
  );

  return {
    ...render(ui, { wrapper: Wrapper }),
  };
};
