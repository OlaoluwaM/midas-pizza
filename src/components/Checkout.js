import React from 'react';
import styled from 'styled-components';
import Loading from './Loading';
import PropTypes from 'prop-types';
import CheckoutErrorComponent from './CheckoutError';
import CheckoutNeutralComponent from './CheckoutNeutral';
import CheckoutSuccessComponent from './CheckoutSuccess';

import { toast } from 'react-toastify';
import { useRecoilState } from 'recoil';
import { UserSessionContext } from './context/context';
import { cartState as cartStateAtom } from './atoms';
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
  const initialState = initialPaymentState();

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

    case 'finishedProcessing':
      return {
        ...state,
        paymentIsProcessing: false,
      };

    case 'paymentFailed':
      return {
        ...state,
        paymentFailed: true,
        paymentIsProcessing: false,
        paymentError: action.paymentErrorMessage,
      };

    case 'reset':
      return initialState;

    default:
      throw new ReferenceError('Action is not Defined');
  }
}
export default function Checkout({ total = 0 }) {
  const [stripePaymentStatus, dispatch] = React.useReducer(paymentStatusReducer, {
    paymentSuccess: false,
    paymentFailed: false,
    paymentError: null,
    paymentIsProcessing: true,
  });

  const totalRef = React.useRef(total);
  const timeoutRef = React.useRef([]);

  const [cart, updateCart] = useRecoilState(cartStateAtom);

  const { userData } = React.useContext(UserSessionContext);
  const { paymentFailed, paymentSuccess } = stripePaymentStatus;
  const { paymentError, paymentIsProcessing } = stripePaymentStatus;

  const { email: userEmail } = userData;
  const { Id: accessTokenId } = JSON.parse(localStorage.getItem('currentAccessToken'));

  React.useEffect(() => {
    (async () => {
      const prevStoredCart = localStorage.getItem('prevStoredCart') || '{}';
      const currentCartToStore = localStorage.getItem('storedCart') || '{}';

      console.log('Checking cart changes...');

      try {
        if (prevStoredCart !== currentCartToStore) {
          await saveOrderToServer(userEmail, cart, accessTokenId, true);

          console.log('Updated cart in server');
        } else console.log('No changes made to cart');

        const { totalPrice: cartTotal } = await fetchWrapper(
          generateUrl(`order?email=${userEmail}`),
          generateFetchOptions('GET', null, accessTokenId)
        );

        if (cartTotal) totalRef.current = convertToCurrency(formatCurrencyForStripe(cartTotal));
        dispatch({ type: 'finishedProcessing' });
      } catch (error) {
        const { message } = error;

        dispatch({ type: 'paymentFailed', paymentError: message });
      }
    })();

    return () => {
      const { current: timeoutIds } = timeoutRef;
      timeoutIds.forEach(id => clearTimeout(id));

      dispatch({ type: 'reset' });
    };
  }, []);

  const makePayment = async () => {
    try {
      dispatch({ type: 'paymentProcessing' });

      toast('Note: This is not real so your card will not be charged 👌', { type: 'info' });

      await fetchWrapper(
        generateUrl(`checkout/sendInvoice?email=${userEmail}`),
        generateFetchOptions('POST', null, accessTokenId)
      );

      const timeout = setTimeout(() => {
        dispatch({ type: 'paymentSuccess' });
        removeCartFromLocalStorage();
        updateCart({});
      }, 5500);

      timeoutRef.current.push(timeout);
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
            setPaymentError={errMessage => {
              dispatch({ type: 'paymentFailed', paymentErrorMessage: errMessage });
            }}
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
