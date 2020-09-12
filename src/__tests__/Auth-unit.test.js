import Authenticate from '../components/Auth';

import { render, cleanup, fireEvent, act, screen } from '@testing-library/react';

afterAll(cleanup);

function renderWithContext(value = { authenticated: false }) {
  return render(contextWrapper(Authenticate, value));
}

test('Sign up tests', async () => {
  const utils = renderWithContext();

  // Arrange
  const { findAllByText, findAllByTestId, getByPlaceholderText } = utils;
  const { findByPlaceholderText, findByRole, findByText } = utils;

  const submitButton = await findByRole('button');
  const passwordField = await findByPlaceholderText('Password');

  // Make sure Sign up form is rendered
  expect(await findAllByText(/sign up/i)).toHaveLength(2);

  fireEvent.click(submitButton);
  // Errors displayed on empty submission
  expect(await findAllByTestId('invalid-input-error')).toHaveLength(5);

  await act(async () => {
    fireEvent.focus(passwordField);
    fireEvent.input(passwordField, { target: { value: 'IAmAwesome@20032020' } });
    fireEvent.blur(passwordField);
  });

  // Field re-validates on blur and successful input
  expect(await findAllByTestId('invalid-input-error')).toHaveLength(4);
  const dataToPass = {
    Username: 'britt',
    Email: 'britt@gmail.com',
    Password: 'IAmBritt@20032020',
    'Street Address': '545 W. Ann St.Matthews, NC 28104',
    'Confirm Password': '123',
  };

  await act(async () => {
    fireEvent.input(passwordField, { target: { value: '' } });
    Object.keys(dataToPass).forEach(elem => {
      const element = getByPlaceholderText(elem);
      fireEvent.input(element, { target: { value: dataToPass[elem] } });
    });
    fireEvent.click(submitButton);
  });

  // An error should be displayed if confirm password and password fields do not match
  expect(await findByText(/Passwords do not/i)).toBeInTheDocument();
});

test('Login tests', () => {
  const utils = renderWithContext();

  // Arrange
  const { getAllByText, getByText } = utils;
  const switchText = getByText(/already a member/i);

  fireEvent.click(switchText);

  // Form state should become login
  expect(getByText(/not a member/i)).toBeInTheDocument();
  expect(getAllByText(/log in/i)).toHaveLength(2);
});

describe('Invalid input tests', () => {
  beforeEach(() => fetch.resetMocks());

  test('Log in', async () => {
    fetch.mockResponses(
      ['User may not exist', { status: 400 }],
      ['Invalid password', { status: 400 }]
    );
    const utils = renderWithContext();

    // Change to login form state
    const switchText = await screen.findByText(/already a mem/i);
    fireEvent.click(switchText);

    const { findByRole, findAllByTestId, getByPlaceholderText, findByText } = utils;
    const { queryAllByTestId, findByTestId } = utils;
    const submitButton = await findByRole('button');

    fireEvent.click(submitButton);

    // To make sure the fields validate on submission
    expect(await findAllByTestId('invalid-input-error')).toHaveLength(2);

    const invalidDataToPass = {
      Email: 'dedede@gmail.com',
      Password: '123',
    };

    for await (let i of [0, 1]) {
      await act(async () => {
        Object.keys(invalidDataToPass).forEach(placeHolderText => {
          const inputField = getByPlaceholderText(placeHolderText);
          fireEvent.focus(inputField);
          fireEvent.input(inputField, { target: { value: invalidDataToPass[placeHolderText] } });
          fireEvent.blur(inputField);
        });
      });

      // Errors should leave on valid input
      expect(queryAllByTestId('invalid-input-error')).toHaveLength(0);

      fireEvent.click(submitButton);
      // Loading indicator should be displayed
      expect(await findByTestId('loader')).toBeInTheDocument();

      if (i === 0) {
        expect(await findByText(/did not belong/i)).toBeInTheDocument();
        expect(await findAllByTestId('invalid-input-error')).toHaveLength(1);
      } else {
        expect(await findByText(/Password was/i)).toBeInTheDocument();
        expect(await findAllByTestId('invalid-input-error')).toHaveLength(1);
      }
    }
  });

  test('Sign Up', async () => {
    fetch.mockRejectOnce('User may already exist', { status: 400 });
    const utils = renderWithContext();

    const { findByRole, findAllByTestId, getByPlaceholderText, findByText } = utils;
    const { queryAllByTestId, findByTestId } = utils;
    const submitButton = await findByRole('button');

    const invalidDataToPass = {
      Username: 'britt',
      Email: 'britt@gmail.com',
      Password: 'IAmBritt@20032020',
      'Street Address': '545 W. Ann St.Matthews, NC 28104',
      'Confirm Password': 'IAmBritt@20032020',
    };

    await act(async () => {
      Object.keys(invalidDataToPass).forEach(placeHolderText => {
        const inputField = getByPlaceholderText(placeHolderText);
        fireEvent.focus(inputField);
        fireEvent.input(inputField, { target: { value: invalidDataToPass[placeHolderText] } });
        fireEvent.blur(inputField);
      });
    });

    // Errors should leave on valid input
    expect(queryAllByTestId('invalid-input-error')).toHaveLength(0);

    fireEvent.click(submitButton);
    // Loading indicator should be displayed
    expect(await findByTestId('loader')).toBeInTheDocument();

    expect(await findByText(/provide another email/i)).toBeInTheDocument();
    expect(await findAllByTestId('invalid-input-error')).toHaveLength(1);
  });
});
