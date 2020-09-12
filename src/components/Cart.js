import React from 'react';
import styled from 'styled-components';
import OrderItem from './OrderItem';

import { cartVariants } from './local-utils/framer-variants';
import { useRecoilValue } from 'recoil';
import { cartState as cartStateAtom } from './atoms';
import { m as motion, AnimateSharedLayout } from 'framer-motion';

// TODO Finish cart preview component

const CartPreviewContainer = styled(motion.section).attrs({
  className: 'section-container',
  variants: cartVariants,
  animate: 'visible',
  initial: 'hidden',
  exit: 'hidden',
})`
  display: flex;
  z-index: 1;
  padding: 0 1.5em 0 3.5em;
`;

const CartContainer = styled.div`
  list-style: none;
  flex-grow: 1;
  height: 100%;

  h3 {
    text-align: left;
    font-size: 2em;
    margin: 3em 0 1em 0;
    font-family: var(--primaryFont);
    font-weight: var(--xBold);
  }
`;

const Cart = styled(motion.ul)`
  padding: 0;
  margin: 0;
  width: 100%;
  height: auto;
  list-style: none;
`;

export default function CartPreview() {
  const cartObject = useRecoilValue(cartStateAtom);
  const cart = Object.entries(cartObject);
  console.count('rendered');

  return (
    <CartPreviewContainer>
      <CartContainer>
        <motion.h3>Your Cart</motion.h3>
        <Cart layout>
          {cart.map(([orderName, { quantity, initialPrice, foodType }]) => (
            <OrderItem
              key={orderName}
              orderName={orderName}
              quantity={quantity}
              foodType={foodType}
              initialPrice={initialPrice}
            />
          ))}
        </Cart>
        {/* <AnimateSharedLayout>
        </AnimateSharedLayout> */}
      </CartContainer>
      {/* <CheckoutPoint></CheckoutPoint> */}
    </CartPreviewContainer>
  );
}

CartPreview.whyDidYouRender = true;
