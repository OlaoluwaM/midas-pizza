import React from 'react';
import Menu from '../components/Menu';

import { cleanup, fireEvent, act, within, screen } from '@testing-library/react';

afterAll(cleanup);

fetch.mockResponse(JSON.stringify(formatFetchResponse(menu)), { status: 200 });

beforeEach(() => jest.useFakeTimers());
afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

window.localStorage.getItem = jest.fn(key => {
  if (key === 'menu') return;
  return JSON.stringify(testAccessToken);
});

describe('Initial load of menu items', () => {
  test('should load items from server if not yet stored in localStorage', async () => {
    let utils;

    await act(async () => {
      utils = renderWithProviders(<Menu />, { contextValue: menuContext });
    });

    const { findAllByTestId } = utils;
    const menuItems = await findAllByTestId('menu-item');

    expect(menuItems.length).toBeGreaterThan(1);
  });
});

test('Filter Functionality', async () => {
  let utils;

  await act(async () => {
    utils = renderWithProviders(<Menu />, { contextValue: menuContext });
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

test('Each menu item should have a unique image', async () => {
  fetch.once(JSON.stringify(formatFetchResponse(menuWithPhotoId)), { status: 200 });

  let utils;

  await act(async () => {
    utils = renderWithProviders(<Menu />, { contextValue: menuContext });
  });

  expect(window.sessionStorage.setItem).toBeCalledWith(
    'menuItemPhotoIds',
    JSON.stringify(menuPhotoIdObject)
  );

  const { findAllByTestId } = utils;

  const menuItems = await findAllByTestId('menu-item');

  for await (let menuItem of menuItems) {
    const image = await within(menuItem).findByRole('img');
    const { innerHTML: itemName } = await within(menuItem).findByTestId('menu-item-name');

    expect(image).toHaveAttribute('src', expect.stringContaining(menuPhotoIdObject[itemName]));
  }
});
