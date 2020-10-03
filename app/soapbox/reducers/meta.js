'use strict';

import { ME_FETCH_SUCCESS, ME_PATCH_SUCCESS } from 'soapbox/actions/me';
import { Map as ImmutableMap, fromJS } from 'immutable';

const initialState = ImmutableMap();

export default function meta(state = initialState, action) {
  switch(action.type) {
  case ME_FETCH_SUCCESS:
  case ME_PATCH_SUCCESS:
    const me = fromJS(action.me);
    if (me.has('pleroma')) {
      const pleroPrefs = me.get('pleroma').delete('settings_store');
      return state.mergeIn(['pleroma'], pleroPrefs);
    }
    return state;
  default:
    return state;
  }
};
