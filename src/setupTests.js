// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
require('jest-fetch-mock').enableMocks();

import React from 'react';
import CustomError from './components/utils/custom-error';

import { render } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { ToastContainer } from 'react-toastify';
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

const menuWithPhotoId = {
  'Pepperoni Pizza Small': 'MqT0asuoIcU',
  'Pepperoni Pizza Medium': 'MQUqbmszGGM',
  'Pepperoni Pizza Large': 'oBbTc1VoT-0',
  'Extravaganza Pizza Small': 'NzHRSLhc6Cs',
  'Extravaganza Pizza Medium': 'Oxb84ENcFfU',
  'Extravaganza Pizza Large': 'pGA4zHvpo5E',
  'Barbecue Chicken Pizza Small': 'kfDsMDyX1K0',
  'Barbecue Chicken Pizza Medium': 'exSEmuA7R7k',
  'Barbecue Chicken Pizza Large': 'CbNAuxSZTFo',
  'Vegan Pizza Small': 'UxRhrU8fPHQ',
  'Vegan Pizza Medium': 'OklpRh8-Sns',
  'Vegan Pizza Large': 'BMVAYjPf6mU',
  'Meatzza Small': 'pPA-_q5v1a8',
  'Meatzza Medium': 'uU0Anw-8Vsg',
  'Meatzza Large': 'yDKHJxfiWDk',
  "Meat Lover's Pizza Small": 'SU1LFoeEUkk',
  "Meat Lover's Pizza Medium": 'JspLKUauwSI',
  "Meat Lover's Pizza Large": 'Y6OgisiGBjM',
  'Small Fries': 'vi0kZuoe0-8',
  'Medium Fries': 'lpsbMRRqMQw',
  'Large Fries': 'U4vWk_DXOT4',
  'Vanilla Ice-cream': '5A0O12BIsjY',
  'Strawberry Ice-cream': 'TLD6iCOlyb0',
  'Chocolate Ice-cream': 'wxmrTxUAMJE',
  Coke: 'z8PEoNIlGlg',
  Water: 'oWV-Pgu142A',
  Sprite: '4KLT91f3mAM',
};

global.menuPhotoIdObject = menuWithPhotoId;

global['menuWithPhotoId'] = Object.fromEntries(
  JSON.parse(menuArrayJSON).map(menuItem => {
    const { length, [length - 1]: lastElement, 0: itemName } = menuItem;
    if (typeof lastElement === 'object') menuItem.splice(length - 1, 1, menuWithPhotoId[itemName]);

    return [itemName, { type: menuItem[2], initialPrice: menuItem[1], photoId: menuItem[3] }];
  })
);

global.formatFetchResponse = res => ({ response: res });

Object.defineProperties(window, {
  localStorage: {
    value: {
      getItem: jest.fn(() => null),
      setItem: jest.fn(() => null),
      removeItem: jest.fn(() => null),
    },
    writable: true,
  },
  sessionStorage: {
    value: {
      getItem: jest.fn(() => null),
      setItem: jest.fn(() => null),
      removeItem: jest.fn(() => null),
    },
    writable: true,
  },
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
  { withAnimations = true, contextValue = { authenticated: false }, routeProps = {} } = {}
) {
  const Wrapper = ({ children }) => (
    <MemoryRouter {...routeProps}>
      <RecoilRoot>
        <MotionConfig
          features={withAnimations ? [AnimateLayoutFeature, AnimationFeature, ExitFeature] : []}>
          <ThemeProvider theme={themeObj}>
            <UserSessionContext.Provider value={contextValue}>
              <ToastContainer />
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
