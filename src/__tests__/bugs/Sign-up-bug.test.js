import React from 'react';
import Authenticate from '../../components/Auth';

import { ThemeProvider } from 'styled-components';
import { themeObj, UserSessionContext } from '../../components/context/context';
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

test('Should check if the bug that invalidates user sign up still persists', async () => {
  const utils = renderAuthComp();

  const { getByPlaceholderText, findByRole } = utils;
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

  expect(window.localStorage.setItem).toBeCalledWith(
    'currentAccessToken',
    JSON.stringify(testAccessToken)
  );
});
