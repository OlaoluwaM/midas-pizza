import React from 'react';
import styled from 'styled-components';
import hexToRgb from './utils/hexToRgb';
import PropTypes from 'prop-types';
import AddToCartButton from './AddToCartButton';

import { toast } from 'react-toastify';
import { m as motion } from 'framer-motion';
import { getCartCount } from './utils/helpers';
import { menuItemVariants } from './utils/framer-variants';
import { useSetRecoilState } from 'recoil';
import { cartState as cartStateAtom } from './atoms';

const MenuItemContainer = styled(motion.div).attrs({
  variants: menuItemVariants,
  initial: 'hidden',
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
    width: 100%;
    height: 300px;
    object-fit: cover;
    object-position: center center;
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
        flex-basis: 15%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0.2;
        transition: opacity 0.2s ease;

        &:focus-within {
          opacity: 1;
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

export default function MenuItem({ itemName, price, foodType, photoId }) {
  const quantityToAdd = React.useRef(1);
  const updateCart = useSetRecoilState(cartStateAtom);

  const incrementQuantityToAddBy = quantity => {
    quantityToAdd.current = quantity;
  };

  const addToCart = () => {
    const { current: amountOrdered } = quantityToAdd;
    let addedToCart;

    updateCart(prevCartObject => {
      const cartCount = getCartCount(prevCartObject);

      if (cartCount + amountOrdered > quantityLimit) {
        toast(`Sorry but you cannot order more than ${quantityLimit} items`, { type: 'error' });
        addedToCart = false;

        return prevCartObject;
      }

      let newCartItemObject = {};
      const alreadyInCart = itemName in prevCartObject;

      if (!alreadyInCart) {
        newCartItemObject[itemName] = {
          type: foodType,
          quantity: 0,
          initialPrice: price,
          photoId,
        };
      } else newCartItemObject[itemName] = { ...prevCartObject[itemName] };

      newCartItemObject[itemName]['quantity'] += amountOrdered;
      const newCartObject = { ...prevCartObject, ...newCartItemObject };

      addedToCart = true;
      return newCartObject;
    });

    return addedToCart;
  };

  return (
    <MenuItemContainer data-food-type={foodType}>
      <img src={`https://source.unsplash.com/${photoId}`} alt={itemName} />
      <div className="item-info">
        <p data-testid="menu-item-name">{itemName}</p>
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
