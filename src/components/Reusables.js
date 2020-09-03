import React from 'react';
import styled from 'styled-components';
import hexToRgb from './utils/hexToRgb';

const GooeySVG = styled.svg.attrs({
  width: '0',
  height: '0',
  xmlns: 'http://www.w3.org/2000/svg',
  version: '1.1',
})`
  & + * {
    filter: ${({ filterId }) => `url(#${filterId})`};
    display: inline;
    box-decoration-break: clone;
    background: ${({ theme }) => hexToRgb(theme.baseColor, 0.5)};
    padding: 0.5rem 1rem;
  }
`;

export function GooeySVGBackground({ id }) {
  return (
    <GooeySVG filterId={id} style={{ visibility: 'hidden', position: 'absolute' }}>
      <defs>
        <filter id={id}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
            result={id}
          />
          <feComposite in="SourceGraphic" in2={id} operator="atop" />
        </filter>
      </defs>
    </GooeySVG>
  );
}
