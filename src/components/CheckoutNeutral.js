import React from 'react';
import styled from 'styled-components';
import hexToRgb from './utils/hexToRgb';
import PropTypes from 'prop-types';

import { BaseButton } from './general-components/general';
import { CardElement } from '@stripe/react-stripe-js';
import { m as motion } from 'framer-motion';
import { CheckoutStateContainer } from './general-components/CheckoutReusables';
import { simpleAnimationCheckoutVariants } from './utils/framer-variants';

const CheckoutForm = styled(motion.form).attrs({
  variants: {
    close: { opacity: 0, transition: { when: 'afterChildren' } },
    popOut: { opacity: 1, transition: { when: 'beforeChildren' } },
    exit: { opacity: 0, transition: { when: 'afterChildren' } },
  },
  layout: true,
})`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-around;

  .StripeElement {
    display: block;
    border-bottom: 5px solid ${({ theme }) => theme.black};
    font-family: var(--primaryFont);
    padding: 0.5em;
    flex-basis: 25%;
    font-weight: var(--bold);
    font-size: 1.3em;
    margin-top: 5%;
    transition: all 150ms ease;
  }
`;

const cardElementOptions = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

const PayButton = styled(BaseButton)`
  align-self: flex-start;
  width: 10em;
  margin: 10% 0 5% 0;
  background: ${({ theme }) => hexToRgb(theme.black, 0.8)};
  color: ${({ theme }) => theme.backgroundLighter};

  &.submit-button:disabled {
    background: ${({ theme }) => hexToRgb(theme.black, 0.2)};
    color: ${({ theme }) => hexToRgb(theme.gray, 0.7)};
  }
`;

export default function CheckoutNeutralComponent({
  makePayment,
  handleCardElementChange,
  stripe,
  cardError,
  cartTotal,
}) {
  return (
    <CheckoutStateContainer>
      <CheckoutForm data-testid="checkout-form" onSubmit={makePayment}>
        <motion.div layout="position">
          <CardElement options={cardElementOptions} onChange={handleCardElementChange} />
        </motion.div>

        <PayButton
          className="submit-button button-black"
          type="submit"
          layout="position"
          disabled={!stripe || cardError}>
          Pay
        </PayButton>
      </CheckoutForm>

      <motion.h2 className="total" variants={simpleAnimationCheckoutVariants} layout>
        Total: <span data-testid="checkout-total">${cartTotal}</span>
      </motion.h2>
    </CheckoutStateContainer>
  );
}

CheckoutNeutralComponent.propTypes = {
  makePayment: PropTypes.func.isRequired,
  handleCardElementChange: PropTypes.func.isRequired,
  stripe: PropTypes.object,
  cardError: PropTypes.bool.isRequired,
  cartTotal: PropTypes.number.isRequired,
};
