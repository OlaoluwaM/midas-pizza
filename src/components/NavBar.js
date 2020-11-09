import React from 'react';
import styled from 'styled-components';
import Logout from './Logout';
import hexToRgb from './utils/hexToRgb';

import { NavLink } from 'react-router-dom';
import { Cart3 as Cart } from '@styled-icons/bootstrap/Cart3';
import { useRecoilValue } from 'recoil';
import { UserSessionContext } from './context/context';
import { Settings2 as Settings } from '@styled-icons/evaicons-solid/Settings2';
import { settingsMenuTooltipVariants } from './utils/framer-variants';
import { m as motion, AnimatePresence } from 'framer-motion';
import { cartCount as cartCountSelector } from './selectors';

const NavContainer = styled.nav`
  width: 100%;
  height: 9vh;
  background: transparent;
  position: relative;
  z-index: 2;
  color: ${({ theme }) => hexToRgb(theme.gray, 0.3)};
  font-family: var(--secondaryFont);

  ul {
    height: 100%;
    margin: 0;
    list-style: none;

    & > li {
      position: relative;
      font-weight: var(--medium);
      height: 100%;
      margin: 0px 4% 0;
      display: inline-block;

      svg {
        stroke-width: 0.3px;
        width: 4vmin;
        height: auto;
      }

      &.pos-right {
        float: right;
      }

      a {
        text-decoration: none;
        font-size: 1.2em;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        position: relative;
      }

      &::last-of-type {
        margin-right: 0;
      }

      @media (max-width: 980px) {
        & {
          font-size: 2vmin;
        }
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

const TooltipMenu = styled(motion.menu).attrs({
  variants: settingsMenuTooltipVariants,
  animate: 'popUp',
  initial: 'hidden',
  exit: 'hidden',
})`
  position: absolute;
  right: -1.1em;
  top: 100%;
  min-width: 14em;
  display: flex;
  padding: 1em;
  flex-direction: column;
  border-radius: 9px;
  margin: 0;
  list-style: none;
  background: ${({ theme }) => theme.backgroundLighter};
  box-shadow: 7px 7px 1px ${({ theme }) => hexToRgb(theme.blackLighter, 0.3)};

  & > * {
    transition: background 0.2s ease;
  }

  &:before {
    content: '';
    position: absolute;
    top: -2em;
    right: 0.8em;
    width: 0;
    height: 0;
    border: 20px solid ${({ theme }) => theme.backgroundLighter};
    border-left-color: transparent;
    border-right-color: transparent;
    border-top-color: transparent;
  }

  & > li {
    display: flex;
    color: ${({ theme }) => hexToRgb(theme.gray, 0.9)};
    padding: 0.8em 1em;
    justify-content: space-around;
    align-items: center;
    font-size: 0.8em;
    font-weight: var(--medium);
    margin: 0.7em 0 1.3em 0;
    cursor: pointer;
    border-radius: 3px;

    & > a {
      color: inherit;
      transition: color 0.3s ease;
      text-align: center;
    }

    &:hover,
    &:active,
    &:focus,
    &:focus-within {
      color: ${({ theme }) => hexToRgb(theme.accentColor, 0.7)};
      background: ${({ theme }) => hexToRgb(theme.gray, 0.1)};
    }
  }
`;

function ShoppingCart() {
  const cartCountValue = useRecoilValue(cartCountSelector);

  return (
    <motion.li className="pos-right shopping-cart">
      <NavLink
        to="/cart"
        className="nav-link"
        data-testid="cart-link"
        activeClassName="current-page-svg">
        <Cart title="Cart" />
        <motion.span data-testid="cart-count">{cartCountValue}</motion.span>
      </NavLink>
    </motion.li>
  );
}

function SettingsLink({ logUserOut }) {
  const [shouldShowMenu, setTooltipMenuVisibility] = React.useState(false);

  const showTooltipMenu = () => setTooltipMenuVisibility(true);
  const hideTooltipMenu = () => setTooltipMenuVisibility(false);

  return (
    <motion.li className="pos-right">
      <a className="nav-link" href="">
        <Settings
          title="Settings"
          style={{ zIndex: 5 }}
          onMouseOver={showTooltipMenu}
          onMouseLeave={hideTooltipMenu}
        />
      </a>

      <AnimatePresence>
        {shouldShowMenu && (
          <TooltipMenu
            data-testid="settings-tooltip-menu"
            onMouseEnter={showTooltipMenu}
            onMouseLeave={hideTooltipMenu}
            layout>
            <li>
              <Settings />
              <NavLink to="/settings">Account Settings</NavLink>
            </li>
            <Logout logUserOut={logUserOut} />
          </TooltipMenu>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

export default function Nav({ logUserOut }) {
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
              <NavLink className="nav-link" activeClassName="current-page" exact to="/menu">
                Menu
              </NavLink>
            </motion.li>

            <SettingsLink logUserOut={logUserOut} />

            <ShoppingCart />
          </>
        )}
      </ul>
    </NavContainer>
  );
}
