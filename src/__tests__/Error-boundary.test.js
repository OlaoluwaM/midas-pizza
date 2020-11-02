import React from 'react';

import { ErrorPage } from '../components/ErrorPages';
import { MemoryRouter } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { ToastContainer } from 'react-toastify';
import { render, cleanup } from '@testing-library/react';

afterAll(cleanup);

beforeEach(() => {
  jest.useFakeTimers();
});

function ErrorComponent() {
  throw new Error('new error');
  return null;
}

test('Error Boundary', async () => {
  const utils = render(
    <>
      <ToastContainer />
      <ErrorBoundary FallbackComponent={ErrorPage}>
        <ErrorComponent />
      </ErrorBoundary>
    </>,
    { wrapper: MemoryRouter }
  );

  const { getByTitle, findByRole } = utils;

  expect(getByTitle('error-svg')).toBeInTheDocument();
  expect(await findByRole('alert')).toBeInTheDocument();

  expect(location.pathname).toBe('/');
});
