import React from 'react';
import styled from 'styled-components';
import hexToRgb from './utils/hexToRgb';
import PropTypes from 'prop-types';
import pizzaImage from '../assets/pizza-image-ivan-torres-unsplash.jpg';
import drinkImage from '../assets/drink-image-maxime-renard-unsplash.jpg';
import dessertImage from '../assets/dessert-image-emile-mbunzama-unsplash.jpg';
import snacksImage from '../assets/snacks-image-fran-hogan-unsplash.jpg';

import { toast } from 'react-toastify';
import { m as motion } from 'framer-motion';
import { menuItemVariants } from './local-utils/framer-variants';
import { useSetRecoilState } from 'recoil';
import { cartState as cartStateAtom } from './atoms';
import { convertDollarToFloat, getCartCount } from './local-utils/helpers';

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
  padding: 1em;
  border: 10px solid ${({ theme }) => theme.backgroundLighter};

  img {
    position: relative;
    max-width: 100%;
    object-fit: contain;
    border-radius: inherit;
    align-self: center;
    box-shadow: 10px 10px rgba(0, 0, 0, 0.1);
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
      margin: 0.5em 0 0.8em 0;
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
        position: relative;
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
        position: relative;
        color: ${({ theme }) => theme.background};
        width: 55%;
        flex-basis: 55%;
        display: flex;
        align-items: center;
        justify-content: space-around;
        border: none;
        box-shadow: 5px 5px 30px rgba(0, 0, 0, 0.2);
        background: ${({ theme }) => theme.accentColor};
        border-radius: 7px;
        padding: 1em 0;
        align-self: flex-end;
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

const { REACT_APP_QUANTITY_LIMIT: quantityLimit } = process.env;

function QuantityInput({ incrementQuantity }) {
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
      <label htmlFor="quantity">Qty</label>
      <input
        id="quantity"
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
  // TODO Add skeleton or placeholder effect for image
  const quantityToAdd = React.useRef(1);
  const updateCart = useSetRecoilState(cartStateAtom);

  const parenthesisRegex = new RegExp(/\((.*?)\)/, 'g');
  const displayName = menuItemName.replace(parenthesisRegex, '');
  const foodType = menuItemName.match(parenthesisRegex)[0].replace(/\W/g, '');
  const imagePool = {
    Pizza: pizzaImage,
    Drink: drinkImage,
    Dessert: dessertImage,
    Snack: snacksImage,
  };

  const incrementQuantityToAddBy = quantity => {
    quantityToAdd.current = quantity;
  };

  const addToCart = () => {
    const { current: amountOrdered } = quantityToAdd;

    updateCart(prevCartObject => {
      const cartCount = getCartCount(prevCartObject);

      if (cartCount + amountOrdered > quantityLimit) {
        toast(`Sorry but you cannot order more than ${quantityLimit} items`, { type: 'error' });
        return prevCartObject;
      }

      let newCartItemObject = {};
      const alreadyInCart = displayName in prevCartObject;

      if (!alreadyInCart) {
        newCartItemObject[displayName] = {
          type: foodType,
          quantity: 0,
          initialPrice: convertDollarToFloat(price),
        };
      } else newCartItemObject[displayName] = { ...prevCartObject[displayName] };

      newCartItemObject[displayName]['quantity'] += amountOrdered;
      const newCartObject = { ...prevCartObject, ...newCartItemObject };

      return newCartObject;
    });
  };

  return (
    <MenuItemContainer custom={custom} data-food-type={foodType}>
      <img src={imagePool[foodType]} alt={`${displayName}`} />
      <div className="item-info">
        <p>{displayName}</p>
        <h6>{`$${convertDollarToFloat(price).toFixed(2)}`}</h6>
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
