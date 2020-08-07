import React from 'react';
import Home from '../components/Home';

import { render } from '@testing-library/react';
import { themeObj } from '../components/context/context';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

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
