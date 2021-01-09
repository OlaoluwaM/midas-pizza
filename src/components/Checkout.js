import React from 'react';
import styled from 'styled-components';
import Loading from './Loading';
import PropTypes from 'prop-types';
import CustomError from './utils/custom-error';
import CheckoutErrorComponent from './CheckoutError';
import CheckoutNeutralComponent from './CheckoutNeutral';
import CheckoutSuccessComponent from './CheckoutSuccess';

import { toast } from 'react-toastify';
import { useRecoilState } from 'recoil';
import { UserSessionContext } from './context/context';
import { cartState as cartStateAtom } from './atoms';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { m as motion, AnimatePresence } from 'framer-motion';
import {
  generateUrl,
  fetchWrapper,
  convertToCurrency,
  saveOrderToServer,
  generateFetchOptions,
  formatCurrencyForStripe,
  removeCartFromLocalStorage,
} from './utils/helpers';

const CheckoutFormModalWrapper = styled(motion.div).attrs({
  variants: {
    popOut: { opacity: 1, transition: { when: 'beforeChildren' } },
    close: { opacity: 0, transition: { when: 'afterChildren' } },
    exit: { opacity: 0, transition: { when: 'afterChildren' } },
  },
  'data-testid': 'checkout-modal',
})`
  width: 100%;
  height: 14em;
  display: flex;
  position: relative;
  flex-direction: column;

  & > div:not(.loader) {
    all: inherit;
  }

  .loader {
    position: relative;
  }

  & > div > .total {
    font-size: min(4vmin, 1.3rem);
    margin: 0;
    text-align: right;

    span {
      font-size: inherit;
    }
  }
`;

function initialPaymentState() {
  return {
    paymentSuccess: false,
    paymentFailed: false,
    paymentError: null,
    paymentIsProcessing: false,
    clientSecret: null,
  };
}

function paymentStatusReducer(state, action) {
  switch (action.type) {
    case 'paymentSuccess':
      return {
        ...state,
        paymentIsProcessing: false,
        paymentSuccess: true,
      };

    case 'paymentProcessing':
      return {
        ...state,
        paymentSuccess: false,
        paymentFailed: false,
        paymentError: null,
        paymentIsProcessing: true,
      };

    case 'storeClientSecret':
      return {
        ...state,
        paymentIsProcessing: false,
        clientSecret: action.clientSecret,
      };

    case 'paymentFailed':
      return {
        ...state,
        paymentFailed: true,
        paymentIsProcessing: false,
        paymentError: action.paymentErrorMessage,
      };

    case 'reset':
      return {
        ...initialPaymentState(),
        clientSecret: state.clientSecret ?? null,
      };

    default:
      throw new ReferenceError('Action is not Defined');
  }
}

async function generateClientSecretForCheckout(total, { email }) {
  const { Id: accessTokenId } = JSON.parse(localStorage.getItem('currentAccessToken'));
  const clientTotal = formatCurrencyForStripe(total);

  let currentClientSecret, newCartTotal;

  try {
    const { clientSecret, currentAmount: currentAmountFromServer } = await fetchWrapper(
      generateUrl(`checkout?email=${email}`),
      generateFetchOptions('GET', null, accessTokenId)
    );

    const serverTotal = formatCurrencyForStripe(currentAmountFromServer);

    if (clientTotal !== serverTotal) {
      const { clientSecret: updatedClientSecret, updatedCartTotal } = await fetchWrapper(
        generateUrl(`checkout?email=${email}`),
        generateFetchOptions(
          'PUT',
          { updatedPaymentIntentData: { amount: clientTotal } },
          accessTokenId
        )
      );

      currentClientSecret = updatedClientSecret;
      newCartTotal = updatedCartTotal;
    } else currentClientSecret = clientSecret;
  } catch (e) {
    try {
      const { clientSecret } = await fetchWrapper(
        generateUrl(`checkout?email=${email}`),
        generateFetchOptions('POST', null, accessTokenId)
      );

      currentClientSecret = clientSecret;
    } catch (error) {
      toast(error.message, { type: 'error ' });
      console.error(error);
    }

    console.error(e);
  }

  return { clientSecret: currentClientSecret, cartTotal: newCartTotal };
}

