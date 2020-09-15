import React from 'react';
import styled from 'styled-components';
import OrderItem from './OrderItem';

import { getTotal } from './local-utils/helpers';
import { useRecoilValue } from 'recoil';
import { cartPreviewVariants } from './local-utils/framer-variants';
import { cartState as cartStateAtom } from './atoms';
import { ReactComponent as EmptyCartSVG } from '../assets/undraw_empty_xct9.svg';
import { m as motion, AnimateSharedLayout, AnimatePresence } from 'framer-motion';

// TODO Finish cart preview component

const CartPreviewContainer = styled(motion.section).attrs({
  className: 'section-container',
  variants: cartPreviewVariants,
  animate: 'visible',
  initial: 'hidden',
  exit: 'exit',
})`
  display: flex;
  z-index: 1;
  padding: 0 1.5em 0 3.5em;
  position: relative;

  & > svg {
    position: absolute;
    scale: 0.6;
    left: 50%;
    transform: translateX(-78%);
  }
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

  p.total {
    width: 90%;
    text-align: right;
    margin-top: 3em;
    font-size: 1em;
    font-weight: var(--bold);
    color: ${({ theme }) => theme.gray};

    span {
      margin-left: 0.6em;
      color: ${({ theme }) => theme.black};
      font-size: 1.3em;
    }
  }
`;

const Cart = styled(motion.ul)`
  padding: 0;
  margin: 0;
  width: 100%;
  height: auto;
  list-style: none;
`;

export default function CartPreview({ initialCart }) {
  const cartObject = initialCart ?? useRecoilValue(cartStateAtom);
  const cart = Object.entries(cartObject);
  const cartIsEmpty = cart.length === 0;

  return (
    <CartPreviewContainer>
      {cartIsEmpty && <EmptyCartSVG />}
      <CartContainer>
        <motion.h3>{`Your Cart ${cartIsEmpty ? 'is empty' : ''}`}</motion.h3>
        <AnimateSharedLayout>
          {!cartIsEmpty && (
            <>
              <Cart layout layoutId="foo">
                <AnimatePresence>
                  {cart.map(([orderName, { quantity, initialPrice, type }], i) => (
                    <OrderItem
                      key={orderName}
                      orderName={orderName}
                      quantity={quantity}
                      foodType={type}
                      initialPrice={initialPrice}
                    />
                  ))}
                </AnimatePresence>
              </Cart>
              <motion.p className="total" layout>
                Total: <span data-testid="cart-total">{`$${getTotal(cartObject).toFixed(2)}`}</span>
              </motion.p>
            </>
          )}
        </AnimateSharedLayout>
      </CartContainer>
      {/* <CheckoutPoint></CheckoutPoint> */}
    </CartPreviewContainer>
  );
}

CartPreview.whyDidYouRender = true;
