import React from 'react';
import styled from 'styled-components';
import hexToRgb from './utils/hexToRgb';

import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

// TODO add animations to nav

const NavContainer = styled.nav`
  width: 100vw;
  height: 8%;
  background: transparent;
  position: absolute;
  z-index: 2;
  color: ${({ theme }) => hexToRgb(theme.black, 0.5)};
  font-family: var(--secondaryFont);

  ul {
    height: 100%;
    margin: 0;
    padding: 0 0 0 4em;
    display: flex;
    align-items: center;
    list-style: none;

    li {
      font-weight: var(--medium);
      float: left;
      height: 100%;
      margin: 15px;
      padding-bottom: 0.9em;
      margin-right: 3em;

      a {
        text-decoration: none;
        font-size: 1.2em;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        height: 100%;
        position: relative;
      }

      &::last-of-type {
        margin-right: 0;
      }
    }
  }
`;

export default function Nav() {
  return (
    <NavContainer>
      <ul>
        <motion.li>
          <NavLink exact to="/" className="nav-link" activeClassName="current-page">
            Home
          </NavLink>
        </motion.li>

        <motion.li>
          <NavLink className="nav-link" activeClassName="current-page" to="/authenticate">
            Sign Up
          </NavLink>
        </motion.li>
      </ul>
    </NavContainer>
  );
}
