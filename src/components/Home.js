import React from 'react';
import styled from 'styled-components';
import hexToRgb from './utils/hexToRgb';

import { NavLink } from 'react-router-dom';
import { m as motion } from 'framer-motion';
import { UserSessionContext } from './context/context';
import { ReactComponent as EatingPizzaSVG } from '../assets/undraw_staying_in_i80u.svg';
import {
  homeContentVariants,
  homeSVGVariants,
  defaultPageTransitionVariants,
} from './utils/framer-variants';

const HomeSection = styled(motion.section).attrs({
  className: 'section-container',
  variants: defaultPageTransitionVariants,
  animate: 'visible',
  initial: 'hidden',
  exit: 'exit',
})`
  align-items: center;
  flex-direction: row-reverse;
  justify-content: space-between;

  @media (max-width: 1090px) {
    &.section-container {
      display: block;
      height: fit-content;
      padding: 1em 0em;
    }
  }
`;

const Content = styled(motion.div)`
  flex-basis: 50%;
  display: flex;
  text-align: left;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  color: ${({ theme }) => theme.black};
  padding-left: 5em;
  z-index: 1;

  transition: background 0.3s ease;

  h1 {
    font-family: var(--primaryFont);
    font-weight: var(--xLight);
    font-size: min(4vw, 3em);
    margin: 1em 0 0 0;
    overflow-wrap: anywhere;
    text-align: inherit;
    padding-right: 1em;
    line-height: 1.3em;
  }

  p {
    font-size: min(2vw, 0.9em);
    text-align: inherit;
    width: 82%;
    color: ${({ theme }) => hexToRgb(theme.black, 0.5)};
    line-height: 1.8em;
    margin: 1em 0 2em 0;

    strong {
      color: ${({ theme }) => theme.baseColor};
      font-weight: var(--bold);
    }
  }

  a {
    color: inherit;
    font-weight: var(--bold);
    position: relative;
    width: clamp(25%, 10vmin, 35%);
    height: min(3.7em, 12vmin);
    cursor: pointer;
    z-index: 1;
    font-size: min(1em, 4vmin);
    margin-bottom: -2em;

    span {
      display: block;
      position: absolute;
      border: 3px solid ${({ theme }) => theme.black};
      background: ${({ theme }) => theme.baseColor};
      width: 100%;
      height: 100%;
      border-radius: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      transition: transform 0.3s ease;

      &.backdrop {
        background: ${({ theme }) => theme.backgroundDarker};
        transform: translate(5px, 5px);
        z-index: -1;
      }
    }

    &:active > span:not(.backdrop) {
      transform: translate(5px, 5px);
    }
  }

  @media (max-width: 1090px) {
    text-align: center;
    align-items: center;
    padding: 0;
    height: max-content;
    margin-bottom: 5em;

    h1 {
      padding: 0;
    }

    p {
      margin-bottom: 3.5em;
    }
  }
`;

const HomeSvgContainer = styled(motion.div).attrs({
  variants: homeSVGVariants,
})`
  flex-basis: 50%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  svg.blob {
    position: fixed;
    width: 100%;
  }

  svg:not(.blob) {
    width: 80%;
    height: auto;
    position: relative;
    z-index: 1;

    @media (max-width: 1090px) {
      width: 65%;
      transform: translateY(-1em);
    }
  }

  @media (max-width: 1090px) {
    height: 80vmin;
  }
`;

export default function Home() {
  const { authenticated } = React.useContext(UserSessionContext);
  const finalLocation = authenticated ? '/menu' : '/authenticate';

  return (
    <HomeSection>
      <HomeSvgContainer>
        <EatingPizzaSVG />
      </HomeSvgContainer>

      <Content variants={homeContentVariants}>
        {/* <motion.div variants={homeContentVariants} style={{ backgroundColor: 'transparent' }}> */}
        <h1>Pizza from the comfort of your home</h1>

        <p>
          Quarantine's locked you up? Well, we are introducing a new way for our customers to get
          the pizza's they love all while staying completely safe. with our{' '}
          <strong>new delivery platform</strong>
        </p>

        <NavLink data-testid="link" to={finalLocation}>
          <span>{authenticated ? 'Order' : 'Sign Up'}</span>
          <span className="backdrop"></span>
        </NavLink>
        {/* </motion.div> */}
      </Content>
    </HomeSection>
  );
}
