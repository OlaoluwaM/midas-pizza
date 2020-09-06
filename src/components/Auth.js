import React from 'react';
import Input from './AuthInputField';
import Loading from './Loading';
import styled from 'styled-components';
import hexToRgb from './utils/hexToRgb';
import CustomError from './local-utils/custom-error';

import { toast } from 'react-toastify';
import { Redirect } from 'react-router-dom';
import { authVariants } from './local-utils/framer-variants';
import { UserSessionContext } from './context/context';
import { handleInvalidInput } from './local-utils/authFunctions';
import { useForm, FormProvider } from 'react-hook-form';
import { ReactComponent as PizzaDeliverySVG } from '../assets/undraw_on_the_way_ldaq.svg';
import { generateUrl, generateFetchOptions, fetchWrapper } from './local-utils/helpers';
import { m as motion, AnimateSharedLayout, AnimatePresence } from 'framer-motion';

const { formVariants, generalAuthVariants } = authVariants;

const AuthSection = styled(motion.section).attrs({
  className: 'section-container',
  variants: formVariants,
  animate: 'show',
  initial: 'hide',
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
    margin: 0.3em 0.8em 0.3em 0;
    text-align: center;
  }
`;

const Form = styled(motion.form).attrs({
  variants: formVariants,
  layoutId: 'auth',
  key: 'form',
})`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  color: ${({ theme }) => theme.black};
`;

const SubmitButton = styled(motion.button)`
  padding: 0.8em 0;
  background: transparent;
  width: 85%;
  cursor: pointer;
  font-weight: var(--regular);
  margin: 0 0 0.3em 0;
  border: none;
  background: ${({ theme }) => theme.baseColor};
  border-radius: 10px;
  font-size: 1.3em;
  transition: box-shadow 0.3s ease, background 0.3s ease;

  &:active {
    box-shadow: none;
  }
`;

const SwitchFormStateText = styled(motion.p).attrs({
  variants: generalAuthVariants,
  transition: { delay: 0.5 },
})`
  position: fixed;
  bottom: 0;
  align-self: center;
  font-weight: var(--bold);
  color: ${({ theme }) => hexToRgb(theme.accentColor, 0.5)};
  cursor: pointer;
  margin-bottom: 0.7em;
  transition: color 0.3s ease;

  &:active,
  &:hover {
    color: ${({ theme }) => hexToRgb(theme.accentColor, 1)};
  }
`;

export default function Authenticate({ authUser }) {
  const formStates = ['Log in', 'Sign Up'];
  const { authenticated } = React.useContext(UserSessionContext);

  const [isLoading, setIsLoading] = React.useState(false);
  const [formStateIndex, setFormStateIndex] = React.useState(1);

  const formObj = useForm({ reValidateMode: 'onBlur' });
  const { register, handleSubmit, errors } = formObj;
  const { clearErrors, reset, unregister, setError, formState } = formObj;

  const isLogin = formStateIndex === 0;
  const formStateEndpoints = ['tokens', 'users'];

  const switchFormState = () => {
    if (Object.keys(errors).length > 0) clearErrors();
    setFormStateIndex(prev => (prev === 1 ? 0 : prev + 1));
    if (!isLogin) unregister(['password', 'name', 'confirmPassword', 'streetAddress']);
  };

  const submitHandler = async formData => {
    const url = generateUrl(formStateEndpoints[formStateIndex]);
    try {
      if (!isLogin) {
        const { password, confirmPassword } = formData;
        if (password !== confirmPassword) {
          throw new CustomError('confirmPassword field does not match', 'ValidationError');
        }
        delete formData.confirmPassword;
      }
      setIsLoading(true);

      const userToken = await fetchWrapper(url, generateFetchOptions('POST', formData));
      localStorage.setItem('currentAccessToken', JSON.stringify(userToken));

      authUser(prev => ({ ...prev, authenticated: true }));
      const toastOptions = { type: 'success', autoClose: 3000 };

      isLogin ? toast('Welcome back', toastOptions) : toast('Thanks for joining', toastOptions);
    } catch (error) {
      const { message: errorMessage, name } = error;
      console.error(errorMessage);

      if (name === 'ValidationError' || error?.status === 400) {
        errorMessage?.search(/confirmPassword/) > -1 ? clearErrors('confirmPassword') : reset({});

        const { field, message } = handleInvalidInput(errorMessage);

        if (field && message) setError(field, { type: 'manual', message });
      } else {
        toast('Something went wrong in the authentication process', { type: 'error' });
        //TODO Redirect to Error Page
      }
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  return (
    <AuthSection>
      {authenticated && !isLoading && <Redirect push to="/" />}
      <PizzaDeliverySVG />

      <motion.div>
        <AnimateSharedLayout>
          <motion.h2 variants={generalAuthVariants} layout>
            {formStates[formStateIndex]}
          </motion.h2>

          <FormProvider register={register} errors={errors} formState={formState}>
            <AnimatePresence>{isLoading && <Loading layoutId="auth" />}</AnimatePresence>

            <Form onSubmit={handleSubmit(submitHandler)}>
              {!isLogin && <Input name="name" placeholder="Username" />}

              <Input name="email" type="email" placeholder="Email" />

              <Input
                name="password"
                type="password"
                placeholder="Password"
                validationsParam={isLogin}
              />

              {!isLogin && (
                <>
                  <Input name="streetAddress" placeholder="Street Address" />
                  <Input name="confirmPassword" type="password" placeholder="Confirm Password" />
                </>
              )}

              <SubmitButton variants={generalAuthVariants} layout>
                {formStates[formStateIndex]}
              </SubmitButton>
            </Form>
          </FormProvider>
        </AnimateSharedLayout>

        <SwitchFormStateText key={isLogin} layoutId={isLogin} onClick={switchFormState}>
          {isLogin ? 'Not a member? ' : 'Already a member? '}Click here
        </SwitchFormStateText>
      </motion.div>
    </AuthSection>
  );
}
