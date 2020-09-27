import React from 'react';
import styled from 'styled-components';
import hexToRgb from './utils/hexToRgb';
import PropTypes from 'prop-types';

import { CloseCircle } from '@styled-icons/evaicons-solid/CloseCircle';
import { m as motion, AnimateSharedLayout } from 'framer-motion';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { modalBackgroundVariants, modalVariants } from './local-utils/framer-variants';

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
  padding: 2em;
  position: relative;
  box-shadow: -12px 12px 2px rgba(0, 0, 0, 0.3);
  z-index: 333;

  svg.close-circle {
    position: absolute;
    top: -15px;
    cursor: pointer;
    right: -15px;
    fill: ${({ theme }) => theme.accentColor};
    width: 3em;
    transition: transform 0.3s ease;

    &:active {
      transform: scale(0.9);
    }
  }
`;

const CheckoutFormModalWrapper = styled(motion.div).attrs({
  variants: {
    popOut: { opacity: 1 },
    close: { opacity: 0 },
    exit: { opacity: 0 },
  },
})`
  width: 100%;
  height: 14em;
  display: flex;
  flex-direction: column;

  .total {
    font-size: 1.3em;
    margin: 0 0 0.5em 0;
    text-align: right;

    span {
      font-size: 1.3rem;
      color: ${({ theme }) => theme.accentColor};
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
    width: 25%;
    padding: 0.5em 1.5em;
    margin: 0;
    background: ${({ theme }) => theme.accentColor};
    border-color: ${({ theme }) => theme.accentColor};
    color: ${({ theme }) => theme.background};
    filter: brightness(0.7);
    transition: background 0.3s ease, color 0.3s ease, scale 0.4s ease, filter 0.3s ease;

    &:disabled {
      filter: brightness(0.7);
    }

    &:hover,
    &:active {
      filter: brightness(1);
    }
  }

  .StripeElement {
    display: block;
    border-bottom: 5px solid ${({ theme }) => theme.accentColor};
    font-family: var(--primaryFont);
    padding: 1em;
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

export default function Checkout({ total = '0' }) {
  const stripe = useStripe();
  const elements = useElements();

  const makePayment = async e => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const payload = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    // TODO send requests to server to complete transaction
    console.log(payload);
  };

  return (
    <>
      <CheckoutFormModalWrapper layout>
        <CheckoutForm onSubmit={makePayment} layout>
          <CardElement />
          <motion.button className="checkout-button" type="submit" layout disabled={!stripe}>
            Pay
          </motion.button>
        </CheckoutForm>
        <motion.h2 className="total" layout>
          Total: <span>${total}</span>
        </motion.h2>
      </CheckoutFormModalWrapper>
    </>
  );
}

Checkout.propTypes = {
  total: PropTypes.string.isRequired,
};

Modal.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

Checkout.whyDidYouRender = true;
Modal.whyDidYouRender = true;
