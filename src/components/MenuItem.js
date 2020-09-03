import React from 'react';
import styled from 'styled-components';
import hexToRgb from './utils/hexToRgb';
import PropTypes from 'prop-types';
import pizzaImage from '../assets/ivan-torres-MQUqbmszGGM-unsplash.jpg';

import { menuItemVariants } from './local-utils/framer-variants';
import { ArrowLeftSquareFill } from '@styled-icons/bootstrap/ArrowLeftSquareFill';
import { cartState as cartStateAtom } from './atoms';
import { cartCount as cartCountSelector } from './selectors';
import { useRecoilState, useRecoilValue } from 'recoil';
import { m as motion, AnimateSharedLayout } from 'framer-motion';

// TODO Add Counter functionality

const MenuItemContainer = styled(motion.div).attrs({
  variants: menuItemVariants,
  initial: 'hidden',
  animate: 'visible',
  exit: 'exit',
  'data-testid': 'menu-item',
})`
  width: 100%;
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin: 0;
  align-self: center;
  background: ${({ theme }) => hexToRgb(theme.backgroundLighter, 1)};
  border-radius: 25px;
  padding: 0.5em;
  border: 10px solid ${({ theme }) => theme.backgroundLighter};

  img {
    position: relative;
    top: 0;
    max-width: 100%;
    object-fit: contain;
    border-radius: inherit;
    box-shadow: 10px 10px rgba(0, 0, 0, 0.1);
    transform: translateX(-10px);
  }

  .item-info {
    justify-self: flex-end;
    width: calc(100% + 15px);
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    border-radius: inherit;
    background: ${({ theme }) => theme.backgroundLighter};
    padding: 1.3em 1.8em;
    padding-bottom: 0;

    p,
    h6 {
      margin: 0;
    }

    p {
      font-size: 1.2em;
      font-weight: var(--xXBold);
      font-family: var(--primaryFont);
    }

    h6 {
      margin: 1em 0 1em 0;
      font-weight: var(--medium);
      color: ${({ theme }) => theme.gray};
      font-size: 1.2em;
    }

    .add-to-cart-button {
      color: ${({ theme }) => theme.background};
      width: 17em;
      display: flex;
      align-items: center;
      justify-content: space-around;
      border: none;
      box-shadow: 5px 5px 30px rgba(0, 0, 0, 0.2);
      background: ${({ theme }) => theme.accentColor};
      border-radius: 7px;
      padding: 1em 0;
      align-self: center;
      font-size: 1em;
      cursor: pointer;
      font-weight: var(--bold);
      font-family: var(--primaryFont);
      outline: rgba(0, 0, 0, 0.2);
      transition: 0.1s ease box-shadow;

      span {
        transform: scale(1.2);
      }

      &.with-counter {
        padding-bottom: 0.4em;
        padding-top: 0.2em;
        background: transparent;
        box-shadow: none;
        color: ${({ theme }) => theme.accentColor};

        span {
          font-family: var(--primaryFont);
          font-size: 1.8rem;
          transform: scale(1.3);
          margin-bottom: 7px;
        }

        svg {
          width: 10%;
          height: auto;
          transform: scale(1.8);
          background: transparent;
          cursor: pointer;
          box-shadow: 5px 5px 30px rgba(0, 0, 0, 0.2);
          transition: 0.1s ease box-shadow;

          &:last-of-type {
            transform: scale(-1) scale(1.8);
          }
        }
      }

      &:active,
      & > svg:active {
        box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.2);
      }

      &:disabled {
        color: ${({ theme }) => hexToRgb(theme.gray, 0.4)};
      }
    }
  }
`;

function AddToCartButton({ itemName }) {
  const { REACT_APP_CART_LIMIT: cartLimit } = process.env;

  const [cartState, setCartState] = useRecoilState(cartStateAtom);
  const cartCount = useRecoilValue(cartCountSelector);
  const [localItemCount, setLocalItemCount] = React.useState(0);

  const showCounter = localItemCount >= 1;
  const counterClass = showCounter ? 'with-counter' : '';
  const isDisabled = localItemCount === cartLimit || cartCount === cartLimit;

  React.useEffect(() => {
    const itemCount = cartState[itemName];
    if (itemCount) setLocalItemCount(itemCount);
  }, []);

  const addToCartHandler = () => {
    if (showCounter) return;
    incrementCount();
  };

  const decrementCount = () => {
    setLocalItemCount(prevValue =>
      prevValue === 0 || cartCount === 0 ? prevValue : (prevValue -= 1)
    );

    setCartState(prevCartObject => {
      const newCartObject = Object.assign({}, prevCartObject);

      newCartObject[itemName] -= 1;
      newCartObject[itemName] === 0 && delete newCartObject[itemName];
      return newCartObject;
    });
  };

  const incrementCount = () => {
    setLocalItemCount(prevValue =>
      prevValue === cartLimit || cartCount === cartLimit ? prevValue : (prevValue += 1)
    );

    setCartState(prevCartObject => {
      console.log(prevCartObject);
      const newCartObject = Object.assign({}, prevCartObject);
      const itemIsAlreadyInCart = itemName in newCartObject;

      itemIsAlreadyInCart ? (newCartObject[itemName] += 1) : (newCartObject[itemName] = 1);
      return newCartObject;
    });
  };

  return (
    <motion.button
      className={`add-to-cart-button ${counterClass}`}
      onClick={addToCartHandler}
      disabled={isDisabled}>
      <AnimateSharedLayout>
        {showCounter && (
          <>
            <ArrowLeftSquareFill onClick={decrementCount} />
            <motion.span layoutId="text" animate={{ opacity: 1 }}>
              {localItemCount}
            </motion.span>
            <ArrowLeftSquareFill onClick={incrementCount} />
          </>
        )}
        {!showCounter && <motion.span layoutId="text">Add to cart</motion.span>}
      </AnimateSharedLayout>
    </motion.button>
  );
}

export default function MenuItem({ menuItemName, price, custom }) {
  const parenthesisRegex = new RegExp(/\((.*?)\)/, 'g');
  const foodType = menuItemName.match(parenthesisRegex)[0].replace(/\W/g, '');

  // const initialOrder = () => {
  //   const orderList = JSON.parse(localStorage.getItem('orderList')) || [];
  //   orderList.push(menuItemName);
  //   localStorage.setItem('orderList', JSON.stringify(orderList));
  //   return orderList;
  // };

  return (
    <MenuItemContainer custom={custom} data-food-type={foodType}>
      <img src={pizzaImage} alt={`Image for ${menuItemName}`} />
      <div className="item-info">
        <p>{menuItemName}</p>
        <h6>{price}</h6>
        <AddToCartButton itemName={menuItemName} />
      </div>
    </MenuItemContainer>
  );
}

MenuItem.propTypes = {
  menuItemName: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  custom: PropTypes.number.isRequired,
};

MenuItem.whyDidYouRender = true;
