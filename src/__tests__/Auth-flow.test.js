import React from 'react';
import Authenticate from '../components/Auth';

import { ThemeProvider } from 'styled-components';
import { themeObj, UserSessionContext } from '../components/context/context';
import { render, cleanup, fireEvent, act } from '@testing-library/react';

afterAll(cleanup);

const authUserMock = jest.fn();

function renderAuthComp() {
  return render(
    <ThemeProvider theme={themeObj}>
      <UserSessionContext.Provider value={{ activeUser: null, authenticated: false }}>
        <Authenticate authUser={authUserMock} />
      </UserSessionContext.Provider>
    </ThemeProvider>
  );
}

fetch.mockResponse(JSON.stringify(formatFetchResponse(testAccessToken)), { status: 200 });

test('Should allow user to sign up', async () => {
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
    });
    fireEvent.click(submitButton);
  });

  expect(await findByTestId('loader')).toBeInTheDocument();
  expect(authUserMock).toHaveBeenCalled();

  expect(location.pathname).toEqual('/');
});

test('Should allow user to log in', async () => {
  const utils = renderAuthComp();

  const { findByTestId, getByPlaceholderText, findByRole, findAllByText, findByText } = utils;
  const submitButton = await findByRole('button');
  const switchText = await findByText(/already a member/i);

  fireEvent.click(switchText);
  expect(await findAllByText(/log in/i)).toHaveLength(2);

  const dataToEnter = {
    Email: 'britt@gmail.com',
    Password: 'IAmBritt@20032020',
  };

  await act(async () => {
    Object.keys(dataToEnter).forEach(placeHolderText => {
      const element = getByPlaceholderText(placeHolderText);
      fireEvent.input(element, { target: { value: dataToEnter[placeHolderText] } });
    });
    fireEvent.click(submitButton);
  });

  expect(await findByTestId('loader')).toBeInTheDocument();

  expect(authUserMock).toHaveBeenCalled();

  expect(location.pathname).toEqual('/');
});
