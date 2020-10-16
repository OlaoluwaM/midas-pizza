import React from 'react';
import Input from './InputField';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { useForm } from 'react-hook-form';
import { m as motion } from 'framer-motion';
import { authPageGeneralVariants } from './local-utils/framer-variants';
import { getErrMessage, generateUrl, normalize } from './local-utils/helpers';

const Form = styled(motion.form).attrs({
  variants: authPageGeneralVariants,
  layoutId: 'auth-form',
  initial: 'hide',
  animate: 'show',
  exit: 'exit',
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

export function LoginForm({ apiAuth, isLoading, children }) {
  const [errorString, setErrorString] = React.useState('');

  const formObj = useForm({
    reValidateMode: 'onBlur',
    shouldFocusError: true,
  });

  const { register, handleSubmit, errors, setError } = formObj;
  const errMsgFromErrors = getErrMessage(errors);

  React.useEffect(() => {
    if (!normalize(errorString) || isLoading) return;
    const { field, message } = JSON.parse(errorString);
    setError(field, { message, shouldFocus: true });

    return () => setErrorString('');
  }, [errorString, isLoading]);

  const isDisabled = !!normalize(errors);

  const submitHandler = async formData => {
    try {
      const { passwordLogin: password, ...rest } = formData;
      const dataToSendToServer = { password, ...rest };

      const url = generateUrl('/tokens');

      await apiAuth(url, dataToSendToServer);
    } catch (error) {
      console.log(error);
      const { status: errorStatus } = error;

      if (errorStatus === 401) {
        setErrorString(JSON.stringify({ field: 'email', message: 'User does not exist' }));
      } else if (errorStatus === 400) {
        setErrorString(JSON.stringify({ field: 'passwordLogin', message: 'Incorrect Password' }));
      } else throw error;
    }
  };

  return (
    <Form onSubmit={handleSubmit(submitHandler)}>
      <Input
        register={register}
        error={errMsgFromErrors('email')}
        name="email"
        type="email"
        placeholder="Email"
      />

      <Input
        register={register}
        error={errMsgFromErrors('passwordLogin')}
        name="passwordLogin"
        type="password"
        placeholder="Password"
      />

      {children(isDisabled)}
    </Form>
  );
}

export function SignUpForm({ apiAuth, isLoading, children }) {
  const [errorString, setErrorString] = React.useState('');

  const formObj = useForm({
    reValidateMode: 'onBlur',
    shouldFocusError: true,
  });

  const { register, handleSubmit, errors, setError } = formObj;
  const errMsgFromErrors = getErrMessage(errors);

  const isDisabled = !!normalize(errors);

  React.useEffect(() => {
    if (!normalize(errorString) || isLoading) return;
    const { field, message } = JSON.parse(errorString);
    setError(field, { type: 'manual', message, shouldFocus: true });

    return () => setErrorString('');
  }, [errorString, isLoading]);

  const submitHandler = async formData => {
    const { passwordSignIn: password, confirmPassword, ...rest } = formData;

    try {
      console.assert(password !== confirmPassword);

      if (password !== confirmPassword) {
        setError('confirmPassword', { type: 'manual', message: 'Passwords do not match' });
        return;
      }

      const dataToSendToServer = { password, ...rest };
      const url = generateUrl('/users');

      await apiAuth(url, dataToSendToServer);
    } catch (error) {
      console.log(error);
      const { status: errorStatus } = error;

      if (errorStatus === 400) {
        setErrorString(
          JSON.stringify({
            field: 'email',
            message: 'Email entered belonged to another user, please provide another email',
          })
        );
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit(submitHandler)}>
      <Input
        register={register}
        error={errMsgFromErrors('name')}
        name="name"
        placeholder="Username"
      />

      <Input
        register={register}
        error={errMsgFromErrors('email')}
        name="email"
        type="email"
        placeholder="Email"
      />

      <Input
        register={register}
        error={errMsgFromErrors('passwordSignIn')}
        name="passwordSignIn"
        type="password"
        placeholder="Password"
      />

      <Input
        register={register}
        error={errMsgFromErrors('confirmPassword')}
        name="confirmPassword"
        type="password"
        placeholder="Confirm Password"
      />

      <Input
        register={register}
        error={errMsgFromErrors('streetAddress')}
        name="streetAddress"
        placeholder="Street Address"
      />

      {children(isDisabled)}
    </Form>
  );
}

SignUpForm.whyDidYouRender = true;
LoginForm.whyDidYouRender = true;

SignUpForm.propTypes = {
  apiAuth: PropTypes.func.isRequired,
  // children: PropTypes.node,
};

LoginForm.propTypes = {
  apiAuth: PropTypes.func.isRequired,
  // children: PropTypes.node,
};
