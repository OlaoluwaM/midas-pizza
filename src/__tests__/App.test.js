import React from 'react';
import App from '../components/App';

import { RecoilRoot } from 'recoil';
import { MemoryRouter } from 'react-router-dom';
import { render, cleanup, act } from '@testing-library/react';

afterAll(cleanup);

afterEach(() => jest.clearAllTimers());

const store = {
  storedCart: initialCart,
  currentAccessToken: testAccessToken,
};
window.localStorage.getItem = jest.fn(key => JSON.stringify(store[key]));

jest.useFakeTimers();

test('Should automatically authenticate user', async () => {
  fetch.once(JSON.stringify(formatFetchResponse(menuContext.userData)), { status: 200 });

  let utils;
  await act(async () => {
    utils = render(
      <RecoilRoot>
        <App />
      </RecoilRoot>,
      { wrapper: MemoryRouter }
    );
  });

  const { getByTestId, getAllByRole } = utils;
  act(() => {
    jest.advanceTimersByTime(1000);
  });

  const link = getByTestId('link');
  const toastArray = getAllByRole('alert');

  expect(toastArray).toHaveLength(2);
  toastArray.forEach(toast => {
    expect(toast).toHaveTextContent(/Welcome back|we saved your order/i);
  });
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

// TODO write tests that handles app state when server is down
// test()
