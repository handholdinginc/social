import reducer from '../auth';
import { Map as ImmutableMap, List as ImmutableList } from 'immutable';
import * as actions from 'soapbox/actions/auth';
// import app from 'soapbox/__fixtures__/app.json';
import user from 'soapbox/__fixtures__/user.json';

describe('auth reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(ImmutableMap({
      app: ImmutableMap(),
      user: ImmutableMap(),
      tokens: ImmutableList(),
    }));
  });

  it('should handle AUTH_APP_CREATED', () => {
    const state = ImmutableMap({ });
    const auth = {
      auth: {
        app: {
          vapid_key: 'BHczIFh4Wn3Q_7wDgehaB8Ti3Uu8BoyOgXxkOVuEJRuEqxtd9TAno8K9ycz4myiQ1ruiyVfG6xT1JLeXtpxDzUs',
          token_type: 'Bearer',
          client_secret: 'HU6RGO4284Edr4zucuWmn8OFjcpVtMsoXJU0-8tpwRM',
          redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
          created_at: 1594050270,
          name: 'SoapboxFE_2020-07-06T15:43:31.989Z',
          client_id: 'Q0A2r_9ZcEORMenj9kuDRQc3UVL8ypQRoNJ6XQHWJU8',
          expires_in: 600,
          scope: 'read write follow push admin',
          refresh_token: 'aydRA4eragIhavCdAyg6QQnDJmiMbdc-oEBvHYcW_PQ',
          website: null,
          id: '113',
          access_token: 'pbXS8HkoWodrAt_QE1NENcwqigxgWr3P1RIQCKMN0Os',
        },
        user: {
          access_token: 'UVBP2e17b4pTpb_h8fImIm3F5a66IBVb-JkyZHs4gLE',
          expires_in: 600,
          me: 'https://social.teci.world/users/curtis',
          refresh_token: 'c2DpbVxYZBJDogNn-VBNFES72yXPNUYQCv0CrXGOplY',
          scope: 'read write follow push admin',
          token_type: 'Bearer',
        },
        tokens: [],
      },
    };
    const action = {
      type: actions.AUTH_APP_CREATED,
      app: auth,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      app: auth,
    });
  });

  // Fails with TypeError: cannot read property merge of undefined
  // it('should handle the Action AUTH_APP_AUTHORIZED', () => {
  //   const state = ImmutableMap({
  //     auth: {
  //       app: {
  //         vapid_key: 'oldVapidKey',
  //         token_type: 'Bearer',
  //         client_secret: 'oldClientSecret',
  //         redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
  //         created_at: 1594764335,
  //         name: 'SoapboxFE_2020-07-14T22:05:17.054Z',
  //         client_id: 'bjiy8AxGKXXesfZcyp_iN-uQVE6Cnl03efWoSdOPh9M',
  //         expires_in: 600,
  //         scope: 'read write follow push admin',
  //         refresh_token: 'oldRefreshToken',
  //         website: null,
  //         id: '134',
  //         access_token: 'oldAccessToken',
  //       },
  //     },
  //   });
  //   const action = {
  //     type: actions.AUTH_APP_AUTHORIZED,
  //     app: app,
  //   };
  //   expect(reducer(state, action).toJS()).toMatchObject({
  //     app: app,
  //   });
  // });

  it('should handle the Action AUTH_LOGGED_IN', () => {
    const state = ImmutableMap({
      user: {
        access_token: 'UVBP2e17b4pTpb_h8fImIm3F5a66IBVb-JkyZHs4gLE',
        expires_in: 600,
        me: 'https://social.teci.world/users/curtis',
        refresh_token: 'c2DpbVxYZBJDogNn-VBNFES72yXPNUYQCv0CrXGOplY',
        scope: 'read write follow push admin',
        token_type: 'Bearer',
      },
    });
    const action = {
      type: actions.AUTH_LOGGED_IN,
      user: user,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      user: user,
    });
  });

  it('should handle the Action AUTH_LOGGED_OUT', () => {
    const state = ImmutableMap({
      user: {
        access_token: 'UVBP2e17b4pTpb_h8fImIm3F5a66IBVb-JkyZHs4gLE',
        expires_in: 600,
        me: 'https://social.teci.world/users/curtis',
        refresh_token: 'c2DpbVxYZBJDogNn-VBNFES72yXPNUYQCv0CrXGOplY',
        scope: 'read write follow push admin',
        token_type: 'Bearer',
      },
    });
    const action = {
      type: actions.AUTH_LOGGED_OUT,
    };
    expect(reducer(state, action).toJS()).toMatchObject({
      user: {},
    });
  });

});
