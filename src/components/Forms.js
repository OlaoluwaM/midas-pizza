import React from 'react';
import Input from './InputField';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import CustomError from './utils/custom-error';

import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { m as motion } from 'framer-motion';
import { UserSessionContext } from './context/context';
import { authPageGeneralVariants, generalAuthElementVariants } from './utils/framer-variants';
import {
  getErrMessage,
  generateUrl,
  normalize,
  fetchWrapper,
  generateFetchOptions,
  updateLocalStorageAccessToken,
} from './utils/helpers';

const Form = styled(motion.form).attrs({
  variants: authPageGeneralVariants,
  layoutId: 'auth-form',
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

const SettingsForm = styled(motion.form).attrs({
  variants: authPageGeneralVariants,
  layout: true,
  layoutId: 'settings-form',
})`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
`;

const SubmitButton = styled(motion.button).attrs({
  className: 'submit-button button-baseColor',
  type: 'submit',
  layout: 'position',
  key: 'submit-button',
  variants: generalAuthElementVariants,
})``;
export function LoginForm({ apiAuth, isLoading }) {
  const [errorString, setErrorString] = React.useState('');

  const formObj = useForm({
    reValidateMode: 'onBlur',
    shouldFocusError: true,
  });

  const { register, handleSubmit, errors, setError, clearErrors } = formObj;
  const errMsgFromErrors = getErrMessage(errors);
  const formContainsInvalidInput = !!normalize(errors);

  React.useEffect(() => {
    if (!normalize(errorString) || isLoading) return;
    const { field, message } = JSON.parse(errorString);
    setError(field, { message });

    return () => {
      setErrorString('');
      formContainsInvalidInput && clearErrors();
    };
  }, [errorString, isLoading]);

  const submitHandler = async formData => {
    try {
      const { passwordLogin: password, ...rest } = formData;
      const dataToSendToServer = { password, ...rest };

      const url = generateUrl('/tokens');

      await apiAuth(url, dataToSendToServer);
    } catch (error) {
      console.error(error);

      if (error?.status === 401) {
        setErrorString(JSON.stringify({ field: 'email', message: 'User does not exist' }));
      } else if (error?.status === 400) {
        setErrorString(JSON.stringify({ field: 'passwordLogin', message: 'Incorrect Password' }));
      }
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

      <SubmitButton disabled={formContainsInvalidInput}>Log in</SubmitButton>
    </Form>
  );
}

export function SignUpForm({ apiAuth, isLoading }) {
  const [errorString, setErrorString] = React.useState('');

  const formObj = useForm({
    reValidateMode: 'onBlur',
    shouldFocusError: true,
  });

  const { register, handleSubmit, errors, setError, clearErrors } = formObj;
  const errMsgFromErrors = getErrMessage(errors);

  const formContainsInvalidInput = !!normalize(errors);

  React.useEffect(() => {
    if (!normalize(errorString) || isLoading) return;
    const { field, message } = JSON.parse(errorString);
    setError(field, { message });

    return () => {
      setErrorString('');
      formContainsInvalidInput && clearErrors();
    };
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
      console.error(error);
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

      <SubmitButton disabled={formContainsInvalidInput}>Sign Up</SubmitButton>
    </Form>
  );
}

export function UpdateProfileForm({ saveChanges, isLoading }) {
  const { userData } = React.useContext(UserSessionContext);
  const [errorString, setErrorString] = React.useState('');

  const formObj = useForm({
    reValidateMode: 'onBlur',
    shouldFocusError: true,
    defaultValues: {
      name: userData.name,
      email: userData.email,
      streetAddress: userData.streetAddress,
    },
  });

  const { register, handleSubmit, errors, clearErrors, setError } = formObj;
  const formContainsInvalidInput = !!normalize(errors);

  const errMsgFromErrors = getErrMessage(errors);

  React.useEffect(() => {
    if (!normalize(errorString) || isLoading) return;
    const { field, message } = JSON.parse(errorString);
    setError(field, { message });

    return () => {
      setErrorString('');
      formContainsInvalidInput && clearErrors();
    };
  }, [errorString, isLoading]);

  const submitHandler = async (formData, e) => {
    const dataToSendToServer = {};
    try {
      Object.entries(formData).forEach(({ 0: field, 1: fieldData }) => {
        fieldData !== userData[field] && (dataToSendToServer[field] = fieldData);
        return;
      });

      if (!normalize(dataToSendToServer)) {
        toast("You haven't updated your information yet", { type: 'info' });
        return;
      }

      await saveChanges(dataToSendToServer);
      updateLocalStorageAccessToken(dataToSendToServer?.email);

      e.target.reset();
    } catch (error) {
      console.error(error);

      if (error?.status === 500) {
        setErrorString(
          JSON.stringify({ field: 'email', message: 'A user with this email exists' })
        );
      }
    }
  };

  return (
    <SettingsForm onSubmit={handleSubmit(submitHandler)}>
      <Input
        name="name"
        placeholder="New username"
        register={register}
        error={errMsgFromErrors('name')}
      />

      <Input
        name="email"
        type="email"
        placeholder="New email"
        register={register}
        error={errMsgFromErrors('email')}
      />

      <Input
        name="streetAddress"
        placeholder="Street Address"
        register={register}
        error={errMsgFromErrors('streetAddress')}
      />

      <SubmitButton disabled={formContainsInvalidInput}>Save Changes</SubmitButton>
    </SettingsForm>
  );
}

export function UpdatePasswordForm({ saveChanges }) {
  const { userData } = React.useContext(UserSessionContext);

  const formObj = useForm({
    reValidateMode: 'onBlur',
    shouldFocusError: true,
  });

  const { register, handleSubmit, errors, setError, clearErrors } = formObj;
  const formContainsInvalidInput = !!normalize(errors);

  const errMsgFromErrors = getErrMessage(errors);

  React.useEffect(() => {
    return () => {
      formContainsInvalidInput && clearErrors();
    };
  }, []);

  const checkOldPassword = async oldPassword => {
    const { email } = userData;

    try {
      await fetchWrapper(
        generateUrl('/tokens'),
        generateFetchOptions('POST', { email, password: oldPassword })
      );

      return true;
    } catch {
      return false;
    }
  };

  const submitHandler = async (formData, e) => {
    const { passwordSignIn: oldPassword, confirmPassword, newPassword } = formData;

    try {
      if (newPassword !== confirmPassword) {
        throw new CustomError(
          { fields: ['confirmPassword'], message: 'Passwords do not match' },
          'ValidationError'
        );
      }

      if (oldPassword === newPassword) {
        throw new CustomError(
          {
            fields: ['passwordSignIn', 'newPassword'],
            message: 'Your old and new password cannot be the same',
          },
          'ValidationError'
        );
      }

      const oldPasswordIsCorrect = await checkOldPassword(oldPassword);

      if (!oldPasswordIsCorrect) {
        throw new CustomError(
          { fields: ['passwordSignIn'], message: 'Incorrect Password' },
          'ValidationError'
        );
      }

      await saveChanges({ password: newPassword });
      e.target.reset();
    } catch (error) {
      if (error?.type === 'ValidationError') {
        const {
          message: { fields, message },
        } = error;

        fields.forEach(field => setError(field, { type: 'manual', message }));
      }

      console.error(error);
    }
  };

  return (
    <SettingsForm onSubmit={handleSubmit(submitHandler)}>
      <Input
        name="passwordSignIn"
        type="password"
        placeholder="Old password"
        register={register}
        error={errMsgFromErrors('passwordSignIn')}
      />

      <Input
        name="newPassword"
        type="password"
        placeholder="New password"
        register={register}
        error={errMsgFromErrors('newPassword')}
      />

      <Input
        name="confirmPassword"
        type="password"
        placeholder="Confirm new password"
        register={register}
        error={errMsgFromErrors('confirmPassword')}
      />

      <SubmitButton disabled={formContainsInvalidInput}>Save Changes</SubmitButton>
    </SettingsForm>
  );
}

SignUpForm.whyDidYouRender = true;
LoginForm.whyDidYouRender = true;
UpdatePasswordForm.whyDidYouRender = true;
UpdateProfileForm.whyDidYouRender = true;

SignUpForm.propTypes = {
  apiAuth: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

LoginForm.propTypes = {
  apiAuth: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

UpdatePasswordForm.propTypes = {
  saveChanges: PropTypes.func.isRequired,
};

UpdateProfileForm.propTypes = {
  saveChanges: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};
