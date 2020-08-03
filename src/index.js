import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { database } from '~/services/firebase';

import '~/assets/css/index.css';

ReactDOM.render(
  <React.StrictMode>
    <App firebaseDB={database} />
  </React.StrictMode>,
  document.getElementById('root')
);
