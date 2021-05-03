import {
  SEARCH_CHANGE,
  SEARCH_CLEAR,
  SEARCH_FETCH_REQUEST,
  SEARCH_FETCH_SUCCESS,
  SEARCH_SHOW,
} from '../actions/search';
import {
  COMPOSE_MENTION,
  COMPOSE_REPLY,
  COMPOSE_DIRECT,
} from '../actions/compose';
import { Map as ImmutableMap, List as ImmutableList, fromJS } from 'immutable';

const initialState = ImmutableMap({
  value: '',
  submitted: false,
  hidden: false,
  results: ImmutableMap(),
});

export default function search(state = initialState, action) {
  switch(action.type) {
  case SEARCH_CHANGE:
    return state.withMutations(map => {
      map.set('value', action.value);
      map.set('submitted', false);
    });
  case SEARCH_CLEAR:
    return state.withMutations(map => {
      map.set('value', '');
      map.set('results', ImmutableMap());
      map.set('submitted', false);
      map.set('hidden', false);
    });
  case SEARCH_SHOW:
    return state.set('hidden', false);
  case COMPOSE_REPLY:
  case COMPOSE_MENTION:
  case COMPOSE_DIRECT:
    return state.set('hidden', true);
  case SEARCH_FETCH_REQUEST:
    return state.withMutations(map => {
      map.set('results', ImmutableMap());
      map.set('submitted', true);
    });
  case SEARCH_FETCH_SUCCESS:
    return state.set('results', ImmutableMap({
      accounts: ImmutableList(action.results.accounts.map(item => item.id)),
      statuses: ImmutableList(action.results.statuses.map(item => item.id)),
      hashtags: fromJS(action.results.hashtags),
    })).set('submitted', true);
  default:
    return state;
  }
};
