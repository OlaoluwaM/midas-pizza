import React from 'react';
import styled from 'styled-components';
import hexToRgb from './utils/hexToRgb';

import { ErrorMessage } from '@hookform/error-message';
import { authVariants } from './local-utils/framer-variants';
import { useFormContext } from 'react-hook-form';
import { validationOptions } from './local-utils/authFunctions';
import { m as motion, AnimatePresence, AnimateSharedLayout } from 'framer-motion';

const { errorMessageVariants, generalAuthVariants } = authVariants;

const InputContainer = styled(motion.div)`
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
  font-weight: var(--medium);
  font-size: 0.8em;
`;

export const InputField = React.forwardRef((props, ref) => {
  const { motionProps = {}, children, hookFormProps, ...inputAttributes } = props;

  return (
    <AnimateSharedLayout>
      <InputContainer {...motionProps} layout>
        <input
          {...inputAttributes}
          ref={e => {
            ref.current = e;
            if (!hookFormProps?.register) return;

            hookFormProps.register(e, hookFormProps.validationRules);
          }}
        />

        {children}
      </InputContainer>
    </AnimateSharedLayout>
  );
});

export default function AuthInputField({ name, validationsParam = null, ...rest }) {
  const inputRef = React.useRef();
  const { register, errors } = useFormContext();

  const validationRules = !!validationOptions[name]
    ? validationOptions[name](validationsParam)
    : {};

  const motionProps = { variants: generalAuthVariants };
  const hookFormProps = { register, validationRules };
  const inputAttributes = { name, type: 'text', ...rest };

  return (
    <InputField
      motionProps={motionProps}
      ref={inputRef}
      hookFormProps={hookFormProps}
      {...inputAttributes}>
      <ErrorMessage
        name={name}
        errors={errors}
        layout
        render={({ message }) => (
          <AnimatePresence exitBeforeEnter>
            <ErrorDisplay
              data-testid="invalid-input-error"
              variants={errorMessageVariants}
              initial="hide"
              animate="show"
              exit="exit"
              layout
              key={`${message}_${name}_id`}>
              {message}
            </ErrorDisplay>
          </AnimatePresence>
        )}
      />
    </InputField>
  );
}
