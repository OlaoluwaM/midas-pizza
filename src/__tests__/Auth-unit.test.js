import React from 'react';
import Authenticate from '../components/Auth';

import userEvent from '@testing-library/user-event';
import { cleanup, fireEvent, act, screen, waitForElementToBeRemoved } from '@testing-library/react';

afterAll(cleanup);

test('Should make sure user sees appropriate error on invalid input during sign up', async () => {
  // Arrange
  const utils = renderWithProviders(<Authenticate />);

  const { findAllByText, findAllByTestId, getByPlaceholderText } = utils;
  const { findByPlaceholderText, findByRole, findByTestId, getByTestId } = utils;

  // Make sure Sign up form is rendered
  expect(await findAllByText(/sign up/i)).toHaveLength(2);

  const submitButton = await findByRole('button');
  fireEvent.click(submitButton);

  // Errors displayed on empty submission
  expect(await findAllByTestId(/invalid-input-error/)).toHaveLength(5);
  expect(submitButton).toBeDisabled();

  const passwordField = await findByPlaceholderText('Password');

  await act(async () => {
    passwordField.focus();
    expect(passwordField).toHaveFocus();

    userEvent.type(passwordField, 'IAmAwesome@20032020');
    userEvent.tab();

    expect(passwordField).not.toHaveFocus();
  });

  await waitForElementToBeRemoved(() => getByTestId('invalid-input-error-passwordSignIn'));

  // Field re-validates on blur and successful input
  expect(await findAllByTestId(/invalid-input-error/)).toHaveLength(4);

  const dataToPass = {
    Username: 'britt',
    Email: 'britt@gmail.com',
    Password: 'IAmBritt@20032020',
    'Confirm Password': '123',
    'Street Address': '545 W. Ann St.Matthews, NC 28104',
  };

  await act(async () => {
    Object.keys(dataToPass).forEach(elem => {
      const element = getByPlaceholderText(elem);
      userEvent.type(element, dataToPass[elem]);
      userEvent.tab();
    });
  });

  await act(async () => {
    expect(submitButton).not.toBeDisabled();
    fireEvent.click(submitButton);
  });

  // An error should be displayed if confirm password and password fields do not match
  expect(await findByTestId('invalid-input-error-confirmPassword')).toBeInTheDocument();
});

test('Should make sure user can switch and see the login form', async () => {
  const utils = renderWithProviders(<Authenticate />);

  // Arrange
  const { findAllByText, findByText, getByPlaceholderText } = utils;
  const switchText = await findByText(/already a member/i);

  fireEvent.click(switchText);

  // Wait for sign up form elements to animate out
  await waitForElementToBeRemoved(() => getByPlaceholderText('Confirm Password'));

  // Form state should become login
  expect(await findByText(/not a member/i)).toBeInTheDocument();
  expect(await findAllByText(/log in/i)).toHaveLength(2);
});

describe('Invalid input tests', () => {
  beforeEach(() => fetch.resetMocks());

  test.each([
    ['user does not exist', { error: 'User may not exist', status: 401 }, 'email'],
    [
      'Password was incorrect',
      { error: 'Sorry your password was incorrect', status: 400 },
      'passwordLogin',
    ],
  ])(
    'Should make sure user can see authentication errors in login form if %s',
    async (_, { error, status }, fieldWithError) => {
      fetch.mockRejectOnce({ text: async () => error, status });

      const utils = renderWithProviders(<Authenticate />);

      const { findByRole, findAllByTestId } = utils;
      const { findByTestId, getByPlaceholderText } = utils;

      // Change to login form state
      const switchText = await screen.findByText(/already a mem/i);

      fireEvent.click(switchText);

      await waitForElementToBeRemoved(() => getByPlaceholderText('Confirm Password'));

      const submitButton = await findByRole('button');

      fireEvent.click(submitButton);

      // To make sure the fields validate on submission
      expect(await findAllByTestId(/invalid-input-error/)).toHaveLength(2);

      const invalidDataToPass = {
        Email: 'dedede@gmail.com',
        Password: '123',
      };

      await act(async () => {
        Object.keys(invalidDataToPass).forEach(placeHolderText => {
          const inputField = getByPlaceholderText(placeHolderText);
          fireEvent.focusIn(inputField);
          fireEvent.input(inputField, { target: { value: invalidDataToPass[placeHolderText] } });
          fireEvent.blur(inputField);
          expect(inputField).toHaveValue(invalidDataToPass[placeHolderText]);
        });
      });

      fireEvent.click(submitButton);
      expect(await findByTestId('loader')).toBeInTheDocument();

      expect(await findByTestId(`invalid-input-error-${fieldWithError}`)).toBeInTheDocument();
    }
  );

  test('Should allow user see invalid input and authentication messages if sign up was invalid', async () => {
    fetch.mockRejectOnce('Sorry, user already exists', { status: 400 });
    const utils = renderWithProviders(<Authenticate />);

    const { findByRole, findByPlaceholderText, queryAllByTestId, findByTestId } = utils;
    const submitButton = await findByRole('button');

    const invalidDataToPass = {
      Username: 'britt',
      Email: 'britt@gmail.com',
      Password: 'IAmBritt@20032020',
      'Street Address': '545 W. Ann St.Matthews, NC 28104',
      'Confirm Password': 'IAmBritt@20032020',
    };

    for await (let placeHolderText of Object.keys(invalidDataToPass)) {
      const inputField = await findByPlaceholderText(placeHolderText);
      fireEvent.focusIn(inputField);
      fireEvent.input(inputField, { target: { value: invalidDataToPass[placeHolderText] } });

      await act(async () => {
        fireEvent.blur(inputField);
      });

      expect(inputField).toHaveValue(invalidDataToPass[placeHolderText]);
    }

    // Errors should leave on valid input
    expect(queryAllByTestId(/invalid-input-error/)).toHaveLength(0);

    fireEvent.click(submitButton);

    expect(await findByTestId('loader')).toBeInTheDocument();
    // Loading indicator should be displayed

    expect(await findByTestId('invalid-input-error-email')).toBeInTheDocument();
  });
});
