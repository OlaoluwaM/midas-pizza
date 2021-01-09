import React from 'react';
import styled from 'styled-components';
import hexToRgb from './utils/hexToRgb';
import PropTypes from 'prop-types';

import { toast } from 'react-toastify';
import { m as motion } from 'framer-motion';
import { getCartCount } from './utils/helpers';
import { Close as Delete } from '@styled-icons/evaicons-solid/Close';
import { useSetRecoilState } from 'recoil';
import { orderItemVariants } from './utils/framer-variants';
import { cartState as cartStateAtom } from './atoms';

const OrderItemContainer = styled(motion.li).attrs({
  variants: orderItemVariants,
  'data-testid': 'order-item',
})`
  display: flex;
  width: 100%;
  height: auto;
  padding: min(3vmin, 1em);
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => hexToRgb(theme.gray, 0.4)};

  & > svg {
    width: clamp(25px, 4vmin, 32px);
    flex-basis: clamp(25px, 4vmin, 32px);
    cursor: pointer;
    fill: ${({ theme }) => hexToRgb(theme.gray, 0.7)};
    transition: fill 0.4s ease;

    &:hover,
    &:active,
    &:focus,
    &:focus-within {
      fill: ${({ theme }) => theme.accentColor};
    }
  }

  & > h5 {
    font-size: min(3vmin, 1.2em);
    margin: 0;
    font-weight: var(--bold);
    flex-basis: 7%;
    text-align: center;
  }
`;

const ImageContainer = styled.div`
  overflow: hidden;
  width: 45%;
  flex-basis: 45%;
  height: min(16vmin, 9em);
  position: relative;
  border-radius: 15px;

  img {
    width: 100%;
    display: inline-block;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
`;

const ContentGroup = styled.div`
  height: 100%;
  display: flex;
  flex-basis: min(50%, 28em);
  align-items: center;
  justify-content: space-between;

  h4 {
    font-family: var(--primaryFont);
    font-weight: var(--xBold);
    flex-basis: 46%;
    font-size: min(2.5vmin, 1.2em);

    p {
      margin: 0.5em 0 0 0;
      font-family: var(--secondaryFont);
      font-weight: var(--medium);
      color: ${({ theme }) => theme.gray};
    }
  }
`;

const CounterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.5;
  flex-basis: min(12vmin, 5em);
  height: 3em;
  transition: opacity 0.3s ease;

  &:focus-within {
    opacity: 1;
  }

  input {
    font-size: min(2.5vmin, 0.8em);
    font-weight: var(--xXBold);
    height: 85%;
    font-variant: small-caps;
    border: 1px solid ${({ theme }) => theme.black};
    background: transparent;
    padding: 0.7em;
    width: 100%;
    border-radius: 4px;
    text-align: center;

    @media (max-width: 450px) {
      height: 70%;
    }
  }
`;

function Counter({ itemName, initialQuantity }) {
  const updateCart = useSetRecoilState(cartStateAtom);
  const [count, setCount] = React.useState(initialQuantity);
  const { REACT_APP_QUANTITY_LIMIT: quantityLimit } = process.env;

  const updateItemQuantity = e => {
    console.log(count);
    if (count === 0 || isNaN(count)) return;
    const amountToAdd = parseInt(e.target.value);

    updateCart(prevCart => {
      const cartTotal = getCartCount(prevCart);

      if (cartTotal - count + amountToAdd > quantityLimit) {
        toast(`Sorry cannot order more than ${quantityLimit} items at a go 😄`, { type: 'error' });
        return prevCart;
      }

      const updatedItemObject = { [itemName]: { ...prevCart[itemName] } };
      updatedItemObject[itemName].quantity = amountToAdd;
      setCount(amountToAdd);

      return { ...prevCart, ...updatedItemObject };
    });
  };

  return (
    <CounterContainer>
      <input
        data-testid="order-count-input"
        type="number"
        min="1"
        max={quantityLimit}
        value={count}
        onChange={updateItemQuantity}
      />
    </CounterContainer>
  );
}

function OrderItem({ orderName, initialPrice, quantity, photoId }) {
  const updateCart = useSetRecoilState(cartStateAtom);

  const totalPrice = (quantity * initialPrice).toFixed(2);
  const formattedInitialPrice = initialPrice.toFixed(2);

  const deleteItemHandler = () => {
    updateCart(prevCart => {
      const newCartObject = { ...prevCart };
      delete newCartObject[orderName];
      return newCartObject;
    });
  };

  React.useEffect(() => {
    if (!isNaN(quantity) || quantity > 0) return;
    deleteItemHandler();
  }, [quantity]);

  return (
    <OrderItemContainer layout="position">
      <ContentGroup>
        <ImageContainer>
          <img src={`https://source.unsplash.com/${photoId}`} alt={`${orderName}`} />
        </ImageContainer>
        <h4 data-testid="order-item-name">
          {orderName}
          <p data-testid="order-item-initial-price">
            <sup>$</sup>
            {formattedInitialPrice}
          </p>
        </h4>
      </ContentGroup>
      <Counter initialQuantity={quantity} itemName={orderName} />
      <h5 data-testid="order-item-total">
        <sup>$</sup>
        {totalPrice}
      </h5>
      <Delete onClick={deleteItemHandler} data-testid="order-item-delete-button" />
    </OrderItemContainer>
  );
}

OrderItem.propTypes = {
  orderName: PropTypes.string.isRequired,
  initialPrice: PropTypes.number.isRequired,
  quantity: PropTypes.number.isRequired,
  photoId: PropTypes.string.isRequired,
};
Counter.propTypes = {
  itemName: PropTypes.string.isRequired,
  initialQuantity: PropTypes.number.isRequired,
};

const MemoizedOrderItem = React.memo(OrderItem, (prevProps, nextProps) => {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
});

MemoizedOrderItem.whyDidYouRender = true;

export default MemoizedOrderItem;
