/* eslint-disable no-undef */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './redux/reducers/reducer';
import { StateLoader } from './StateLoader';

const stateLoader = new StateLoader();
let store = createStore(reducers, stateLoader.loadState());

store.subscribe(() => {
  stateLoader.saveState(store.getState());
})

// @ts-ignore
it('renders without crashing', () => {
  // eslint-disable-next-line no-undef
  const div = document.createElement('div');
  // eslint-disable-next-line react/jsx-filename-extension
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>
    , div);
  ReactDOM.unmountComponentAtNode(div);
});