async function handleStripePaymentResults(result, { email }) {
  if (result.error) throw new CustomError(result.error.message, result.error.type);

  if (result.paymentIntent.status === 'succeeded') {
    const { Id: accessTokenId } = JSON.parse(localStorage.getItem('currentAccessToken'));

    await fetchWrapper(
      generateUrl(`checkout/sendInvoice?email=${email}`),
      generateFetchOptions('POST', null, accessTokenId)
    );
  }
}

export default function Checkout({ total = 0 }) {
  const [stripePaymentStatus, dispatch] = React.useReducer(paymentStatusReducer, {
    paymentSuccess: false,
    paymentFailed: false,
    paymentError: null,
    paymentIsProcessing: true,
    clientSecret: null,
  });

  const totalRef = React.useRef(total);
  const [cardError, setCardError] = React.useState(false);
  const [cart, updateCart] = useRecoilState(cartStateAtom);

  const stripe = useStripe();
  const elements = useElements();

  const { userData } = React.useContext(UserSessionContext);
  const { clientSecret, paymentIsProcessing } = stripePaymentStatus;
  const { paymentError, paymentFailed, paymentSuccess } = stripePaymentStatus;

  React.useEffect(() => {
    (async () => {
      const { email: userEmail } = userData;
      const { Id: accessTokenId } = JSON.parse(localStorage.getItem('currentAccessToken'));

      const prevStoredCart = localStorage.getItem('prevStoredCart') || '{}';
      const currentCartToStore = localStorage.getItem('storedCart') || '{}';

      console.log('Checking cart changes...');

      if (prevStoredCart !== currentCartToStore) {
        await saveOrderToServer(userEmail, cart, accessTokenId, true);
        console.log('Updated cart in server');
      } else console.log('No changes made to cart');

      const { clientSecret, cartTotal } = await generateClientSecretForCheckout(total, userData);
      if (cartTotal) totalRef.current = convertToCurrency(formatCurrencyForStripe(cartTotal));

      dispatch({ type: 'storeClientSecret', clientSecret: clientSecret });
    })();

    return () => dispatch({ type: 'reset' });
  }, []);

  const handleCardElementChange = async e => {
    setCardError(e.empty);

    e?.error && dispatch({ type: 'paymentFailed', paymentErrorMessage: e.error.message });
  };

  const makePayment = async e => {
    e.preventDefault();

    if (!stripe || !elements) return;

    try {
      dispatch({ type: 'paymentProcessing' });

      const { email, streetAddress } = userData;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            email,
            address: streetAddress,
          },
        },
      });

      await handleStripePaymentResults(result, userData);

      removeCartFromLocalStorage();

      updateCart({});

      dispatch({ type: 'paymentSuccess' });
    } catch (error) {
      dispatch({ type: 'paymentFailed', paymentErrorMessage: error.message });
      console.error(error);
    }
  };

  React.useEffect(() => {
    if (!paymentFailed) return;
    toast(paymentError, { type: 'error' });
  }, [paymentFailed]);

  const neutralState = !(paymentFailed || paymentIsProcessing || paymentSuccess);

  return (
    <CheckoutFormModalWrapper layout>
      <AnimatePresence exitBeforeEnter>
        {paymentIsProcessing && <Loading key="loader" />}

        {neutralState && (
          <CheckoutNeutralComponent
            makePayment={makePayment}
            handleCardElementChange={handleCardElementChange}
            stripe={stripe}
            cardError={cardError}
            cartTotal={totalRef.current}
            key="neutral-state"
          />
        )}

        {paymentFailed && (
          <CheckoutErrorComponent
            paymentErrorMessage={paymentError}
            retry={dispatch.bind(null, { type: 'reset' })}
            key="fail-state"
          />
        )}

        {paymentSuccess && <CheckoutSuccessComponent key="success-state" />}
      </AnimatePresence>
    </CheckoutFormModalWrapper>
  );
}

Checkout.propTypes = {
  total: PropTypes.number.isRequired,
};

Checkout.whyDidYouRender = true;
