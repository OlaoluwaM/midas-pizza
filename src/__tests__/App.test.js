import React from 'react';
import Home from '../components/Home';

import { themeObj } from '../components/context/context';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { render, cleanup, fireEvent, screen } from '@testing-library/react';

test('Home page test', () => {
  const { getByRole } = render(
    <ThemeProvider theme={themeObj}>
      <Home />
    </ThemeProvider>,
    { wrapper: MemoryRouter }
  );

  const button = getByRole('link');
  expect(button).toBeInTheDocument();
  expect(button).toHaveTextContent(/sign up/i);
});
