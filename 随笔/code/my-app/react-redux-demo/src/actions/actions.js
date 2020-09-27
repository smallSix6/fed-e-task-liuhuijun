import {ADD,SQUARE} from '../constance/ActionTypes'

// const addOne = {
//   type: ADD,
//   num: 1
// }
// const addTwo = {
//   type: ADD,
//   num: 2
// }
// const square = {
//   type: SQUARE
// }
const addAction = (num) => {
  return {
    type: ADD,
    num
  }
}
const squareAction = () => {
  return {
    type: SQUARE
  }
}
const getAction= () => {
  return (dispatch, state) => {
    fetch('./data.json').then(res=>res.json()).then(res => {
      dispatch({
        type: 'GET',
        num: Number(res[2]) 
      })
    })
  }
}

export {
  addAction,
  squareAction,
  getAction
}