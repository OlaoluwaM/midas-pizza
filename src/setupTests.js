// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom

global.testAccessToken = {
  email: 'britt@gmail.com',
  Id: '44d73b9751f68200e5942c9d',
  expirationDate: 1597355780727,
};

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(() => null),
    setItem: jest.fn(() => null),
  },
  writable: true,
});

// window.fetch = (response, isOk, status) =>
//   new Promise(res =>
//     res({
//       json: async () => Promise.resolve(response),
//       text: async () => Promise.resolve(response),
//       ok: isOk,
//       status,
//     })
//   );

import '@testing-library/jest-dom/extend-expect';
require('jest-fetch-mock').enableMocks();
