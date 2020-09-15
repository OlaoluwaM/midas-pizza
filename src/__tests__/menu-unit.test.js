import React from 'react';
import Menu from '../components/Menu';

import { cleanup, fireEvent, act, within } from '@testing-library/react';

afterAll(cleanup);

beforeAll(() => {
  fetch.mockResponse(JSON.stringify(formatFetchResponse(menu)), { status: 200 });
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

  // test('Should load items from localStorage if previously stored', async () => {
  //   const store = {
  //     currentAccessToken: testAccessToken,
  //     menu: Object.entries(menu),
  //   };
  //   window.localStorage.getItem = jest.fn(key => JSON.stringify(store[key]));

  //   let utils;

  //   await act(async () => {
  //     utils = renderWithProviders(<Menu />, {contextValue: menuContext});
  //   });

  //   expect(localStorage.getItem).toHaveBeenCalledWith('menu');

  //   const { findAllByTestId } = utils;
  //   const menuItems = await findAllByTestId('menu-item');

  //   expect(menuItems.length).toBeGreaterThan(1);
  // });
});

test('Filter Functionality', async () => {
  jest.useFakeTimers();

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
