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
  color: var(--errorRed);
  margin-bottom: 0px;
  margin-top: 10px;
  font-weight: var(--medium);
  font-size: 0.8em;
`;

export default function Input(props) {
  const { name, type = 'text', validationsParam = null, ...rest } = props;
  const { register, errors } = useFormContext();

  const validationObj = !!validationOptions[name] ? validationOptions[name](validationsParam) : {};

  return (
    <AnimateSharedLayout>
      <InputContainer variants={generalAuthVariants} layout>
        <input name={name} type={type} {...rest} ref={register(validationObj)} />

        <ErrorMessage
          name={name}
          errors={errors}
          layout
          render={({ message }) => (
            <AnimatePresence exitBeforeEnter>
              <ErrorDisplay
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
      </InputContainer>
    </AnimateSharedLayout>
  );
}
