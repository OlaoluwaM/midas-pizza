import React from 'react';
import styled from 'styled-components';

import { useRecoilValue } from 'recoil';
import { previewCartVariants } from './local-utils/framer-variants';
import { convertDollarToFloat } from './local-utils/helpers';
import { showCart as showCartAtom } from './atoms';
import { m as motion, AnimateSharedLayout } from 'framer-motion';
import { cartObject as cartObjectSelector } from './selectors';

// TODO Finish cart preview component

const OrderPreviewContainer = styled(motion.section).attrs({
  variants: previewCartVariants,
  initial: 'hidden',
  exit: 'hidden',
})`
  position: fixed;
  height: calc(100% - 7%);
  bottom: 0;
  width: 35%;
  background: ${({ theme }) => theme.backgroundLighter};
  display: flex;
  right: 0;
  z-index: 1;
  flex-direction: column;
  padding: 1.5em;
  border-top-left-radius: 10px;

  &.visible + .section-container {
    filter: blur(5px);
  }

  h3 {
    width: 100%;
    text-align: center;
    font-size: 2em;
    margin-top: 0;
    font-family: var(--primaryFont);
  }
`;

function OrderPreview({ menu }) {
  const showPreview = useRecoilValue(showCartAtom);
  const cartObject = useRecoilValue(cartObjectSelector);

  const [cart, setCart] = React.useState(Object.entries(cartObject));

  const cartHasChanged = JSON.stringify(cartObject) !== JSON.stringify(Object.fromEntries(cart));
  const menuObject = menu && Object.fromEntries(menu);
  const isVisible = showPreview ? 'visible' : '';

  React.useEffect(() => {
    if (!showPreview) return;

    cartHasChanged && setCart(Object.entries(cartObject));
  }, [showPreview, cartHasChanged]);

  return (
    <OrderPreviewContainer className={isVisible} animate={showPreview ? 'visible' : 'hidden'}>
      <AnimateSharedLayout>
        <motion.h3>Your Cart</motion.h3>
        <motion.p>You have 0 items</motion.p>
        {menuObject &&
          cart.length > 0 &&
          cart.map(([orderName, orderQuantity]) => {
            const initialPrice = menuObject[orderName];
            const totalPrice = `$${convertDollarToFloat(initialPrice) * orderQuantity}`;
            const breakdownOfTotalPrice = `${initialPrice} X ${orderQuantity}`;
            return (
              <motion.div layout>
                <h4>{orderName}</h4>
                <p>{breakdownOfTotalPrice}</p>
                <p>{totalPrice}</p>
                <input type="number" min="1" max="10" value={orderQuantity} />
              </motion.div>
            );
          })}
      </AnimateSharedLayout>
    </OrderPreviewContainer>
  );
}

const MemoizedOrderPreview = React.memo(OrderPreview, (prevProps, nextProps) => {
  return JSON.stringify(prevProps.menu) === JSON.stringify(nextProps.menu);
});
MemoizedOrderPreview.whyDidYouRender = true;

export default MemoizedOrderPreview;
