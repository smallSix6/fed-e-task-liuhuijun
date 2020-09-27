import {createStore, applyMiddleware} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import reducer from './reducer'
export default ()=>{
  const middlewares = [thunk]
  const enhancers = applyMiddleware(...middlewares)
  const composedEnhancers = composeWithDevTools(...[enhancers])
  const store = createStore(reducer,composedEnhancers)
  return store
}