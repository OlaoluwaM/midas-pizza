import React from 'react';
import PropTypes from 'prop-types';

import { m as motion } from 'framer-motion';
import { default as styled, css } from 'styled-components';

const variants = {
  hidden: {
    opacity: 0,
    transition: {
      when: 'afterChildren',
    },
  },
  visible: {
    opacity: 1,
    transition: { when: 'beforeChildren' },
  },
  exit: {
    opacity: 0,
    transition: {
      when: 'afterChildren',
    },
  },
};

const Overlay = styled(motion.div).attrs({
  'data-testid': 'loader',
  variants: variants,
  initial: 'hidden',
  animate: 'visible',
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

const Spinner = styled(motion.div)`
  width: 30px;
  height: 30px;
  transform-origin: center;
  border-radius: 100%;
  border: 5px solid transparent;
  border-top-color: ${({ theme }) => theme.baseColor};
  animation: spin 0.5s linear infinite;
  will-change: transform;
`;

export default function Loading({ fullscreen = false, layoutId, children }) {
  const layoutObj = layoutId ? { layoutId } : { layout: true };

  return (
    <Overlay isFullscreen={fullscreen} {...layoutObj}>
      {children ?? <Spinner layout />}
    </Overlay>
  );
}

Loading.propTypes = {
  fullscreen: PropTypes.bool,
  layoutId: PropTypes.string,
  children: PropTypes.element,
};
