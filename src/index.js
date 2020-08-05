import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import firebase from '~/services/firebase';

import '~/assets/css/index.css';

ReactDOM.render(
  <React.StrictMode>
    <App firebase={firebase} />
  </React.StrictMode>,
  document.getElementById('root')
);
