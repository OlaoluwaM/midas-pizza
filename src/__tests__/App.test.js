import React from 'react';
import App from '../components/App';

import { RecoilRoot } from 'recoil';
import { MemoryRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { render, cleanup, act, screen } from '@testing-library/react';

afterAll(cleanup);

const store = {
  storedCart: initialCart,
  currentAccessToken: testAccessToken,
};
window.localStorage.getItem = jest.fn(key => JSON.stringify(store[key]));

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  fetch.resetMocks();
  jest.runOnlyPendingTimers();
  // jest.useRealTimers(); ! This causes tests to fail, WTFFFFFFF!!!!! Culpritt
});

test('Should automatically authenticate user', async () => {
  fetch
    .once(JSON.stringify(formatFetchResponse({})), { status: 200 })
    .once(JSON.stringify(formatFetchResponse(menuContext.userData)), { status: 200 });

  let utils;
  await act(async () => {
    utils = render(
      <RecoilRoot>
        <ToastContainer />
        <App />
      </RecoilRoot>,
      { wrapper: MemoryRouter }
    );
  });

  const { findByTestId, findAllByRole } = utils;
  const link = await findByTestId('link');

  const toastArray = await findAllByRole('alert');

  expect(toastArray).toHaveLength(1);

  toastArray.forEach(toast => {
    expect(toast).toHaveTextContent(/Welcome back|we saved your order/i);
  });

  expect(window.localStorage.getItem).toHaveBeenCalledWith('currentAccessToken');

  expect(link).toHaveTextContent(/order/i);
});

test('Should make sure that user is not auto authenticated if refresh token has expired', async () => {
  fetch
    .once(JSON.stringify(formatFetchResponse({})), { status: 200 })
    .mockRejectOnce({ text: async () => 'Refresh token has expired', status: 401 });

  let utils;

  await act(async () => {
    utils = render(
      <RecoilRoot>
        <ToastContainer />
        <App />
      </RecoilRoot>,
      { wrapper: MemoryRouter }
    );
  });

  const { findByTestId, findByRole } = utils;

  const link = await findByTestId('link');

  const alert = await findByRole('alert');

  expect(window.localStorage.removeItem).toHaveBeenCalledWith('currentAccessToken');
  expect(alert).toHaveTextContent(/Your session has expired/i);

  expect(link).toHaveTextContent(/sign up/i);
});

test('Should let the user know when the server is down', async () => {
  fetch.mockRejectOnce({ text: async () => 'Server is down' }, { status: 500 });

  let utils;

  await act(async () => {
    utils = render(
      <RecoilRoot>
        <ToastContainer />
        <App />
      </RecoilRoot>,
      { wrapper: MemoryRouter }
    );

    const { findByTestId } = utils;
    const loader = await findByTestId('loader');
    expect(loader).toBeInTheDocument();
  });

  screen.debug();

  const { findByRole, findByTitle } = utils;

  const toast = await findByRole('alert');
  expect(toast).toBeInTheDocument();

  expect(await findByTitle('Server is Down')).toBeInTheDocument();
});
