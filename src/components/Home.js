import React from 'react';
import styled from 'styled-components';
import hexToRgb from './utils/hexToRgb';

import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { PageWrapper } from './general-components/general';
import { homeVariants } from './local-utils/framer-variants';
import { ReactComponent as EatingPizzaSVG } from '../assets/undraw_staying_in_i80u.svg';

const { contentVariants, artVariants } = homeVariants;

const HomeSection = styled.section.attrs({
  className: 'section-container',
})`
  overflow: hidden;
`;

const Content = styled(motion.div)`
  flex-basis: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  color: ${({ theme }) => theme.black};
  padding-left: 3.5em;
  z-index: 1;
  background: ${({ theme }) => hexToRgb(theme.baseColor, 0.2)};

  h1 {
    font-family: var(--primaryFont);
    font-weight: var(--xLight);
    font-size: 4.2em;
    margin: 0 0 0.1em 0;
    overflow-wrap: anywhere;
    text-align: left;
    padding-right: 1em;
    line-height: 1.3em;
  }

  p {
    font-size: 1em;
    text-align: left;
    width: 82%;
    color: ${({ theme }) => hexToRgb(theme.black, 0.5)};
    line-height: 1.8em;
    margin: 1em 0 2.5em 0;

    strong {
      color: ${({ theme }) => theme.baseColor};
      font-weight: var(--bold);
    }
  }

  a {
    color: inherit;
    font-weight: var(--bold);
    position: relative;
    width: 10em;
    height: 3.5em;
    cursor: pointer;
    z-index: 1;
    margin-bottom: -2em;

    span {
      display: block;
      position: absolute;
      border: 3px solid ${({ theme }) => theme.black};
      background: ${({ theme }) => theme.baseColor};
      width: 100%;
      height: inherit;
      border-radius: 4px;
      padding: 0.9rem;
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
`;

const Art = styled(motion.div)`
  flex-grow: 1;
  height: 100%;
  position: relative;

  svg.blob {
    position: fixed;
    width: 100%;
  }

  svg:not(.blob) {
    width: 88%;
    height: auto;
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 1;
    transform: translate(-50%, -50%);
  }
`;

export default function Home() {
  return (
    <PageWrapper>
      <HomeSection>
        <Content>
          <motion.div
            variants={contentVariants}
            style={{ all: 'inherit', backgroundColor: 'transparent' }}
          >
            <h1>Pizza from the comfort of your home</h1>

            <p>
              Quarantine's locked you up? Well, we are introducing a new way for our customers to
              get the pizza's they love all while staying completely safe. with our{' '}
              <strong>new delivery platform</strong>
            </p>

            <NavLink to="/authenticate">
              <span>Sign Up</span>
              <span className="backdrop"></span>
            </NavLink>
          </motion.div>
        </Content>

        <Art variants={artVariants}>
          <EatingPizzaSVG />
        </Art>
      </HomeSection>
    </PageWrapper>
  );
}
