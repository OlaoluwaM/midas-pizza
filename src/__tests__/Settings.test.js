import React from 'react';
import Settings from '../components/Settings';

import userEvent from '@testing-library/user-event';
import { cleanup, act, screen, fireEvent } from '@testing-library/react';

afterAll(cleanup);

beforeEach(() => {
  jest.useFakeTimers();
  fetch.resetMocks();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
});

const updateProfileInputPlaceholders = ['New username', 'New email', 'Street Address'];
const updatePasswordInputPlaceholders = ['Old password', 'New password', 'Confirm new password'];

window.localStorage.getItem = jest.fn(() => JSON.stringify(testAccessToken));

test('should make sure user can cycle between forms on', () => {
  const { getByText, getByRole, getByPlaceholderText } = renderWithProviders(<Settings />, {
    contextValue: menuContext,
  });
  const { userData } = menuContext;
  const defaultValuesArray = [userData.name, userData.email, userData.streetAddress];

  // Should default to 'update profile form'
  expect(getByRole('heading')).toHaveTextContent(/profile/i);

  // Check if correct fields are displayed
  updateProfileInputPlaceholders.forEach((placeHolderText, ind) => {
    const inputField = getByPlaceholderText(placeHolderText);
    expect(inputField).toBeInTheDocument();

    // Inputs should be filled with user defaults
    expect(inputField).toHaveValue(defaultValuesArray[ind]);
  });

  // Switch to 'change password' field
  fireEvent.click(getByText(/change password/i));

  // Form to change password should be rendered
  expect(getByRole('heading')).toHaveTextContent(/password/i);

  // Check if correct fields are displayed
  updatePasswordInputPlaceholders.forEach(placeHolderText => {
    expect(getByPlaceholderText(placeHolderText)).toBeInTheDocument();
  });
});

describe('Invalid input error tests', () => {
  test("should show appropriate error message on invalid input for 'update profile' form", async () => {
    const { getByRole, getByPlaceholderText, findAllByTestId } = renderWithProviders(<Settings />, {
      contextValue: menuContext,
    });
    const saveChangesButton = getByRole('button');

    await act(async () => {
      fireEvent.click(saveChangesButton);
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(getByRole('alert')).toBeInTheDocument();

    updateProfileInputPlaceholders.forEach(placeHolderText => {
      userEvent.clear(getByPlaceholderText(placeHolderText));
    });

    await act(async () => {
      fireEvent.click(saveChangesButton);
    });

    expect(await findAllByTestId(/invalid-input-error/)).toHaveLength(3);
    expect(saveChangesButton).toBeDisabled();
  });

  test.each([
    [
      'old and new password are the same',
      ['passwordSignIn', 'newPassword'],
      ['Olaoluwa@123', 'Olaoluwa@123', 'Olaoluwa@123'],
    ],
    [
      'new password and confirm password value are not equal',
      ['confirmPassword'],
      ['Olaoluwa@123', 'Olaoluwa@123', '123'],
    ],
    [
      'old password is incorrect',
      ['passwordSignIn'],
      { 0: 'Olaoluwa@123', 1: 'Olaoluwa@123', 2: 'Olaoluwa@123', shouldFetch: 1 },
    ],
  ])(
    'should show appropriate error message when %s',
    async (_, invalidFieldNames, invalidDataObj) => {
      if (!!invalidDataObj?.shouldFetch) {
        fetch.mockRejectOnce({ text: async () => 'password incorrect' });
      }

      const utils = renderWithProviders(<Settings />, {
        contextValue: menuContext,
      });

      const { getByText, getByRole, getByTestId, getByPlaceholderText } = utils;

      fireEvent.click(getByText(/change password/i));
      const saveChangesButton = getByRole('button');

      await act(async () => {
        updatePasswordInputPlaceholders.forEach((placeholderText, ind) => {
          const inputField = getByPlaceholderText(placeholderText);
          fireEvent.input(inputField, { target: { value: invalidDataObj[ind] } });
        });

        fireEvent.click(saveChangesButton);
      });

      invalidFieldNames.forEach(fieldName =>
        expect(getByTestId(`invalid-input-error-${fieldName}`)).toBeInTheDocument()
      );

      expect(saveChangesButton).toBeDisabled();
    }
  );
});

test("'Profile form': should display input error when updated email belongs to another user on server", async () => {
  // Mock server error
  fetch.mockRejectOnce({ text: async () => 'user already exists', status: 500 });

  // Arrange
  const { getByPlaceholderText, getByRole, findByRole, findByTestId } = renderWithProviders(
    <Settings />,
    {
      contextValue: menuContext,
    }
  );

  const saveChangesButton = getByRole('button');
  const requiredPlaceHolder = updateProfileInputPlaceholders[1];

  // Act: input data in form
  await act(async () => {
    fireEvent.input(getByPlaceholderText(requiredPlaceHolder), {
      target: { value: 'testbot@gmail.com' },
    });

    fireEvent.click(saveChangesButton);
  });

  // Assert
  expect(await findByTestId('loader')).toBeInTheDocument();
  expect(await findByRole('alert')).toBeInTheDocument();
  expect(await findByTestId('invalid-input-error-email')).toBeInTheDocument();
});
