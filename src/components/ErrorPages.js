import React from 'react';
import styled from 'styled-components';
import hexToRgb from './utils/hexToRgb';

import { toast } from 'react-toastify';
import { m as motion } from 'framer-motion';
import { useHistory, Redirect } from 'react-router-dom';
import { ReactComponent as ErrorSVG } from '../assets/error.svg';
import { ReactComponent as NotFoundSVG } from '../assets/undraw_page_not_found_su7k.svg';
import { defaultPageTransitionVariants } from './local-utils/framer-variants';
import { ReactComponent as ServerDownSVG } from '../assets/undraw_server_down_s4lk.svg';
import { ReactComponent as NotAuthorizedSVG } from '../assets/undraw_secure_login_pdn4.svg';

export const SectionContainer = styled(motion.section).attrs({
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

  svg {
    width: 50%;
  }
`;

const ErrorPageContainer = styled(SectionContainer)`
  justify-content: space-around;

  .error-message {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    h1 {
      padding-left: 2em;
      font-size: 2em;
      line-height: 1.5;
    }
  }
`;

const ServerDownPageWrapper = styled(ErrorPageContainer)`
  flex-direction: column;
  justify-content: space-between;
  z-index: 50;
  color: transparent;
  width: 100%;
  height: 100vh;
  background: ${({ theme }) => hexToRgb(theme.baseColor, 0.2)};

  svg {
    width: 45%;
  }

  .motion-wrapper {
    all: inherit;

    & > button {
      bottom: 1em;
      background: ${({ theme }) => hexToRgb(theme.blackLighter, 0.2)};
      color: ${({ theme }) => theme.blackLighter};
      border: none;

      &:hover,
      &:focus,
      &:active,
      &:focus-within {
        background: ${({ theme }) => theme.blackLighter};
        color: ${({ theme }) => theme.background};
      }
    }
  }
`;

export function NotFoundPage() {
  React.useEffect(() => {
    toast("Seems like you can't find what you are looking for, why don't you go back home 🏡", {
      type: 'error',
      autoClose: 5000,
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

export function ErrorPage({ error }) {
  const history = useHistory();

  React.useEffect(() => {
    toast('Sorry, something unexpected happened 😖. Please refresh and try again', {
      type: 'error',
      autoClose: false,
    });

    history.push('/');
  }, []);

  return (
    <ErrorPageContainer>
      <ErrorSVG style={{ transform: 'scale(0.8)' }} />
    </ErrorPageContainer>
  );
}

export function ServerDownPage({ serverStatus, retryConnection }) {
  const { loading, connected, down } = {
    loading: serverStatus === 1,
    connected: serverStatus === 2,
    down: serverStatus === 0,
  };

  React.useEffect(() => {
    if (loading || connected) return;

    toast('It seems the server is down, please try again or come back later. Thank You 😊', {
      type: 'error',
    });
  }, [serverStatus]);

  console.log({ loading, connected, down });
  return (
    <ServerDownPageWrapper>
      {connected && <Redirect to="/" />}

      <motion.div
        className="motion-wrapper"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        key="error-page">
        <ServerDownSVG />
        <button className="submit-button checkout-button" onClick={retryConnection}>
          Retry
        </button>
      </motion.div>
    </ServerDownPageWrapper>
  );
}
