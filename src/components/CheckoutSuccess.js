import React from 'react';
import styled from 'styled-components';

import { m as motion } from 'framer-motion';
import { BadgeCheck } from '@styled-icons/boxicons-regular/BadgeCheck';
import { successCheckoutSvgVariants } from './utils/framer-variants';
import {
  CheckoutStateContainer,
  SimpleAnimationContainer,
} from './general-components/CheckoutReusables';

const SuccessAnimationContainer = styled(motion.div).attrs({
  variants: successCheckoutSvgVariants,
})`
  display: flex;
  justify-content: center;

  & > svg {
    transform-origin: right;
    color: var(--success);
  }
`;

const TextAnimationContainer = styled(SimpleAnimationContainer)`
  text-align: center;

  h1 {
    font-family: var(--primaryFont);
    font-weight: var(--bold);
    font-size: min(2e.4m, 6vmin);
  }

  p {
    width: 80%;
    margin: auto;
    font-weight: var(--light);
    font-size: min(2.8vw, 1em);
  }
`;

export default function CheckoutSuccessComponent() {
  return (
    <CheckoutStateContainer data-testid="checkout-success">
      <SuccessAnimationContainer layout>
        <BadgeCheck className="checkout-status-svg" title="Order placed" />
      </SuccessAnimationContainer>

      <TextAnimationContainer layout>
        <motion.h1 layout>Your order is confirmed</motion.h1>
        <motion.p layout>
          Thank you for grubbing with us 😌! Your order will be with you in 30 - 50 minutes time.
          Till next time 👋
        </motion.p>
      </TextAnimationContainer>
    </CheckoutStateContainer>
  );
}
