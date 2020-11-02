import React from 'react';
import Checkout from '../components/Checkout';

import { Elements, useStripe } from '@stripe/react-stripe-js';
import { cleanup, act, fireEvent } from '@testing-library/react';

jest.mock('@stripe/react-stripe-js', () => {
  return {
    CardElement: () => {
      return <div>CardElement</div>;
    },

    Elements: ({ children }) => {
      return <div>{children}</div>;
    },

    useStripe: jest.fn(() => ({
      createPaymentMethod: async () => true,
    })),

    useElements: () => ({ getElement: () => 'element' }),
  };
});

afterAll(cleanup);

const closeModalMock = jest.fn();

beforeEach(() => {
  jest.useFakeTimers();
  closeModalMock.mockClear();
});

function renderCheckout(cartTotal = 7.0) {
  return renderWithProviders(
    <Elements>
      <Checkout total={cartTotal} orders={initialCart} closeCheckoutModal={closeModalMock} />
    </Elements>,
    {
      contextValue: menuContext,
    }
  );
}

const store = {
  currentAccessToken: testAccessToken,
  storedCart: initialCart,
};

window.localStorage.getItem = jest.fn(key => JSON.stringify(store[key]));

test('should check if user can checkout properly', async () => {
  fetch.once(JSON.stringify(formatFetchResponse({ status: 200 })), { status: 200 });

  const cartTotal = Object.entries(initialCart).reduce(
    (total, [_, { quantity, initialPrice: basePrice }]) => (total += quantity * basePrice),
    0
  );

  const utils = renderCheckout(cartTotal);

  const { getByTestId, getByText, findByTestId, findByRole } = utils;
  const checkoutModal = await findByTestId('checkout-modal');
  expect(checkoutModal).toBeInTheDocument();

  const totalElement = getByTestId('checkout-total');
  expect(totalElement).toHaveTextContent(`$${cartTotal}`);

  expect(getByText('CardElement')).toBeInTheDocument();

  const payButton = getByText(/pay/i);
  expect(payButton).not.toBeDisabled();

  await act(async () => {
    fireEvent.click(payButton);
  });

  expect(await findByTestId('loader')).toBeInTheDocument();

  const toast = await findByRole('alert');
  expect(toast).toHaveTextContent(/Thank you/i);

  expect(window.localStorage.removeItem).toBeCalledTimes(2);
  expect(closeModalMock).toBeCalled();
});

test('should check if user sees a notification on invalid card credentials', async () => {
  useStripe.mockImplementationOnce(() => ({
    createPaymentMethod: async () => ({ error: 'error' }),
  }));

  const utils = renderCheckout();

  const { getByText, findByTestId, findByRole } = utils;

  const payButton = getByText(/pay/i);

  await act(async () => {
    fireEvent.click(payButton);
  });

  expect(await findByTestId('loader')).toBeInTheDocument();

  const toast = await findByRole('alert');
  expect(toast).toHaveTextContent(/card details/i);
  expect(closeModalMock).not.toBeCalled();
});

test('should check if user is notified upon a transaction error', async () => {
  fetch.mockRejectOnce({ text: async () => 'Payment could not be completed', status: 500 });

  const utils = renderCheckout();

  const { getByText, findByTestId, findByRole } = utils;

  const payButton = getByText(/pay/i);

  await act(async () => {
    fireEvent.click(payButton);
  });

  expect(await findByTestId('loader')).toBeInTheDocument();

  const toast = await findByRole('alert');
  expect(toast).toHaveTextContent(/error/i);
  expect(closeModalMock).not.toBeCalled();
});
