import Menu from '../components/Menu';
import NavBar from '../components/NavBar';

import { MemoryRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { render, cleanup, fireEvent, act } from '@testing-library/react';

afterAll(cleanup);

function renderWithContext() {
  const context = {
    userData: {
      name: 'Joey Anderman',
      streetAddress: '9165 Littleton Ave. Patchogue, NY 11772',
      email: 'joey@gmail.com',
    },
    authenticated: true,
  };

  return render(contextWrapper([ToastContainer, NavBar, Menu], context), { wrapper: MemoryRouter });
}
afterEach(() => jest.clearAllTimers());
window.localStorage.getItem = jest.fn(() => JSON.stringify(testAccessToken));

test('Should make sure shopping cart changes appropriately with counter interactions', async () => {
  fetch
    .once(JSON.stringify(formatFetchResponse(menu)), { status: 200 })
    .once(JSON.stringify(formatFetchResponse('Order saved!')), { status: 200 });

  jest.useFakeTimers();

  let utils;

  await act(async () => {
    utils = renderWithContext();
  });

  const { findByTestId, findAllByTestId, findByRole } = utils;

  const shoppingCartQuantity = await findByTestId('cart-count');
  const addToCartButtons = await findAllByTestId('add-to-cart-button');
  const quantityInputs = await findAllByTestId('quantity-input');

  const addToCartButton = addToCartButtons[0];
  const quantityInput = quantityInputs[0];

  fireEvent.click(addToCartButton);
  // Cart to increment when item is added
  expect(shoppingCartQuantity).toHaveTextContent('1');

  fireEvent.input(quantityInput, { target: { value: 9 } });
  fireEvent.click(addToCartButton);

  expect(shoppingCartQuantity).toHaveTextContent('10');

  fireEvent.input(quantityInput, { target: { value: 1 } });
  fireEvent.click(addToCartButton);

  act(() => {
    jest.advanceTimersByTime(1000);
  });

  // Notification should be displayed when user tries to exceed order limit
  const toast = await findByRole('alert');
  expect(toast).toHaveTextContent(/cannot order more than/i);

  // The order that would have exceeded the limit should not be added, previous cart state should be maintained
  expect(shoppingCartQuantity).toHaveTextContent('10');
});
