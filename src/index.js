import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

import { RecoilRoot } from 'recoil';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.min.css';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <RecoilRoot>
        <>
          <ToastContainer hideProgressBar position="bottom-right" pauseOnFocusLoss={true} />
          <App />
        </>
      </RecoilRoot>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
