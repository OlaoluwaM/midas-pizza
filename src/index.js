import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

import { RecoilRoot } from 'recoil';
import { BrowserRouter as Router } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.min.css';
import './index.scss';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <RecoilRoot>
        <App />
      </RecoilRoot>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
