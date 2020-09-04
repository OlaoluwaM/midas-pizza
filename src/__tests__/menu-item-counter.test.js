import Menu from '../components/Menu';
import NavBar from '../components/NavBar';

import { MemoryRouter } from 'react-router-dom';
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

  return render(contextWrapper([NavBar, Menu], context), { wrapper: MemoryRouter });
}

const store = {
  currentAccessToken: JSON.stringify(testAccessToken),
  orderList: JSON.stringify({ 'Pepperoni Pizza Small (Pizza)': 2 }),
};
window.localStorage.getItem = jest.fn(key => store[key]);

test('Should make sure shopping cart changes appropriately with counter interactions', async () => {
  fetch.once(JSON.stringify(menu), { status: 200 });

  let utils;

  await act(async () => {
    utils = renderWithContext();
  });

  const { findByTestId, findAllByTestId } = utils;

  const shoppingCartQuantity = await findByTestId('cart-count');
  const addToCartButtons = await findAllByTestId('add-to-cart-button');
  const quantityInputs = await findAllByTestId('quantity-input');

  const addToCartButton = addToCartButtons[0];
  const quantityInput = quantityInputs[0];

  fireEvent.click(addToCartButton);
  expect(localStorage.getItem).toHaveBeenCalledTimes(2);
  expect(localStorage.getItem).toHaveBeenCalledWith('orderList');

  expect(shoppingCartQuantity).toHaveTextContent('3');

  fireEvent.input(quantityInput, { target: { value: 2 } });
  fireEvent.click(addToCartButton);

  expect(shoppingCartQuantity).toHaveTextContent('5');
});
