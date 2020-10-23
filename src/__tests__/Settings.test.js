import React from 'react';
import Settings from '../components/Settings';

import userEvent from '@testing-library/user-event';
import { render, cleanup, act, screen, fireEvent } from '@testing-library/react';

afterAll(cleanup);

beforeEach(() => {
  jest.useFakeTimers();
  fetch.once(JSON.stringify(formatFetchResponse({})), { status: 200 });
});

afterEach(() => {
  jest.runOnlyPendingTimers();
});

const updateProfileInputPlaceholders = ['New username', 'New email', 'Street Address'];
const updatePasswordInputPlaceholders = ['Old password', 'New password', 'Confirm new password'];

test.skip('should make sure user can cycle between forms on', () => {
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

describe('Invalid input tests', () => {
  test("should show appropriate error message on invalid 'update profile' input", async () => {
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
});

describe.skip('server error tests', () => {});
