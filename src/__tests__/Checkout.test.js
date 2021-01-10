import React from 'react';
import Modal from '../components/Modal';
import Checkout from '../components/Checkout';

import { cleanup, act, fireEvent, screen, within } from '@testing-library/react';
import { formatCurrencyForStripe, convertToCurrency } from '../components/utils/helpers';

afterAll(cleanup);

const closeModalMock = jest.fn();

const store = {
  currentAccessToken: testAccessToken,
  storedCart: initialCart,
  prevStoredCart: initialCart,
};

window.localStorage.getItem = jest.fn(key => JSON.stringify(store[key]));

let cartTotalForStripe = formatCurrencyForStripe(
  Object.entries(initialCart).reduce(
    (total, [_, { quantity, initialPrice: basePrice }]) => (total += quantity * basePrice),
    0
  )
);

let cartTotalAsCurrency = convertToCurrency(cartTotalForStripe);

beforeEach(() => {
  jest.useFakeTimers();

  fetch.mockResponse(req => {
    let promise;
    if (req.url.search(/invoice/) > -1) {
      promise = Promise.resolve(JSON.stringify(formatFetchResponse('Invoice sent')));
    } else if (req.method === 'GET') {
      promise = Promise.resolve(
        JSON.stringify(formatFetchResponse({ totalPrice: cartTotalAsCurrency }))
      );
    } else promise = Promise.resolve(JSON.stringify(formatFetchResponse('Cart Updated')));

    return promise.then(res => ({ body: res }));
  });
});

async function renderCheckout(cartTotalToUse = cartTotalAsCurrency) {
  let utils;

  await act(async () => {
    utils = renderWithProviders(
      <Modal className="checkout" closeModal={closeModalMock}>
        <Checkout total={cartTotalToUse} />
      </Modal>,
      {
        contextValue: menuContext,
      }
    );
  });

  return utils;
}

test.each([
  ['the total', void 0, ''],
  ['the correct total', 1, ''],
])('Should allow user view %s for their cart in checkout window', async (_, total, __) => {
  const { findByTestId } = await renderCheckout(total);

  expect(await findByTestId('loader')).toBeInTheDocument();

  expect(await findByTestId('checkout-form')).toBeInTheDocument();
  expect(await findByTestId('checkout-total')).toHaveTextContent(`$${cartTotalAsCurrency}`);
});

test.each([
  ['invalid', { 'Card number': 2222222222222, 'MM/YY': '01 / 12', CVC: 123 }, 'checkout-error'],
  ['valid', { 'Card number': 4242424242424242, 'MM/YY': '04 / 24', CVV: 324 }, 'checkout-success'],
])(
  "Should check if feedback is given when the user's card info is %s",
  async (_, cardInfoToPass, expectedElement) => {
    const { findByTestId, findByPlaceholderText, findByRole } = await renderCheckout();

    let checkoutForm = await findByTestId('checkout-form');
    let payButton = await within(checkoutForm).findByRole('button');

    await act(async () => fireEvent.click(payButton));

    const checkoutErrorModal = await findByTestId('checkout-error');
    expect(checkoutErrorModal).toBeInTheDocument();
    const retryButton = await within(checkoutErrorModal).findByRole('button');

    fireEvent.click(retryButton);
    expect(await findByTestId('checkout-form')).toBeInTheDocument();

    checkoutForm = await findByTestId('checkout-form');
    payButton = await within(checkoutForm).findByRole('button');

    for await (const checkoutFormPlaceholderText of Object.keys(cardInfoToPass)) {
      const inputElem = await findByPlaceholderText(checkoutFormPlaceholderText);

      fireEvent.input(inputElem, {
        target: { value: cardInfoToPass[checkoutFormPlaceholderText] },
      });
    }

    await act(async () => {
      fireEvent.click(payButton);
    });

    expect(await findByRole('alert')).toBeInTheDocument();
    expect(await findByTestId(expectedElement)).toBeInTheDocument();
  }
);
