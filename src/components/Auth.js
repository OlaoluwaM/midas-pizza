import React from 'react';
import styled from 'styled-components';
import hexToRgb from './utils/hexToRgb';

import { PageWrapper } from './general-components/general';
import { ErrorMessage } from '@hookform/error-message';
import { Blob2 as AuthPageBlob1 } from '../assets/Blobs';
import { motion, AnimateSharedLayout } from 'framer-motion';
import { useForm, useFormContext, FormProvider } from 'react-hook-form';

const formStates = ['Log in', 'Sign Up'];

const AuthSection = styled.section.attrs({
  className: 'section-container',
})`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
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

  h2 {
    font-size: 3.5em;
    font-family: var(--primaryFont);
    font-weight: var(--xXBold);
    margin: -0.8em 0 0.7em 0;
  }

  & > svg.blob {
    position: fixed;
    transform: translate(330px, -200px);

    &:nth-of-type(2) {
      width: 0%;
      transform: translate(-590px, 200px);
    }
  }
`;

const Form = styled(motion.form)`
  width: 100%;
  height: auto;
  padding: 1em;
  display: flex;
  flex-direction: column;
  box-shadow: 20px 20px 60px #d9d9d8, -20px -20px 60px #ffffff;
  justify-content: center;
  border-radius: 15px;
  color: ${({ theme }) => theme.black};
`;

const InputContainer = styled(motion.div)`
  color: ${({ theme }) => hexToRgb(theme.blackLighter, 0.15)};
  width: 82%;
  margin: 8px auto;
  transition: color 0.3s ease;
  position: relative;

  input {
    border: none;
    border-radius: 5px;
    font-weight: var(--regular);
    width: 100%;
    background: transparent;
    text-indent: 10px;
    padding: 1.1em;
    font-size: 1.1em;
    color: inherit;
    transition: box-shadow 0.3s ease, border-color 0.2s ease;

    &::placeholder {
      color: inherit;
      font-weight: var(--regular);
    }

    &:last-of-type {
      margin-bottom: 15px;
    }
  }
  &:after {
    content: '';
    position: absolute;
    bottom: 20px;
    left: 0;
    width: 93%;
    margin-left: calc(1.1em + 11px);
    background: ${({ theme }) => hexToRgb(theme.blackLighter, 0.15)};
    height: 1px;
    border-radius: 15px;
    transition: background 0.3s ease;
  }

  &:focus-within {
    color: ${({ theme }) => hexToRgb(theme.black, 0.5)};
    &:after {
      background: ${({ theme }) => hexToRgb(theme.black, 0.5)};
    }
  }
`;

const SubmitButton = styled(motion.button)`
  padding: 0.8em 3.5em;
  background: transparent;
  width: max-content;
  cursor: pointer;
  font-weight: var(--medium);
  margin: 14px auto;
  border: none;
  background: ${({ theme }) => theme.baseColor};
  box-shadow: 20px 20px 60px #ababaa, -20px -20px 60px #ffffff;
  border-radius: 14px;
  font-size: 1.3em;
  transition: box-shadow 0.3s ease, background 0.3s ease;

  &:active {
    box-shadow: none;
  }
`;

const ErrorDisplay = styled(motion.p)`
  color: var(--errorRed);
  position: absolute;
  bottom: 0;
  margin-bottom: 0;
  font-weight: var(--bold);
  left: 0;
  font-size: 1.1em;
`;

function Input({ name, type = 'text', validationOptions = {}, ...rest }) {
  const { register, errors } = useFormContext();

  return (
    <AnimateSharedLayout>
      <InputContainer layout>
        <input name={name} type={type} {...rest} ref={register(validationOptions)} />
        <ErrorMessage
          name={name}
          errors={errors}
          layout
          render={({ message }) => <ErrorDisplay>{message}</ErrorDisplay>}
        />
      </InputContainer>
    </AnimateSharedLayout>
  );
}

export default function Authenticate() {
  const [formStateIndex, setFormStateIndex] = React.useState(1);
  const { register, handleSubmit, getValues, errors } = useForm({ reValidateMode: 'onBlur' });

  const isLogin = formStateIndex === 0;
  const switchFormState = () => setFormStateIndex(prev => (prev === 1 ? 0 : prev + 1));
  const submitHandler = async formData => {
    const { REACT_APP_API_ENDPOINT: URL } = process.env;

    // setLoading(true);
    try {
      const rawResponse = await fetch(URL);
      console.log(rawResponse.json());
    } catch (error) {
    } finally {
      // setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <AuthSection>
        <AuthPageBlob1 />

        <motion.div>
          <AnimateSharedLayout>
            <motion.h2 layout>{formStates[formStateIndex]}</motion.h2>

            <FormProvider register={register} getValues={getValues} errors={errors}>
              <Form onSubmit={handleSubmit(submitHandler)} layout>
                {!isLogin && <Input name="email" type="email" placeholder="Email" />}

                <Input name="username" placeholder="Username" />

                <Input name="password" type="password" placeholder="Password" />

                {!isLogin && (
                  <>
                    <Input name="streetAddress" placeholder="Street Address" />
                    <Input name="confirmPassword" type="password" placeholder="Confirm Password" />
                  </>
                )}

                <SubmitButton layout>{formStates[formStateIndex]}</SubmitButton>
              </Form>
            </FormProvider>
          </AnimateSharedLayout>
        </motion.div>
        <motion.p
          onClick={switchFormState}
          style={{ position: 'absolute', bottom: 0, cursor: 'pointer' }}
        >
          {isLogin ? 'Not a member? Sign up' : 'Already a member? Sign in'}
        </motion.p>
      </AuthSection>
    </PageWrapper>
  );
}
