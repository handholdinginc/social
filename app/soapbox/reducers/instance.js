import {
  INSTANCE_FETCH_SUCCESS,
  NODEINFO_FETCH_SUCCESS,
} from '../actions/instance';
import { Map as ImmutableMap, fromJS } from 'immutable';

const nodeinfoToInstance = nodeinfo => {
  // Match Pleroma's develop branch
  return ImmutableMap({
    pleroma: ImmutableMap({
      metadata: ImmutableMap({
        account_activation_required: nodeinfo.getIn(['metadata', 'accountActivationRequired']),
        features: nodeinfo.getIn(['metadata', 'features']),
        federation: nodeinfo.getIn(['metadata', 'federation']),
        fields_limits: ImmutableMap({
          max_fields: nodeinfo.getIn(['metadata', 'fieldsLimits', 'maxFields']),
        }),
      }),
    }),
  });
};

// Set Mastodon defaults, overridden by Pleroma servers
const initialState = ImmutableMap({
  max_toot_chars: 500,
  poll_limits: ImmutableMap({
    max_expiration: 2629746,
    max_option_chars: 25,
    max_options: 4,
    min_expiration: 300,
  }),
});

export default function instance(state = initialState, action) {
  switch(action.type) {
  case INSTANCE_FETCH_SUCCESS:
    return initialState.mergeDeep(fromJS(action.instance));
  case NODEINFO_FETCH_SUCCESS:
    return nodeinfoToInstance(fromJS(action.nodeinfo)).mergeDeep(state);
  default:
    return state;
  }
};
