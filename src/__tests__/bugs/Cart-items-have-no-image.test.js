import React from 'react';
import App from '../../components/App';

import { RecoilRoot } from 'recoil';
import { MemoryRouter } from 'react-router-dom';
import { render, cleanup, act, within } from '@testing-library/react';

afterAll(cleanup);

function renderApp() {
  return render(
    <MemoryRouter initialEntries={['/', '/cart']} initialIndex={1}>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </MemoryRouter>
  );
}

beforeEach(() => {
  window.localStorage.getItem = jest.fn(key =>
    key === 'currentAccessToken' ? JSON.stringify(testAccessToken) : null
  );
});

test('If cart items display their images even if user does not go to menu first', async () => {
  const initialCartWithPhotoIds = Object.fromEntries(
    Object.entries(initialUserCart).map(itm => {
      if (typeof itm[1] === 'object') itm[1]['photoId'] = menuPhotoIdObject[itm[0]];
      return itm;
    })
  );

  const dataFromServer = { ...menuContext.userData, cart: initialCartWithPhotoIds };

  fetch
    .once(JSON.stringify(formatFetchResponse(menuContext.userData)), { status: 200 })
    .once(JSON.stringify(formatFetchResponse(dataFromServer)), { status: 200 })
    .once(JSON.stringify(formatFetchResponse('response')), { status: 200 })
    .once(JSON.stringify(formatFetchResponse('response')), { status: 200 });

  let utils;

  // Render App
  await act(async () => {
    utils = renderApp();
  });

  const { findAllByTestId } = utils;

  const orderItems = await findAllByTestId('order-item');

  for await (let orderItem of orderItems) {
    const itemImage = await within(orderItem).findByRole('img');
    expect(itemImage).toHaveAttribute('src', expect.not.stringContaining('undefined'));
  }
});
