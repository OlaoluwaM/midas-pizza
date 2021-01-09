// TODO finish test
import React from 'react';
import Modal from '../components/Modal';
import Checkout from '../components/Checkout';

import { CardElement, useStripe, Elements } from '@stripe/react-stripe-js';
import { cleanup, act, fireEvent, render, screen } from '@testing-library/react';

jest.mock('@stripe/react-stripe-js', () => ({
  __esModule: true,

  Elements: ({ children }) => <div>{children}</div>,

  CardElement: jest.fn(() => <div>CardElement</div>),

  useStripe: jest.fn(() => ({
    createPaymentMethod: async () => true,
  })),

  useElements: () => ({ getElement: () => 'element' }),
}));

afterAll(cleanup);

const closeModalMock = jest.fn();

beforeEach(() => {
  jest.useFakeTimers();
  closeModalMock.mockClear();
});

const store = {
  currentAccessToken: testAccessToken,
  storedCart: initialCart,
};

window.localStorage.getItem = jest.fn(key => JSON.stringify(store[key]));

let cartTotal = Object.entries(initialCart).reduce(
  (total, [_, { quantity, initialPrice: basePrice }]) => (total += quantity * basePrice),
  0
);

test("If user is shown cart total when user's cart does not have paymentIntent yet", async () => {
  fetch.mockRejectOnce('An error occurred', { status: 500 }).once(
    JSON.stringify(
      formatFetchResponse({
        clientSecret: 'client_secret',
        currentAmount: cartTotal,
      }),
      { status: 200 }
    )
  );

  let utils;

  await act(async () => {
    utils = renderWithProviders(
      <Modal className="checkout" closeModal={closeModalMock}>
        <Checkout total={cartTotal} orders={initialCart} closeCheckoutModal={closeModalMock} />
      </Modal>,
      {
        contextValue: menuContext,
      }
    );
  });

  const { findByTestId } = utils;

  expect(await findByTestId('checkout-form')).toBeInTheDocument();
  expect(await findByTestId('checkout-total')).toHaveTextContent(cartTotal.toFixed(2));
});

test('If checkout cart is updated with server total if there is a client-server cart total mismatch', async () => {
  fetch
    .once(
      JSON.stringify(
        formatFetchResponse({
          clientSecret: 'client_secret',
          currentAmount: cartTotal,
        }),
        { status: 200 }
      )
    )
    .once(
      JSON.stringify(
        formatFetchResponse({
          clientSecret: 'client_secret',
          updatedCartTotal: cartTotal,
        }),
        { status: 200 }
      )
    );

  let utils;

  await act(async () => {
    utils = renderWithProviders(
      <Modal className="checkout" closeModal={closeModalMock}>
        <Checkout total={1.0} orders={initialCart} closeCheckoutModal={closeModalMock} />
      </Modal>,
      {
        contextValue: menuContext,
      }
    );
  });

  const { findByTestId } = utils;
  expect(await findByTestId('checkout-total')).toHaveTextContent(cartTotal.toFixed(2));
});

describe('Payment status', () => {
  beforeEach(() => {
    fetch.once(
      JSON.stringify(
        formatFetchResponse({
          clientSecret: 'client_secret',
          currentAmount: cartTotal,
        }),
        { status: 200 }
      )
    );
    useStripe.mockReset();
  });

  test('is successful', async () => {
    fetch.once(JSON.stringify(formatFetchResponse('Invoice sent')), { status: 201 });
    let utils;

    useStripe.mockReturnValue({
      async confirmCardPayment() {
        return { paymentIntent: { status: 'succeeded' } };
      },
    });

    await act(async () => {
      utils = renderWithProviders(
        <Modal className="checkout" closeModal={closeModalMock}>
          <Checkout total={cartTotal} orders={initialCart} closeCheckoutModal={closeModalMock} />
        </Modal>,
        {
          contextValue: menuContext,
        }
      );
    });

    const { findByTestId, findByRole } = utils;
    const payButton = await findByRole('button');

    expect(payButton).not.toBeDisabled();

    await act(async () => fireEvent.click(payButton));
    expect(await findByTestId('loader')).toBeInTheDocument();

    // TODO assert checkout success component is shown
  });

  test('when stripe is not loaded', async () => {
    let utils;

    await act(async () => {
      utils = renderWithProviders(
        <Modal className="checkout" closeModal={closeModalMock}>
          <Checkout total={cartTotal} orders={initialCart} closeCheckoutModal={closeModalMock} />
        </Modal>,
        {
          contextValue: menuContext,
        }
      );
    });

    const { findByRole } = utils;
    const payButton = await findByRole('button');

    expect(payButton).toBeDisabled();
  });

  test('when payment is unsuccessful', async () => {
    const { message: mockErrorMessage, type: mockErrorType } = {
      message: 'Mock Error',
      type: 'nothing serious',
    };

    useStripe.mockReturnValue({
      async confirmCardPayment() {
        return { error: { message: mockErrorMessage, type: mockErrorType } };
      },
    });

    let utils;

    await act(async () => {
      utils = renderWithProviders(
        <Modal className="checkout" closeModal={closeModalMock}>
          <Checkout total={cartTotal} orders={initialCart} closeCheckoutModal={closeModalMock} />
        </Modal>,
        {
          contextValue: menuContext,
        }
      );
    });

    const { findByTestId, findByRole } = utils;
    const payButton = await findByRole('button');

    await act(async () => {
      fireEvent.click(payButton);
    });

    expect(await findByTestId('loader')).toBeInTheDocument();

    await act(async () => jest.advanceTimersByTime(1000));

    expect(await findByRole('alert')).toHaveTextContent(new RegExp(mockErrorMessage, 'i'));
  });
});
