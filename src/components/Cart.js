import React from 'react';
import styled from 'styled-components';
import OrderItem from './OrderItem';
import useDebounce from './custom-hooks/useDebounce';

import { Elements } from '@stripe/react-stripe-js';
import { getTotal } from './utils/helpers';
import { loadStripe } from '@stripe/stripe-js';
import { useRecoilValue } from 'recoil';
import { UserSessionContext } from './context/context';
import { default as Checkout, Modal } from './Checkout';
import { cartState as cartStateAtom } from './atoms';
import { CartCheckFill as PaymentIcon } from '@styled-icons/bootstrap/CartCheckFill';
import { ReactComponent as EmptyCartSVG } from '../assets/undraw_empty_xct9.svg';
import { generateFetchOptions, generateUrl, fetchWrapper, saveOrder } from './utils/helpers';
import { m as motion, AnimatePresence, AnimateSharedLayout, useCycle } from 'framer-motion';
import { defaultPageTransitionVariants2, emptyCartVectorVariants } from './utils/framer-variants';

const { REACT_APP_STRIPE_API_KEY: STRIPE_API_KEY } = process.env;
const stripePromise = loadStripe(STRIPE_API_KEY);

const CartPreviewContainer = styled(motion.section).attrs({
  className: 'section-container',
  variants: defaultPageTransitionVariants2,
  animate: 'visible',
  initial: 'hidden',
  exit: 'exit',
})`
  display: flex;
  z-index: 1;
  flex-direction: column;
  padding: 0 min(3vmin, 1.2em);
  position: relative;

  & > .svg-container {
    display: content;

    svg {
      position: absolute;
      width: 75%;
      scale: 0.8;
      height: auto;
      top: 50%;
      /* left: 50%; */
      transform: translateY(-50%);

      @media (max-width: 870px) and (orientation: landscape) {
        top: 35%;
        transform: unset;
        left: unset;
      }
    }
  }
`;

const CartContainer = styled.div`
  list-style: none;
  flex-grow: 1;
  height: 100%;

  h3 {
    text-align: left;
    font-size: min(3.5vmax, 2em);
    margin: min(7vmax, 2em) 0 1em 0;
    padding-left: min(3vmin, 1em);
    font-family: var(--primaryFont);
    font-weight: var(--xBold);
  }

  button.checkout-button {
    svg {
      width: 15%;
    }

    &:hover,
    &:focus,
    &:focus-within,
    &:active {
      background: ${({ theme }) => theme.black};
      color: ${({ theme }) => theme.background};
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
  const { userData } = React.useContext(UserSessionContext);
  const [showModal, cycleModal] = useCycle(false, true);

  const cart = Object.entries(cartObject);
  const cartTotal = getTotal(cartObject).toFixed(2);
  const debouncedCart = useDebounce(JSON.stringify(cart), 800);
  const initialSaveToServer = React.useRef(false);

  const cartIsEmpty = cart.length === 0;
  const currentAccessToken = JSON.parse(localStorage.getItem('currentAccessToken'));

  const showCheckoutModal = () => cycleModal();

  React.useEffect(() => {
    if (!initialSaveToServer.current) {
      initialSaveToServer.current = true;
      return;
    }

    (async () => {
      if (!cartIsEmpty) {
        await saveOrder(userData.email, cartObject, currentAccessToken.Id);
        console.log('Cart updated on server');
      } else {
        await fetchWrapper(
          generateUrl(`/order?email=${userData.email}`),
          generateFetchOptions('DELETE', null, currentAccessToken.Id)
        );

        console.log('Cart emptied');
      }
    })();
  }, [debouncedCart]);

  return (
    <>
      <AnimatePresence>
        {showModal ? (
          <Elements stripe={stripePromise} key="stripe-elements">
            <Modal key="modal" closeModal={showCheckoutModal}>
              <Checkout
                total={cartTotal}
                orders={cartObject}
                closeCheckoutModal={showCheckoutModal}
              />
            </Modal>
          </Elements>
        ) : null}
      </AnimatePresence>

      <CartPreviewContainer>
        {cartIsEmpty && (
          <motion.div
            className="svg-container"
            variants={emptyCartVectorVariants}
            animate="visible"
            initial="hidden"
            exit="hidden">
            <EmptyCartSVG data-testid="empty-cart-svg" />
          </motion.div>
        )}

        <CartContainer>
          <motion.h3 data-testid="cart-header" layout>
            {`Your Cart ${cartIsEmpty ? 'is empty' : ''}`}
          </motion.h3>

          <AnimateSharedLayout>
            {!cartIsEmpty && (
              <AnimatePresence>
                <>
                  <Cart layoutId="cart">
                    {cart.map(([orderName, { quantity, initialPrice, type }]) => (
                      <OrderItem
                        key={orderName}
                        orderName={orderName}
                        quantity={quantity}
                        foodType={type}
                        initialPrice={initialPrice}
                      />
                    ))}
                  </Cart>

                  <motion.p className="total" layout>
                    Total: <span data-testid="cart-total">{`$${cartTotal}`}</span>
                  </motion.p>
                </>
                <motion.button
                  className="checkout-button"
                  layout
                  onClick={showCheckoutModal}
                  key="checkout-button">
                  <PaymentIcon />
                  Place Order
                </motion.button>
              </AnimatePresence>
            )}
          </AnimateSharedLayout>
        </CartContainer>
      </CartPreviewContainer>
    </>
  );
}

CartPreview.whyDidYouRender = true;
