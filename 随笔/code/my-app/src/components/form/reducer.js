import reducerCreator from '../../utils/redux'
import {TYPES} from './action'
const initialState = {
  tel: '',
  name: ''
}
export default reducerCreator(TYPES,initialState)