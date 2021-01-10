import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { m as motion } from 'framer-motion';
import { BaseButton } from './general-components/general';
import { ErrorCircle } from '@styled-icons/boxicons-regular/ErrorCircle';
import { errorCheckoutSvgVariants } from './utils/framer-variants';
import {
  CheckoutStateContainer,
  SimpleAnimationContainer,
} from './general-components/CheckoutReusables';

const ErrorSvgAnimationContainer = styled(motion.div).attrs({
  variants: errorCheckoutSvgVariants,
})`
  display: flex;
  justify-content: center;

  & > svg {
    color: var(--error);
  }
`;

const ErrorTextAnimationContainer = styled(SimpleAnimationContainer)`
  display: flex;
  flex-direction: column;
  align-items: center;

  & > p {
    font-weight: var(--regular);
    margin: 5% 0;
    width: calc(0.85 * 100%);
    font-size: min(2.7vmin, 1em);
    text-align: center;
    color: rgba(0, 0, 0, 1);
  }
`;

const RetryButton = styled(BaseButton)``;

export default function CheckoutErrorComponent({ paymentErrorMessage, retry }) {
  return (
    <CheckoutStateContainer data-testid="checkout-error">
      <ErrorSvgAnimationContainer layout>
        <ErrorCircle className="checkout-status-svg" title="Error" />
      </ErrorSvgAnimationContainer>

      <ErrorTextAnimationContainer layout>
        <motion.p layout>{paymentErrorMessage}</motion.p>
        <RetryButton onClick={retry} className="submit-button button-error">
          Retry
        </RetryButton>
      </ErrorTextAnimationContainer>
    </CheckoutStateContainer>
  );
}

CheckoutErrorComponent.propTypes = {
  paymentErrorMessage: PropTypes.string,
  retry: PropTypes.func.isRequired,
};
