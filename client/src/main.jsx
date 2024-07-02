import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { store,persistor } from './redux/store.js';
import { Provider } from 'react-redux';
import ThemeProvider from './components/ThemeProvider.jsx';
//PersistGate:Delays the rendering of the app's UI until the persisted state has been retrieved and saved to Redux.
import { PersistGate } from 'redux-persist/integration/react';
ReactDOM.createRoot(document.getElementById('root')).render(
  <PersistGate persistor={persistor}>
    <Provider store={store}>
    <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </PersistGate>
);