import api from '../api';

export const FETCH_ABOUT_PAGE_REQUEST = 'FETCH_ABOUT_PAGE_REQUEST';
export const FETCH_ABOUT_PAGE_SUCCESS = 'FETCH_ABOUT_PAGE_SUCCESS';
export const FETCH_ABOUT_PAGE_FAIL    = 'FETCH_ABOUT_PAGE_FAIL';

export function fetchAboutPage(slug = 'index') {
  return (dispatch, getState) => {
    dispatch({ type: FETCH_ABOUT_PAGE_REQUEST, slug });
    return api(getState).get(`/instance/about/${slug}.html`).then(response => {
      dispatch({ type: FETCH_ABOUT_PAGE_SUCCESS, slug, html: response.data });
      return response.data;
    }).catch(error => {
      dispatch({ type: FETCH_ABOUT_PAGE_FAIL, slug, error });
      throw error;
    });
  };
}
