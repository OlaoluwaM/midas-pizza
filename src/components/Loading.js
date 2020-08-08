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

const Overlay = styled(motion.div)`
  width: 100%;
  height: 100%;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 400;
`;

const Spinner = styled(motion.div)`
  width: 30px;
  height: 30px;
  border-radius: 100%;
  border: 5px solid transparent;
  border-top-color: ${({ theme }) => theme.baseColor};
  animation: ${spin} 0.5s linear infinite;
  will-change: transform;
`;

export default function Loading({ fullscreen = false }) {
  return (
    <Overlay style={{ position: fullscreen ? 'absolute' : 'relative' }} key="overlay" layout>
      <Spinner />
    </Overlay>
  );
}
