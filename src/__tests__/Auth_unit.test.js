import React from 'react';
import App from '../components/App';

import { themeObj } from '../components/context/context';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { render, cleanup, fireEvent, screen } from '@testing-library/react';

// TODO test form state
// TODO test error handling
// TODO test loading

afterAll(cleanup);
