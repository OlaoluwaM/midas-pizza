import React from 'react';
import App from '../components/App';

import { RecoilRoot } from 'recoil';
import { MemoryRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { render, cleanup, act } from '@testing-library/react';

afterAll(cleanup);

afterEach(() => jest.clearAllTimers());

window.localStorage.getItem = jest.fn(() => JSON.stringify(testAccessToken));
jest.useFakeTimers();

test('Should automatically authenticate user', async () => {
  fetch.once(
    JSON.stringify({
      email: 'britt@gmail.com',
      name: 'Brittany D Kenney',
      streetAddress: '545 W. Ann St. Matthews, NC 28104',
    }),
    { status: 200 }
  );

  let utils;
  await act(async () => {
    utils = render(
      <RecoilRoot>
        <App />
      </RecoilRoot>,
      { wrapper: MemoryRouter }
    );
  });

  const { getByTestId, getByRole } = utils;
  act(() => {
    jest.advanceTimersByTime(1000);
  });

  const link = getByTestId('link');
  const toast = getByRole('alert');

  expect(toast).toHaveTextContent(/Welcome Back/i);
  expect(window.localStorage.getItem).toHaveBeenCalledWith('currentAccessToken');

  expect(link).toHaveTextContent(/order/i);
});

test('User should not be auto authenticated if refresh token has expired', async () => {
  fetch.mockRejectOnce({ text: async () => 'Refresh token has expired', status: 401 });

  let utils;
  await act(async () => {
    utils = render(
      <RecoilRoot>
        <App />
      </RecoilRoot>,
      { wrapper: MemoryRouter }
    );
  });

  const { getByTestId, getByRole } = utils;
  act(() => {
    jest.advanceTimersByTime(1000);
  });

  const link = getByTestId('link');
  const alert = getByRole('alert');

  expect(window.localStorage.removeItem).toHaveBeenCalledWith('currentAccessToken');
  expect(alert).toHaveTextContent(/Your session has expired/i);
  expect(link).toHaveTextContent(/sign up/i);
});
