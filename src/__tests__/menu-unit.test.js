import Menu from '../components/Menu';

import { render, cleanup, fireEvent, act, within } from '@testing-library/react';

afterAll(cleanup);
window.localStorage.getItem = jest.fn(() => JSON.stringify(testAccessToken));

function renderWithContext() {
  const context = {
    userData: {
      name: 'Joey Anderman',
      streetAddress: '9165 Littleton Ave. Patchogue, NY 11772',
      email: 'joey@gmail.com',
    },
    authenticated: true,
  };

  return render(contextWrapper(Menu, context));
}

test('Loads menu items', async () => {
  fetch.once(JSON.stringify(menu), { status: 200 });
  let utils;

  await act(async () => {
    utils = renderWithContext();
  });

  const { findAllByTestId } = utils;
  const menuItems = await findAllByTestId('menu-item');

  expect(menuItems.length).toBeGreaterThan(1);
});

test('Filter Functionality', async () => {
  jest.useFakeTimers();
  fetch.once(() => new Promise(res => setTimeout(() => res(JSON.stringify(menu)), 2000)), {
    status: 200,
  });

  let utils;

  await act(async () => {
    utils = renderWithContext();
  });

  const { findAllByTestId, findAllByRole, findByTestId } = utils;

  const loader = await findByTestId('loader');

  expect(loader).toBeInTheDocument();
  const filterButtonTypes = await findAllByRole('button');
  await act(async () => jest.advanceTimersByTime(2000));

  for await (let button of filterButtonTypes) {
    const attribute = within(button).getByTestId('food-name').textContent;
    const attributeText = attribute.substring(0, attribute.lastIndexOf('s'));

    if (attributeText !== 'Pizza') {
      fireEvent.click(button);
    }

    expect(button).toHaveClass('active-filter');

    const menuItems = await findAllByTestId('menu-item');

    for await (let menuItem of menuItems) {
      expect(menuItem).toHaveAttribute('data-food-type', attributeText);
    }
  }
});
