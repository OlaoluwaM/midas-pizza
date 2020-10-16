import React from 'react';

import { m as motion } from 'framer-motion';
import { default as styled, keyframes, css } from 'styled-components';

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
  },
  show: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
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
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  width: 100%;

  ${({ isFullscreen }) =>
    isFullscreen
      ? css`
          position: fixed;
          height: 100%;
        `
      : css`
          position: absolute;
          height: 45%;
        `}
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

export default function Loading({ fullscreen = false, layoutId }) {
  const layoutObj = layoutId ? { layoutId } : { layout: true };
  return (
    <Overlay isFullscreen={fullscreen} {...layoutObj}>
      <Spinner />
    </Overlay>
  );
}
