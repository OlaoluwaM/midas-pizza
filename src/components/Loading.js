import React from 'react';

import { m as motion } from 'framer-motion';
import { default as styled, keyframes } from 'styled-components';

const spin = keyframes`
  from {
    transform: rotate(0)
  }
  to {
    transform: rotate(360deg)
  }
`;

const variants = {
  hide: {
    opacity: 0,
    transition: { when: 'beforeChildren' },
  },
  show: {
    opacity: 1,
    transition: { when: 'afterChildren' },
  },
  exit: {
    opacity: 0,
    transition: { when: 'beforeChildren' },
  },
};

const Overlay = styled(motion.div).attrs({
  'data-testid': 'loader',
  variants: variants,
  initial: 'hide',
  animate: 'show',
  exit: 'exit',
  key: 'overlay',
  className: 'loader',
})`
  width: 100%;
  height: 100%;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 400;
  position: ${({ isFullscreen }) => (isFullscreen ? 'fixed' : 'absolute')};
`;

const Spinner = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 100%;
  border: 5px solid transparent;
  border-top-color: ${({ theme }) => theme.baseColor};
  animation: ${spin} 0.5s linear infinite;
  will-change: transform;
`;

export default function Loading({ fullscreen = false, layoutId, className }) {
  return (
    <Overlay isFullscreen={fullscreen} layoutId={layoutId}>
      <Spinner />
    </Overlay>
  );
}
