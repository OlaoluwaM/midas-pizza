import React from 'react';
import App from '../components/App';

import { RecoilRoot } from 'recoil';
import { MemoryRouter } from 'react-router-dom';
import { render, cleanup, fireEvent, act, screen } from '@testing-library/react';

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

test.each([
  ['with non-empty cart', { ...menuContext.userData, cart: initialUserCart }, 3],
  ['with empty cart', menuContext.userData, 0],
])('Should check if user can log out %s cart', async (_, dataFromServer, orderCount) => {
  fetch
    .once(JSON.stringify(formatFetchResponse(dataFromServer)), { status: 200 })
    .once(JSON.stringify(formatFetchResponse('response')), { status: 200 })
    .once(JSON.stringify(formatFetchResponse('response')), { status: 200 });

  let utils;

  // Render App
  await act(async () => {
    utils = renderApp();
  });

  const { findByTestId } = utils;

  // Make sure cart state is matches data from server and test description
  const cartCount = await findByTestId('cart-count');
  expect(cartCount).toHaveTextContent(`${orderCount}`);

  const settingsIcon = await screen.findByTitle('Settings');
  fireEvent.mouseOver(settingsIcon);

  const logoutButton = await findByTestId('logout-button');
  const tooltipMenu = await findByTestId('settings-tooltip-menu');

  expect(logoutButton).toBeInTheDocument();

  window.localStorage.getItem = jest
    .fn(() => null)
    .mockImplementationOnce(() => JSON.stringify(testAccessToken));

  fireEvent.mouseOver(tooltipMenu);

  await act(async () => {
    fireEvent.click(logoutButton);
  });

  // Check if user has been logged out
  expect(settingsIcon).not.toBeInTheDocument();
  expect(cartCount).not.toBeInTheDocument();
});
