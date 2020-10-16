import React from 'react';
import styled from 'styled-components';
import hexToRgb from './utils/hexToRgb';
import PropTypes from 'prop-types';

import { normalize } from './local-utils/helpers';
import { ErrorMessage } from '@hookform/error-message';
import { validationOptions } from './local-utils/authFunctions';
import { generalAuthElementVariants, errorMessageVariants } from './local-utils/framer-variants';
import { m as motion, AnimatePresence, AnimateSharedLayout } from 'framer-motion';

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
    padding: 1.1em;
    font-size: 1em;
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
    <AnimatePresence exitBeforeEnter>
      <ErrorDisplay
        data-testid={`invalid-input-error-${thisIsFor}`}
        variants={errorMessageVariants}
        initial="hide"
        exit="exit"
        layout
        key={`${message}_${thisIsFor}_id`}>
        {message}
      </ErrorDisplay>
    </AnimatePresence>
  );
});

// const InputFieldErrorElementWrapper = ({ thisIsFor }) => {
//   const { errors } = useFormContext();
//   return <InputFieldErrorElement thisIsFor={thisIsFor} errors={errors} />;
// };

// InputFieldErrorElementWrapper.whyDidYouRender = true;
InputFieldErrorElement.whyDidYouRender = true;

const HookFormInputField = React.memo(props => {
  const { motionProps = { variants: generalAuthElementVariants }, validationObj = {} } = props;
  const { register, error: errorMessage, ...rest } = props;

  const inputAttributes = { type: 'text', ...rest };
  const { name } = inputAttributes;

  const validationRules = normalize(validationObj) ?? validationOptions[name];

  return (
    <AnimateSharedLayout>
      <InputContainer {...motionProps}>
        <motion.input {...inputAttributes} ref={register(validationRules)} layout="position" />
        {errorMessage && <InputFieldErrorElement thisIsFor={name} message={errorMessage} />}
      </InputContainer>
    </AnimateSharedLayout>
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
