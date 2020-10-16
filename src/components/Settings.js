import React from 'react';
import Input from './InputField';
import styled from 'styled-components';
import Loading from './Loading';
import hexToRgb from './utils/hexToRgb';

import { toast } from 'react-toastify';
import { UserSessionContext } from './context/context';
import { useForm, FormProvider } from 'react-hook-form';
import { ReactComponent as SettingsSvg } from '../assets/settings.svg';
import { generateUrl, generateFetchOptions, fetchWrapper } from './local-utils/helpers';
import { m as motion, AnimateSharedLayout, AnimatePresence } from 'framer-motion';
import {
  settingsFormVariants,
  settingsFormTextVariants,
  defaultPageTransitionVariants2,
} from './local-utils/framer-variants';

const SettingsSection = styled(motion.section).attrs({
  className: 'section-container',
  variants: defaultPageTransitionVariants2,
  initial: 'hidden',
  animate: 'visible',
  exit: 'exit',
})`
  display: flex;
  align-items: center;

  svg {
    transform: scale(0.85);
  }

  .form-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-basis: 70%;
    height: 100%;
    color: ${({ theme }) => theme.baseColor};

    h1 {
      width: calc(0.85 * 90%);
      text-align: center;
      font-size: 3em;
      margin: 0 0 0.6em 0;
      color: ${({ theme }) => hexToRgb(theme.baseColor, 0.8)};
      font-family: var(--primaryFont);
      font-weight: var(--xBold);
    }
  }
`;

const Form = styled(motion.form).attrs({
  variants: settingsFormVariants,
})`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;

  button {
    background: ${({ theme }) => hexToRgb(theme.baseColor, 0.3)};
    color: inherit;
    border: none;
    width: calc(0.85 * 100%);

    &:active,
    &:hover,
    &:focus,
    &:focus-within {
      background: ${({ theme }) => theme.baseColor};
      color: ${({ theme }) => theme.background};
    }
  }
`;

function UpdateProfileForm() {
  return (
    <>
      <Input name="name" />
      <Input name="email" type="email" />
      <Input name="streetAddress" placeholder="Street Address" />
    </>
  );
}

function UpdatePasswordForm() {
  return (
    <>
      <Input name="oldPassword" type="password" placeholder="Old Password" />
      <Input name="password" type="password" placeholder="New Password" validationsParam={false} />
      <Input name="confirmPassword" type="password" placeholder="Confirm New Password" />
    </>
  );
}

function SettingsForm({ formStateIndex }) {
  const formObj = useForm({
    reValidateMode: 'onBlur',
    shouldFocusError: true,
    shouldUnregister: true,
    defaultValues: { name, email, streetAddress },
  });

  const { register, handleSubmit, errors, formState } = formObj;

  const {
    userData: { email, name, streetAddress },
  } = React.useContext(UserSessionContext);

  return (
    <FormProvider register={register} errors={errors} formState={formState}>
      <Form layout>
        {formStateIndex === 0 ? <UpdateProfileForm /> : <UpdatePasswordForm />}

        <button className="checkout-button" type="submit">
          Save Changes
        </button>
      </Form>
    </FormProvider>
  );
}

export default function Settings() {
  const formStates = ['Update your profile', 'Change password'];

  const [isLoading, setIsLoading] = React.useState(false);
  const [formStateIndex, setFormStateIndex] = React.useState(0);

  const toggleFormState = () => {
    setFormStateIndex(index => (index < formStates.length - 1 ? index + 1 : 0));
  };

  const saveChanges = async formData => {
    console.log(formData);
  };

  return (
    <SettingsSection>
      <SettingsSvg />

      <div className="form-container">
        <AnimateSharedLayout>
          <motion.h1 variants={settingsFormTextVariants} layout="position">
            {formStates[formStateIndex]}
          </motion.h1>

          <SettingsForm formStateIndex={formStateIndex} />

          <motion.p
            className="form-state-switch-text"
            variants={settingsFormTextVariants}
            onClick={toggleFormState}
            layout="position">
            {formStates[formStateIndex ^ 1]}
          </motion.p>
        </AnimateSharedLayout>
      </div>
    </SettingsSection>
  );
}

SettingsForm.whyDidYouRender = true;
