import React from 'react';
import styled from 'styled-components';
import hexToRgb from './utils/hexToRgb';
import PropTypes from 'prop-types';
import pizzaImage from '../assets/ivan-torres-MQUqbmszGGM-unsplash.jpg';

import { m as motion } from 'framer-motion';
import { menuItemVariants } from './local-utils/framer-variants';
import { useSetRecoilState } from 'recoil';
import { cartState as cartStateAtom } from './atoms';

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

    .order-buttons {
      width: 100%;
      height: auto;
      display: flex;
      justify-content: space-between;

      .quantity-field {
        flex-basis: 40%;
        width: 40%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        opacity: 0.2;
        transition: opacity 0.2s ease;

        &:focus-within {
          opacity: 1;
        }

        label {
          margin-right: 12px;
          font-size: 1em;
          font-weight: var(--medium);
        }

        input {
          text-indent: 0.5em;
          height: 85%;
          text-align: center;
          border: none;
          border-bottom: 3px solid ${({ theme }) => theme.blackLighter};
          font-size: 1.3em;
          font-family: var(--primaryFont);
          font-weight: var(--bold);
        }
      }

      .add-to-cart-button {
        color: ${({ theme }) => theme.background};
        width: 45%;
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

        &:active {
          box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.2);
        }
      }
    }
  }
`;

function QuantityInput({ incrementQuantity }) {
  const { REACT_APP_QUANTITY_LIMIT: quantityLimit } = process.env;
  const [localItemQuantity, setLocalItemQuantity] = React.useState(1);

  React.useEffect(() => {
    return () => setLocalItemQuantity(1);
  }, []);

  const changeHandler = e => {
    const {
      target: { value },
    } = e;
    const valueAsNumber = parseInt(value);

    setLocalItemQuantity(valueAsNumber);
    incrementQuantity(valueAsNumber);
  };

  return (
    <motion.div className="quantity-field">
      <label htmlFor="quantity-input">Qty</label>
      <motion.input
        id="quantity-input"
        data-testid="quantity-input"
        type="number"
        min="1"
        max={quantityLimit}
        value={localItemQuantity}
        onChange={changeHandler}
      />
    </motion.div>
  );
}

function AddToCartButton({ addToCart }) {
  return (
    <motion.button
      className={'add-to-cart-button'}
      onClick={addToCart}
      data-testid="add-to-cart-button">
      <motion.span layoutId="text">Add to cart</motion.span>
    </motion.button>
  );
}

export default function MenuItem({ menuItemName, price, custom }) {
  const quantityToAdd = React.useRef(1);
  const updateCart = useSetRecoilState(cartStateAtom);

  const parenthesisRegex = new RegExp(/\((.*?)\)/, 'g');
  const foodType = menuItemName.match(parenthesisRegex)[0].replace(/\W/g, '');

  const incrementQuantityToAddBy = quantity => {
    quantityToAdd.current = quantity;
  };

  const addToCart = () => {
    const { current: amountToAdd } = quantityToAdd;

    updateCart(prevCartObject => {
      const newCartObject = Object.assign({}, prevCartObject);

      if (menuItemName in newCartObject) {
        newCartObject[menuItemName] += amountToAdd;
      } else newCartObject[menuItemName] = amountToAdd;

      return newCartObject;
    });
  };

  return (
    <MenuItemContainer custom={custom} data-food-type={foodType}>
      <img src={pizzaImage} alt={`Image for ${menuItemName}`} />
      <div className="item-info">
        <p>{menuItemName}</p>
        <h6>{price}</h6>
        <div className="order-buttons">
          <QuantityInput incrementQuantity={incrementQuantityToAddBy} />
          <AddToCartButton addToCart={addToCart} />
        </div>
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
