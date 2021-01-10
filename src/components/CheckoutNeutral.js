import React from 'react';
import images from 'react-payment-inputs/images';
import hexToRgb from './utils/hexToRgb';
import PropTypes from 'prop-types';

import { BaseButton } from './general-components/general';
import { m as motion } from 'framer-motion';
import { CheckoutStateContainer } from './general-components/CheckoutReusables';
import { simpleAnimationCheckoutVariants } from './utils/framer-variants';
import { default as styled, css, keyframes } from 'styled-components';
import { PaymentInputsWrapper, usePaymentInputs } from 'react-payment-inputs';

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

  .card-input-form-wrapper {
    margin-top: 20px;
  }
`;

const PayButton = styled(BaseButton)`
  align-self: flex-start;
  width: 10em;
  margin: 7% 0 5% 0;
  background: ${({ theme }) => hexToRgb(theme.black, 0.8)};
  color: ${({ theme }) => theme.backgroundLighter};

  &.submit-button:disabled {
    background: ${({ theme }) => hexToRgb(theme.black, 0.2)};
    color: ${({ theme }) => hexToRgb(theme.gray, 0.7)};
  }
`;
const invalidCardShakeAnimation = keyframes`
    10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
`;

const customStyles = {
  fieldWrapper: {
    base: css`
      width: 100%;
      border: none;
      box-shadow: none;
      transition: 0.3s ease;
      transform: translate3d(0, 0, 0);
      perspective: 1000px;
    `,
    errored: css`
      animation: ${invalidCardShakeAnimation} 0.82s 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    `,
  },

  inputWrapper: {
    base: css`
      border: none;
      box-shadow: none;
      border-radius: 0;
      border-bottom: 2px solid ${({ theme }) => hexToRgb(theme.gray, 0.3)};
      transition: 0.3s ease;
    `,
    focused: css`
      box-shadow: none;
      border-color: ${({ theme }) => theme.gray};
    `,
    errored: css`
      box-shadow: none;
      border-color: ${({ theme }) => hexToRgb(theme.error, 0.8)};
    `,
  },

  input: {
    base: css`
      font-size: min(3vmin, 1em);
    `,
    expiryDate: css`
      margin-left: auto;
      width: 3.7em;
    `,
  },
};

const CARD_INPUT_ERROR_MESSAGES = {
  emptyCardNumber: 'Please provide your card number',
  invalidCardNumber: 'Sorry, the card number you entered was invalid',
  emptyExpiryDate: "Please provide your card's expiration date",
  monthOutOfRange: 'Sorry, the month entered is out of range. Please use numbers between 01 and 12',
  yearOutOfRange: 'Sorry, the year you entered is out of range',
  dateOutOfRange: 'Sorry the date specified for your card is out of range',
  invalidExpiryDate: "Sorry, your card's expiration date is invalid",
  emptyCVC: 'Please provide th CVC for your card',
  invalidCVC: 'Sorry, the CVC you provided was invalid',
};

function CheckoutInputForm({ pay, handlePaymentError }) {
  const {
    wrapperProps,
    getCardImageProps,
    getCardNumberProps,
    getExpiryDateProps,
    getCVCProps,
    meta,
  } = usePaymentInputs({ errorMessages: CARD_INPUT_ERROR_MESSAGES });

  const paymentHandler = async e => {
    e.preventDefault();

    if (meta.error) {
      handlePaymentError(meta.error);
    } else await pay();
  };

  return (
    <CheckoutForm data-testid="checkout-form" onSubmit={paymentHandler}>
      <motion.div className="card-input-form-wrapper" layout="position">
        <PaymentInputsWrapper {...wrapperProps} styles={customStyles}>
          <motion.svg {...getCardImageProps({ images })} layout />
          <motion.input {...getCardNumberProps()} layout data-testid="input-card-number" />
          <motion.input {...getExpiryDateProps()} layout data-testid="input-expiry-date" />
          <motion.input {...getCVCProps()} layout data-testid="input-cvc" />
        </PaymentInputsWrapper>
      </motion.div>

      <PayButton className="submit-button button-black" type="submit" layout="position">
        Pay
      </PayButton>
    </CheckoutForm>
  );
}

export default function CheckoutNeutralComponent({ makePayment, cartTotal, setPaymentError }) {
  return (
    <CheckoutStateContainer>
      <CheckoutInputForm pay={makePayment} handlePaymentError={setPaymentError} />

      <motion.h2 className="total" variants={simpleAnimationCheckoutVariants} layout>
        Total: <span data-testid="checkout-total">${cartTotal.toFixed(2)}</span>
      </motion.h2>
    </CheckoutStateContainer>
  );
}

CheckoutNeutralComponent.propTypes = {
  makePayment: PropTypes.func.isRequired,
  cartTotal: PropTypes.number.isRequired,
  setPaymentError: PropTypes.func.isRequired,
};

CheckoutInputForm.propTypes = {
  pay: PropTypes.func.isRequired,
  handlePaymentError: PropTypes.func.isRequired,
};
