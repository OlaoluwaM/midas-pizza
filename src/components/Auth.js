import React from 'react';
import Loading from './Loading';
import styled from 'styled-components';
import hexToRgb from './utils/hexToRgb';

import { toast } from 'react-toastify';
import { Redirect } from 'react-router-dom';
import { UserSessionContext } from './context/context';
import { SignUpForm, LoginForm } from './Forms.js';
import { generateFetchOptions, fetchWrapper } from './local-utils/helpers';
import { ReactComponent as PizzaDeliverySVG } from '../assets/undraw_on_the_way_ldaq.svg';
import { m as motion, AnimateSharedLayout, AnimatePresence } from 'framer-motion';
import {
  defaultPageTransitionVariants,
  generalAuthElementVariants,
} from './local-utils/framer-variants';

const AuthSection = styled(motion.section).attrs({
  className: 'section-container',
  variants: defaultPageTransitionVariants,
  initial: 'hide',
  animate: 'show',
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
  }

  svg {
    width: 40%;
    height: auto;
    transform: scaleX(-1);
  }

  h2 {
    font-size: 3.5em;
    font-family: var(--primaryFont);
    font-weight: var(--xXBold);
    color: ${({ theme }) => hexToRgb(theme.baseColor, 0.8)};
    margin: 0.3em 0.8em 0.3em 0;
    text-align: center;
  }

  /* .loader {
    position: relative;
  } */
`;

const SubmitButton = styled(motion.button).attrs({
  variants: generalAuthElementVariants,
  layout: true,
  type: 'submit',
  key: 'auth-form-submit-button',
  className: 'submit-button',
})`
  padding: 0.8em 0;
  width: 85%;
  margin: 0 0 0.3em 0;
  border: none;
  border-radius: 10px;
`;

const SwitchFormStateText = styled(motion.p).attrs({
  variants: generalAuthElementVariants,
  className: 'form-state-switch-text',
})`
  position: fixed;
  bottom: 0;
  align-self: center;
  margin-bottom: 0.7em;
`;

export default function Authenticate({ authUser }) {
  const formStates = ['Log in', 'Sign Up'];
  const { authenticated } = React.useContext(UserSessionContext);

  const [isLoading, setIsLoading] = React.useState(false);
  const [formStateIndex, setFormStateIndex] = React.useState(1);

  const isLogin = formStateIndex === 0;

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

  const memoizedApiSubmitHandler = React.useCallback(async (url, data) => {
    await apiSubmitHandler(url, data);
  }, []);

  return (
    <AuthSection>
      {authenticated && !isLoading && <Redirect push to="/" />}
      <PizzaDeliverySVG />

      <div>
        <AnimateSharedLayout type="switch">
          <motion.h2 variants={generalAuthElementVariants} layout="position">
            {formStates[formStateIndex]}
          </motion.h2>

          <AnimatePresence>
            {isLoading && <Loading layoutId="auth-form" key="loader" />}
          </AnimatePresence>

          <AnimatePresence exitBeforeEnter>
            {isLogin ? (
              <LoginForm apiAuth={memoizedApiSubmitHandler} isLoading={isLoading} key="loginForm">
                {isDisabled => (
                  <SubmitButton disabled={isDisabled}>{formStates[formStateIndex]}</SubmitButton>
                )}
              </LoginForm>
            ) : (
              <SignUpForm apiAuth={memoizedApiSubmitHandler} isLoading={isLoading} key="signUpForm">
                {isDisabled => (
                  <SubmitButton disabled={isDisabled}>{formStates[formStateIndex]}</SubmitButton>
                )}
              </SignUpForm>
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
