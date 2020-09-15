import {SET_PHONE, SET_USER} from "@/constants/user";

const INITIAL_STATE = {

}

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        ...action.state
      }
    case SET_PHONE:
      return {
        ...state,
        phone: action.state
      }
    default:
      return state
  }
}
