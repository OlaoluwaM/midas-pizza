import React from 'react';
import styled from 'styled-components';
import hexToRgb from './utils/hexToRgb';
import PropTypes from 'prop-types';
import pizzaImage from '../assets/pizza-image-ivan-torres-unsplash.jpg';
import drinkImage from '../assets/drink-image-maxime-renard-unsplash.jpg';
import dessertImage from '../assets/dessert-image-emile-mbunzama-unsplash.jpg';
import snacksImage from '../assets/snacks-image-fran-hogan-unsplash.jpg';

import { Plus } from '@styled-icons/boxicons-regular/Plus';
import { m as motion } from 'framer-motion';
import { Dash as Minus } from '@styled-icons/bootstrap/Dash';
import { Close as Delete } from '@styled-icons/evaicons-solid/Close';
import { orderItemVariants } from './local-utils/framer-variants';
import { useSetRecoilState } from 'recoil';
import { convertDollarToFloat } from './local-utils/helpers';
import { cartState as cartStateAtom } from './atoms';

const OrderItemContainer = styled(motion.li).attrs({
  // variants: orderItemVariants,
  // initial: 'hidden',
  // animate: 'visible',
})`
  display: flex;
  width: 100%;
  height: auto;
  padding: 1.2em;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => hexToRgb(theme.gray, 0.4)};

  & > svg {
    width: 2em;
    flex-basis: 2em;
    cursor: pointer;
    fill: ${({ theme }) => hexToRgb(theme.gray, 0.7)};
    transition: fill 0.4s ease;

    &:hover {
      fill: ${({ theme }) => theme.blackLighter};
    }
  }

  & > h5 {
    font-size: 1rem;
    margin: 0;
    font-weight: var(--bold);
    flex-basis: 5em;
    text-align: center;
  }
`;

const ImageContainer = styled.div`
  overflow: hidden;
  border-radius: 50%;
  width: 8em;
  flex-basis: 8em;
  height: 8em;
  position: relative;

  img {
    object-fit: cover;
    object-position: center;
    width: 100%;
    height: 100%;
  }
`;

const ContentGroup = styled.div`
  height: 100%;
  display: flex;
  flex-basis: 26em;
  align-items: center;
  justify-content: flex-start;

  h4 {
    font-family: var(--primaryFont);
    font-weight: var(--xBold);
    margin: 0 0 0 3em;

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
  justify-content: flex-start;
  align-items: center;
  flex-basis: 9em;
  opacity: 0.5;
  transition: opacity 0.3s ease;

  &:focus-within {
    opacity: 1;
  }

  input {
    font-size: 0.9em;
    font-weight: var(--xXBold);
    height: 2.5em;
    font-variant: small-caps;
    border: 1px solid ${({ theme }) => theme.black};
    background: transparent;
    padding: 0.5em;
    width: 3.7em;
    flex-basis: 3.7em;
    text-align: center;
  }

  svg {
    width: 1.4em;
    flex-basis: 1.4em;
    cursor: pointer;
    stroke-linejoin: round;

    &:first-of-type {
      margin-right: 12px;
    }

    &:last-of-type {
      margin-left: 12px;
    }
  }
`;

function Counter({ itemName, initialQuantity }) {
  const [count, setCount] = React.useState(initialQuantity);
  const { REACT_APP_QUANTITY_LIMIT: quantityLimit } = process.env;

  return (
    <CounterContainer>
      <Minus />
      <input
        type="number"
        min="1"
        max={quantityLimit}
        value={count}
        onChange={e => setCount(e.target.value)}
      />
      <Plus />
    </CounterContainer>
  );
}

function OrderItem({ orderName, initialPrice, quantity, foodType }) {
  const updateCart = useSetRecoilState(cartStateAtom);

  const imagePool = {
    Pizza: pizzaImage,
    Drink: drinkImage,
    Dessert: dessertImage,
    Snack: snacksImage,
  };

  const totalPrice = (quantity * initialPrice).toFixed(2);
  const formattedInitialPrice = initialPrice.toFixed(2);

  const deleteItemHandler = () => {
    updateCart(prevCart => {
      const newCartObject = { ...prevCart };
      delete newCartObject[orderName];
      localStorage.setItem('storedCart', JSON.stringify(newCartObject));
      return newCartObject;
    });
  };

  return (
    <OrderItemContainer layout="position">
      <ContentGroup>
        <ImageContainer>
          <img src={imagePool[foodType]} alt={`${foodType} image`} />
        </ImageContainer>
        <h4>
          {orderName}
          <p>
            <sup>$</sup>
            {formattedInitialPrice}
          </p>
        </h4>
      </ContentGroup>
      <Counter initialQuantity={quantity} itemName={orderName} />
      <h5>
        <sup>$</sup>
        {totalPrice}
      </h5>
      <Delete onClick={deleteItemHandler} />
    </OrderItemContainer>
  );
}

OrderItem.propTypes = {
  orderName: PropTypes.string.isRequired,
  initialPrice: PropTypes.number.isRequired,
  quantity: PropTypes.number.isRequired,
  foodType: PropTypes.string.isRequired,
};

const MemoizedOrderItem = React.memo(OrderItem, (prevProps, nextProps) => {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
});

MemoizedOrderItem.whyDidYouRender = true;

export default MemoizedOrderItem;
