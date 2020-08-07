import React from 'react';
import Input from './AuthInputField';
import styled from 'styled-components';
import hexToRgb from './utils/hexToRgb';

import { toast } from 'react-toastify';
import { PageWrapper } from './general-components/general';
import { authVariants } from './local-utils/framer-variants';
import { generateFetchOptions } from './local-utils/helpers';
import { useForm, FormProvider } from 'react-hook-form';
import { Blob2 as AuthPageBlob1 } from '../assets/Blobs';
import { m as motion, AnimateSharedLayout, AnimatePresence } from 'framer-motion';

const { formVariants, generalAuthVariants } = authVariants;

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
    margin: -0.4em 0.8em 0.15em 0;
    text-align: center;
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
  padding-left: 0;
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

const SwitchFormStateText = styled(motion.p)`
  position: fixed;
  bottom: 0;
  font-weight: var(--bold);
  color: ${({ theme }) => hexToRgb(theme.accentColor, 0.5)};
  cursor: pointer;
  transition: color 0.3s ease;

  &:active,
  &:hover {
    color: ${({ theme }) => hexToRgb(theme.accentColor, 1)};
  }
`;

export default function Authenticate() {
  const formStates = ['Log in', 'Sign Up'];

  const passwordRef = React.useRef();
  const [formStateIndex, setFormStateIndex] = React.useState(1);
  const { register, handleSubmit, watch, errors, clearErrors } = useForm({
    reValidateMode: 'onBlur',
  });

  passwordRef.current = watch('password', '');
  const isLogin = formStateIndex === 0;
  const { REACT_APP_API_ENDPOINT: URL } = process.env;

  const switchFormState = () => {
    setFormStateIndex(prev => (prev === 1 ? 0 : prev + 1));
    clearErrors();
  };

  const submitLogic = {
    [formStates[0]]: async formData => {
      const request = await fetch(`${URL}/tokens`, generateFetchOptions('POST', formData));
      const response = await request.json();
      console.log(response);
      return response;
    },

    [formStates[1]]: async formData => {
      delete formData.confirmPassword;
      const request = await fetch(`${URL}/users`, generateFetchOptions('POST', formData));
      console.log(request);
      const response = await request.json();
      console.log(response);
      return request;
    },
  };

  const submitHandler = async formData => {
    const currentFormState = formStates[formStateIndex];
    try {
      const responseData = await submitLogic[currentFormState](formData);
      console.log(responseData);
    } catch (err) {
      console.log(err);

      toast('Something went wrong, Check your form and try again', { type: 'error' });
    } finally {
    }
  };

  return (
    <PageWrapper>
      <AuthSection>
        <AuthPageBlob1 />

        <motion.div variants={formVariants}>
          <AnimateSharedLayout>
            <motion.h2 variants={generalAuthVariants} layout>
              {formStates[formStateIndex]}
            </motion.h2>

            <FormProvider register={register} errors={errors}>
              <Form onSubmit={handleSubmit(submitHandler)} layout>
                {!isLogin && <Input name="email" type="email" placeholder="Email" />}

                <Input name="name" placeholder="Username" validationsParam={isLogin} />

                <Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  validationsParam={isLogin}
                />

                {!isLogin && (
                  <>
                    <Input name="streetAddress" placeholder="Street Address" />
                    <Input
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm Password"
                      validationsParam={passwordRef.current}
                    />
                  </>
                )}

                <SubmitButton layout>{formStates[formStateIndex]}</SubmitButton>
              </Form>
            </FormProvider>
          </AnimateSharedLayout>
        </motion.div>

        <AnimatePresence exitBeforeEnter>
          <SwitchFormStateText
            key={isLogin}
            variants={generalAuthVariants}
            onClick={switchFormState}>
            {isLogin ? 'Not a member? ' : 'Already a member? '}Click here
          </SwitchFormStateText>
        </AnimatePresence>
      </AuthSection>
    </PageWrapper>
  );
}
