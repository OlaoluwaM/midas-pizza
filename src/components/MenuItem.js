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
import { getCartCount } from './utils/helpers';
import { menuItemVariants } from './utils/framer-variants';
import { useSetRecoilState } from 'recoil';
import { CartPlusFill as CartIcon } from '@styled-icons/bootstrap/CartPlusFill';
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
  padding: 1em;
  border: 10px solid ${({ theme }) => theme.backgroundLighter};

  img {
    position: relative;
    max-width: 100%;
    object-fit: contain;
    content-visibility: auto;
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
    padding: 1.2em 1em;
    padding-bottom: 0;

    p,
    h6 {
      margin: 0;
    }

    p {
      font-size: min(3vmin, 1.2em);
      font-weight: var(--xXBold);
      font-family: var(--primaryFont);
    }

    h6 {
      margin: 0.5em 0 0.8em 0;
      font-weight: var(--medium);
      color: ${({ theme }) => theme.gray};
      font-size: min(3vmin, 1em);
    }

    .order-buttons {
      width: 100%;
      height: auto;
      display: flex;
      justify-content: space-between;

      .quantity-field {
        position: relative;
        flex-basis: 35%;
        width: 40%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        opacity: 0.2;
        transition: opacity 0.2s ease;

        @media (max-width: 870px) {
          justify-content: center;
        }

        &:focus-within {
          opacity: 1;
        }

        label {
          font-size: clamp(0.4em, 2vmin, 0.7em);
          font-weight: var(--bold);
          @media (max-width: 870px) {
            display: none;
          }
        }

        input {
          text-indent: 0.5em;
          height: 85%;
          text-align: center;
          border: none;
          border-bottom: 3px solid ${({ theme }) => theme.blackLighter};
          font-size: clamp(1em, 1vmin, 1.3em);
          font-family: var(--primaryFont);
          font-weight: var(--bold);
        }
      }

      .add-to-cart-button {
        position: relative;
        flex-basis: 60%;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        border: none;
        border-radius: 7px;
        padding: 1.3em 0;
        align-self: flex-end;
        cursor: pointer;
        font-weight: var(--bold);
        font-family: var(--primaryFont);
        transition: 0.1s ease box-shadow, 0.2s ease background, color 0.3s ease;

        svg {
          width: 11%;
        }

        span {
          font-size: min(3vmin, 1em);
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
      <label htmlFor="quantity">Qty:</label>
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
      className="add-to-cart-button button-black"
      onClick={addToCart}
      data-testid="add-to-cart-button">
      <CartIcon />
      <motion.span layoutId="text">Add to cart</motion.span>
    </motion.button>
  );
}

export default function MenuItem({ itemName, price, custom, foodType }) {
  const quantityToAdd = React.useRef(1);
  const updateCart = useSetRecoilState(cartStateAtom);

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
      const alreadyInCart = itemName in prevCartObject;

      if (!alreadyInCart) {
        newCartItemObject[itemName] = {
          type: foodType,
          quantity: 0,
          initialPrice: price,
        };
      } else newCartItemObject[itemName] = { ...prevCartObject[itemName] };

      newCartItemObject[itemName]['quantity'] += amountOrdered;
      const newCartObject = { ...prevCartObject, ...newCartItemObject };

      return newCartObject;
    });
  };

  return (
    <MenuItemContainer custom={custom} data-food-type={foodType}>
      <img src={imagePool[foodType]} alt={`${itemName}`} />
      <div className="item-info">
        <p>{itemName}</p>
        <h6>{`$${price.toFixed(2)}`}</h6>
        <div className="order-buttons">
          <QuantityInput incrementQuantity={incrementQuantityToAddBy} />
          <AddToCartButton addToCart={addToCart} />
        </div>
      </div>
    </MenuItemContainer>
  );
}

MenuItem.propTypes = {
  itemName: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  custom: PropTypes.number.isRequired,
  foodType: PropTypes.string.isRequired,
};

MenuItem.whyDidYouRender = true;
