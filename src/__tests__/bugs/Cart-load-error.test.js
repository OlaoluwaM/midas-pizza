import React from 'react';
import App from '../../components/App';

import { RecoilRoot } from 'recoil';
import { MemoryRouter } from 'react-router-dom';
import { render, cleanup, act, screen } from '@testing-library/react';

afterEach(cleanup);

test.skip("Should check if user's cart is persisted on login", async () => {
  fetch
    .once(JSON.stringify(formatFetchResponse('response token expired')), { status: 400 })
    .once(JSON.stringify(formatFetchResponse(testAccessToken)), { status: 200 });

  let utils;

  await act(async () => {
    utils = render(
      <MemoryRouter initialEntries={['/authenticate', '/']}>
        <RecoilRoot>
          <App />
        </RecoilRoot>
      </MemoryRouter>
    );
  });

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
});
