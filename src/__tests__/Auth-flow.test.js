import React from 'react';
import Authenticate from '../components/Auth';

import { cleanup, fireEvent, act, waitForElementToBeRemoved } from '@testing-library/react';

afterAll(cleanup);

beforeEach(() => {
  fetch.resetMocks();
});

const authUserMock = jest.fn(() => null);

function renderAuthComp() {
  return renderWithProviders(<Authenticate authUser={authUserMock} />, {
    contextValue: { activeUser: null, authenticated: false },
  });
}

test('Should allow user to sign up', async () => {
  fetch.mockResponse(JSON.stringify(formatFetchResponse(testAccessToken)), { status: 200 });
  const utils = renderAuthComp();

  const { findByTestId, getByPlaceholderText, findByRole } = utils;
  const submitButton = await findByRole('button');

  const dataToEnter = {
    Username: 'britt',
    Email: 'britt@gmail.com',
    Password: 'IAmBritt@20032020',
    'Confirm Password': 'IAmBritt@20032020',
    'Street Address': '545 W. Ann St.Matthews, NC 28104',
  };

  await act(async () => {
    Object.keys(dataToEnter).forEach(placeHolderText => {
      const element = getByPlaceholderText(placeHolderText);
      fireEvent.input(element, { target: { value: dataToEnter[placeHolderText] } });
      expect(element).toHaveValue(dataToEnter[placeHolderText]);
    });

    fireEvent.click(submitButton);
  });

  expect(await findByTestId('loader')).toBeInTheDocument();
  expect(authUserMock).toHaveBeenCalled();

  expect(location.pathname).toEqual('/');
});

test('Should allow user to log in', async () => {
  fetch.mockResponse(JSON.stringify(formatFetchResponse(testAccessToken)), { status: 200 });
  const utils = renderAuthComp();

  const { findByTestId, getByPlaceholderText, findByRole, findAllByText, findByText } = utils;
  const switchText = await findByText(/already a member/i);

  fireEvent.click(switchText);
  await waitForElementToBeRemoved(() => getByPlaceholderText('Confirm Password'));

  expect(await findAllByText(/log in/i)).toHaveLength(2);

  const submitButton = await findByRole('button');

  const dataToEnter = {
    Email: 'britt@gmail.com',
    Password: 'IAmBritt@20032020',
  };

  await act(async () => {
    Object.keys(dataToEnter).forEach(placeHolderText => {
      const element = getByPlaceholderText(placeHolderText);
      fireEvent.input(element, { target: { value: dataToEnter[placeHolderText] } });
      expect(element).toHaveValue(dataToEnter[placeHolderText]);
    });
    fireEvent.click(submitButton);
  });

  expect(await findByTestId('loader')).toBeInTheDocument();

  expect(authUserMock).toHaveBeenCalled();

  expect(location.pathname).toEqual('/');
});
