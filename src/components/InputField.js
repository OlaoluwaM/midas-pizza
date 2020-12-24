import React from 'react';
import styled from 'styled-components';
import hexToRgb from './utils/hexToRgb';
import PropTypes from 'prop-types';

import { Eye } from '@styled-icons/bootstrap/Eye';
import { normalize } from './utils/helpers';
import { EyeSlash } from '@styled-icons/bootstrap/EyeSlash';
import { validationOptions } from './utils/authFunctions';
import { m as motion, AnimatePresence } from 'framer-motion';
import { generalAuthElementVariants, errorMessageVariants } from './utils/framer-variants';

const InputContainer = styled(motion.div).attrs({
  layout: 'position',
})`
  color: ${({ theme }) => hexToRgb(theme.blackLighter, 0.3)};
  width: 85%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  transition: color 0.3s ease;
  margin-bottom: 1.1em;
  position: relative;

  &:focus-within {
    color: ${({ theme }) => theme.black};

    & > input {
      border-color: ${({ theme }) => theme.black};
    }
  }

  input {
    border: none;
    border-radius: 5px;
    font-weight: var(--light);
    width: 100%;
    flex-basis: 80%;
    border: 2px solid ${({ theme }) => hexToRgb(theme.gray, 0.4)};
    background: transparent;
    text-indent: 10px;
    padding: min(1.1em, 4%);
    font-size: clamp(0.7em, 2vmin, 1em);
    color: inherit;
    transition: border-color 0.5s ease;

    &::placeholder {
      color: inherit;
      font-weight: var(--regular);
    }
  }
`;

const ErrorDisplay = styled(motion.p)`
  color: var(--error);
  margin-bottom: 0px;
  margin-top: 10px;
  font-weight: var(--xXBold);
  font-size: 0.8em;
`;

const InputFieldErrorElement = React.memo(({ thisIsFor, message }) => {
  return (
    <ErrorDisplay
      data-testid={`invalid-input-error-${thisIsFor}`}
      variants={errorMessageVariants}
      initial="hidden"
      exit="exit"
      layout="position"
      key={`${message}_${thisIsFor}_id`}>
      {message}
    </ErrorDisplay>
  );
});

InputFieldErrorElement.whyDidYouRender = true;

function ShowPasswordSvg() {
  const [passwordIsVisible, setPasswordVisibility] = React.useState(false);

  const togglePassword = e => {
    const svg = e.currentTarget;
    const inputElement = svg.previousElementSibling;
    inputElement.type = passwordIsVisible ? 'password' : 'text';
    inputElement.focus();
    setPasswordVisibility(prevState => !prevState);
  };

  if (!passwordIsVisible) return <Eye className="inline-password-svg" onClick={togglePassword} />;

  return <EyeSlash className="inline-password-svg" onClick={togglePassword} />;
}

const HookFormInputField = React.memo(props => {
  const { motionProps = {}, validationObj = {} } = props;
  const { register, error: errorMessage, ...rest } = props;

  const inputAttributes = { type: 'text', ...rest };
  const motionData = { variants: generalAuthElementVariants, ...motionProps };
  const { name } = inputAttributes;

  const isPasswordField = /password/gi.test(name);
  const validationRules = normalize(validationObj) ?? validationOptions[name];

  return (
    <InputContainer {...motionData}>
      <motion.input
        {...inputAttributes}
        ref={register(validationRules)}
        layout="position"
        style={isPasswordField && { paddingRight: '15%' }}
      />

      <AnimatePresence exitBeforeEnter>
        {errorMessage && <InputFieldErrorElement thisIsFor={name} message={errorMessage} />}
      </AnimatePresence>

      {isPasswordField && <ShowPasswordSvg />}
    </InputContainer>
  );
});

HookFormInputField.propTypes = {
  motionProps: PropTypes.object,
  validationObj: PropTypes.object,
  register: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired,
};

InputFieldErrorElement.propTypes = {
  thisIsFor: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

HookFormInputField.whyDidYouRender = true;
export default HookFormInputField;
