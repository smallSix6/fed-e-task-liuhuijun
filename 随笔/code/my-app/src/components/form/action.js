export const TYPES = {
  UPDATE_NAME: 'UPDATE_NAME',
  UPDATE_TEL: 'UPDATE_TEL'
}
export const updateTel = tel => ({
  type: TYPES.UPDATE_TEL,
  payload: {tel}
})
export const updateName = name => ({
  type: TYPES.UPDATE_NAME,
  payload: {name}
})
