import api from '../api';
import { showAlert } from 'soapbox/actions/alerts';

export const FILTERS_FETCH_REQUEST = 'FILTERS_FETCH_REQUEST';
export const FILTERS_FETCH_SUCCESS = 'FILTERS_FETCH_SUCCESS';
export const FILTERS_FETCH_FAIL    = 'FILTERS_FETCH_FAIL';

export const FILTERS_CREATE_REQUEST = 'FILTERS_CREATE_REQUEST';
export const FILTERS_CREATE_SUCCESS = 'FILTERS_CREATE_SUCCESS';
export const FILTERS_CREATE_FAIL    = 'FILTERS_CREATE_FAIL';

export const FILTERS_DELETE_REQUEST = 'FILTERS_DELETE_REQUEST';
export const FILTERS_DELETE_SUCCESS = 'FILTERS_DELETE_SUCCESS';
export const FILTERS_DELETE_FAIL    = 'FILTERS_DELETE_FAIL';

export const fetchFilters = () => (dispatch, getState) => {
  if (!getState().get('me')) return;

  dispatch({
    type: FILTERS_FETCH_REQUEST,
    skipLoading: true,
  });

  api(getState)
    .get('/api/v1/filters')
    .then(({ data }) => dispatch({
      type: FILTERS_FETCH_SUCCESS,
      filters: data,
      skipLoading: true,
    }))
    .catch(err => dispatch({
      type: FILTERS_FETCH_FAIL,
      err,
      skipLoading: true,
      skipAlert: true,
    }));
};

export function createFilter(phrase, expires_at, context, whole_word, irreversible) {
  return (dispatch, getState) => {
    dispatch({ type: FILTERS_CREATE_REQUEST });
    return api(getState).post('/api/v1/filters', {
      phrase,
      context,
      irreversible,
      whole_word,
      expires_at,
    }).then(response => {
      dispatch({ type: FILTERS_CREATE_SUCCESS, filter: response.data });
      dispatch(showAlert('', 'Filter added'));
    }).catch(error => {
      dispatch({ type: FILTERS_CREATE_FAIL, error });
    });
  };
}


export function deleteFilter(id) {
  return (dispatch, getState) => {
    dispatch({ type: FILTERS_DELETE_REQUEST });
    return api(getState).delete('/api/v1/filters/'+id).then(response => {
      dispatch({ type: FILTERS_DELETE_SUCCESS, filter: response.data });
      dispatch(showAlert('', 'Filter deleted'));
    }).catch(error => {
      dispatch({ type: FILTERS_DELETE_FAIL, error });
    });
  };
}
