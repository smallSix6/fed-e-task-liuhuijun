import React from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {updateName, updateTel} from './action'
export default ()=>{
  const formData = useSelector(state => {
    console.log(state)
    return state.form
  })
  const dispatch = useDispatch()
  return (
    <div>
      form: <br />
      姓名： <input type='text' onChange={e=>{dispatch(updateName(e.target.value))}} /><br />
      电话： <input type='tel' onChange={e=>{dispatch(updateTel(e.target.value))}} /><br />
    </div>
  )
}


