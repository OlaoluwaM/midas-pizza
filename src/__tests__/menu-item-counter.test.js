import Menu from '../components/Menu';

import { render, cleanup, fireEvent, act, within } from '@testing-library/react';

afterAll(cleanup);

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
