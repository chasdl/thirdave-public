import React from 'react';
import cookie from 'js-cookie';

export function login(token, user_id) {
  cookie.set('prayer_token', token, {expires: 10});
  window.location.href = '/pray';
}

export function logout() {
  cookie.remove('prayer_token');
  // to support logging out from all windows
  window.localStorage.setItem('logout', Date.now().toString());
  window.location.href = '/login';
}

export const withAuthSync = (Component) => {
  return class WithAuthSync extends React.Component {
    componentDidMount() {
      // Revisiting users could have an expired token, let's redirect them to /login
      if (cookie.get('prayer_token') === undefined || this.isJwtExpired(cookie.get('prayer_token'))) {
        cookie.remove('prayer_token');
        window.localStorage.setItem('logout', Date.now().toString());
        window.location.href = '/login';
      }
      window.addEventListener('storage', this.syncLogout);
    }

    componentWillUnmount() {
      window.removeEventListener('storage', this.syncLogout);
      window.localStorage.removeItem('logout');
    }

    syncLogout = event => {
      if (event.key === 'logout') {
        window.location.href = '/login';
      }
    };

    parseJwt = token => {
      let base64Url = token.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      return JSON.parse(window.atob(base64));
    };

    isJwtExpired = token => {
      if (token !== null && this.parseJwt(token)) {
        if (new Date(this.parseJwt(token).exp * 1000) > new Date()) {
          return false;
        }
      }
      return true;
    };

    render() {
      return <Component {...(this.props)} />;
    }
  };
};
