import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from 'react-query';
import i18next from 'i18next';
import App from './App';
import globalEn from './translations/en/global.json';
import globalUa from './translations/ua/global.json';
import store from './store';
import reportWebVitals from './reportWebVitals';
import './index.css';

i18next.init({
  interpolation: { escapeValue: true },
  lng: localStorage.getItem('language') ?? 'en',
  resources: {
    en: {
      global: globalEn,
    },
    ua: {
      global: globalUa,
    },
  },
});

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18next}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </I18nextProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
