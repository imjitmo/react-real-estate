import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App.jsx';
import { persistor, store } from './app/store.js';
import './assets/css/index.css';
import Footer from './components/Footer.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <div className="min-h-screen">
        <App />
      </div>
      <Footer />
    </PersistGate>
  </Provider>
);
