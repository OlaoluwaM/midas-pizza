import React from 'react';
import App from '../components/App';

import { RecoilRoot } from 'recoil';
import { MemoryRouter } from 'react-router-dom';
import { getTotal, convertDollarToFloat } from '../components/local-utils/helpers';
import { render, cleanup, fireEvent, act, within } from '@testing-library/react';

afterAll(cleanup);

const store = {
  currentAccessToken: testAccessToken,
  storedCart: initialCart,
};
window.localStorage.getItem = jest.fn(key => JSON.stringify(store[key]));

fetch.mockResponse(JSON.stringify(formatFetchResponse(menuContext.userData)), { status: 200 });

test('Should check if user can see and update order in cart', async () => {
  let utils;

  // Render Cart
  await act(async () => {
    utils = render(
      <MemoryRouter initialEntries={['/cart']}>
        <RecoilRoot>
          <App />
        </RecoilRoot>
      </MemoryRouter>
    );
  });

  const { findByTestId, findAllByTestId } = utils;
  const cartCount = await findByTestId('cart-count');

  // Make sure cart count matches initial cart object data
  expect(cartCount).toHaveTextContent('3');

  const orderItems = await findAllByTestId('order-item');
  const cartTotal = await findByTestId('cart-total');
  const prevCartTotal = getTotal(initialCart).toFixed(2);

  // Order items should be displayed
  expect(orderItems).toHaveLength(3);
  expect(cartTotal).toHaveTextContent(`$${prevCartTotal}`);

  let orderIndex = 0;

  for await (let order of orderItems) {
    const orderNameElem = within(order).getByTestId('order-item-name');
    const orderName = orderNameElem.textContent.split('$')[0];

    const orderInitialPrice = within(order).getByTestId('order-item-initial-price');

    const orderCount = within(order).getByTestId('order-count-input');
    const orderTotal = within(order).getByTestId('order-item-total');

    // Order Item should be in cart.
    expect(orderName in initialCart).toBeTruthy();
    const { initialPrice, quantity } = initialCart[orderName];

    if (orderIndex === 0) {
      // Makes sure that cart data is displayed correctly
      expect(orderTotal).toHaveTextContent(`$${quantity * initialPrice}`);
      expect(orderCount).toHaveValue(quantity);
      expect(orderInitialPrice).toHaveTextContent(`$${initialPrice}`);
    } else if (orderIndex === 1) {
      // On order item quantity change cart should update accordingly
      await act(async () => {
        fireEvent.input(orderCount, { target: { value: 3 } });
      });
      expect(cartCount).toHaveTextContent('5');
      const newTotal = initialPrice * 3;

      expect(orderTotal).toHaveTextContent(`$${newTotal}`);
      expect(cartTotal).toHaveTextContent(
        `$${(prevCartTotal - initialPrice + newTotal).toFixed(2)}`
      );

      await act(async () => {
        fireEvent.input(orderCount, { target: { value: 8 } });
      });
      expect(cartCount).toHaveTextContent('10');

      // Cart should not exceed quantity limit
      await act(async () => {
        fireEvent.input(orderCount, { target: { value: 9 } });
      });
      // If user tries to exceed quantity limit cart should not, previous values should hold
      expect(cartCount).toHaveTextContent('10');
      expect(orderCount).toHaveValue(8);
    } else {
      const deleteButton = within(order).getByTestId('order-item-delete-button');
      // Delete item from cart
      await act(async () => {
        fireEvent.click(deleteButton);
      });

      // Cart count should decrement
      expect(cartCount).toHaveTextContent('9');
      const newCartTotal = convertDollarToFloat(cartTotal.textContent).toFixed(2);

      expect(cartTotal).toHaveTextContent(`$${newCartTotal}`);

      // Item should not be visible
      expect(order).toHaveStyle(`opacity: 0`);
    }

    orderIndex++;
  }
});

test('Should check if user can empty their cart', async () => {
  let utils;

  // Render Cart
  await act(async () => {
    utils = render(
      <MemoryRouter initialEntries={['/cart']}>
        <RecoilRoot>
          <App />
        </RecoilRoot>
      </MemoryRouter>
    );
  });

  const { findByTestId, findAllByTestId } = utils;
  const cartCount = await findByTestId('cart-count');

  const orderItems = await findAllByTestId('order-item');
  const cartHeader = await findByTestId('cart-header');

  for await (let order of orderItems) {
    const deleteButton = within(order).getByTestId('order-item-delete-button');
    fireEvent.click(deleteButton);
  }

  expect(cartCount).toHaveTextContent('0');
  expect(cartHeader).toHaveTextContent(/empty/i);

  const emptyCartSvg = await findByTestId('empty-cart-svg');
  expect(emptyCartSvg).toBeInTheDocument();
});
