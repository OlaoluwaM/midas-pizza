import React from 'react';
import App from '../components/App';

import { RecoilRoot } from 'recoil';
import { MemoryRouter } from 'react-router-dom';
import { render, cleanup, fireEvent, act, screen, within } from '@testing-library/react';

afterAll(cleanup);

function renderApp() {
  return render(
    <MemoryRouter>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </MemoryRouter>
  );
}

beforeEach(() => {
  window.localStorage.getItem = jest.fn(key =>
    key === 'currentAccessToken' ? JSON.stringify(testAccessToken) : null
  );
});

test('If user can terminate account', async () => {
  const dataFromServer = { ...menuContext.userData, cart: initialUserCart };

  fetch
    .once(JSON.stringify(formatFetchResponse(menuContext.userData)), { status: 200 })
    .once(JSON.stringify(formatFetchResponse(dataFromServer)), { status: 200 })
    .once(JSON.stringify(formatFetchResponse('response')), { status: 200 })
    .once(JSON.stringify(formatFetchResponse('response')), { status: 200 });

  let utils;

  // Render App
  await act(async () => {
    utils = renderApp();
  });

  const { findByTestId, findByRole } = utils;

  const settingsIcon = await screen.findByTitle('Settings');
  fireEvent.click(settingsIcon);
  const cartCount = await findByTestId('cart-count');

  const deleteAccountButton = await findByTestId('delete-account-button');

  window.localStorage.removeItem = jest.fn();
  window.sessionStorage.removeItem = jest.fn();

  await act(async () => {
    fireEvent.click(deleteAccountButton);
  });

  const modal = await findByTestId('modal');
  const confirmAccountDeleteButton = await within(modal).findByRole('button');

  expect(confirmAccountDeleteButton).toBeDisabled();

  const confirmationInputField = await within(modal).findByPlaceholderText('DELETE');

  fireEvent.input(confirmationInputField, { target: { value: 'DELETE' } });

  expect(confirmAccountDeleteButton).not.toBeDisabled();

  await act(async () => {
    fireEvent.click(confirmAccountDeleteButton);
  });

  expect(window.sessionStorage.removeItem).toHaveBeenCalled();
  expect(window.localStorage.removeItem).toHaveBeenCalledTimes(2);

  await act(async () => jest.advanceTimersByTime(1000));

  expect(await findByRole('alert')).toBeInTheDocument();

  expect(settingsIcon).not.toBeInTheDocument();
  expect(cartCount).not.toBeInTheDocument();
});
