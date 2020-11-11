import React from 'react';
import styled from 'styled-components';
import Loading from './Loading';
import hexToRgb from './utils/hexToRgb';
import PropTypes from 'prop-types';
import CustomError from './utils/custom-error';

import { toast } from 'react-toastify';
import { CloseCircle } from '@styled-icons/evaicons-solid/CloseCircle';
import { useSetRecoilState } from 'recoil';
import { UserSessionContext } from './context/context';
import { cartState as cartStateAtom } from './atoms';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { modalBackgroundVariants, modalVariants } from './utils/framer-variants';
import { m as motion, AnimateSharedLayout, AnimatePresence } from 'framer-motion';
import {
  generateFetchOptions,
  generateUrl,
  fetchWrapper,
  removeCartFromLocalStorage,
} from './utils/helpers';

const ModalBackground = styled(motion.div).attrs({
  variants: modalBackgroundVariants,
  initial: 'close',
  animate: 'popOut',
  exit: 'exit',
})`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 111;
`;

const ModalContainer = styled(motion.div).attrs({
  variants: modalVariants,
})`
  width: 50%;
  background: ${({ theme }) => theme.background};
  border-radius: 10px;
  padding: clamp(1em, 3vmin, 2em);
  position: relative;
  box-shadow: -12px 12px 0px ${({ theme }) => hexToRgb(theme.black, 0.5)};
  z-index: 333;

  svg.close-circle {
    position: absolute;
    top: -15px;
    cursor: pointer;
    right: -15px;
    fill: var(--error);
    max-width: 3em;
    transition: transform 0.3s ease;

    &:active {
      transform: scale(0.9);
    }
  }

  @media (max-width: 780px) {
    width: 75%;
  }

  @media (max-width: 520px) {
    width: 95%;
  }
`;

const CheckoutFormModalWrapper = styled(motion.div).attrs({
  variants: {
    popOut: { opacity: 1 },
    close: { opacity: 0 },
    exit: { opacity: 0 },
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
    height: 100%;
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

const CheckoutForm = styled(motion.form)`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-around;

  button {
    align-self: flex-start;
    width: 10em;
    margin: 0;
  }

  .StripeElement {
    display: block;
    border-bottom: 5px solid ${({ theme }) => theme.black};
    font-family: var(--primaryFont);
    padding: 0.5em;
    flex-basis: 25%;
    font-weight: var(--bold);
    font-size: 1.3em;
    transition: all 150ms ease;
  }
`;

export function Modal({ children, closeModal }) {
  return (
    <ModalBackground>
      <ModalContainer>
        <CloseCircle className="close-circle" onClick={closeModal} />
        <AnimateSharedLayout>{children}</AnimateSharedLayout>
      </ModalContainer>
    </ModalBackground>
  );
}

export default function Checkout({ total = 0, orders, closeCheckoutModal }) {
  const stripe = useStripe();
  const elements = useElements();
  const {
    userData: { email, name },
  } = React.useContext(UserSessionContext);

  const updateCart = useSetRecoilState(cartStateAtom);
  const [processingPayment, setProcessingPayment] = React.useState(false);

  const makePayment = async e => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const { Id: tokenId } = JSON.parse(localStorage.getItem('currentAccessToken'));

    try {
      setProcessingPayment(true);

      const payload = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (payload?.error) {
        throw new CustomError(
          `There seems to be an error with your card input ${JSON.stringify(payload.error)}`,
          'StripePaymentError'
        );
      }

      await fetchWrapper(
        generateUrl(`checkout?email=${email}`),
        generateFetchOptions('POST', JSON.stringify({ orders }), tokenId)
      );

      toast(
        `Thank you for your shopping with us ${name}. Hope to see you soon 👌👋. P.S, your order will arrive in 30 - 40 minutes ⌛`,
        {
          type: 'success',
          autoClose: false,
        }
      );

      removeCartFromLocalStorage();
      updateCart({});
      closeCheckoutModal();
    } catch (error) {
      if (error?.type === 'StripePaymentError') {
        toast('Please check your card details and try again 😅', { type: 'error' });
      } else {
        toast('An error occurred during checkout, please try again later', { type: 'error' });
      }
      console.error(error);
    } finally {
      setProcessingPayment(false);
    }
  };

  return (
    <CheckoutFormModalWrapper layout>
      <AnimatePresence>
        {processingPayment ? (
          <Loading layoutId="checkout" key="loader" />
        ) : (
          <motion.div
            initial={false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            layout
            key="checkout-form">
            <CheckoutForm onSubmit={makePayment}>
              <CardElement />

              <motion.button
                className="submit-button button-black"
                type="submit"
                layout
                disabled={!stripe}>
                Pay
              </motion.button>
            </CheckoutForm>

            <motion.h2 className="total" layout>
              Total: <span data-testid="checkout-total">${total}</span>
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>
    </CheckoutFormModalWrapper>
  );
}

Checkout.propTypes = {
  total: PropTypes.number.isRequired,
  orders: PropTypes.object.isRequired,
  closeCheckoutModal: PropTypes.func.isRequired,
};

Modal.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

Checkout.whyDidYouRender = true;
Modal.whyDidYouRender = true;
