import React from 'react';
import styled from 'styled-components';
import hexToRgb from './utils/hexToRgb';
import PropTypes from 'prop-types';

import { normalize } from './utils/helpers';
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

  input {
    border: none;
    border-radius: 5px;
    font-weight: var(--regular);
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

  &:focus-within {
    color: ${({ theme }) => theme.black};

    & > input {
      border-color: ${({ theme }) => theme.black};
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

const HookFormInputField = React.memo(props => {
  const { motionProps = {}, validationObj = {} } = props;
  const { register, error: errorMessage, ...rest } = props;

  const inputAttributes = { type: 'text', ...rest };
  const motionData = { variants: generalAuthElementVariants, ...motionProps };
  const { name } = inputAttributes;

  const validationRules = normalize(validationObj) ?? validationOptions[name];

  return (
    <InputContainer {...motionData}>
      <motion.input {...inputAttributes} ref={register(validationRules)} layout="position" />

      <AnimatePresence exitBeforeEnter>
        {errorMessage && <InputFieldErrorElement thisIsFor={name} message={errorMessage} />}
      </AnimatePresence>
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
