import React from 'react';
import styled from 'styled-components';
import hexToRgb from './utils/hexToRgb';

import { toast } from 'react-toastify';
import { m as motion } from 'framer-motion';
import { ReactComponent as NotFoundSVG } from '../assets/undraw_page_not_found_su7k.svg';
import { ReactComponent as NotAuthorizedSVG } from '../assets/undraw_secure_login_pdn4.svg';
import { defaultPageTransitionVariants } from './local-utils/framer-variants';
import { ReturnUpForward } from 'styled-icons/ionicons-sharp';

const SectionContainer = styled(motion.section).attrs({
  className: 'section-container',
  variants: defaultPageTransitionVariants,
  animate: 'show',
  initial: 'hide',
  exit: 'exit',
})`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
  background: ${({ theme }) => hexToRgb(theme.baseColor, 0.3)};

  svg {
    scale: 0.67;
  }
`;

export function NotFoundPage() {
  React.useEffect(() => {
    toast("Seems like you can't find what you are looking for, why don't you go back home 🏡", {
      type: 'error',
      autoClose: 8000,
    });
  }, []);

  return (
    <SectionContainer>
      <NotFoundSVG />
    </SectionContainer>
  );
}

export function NotAuthorizedPage() {
  React.useEffect(() => {
    toast('You have to login or sign up to view this page 👋', {
      type: 'error',
    });
  }, []);

  return (
    <SectionContainer>
      <NotAuthorizedSVG />
    </SectionContainer>
  );
}

export function GeneralErrorPage() {
  return (
    <SectionContainer>
      <h1>Error</h1>
    </SectionContainer>
  );
}
