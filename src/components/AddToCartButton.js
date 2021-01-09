import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { BaseButton } from './general-components/general';
import { ShoppingBag } from '@styled-icons/material-rounded/ShoppingBag';
import { CartPlusFill as CartIcon } from '@styled-icons/bootstrap/CartPlusFill';
import { m as motion, useAnimation } from 'framer-motion';

const AddToCartButtonBase = styled(BaseButton).attrs({
  className: 'add-to-cart-button button-black',
  'data-testid': 'add-to-cart-button',
})`
  position: relative;
  flex-basis: 40%;
  display: flex;
  flex-grow: 0.8;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 7px;
  padding: 1.3em 0;
  overflow: hidden;
  align-self: flex-end;
  cursor: pointer;
  font-weight: var(--bold);
  font-family: var(--primaryFont);
  transition: 0.1s ease box-shadow, 0.2s ease background, color 0.3s ease;

  & > div {
    margin-right: 15px;
  }

  & > div > svg {
    width: 22px;
  }

  span {
    font-size: min(3.4vmin, 1.2em);
    transition: opacity 0.3s ease;
  }
`;

export default function AddToCartButton({ addToCart }) {
  const [startAnimation, setAnimationStart] = React.useState(false);
  const timeoutRef = React.useRef([]);
  const svgControls = useAnimation();
  const textControls = useAnimation();

  const buttonSvgAnimations = async () => {
    await textControls.set({
      x: -30,
      opacity: 0,
    });

    await svgControls.set({
      y: 30,
      opacity: 0,
    });

    await textControls.start({
      x: 0,
      opacity: 1,
    });

    await svgControls.start({
      y: 0,
      opacity: 1,
    });

    const timeoutToFalse = setTimeout(() => {
      setAnimationStart(false);
    }, 1500);

    timeoutRef.current.push(timeoutToFalse);
  };

  const handleAddToCart = () => {
    addToCart() && setAnimationStart(true);
  };

  React.useEffect(() => {
    if (!startAnimation) return;

    (async () => buttonSvgAnimations())();

    return () => {
      const { current: timeoutIds } = timeoutRef;
      timeoutIds.forEach(id => clearTimeout(id));
    };
  }, [startAnimation]);

  return (
    <AddToCartButtonBase onClick={handleAddToCart}>
      <motion.div layout animate={svgControls} key={startAnimation + '111'}>
        {startAnimation ? <ShoppingBag /> : <CartIcon />}
      </motion.div>

      <motion.span layout animate={textControls} key={startAnimation + '222'}>
        {!startAnimation ? 'Add to cart' : 'Added'}
      </motion.span>
    </AddToCartButtonBase>
  );
}

AddToCartButton.propTypes = {
  addToCart: PropTypes.func.isRequired,
};
