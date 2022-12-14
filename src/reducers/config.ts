import { Action } from './models'
import {
  SET_CREDENTIALS,
  SET_PHONE_CONFIG,
  SET_APP_CONFIG,
  STRICT_MODE_SHOW_CALL_BUTTON,
  STRICT_MODE_HIDE_CALL_BUTTON
} from '../actions/config'
const config = (
  state = {
    uri: '',
    password: '',
    phoneConfig: { mode: '', started: false }
  },
  action: Action
) => {
  switch (action.type) {
    case SET_PHONE_CONFIG:
      return {
        ...state,
        phoneConfig: action.payload
      }
    case SET_CREDENTIALS:
      return {
        ...state,
        uri: action.payload.uri,
        password: action.payload.password
      }
    case SET_APP_CONFIG:
      return {
        ...state,
        appConfig: action.payload
      }
    case STRICT_MODE_SHOW_CALL_BUTTON:
      if (state.phoneConfig.mode === 'strict') {
        return {
          ...state,
          phoneConfig: {
            ...state.phoneConfig,
            mode: 'strict',
            started: true
          }
        }
      }
    case STRICT_MODE_HIDE_CALL_BUTTON:
      if (state.phoneConfig.mode === 'strict') {
        return {
          ...state,
          phoneConfig: {
            ...state.phoneConfig,
            mode: 'strict',
            started: false
          }
        }
      }
    default:
      return state
  }
}
export default config
