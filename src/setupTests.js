// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
require('jest-fetch-mock').enableMocks();

import React from 'react';
import CustomError from './components/local-utils/custom-error';

import { ThemeProvider } from 'styled-components';
import { themeObj, UserSessionContext } from './components/context/context';

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

global.menu = Object.fromEntries(
  JSON.parse(menuArrayJSON).map(arr => [`${arr[0]} (${arr[2]})`, `$${arr[1]}`])
);

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(() => null),
    setItem: jest.fn(() => null),
    removeItem: jest.fn(() => null),
  },
  writable: true,
});
global.CustomError = CustomError;

global.contextWrapper = function (Component, contextValue = { authenticated: false }) {
  return (
    <ThemeProvider theme={themeObj}>
      <UserSessionContext.Provider value={contextValue}>
        <Component />
      </UserSessionContext.Provider>
    </ThemeProvider>
  );
};
