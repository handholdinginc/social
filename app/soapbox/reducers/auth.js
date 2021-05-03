import {
  AUTH_APP_CREATED,
  AUTH_LOGGED_IN,
  AUTH_APP_AUTHORIZED,
  AUTH_LOGGED_OUT,
  SWITCH_ACCOUNT,
  VERIFY_CREDENTIALS_SUCCESS,
  VERIFY_CREDENTIALS_FAIL,
} from '../actions/auth';
import { Map as ImmutableMap, fromJS } from 'immutable';

const defaultState = ImmutableMap({
  app: ImmutableMap(),
  users: ImmutableMap(),
  tokens: ImmutableMap(),
  me: null,
});

const getSessionUser = () => {
  const id = sessionStorage.getItem('soapbox:auth:me');
  if (id && typeof id === 'string' && id !== 'null' && id !== 'undefined') {
    return id;
  } else {
    return undefined;
  }
};

const sessionUser = getSessionUser();
const localState = fromJS(JSON.parse(localStorage.getItem('soapbox:auth')));

// If `me` doesn't match an existing user, attempt to shift it.
const maybeShiftMe = state => {
  const users = state.get('users', ImmutableMap());
  const me = state.get('me');

  if (!users.get(me)) {
    return state.set('me', users.first(ImmutableMap()).get('id', null));
  } else {
    return state;
  }
};

const setSessionUser = state => state.update('me', null, me => sessionUser || me);

// Upgrade the initial state
const migrateLegacy = state => {
  if (localState) return state;
  return state.withMutations(state => {
    const app = fromJS(JSON.parse(localStorage.getItem('soapbox:auth:app')));
    const user = fromJS(JSON.parse(localStorage.getItem('soapbox:auth:user')));
    if (!user) return;
    state.set('me', '_legacy'); // Placeholder account ID
    state.set('app', app);
    state.set('tokens', ImmutableMap({
      [user.get('access_token')]: user.set('account', '_legacy'),
    }));
    state.set('users', ImmutableMap({
      '_legacy': ImmutableMap({
        id: '_legacy',
        access_token: user.get('access_token'),
      }),
    }));
  });
};

const persistAuth = state => localStorage.setItem('soapbox:auth', JSON.stringify(state.toJS()));

const persistSession = state => {
  const me = state.get('me');
  if (me && typeof me === 'string') {
    sessionStorage.setItem('soapbox:auth:me', me);
  }
};

const persistState = state => {
  persistAuth(state);
  persistSession(state);
};

const initialize = state => {
  return state.withMutations(state => {
    maybeShiftMe(state);
    setSessionUser(state);
    migrateLegacy(state);
    persistState(state);
  });
};

const initialState = initialize(defaultState.merge(localState));

const importToken = (state, token) => {
  return state.setIn(['tokens', token.access_token], fromJS(token));
};

// Upgrade the `_legacy` placeholder ID with a real account
const upgradeLegacyId = (state, account) => {
  if (localState) return state;
  return state.withMutations(state => {
    state.update('me', null, me => me === '_legacy' ? account.id : me);
    state.deleteIn(['users', '_legacy']);
  });
  // TODO: Delete `soapbox:auth:app` and `soapbox:auth:user` localStorage?
  // By this point it's probably safe, but we'll leave it just in case.
};

// Returns a predicate function for filtering a mismatched user/token
const userMismatch = (token, account) => {
  return (user, id) => {
    const sameToken = user.get('access_token') === token;
    const differentId = id !== account.id || user.get('id') !== account.id;

    return sameToken && differentId;
  };
};

const importCredentials = (state, token, account) => {
  return state.withMutations(state => {
    state.setIn(['users', account.id], ImmutableMap({
      id: account.id,
      access_token: token,
    }));
    state.setIn(['tokens', token, 'account'], account.id);
    state.update('users', ImmutableMap(), users => users.filterNot(userMismatch(token, account)));
    state.update('me', null, me => me || account.id);
    upgradeLegacyId(state, account);
  });
};

const deleteToken = (state, token) => {
  return state.withMutations(state => {
    state.update('tokens', ImmutableMap(), tokens => tokens.delete(token));
    state.update('users', ImmutableMap(), users => users.filterNot(user => user.get('access_token') === token));
    maybeShiftMe(state);
  });
};

const deleteUser = (state, accountId) => {
  return state.withMutations(state => {
    state.update('users', ImmutableMap(), users => users.delete(accountId));
    state.update('tokens', ImmutableMap(), tokens => tokens.filterNot(token => token.get('account') === accountId));
    maybeShiftMe(state);
  });
};

const reducer = (state, action) => {
  switch(action.type) {
  case AUTH_APP_CREATED:
    return state.set('app', fromJS(action.app));
  case AUTH_APP_AUTHORIZED:
    return state.update('app', ImmutableMap(), app => app.merge(fromJS(action.app)));
  case AUTH_LOGGED_IN:
    return importToken(state, action.token);
  case AUTH_LOGGED_OUT:
    return deleteUser(state, action.accountId);
  case VERIFY_CREDENTIALS_SUCCESS:
    return importCredentials(state, action.token, action.account);
  case VERIFY_CREDENTIALS_FAIL:
    return deleteToken(state, action.token);
  case SWITCH_ACCOUNT:
    return state.set('me', action.accountId);
  default:
    return state;
  }
};

const reload = () => location.replace('/');

// `me` is a user ID string
const validMe = state => {
  const me = state.get('me');
  return typeof me === 'string' && me !== '_legacy';
};

// `me` has changed from one valid ID to another
const userSwitched = (oldState, state) => {
  const stillValid = validMe(oldState) && validMe(state);
  const didChange = oldState.get('me') !== state.get('me');

  return stillValid && didChange;
};

const maybeReload = (oldState, state, action) => {
  if (userSwitched(oldState, state)) {
    reload(state);
  }
};

export default function auth(oldState = initialState, action) {
  const state = reducer(oldState, action);

  if (!state.equals(oldState)) {
    // Persist the state in localStorage
    persistAuth(state);

    // When middle-clicking a profile, we want to save the
    // user in localStorage, but not update the reducer
    if (action.background === true) {
      return oldState;
    }

    // Persist the session
    persistSession(state);

    // Reload the page under some conditions
    maybeReload(oldState, state, action);
  }

  return state;
};
