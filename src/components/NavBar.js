import React from 'react';
import styled from 'styled-components';
import hexToRgb from './utils/hexToRgb';

import { NavLink } from 'react-router-dom';
import { Settings } from '@styled-icons/ionicons-solid/Settings';
import { m as motion } from 'framer-motion';
import { Cart3 as Cart } from '@styled-icons/bootstrap/Cart3';
import { UserSessionContext } from './context/context';
import { showCart as showCartAtom } from './atoms';
import { cartCount as cartCountSelector } from './selectors';
import { useRecoilValue, useSetRecoilState } from 'recoil';

const NavContainer = styled.nav`
  width: 100vw;
  height: 7%;
  background: ${({ theme }) => theme.background};
  position: fixed;
  z-index: 2;
  color: ${({ theme }) => hexToRgb(theme.black, 0.5)};
  font-family: var(--secondaryFont);

  ul {
    height: 100%;
    margin: 0;
    padding: 0 4em;
    list-style: none;

    li {
      font-weight: var(--medium);
      height: 100%;
      margin: 15px;
      display: inline-block;
      padding-bottom: 1.5em;
      margin-right: 3em;

      svg {
        stroke-width: 0.3px;
        width: 1.4em;
      }

      &.pos-right {
        float: right;
      }

      a {
        text-decoration: none;
        font-size: 1.2em;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        position: relative;
      }

      &::last-of-type {
        margin-right: 0;
      }
    }
    .shopping-cart {
      position: relative;
      cursor: pointer;

      span {
        margin-left: 5px;
      }
    }
  }
`;

function ShoppingCart() {
  const cartCountValue = useRecoilValue(cartCountSelector);
  const toggleOrderPreview = useSetRecoilState(showCartAtom);
  const toggleOrderPreviewRef = React.useRef(false);

  const toggleCartPreview = () => {
    const { current: prevToggleState } = toggleOrderPreviewRef;
    toggleOrderPreview(!prevToggleState);
    toggleOrderPreviewRef.current = prevToggleState === true ? false : true;
  };

  return (
    <motion.li className="pos-right shopping-cart" onClick={toggleCartPreview}>
      <a className="nav-link">
        <Cart title="Cart" />
        <motion.span data-testid="cart-count">{cartCountValue}</motion.span>
      </a>
    </motion.li>
  );
}

export default function Nav() {
  const { authenticated } = React.useContext(UserSessionContext);

  return (
    <NavContainer>
      <ul>
        <motion.li>
          <NavLink exact to="/" className="nav-link" activeClassName="current-page">
            Home
          </NavLink>
        </motion.li>

        {!authenticated && (
          <motion.li>
            <NavLink className="nav-link" activeClassName="current-page" to="/authenticate">
              Sign Up
            </NavLink>
          </motion.li>
        )}

        {authenticated && (
          <>
            <motion.li>
              <NavLink className="nav-link" activeClassName="current-page" to="/menu">
                Menu
              </NavLink>
            </motion.li>

            <motion.li className="pos-right">
              <NavLink className="nav-link" activeClassName="current-page" to="/settings">
                <Settings title="Settings" />
              </NavLink>
            </motion.li>

            <ShoppingCart />
          </>
        )}
      </ul>
    </NavContainer>
  );
}
