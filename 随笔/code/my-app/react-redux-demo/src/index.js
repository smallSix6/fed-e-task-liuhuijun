import React from 'react';
import ReactDOM from 'react-dom';
import Container from './components/Container'
import {Provider} from 'react-redux'
import * as serviceWorker from './serviceWorker';
import store from './store/store'


function App () {
  return (
    <Provider store={store}>
      <Container />
    </Provider>
  )
}

function render() {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
}
render()
store.subscribe(render)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
