import {
  ME_FETCH_SUCCESS,
  ME_FETCH_FAIL,
  ME_FETCH_SKIP,
  ME_PATCH_SUCCESS,
} from '../actions/me';
import { AUTH_LOGGED_OUT } from '../actions/auth';

const initialState = null;

export default function me(state = initialState, action) {
  switch(action.type) {
  case ME_FETCH_SUCCESS:
  case ME_PATCH_SUCCESS:
    return action.me.id;
  case ME_FETCH_FAIL:
  case ME_FETCH_SKIP:
  case AUTH_LOGGED_OUT:
    localStorage.removeItem('soapbox:auth:user');
    return false;
  default:
    return state;
  }
};
