import React from 'react';
import Loading from './Loading';
import hexToRgb from './utils/hexToRgb';

import { toast } from 'react-toastify';
import { default as styled, css } from 'styled-components';
import { Redirect, useLocation } from 'react-router-dom';
import { UserSessionContext } from './context/context';
import { SignUpForm, LoginForm } from './Forms.js';
import { generateFetchOptions, fetchWrapper } from './utils/helpers';
import { ReactComponent as PizzaDeliverySVG } from '../assets/undraw_on_the_way_ldaq.svg';
import { m as motion, AnimateSharedLayout, AnimatePresence } from 'framer-motion';
import { defaultPageTransitionVariants, generalAuthElementVariants } from './utils/framer-variants';

const AuthSection = styled(motion.section).attrs({
  className: 'section-container',
  variants: defaultPageTransitionVariants,
  initial: 'hidden',
  animate: 'visible',
  exit: 'exit',
})`
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: row-reverse;
  z-index: 14;

  & > div,
  & > h2 {
    width: 45%;
  }

  & > div {
    height: 80%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    position: relative;

    @media (max-width: 900px) {
      height: 85%;
      width: 80%;
    }

    @media (max-width: 650px) {
      width: 95%;
    }

    @media (orientation: landscape) and (max-width: 850px) {
      display: inherit;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  svg {
    width: 40%;
    height: auto;
    transform: scaleX(-1);

    @media (max-width: 900px) {
      &:not(.inline-password-svg) {
        display: none;
      }
    }
  }

  h2 {
    font-size: clamp(2rem, 10vmin, 3.5rem);
    font-family: var(--primaryFont);
    font-weight: var(--xXBold);
    color: ${({ theme }) => hexToRgb(theme.baseColor, 0.8)};
    margin: 0 0 0.3em 0;
    text-align: center;
    margin-top: 0;
  }

  @media (orientation: landscape) and (max-width: 850px) {
    &.section-container {
      display: block;
    }
  }
`;

const SwitchFormStateText = styled(motion.p).attrs({
  variants: generalAuthElementVariants,
  className: 'form-state-switch-text',
})`
  position: relative;
  text-align: center;
  margin-bottom: 0.7em;
`;

export default function Authenticate({ authUser }) {
  const formStates = ['Log in', 'Sign Up'];
  const { authenticated } = React.useContext(UserSessionContext);

  const [isLoading, setIsLoading] = React.useState(false);
  const [formStateIndex, setFormStateIndex] = React.useState(1);

  const isLogin = formStateIndex === 0;
  const { state } = useLocation();

  const switchFormState = () => {
    setFormStateIndex(prevIndex => (prevIndex === 1 ? 0 : prevIndex + 1));
  };

  const apiSubmitHandler = async (url, data) => {
    try {
      setIsLoading(true);

      await fetchWrapper(url, generateFetchOptions('POST', data));
      authUser(prev => ({ ...prev, authenticated: true }));
      const toastOptions = { type: 'success', autoClose: 3000 };

      isLogin ? toast('Welcome back', toastOptions) : toast('Thanks for joining', toastOptions);
    } catch (error) {
      toast('An error occurred during authentication', { type: 'error' });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const memoizedApiSubmitHandler = React.useCallback(apiSubmitHandler, [isLogin]);

  return (
    <AuthSection isLogin={isLogin}>
      {authenticated && !isLoading && <Redirect to={state?.from ?? '/'} />}

      <PizzaDeliverySVG />

      <div>
        <AnimateSharedLayout>
          <motion.h2 variants={generalAuthElementVariants} layout key={formStateIndex}>
            {formStates[formStateIndex]}
          </motion.h2>

          <AnimatePresence>
            {isLoading && <Loading layoutId="auth-form" key="loader" />}
          </AnimatePresence>

          <AnimatePresence exitBeforeEnter>
            {isLogin ? (
              <LoginForm apiAuth={memoizedApiSubmitHandler} isLoading={isLoading} key="loginForm" />
            ) : (
              <SignUpForm
                apiAuth={memoizedApiSubmitHandler}
                isLoading={isLoading}
                key="signUpForm"
              />
            )}
          </AnimatePresence>

          <SwitchFormStateText key={isLogin} layoutId={isLogin} onClick={switchFormState}>
            {isLogin ? 'Not a member? ' : 'Already a member? '}Click here
          </SwitchFormStateText>
        </AnimateSharedLayout>
      </div>
    </AuthSection>
  );
}

Authenticate.whyDidYouRender = true;
